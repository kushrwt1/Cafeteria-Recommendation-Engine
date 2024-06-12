import { db } from '../Database/database';

export class ChefController {
    
    public async getRecommendedItems() {

    }
    
    public async selectItemsFromMenu(){

    }

    public async makeMenu() {
        this.getRecommendedItems();
        this.selectItemsFromMenu();
    }

    public async getSelectedMenuItemsFromUsers() {

    }

    public async rollOutMenu(items: number[]): Promise<void> {
        // Logic to roll out menu items for the next day
        // Example implementation, adapt as necessary
        await db.execute('INSERT INTO rolled_out_menu (item_id) VALUES ?', [items.map(item => [item])]);
    }


}
