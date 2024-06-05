import { MenuItem } from "../Models/menuItem";
import { db } from "../Utils/database";

export class FeedbackService {
    private comment: string;
    private rating: number;
    private itemName: string;

    public async setComment() {
        const [rows] = await db.execute('SELECT * FROM users WHERE id = ? AND name = ?', [id, name]);
    }

    public setRating(): void {
        
    }
}