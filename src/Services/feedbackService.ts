import { MenuItem } from "../Models/menuItem";
import { db } from "../Database/database";

export class FeedbackService {
    private comment: string;
    private rating: number;
    private menuItemId: number;
    private userId: number;


    constructor(comment: string, rating: number, menuItemId: number, userId: number) {
        this.comment = comment;
        this.rating = rating;
        this.menuItemId = menuItemId;
        this.userId = userId;
    }
    // public async setComment() {
    //     const [rows] = await db.execute('SELECT * FROM users WHERE id = ? AND name = ?', [id, name]);
    // }

    public setRating(): void {
        
    }
}