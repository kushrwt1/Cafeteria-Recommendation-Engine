import net from "net";
import readline from "readline";
import { DiscardedMenuItem } from "../Models/discardedMenuItem";
import { ClientProtocol } from "./clientProtocol";
import { AdminMenuOperations } from "../Features/RoleBasedMenus/adminMenuOperations";

export class AdminResponseHandler {
  private adminMenuOperationsObject!: AdminMenuOperations;

  constructor(
    private client: net.Socket,
    private rl: readline.Interface,
    private logout: (userId: number) => void
  ) {
    this.adminMenuOperationsObject = new AdminMenuOperations(
      this.client,
      this.rl,
      this.logout.bind(this)
    );
  }

  public handleViewAllMenuItemsResponse(body: any, userId: number) {
    try {
      const { menuItemsInStringFormat } = JSON.parse(body);
      const menuItems = JSON.parse(menuItemsInStringFormat);
      console.table(menuItems);

      ClientProtocol.sendRequest(
        this.client,
        "LogUserActivity",
        {},
        { userId: userId, message: "Viewed All Menu Items" },
        "json"
      );

      this.adminMenuOperationsObject.adminMenu(userId);
    } catch (error) {
      console.error("Error handling View All Menu Items response:", error);
      this.handleError(userId, "View All Menu Items");
    }
  }

  public handleViewDiscardedMenuItemsResponse(body: any, userId: number) {
    try {
      const { discardedMenuItemsInStringFormat } = JSON.parse(body);
      const discardedMenuItems: DiscardedMenuItem[] = JSON.parse(
        discardedMenuItemsInStringFormat
      );

      console.log("\nDiscarded Menu Items Are:");
      console.log(
        "========================================================================================="
      );

      if (discardedMenuItems.length === 0) {
        console.log("No discarded menu items.");
      } else {
        console.log("ID\tMenu Item ID\tDiscarded Date\tName");

        discardedMenuItems.forEach((item) => {
          console.log(
            `${item.id}\t${item.menu_item_id}\t\t${formatDate(
              item.discarded_date
            )}\t${item.name}`
          );
        });
      }

      console.log(
        "========================================================================================="
      );

      ClientProtocol.sendRequest(
        this.client,
        "LogUserActivity",
        {},
        { userId: userId, message: "Viewed All Discarded Menu Items" },
        "json"
      );

      this.adminMenuOperationsObject.displayMenuForDiscardedItems(userId);
    } catch (error) {
      console.error("Error handling View Discarded Menu Items response:", error);
      this.handleError(userId, "View Discarded Menu Items");
    }

    function formatDate(dateString: any) {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    }
  }

  private handleError(userId: number, operation: string) {
    console.error(`Operation "${operation}" failed for user ID ${userId}`);
    ClientProtocol.sendRequest(
      this.client,
      "LogUserActivity",
      {},
      { userId: userId, message: `Failed to ${operation}` },
      "json"
    );
    this.adminMenuOperationsObject.adminMenu(userId);
  }
}
