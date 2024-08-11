import { ClientProtocol } from "../../Client/clientProtocol";
import readline from "readline";
import net from "net";
import { RoleBasedMenu } from "./roleBasedMenu";

export class ChefMenuOperations {
  constructor(
    private client: net.Socket,
    private rl: readline.Interface,
    private logout: (userId: number) => void
  ) {}

  private askQuestion(question: string): Promise<string> {
    return new Promise((resolve) => this.rl.question(question, resolve));
  }

  private async askAndValidate(question: any, validValues: any) {
    let answer;
    while (true) {
      answer = await this.askQuestion(question);
      if (validValues.includes(answer)) {
        break;
      } else {
        console.log(
          `Invalid value. Please choose from: ${validValues.join(", ")}`
        );
      }
    }
    return answer;
  }

  public async chefMenu(userId: number) {
    console.log("\n");
    console.log("Menu For Chefs:");
    console.log("1. Get Recommended Items for Next day Menu");
    console.log("2. Roll out menu");
    console.log("3. Update Next day menu as per selected Items by User");
    console.log("4. View All Menu Items");
    console.log(
      "5. View Discarded Menu Item List - (Should be done once a month)"
    );
    console.log("6. Logout");

    const option = await this.askQuestion("Choose an option: ");

    try {
      switch (option) {
        case "1":
          await this.getRecommendedItems();
          break;
        case "2":
          await this.rollOutMenu(userId);
          break;
        case "3":
          await this.updateFinalMenu();
          break;
        case "4":
          await this.viewAllMenuItemsForChef();
          break;
        case "5":
          await this.viewDiscardedMenuItemsForChef();
          break;
        case "6":
          this.logout(userId);
          break;
        default:
          console.log("Invalid option");
          await this.chefMenu(userId);
          break;
      }
    } catch (error) {
      console.error(`Chef menu error: ${error}`);
      await this.chefMenu(userId);
    }
  }

  private async getRecommendedItems() {
    try {
      ClientProtocol.sendRequest(
        this.client,
        "chef_getRecommendedItems",
        {},
        "No Payload Required",
        "string"
      );
    } catch (error) {
      console.error(`Error getting recommended items: ${error}`);
    }
  }

  private async rollOutMenu(userId: number) {
    try {
      console.log("Rolling out menu...");
      const mealTypes = ["breakfast", "lunch", "dinner"];
      const selectedItems: { mealType: string; menuItemId: number }[] = [];

      for (const mealType of mealTypes) {
        const itemIdsStr = await this.askQuestion(
          `Enter item IDs for ${mealType} (comma-separated): `
        );
        const itemIds = itemIdsStr.split(",").map((id) => parseInt(id.trim()));
        itemIds.forEach((menuItemId) =>
          selectedItems.push({ mealType, menuItemId })
        );
      }

      const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

      const selectedItemsInStringFormat = JSON.stringify(selectedItems);
      ClientProtocol.sendRequest(
        this.client,
        "chef_rollOutMenu",
        {},
        { today, selectedItemsInStringFormat },
        "json"
      );

      console.log("Menu rolled out.");

      ClientProtocol.sendRequest(
        this.client,
        "LogUserActivity",
        {},
        { userId, message: `Rolled Out Menu Items for Today To Employees` },
        "json"
      );

      await this.chefMenu(userId);
    } catch (error) {
      console.error(`Error rolling out menu: ${error}`);
      await this.chefMenu(userId);
    }
  }

  private async updateFinalMenu() {
    try {
      // Add logic for updating the final menu here
    } catch (error) {
      console.error(`Error updating final menu: ${error}`);
    }
  }

  private async viewAllMenuItemsForChef() {
    try {
      ClientProtocol.sendRequest(
        this.client,
        "chef_viewAllMenuItem",
        {},
        "No Payload Required",
        "string"
      );
    } catch (error) {
      console.error(`Error viewing all menu items: ${error}`);
    }
  }

  private async viewDiscardedMenuItemsForChef() {
    try {
      ClientProtocol.sendRequest(
        this.client,
        "chef_viewDiscardedMenuItems",
        {},
        "No Payload Required",
        "string"
      );
    } catch (error) {
      console.error(`Error viewing discarded menu items: ${error}`);
    }
  }

  public async displayMenuForDiscardedItemsForChef(userId: number) {
    try {
      console.log("\nWhat would you like to do next?");
      console.log(
        "1. Remove the Food Item from Menu List (Should be done once a month)"
      );
      console.log("2. Get Detailed Feedback (Should be done once a month)");
      const choice = await this.askQuestion("Enter your choice (1 or 2): ");
      await this.handleChoiceForChef(choice, userId);
    } catch (error) {
      console.error(
        `Error displaying menu for discarded items: ${error}`
      );
      await this.displayMenuForDiscardedItemsForChef(userId);
    }
  }

  private async handleChoiceForChef(choice: string, userId: number) {
    try {
      if (choice === "1") {
        const menuItemIdStr = await this.askQuestion(
          "\nEnter the menu item id to remove from menu: "
        );
        const menuItemId = parseInt(menuItemIdStr);
        await this.removeFoodItemFromMenuByChef(menuItemId, userId);
      } else if (choice === "2") {
        const menuItemIdStr = await this.askQuestion(
          "\nEnter the Menu item Id of which the detailed feedback is needed: "
        );
        const menuItemId = parseInt(menuItemIdStr);
        await this.sendFeedbackNotificationFromChef(menuItemId, userId);
      } else {
        console.log("Invalid choice. Please enter 1 or 2.");
        await this.displayMenuForDiscardedItemsForChef(userId);
      }
    } catch (error) {
      console.error(`Error handling choice: ${error}`);
      await this.displayMenuForDiscardedItemsForChef(userId);
    }
  }

  private async removeFoodItemFromMenuByChef(
    menuItemId: number,
    userId: number
  ) {
    try {
      console.log(
        `Sending request to remove menu item ID ${menuItemId} from the menu...`
      );

      const foodItemId = menuItemId;
      ClientProtocol.sendRequest(
        this.client,
        "chef_removeMenuItem",
        {},
        { foodItemId },
        "json"
      );

      console.log(
        `Menu Item with Menu Item Id: ${menuItemId} is removed successfully`
      );

      ClientProtocol.sendRequest(
        this.client,
        "LogUserActivity",
        {},
        {
          userId,
          message: `Removed Discarded Menu Item with ID: ${menuItemId}`,
        },
        "json"
      );

      await this.chefMenu(userId);
    } catch (error) {
      console.error(
        `Error removing food item from menu by chef: ${error}`
      );
      await this.chefMenu(userId);
    }
  }

  private async sendFeedbackNotificationFromChef(
    menuItemId: number,
    userId: number
  ) {
    try {
      console.log(
        `Sending Notification to all the employees For Giving Detailed Feedback.....`
      );

      const menuItemIdToGetFeedback = menuItemId;
      ClientProtocol.sendRequest(
        this.client,
        "chef_sendDiscardedItemFeedbackNotification",
        {},
        { menuItemIdToGetFeedback },
        "json"
      );

      console.log(`Notification to all Employees Sent Successfully`);

      ClientProtocol.sendRequest(
        this.client,
        "LogUserActivity",
        {},
        {
          userId,
          message: `Sent Notification about getting feedback for Discarded Menu Item with ID: ${menuItemId}`,
        },
        "json"
      );

      await this.chefMenu(userId);
    } catch (error) {
      console.error(
        `Error sending feedback notification from chef: ${error}`
      );
      await this.chefMenu(userId);
    }
  }
}
