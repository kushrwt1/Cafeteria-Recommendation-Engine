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
exports.AdminController = void 0;
const menuItemRepository_1 = require("../Utils/Database Repositories/menuItemRepository");
class AdminController {
    constructor() {
        this.menuItemRepositoryObject = new menuItemRepository_1.MenuItemRepository();
    }
    addMenuItem(menuItem) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.menuItemRepositoryObject.addMenuItem(menuItem);
            }
            catch (error) {
                console.error(`Error adding menu item: ${error}`);
            }
        });
    }
    updateMenuItem(menuItem) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.menuItemRepositoryObject.updateMenuItem(menuItem);
            }
            catch (error) {
                console.error(`Error updating menu item: ${error}`);
            }
        });
    }
    deleteMenuItem(menuItemId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.menuItemRepositoryObject.deleteMenuItem(menuItemId);
            }
            catch (error) {
                console.error(`Error deleting menu item: ${error}`);
            }
        });
    }
    viewAllMenuItems(socket) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const menuItems = yield this.menuItemRepositoryObject.getAllMenuItems();
                // console.log("Menu Items:", menuItems);
                socket.write(`Response_viewAllMenuItems;${JSON.stringify(menuItems)}`);
            }
            catch (error) {
                console.error(`Error fetching all menu item: ${error}`);
            }
        });
    }
}
exports.AdminController = AdminController;
