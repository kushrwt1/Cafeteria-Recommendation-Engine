"use strict";
// import net from 'net';
// import { User } from '../../Models/user';
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeHandler = void 0;
const employeeController_1 = require("../../Controllers/employeeController");
class EmployeeHandler {
    handleEmployee(socket, command, params) {
        const employeeController = new employeeController_1.EmployeeController();
        let response;
        switch (command) {
            case 'employee_giveFeedback':
                const [userIdStr, menuItemIdStr, ratingStr, comment, dateStr] = params;
                const userId = parseInt(userIdStr);
                const menuItemId = parseInt(menuItemIdStr);
                const rating = parseInt(ratingStr);
                const date = new Date(dateStr).toISOString().split('T')[0];
                employeeController.giveFeedback(userId, menuItemId, rating, comment, date);
                // const recommendedItems = await chefController.getRecommendedItems();
                break;
            case 'employee_viewNotifications':
                const employeeId = parseInt(params[0]);
                employeeController.getNotifications(socket, employeeId);
                // socket.write(JSON.stringify(notifications));
                break;
            case 'employee_viewRolledOutMenu':
                const [notificationIdStr, employeeIdIdStr] = params;
                const notificationId = parseInt(notificationIdStr);
                const employeeId1 = parseInt(employeeIdIdStr);
                employeeController.getRolledOutMenu(socket, notificationId, employeeId1);
                break;
            case 'employee_markNotificationAsSeen':
                const notificationIdToMark = parseInt(params[0]);
                employeeController.markNotificationAsSeen(notificationIdToMark);
                break;
            case 'employee_markNotificationAsSeen_updateVotedItem':
                const [notificationIdToMarkAsSeenStr, breakfastItemIdStr, lunchItemIdStr, dinnerItemIdStr, employeeId2Str] = params;
                const notificationIdToMarkAsSeen = parseInt(notificationIdToMarkAsSeenStr);
                const breakfastItemId = parseInt(breakfastItemIdStr);
                const lunchItemId = parseInt(lunchItemIdStr);
                const dinnerItemId = parseInt(dinnerItemIdStr);
                const employeeId2 = parseInt(employeeId2Str);
                employeeController.markNotificationAsSeen(notificationIdToMarkAsSeen);
                employeeController.updateVotedItem(breakfastItemId, lunchItemId, dinnerItemId, employeeId2);
                break;
            case 'employee_markNotificationAsSeen_sendDiscardedItemFeedbackToServer':
                const [employeeId3Str, notificationIdToMarkAsSeen1Str, dislikes, desiredTaste, momRecipe, discardedMenuItemIdStr] = params;
                const employeeId3 = parseInt(employeeId3Str);
                const notificationIdToMarkAsSeen1 = parseInt(notificationIdToMarkAsSeen1Str);
                const discardedMenuItemId = parseInt(discardedMenuItemIdStr);
                employeeController.markNotificationAsSeen(notificationIdToMarkAsSeen1);
                employeeController.addDiscarededMenuItemFeedbackInDatabase(dislikes, desiredTaste, momRecipe, discardedMenuItemId);
                break;
            case 'employee_deleteNotification':
                const notificationIdToDelete = parseInt(params[0]);
                employeeController.deleteNotification(notificationIdToDelete);
                break;
            case 'employee_viewAllMenuItem':
                const employeeUserId = parseInt(params[0]);
                employeeController.viewAllMenuItems(socket, employeeUserId);
                // const notificationIdToDelete = parseInt(params[0]);
                // employeeController.deleteNotification(notificationIdToDelete);
                break;
            case 'employee_updateEmployeeProfile':
                const [employeeId4Str, dietaryPreference, spiceLevel, cuisinePreference, sweetToothStr] = params;
                const employeeId4 = parseInt(employeeId4Str);
                const sweetTooth = sweetToothStr === 'true';
                employeeController.updateEmployeeProfile(employeeId4, dietaryPreference, spiceLevel, cuisinePreference, sweetTooth);
                break;
            default:
                response = 'Unknown admin command';
                break;
        }
        // socket.write(response + '\n');
    }
}
exports.EmployeeHandler = EmployeeHandler;
