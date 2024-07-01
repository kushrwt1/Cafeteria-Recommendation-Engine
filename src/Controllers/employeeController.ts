import { db } from '../Database/database';
import { Feedback } from '../Models/feedback';
import { FeedbackRepository } from '../Utils/Database Repositories/feedbackRepository';
import { NotificationService } from '../Services/notificationService';
import { ChefDailyMenuRepository } from '../Utils/Database Repositories/chefDailyMenuRepository';
import { EmployeeMenuSelectionRepository } from '../Utils/Database Repositories/employeeMenuSelectionRepository';
import net from 'net';
import { EmployeeMenuSelections } from '../Models/employeeMenuSelection';
import { MenuItemRepository } from '../Utils/Database Repositories/menuItemRepository';
import { ChefDailyMenus } from '../Models/chefDailyMenu';
import { DiscardedFoodItemFeedback } from '../Models/discardedFoodItemFeedback';
import { DiscardedFoodItemFeedbackRepository } from '../Utils/Database Repositories/discardedFoodItemFeedbackRepository';

export class EmployeeController {

    private feedbackRepositoryObject = new FeedbackRepository();
    private chefdailyMenuRepositoryObject = new ChefDailyMenuRepository();
    private notificationServiceObject = new NotificationService();
    private employeeMenuSelectionrepositoryObject = new EmployeeMenuSelectionRepository();
    private menuItemRepositoryObject = new MenuItemRepository();
    private discardedFoodItemFeedbackRepositoryObject = new DiscardedFoodItemFeedbackRepository();

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

    public async updateVotedItem(breakfastItemId: number, lunchItemId: number, dinnerItemId: number, userId: number) {
        const today = new Date().toISOString().split('T')[0];        
        const userMenuSelectionForBreakfast: EmployeeMenuSelections= {
            id: 0,
            user_id: userId,
            menu_item_id: breakfastItemId,
            selection_date: today
        };
        const userMenuSelectionForLunch: EmployeeMenuSelections= {
            id: 0,
            user_id: userId,
            menu_item_id: lunchItemId,
            selection_date: today
        };
        const userMenuSelectionForDinner: EmployeeMenuSelections= {
            id: 0,
            user_id: userId,
            menu_item_id: dinnerItemId,
            selection_date: today
        };
        await this.employeeMenuSelectionrepositoryObject.addEmployeeMenuSelection(userMenuSelectionForBreakfast);
        await this.employeeMenuSelectionrepositoryObject.addEmployeeMenuSelection(userMenuSelectionForLunch);
        await this.employeeMenuSelectionrepositoryObject.addEmployeeMenuSelection(userMenuSelectionForDinner);
    }

    public async deleteNotification(notificationId: number): Promise<void> {
        await this.notificationServiceObject.deleteNotification(notificationId);
    }

    public async viewAllMenuItems(socket: net.Socket, userId: number) {
        try {
            const menuItems = await this.menuItemRepositoryObject.getAllMenuItems();
            // console.log("Menu Items:", menuItems);
            socket.write(`Response_employee_viewAllMenuItems;${JSON.stringify(menuItems)};${userId}`);
        } catch (error) {
            console.error(`Error fetching all menu item: ${error}`);
        }
    }

    public async selectMenuItems() {

    }

    public async sendSelectedMenuItems() {

    }

    public async addDiscarededMenuItemFeedbackInDatabase(dislikes: string, desiredTaste: string, momRecipe: string, discardedMenuItemId: number) {
        const today = new Date().toISOString().split('T')[0];        
        const discardedFoodItemFeedback: DiscardedFoodItemFeedback= {
            id: 0,
            menu_item_id: discardedMenuItemId,
            dislikes: dislikes,
            desired_taste: desiredTaste,
            mom_recipe: momRecipe,
            feedback_date: today
        };
        await this.discardedFoodItemFeedbackRepositoryObject.addFeedback(discardedFoodItemFeedback);
    }
}