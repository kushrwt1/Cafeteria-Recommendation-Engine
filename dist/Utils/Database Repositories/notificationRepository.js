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
    getNotificationsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.db.execute('SELECT * FROM notifications WHERE user_id = ? AND seen = false ORDER BY date DESC', [userId]);
            return rows;
        });
    }
    addNotification(notification) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.execute('INSERT INTO notifications (user_id, message, date, seen) VALUES (?, ?, ?, ?)', [notification.user_id, notification.message, notification.date, notification.seen]);
        });
    }
    addNotificationForAllUsers(message, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            INSERT INTO notifications (user_id, message, date, seen)
            SELECT user_id, ?, ?, false FROM users
            WHERE role_id = 3
        `;
            yield database_1.db.execute(query, [message, date]);
        });
    }
    updateNotificationSeenStatus(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.execute('UPDATE notifications SET seen = true WHERE id = ?', [notificationId]);
        });
    }
    deleteNotification(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.execute('DELETE FROM notifications WHERE id = ?', [notificationId]);
        });
    }
    updateNotification(notification) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.execute('UPDATE Notifications SET message = ?, user_id = ? WHERE id = ?', [notification.message, notification.user_id, notification.id]);
        });
    }
}
exports.NotificationRepository = NotificationRepository;
