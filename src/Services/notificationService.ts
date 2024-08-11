import { NotificationRepository } from '../Utils/Database Repositories/notificationRepository';

export class NotificationService {
    private notificationRepositoryObject = new NotificationRepository();

    public async addNotificationForAllUsers(message: string, date: string): Promise<void> {
        try {
            await this.notificationRepositoryObject.addNotificationForAllUsers(message, date);
        } catch (error) {
            console.error("Error adding notification for all users:", error);
            throw new Error("Failed to add notification for all users");
        }
    }

    public async getNotificationsByUserId(userId: number): Promise<any[]> {
        try {
            return await this.notificationRepositoryObject.getNotificationsByUserId(userId);
        } catch (error) {
            console.error(`Error retrieving notifications for user ${userId}:`, error);
            throw new Error(`Failed to retrieve notifications for user ${userId}`);
        }
    }

    public async markNotificationAsSeen(notificationId: number): Promise<void> {
        try {
            await this.notificationRepositoryObject.updateNotificationSeenStatus(notificationId);
        } catch (error) {
            console.error(`Error marking notification ${notificationId} as seen:`, error);
            throw new Error(`Failed to mark notification ${notificationId} as seen`);
        }
    }

    public async deleteNotification(notificationId: number): Promise<void> {
        try {
            await this.notificationRepositoryObject.deleteNotification(notificationId);
        } catch (error) {
            console.error(`Error deleting notification ${notificationId}:`, error);
            throw new Error(`Failed to delete notification ${notificationId}`);
        }
    }
}
