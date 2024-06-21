"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackRepository = void 0;
const database_1 = require("../../Database/database");
class FeedbackRepository {
    getAllFeedback() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [rows] = yield database_1.db.execute('SELECT * FROM Feedback');
                return rows;
            }
            catch (error) {
                console.error(`Error fetching feedback: ${error instanceof Error ? error.message : error}`);
                throw new Error('Database query failed');
            }
        });
    }
    getFeedbackById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.db.execute('SELECT * FROM Feedback WHERE id = ?', [id]);
            const feedbacks = rows;
            return feedbacks.length > 0 ? feedbacks[0] : null;
        });
    }
    addFeedback(feedback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const date = new Date(feedback.date).toISOString().split('T')[0];
                yield database_1.db.execute('INSERT INTO Feedback (comment, rating, menu_item_id, user_id, date) VALUES (?, ?, ?, ?, ?)', [feedback.comment, feedback.rating, feedback.menu_item_id, feedback.user_id, feedback.date]);
            }
            catch (error) {
                console.error(`Error adding feedback: ${error instanceof Error ? error.message : error}`);
                throw new Error('Database query failed');
            }
        });
    }
    updateFeedback(feedback) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.execute('UPDATE Feedback SET comment = ?, rating = ?, menu_item_id = ?, user_id = ?, date = ? WHERE id = ?', [feedback.comment, feedback.rating, feedback.menu_item_id, feedback.user_id, feedback.date, feedback.id]);
        });
    }
    deleteFeedback(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.execute('DELETE FROM Feedback WHERE id = ?', [id]);
        });
    }
}
exports.FeedbackRepository = FeedbackRepository;
