// services/notificationService.ts
import { db } from '../Database/database'; // Adjust the path as needed
import { NotificationRepository } from '../Utils/Database Repositories/notificationRepository';

export class NotificationService {
    private notificationRepositoryObject = new NotificationRepository();

    public async addNotificationForAllUsers(message: string, date: string): Promise<void> {
        await this.notificationRepositoryObject.addNotificationForAllUsers(message, date);
    }

    public async getNotificationsByUserId(userId: number): Promise<any[]> {
        return await this.notificationRepositoryObject.getNotificationsByUserId(userId);
    }

    public async markNotificationAsSeen(notificationId: number): Promise<void> {
        await this.notificationRepositoryObject.updateNotificationSeenStatus(notificationId);
    }

    public async deleteNotification(notificationId: number): Promise<void> {
        await this.notificationRepositoryObject.deleteNotification(notificationId);
    }
}
