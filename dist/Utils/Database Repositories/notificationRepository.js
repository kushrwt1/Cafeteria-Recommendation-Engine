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
exports.NotificationRepository = void 0;
const database_1 = require("../../Database/database");
class NotificationRepository {
    getAllNotifications() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.db.execute('SELECT * FROM Notifications');
            return rows;
        });
    }
    getNotificationById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.db.execute('SELECT * FROM Notifications WHERE id = ?', [id]);
            const notifications = rows;
            return notifications.length > 0 ? notifications[0] : null;
        });
    }
    addNotification(notification) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.execute('INSERT INTO Notifications (message, user_id) VALUES (?, ?)', [notification.message, notification.user_id]);
        });
    }
    updateNotification(notification) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.execute('UPDATE Notifications SET message = ?, user_id = ? WHERE id = ?', [notification.message, notification.user_id, notification.id]);
        });
    }
    deleteNotification(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.execute('DELETE FROM Notifications WHERE id = ?', [id]);
        });
    }
}
exports.NotificationRepository = NotificationRepository;
