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
exports.AdminHandler = void 0;
const adminController_1 = require("../../Controllers/adminController");
const notificationService_1 = require("../../Services/notificationService");
class AdminHandler {
    constructor() {
        this.notificationService = new notificationService_1.NotificationService();
    }
    handleAdmin(socket, command, params) {
        const adminController = new adminController_1.AdminController();
        let response;
        switch (command) {
            case 'admin_addMenuItem':
                const [nameStr, priceStr, availabilityStr, mealTypeIdStr] = params;
                const name = nameStr.toString();
                const price = parseFloat(priceStr);
                const availability = availabilityStr === 'true';
                const meal_type_id = parseInt(mealTypeIdStr);
                adminController.addMenuItem({ menu_item_id: 0, name, availability, price, meal_type_id }, socket);
                break;
            case 'admin_updateMenuItem':
                const [menuItemIdStr, newNameStr, newPriceStr, newAvailabilityStr, newMealTypeIdStr] = params;
                const menuItemId = parseInt(menuItemIdStr);
                const newName = newNameStr.toString();
                const newPrice = parseFloat(newPriceStr);
                const newAvailability = newAvailabilityStr === 'true';
                const newMealTypeId = parseInt(newMealTypeIdStr);
                adminController.updateMenuItem({ menu_item_id: menuItemId, name: newName, availability: newAvailability, price: newPrice, meal_type_id: newMealTypeId });
                break;
            case 'admin_deleteMenuItem':
                const [menuItemIdToDeleteStr] = params;
                const menuItemIdToDelete = parseInt(menuItemIdToDeleteStr);
                adminController.deleteMenuItem(menuItemIdToDelete);
                break;
            case 'admin_viewAllMenuItem':
                adminController.viewAllMenuItems(socket);
                // socket.write(`Response_viewAllMenuItems;${menuItems}`);
                break;
            case 'admin_viewDiscardedMenuItems':
                (() => __awaiter(this, void 0, void 0, function* () {
                    yield adminController.addDiscarededMenuItemsInDatabase();
                    adminController.sendAllDiscardedMenuItemsToClient(socket);
                }))();
                break;
            case 'admin_removeMenuItem':
                const foodItemId = parseInt(params[0]);
                adminController.deleteMenuItem(foodItemId);
                break;
            case 'admin_sendDiscardedItemFeedbackNotification':
                const menuItemIdToGetFeedback = parseInt(params[0]);
                const today = new Date().toISOString().split('T')[0];
                (() => __awaiter(this, void 0, void 0, function* () {
                    const menuItem = yield adminController.getMenuItemById(menuItemIdToGetFeedback);
                    if (menuItem != null) {
                        this.notificationService.addNotificationForAllUsers(`Give Detailed Feedback On Discarded Menu Item with Menu Item Id and Name as: ${menuItemIdToGetFeedback} > ${menuItem.name}`, today);
                        console.log("Notification For Getting Detailed feedback is send successfully.");
                    }
                }))();
                break;
            default:
                response = 'Unknown admin command';
                break;
        }
        // socket.write(response + '\n');
    }
}
exports.AdminHandler = AdminHandler;
