"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleBasedMenu = exports.showMenu = void 0;
function showMenu(role, userId, client, rl, logout) {
    const roleBasedMenu = new RoleBasedMenu(client, rl, logout);
    switch (role) {
        case 'admin':
            roleBasedMenu.adminMenu();
            break;
        case 'chef':
            roleBasedMenu.chefMenu();
            break;
        case 'employee':
            roleBasedMenu.employeeMenu(userId);
            break;
        default:
            console.error('Unknown role');
            client.end();
    }
}
exports.showMenu = showMenu;
class RoleBasedMenu {
    constructor(client, rl, logout) {
        this.client = client;
        this.rl = rl;
        this.logout = logout;
    }
    askQuestion(question) {
        return new Promise((resolve) => this.rl.question(question, resolve));
    }
    adminMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('\n');
            console.log("Menu For Admin:");
            console.log("1. Add Menu Item");
            console.log("2. Update Menu Item");
            console.log("3. Delete Menu Item");
            console.log("4. View All Menu Items");
            console.log("5. Logout");
            const option = yield this.askQuestion('Choose an option: ');
            try {
                switch (option) {
                    case '1':
                        yield this.addMenuItem();
                        break;
                    case '2':
                        this.updateMenuItem();
                        break;
                    case '3':
                        this.deleteMenuItem();
                        break;
                    case '4':
                        this.viewAllMenuItems();
                        break;
                    case '5':
                        this.logout();
                        // this.client.end();
                        // this.rl.close();
                        break;
                    default:
                        console.log("Invalid option");
                        this.adminMenu();
                        break;
                }
            }
            catch (error) {
                console.error(`Admin menu error: ${error}`);
                this.adminMenu();
            }
        });
    }
    addMenuItem() {
        return __awaiter(this, void 0, void 0, function* () {
            const name = yield this.askQuestion('Enter item name: ');
            const priceStr = yield this.askQuestion('Enter item price: ');
            const price = parseFloat(priceStr);
            const availabilityStr = yield this.askQuestion('Is the item available? (yes/no): ');
            const availability = availabilityStr.toLowerCase() === 'yes';
            const mealTypeIdStr = yield this.askQuestion('Enter Meal Type Id(1 for breakfast, 2 For lunch, 3 for dinner) : ');
            const mealTypeId = parseInt(mealTypeIdStr);
            const command = `admin_addMenuItem;${name};${price};${availability};${mealTypeId}`;
            this.client.write(command);
            this.adminMenu();
        });
    }
    updateMenuItem() {
        return __awaiter(this, void 0, void 0, function* () {
            const menuItemIdStr = yield this.askQuestion('Enter Menu item ID: ');
            const menuItemId = parseInt(menuItemIdStr);
            const name = yield this.askQuestion('Enter new name of this item: ');
            const priceStr = yield this.askQuestion('Enter new price of this item: ');
            const price = parseFloat(priceStr);
            const availabilityStr = yield this.askQuestion('Is the item available? (yes/no): ');
            const availability = availabilityStr.toLowerCase() === 'yes';
            const mealTypeIdStr = yield this.askQuestion('Enter Meal Type Id(1 for breakfast, 2 For lunch, 3 for dinner) : ');
            const mealTypeId = parseInt(mealTypeIdStr);
            const command = `admin_updateMenuItem;${menuItemId};${name};${price};${availability};${mealTypeId}`;
            this.client.write(command);
            this.adminMenu();
        });
    }
    deleteMenuItem() {
        return __awaiter(this, void 0, void 0, function* () {
            const menuItemIdStr = yield this.askQuestion('Enter item ID: ');
            const menuItemId = parseInt(menuItemIdStr);
            const command = `admin_deleteMenuItem;${menuItemId}`;
            this.client.write(command);
            this.adminMenu();
        });
    }
    viewAllMenuItems() {
        return __awaiter(this, void 0, void 0, function* () {
            const command = `admin_viewAllMenuItem`;
            this.client.write(command);
        });
    }
    chefMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('\n');
            console.log("Menu For Chefs:");
            console.log("1. Get Recommended Items for Next day Menu");
            console.log("2. Roll out menu");
            console.log("3. Update Next day menu as per selected Items by User");
            console.log("4. Generate Monthly Reports");
            console.log("5. View All Menu Items");
            console.log("6. Logout  ");
            const option = yield this.askQuestion('Choose an option: ');
            try {
                switch (option) {
                    case '1':
                        yield this.getRecommendedItems();
                        break;
                    case '2':
                        yield this.rollOutMenu();
                        break;
                    case '3':
                        yield this.updateFinalMenu();
                        break;
                    case '4':
                        // Here, chef will select the voted menu items and then choose the highly voted items and select the final menu 
                        // Add the functionality to generate monthly reports
                        break;
                    case '5':
                        this.viewAllMenuItemsForChef();
                        break;
                    case '6':
                        // this.client.end();
                        // this.rl.close();
                        this.logout();
                        break;
                    default:
                        console.log("Invalid option");
                        this.chefMenu();
                        break;
                }
            }
            catch (error) {
                console.error(`Chef menu error: ${error}`);
                this.chefMenu();
            }
        });
    }
    getRecommendedItems() {
        return __awaiter(this, void 0, void 0, function* () {
            const command = `chef_getRecommendedItems; `;
            this.client.write(command);
            // this.chefMenu();
        });
    }
    rollOutMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Rolling out menu...");
            const mealTypes = ['breakfast', 'lunch', 'dinner'];
            const selectedItems = [];
            for (const mealType of mealTypes) {
                const itemIdsStr = yield this.askQuestion(`Enter item IDs for ${mealType} (comma-separated): `);
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
            this.chefMenu();
        });
    }
    updateFinalMenu() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    viewAllMenuItemsForChef() {
        return __awaiter(this, void 0, void 0, function* () {
            const command = `chef_viewAllMenuItem`;
            this.client.write(command);
        });
    }
    employeeMenu(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('\n');
            console.log("Menu For Employee:");
            console.log("1. See Notifications");
            console.log("2. Select menu Items For Next day");
            console.log("3. View Today's menu");
            console.log("4. Give Feedback");
            console.log("5. View Menu Items");
            console.log("6. Logout");
            const option = yield this.askQuestion('Choose an option: ');
            try {
                switch (option) {
                    case '1':
                        yield this.viewNotificationsMenu(userId);
                        break;
                        break;
                    case '2':
                        // this.rl.close();
                        break;
                    case '3':
                        // this.rl.close();
                        break;
                    case '4':
                        yield this.giveFeedback(userId);
                        // this.rl.close();
                        break;
                    case '5':
                        this.viewAllMenuItemsForEmployee(userId);
                        // this.rl.close();
                        break;
                    case '6':
                        this.logout();
                        break;
                    default:
                        console.log("Invalid option");
                        // this.employeeMenu(userController, userId);
                        break;
                }
            }
            catch (error) {
                console.error(`Employee menu error: ${error}`);
                this.employeeMenu(userId);
            }
        });
    }
    giveFeedback(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const menuItemIdStr = yield this.askQuestion('Enter menu item ID: ');
            const menuItemId = parseInt(menuItemIdStr);
            const ratingStr = yield this.askQuestion('Enter rating (1-5): ');
            const rating = parseInt(ratingStr);
            const comment = yield this.askQuestion('Enter comment: ');
            const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
            const command = `employee_giveFeedback;${userId};${menuItemId};${rating};${comment};${today}`;
            this.client.write(command);
            console.log("Feedback submitted.");
            this.employeeMenu(userId);
        });
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
    viewNotificationsMenu(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('\n');
            console.log("Fetching notifications...");
            // Send request to server to get notifications
            this.client.write(`employee_viewNotifications;${userId}`);
        });
    }
    handleNotificationsResponseFromServer(notifications, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // const notifications = JSON.parse(data.toString());
            if (notifications.length === 0) {
                console.log("You don't have any notifications.");
                this.employeeMenu(userId);
                return;
            }
            console.log("Notification Menu:");
            notifications.forEach((notification, index) => {
                console.log(`${index + 1}. ${notification.message}`);
            });
            // console.log(`${notifications.length + 1}. Back`);
            const optionStr = yield this.askQuestion('Choose a Notification to view: ');
            const selectedNotification = notifications[parseInt(optionStr) - 1];
            if (selectedNotification.message === 'See Rolled Out Menu and Vote For an Item') {
                this.client.write(`employee_viewRolledOutMenu;${selectedNotification.id};${userId}`);
            }
            else {
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
        });
    }
    viewRolledOutMenuNotification(rolledOutMenu, userId, notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`Fetching rolled-out menu for user ${userId}...`);
                console.log("Rolled out menu items: ..."); // Replace with actual rolled-out menu fetching logic
                rolledOutMenu.forEach((item) => {
                    console.log(`ID: ${item.menu_item_id}, Date: ${item.date}`);
                });
                yield this.voteForTodaysMenu(userId, notificationId);
                // Delete notification after viewing
                // this.client.write(`employee_deleteNotification;${notificationId}`);
            }
            catch (error) {
                console.error(`Error viewing rolled-out menu notification: ${error}`);
            }
            // this.employeeMenu(userId);
        });
    }
    voteForTodaysMenu(userId, notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`Vote For Today's menu:`);
                // Allow voting for today's menu
                // For now, we'll just simulate the voting process
                // const itemIdsStr = await this.askQuestion('Enter item IDs you want to vote for (comma-separated): ');
                const itemIdStr = yield this.askQuestion('Enter item ID you want to vote for: ');
                // const itemIds = itemIdsStr.split(',').map(id => parseInt(id.trim()));
                const itemId = parseInt(itemIdStr);
                console.log("Votes submitted for items: ", itemId);
                this.client.write(`employee_markNotificationAsSeen_updateVotedItem;${notificationId};${itemId};${userId}`);
                this.employeeMenu(userId);
            }
            catch (error) {
                console.error(`Error voting for today's menu: ${error}`);
            }
        });
    }
    viewAllMenuItemsForEmployee(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const command = `employee_viewAllMenuItem`;
            // this.client.write(command);
            this.client.write(`employee_viewAllMenuItem;${userId}`);
        });
    }
}
exports.RoleBasedMenu = RoleBasedMenu;
