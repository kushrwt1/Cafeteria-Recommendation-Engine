"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackService = void 0;
class FeedbackService {
    constructor(comment, rating, menuItemId, userId) {
        this.comment = comment;
        this.rating = rating;
        this.menuItemId = menuItemId;
        this.userId = userId;
    }
    // public async setComment() {
    //     const [rows] = await db.execute('SELECT * FROM users WHERE id = ? AND name = ?', [id, name]);
    // }
    setRating() {
    }
}
exports.FeedbackService = FeedbackService;
