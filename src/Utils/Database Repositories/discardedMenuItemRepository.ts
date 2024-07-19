import { db } from "../../Database/database";
import { DiscardedMenuItem } from "../../Models/discardedMenuItem";

export class DiscardedMenuItemRepository {

  public async addDiscardedMenuItem(
    discardedMenuItem: DiscardedMenuItem
  ): Promise<void> {
    try {
      // Check if an item with the same menu_item_id already exists
      const existingItem = await this.getDiscardedMenuItemByMenuItemId(
        discardedMenuItem.menu_item_id
      );

      if (existingItem) {
        console.log(
          `Discarded menu item with menu_item_id ${discardedMenuItem.menu_item_id} already exists.`
        );
        return;
      }

      // If not exists, proceed with insertion
      const discardedDate = new Date(discardedMenuItem.discarded_date)
        .toISOString()
        .split("T")[0];
      await db.execute(
        "INSERT INTO Discarded_Menu_Item (menu_item_id, discarded_date, name) VALUES (?, ?, ?)",
        [discardedMenuItem.menu_item_id, discardedDate, discardedMenuItem.name]
      );

      console.log(
        `Discarded menu item with menu_item_id ${discardedMenuItem.menu_item_id} added to database.`
      );
    } catch (error) {
      console.error("Error adding discarded menu item:", error);
      throw error;
    }
  }

  private async getDiscardedMenuItemByMenuItemId(
    menuItemId: number
  ): Promise<DiscardedMenuItem | null> {
    const [rows] = await db.execute(
      "SELECT * FROM Discarded_Menu_Item WHERE menu_item_id = ?",
      [menuItemId]
    );
    const discardedMenuItems = rows as DiscardedMenuItem[];
    return discardedMenuItems.length > 0 ? discardedMenuItems[0] : null;
  }

  public async getAllDiscardedMenuItems(): Promise<DiscardedMenuItem[]> {
    const [rows] = await db.execute("SELECT * FROM Discarded_Menu_Item");
    return rows as DiscardedMenuItem[];
  }

  public async getDiscardedMenuItemById(
    id: number
  ): Promise<DiscardedMenuItem | null> {
    const [rows] = await db.execute(
      "SELECT * FROM Discarded_Menu_Item WHERE id = ?",
      [id]
    );
    const discardedMenuItems = rows as DiscardedMenuItem[];
    return discardedMenuItems.length > 0 ? discardedMenuItems[0] : null;
  }

  public async updateDiscardedMenuItem(
    discardedMenuItem: DiscardedMenuItem
  ): Promise<void> {
    const discardedDate = new Date(discardedMenuItem.discarded_date)
      .toISOString()
      .split("T")[0];
    await db.execute(
      "UPDATE Discarded_Menu_Item SET menu_item_id = ?, discarded_date = ?, name = ? WHERE id = ?",
      [
        discardedMenuItem.menu_item_id,
        discardedDate,
        discardedMenuItem.name,
        discardedMenuItem.id,
      ]
    );
  }

  public async deleteDiscardedMenuItem(id: number): Promise<void> {
    await db.execute("DELETE FROM Discarded_Menu_Item WHERE id = ?", [id]);
  }
}
