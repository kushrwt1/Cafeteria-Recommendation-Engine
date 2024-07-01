// import net from 'net';
// import readline from 'readline';
// import { RoleBasedMenu, showMenu } from '../Features/RoleBasedMenus/roleBasedMenu';
// import { AdminController } from '../Controllers/adminController';
// import { ChefController } from '../Controllers/chefController';
// import { UserController } from '../Controllers/employeeController';


// const client = net.createConnection({ port: 3000 }, () => {
//     console.log('Connected to server');
//     login();
// });

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//     prompt: 'COMMAND> '
// });

// const roleBasedMenu = new RoleBasedMenu(client, rl);

// client.on('data', (data) => {
//     const message = data.toString().trim();

//     if (message.includes('LOGIN_SUCCESS')) {
//         const [_, role, userIdStr] = message.split(' ');
//         const userId = parseInt(userIdStr, 10);
//         showMenu(role, userId, client, rl);
//     } else if (message.includes('Response_viewAllMenuItems')) {
//         const [command, menuItemsStr] = message.split(';');
//         const menuItems = JSON.parse(menuItemsStr);
//         console.log(menuItems);
//         roleBasedMenu.adminMenu();
//     } else if (message.includes('Response_getRecommendedItems')) {
//         const [command, recommendedItemsStr] = message.split(';');
//         const recommendedItems = JSON.parse(recommendedItemsStr);
//         console.log('Recommended Items for Next Day Menu:');
//         // console.log(recommendedItems);
//         recommendedItems.forEach((item: { menu_item_id: any; name: any; averageRating: number; }) => {
//             console.log(`ID: ${item.menu_item_id}, Name: ${item.name}, Average Rating: ${item.averageRating.toFixed(2)}`);
//         });
//         roleBasedMenu.chefMenu();
//     } else if (message.includes('Response_Chef_viewAllMenuItems')) {
//         const [command, menuItemsStr] = message.split(';');
//         const menuItems = JSON.parse(menuItemsStr);
//         console.log(menuItems);
//         roleBasedMenu.chefMenu();
//     } else if (message.includes('ERROR')) {
//         console.error(message);
//         client.end();
//     } else {
//         rl.prompt();
//     }
// });

// client.on('end', () => {
//     console.log('Disconnected from server');
//     rl.close();
// });

// client.on('error', (err) => {
//     console.error(`Client error: ${err.message}`);
// });

// function askQuestion(question: string): Promise<string> {
//     return new Promise((resolve) => rl.question(question, resolve));
// }

// async function login() {
//     try {
//         const username = await askQuestion('Enter username: ');
//         const password = await askQuestion('Enter password: ');
//         client.write(`LOGIN;${username};${password}`);
//     } catch (error) {
//         console.error(`Login error: ${error}`);
//     }
// }

import net from 'net';
import readline from 'readline';
import { RoleBasedMenu, showMenu } from '../Features/RoleBasedMenus/roleBasedMenu';
import { DiscardedMenuItem } from '../Models/discardedMenuItem';

class Client {
    private client!: net.Socket;
    private rl!: readline.Interface;
    private roleBasedMenuObject!: RoleBasedMenu;

    constructor() {
       this.connectToServer();
    }

    private connectToServer() {
        this.client = net.createConnection({ port: 3000 }, () => {
            console.log('Connected to server');
            this.login();
        });

        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: 'COMMAND> '
        });

        this.roleBasedMenuObject = new RoleBasedMenu(this.client, this.rl, this.logout.bind(this));

        this.setupClient();
    }

    private setupClient() {
        this.client.on('data', (data) => {
            const message = data.toString().trim();

            if (message.includes('LOGIN_SUCCESS')) {
                const [_, role, userIdStr] = message.split(' ');
                const userId = parseInt(userIdStr, 10);
                showMenu(role, userId, this.client, this.rl, this.logout.bind(this));
            } else if (message.includes('Response_viewAllMenuItems')) {
                const [command, menuItemsStr] = message.split(';');
                const menuItems = JSON.parse(menuItemsStr);
                console.table(menuItems);
                this.roleBasedMenuObject.adminMenu();
            } else if (message.includes('Response_getRecommendedItems')) {
                const [command, recommendedItemsStr] = message.split(';');
                const recommendedItems = JSON.parse(recommendedItemsStr);
                // recommendedItems.forEach((item: { menu_item_id: any; name: any; meal_type_id: any; compositeScore: number; }) => {
                //     console.log(`ID: ${item.menu_item_id}, Name: ${item.name}, Average Rating: ${item.compositeScore.toFixed(2)}`);
                // });

                console.log('Recommended Items for Next Day Menu:');
                console.log('=========================================================================================');
                const recommendedItemsByMealType: { [key: number]: MealTypeItems } = {
                    1: { mealType: 'Breakfast', items: [] },
                    2: { mealType: 'Lunch', items: [] },
                    3: { mealType: 'Dinner', items: [] }
                };
                // Categorize items by meal_type_id
                recommendedItems.forEach((item: { menu_item_id: number; name: string; meal_type_id: number; compositeScore: number }) => {
                    if (recommendedItemsByMealType[item.meal_type_id]) {
                        recommendedItemsByMealType[item.meal_type_id].items.push(item);
                    }
                });
                // console.table(recommendedItems);
                // Print categorized items
                Object.values(recommendedItemsByMealType).forEach(meal => {
                    if (meal.items.length > 0) {
                        console.log(`${meal.mealType}:`);
                        meal.items.forEach((item: { menu_item_id: number; name: string; compositeScore: number }) => {
                            console.log(`  ID: ${item.menu_item_id}, Name: ${item.name}, Average Rating: ${item.compositeScore.toFixed(2)}`);
                        });
                    }
                });
                console.log('=========================================================================================');
                this.roleBasedMenuObject.chefMenu();

            } else if (message.includes('Response_Chef_viewAllMenuItems')) {
                const [command, menuItemsStr] = message.split(';');
                const menuItems = JSON.parse(menuItemsStr);
                console.table(menuItems);
                this.roleBasedMenuObject.chefMenu();


            }else if (message.includes('Response_employee_viewAllMenuItems')) {
                const [command, menuItemsStr, userIdStr] = message.split(';');
                const menuItems = JSON.parse(menuItemsStr);
                const userId = parseInt(userIdStr);
                console.table(menuItems);
                this.roleBasedMenuObject.employeeMenu(userId);

            }else if (message.includes('Response_viewNotifications')) {
                const [command, notificationsStr, userIdStr] = message.split(';');
                const notifications = JSON.parse(notificationsStr);
                
                const userId = parseInt(userIdStr);
                this.roleBasedMenuObject.handleNotificationsResponseFromServer(notifications, userId);
                // console.log(menuItems);
                // this.roleBasedMenuObject.chefMenu();
                // this.roleBasedMenuObject.employeeMenu(userId);
            } else if (message.includes('Response_rolledOutMenu')) {
                const [command, rolledOutMenuStr, userIdStr, notificationIdStr] = message.split(';');
                const rolledOutMenu = JSON.parse(rolledOutMenuStr);
                const userId = parseInt(userIdStr);
                const notificationId = parseInt(notificationIdStr);
                this.roleBasedMenuObject.viewRolledOutMenuNotification(rolledOutMenu, userId, notificationId);
                // console.log(menuItems);
                // this.roleBasedMenuObject.chefMenu();
                // this.roleBasedMenuObject.employeeMenu(userId);
            } else if (message.includes('Response_admin_viewDiscardedMenuItems')) {
                const [command, discardedMenuItemsStr] = message.split(';');
                const discardedMenuItems: DiscardedMenuItem[] = JSON.parse(discardedMenuItemsStr);
                // console.table(discardedMenuItems);
                console.log("\nDiscarded Menu Items Are:");
                console.log('=========================================================================================');
                if (discardedMenuItems.length === 0) {
                    console.log("No discarded menu items.");
                } else {
                console.log('ID\tMenu Item ID\tDiscarded Date\tName');
                // Print each item
                discardedMenuItems.forEach(item => {
                    console.log(`${item.id}\t${item.menu_item_id}\t\t${formatDate(item.discarded_date)}\t${item.name}`);
                });
                }
                console.log('=========================================================================================');
                function formatDate(dateString: any) {
                    const date = new Date(dateString);
                    return date.toISOString().split('T')[0];
                }
                this.roleBasedMenuObject.displayMenuForDiscardedItems();
                
            }
            else if (message.includes('Response_chef_viewDiscardedMenuItems')) {
                const [command, discardedMenuItemsStr] = message.split(';');
                const discardedMenuItems: DiscardedMenuItem[] = JSON.parse(discardedMenuItemsStr);
                console.log("\nDiscarded Menu Items Are:");
                console.log('=========================================================================================');
                if (discardedMenuItems.length === 0) {
                    console.log("No discarded menu items.");
                } else {
                console.log('ID\tMenu Item ID\tDiscarded Date\tName');
                // Print each item
                discardedMenuItems.forEach(item => {
                    console.log(`${item.id}\t${item.menu_item_id}\t\t${formatDate(item.discarded_date)}\t${item.name}`);
                });
                }
                console.log('=========================================================================================');
                function formatDate(dateString: any) {
                    const date = new Date(dateString);
                    return date.toISOString().split('T')[0];
                }
                this.roleBasedMenuObject.displayMenuForDiscardedItemsForChef();
            }
            else if (message.includes('ERROR')) {
                console.error(message);
                this.client.end();
            } else {
                this.rl.prompt();
            }
        });

        this.client.on('end', () => {
            console.log('Disconnected from server');
            this.rl.close();
        });

        this.client.on('error', (err) => {
            console.error(`Client error: ${err.message}`);
        });
    }

    private askQuestion(question: string): Promise<string> {
        return new Promise((resolve) => this.rl.question(question, resolve));
    }

    private async login() {
        try {
            const username = await this.askQuestion('Enter username: ');
            const password = await this.askQuestion('Enter password: ');
            this.client.write(`LOGIN;${username};${password}`);
        } catch (error) {
            console.error(`Login error: ${error}`);
        }
    }

    private logout() {
        this.client.end();
        this.rl.close();
        console.log('Logged out. Please wait while reconnecting...');
        setTimeout(() => {
            this.connectToServer();
        }, 1000);
    }
}


const clientObject = new Client();
