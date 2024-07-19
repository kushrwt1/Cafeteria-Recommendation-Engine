import { db } from "../../Database/database";
import { DiscardedFoodItemFeedback } from "../../Models/discardedFoodItemFeedback";

export class DiscardedFoodItemFeedbackRepository {
  public async addFeedback(feedback: DiscardedFoodItemFeedback): Promise<void> {
    const feedbackDate = new Date(feedback.feedback_date)
      .toISOString()
      .split("T")[0];
    await db.execute(
      "INSERT INTO Discarded_Food_Item_Feedback (menu_item_id, dislikes, desired_taste, mom_recipe, feedback_date) VALUES (?, ?, ?, ?, ?)",
      [
        feedback.menu_item_id,
        feedback.dislikes,
        feedback.desired_taste,
        feedback.mom_recipe,
        feedbackDate,
      ]
    );
    console.log(
      `Feedback For Discarded Food Item with Item Id: ${feedback.menu_item_id} is added successfully`
    );
  }

  public async getAllFeedback(): Promise<DiscardedFoodItemFeedback[]> {
    const [rows] = await db.execute(
      "SELECT * FROM Discarded_Food_Item_Feedback"
    );
    return rows as DiscardedFoodItemFeedback[];
  }

  public async getFeedbackById(
    id: number
  ): Promise<DiscardedFoodItemFeedback | null> {
    const [rows] = await db.execute(
      "SELECT * FROM Discarded_Food_Item_Feedback WHERE id = ?",
      [id]
    );
    const feedbacks = rows as DiscardedFoodItemFeedback[];
    return feedbacks.length > 0 ? feedbacks[0] : null;
  }

  public async updateFeedback(
    feedback: DiscardedFoodItemFeedback
  ): Promise<void> {
    const feedbackDate = new Date(feedback.feedback_date)
      .toISOString()
      .split("T")[0];
    await db.execute(
      "UPDATE Discarded_Food_Item_Feedback SET menu_item_id = ?, dislikes = ?, desired_taste = ?, mom_recipe = ?, feedback_date = ? WHERE id = ?",
      [
        feedback.menu_item_id,
        feedback.dislikes,
        feedback.desired_taste,
        feedback.mom_recipe,
        feedbackDate,
        feedback.id,
      ]
    );
  }

  public async deleteFeedback(id: number): Promise<void> {
    await db.execute("DELETE FROM Discarded_Food_Item_Feedback WHERE id = ?", [
      id,
    ]);
  }
}
