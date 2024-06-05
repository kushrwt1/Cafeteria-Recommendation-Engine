import { db } from '../Utils/database';
import { MenuItem } from '../Models/menuItem';

export class AdminController {
    public async addMenuItem(item: MenuItem): Promise<void> {
        await db.execute('INSERT INTO menu_items (name, price, availability) VALUES (?, ?, ?)', [item.name, item.price, item.availability]);
    }

    public async updateMenuItem(item: MenuItem): Promise<void> {
        await db.execute('UPDATE menu_items SET name = ?, price = ?, availability = ? WHERE id = ?', [item.name, item.price, item.availability, item.id]);
    }

    public async deleteMenuItem(id: number): Promise<void> {
        await db.execute('DELETE FROM menu_items WHERE id = ?', [id]);
    }

    public async viewMenuItem(id: number): Promise<void> {
        await db.execute('DELETE FROM menu_items WHERE id = ?', [id]);
    }
}