import { db } from "../../Database/database";
import { EmployeeMenuSelections } from "../../Models/employeeMenuSelection";

export class EmployeeMenuSelectionRepository {
  public async getAllEmployeeMenuSelections(): Promise<
    EmployeeMenuSelections[]
  > {
    const [rows] = await db.execute("SELECT * FROM Employee_Menu_Selections");
    return rows as EmployeeMenuSelections[];
  }

  public async getEmployeeMenuSelectionById(
    id: number
  ): Promise<EmployeeMenuSelections | null> {
    const [rows] = await db.execute(
      "SELECT * FROM Employee_Menu_Selections WHERE id = ?",
      [id]
    );
    const userMenuSelections = rows as EmployeeMenuSelections[];
    return userMenuSelections.length > 0 ? userMenuSelections[0] : null;
  }

  public async addEmployeeMenuSelection(
    userMenuSelection: EmployeeMenuSelections
  ): Promise<void> {
    await db.execute(
      "INSERT INTO Employee_Menu_Selections (user_id, menu_item_id, selection_date) VALUES (?, ?, ?)",
      [
        userMenuSelection.user_id,
        userMenuSelection.menu_item_id,
        userMenuSelection.selection_date,
      ]
    );
  }

  public async updateEmployeeMenuSelection(
    userMenuSelection: EmployeeMenuSelections
  ): Promise<void> {
    await db.execute(
      "UPDATE Employee_Menu_Selections SET user_id = ?, menu_item_id = ?, selection_date = ? WHERE id = ?",
      [
        userMenuSelection.user_id,
        userMenuSelection.menu_item_id,
        userMenuSelection.selection_date,
        userMenuSelection.id,
      ]
    );
  }

  public async deleteEmployeeMenuSelection(id: number): Promise<void> {
    await db.execute("DELETE FROM Employee_Menu_Selections WHERE id = ?", [id]);
  }
}
