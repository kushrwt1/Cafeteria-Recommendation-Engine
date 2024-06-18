import { db } from '../../Database/database';
import { MenuItem } from '../../Models/menuItem';

export class MenuItemRepository {
    
    public async getAllMenuItems(): Promise<MenuItem[]> {
        const [rows] = await db.execute('SELECT * FROM Menu_Items');
        return rows as MenuItem[];
    }

    public async getMenuItemById(menu_item_id: number): Promise<MenuItem | null> {
        const [rows] = await db.execute('SELECT * FROM Menu_Items WHERE menu_item_id = ?', [menu_item_id]);
        const menuItems = rows as MenuItem[];
        return menuItems.length > 0 ? menuItems[0] : null;
    }

    public async addMenuItem(menuItem: MenuItem): Promise<void> {
        await db.execute('INSERT INTO Menu_Items (name, availability, price, meal_type_id) VALUES (?, ?, ?, ?)', [menuItem.name, menuItem.availability, menuItem.price, menuItem.meal_type_id]);
        console.log("Menu Item added successfully");
    }

    public async updateMenuItem(menuItem: MenuItem): Promise<void> {
        await db.execute('UPDATE Menu_Items SET name = ?, availability = ?, price = ?, meal_type_id = ? WHERE menu_item_id = ?', [menuItem.name, menuItem.availability, menuItem.price, menuItem.meal_type_id, menuItem.menu_item_id]);
    }

    public async deleteMenuItem(menu_item_id: number): Promise<void> {
        await db.execute('DELETE FROM Menu_Items WHERE menu_item_id = ?', [menu_item_id]);
    }
}
