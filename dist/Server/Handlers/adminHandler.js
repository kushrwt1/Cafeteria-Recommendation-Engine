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
            case "admin_addMenuItem":
                const { name, price, availability, mealTypeId, dietaryType, spiceLevel, cuisineType, isSweet, } = JSON.parse(params);
                adminController.addMenuItem({
                    menu_item_id: 0,
                    name,
                    availability,
                    price,
                    meal_type_id: mealTypeId,
                    dietary_type: dietaryType,
                    spice_level: spiceLevel,
                    cuisine_type: cuisineType,
                    is_sweet: isSweet,
                }, socket);
                const todaysDate = new Date().toISOString().split("T")[0];
                this.notificationService.addNotificationForAllUsers(`Menu item is added with name: ${name}`, todaysDate);
                break;
            case "admin_updateMenuItem":
                const { menuItemId, newName, newPrice, newAvailability, newMealTypeId, newDietaryType, newSpiceLevel, newCuisineType, newIsSweet, } = JSON.parse(params);
                adminController.updateMenuItem({
                    menu_item_id: menuItemId,
                    name: newName,
                    availability: newAvailability,
                    price: newPrice,
                    meal_type_id: newMealTypeId,
                    dietary_type: newDietaryType,
                    spice_level: newSpiceLevel,
                    cuisine_type: newCuisineType,
                    is_sweet: newIsSweet,
                });
                break;
            case "admin_deleteMenuItem":
                const { menuItemIdToDelete } = JSON.parse(params);
                adminController.deleteMenuItem(menuItemIdToDelete);
                break;
            case "admin_viewAllMenuItem":
                adminController.viewAllMenuItems(socket);
                break;
            case "admin_viewDiscardedMenuItems":
                (() => __awaiter(this, void 0, void 0, function* () {
                    yield adminController.addDiscarededMenuItemsInDatabase();
                    adminController.sendAllDiscardedMenuItemsToClient(socket);
                }))();
                break;
            case "admin_removeMenuItem":
                const { foodItemId } = JSON.parse(params);
                adminController.deleteMenuItem(foodItemId);
                break;
            case "admin_sendDiscardedItemFeedbackNotification":
                const { menuItemIdToGetFeedback } = JSON.parse(params);
                const today = new Date().toISOString().split("T")[0];
                (() => __awaiter(this, void 0, void 0, function* () {
                    const menuItem = yield adminController.getMenuItemById(menuItemIdToGetFeedback);
                    if (menuItem != null) {
                        this.notificationService.addNotificationForAllUsers(`Give Detailed Feedback On Discarded Menu Item with Menu Item Id and Name as: ${menuItemIdToGetFeedback} > ${menuItem.name}`, today);
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
exports.AdminHandler = AdminHandler;
