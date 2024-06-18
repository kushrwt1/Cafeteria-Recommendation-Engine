import { db } from '../Database/database';
import { MenuItem } from '../Models/menuItem';
import { MenuItemRepository } from '../Utils/Database Repositories/menuItemRepository';
import net from 'net';

export class AdminController {

    private menuItemRepositoryObject = new MenuItemRepository();
    
    public async addMenuItem(menuItem: {menu_item_id: 0, name: string; availability: boolean; price: number; meal_type_id: number }) {
        try {
            this.menuItemRepositoryObject.addMenuItem(menuItem);
        } catch (error) {
            console.error(`Error adding menu item: ${error}`);
        }
    }

    public async updateMenuItem(menuItem: { menu_item_id: number; name: string; availability: boolean; price: number; meal_type_id: number }) {
        try {
            this.menuItemRepositoryObject.updateMenuItem(menuItem);
        } catch (error) {
            console.error(`Error updating menu item: ${error}`);
        }
    }

    public async deleteMenuItem(menuItemId: number) {
        try {
            this.menuItemRepositoryObject.deleteMenuItem(menuItemId);
        } catch (error) {
            console.error(`Error deleting menu item: ${error}`);
        }
    }

    public async viewAllMenuItems(socket: net.Socket) {
        try {
            const menuItems = await this.menuItemRepositoryObject.getAllMenuItems();
            // console.log("Menu Items:", menuItems);
            socket.write(`Response_viewAllMenuItems;${JSON.stringify(menuItems)}`);
        } catch (error) {
            console.error(`Error fetching all menu item: ${error}`);
        }
    }
}
