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

    public async addNotification(notification: Notification): Promise<void> {
        await db.execute('INSERT INTO Notifications (message, user_id) VALUES (?, ?)', [notification.message, notification.user_id]);
    }

    public async updateNotification(notification: Notification): Promise<void> {
        await db.execute('UPDATE Notifications SET message = ?, user_id = ? WHERE id = ?', [notification.message, notification.user_id, notification.id]);
    }

    public async deleteNotification(id: number): Promise<void> {
        await db.execute('DELETE FROM Notifications WHERE id = ?', [id]);
    }
}
