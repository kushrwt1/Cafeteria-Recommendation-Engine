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
class ChefController {
    constructor() {
        // private feedbackRepositoryObject = new FeedbackRepository();
        this.menuItemRepositoryObject = new menuItemRepository_1.MenuItemRepository();
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
}
exports.ChefController = ChefController;
