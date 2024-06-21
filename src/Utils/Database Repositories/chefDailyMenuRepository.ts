import { db } from '../../Database/database';
import { ChefDailyMenus } from '../../Models/chefDailyMenu';

export class ChefDailyMenuRepository {

    public async addDailyMenu(dailyMenu: ChefDailyMenus): Promise<void> {
        const date = new Date(dailyMenu.date).toISOString().split('T')[0];
        await db.execute('INSERT INTO Chef_Daily_Menus (menu_item_id, date) VALUES (?, ?)', [dailyMenu.menu_item_id, dailyMenu.date]);
    }

    public async getAllDailyMenus(): Promise<ChefDailyMenus[]> {
        const [rows] = await db.execute('SELECT * FROM Chef_Daily_Menus');
        return rows as ChefDailyMenus[];
    }

    public async getDailyMenuById(id: number): Promise<ChefDailyMenus | null> {
        const [rows] = await db.execute('SELECT * FROM Chef_Daily_Menus WHERE id = ?', [id]);
        const dailyMenus = rows as ChefDailyMenus[];
        return dailyMenus.length > 0 ? dailyMenus[0] : null;
    }

    public async updateDailyMenu(dailyMenu: ChefDailyMenus): Promise<void> {
        await db.execute('UPDATE Chef_Daily_Menus SET menu_item_id = ?, date = ? WHERE id = ?', [dailyMenu.menu_item_id, dailyMenu.date, dailyMenu.id]);
    }

    public async deleteDailyMenu(id: number): Promise<void> {
        await db.execute('DELETE FROM Chef_Daily_Menus WHERE id = ?', [id]);
    }

    public async getTodaysRolledOutMenu(): Promise<ChefDailyMenus[] | null> {
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
    
        // Query the database to get the menu for today's date
        const [rows] = await db.execute('SELECT * FROM Chef_Daily_Menus WHERE DATE(date) = ?', [today]);
        
        // Check if any menu is found
        // return rows as ChefDailyMenus[];
        const rolledOutMenu = rows as ChefDailyMenus[];
        return rolledOutMenu.length > 0 ? rolledOutMenu : null;
        
    }
}
