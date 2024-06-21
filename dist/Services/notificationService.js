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
exports.NotificationService = void 0;
const notificationRepository_1 = require("../Utils/Database Repositories/notificationRepository");
class NotificationService {
    constructor() {
        this.notificationRepositoryObject = new notificationRepository_1.NotificationRepository();
    }
    addNotificationForAllUsers(message, date) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.notificationRepositoryObject.addNotificationForAllUsers(message, date);
        });
    }
    getNotificationsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.notificationRepositoryObject.getNotificationsByUserId(userId);
        });
    }
    markNotificationAsSeen(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.notificationRepositoryObject.updateNotificationSeenStatus(notificationId);
        });
    }
    deleteNotification(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.notificationRepositoryObject.deleteNotification(notificationId);
        });
    }
}
exports.NotificationService = NotificationService;
