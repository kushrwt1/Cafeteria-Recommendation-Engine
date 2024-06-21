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
exports.EmployeeController = void 0;
const feedbackRepository_1 = require("../Utils/Database Repositories/feedbackRepository");
const notificationService_1 = require("../Services/notificationService");
const chefDailyMenuRepository_1 = require("../Utils/Database Repositories/chefDailyMenuRepository");
const employeeMenuSelectionRepository_1 = require("../Utils/Database Repositories/employeeMenuSelectionRepository");
class EmployeeController {
    constructor() {
        this.feedbackRepositoryObject = new feedbackRepository_1.FeedbackRepository();
        this.chefdailyMenuRepositoryObject = new chefDailyMenuRepository_1.ChefDailyMenuRepository();
        this.notificationServiceObject = new notificationService_1.NotificationService();
        this.employeeMenuSelectionrepositoryObject = new employeeMenuSelectionRepository_1.EmployeeMenuSelectionRepository();
    }
    giveFeedback(userId, menuItemId, rating, comment, date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const feedback = {
                    id: 0,
                    user_id: userId,
                    menu_item_id: menuItemId,
                    rating: rating,
                    comment: comment,
                    date: date
                };
                yield this.feedbackRepositoryObject.addFeedback(feedback);
                console.log("Feedback added successfully.");
            }
            catch (error) {
                console.error(`Error adding feedback: ${error}`);
            }
        });
    }
    getNotifications(socket, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notifications = yield this.notificationServiceObject.getNotificationsByUserId(userId);
            // socket.write(JSON.stringify(notifications));
            socket.write(`Response_viewNotifications;${JSON.stringify(notifications)};${userId}`);
        });
    }
    getRolledOutMenu(socket, notificationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rolledOutMenu = yield this.chefdailyMenuRepositoryObject.getTodaysRolledOutMenu();
            // socket.write(JSON.stringify(notifications));
            socket.write(`Response_rolledOutMenu;${JSON.stringify(rolledOutMenu)};${userId};${notificationId}`);
        });
    }
    markNotificationAsSeen(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.notificationServiceObject.markNotificationAsSeen(notificationId);
        });
    }
    updateVotedItem(itemId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const today = new Date().toISOString().split('T')[0];
            const userMenuSelection = {
                id: 0,
                user_id: userId,
                menu_item_id: itemId,
                selection_date: today
            };
            yield this.employeeMenuSelectionrepositoryObject.addEmployeeMenuSelection(userMenuSelection);
        });
    }
    deleteNotification(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.notificationServiceObject.deleteNotification(notificationId);
        });
    }
    selectMenuItems() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    sendSelectedMenuItems() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.EmployeeController = EmployeeController;
