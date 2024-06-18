import { db } from '../Database/database';

export class UserController {
    public async giveFeedback(userId: number, itemId: number, rating: number, comment: string) {
        try {
            await db.execute('INSERT INTO Feedback (comment, rating, menu_item_id, user_id) VALUES (?, ?, ?, ?)', [comment, rating, itemId, userId]);
        } catch (error) {
            console.error(`Error submitting feedback: ${error}`);
        }
    }

    public async getNotification() {

    }

    public async selectMenuItems() {

    }

    public async sendSelectedMenuItems() {

    }
}