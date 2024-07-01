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
exports.ChefController = void 0;
const menuItemRepository_1 = require("../Utils/Database Repositories/menuItemRepository");
const chefDailyMenuRepository_1 = require("../Utils/Database Repositories/chefDailyMenuRepository");
const recommendationService_1 = require("../Services/recommendationService");
const notificationService_1 = require("../Services/notificationService");
const discardedMenuItemRepository_1 = require("../Utils/Database Repositories/discardedMenuItemRepository");
class ChefController {
    constructor() {
        // private feedbackRepositoryObject = new FeedbackRepository();
        this.menuItemRepositoryObject = new menuItemRepository_1.MenuItemRepository();
        this.discardedMenuItemRepositoryObject = new discardedMenuItemRepository_1.DiscardedMenuItemRepository();
        this.chefDailyMenuRepositoryObject = new chefDailyMenuRepository_1.ChefDailyMenuRepository();
        this.notificationService = new notificationService_1.NotificationService();
        this.recommendationService = new recommendationService_1.RecommendationService();
    }
    // private sentiment = new Sentiment();
    getRecommendedItems(socket) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recommendedItems = yield this.recommendationService.getRecommendedItems();
                // console.log(recommendedItems);
                socket.write(`Response_getRecommendedItems;${JSON.stringify(recommendedItems)}`);
            }
            catch (error) {
                console.error('Error fetching recommended items:', error);
                socket.write(`Error_getRecommendedItems;${error}`);
                throw error;
            }
        });
    }
    rollOutMenu(date, menuItemId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dailyMenu = {
                    id: 0, // Assuming id is auto-incremented by the database
                    menu_item_id: menuItemId,
                    date: date
                };
                // await db.execute('INSERT INTO Daily_Menu (menu_item_id, date) VALUES ?', [menuItemIds.map(id => [id, new Date()])]);
                // await db.execute(
                //     'INSERT INTO chef_daily_menus (date, menu_item_id) VALUES (?, ?)',
                //     [date, menuItemId]
                // );
                yield this.chefDailyMenuRepositoryObject.addDailyMenu(dailyMenu);
                const today = new Date().toISOString().split('T')[0];
                console.log(`Menu item ${menuItemId} rolled out on ${date}.`);
            }
            catch (error) {
                console.error(`Error rolling out menu: ${error}`);
            }
        });
    }
    viewAllMenuItems(socket) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const menuItems = yield this.menuItemRepositoryObject.getAllMenuItems();
                socket.write(`Response_Chef_viewAllMenuItems;${JSON.stringify(menuItems)}`);
            }
            catch (error) {
                console.error(`Error fetching all menu item: ${error}`);
            }
        });
    }
    selectItemsFromMenu() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    makeMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            // this.getRecommendedItems();
            this.selectItemsFromMenu();
        });
    }
    getSelectedMenuItemsFromUsers() {
        return __awaiter(this, void 0, void 0, function* () {
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
    sendAllDiscardedMenuItemsToClient(socket) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const discardedMenuItems = yield this.discardedMenuItemRepositoryObject.getAllDiscardedMenuItems();
                socket.write(`Response_chef_viewDiscardedMenuItems;${JSON.stringify(discardedMenuItems)}`);
                console.log("Discarded Menu Items Sent To The client Successfully");
            }
            catch (error) {
                console.error(`Error fetching Discarded menu item: ${error}`);
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
    getMenuItemById(menuItemId) {
        return __awaiter(this, void 0, void 0, function* () {
            const menuItem = yield this.menuItemRepositoryObject.getMenuItemById(menuItemId);
            return menuItem;
        });
    }
}
exports.ChefController = ChefController;
