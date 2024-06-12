import { db } from '../Database/database';

export class UserController {
    public async giveFeedback(userId: number, itemId: number, rating: number, comment: string): Promise<void> {
        await db.execute('INSERT INTO feedback (user_id, item_id, rating, comment) VALUES (?, ?, ?, ?)', [userId, itemId, rating, comment]);
    }

    public async getNotification() {

    }

    public async selectMenuItems() {

    }

    public async sendSelectedMenuItems() {

    }
}