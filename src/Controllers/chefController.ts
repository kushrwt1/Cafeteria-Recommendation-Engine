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

    public async rollOutMenu(menuItemIds: number[]) {
        try {
            await db.execute('INSERT INTO Daily_Menu (menu_item_id, date) VALUES ?', [menuItemIds.map(id => [id, new Date()])]);
        } catch (error) {
            console.error(`Error rolling out menu: ${error}`);
        }
    }


}
