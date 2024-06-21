import { db } from '../../Database/database';
import { Notification } from '../../Models/notifications';

export class NotificationRepository {
    public async getAllNotifications(): Promise<Notification[]> {
        const [rows] = await db.execute('SELECT * FROM Notifications');
        return rows as Notification[];
    }

    public async getNotificationById(id: number): Promise<Notification | null> {
        const [rows] = await db.execute('SELECT * FROM Notifications WHERE id = ?', [id]);
        const notifications = rows as Notification[];
        return notifications.length > 0 ? notifications[0] : null;
    }

    public async getNotificationsByUserId(userId: number): Promise<Notification[]> {
        const [rows] = await db.execute('SELECT * FROM notifications WHERE user_id = ? AND seen = false ORDER BY date DESC', [userId]);
        return rows as Notification[];
    }

    public async addNotification(notification: Notification): Promise<void> {
        await db.execute('INSERT INTO notifications (user_id, message, date, seen) VALUES (?, ?, ?, ?)', [notification.user_id, notification.message, notification.date, notification.seen]);
    }

    public async addNotificationForAllUsers(message: string, date: string): Promise<void> {
        const query = `
            INSERT INTO notifications (user_id, message, date, seen)
            SELECT user_id, ?, ?, false FROM users
            WHERE role_id = 3
        `;
        await db.execute(query, [message, date]);
    }
    
    public async updateNotificationSeenStatus(notificationId: number): Promise<void> {
        await db.execute('UPDATE notifications SET seen = true WHERE id = ?', [notificationId]);
    }

    public async deleteNotification(notificationId: number): Promise<void> {
        await db.execute('DELETE FROM notifications WHERE id = ?', [notificationId]);
    }

    public async updateNotification(notification: Notification): Promise<void> {
        await db.execute('UPDATE Notifications SET message = ?, user_id = ? WHERE id = ?', [notification.message, notification.user_id, notification.id]);
    }

}
