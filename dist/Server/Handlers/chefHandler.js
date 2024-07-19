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
exports.ChefHandler = void 0;
const chefController_1 = require("../../Controllers/chefController");
const notificationService_1 = require("../../Services/notificationService");
class ChefHandler {
    constructor() {
        this.notificationService = new notificationService_1.NotificationService();
    }
    handleChef(socket, command, params) {
        const chefController = new chefController_1.ChefController();
        let response;
        switch (command) {
            case "chef_getRecommendedItems":
                chefController.getRecommendedItems(socket);
                break;
            case "chef_rollOutMenu":
                const { today, selectedItemsInStringFormat } = JSON.parse(params);
                const selectedItems = JSON.parse(selectedItemsInStringFormat);
                for (const { mealType, menuItemId } of selectedItems) {
                    chefController.rollOutMenu(today, menuItemId);
                }
                const todaysDate = new Date().toISOString().split("T")[0];
                this.notificationService.addNotificationForAllUsers("See Rolled Out Menu and Vote For an Item", todaysDate);
                break;
            case "chef_viewAllMenuItem":
                chefController.viewAllMenuItems(socket);
                break;
            case "chef_viewDiscardedMenuItems":
                (() => __awaiter(this, void 0, void 0, function* () {
                    yield chefController.addDiscarededMenuItemsInDatabase();
                    chefController.sendAllDiscardedMenuItemsToClient(socket);
                }))();
                break;
            case "chef_removeMenuItem":
                const { foodItemId } = JSON.parse(params);
                chefController.deleteMenuItem(foodItemId);
                break;
            case "chef_sendDiscardedItemFeedbackNotification":
                const { menuItemIdToGetFeedback } = JSON.parse(params);
                const todayDate = new Date().toISOString().split("T")[0];
                (() => __awaiter(this, void 0, void 0, function* () {
                    const menuItem = yield chefController.getMenuItemById(menuItemIdToGetFeedback);
                    if (menuItem != null) {
                        this.notificationService.addNotificationForAllUsers(`Give Detailed Feedback On Discarded Menu Item with Menu Item Id and Name as: ${menuItemIdToGetFeedback} > ${menuItem.name}`, todayDate);
                        console.log("Notification For Getting Detailed feedback is send successfully.");
                    }
                }))();
                break;
            default:
                response = "Unknown admin command";
                break;
        }
        // socket.write(response + '\n');
    }
}
exports.ChefHandler = ChefHandler;
