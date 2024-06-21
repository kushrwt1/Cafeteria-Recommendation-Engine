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
exports.RoleBasedMenu = void 0;
const readline_1 = require("readline");
const readline = (0, readline_1.createInterface)({
    input: process.stdin,
    output: process.stdout
});
class RoleBasedMenu {
    adminMenu(adminController) {
        console.log("1. Add Menu Item");
        console.log("2. Update Menu Item");
        console.log("3. Delete Menu Item");
        console.log("4. Exit");
        readline.question('Choose an option: ', (option) => __awaiter(this, void 0, void 0, function* () {
            switch (option) {
                case '1':
                    readline.question('Enter item name: ', (name) => __awaiter(this, void 0, void 0, function* () {
                        readline.question('Enter item price: ', (priceStr) => __awaiter(this, void 0, void 0, function* () {
                            const price = parseFloat(priceStr);
                            readline.question('Is the item available? (yes/no): ', (availabilityStr) => __awaiter(this, void 0, void 0, function* () {
                                const availability = availabilityStr.toLowerCase() === 'yes';
                                yield adminController.addMenuItem({ id: 0, name, price, availability });
                                console.log("Menu item added.");
                                this.adminMenu(adminController);
                            }));
                        }));
                    }));
                    break;
                case '2':
                    readline.question('Enter item ID: ', (idStr) => __awaiter(this, void 0, void 0, function* () {
                        const id = parseInt(idStr);
                        readline.question('Enter new item name: ', (name) => __awaiter(this, void 0, void 0, function* () {
                            readline.question('Enter new item price: ', (priceStr) => __awaiter(this, void 0, void 0, function* () {
                                const price = parseFloat(priceStr);
                                readline.question('Is the item available? (yes/no): ', (availabilityStr) => __awaiter(this, void 0, void 0, function* () {
                                    const availability = availabilityStr.toLowerCase() === 'yes';
                                    yield adminController.updateMenuItem({ id, name, price, availability });
                                    console.log("Menu item updated.");
                                    this.adminMenu(adminController);
                                }));
                            }));
                        }));
                    }));
                    break;
                case '3':
                    readline.question('Enter item ID: ', (idStr) => __awaiter(this, void 0, void 0, function* () {
                        const id = parseInt(idStr);
                        yield adminController.deleteMenuItem(id);
                        console.log("Menu item deleted.");
                        this.adminMenu(adminController);
                    }));
                    break;
                case '4':
                    readline.close();
                    break;
                default:
                    console.log("Invalid option");
                    this.adminMenu(adminController);
                    break;
            }
        }));
    }
    chefMenu(chefController) {
        console.log("1. Roll out menu");
        console.log("2. Exit");
        readline.question('Choose an option: ', (option) => __awaiter(this, void 0, void 0, function* () {
            switch (option) {
                case '1':
                    readline.question('Enter item IDs to roll out (comma-separated): ', (idsStr) => __awaiter(this, void 0, void 0, function* () {
                        const ids = idsStr.split(',').map(id => parseInt(id.trim()));
                        yield chefController.rollOutMenu(ids);
                        console.log("Menu rolled out.");
                        this.chefMenu(chefController);
                    }));
                    break;
                case '2':
                    readline.close();
                    break;
                default:
                    console.log("Invalid option");
                    this.chefMenu(chefController);
                    break;
            }
        }));
    }
    userMenu(userController, userId) {
        console.log("1. Give feedback");
        console.log("2. Exit");
        readline.question('Choose an option: ', (option) => __awaiter(this, void 0, void 0, function* () {
            switch (option) {
                case '1':
                    readline.question('Enter item ID: ', (itemIdStr) => __awaiter(this, void 0, void 0, function* () {
                        const itemId = parseInt(itemIdStr);
                        readline.question('Enter rating (1-5): ', (ratingStr) => __awaiter(this, void 0, void 0, function* () {
                            const rating = parseInt(ratingStr);
                            readline.question('Enter comment: ', (comment) => __awaiter(this, void 0, void 0, function* () {
                                yield userController.giveFeedback(userId, itemId, rating, comment);
                                console.log("Feedback submitted.");
                                this.userMenu(userController, userId);
                            }));
                        }));
                    }));
                    break;
                case '2':
                    readline.close();
                    break;
                default:
                    console.log("Invalid option");
                    this.userMenu(userController, userId);
                    break;
            }
        }));
    }
}
exports.RoleBasedMenu = RoleBasedMenu;
