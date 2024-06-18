"use strict";
// import { AdminController } from '../../Controllers/adminController';
// import { ChefController } from '../../Controllers/chefController';
// import { UserController } from '../../Controllers/employeeController';
// import readline from 'readline';
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
function showMenu(role, userId, client, rl) {
    const roleBasedMenu = new RoleBasedMenu(client, rl);
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
    constructor(client, rl) {
        this.client = client;
        this.rl = rl;
    }
    askQuestion(question) {
        return new Promise((resolve) => this.rl.question(question, resolve));
    }
    adminMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("1. Add Menu Item");
            console.log("2. Update Menu Item");
            console.log("3. Delete Menu Item");
            console.log("4. View All Menu Items");
            console.log("5. Exit");
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
                        this.viewAllMenuItem();
                        break;
                    case '5':
                        this.rl.close();
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
    viewAllMenuItem() {
        return __awaiter(this, void 0, void 0, function* () {
            const command = `admin_viewAllMenuItem`;
            this.client.write(command);
            // this.adminMenu();
        });
    }
    chefMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("1. Roll out menu");
            console.log("2. Exit");
            // const option = await this.askQuestion('Choose an option: ');
            // try {
            //     switch (option) {
            //         case '1':
            //             const idsStr = await this.askQuestion('Enter item IDs to roll out (comma-separated): ');
            //             const ids = idsStr.split(',').map(id => parseInt(id.trim()));
            //             await chefController.rollOutMenu(ids);
            //             console.log("Menu rolled out.");
            //             this.chefMenu(chefController);
            //             break;
            //         case '2':
            //             this.rl.close();
            //             break;
            //         default:
            //             console.log("Invalid option");
            //             this.chefMenu(chefController);
            //             break;
            //     }
            // } catch (error) {
            //     console.error(`Chef menu error: ${error}`);
            //     this.chefMenu(chefController);
            // }
        });
    }
    employeeMenu(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("1. Give feedback");
            console.log("2. Exit");
            // const option = await this.askQuestion('Choose an option: ');
            // try {
            //     switch (option) {
            //         case '1':
            //             const itemIdStr = await this.askQuestion('Enter item ID: ');
            //             const itemId = parseInt(itemIdStr);
            //             const ratingStr = await this.askQuestion('Enter rating (1-5): ');
            //             const rating = parseInt(ratingStr);
            //             const comment = await this.askQuestion('Enter comment: ');
            //             await userController.giveFeedback(userId, itemId, rating, comment);
            //             console.log("Feedback submitted.");
            //             this.employeeMenu(userController, userId);
            //             break;
            //         case '2':
            //             this.rl.close();
            //             break;
            //         default:
            //             console.log("Invalid option");
            //             this.employeeMenu(userController, userId);
            //             break;
            //     }
            // } catch (error) {
            //     console.error(`Employee menu error: ${error}`);
            //     this.employeeMenu(userController, userId);
            // }
        });
    }
}
exports.RoleBasedMenu = RoleBasedMenu;
