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
                const [notificationIdToMarkAsSeenStr, itemIdStr, employeeId2Str] = params;
                const notificationIdToMarkAsSeen = parseInt(notificationIdToMarkAsSeenStr);
                const itemId = parseInt(itemIdStr);
                const employeeId2 = parseInt(employeeId2Str);
                employeeController.markNotificationAsSeen(notificationIdToMarkAsSeen);
                employeeController.updateVotedItem(itemId, employeeId2);
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
            default:
                response = 'Unknown admin command';
                break;
        }
        // socket.write(response + '\n');
    }
}
exports.EmployeeHandler = EmployeeHandler;
