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
const recommendationService_1 = require("../Services/recommendationService");
const discardedMenuItemRepository_1 = require("../Utils/Database Repositories/discardedMenuItemRepository");
class AdminController {
    constructor() {
        this.menuItemRepositoryObject = new menuItemRepository_1.MenuItemRepository();
        this.recommendationService = new recommendationService_1.RecommendationService();
        this.discardedMenuItemRepositoryObject = new discardedMenuItemRepository_1.DiscardedMenuItemRepository();
    }
    addMenuItem(menuItem, socket) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.menuItemRepositoryObject.addMenuItem(menuItem, socket);
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
    addDiscarededMenuItemsInDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const discardedItems = yield this.recommendationService.getDiscardedMenuItems();
                console.log('Discarded items retrieved from Recommendation Engine succeessfully');
                const currentDate = new Date().toISOString().split('T')[0];
                // Loop through discarded items and insert each into the Discarded_Menu_Item table
                for (const item of discardedItems) {
                    yield this.discardedMenuItemRepositoryObject.addDiscardedMenuItem({
                        id: 0, // id will be auto-incremented
                        menu_item_id: item.menu_item_id,
                        discarded_date: currentDate,
                        name: item.name
                    });
                }
            }
            catch (error) {
                console.error('Error fetching Discarded items and Adding Discarded item into Database:', error);
                // socket.write(`Error_getRecommendedItems;${error}`);
                throw error;
            }
        });
    }
    getMenuItemById(menuItemId) {
        return __awaiter(this, void 0, void 0, function* () {
            const menuItem = yield this.menuItemRepositoryObject.getMenuItemById(menuItemId);
            return menuItem;
        });
    }
    sendAllDiscardedMenuItemsToClient(socket) {
        return __awaiter(this, void 0, void 0, function* () {
            // Note: Here we should get discarded menu items from database tables.
            try {
                const discardedMenuItems = yield this.discardedMenuItemRepositoryObject.getAllDiscardedMenuItems();
                socket.write(`Response_admin_viewDiscardedMenuItems;${JSON.stringify(discardedMenuItems)}`);
                console.log("Discarded Menu Items Sent To The client Successfully");
            }
            catch (error) {
                console.error(`Error fetching Discarded menu item: ${error}`);
            }
        });
    }
}
exports.AdminController = AdminController;
