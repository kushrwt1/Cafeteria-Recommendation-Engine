import net from 'net';
import { AdminController } from '../../Controllers/adminController';
import { ChefController } from '../../Controllers/chefController';
import { EmployeeController } from '../../Controllers/employeeController';
import readline from 'readline';


export function showMenu(role: string, userId: number, client: net.Socket, rl:readline.Interface, logout: (userId: number) => void) {
    const roleBasedMenu = new RoleBasedMenu(client, rl, logout);
    switch (role) {
        case 'admin':
            roleBasedMenu.adminMenu(userId);
            break;
        case 'chef':
            roleBasedMenu.chefMenu(userId);
            break;
        case 'employee':
            roleBasedMenu.employeeMenu(userId);
            break;
        default:
            console.error('Unknown role');
            client.end();
    }
}

export class RoleBasedMenu {

    constructor(private client: net.Socket, private rl: readline.Interface, private logout: (userId: number) => void) {}

    private askQuestion(question: string): Promise<string> {
        return new Promise((resolve) => this.rl.question(question, resolve));
    }

    private async askAndValidate(question: any, validValues: any) {
        let answer;
        while (true) {
            answer = await this.askQuestion(question);
            if (validValues.includes(answer)) {
                break;
            } else {
                console.log(`Invalid value. Please choose from: ${validValues.join(', ')}`);
            }
        }
        return answer;
    }

    public async adminMenu(userId: number) {
        console.log('\n');
        console.log("Menu For Admin:");
        console.log("1. Add Menu Item");
        console.log("2. Update Menu Item");
        console.log("3. Delete Menu Item");
        console.log("4. View All Menu Items");
        console.log("5. View Discarded Menu Item List - (Should be done once a month)")
        console.log("6. Logout");

        const option = await this.askQuestion('Choose an option: ');

        try {
            switch (option) {
                case '1':
                    await this.addMenuItem(userId);
                    break;
                case '2':
                    this.updateMenuItem(userId);
                    break;
                case '3':
                    this.deleteMenuItem(userId);
                    break;
                case '4':
                    this.viewAllMenuItems(userId);
                    break;
                case '5':
                    this.viewDiscardedMenuItemsForAdmin(userId);
                    break;
                case '6':
                    this.logout(userId);
                    // this.client.end();
                    // this.rl.close();
                    break;
                default:
                    console.log("Invalid option");
                    this.adminMenu(userId);
                    break;
            }
        } catch (error) {
            console.error(`Admin menu error: ${error}`);
            this.adminMenu(userId);
        }
    }

    private async addMenuItem(userId: number) {
        const name = await this.askQuestion('Enter item name: ');
        const priceStr = await this.askQuestion('Enter item price: ');
        const price = parseFloat(priceStr);
        const availabilityStr = await this.askQuestion('Is the item available? (yes/no): ');
        const availability = availabilityStr.toLowerCase() === 'yes';
        const mealTypeIdStr = await this.askQuestion('Enter Meal Type Id(1 for breakfast, 2 For lunch, 3 for dinner) : ');
        const mealTypeId = parseInt(mealTypeIdStr);

        const dietaryType = await this.askAndValidate.call(this, 'Enter Dietary Type of this food item (Vegetarian/Non Vegetarian/Eggetarian): ', ['Vegetarian', 'Non Vegetarian', 'Eggetarian']);
        const spiceLevel = await this.askAndValidate.call(this, 'Enter Spice Level of this food item (High/Medium/Low): ', ['High', 'Medium', 'Low']);
        const cuisineType = await this.askAndValidate.call(this, 'Enter Cuisine Type of this food item (North Indian/South Indian/Other): ', ['North Indian', 'South Indian', 'Other']);
        const isSweetStr = await this.askQuestion('Is the item is sweet? (yes/no): ');
        const isSweet = isSweetStr.toLowerCase() === 'yes';

        const command = `admin_addMenuItem;${name};${price};${availability};${mealTypeId};${dietaryType};${spiceLevel};${cuisineType};${isSweet}`;
        this.client.write(command);
        console.log("\nMenu Item added to Database successfully");

        this.client.write(`LogUserActivity;${userId};'Added Menu Item with name: ${name}'`);
        this.adminMenu(userId);
    }

    private async updateMenuItem(userId: number) {
        const menuItemIdStr = await this.askQuestion('Enter Menu item ID: ');
        const menuItemId = parseInt(menuItemIdStr);
        const name = await this.askQuestion('Enter new name of this item: ');
        const priceStr = await this.askQuestion('Enter new price of this item: ');
        const price = parseFloat(priceStr);
        const availabilityStr = await this.askQuestion('Is the item available? (yes/no): ');
        const availability = availabilityStr.toLowerCase() === 'yes';
        const mealTypeIdStr = await this.askQuestion('Enter Meal Type Id(1 for breakfast, 2 For lunch, 3 for dinner) : ');
        const mealTypeId = parseInt(mealTypeIdStr);

        const dietaryType = await this.askAndValidate.call(this, 'Enter Dietary Type of this food item (Vegetarian/Non Vegetarian/Eggetarian): ', ['Vegetarian', 'Non Vegetarian', 'Eggetarian']);
        const spiceLevel = await this.askAndValidate.call(this, 'Enter Spice Level of this food item (High/Medium/Low): ', ['High', 'Medium', 'Low']);
        const cuisineType = await this.askAndValidate.call(this, 'Enter Cuisine Type of this food item (North Indian/South Indian/Other): ', ['North Indian', 'South Indian', 'Other']);
        const isSweetStr = await this.askQuestion('Is the item is sweet? (Yes/No): ');
        const isSweet = isSweetStr.toLowerCase() === 'yes';

        const command = `admin_updateMenuItem;${menuItemId};${name};${price};${availability};${mealTypeId};${dietaryType};${spiceLevel};${cuisineType};${isSweet}`;
        this.client.write(command);
        console.log("\nMenu Item updated in Database successfully");

        this.client.write(`LogUserActivity;${userId};'Updated Menu Item: with ID: ${menuItemId} and Name: ${name}'`);
        this.adminMenu(userId);
    }

    private async deleteMenuItem(userId: number) {
        const menuItemIdStr = await this.askQuestion('Enter item ID: ');
        const menuItemId = parseInt(menuItemIdStr);

        const command = `admin_deleteMenuItem;${menuItemId}`;
        this.client.write(command);
        console.log("\nMenu Item Deleted from Database successfully");

        this.client.write(`LogUserActivity;${userId};'Deleted Menu Item with ID: ${menuItemId}'`);
        this.adminMenu(userId);
    }

    private async viewAllMenuItems(userId: number) {
        const command = `admin_viewAllMenuItem`;
        this.client.write(command);
    }

    private async viewDiscardedMenuItemsForAdmin(userId: number) {
        const command = `admin_viewDiscardedMenuItems; `;
        this.client.write(command);
    }

    public async displayMenuForDiscardedItems(userId: number) {
        console.log("\nWhat would you like to do next?");
        console.log("1. Remove the Food Item from Menu List (Should be done once a month)");
        console.log("2.  Get Detailed Feedback (Should be done once a month)");
        const choice = await this.askQuestion('Enter your choice (1 or 2): ');
        this.handleChoice(choice, userId);
    }

    private async handleChoice(choice: string, userId: number) {
        if (choice === '1') {
            const menuItemIdStr = await this.askQuestion("\nEnter the menu item id to remove from menu: ");
            const menuItemId = parseInt(menuItemIdStr);
            await this.removeFoodItemFromMenu(menuItemId, userId);
        } else if (choice === '2') {
            const menuItemIdStr = await this.askQuestion("\nEnter the Menu item Id of which we want the detailed feedback: ");
            const menuItemId = parseInt(menuItemIdStr);
            await this.sendFeedbackNotification(menuItemId, userId);
        } else {
            console.log("Invalid choice. Please enter 1 or 2.");
            await this.displayMenuForDiscardedItems(userId);
        }
    }

        // Function to remove food item from menu
    private async removeFoodItemFromMenu(menuItemId: number, userId: number) {
        // console.log(`Removing ${itemName} from the menu...`);

        console.log(`Sending request to remove menu item ID ${menuItemId} from the menu...`);
        this.client.write(`admin_removeMenuItem;${menuItemId}`);
        console.log(`Menu Item with Menu Item Id: ${menuItemId} is removed successfully`);

        // Implement the logic to remove the food item from the menu
        // For example, call a repository function to remove the item from the database
        // await this.menuItemRepository.removeByName(itemName);

        // After removing, prompt for next action or exit
        this.client.write(`LogUserActivity;${userId};'Removed Discarded Menu Item with ID: ${menuItemId}'`);
        this.adminMenu(userId);
    }

    // Function to get detailed feedback
    private async sendFeedbackNotification(menuItemId: number, userId: number) {

        console.log(`Sending Feedback Notification to  all the Employees`);
        this.client.write(`admin_sendDiscardedItemFeedbackNotification;${menuItemId}`);
        console.log(`Notification to all Employees Sent Successfully`);

        this.client.write(`LogUserActivity;${userId};'Sent Notification about getting feedback for Discarded Menu Item with ID: ${menuItemId}'`);
        this.adminMenu(userId);
        // const name = await this.askQuestion('What didn’t you like about <Food Item> ');
        // const priceStr = await this.askQuestion('Enter item price: ');
        // const price = parseFloat(priceStr);
        // const availabilityStr = await this.askQuestion('Is the item available? (yes/no): ');
        // const availability = availabilityStr.toLowerCase() === 'yes';
        // const mealTypeIdStr = await this.askQuestion('Enter Meal Type Id(1 for breakfast, 2 For lunch, 3 for dinner) : ');
        // const mealTypeId = parseInt(mealTypeIdStr);

        // console.log(`Getting detailed feedback for ${itemName}...`);
        // Implement the logic to get detailed feedback for the food item
        // For example, prompt the user with specific questions about the food item
        // await this.feedbackRepository.collectFeedback(itemName);

        // After collecting feedback, prompt for next action or exit
    }
    










    public async chefMenu(userId: number) {
        console.log('\n');
        console.log("Menu For Chefs:");
        console.log("1. Get Recommended Items for Next day Menu");
        console.log("2. Roll out menu");
        console.log("3. Update Next day menu as per selected Items by User");
        console.log("4. View All Menu Items");
        console.log("5. View Discarded Menu Item List - (Should be done once a month)");
        console.log("6. Logout  ");

        const option = await this.askQuestion('Choose an option: ');

        try {
            switch (option) {
                case '1':
                    await this.getRecommendedItems();
                    break;
                case '2':
                    await this.rollOutMenu(userId);
                    break;
                case '3':
                    await this.updateFinalMenu();
                    // Here, chef will select the voted menu items and then choose the highly voted items and select the final menu 
                    // Add the functionality to generate monthly reports
                    break;
                case '4':
                    this.viewAllMenuItemsForChef();
                    break;
                case '5':
                    this.viewDiscardedMenuItemsForChef();
                    break;
                case '6':
                    // this.client.end();
                    // this.rl.close();
                    this.logout(userId);
                    break;
                default:
                    console.log("Invalid option");
                    this.chefMenu(userId);
                    break;
            }
        } catch (error) {
            console.error(`Chef menu error: ${error}`);
            this.chefMenu(userId);
        }
    }

    private async getRecommendedItems() {
        // const numberOfRecommendedItemsNeededStr = await this.askQuestion('Enter Number of Recommended Items you want in each category: ');
        // const numberOfRecommendedItemsNeeded = parseInt(numberOfRecommendedItemsNeededStr);
        const command = `chef_getRecommendedItems; `;
        this.client.write(command);
        // this.chefMenu();
    }

    private async rollOutMenu(userId: number) {
        console.log("Rolling out menu...");
        const mealTypes = ['breakfast', 'lunch', 'dinner'];
        const selectedItems: { mealType: string, menuItemId: number }[] = [];

        for (const mealType of mealTypes) {
            const itemIdsStr = await this.askQuestion(`Enter item IDs for ${mealType} (comma-separated): `);
            const itemIds = itemIdsStr.split(',').map(id => parseInt(id.trim()));
            itemIds.forEach(menuItemId => selectedItems.push({ mealType, menuItemId }));
        }

        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

        // for (const { mealType, menuItemId } of selectedItems) {
        //     const command = `chef_rollOutMenu;${today};${menuItemId}`;
        //     this.client.write(command);
        // }
        const command = `chef_rollOutMenu;${today};${JSON.stringify(selectedItems)}`;
        this.client.write(command);

        console.log("Menu rolled out.");

        this.client.write(`LogUserActivity;${userId};'Rolled Out Menu Items for Today To Employees'`);
        this.chefMenu(userId);
    }

    private async updateFinalMenu() {
    }

    private async viewAllMenuItemsForChef() {
        const command = `chef_viewAllMenuItem`;
        this.client.write(command);
    }

    private async viewDiscardedMenuItemsForChef() {
        const command = `chef_viewDiscardedMenuItems; `;
        this.client.write(command);
    }

    public async displayMenuForDiscardedItemsForChef(userId: number) {
        console.log("\nWhat would you like to do next?");
        console.log("1. Remove the Food Item from Menu List (Should be done once a month)");
        console.log("2.  Get Detailed Feedback (Should be done once a month)");
        const choice = await this.askQuestion('Enter your choice (1 or 2): ');
        this.handleChoiceForChef(choice, userId);
    }

    private async handleChoiceForChef(choice: string, userId: number) {
        if (choice === '1') {
            const menuItemIdStr = await this.askQuestion("\nEnter the menu item id to remove from menu: ");
            const menuItemId = parseInt(menuItemIdStr);
            await this.removeFoodItemFromMenuByChef(menuItemId, userId);
        } else if (choice === '2') {
            const menuItemIdStr = await this.askQuestion("\nEnter the Menu item Id of which the detailed feedback is needed: ");
            const menuItemId = parseInt(menuItemIdStr);
            await this.sendFeedbackNotificationFromChef(menuItemId, userId);
        } else {
            console.log("Invalid choice. Please enter 1 or 2.");
            await this.displayMenuForDiscardedItemsForChef(userId);
        }
    }

        // Function to remove food item from menu
    private async removeFoodItemFromMenuByChef(menuItemId: number, userId: number) {
        // console.log(`Removing ${itemName} from the menu...`);

        console.log(`Sending request to remove menu item ID ${menuItemId} from the menu...`);
        this.client.write(`chef_removeMenuItem;${menuItemId}`);
        console.log(`Menu Item with Menu Item Id: ${menuItemId} is removed successfully`);

        this.client.write(`LogUserActivity;${userId};'Removed Discarded Menu Item with ID: ${menuItemId}'`);
        this.chefMenu(userId);
        // Implement the logic to remove the food item from the menu
        // For example, call a repository function to remove the item from the database
        // await this.menuItemRepository.removeByName(itemName);

        // After removing, prompt for next action or exit
        
    }

    // Function to get detailed feedback
    private async sendFeedbackNotificationFromChef(menuItemId: number, userId: number) {

        console.log(`Sending Notification to  all the employees For Giving Detailed Feedback.....`);
        this.client.write(`chef_sendDiscardedItemFeedbackNotification;${menuItemId}`);
        console.log(`Notification to all Employees Sent Successfully`);

        this.client.write(`LogUserActivity;${userId};'Sent Notification about getting feedback for Discarded Menu Item with ID: ${menuItemId}'`);
        this.chefMenu(userId);
        // const name = await this.askQuestion('What didn’t you like about <Food Item> ');
        // const priceStr = await this.askQuestion('Enter item price: ');
        // const price = parseFloat(priceStr);
        // const availabilityStr = await this.askQuestion('Is the item available? (yes/no): ');
        // const availability = availabilityStr.toLowerCase() === 'yes';
        // const mealTypeIdStr = await this.askQuestion('Enter Meal Type Id(1 for breakfast, 2 For lunch, 3 for dinner) : ');
        // const mealTypeId = parseInt(mealTypeIdStr);

        // console.log(`Getting detailed feedback for ${itemName}...`);
        // Implement the logic to get detailed feedback for the food item
        // For example, prompt the user with specific questions about the food item
        // await this.feedbackRepository.collectFeedback(itemName);

        // After collecting feedback, prompt for next action or exit
    }

    public async employeeMenu(userId: number) {
        console.log('\n');
        console.log("Menu For Employee:");
        console.log("1. See Notifications");
        console.log("2. Select menu Items For Next day");
        console.log("3. View Today's menu");
        console.log("4. Give Feedback");
        console.log("5. View Menu Items");
        console.log("6. Update your Profile");
        console.log("7. Logout");

        const option = await this.askQuestion('Choose an option: ');

        try {
            switch (option) {
                case '1':
                    await this.viewNotificationsMenu(userId);
                    break;
                    break;
                case '2':
                    // this.rl.close();
                    break;
                case '3':
                    // this.rl.close();
                    break;
                case '4':
                    await this.giveFeedback(userId);
                    // this.rl.close();
                    break;
                case '5':
                    this.viewAllMenuItemsForEmployee(userId);
                    // this.rl.close();
                    break;
                case '6':
                    this.updateEmployeeProfile(userId);
                    break;
                case '7':
                    this.logout(userId);
                    break;
                default:
                    console.log("Invalid option");
                    // this.employeeMenu(userController, userId);
                    break;
            }
        } catch (error) {
            console.error(`Employee menu error: ${error}`);
            this.employeeMenu(userId);
        }
    }

    private async giveFeedback(userId: number) {
        const menuItemIdStr = await this.askQuestion('Enter menu item ID: ');
        const menuItemId = parseInt(menuItemIdStr);
        const ratingStr = await this.askQuestion('Enter rating (1-5): ');
        const rating = parseInt(ratingStr);
        const comment = await this.askQuestion('Enter comment: ');

        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        const command = `employee_giveFeedback;${userId};${menuItemId};${rating};${comment};${today}`;
        this.client.write(command);

        console.log("Feedback submitted.");

        this.client.write(`LogUserActivity;${userId};'Employee submitted feedback for menu Item with ID: ${menuItemId}'`);
        this.employeeMenu(userId);
    }

    // private async viewNotificationsMenu(userId: number) {
    //     console.log('\n');
    //     console.log("Notification Menu:");
    //     console.log("1. See Rolled Out Menu");
    //     console.log("2. Vote for Today's Menu");
    //     console.log("3. Exit");

    //     const option = await this.askQuestion('Choose an option: ');

    //     try {
    //         switch (option) {
    //             case '1':
    //                 await this.viewRolledOutMenuNotification(userId);
    //                 break;
    //             case '2':
    //                 // await this.voteForTodaysMenu(userId);
    //                 break;
    //             case '3':
    //                 await this.employeeMenu(userId);
    //                 break;
    //             default:
    //                 console.log("Invalid option");
    //                 this.viewNotificationsMenu(userId);
    //                 break;
    //         }
    //     } catch (error) {
    //         console.error(`Notification menu error: ${error}`);
    //         this.viewNotificationsMenu(userId);
    //     }
    // }

    // private async viewNotifications(userId: number) {
    //     try {
    //         const notifications = await this.notificationRepository.getNotificationsByUserId(userId);
    //         if (notifications.length === 0) {
    //             console.log("No notifications.");
    //         } else {
    //             console.log("Notifications:");
    //             notifications.forEach((notification, index) => {
    //                 console.log(`${index + 1}. ${notification.message} (Date: ${notification.date})`);
    //             });
    //         }
    //     } catch (error) {
    //         console.error(`Error viewing notifications: ${error}`);
    //     }
    //     this.employeeMenu(userId);
    // }

    private async viewNotificationsMenu(userId: number) {
        console.log('\n');
        console.log("Fetching notifications...");

        // Send request to server to get notifications
        this.client.write(`employee_viewNotifications;${userId}`);
    }

    public async handleNotificationsResponseFromServer(notifications: any, userId: number) {
        
            // const notifications = JSON.parse(data.toString());
            
            if (notifications.length === 0) {
                console.log("You don't have any notifications.");
                this.employeeMenu(userId);
                return;
            }

            console.log("\nNotification Menu:");
            notifications.forEach((notification: any, index: number) => {
                console.log(`${index + 1}. ${notification.message}`);
            });
            // console.log(`${notifications.length + 1}. Back`);

            const optionStr = await this.askQuestion('\nChoose a Notification to view: ');
            const selectedNotification = notifications[parseInt(optionStr) - 1];

            if (selectedNotification.message === 'See Rolled Out Menu and Vote For an Item') {
                this.client.write(`employee_viewRolledOutMenu;${selectedNotification.id};${userId}`);
            } else if (selectedNotification.message.includes('Give Detailed Feedback On Discarded Menu Item')) {
                const commandParts = selectedNotification.message.split(':');
                const argumentParts = commandParts[1].split('>');
                const menuItemId = parseInt(argumentParts[0].trim());
                const menuItemName = argumentParts[1].trim();
                this.getDetailedFeedback(userId, selectedNotification.id, menuItemId, menuItemName);
            } else {
                console.log("Unknown notification type.");
                this.employeeMenu(userId);
            }

            // if (option >= 1 && option <= notifications.length) {
            //     const selectedNotification = notifications[option - 1];
            //     await this.client.write(`employee_markNotificationAsSeen;${selectedNotification.id}`);
            //     if (selectedNotification.message.includes('New menu rolled out')) {
            //         await this.viewRolledOutMenuNotification(userId, selectedNotification.id);
            //     } else if (selectedNotification.message.includes('Please vote for your preferred items')) {
            //         await this.voteForTodaysMenu(userId, selectedNotification.id);
            //     }
            // } else if (option === notifications.length + 1) {
            //     this.employeeMenu(userId);
            // } else {
            //     console.log("Invalid option");
            //     this.viewNotificationsMenu(userId);
            // }
    }
    public async viewRolledOutMenuNotification(rolledOutMenu:any[], userId: number, notificationId: number, isEmployeeProfileExists: string) {
        try {
            
            // console.log(`Fetching rolled-out menu for user ${userId}...`);
            // console.log("Rolled out menu items: ..."); // Replace with actual rolled-out menu fetching logic
            // rolledOutMenu.forEach((item: { menu_item_id: any; date: any; name: any; meal_type_id: any}) => {
            //     console.log(`ID: ${item.menu_item_id}, NAME: ${item.name}, Date: ${item.date}`);
            // });
            if(isEmployeeProfileExists === "Yes") {
                    console.log("\nYour Employee Profile Exists.");
                    console.log("Showing rolled Out Menu according to Your profile Preferences.....");
                } else {
                    console.log("\nYour Employee Profile Does Not Exists.");
                }


            console.log(`\nFetching rolled-out menu for user ${userId}...`);
            // Group menu items by meal_type_id
            const groupedMenu: { [key: number]: { mealType: string, items: any[] } } = {
                1: { mealType: 'Breakfast', items: [] },
                2: { mealType: 'Lunch', items: [] },
                3: { mealType: 'Dinner', items: [] }
            };

            rolledOutMenu.forEach(item => {
                const mealType = groupedMenu[item.meal_type_id];
                if (mealType) {
                    mealType.items.push(item);
                }
            });
            
            // Display the grouped menu items
            console.log('=========================================================================================');
            console.log("Rolled out menu items: ...");
            Object.values(groupedMenu).forEach(meal => {
                console.log(`\n${meal.mealType}:`);
                meal.items.forEach(item => {
                    // console.log(`ID: ${item.menu_item_id}, Name: ${item.name}, Date: ${item.date}`);
                    console.log(`ID: ${item.menu_item_id}, Name: ${item.name}`);
                });
            });
            console.log('=========================================================================================');

            await this.voteForTodaysMenu(userId, notificationId, rolledOutMenu);

            // Delete notification after viewing
            // this.client.write(`employee_deleteNotification;${notificationId}`);
        } catch (error) {
            console.error(`Error viewing rolled-out menu notification: ${error}`);
        }
    }

    private async voteForTodaysMenu(userId: number, notificationId: number, rolledOutMenu: any[]) {
        try {

            console.log(`\nVote For Today's Menu:`);

            // Group menu items by meal_type_id
            const groupedMenu: { [key: number]: number[] } = {
                1: [],
                2: [],
                3: []
            };

            rolledOutMenu.forEach(item => {
                if (groupedMenu[item.meal_type_id]) {
                    groupedMenu[item.meal_type_id].push(item.menu_item_id);
                }
            });
            
            // Prompt user for item IDs for each meal type
            // Prompt user for item IDs for each meal type and validate
            const breakfastItemId = await this.getValidItemId('Enter item ID you want to vote for breakfast: ', groupedMenu[1]);
            const lunchItemId = await this.getValidItemId('Enter item ID you want to vote for lunch: ', groupedMenu[2]);
            const dinnerItemId = await this.getValidItemId('Enter item ID you want to vote for dinner: ', groupedMenu[3]);


            // const breakfastItemIdStr = await this.askQuestion('Enter item ID you want to vote for breakfast: ');
            // const breakfastItemId = parseInt(breakfastItemIdStr.trim());
    
            // const lunchItemIdStr = await this.askQuestion('Enter item ID you want to vote for lunch: ');
            // const lunchItemId = parseInt(lunchItemIdStr.trim());
    
            // const dinnerItemIdStr = await this.askQuestion('Enter item ID you want to vote for dinner: ');
            // const dinnerItemId = parseInt(dinnerItemIdStr.trim());
    
            console.log("Votes submitted for items - Breakfast:", breakfastItemId, ", Lunch:", lunchItemId, ", Dinner:", dinnerItemId);
    
            // Send votes to the server
            this.client.write(`employee_markNotificationAsSeen_updateVotedItem;${notificationId};${breakfastItemId};${lunchItemId};${dinnerItemId};${userId}`);
            
            this.client.write(`LogUserActivity;${userId};'Viewed rolled Out Menu and Voted for Today's menu'`);
            // Return to the employee menu
            this.employeeMenu(userId);
        } catch (error) {
            console.error(`Error voting for today's menu: ${error}`);
        }
    }
    
    private async getValidItemId(prompt: string, validItemIds: number[]): Promise<number> {
        while (true) {
            const itemIdStr = await this.askQuestion(prompt);
            const itemId = parseInt(itemIdStr.trim());
    
            if (validItemIds.includes(itemId)) {
                return itemId;
            } else {
                console.log('Invalid item ID. Please enter a valid item ID.');
            }
        }
    }

    private async viewAllMenuItemsForEmployee(userId: number) {
        const command = `employee_viewAllMenuItem`;
        // this.client.write(command);
        this.client.write(`employee_viewAllMenuItem;${userId}`);
    }

    private async getDetailedFeedback(userId: number, notificationId: number, menuItemId: number, menuItemName: string) {
        try {
            console.log(`\nWe are trying to improve your experience on Food Item: ${menuItemName} with ID: ${menuItemId}. Please provide your feedback and help us`);
            const dislikes = await this.askQuestion(`What didn’t you like about ${menuItemName}: `);
            const desiredTaste = await this.askQuestion(`How would you like ${menuItemName} to taste: `);
            const momRecipe = await this.askQuestion(`Share your mom’s recipe: `);
            const command = `employee_markNotificationAsSeen_sendDiscardedItemFeedbackToServer;${userId};${notificationId};${dislikes};${desiredTaste};${momRecipe};${menuItemId}`;
            console.log("Feedback is submitted successfully. Thanks For giving your feedback");
            this.client.write(command);

            this.client.write(`LogUserActivity;${userId};'Feedback about Discarded Item with ID: ${menuItemId} is submitted.'`);
            this.employeeMenu(userId);
        } catch(error) {
            console.error(`Error in sending Feedback Request to Server: ${error}`);
        }
    }

    private async updateEmployeeProfile(userId: number) {
        try {
            console.log('\nPlease answer these questions to know about your preferences: ');
            const dietaryPreference = await this.askAndValidate.call(this, '1) Please select one (Vegetarian, Non Vegetarian, Eggetarian): ', ['Vegetarian', 'Non Vegetarian', 'Eggetarian']);
            const spiceLevel = await this.askAndValidate.call(this, '2) Please select your spice level (High, Medium, Low): ', ['High', 'Medium', 'Low']);
            const cuisinePreference = await this.askAndValidate.call(this, '3) What do you prefer most (North Indian, South Indian, Other): ', ['North Indian', 'South Indian', 'Other']);
            const sweetToothAnswer = await this.askAndValidate.call(this, '4) Do you have a sweet tooth (Yes, No): ', ['Yes', 'No']);
            const sweetTooth = sweetToothAnswer === 'Yes';

            console.log('Your preferences have been recorded.');
            
            const command = `employee_updateEmployeeProfile;${userId};${dietaryPreference};${spiceLevel};${cuisinePreference};${sweetTooth}`;
            this.client.write(command);
            console.log("Employee Profile Updated Successfully");

            this.client.write(`LogUserActivity;${userId};'Employee Profile is updated'`);
            this.employeeMenu(userId);

        } catch(error) {
            console.error(`Error in sending Update Employee Profile Request to Server: ${error}`);
        }
        
    }

}
