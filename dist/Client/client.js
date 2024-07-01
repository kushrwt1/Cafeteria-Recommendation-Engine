"use strict";
// import net from 'net';
// import readline from 'readline';
// import { RoleBasedMenu, showMenu } from '../Features/RoleBasedMenus/roleBasedMenu';
// import { AdminController } from '../Controllers/adminController';
// import { ChefController } from '../Controllers/chefController';
// import { UserController } from '../Controllers/employeeController';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const net_1 = __importDefault(require("net"));
const readline_1 = __importDefault(require("readline"));
const roleBasedMenu_1 = require("../Features/RoleBasedMenus/roleBasedMenu");
class Client {
    constructor() {
        this.connectToServer();
    }
    connectToServer() {
        this.client = net_1.default.createConnection({ port: 3000 }, () => {
            console.log('Connected to server');
            this.login();
        });
        this.rl = readline_1.default.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: 'COMMAND> '
        });
        this.roleBasedMenuObject = new roleBasedMenu_1.RoleBasedMenu(this.client, this.rl, this.logout.bind(this));
        this.setupClient();
    }
    setupClient() {
        this.client.on('data', (data) => {
            const message = data.toString().trim();
            if (message.includes('LOGIN_SUCCESS')) {
                const [_, role, userIdStr] = message.split(' ');
                const userId = parseInt(userIdStr, 10);
                (0, roleBasedMenu_1.showMenu)(role, userId, this.client, this.rl, this.logout.bind(this));
            }
            else if (message.includes('Response_viewAllMenuItems')) {
                const [command, menuItemsStr] = message.split(';');
                const menuItems = JSON.parse(menuItemsStr);
                console.table(menuItems);
                this.roleBasedMenuObject.adminMenu();
            }
            else if (message.includes('Response_getRecommendedItems')) {
                const [command, recommendedItemsStr] = message.split(';');
                const recommendedItems = JSON.parse(recommendedItemsStr);
                // recommendedItems.forEach((item: { menu_item_id: any; name: any; meal_type_id: any; compositeScore: number; }) => {
                //     console.log(`ID: ${item.menu_item_id}, Name: ${item.name}, Average Rating: ${item.compositeScore.toFixed(2)}`);
                // });
                console.log('Recommended Items for Next Day Menu:');
                console.log('=========================================================================================');
                const recommendedItemsByMealType = {
                    1: { mealType: 'Breakfast', items: [] },
                    2: { mealType: 'Lunch', items: [] },
                    3: { mealType: 'Dinner', items: [] }
                };
                // Categorize items by meal_type_id
                recommendedItems.forEach((item) => {
                    if (recommendedItemsByMealType[item.meal_type_id]) {
                        recommendedItemsByMealType[item.meal_type_id].items.push(item);
                    }
                });
                // console.table(recommendedItems);
                // Print categorized items
                Object.values(recommendedItemsByMealType).forEach(meal => {
                    if (meal.items.length > 0) {
                        console.log(`${meal.mealType}:`);
                        meal.items.forEach((item) => {
                            console.log(`  ID: ${item.menu_item_id}, Name: ${item.name}, Average Rating: ${item.compositeScore.toFixed(2)}`);
                        });
                    }
                });
                console.log('=========================================================================================');
                this.roleBasedMenuObject.chefMenu();
            }
            else if (message.includes('Response_Chef_viewAllMenuItems')) {
                const [command, menuItemsStr] = message.split(';');
                const menuItems = JSON.parse(menuItemsStr);
                console.table(menuItems);
                this.roleBasedMenuObject.chefMenu();
            }
            else if (message.includes('Response_employee_viewAllMenuItems')) {
                const [command, menuItemsStr, userIdStr] = message.split(';');
                const menuItems = JSON.parse(menuItemsStr);
                const userId = parseInt(userIdStr);
                console.table(menuItems);
                this.roleBasedMenuObject.employeeMenu(userId);
            }
            else if (message.includes('Response_viewNotifications')) {
                const [command, notificationsStr, userIdStr] = message.split(';');
                const notifications = JSON.parse(notificationsStr);
                const userId = parseInt(userIdStr);
                this.roleBasedMenuObject.handleNotificationsResponseFromServer(notifications, userId);
                // console.log(menuItems);
                // this.roleBasedMenuObject.chefMenu();
                // this.roleBasedMenuObject.employeeMenu(userId);
            }
            else if (message.includes('Response_rolledOutMenu')) {
                const [command, rolledOutMenuStr, userIdStr, notificationIdStr] = message.split(';');
                const rolledOutMenu = JSON.parse(rolledOutMenuStr);
                const userId = parseInt(userIdStr);
                const notificationId = parseInt(notificationIdStr);
                this.roleBasedMenuObject.viewRolledOutMenuNotification(rolledOutMenu, userId, notificationId);
                // console.log(menuItems);
                // this.roleBasedMenuObject.chefMenu();
                // this.roleBasedMenuObject.employeeMenu(userId);
            }
            else if (message.includes('Response_admin_viewDiscardedMenuItems')) {
                const [command, discardedMenuItemsStr] = message.split(';');
                const discardedMenuItems = JSON.parse(discardedMenuItemsStr);
                // console.table(discardedMenuItems);
                console.log("\nDiscarded Menu Items Are:");
                console.log('=========================================================================================');
                if (discardedMenuItems.length === 0) {
                    console.log("No discarded menu items.");
                }
                else {
                    console.log('ID\tMenu Item ID\tDiscarded Date\tName');
                    // Print each item
                    discardedMenuItems.forEach(item => {
                        console.log(`${item.id}\t${item.menu_item_id}\t\t${formatDate(item.discarded_date)}\t${item.name}`);
                    });
                }
                console.log('=========================================================================================');
                function formatDate(dateString) {
                    const date = new Date(dateString);
                    return date.toISOString().split('T')[0];
                }
                this.roleBasedMenuObject.displayMenuForDiscardedItems();
            }
            else if (message.includes('Response_chef_viewDiscardedMenuItems')) {
                const [command, discardedMenuItemsStr] = message.split(';');
                const discardedMenuItems = JSON.parse(discardedMenuItemsStr);
                console.log("\nDiscarded Menu Items Are:");
                console.log('=========================================================================================');
                if (discardedMenuItems.length === 0) {
                    console.log("No discarded menu items.");
                }
                else {
                    console.log('ID\tMenu Item ID\tDiscarded Date\tName');
                    // Print each item
                    discardedMenuItems.forEach(item => {
                        console.log(`${item.id}\t${item.menu_item_id}\t\t${formatDate(item.discarded_date)}\t${item.name}`);
                    });
                }
                console.log('=========================================================================================');
                function formatDate(dateString) {
                    const date = new Date(dateString);
                    return date.toISOString().split('T')[0];
                }
                this.roleBasedMenuObject.displayMenuForDiscardedItemsForChef();
            }
            else if (message.includes('ERROR')) {
                console.error(message);
                this.client.end();
            }
            else {
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
    askQuestion(question) {
        return new Promise((resolve) => this.rl.question(question, resolve));
    }
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const username = yield this.askQuestion('Enter username: ');
                const password = yield this.askQuestion('Enter password: ');
                this.client.write(`LOGIN;${username};${password}`);
            }
            catch (error) {
                console.error(`Login error: ${error}`);
            }
        });
    }
    logout() {
        this.client.end();
        this.rl.close();
        console.log('Logged out. Please wait while reconnecting...');
        setTimeout(() => {
            this.connectToServer();
        }, 1000);
    }
}
const clientObject = new Client();
