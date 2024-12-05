import { ClientProtocol } from "../../Client/clientProtocol";
import readline from "readline";
import net from "net";
import { RoleBasedMenu } from "./roleBasedMenu";

export class AdminMenuOperations {
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

  public async adminMenu(userId: number) {
    console.log("\n");
    console.log("Menu For Admin:");
    console.log("1. Add Menu Item");
    console.log("2. Update Menu Item");
    console.log("3. Delete Menu Item");
    console.log("4. View All Menu Items");
    console.log(
      "5. View Discarded Menu Item List - (Should be done once a month)"
    );
    console.log("6. Logout");

    const option = await this.askQuestion("Choose an option: ");

    try {
      switch (option) {
        case "1":
          await this.addMenuItem(userId);
          break;
        case "2":
          await this.updateMenuItem(userId);
          break;
        case "3":
          await this.deleteMenuItem(userId);
          break;
        case "4":
          await this.viewAllMenuItems(userId);
          break;
        case "5":
          await this.viewDiscardedMenuItemsForAdmin(userId);
          break;
        case "6":
          this.logout(userId);
          break;
        default:
          console.log("Invalid option");
          await this.adminMenu(userId);
          break;
      }
    } catch (error) {
      console.error(`Admin menu error: ${error}`);
      await this.adminMenu(userId);
    }
  }

  public async addMenuItem(userId: number) {
    try {
      const name = await this.askQuestion("Enter item name: ");
      const priceStr = await this.askQuestion("Enter item price: ");
      const price = parseFloat(priceStr);
      const availabilityStr = await this.askQuestion(
        "Is the item available? (yes/no): "
      );
      const availability = availabilityStr.toLowerCase() === "yes";
      const mealTypeIdStr = await this.askQuestion(
        "Enter Meal Type Id(1 for breakfast, 2 For lunch, 3 for dinner) : "
      );
      const mealTypeId = parseInt(mealTypeIdStr);

      const dietaryType = await this.askAndValidate.call(
        this,
        "Enter Dietary Type of this food item (Vegetarian/Non Vegetarian/Eggetarian): ",
        ["Vegetarian", "Non Vegetarian", "Eggetarian"]
      );
      const spiceLevel = await this.askAndValidate.call(
        this,
        "Enter Spice Level of this food item (High/Medium/Low): ",
        ["High", "Medium", "Low"]
      );
      const cuisineType = await this.askAndValidate.call(
        this,
        "Enter Cuisine Type of this food item (North Indian/South Indian/Other): ",
        ["North Indian", "South Indian", "Other"]
      );
      const isSweetStr = await this.askQuestion(
        "Is the item is sweet? (yes/no): "
      );
      const isSweet = isSweetStr.toLowerCase() === "yes";

      ClientProtocol.sendRequest(
        this.client,
        "admin_addMenuItem",
        {},
        {
          name,
          price,
          availability,
          mealTypeId,
          dietaryType,
          spiceLevel,
          cuisineType,
          isSweet,
        },
        "json"
      );

      console.log("\nMenu Item added to Database successfully");

      ClientProtocol.sendRequest(
        this.client,
        "LogUserActivity",
        {},
        { userId, message: `Added Menu Item with name: ${name}` },
        "json"
      );

      await this.adminMenu(userId);
    } catch (error) {
      console.error(`Error adding menu item: ${error}`);
      await this.adminMenu(userId);
    }
  }

  public async updateMenuItem(userId: number) {
    try {
      const menuItemIdStr = await this.askQuestion("Enter Menu item ID: ");
      const menuItemId = parseInt(menuItemIdStr);
      const newName = await this.askQuestion("Enter new name of this item: ");
      const priceStr = await this.askQuestion(
        "Enter new price of this item: "
      );
      const newPrice = parseFloat(priceStr);
      const availabilityStr = await this.askQuestion(
        "Is the item available? (yes/no): "
      );
      const newAvailability = availabilityStr.toLowerCase() === "yes";
      const mealTypeIdStr = await this.askQuestion(
        "Enter Meal Type Id(1 for breakfast, 2 For lunch, 3 for dinner) : "
      );
      const newMealTypeId = parseInt(mealTypeIdStr);

      const newDietaryType = await this.askAndValidate.call(
        this,
        "Enter Dietary Type of this food item (Vegetarian/Non Vegetarian/Eggetarian): ",
        ["Vegetarian", "Non Vegetarian", "Eggetarian"]
      );
      const newSpiceLevel = await this.askAndValidate.call(
        this,
        "Enter Spice Level of this food item (High/Medium/Low): ",
        ["High", "Medium", "Low"]
      );
      const newCuisineType = await this.askAndValidate.call(
        this,
        "Enter Cuisine Type of this food item (North Indian/South Indian/Other): ",
        ["North Indian", "South Indian", "Other"]
      );
      const isSweetStr = await this.askQuestion(
        "Is the item is sweet? (yes/no): "
      );
      const newIsSweet = isSweetStr.toLowerCase() === "yes";

      ClientProtocol.sendRequest(
        this.client,
        "admin_updateMenuItem",
        {},
        {
          menuItemId,
          newName,
          newPrice,
          newAvailability,
          newMealTypeId,
          newDietaryType,
          newSpiceLevel,
          newCuisineType,
          newIsSweet,
        },
        "json"
      );

      console.log("\nMenu Item updated in Database successfully");

      ClientProtocol.sendRequest(
        this.client,
        "LogUserActivity",
        {},
        {
          userId,
          message: `Updated Menu Item with ID: ${menuItemId} and Name: ${newName}`,
        },
        "json"
      );

      await this.adminMenu(userId);
    } catch (error) {
      console.error(`Error updating menu item: ${error}`);
      await this.adminMenu(userId);
    }
  }

  public async deleteMenuItem(userId: number) {
    try {
      const menuItemIdStr = await this.askQuestion("Enter item ID: ");
      const menuItemIdToDelete = parseInt(menuItemIdStr);

      ClientProtocol.sendRequest(
        this.client,
        "admin_deleteMenuItem",
        {},
        { menuItemIdToDelete },
        "json"
      );

      console.log("\nMenu Item Deleted from Database successfully");

      ClientProtocol.sendRequest(
        this.client,
        "LogUserActivity",
        {},
        { userId, message: `Deleted Menu Item with ID: ${menuItemIdToDelete}` },
        "json"
      );

      await this.adminMenu(userId);
    } catch (error) {
      console.error(`Error deleting menu item: ${error}`);
      await this.adminMenu(userId);
    }
  }

  public async viewAllMenuItems(userId: number) {
    try {
      ClientProtocol.sendRequest(
        this.client,
        "admin_viewAllMenuItem",
        {},
        "No Payload Required",
        "string"
      );
    } catch (error) {
      console.error(`Error viewing all menu items: ${error}`);
    }
  }

  public async viewDiscardedMenuItemsForAdmin(userId: number) {
    try {
      ClientProtocol.sendRequest(
        this.client,
        "admin_viewDiscardedMenuItems",
        {},
        "No Payload Required",
        "string"
      );
    } catch (error) {
      console.error(`Error viewing discarded menu items: ${error}`);
    }
  }

  public async displayMenuForDiscardedItems(userId: number) {
    try {
      console.log("\nWhat would you like to do next?");
      console.log(
        "1. Remove the Food Item from Menu List (Should be done once a month)"
      );
      console.log("2. Get Detailed Feedback (Should be done once a month)");
      const choice = await this.askQuestion("Enter your choice (1 or 2): ");
      await this.handleChoice(choice, userId);
    } catch (error) {
      console.error(`Error displaying menu for discarded items: ${error}`);
      await this.displayMenuForDiscardedItems(userId);
    }
  }

  private async handleChoice(choice: string, userId: number) {
    try {
      if (choice === "1") {
        const menuItemIdStr = await this.askQuestion(
          "\nEnter the menu item id to remove from menu: "
        );
        const menuItemId = parseInt(menuItemIdStr);
        await this.removeFoodItemFromMenu(menuItemId, userId);
      } else if (choice === "2") {
        const menuItemIdStr = await this.askQuestion(
          "\nEnter the Menu item Id of which we want the detailed feedback: "
        );
        const menuItemId = parseInt(menuItemIdStr);
        await this.sendFeedbackNotification(menuItemId, userId);
      } else {
        console.log("Invalid choice. Please enter 1 or 2.");
        await this.displayMenuForDiscardedItems(userId);
      }
    } catch (error) {
      console.error(`Error handling choice: ${error}`);
      await this.displayMenuForDiscardedItems(userId);
    }
  }

  private async removeFoodItemFromMenu(menuItemId: number, userId: number) {
    try {
      const foodItemId = menuItemId;
      console.log(
        `Sending request to remove menu item ID ${foodItemId} from the menu...`
      );

      ClientProtocol.sendRequest(
        this.client,
        "admin_removeMenuItem",
        {},
        { foodItemId },
        "json"
      );

      console.log(
        `Menu Item with Menu Item Id: ${foodItemId} is removed successfully`
      );

      ClientProtocol.sendRequest(
        this.client,
        "LogUserActivity",
        {},
        { userId, message: `Removed Discarded Menu Item with ID: ${menuItemId}` },
        "json"
      );

      await this.adminMenu(userId);
    } catch (error) {
      console.error(`Error removing food item from menu: ${error}`);
      await this.adminMenu(userId);
    }
  }

  private async sendFeedbackNotification(menuItemId: number, userId: number) {
    try {
      console.log(`Sending Feedback Notification to all the Employees`);

      const menuItemIdToGetFeedback = menuItemId;
      ClientProtocol.sendRequest(
        this.client,
        "admin_sendDiscardedItemFeedbackNotification",
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
          message: `Sent Notification about getting feedback for Discarded Menu Item with ID: ${menuItemIdToGetFeedback}`,
        },
        "json"
      );

      await this.adminMenu(userId);
    } catch (error) {
      console.error(`Error sending feedback notification: ${error}`);
      await this.adminMenu(userId);
    }
  }
}