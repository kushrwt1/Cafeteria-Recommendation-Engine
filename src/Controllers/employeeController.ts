import { db } from '../Database/database';
import { Feedback } from '../Models/feedback';
import { FeedbackRepository } from '../Utils/Database Repositories/feedbackRepository';
import { NotificationService } from '../Services/notificationService';
import { ChefDailyMenuRepository } from '../Utils/Database Repositories/chefDailyMenuRepository';
import { EmployeeMenuSelectionRepository } from '../Utils/Database Repositories/employeeMenuSelectionRepository';
import net from 'net';
import { EmployeeMenuSelections } from '../Models/employeeMenuSelection';

export class EmployeeController {

    private feedbackRepositoryObject = new FeedbackRepository();
    private chefdailyMenuRepositoryObject = new ChefDailyMenuRepository();
    private notificationServiceObject = new NotificationService();
    private employeeMenuSelectionrepositoryObject = new EmployeeMenuSelectionRepository();

    public async giveFeedback(userId: number, menuItemId: number, rating: number, comment: string, date: string) {
        try {
            const feedback: Feedback = {
                id: 0,
                user_id: userId,
                menu_item_id: menuItemId,
                rating: rating,
                comment: comment,
                date: date
            };

            await this.feedbackRepositoryObject.addFeedback(feedback);
            console.log("Feedback added successfully.");
        } catch (error) {
            console.error(`Error adding feedback: ${error}`);
        }
    }

    public async getNotifications(socket: net.Socket, userId: number): Promise<void> {
        const notifications = await this.notificationServiceObject.getNotificationsByUserId(userId);
        // socket.write(JSON.stringify(notifications));
        socket.write(`Response_viewNotifications;${JSON.stringify(notifications)};${userId}`);
    }

    public async getRolledOutMenu(socket: net.Socket, notificationId: number, userId: number): Promise<void> {
        const rolledOutMenu = await this.chefdailyMenuRepositoryObject.getTodaysRolledOutMenu();
        // socket.write(JSON.stringify(notifications));
        socket.write(`Response_rolledOutMenu;${JSON.stringify(rolledOutMenu)};${userId};${notificationId}`);
    }

    public async markNotificationAsSeen(notificationId: number): Promise<void> {
        await this.notificationServiceObject.markNotificationAsSeen(notificationId);
    }

    public async updateVotedItem(itemId: number, userId: number) {
        const today = new Date().toISOString().split('T')[0];        
        const userMenuSelection: EmployeeMenuSelections= {
            id: 0,
            user_id: userId,
            menu_item_id: itemId,
            selection_date: today
        };
        await this.employeeMenuSelectionrepositoryObject.addEmployeeMenuSelection(userMenuSelection);
    }

    public async deleteNotification(notificationId: number): Promise<void> {
        await this.notificationServiceObject.deleteNotification(notificationId);
    }

    public async selectMenuItems() {

    }

    public async sendSelectedMenuItems() {

    }
}