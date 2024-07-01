import { db } from '../Database/database';
import Sentiment from 'sentiment';
import { Feedback } from '../Models/feedback';
import { FeedbackRepository } from '../Utils/Database Repositories/feedbackRepository';
import { MenuItemRepository } from '../Utils/Database Repositories/menuItemRepository';
import net from 'net';
import { ChefDailyMenuRepository } from '../Utils/Database Repositories/chefDailyMenuRepository';
import { ChefDailyMenus } from '../Models/chefDailyMenu';
import { RecommendationService } from '../Services/recommendationService';
import { NotificationService } from '../Services/notificationService';
import { DiscardedMenuItemRepository } from '../Utils/Database Repositories/discardedMenuItemRepository';
import { MenuItem } from '../Models/menuItem';

export class ChefController {
    
    // private feedbackRepositoryObject = new FeedbackRepository();
    private menuItemRepositoryObject = new MenuItemRepository();
    private discardedMenuItemRepositoryObject = new DiscardedMenuItemRepository();
    private chefDailyMenuRepositoryObject = new ChefDailyMenuRepository();
    private recommendationService!: RecommendationService;
    private notificationService = new NotificationService();

    constructor() {
        this.recommendationService = new RecommendationService();
    }
    // private sentiment = new Sentiment();

    public async getRecommendedItems(socket: net.Socket) {
        try {
            const recommendedItems = await this.recommendationService.getRecommendedItems();
            // console.log(recommendedItems);
            socket.write(`Response_getRecommendedItems;${JSON.stringify(recommendedItems)}`);
        } catch (error) {
            console.error('Error fetching recommended items:', error);
            socket.write(`Error_getRecommendedItems;${error}`);
            throw error;
        }
    }
    
    public async rollOutMenu(date: string, menuItemId: number) {
        try {
            const dailyMenu: ChefDailyMenus = {
                id: 0, // Assuming id is auto-incremented by the database
                menu_item_id: menuItemId,
                date: date
            };

            // await db.execute('INSERT INTO Daily_Menu (menu_item_id, date) VALUES ?', [menuItemIds.map(id => [id, new Date()])]);
            // await db.execute(
            //     'INSERT INTO chef_daily_menus (date, menu_item_id) VALUES (?, ?)',
            //     [date, menuItemId]
            // );
            await this.chefDailyMenuRepositoryObject.addDailyMenu(dailyMenu);
            const today = new Date().toISOString().split('T')[0];
            console.log(`Menu item ${menuItemId} rolled out on ${date}.`);
        } catch (error) {
            console.error(`Error rolling out menu: ${error}`);
        }
    }
    
    public async viewAllMenuItems(socket: net.Socket) {
        try {
            const menuItems = await this.menuItemRepositoryObject.getAllMenuItems();
            socket.write(`Response_Chef_viewAllMenuItems;${JSON.stringify(menuItems)}`);
        } catch (error) {
            console.error(`Error fetching all menu item: ${error}`);
        }
    }

    public async selectItemsFromMenu() {
        
    }

    public async makeMenu() {
        // this.getRecommendedItems();
        this.selectItemsFromMenu();
    }

    public async getSelectedMenuItemsFromUsers() {
    
    }

    public async addDiscarededMenuItemsInDatabase() {
        try {
            const discardedItems = await this.recommendationService.getDiscardedMenuItems();
            console.log('Discarded items retrieved from Recommendation Engine succeessfully');

            const currentDate = new Date().toISOString().split('T')[0];
            // Loop through discarded items and insert each into the Discarded_Menu_Item table
            for (const item of discardedItems) {
                await this.discardedMenuItemRepositoryObject.addDiscardedMenuItem({
                    id: 0, // id will be auto-incremented
                    menu_item_id: item.menu_item_id,
                    discarded_date: currentDate,
                    name: item.name
                });
            }
        } catch (error) {
            console.error('Error fetching Discarded items and Adding Discarded item into Database:', error);
            // socket.write(`Error_getRecommendedItems;${error}`);
            throw error;
        }
    }

    public async sendAllDiscardedMenuItemsToClient(socket: net.Socket) {
        try {
            const discardedMenuItems = await this.discardedMenuItemRepositoryObject.getAllDiscardedMenuItems();
            socket.write(`Response_chef_viewDiscardedMenuItems;${JSON.stringify(discardedMenuItems)}`);
            console.log("Discarded Menu Items Sent To The client Successfully");
        } catch (error) {
            console.error(`Error fetching Discarded menu item: ${error}`);
        }
    }

    public async deleteMenuItem(menuItemId: number) {
        try {
            this.menuItemRepositoryObject.deleteMenuItem(menuItemId);
        } catch (error) {
            console.error(`Error deleting menu item: ${error}`);
        }
    }

    public async getMenuItemById(menuItemId: number) {
        const menuItem: MenuItem | null = await this.menuItemRepositoryObject.getMenuItemById(menuItemId);
        return menuItem;
    }

}
