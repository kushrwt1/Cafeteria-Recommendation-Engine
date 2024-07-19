import { db } from "../../Database/database";
import { Feedback } from "../../Models/feedback";

export class FeedbackRepository {
  public async getAllFeedback(): Promise<Feedback[]> {
    try {
      const [rows] = await db.execute("SELECT * FROM Feedback");
      return rows as Feedback[];
    } catch (error) {
      console.error(
        `Error fetching feedback: ${
          error instanceof Error ? error.message : error
        }`
      );
      throw new Error("Database query failed");
    }
  }

  public async getFeedbackById(id: number): Promise<Feedback | null> {
    const [rows] = await db.execute("SELECT * FROM Feedback WHERE id = ?", [
      id,
    ]);
    const feedbacks = rows as Feedback[];
    return feedbacks.length > 0 ? feedbacks[0] : null;
  }

  public async addFeedback(feedback: Feedback): Promise<void> {
    try {
      const date = new Date(feedback.date).toISOString().split("T")[0];
      await db.execute(
        "INSERT INTO Feedback (comment, rating, menu_item_id, user_id, date) VALUES (?, ?, ?, ?, ?)",
        [
          feedback.comment,
          feedback.rating,
          feedback.menu_item_id,
          feedback.user_id,
          feedback.date,
        ]
      );
    } catch (error) {
      console.error(
        `Error adding feedback: ${
          error instanceof Error ? error.message : error
        }`
      );
      throw new Error("Database query failed");
    }
  }

  public async updateFeedback(feedback: Feedback): Promise<void> {
    await db.execute(
      "UPDATE Feedback SET comment = ?, rating = ?, menu_item_id = ?, user_id = ?, date = ? WHERE id = ?",
      [
        feedback.comment,
        feedback.rating,
        feedback.menu_item_id,
        feedback.user_id,
        feedback.date,
        feedback.id,
      ]
    );
  }

  public async deleteFeedback(id: number): Promise<void> {
    await db.execute("DELETE FROM Feedback WHERE id = ?", [id]);
  }
}
