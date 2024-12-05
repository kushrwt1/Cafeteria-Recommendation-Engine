import { ClientProtocol } from "../../Client/clientProtocol";
import readline from "readline";
import net from "net";
import { RoleBasedMenu } from "./roleBasedMenu";

export class EmployeeMenuOperations {
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

  public async employeeMenu(userId: number) {
    console.log("\n");
    console.log("Menu For Employee:");
    console.log("1. See Notifications");
    console.log("2. View Today's menu");
    console.log("3. Give Feedback");
    console.log("4. View Menu Items");
    console.log("5. Update your Profile");
    console.log("6. Logout");

    const option = await this.askQuestion("Choose an option: ");

    try {
      switch (option) {
        case "1":
          await this.viewNotificationsMenu(userId);
          break;
          break;
        case "2":
          break;
        case "3":
          await this.giveFeedback(userId);
          break;
        case "4":
          this.viewAllMenuItemsForEmployee(userId);
          break;
        case "5":
          this.updateEmployeeProfile(userId);
          break;
        case "6":
          this.logout(userId);
          break;
        default:
          console.log("Invalid option");
          break;
      }
    } catch (error) {
      console.error(`Employee menu error: ${error}`);
      this.employeeMenu(userId);
    }
  }

  private async giveFeedback(userId: number) {
    const menuItemIdStr = await this.askQuestion("Enter menu item ID: ");
    const menuItemId = parseInt(menuItemIdStr);
    const ratingStr = await this.askQuestion("Enter rating (1-5): ");
    const rating = parseInt(ratingStr);
    const comment = await this.askQuestion("Enter comment: ");

    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    ClientProtocol.sendRequest(
      this.client,
      "employee_giveFeedback",
      {},
      { userId, menuItemId, rating, comment, today },
      "json"
    );

    console.log("Feedback submitted.");

    ClientProtocol.sendRequest(
      this.client,
      "LogUserActivity",
      {},
      {
        userId,
        message: `Employee submitted feedback for menu Item with ID: ${menuItemId}`,
      },
      "json"
    );

    this.employeeMenu(userId);
  }

  private async viewNotificationsMenu(userId: number) {
    console.log("\n");
    console.log("Fetching notifications...");

    const employeeId = userId;
    ClientProtocol.sendRequest(
      this.client,
      "employee_viewNotifications",
      {},
      { employeeId },
      "json"
    );
  }

  public async handleNotificationsResponseFromServer(
    notifications: any,
    userId: number
  ) {

    if (notifications.length === 0) {
      console.log("You don't have any notifications.");
      this.employeeMenu(userId);
      return;
    }

    console.log("\nNotification Menu:");
    notifications.forEach((notification: any, index: number) => {
      console.log(`${index + 1}. ${notification.message}`);
    });

    const optionStr = await this.askQuestion(
      "\nChoose a Notification to view: "
    );
    const selectedNotification = notifications[parseInt(optionStr) - 1];

    if (
      selectedNotification.message ===
      "See Rolled Out Menu and Vote For an Item"
    ) {
      const notificationId = selectedNotification.id;
      const employeeId1 = userId;
      ClientProtocol.sendRequest(
        this.client,
        "employee_viewRolledOutMenu",
        {},
        { notificationId, employeeId1 },
        "json"
      );
    } else if (selectedNotification.message.includes("Menu item is added")) {
      console.log("\nNew Menu Item Is Added");
      const notificationIdToMark = selectedNotification.id;
      ClientProtocol.sendRequest(
        this.client,
        "employee_markNotificationAsSeen",
        {},
        { notificationIdToMark },
        "json"
      );

      ClientProtocol.sendRequest(
        this.client,
        "LogUserActivity",
        {},
        { userId, message: `Viewed Notification for Menu Item is added` },
        "json"
      );

      this.employeeMenu(userId);
    } else if (
      selectedNotification.message.includes(
        "Give Detailed Feedback On Discarded Menu Item"
      )
    ) {
      const commandParts = selectedNotification.message.split(":");
      const argumentParts = commandParts[1].split(">");
      const menuItemId = parseInt(argumentParts[0].trim());
      const menuItemName = argumentParts[1].trim();
      this.getDetailedFeedback(
        userId,
        selectedNotification.id,
        menuItemId,
        menuItemName
      );
    } else {
      console.log("Unknown notification type.");
      this.employeeMenu(userId);
    }
  }
  public async viewRolledOutMenuNotification(
    rolledOutMenu: any[],
    userId: number,
    notificationId: number,
    isEmployeeProfileExists: string
  ) {
    try {
      if (isEmployeeProfileExists === "Yes") {
        console.log("\nYour Employee Profile Exists.");
        console.log(
          "Showing rolled Out Menu according to Your profile Preferences....."
        );
      } else {
        console.log("\nYour Employee Profile Does Not Exists.");
      }

      console.log(`\nFetching rolled-out menu for user ${userId}...`);
      // Group menu items by meal_type_id
      const groupedMenu: { [key: number]: { mealType: string; items: any[] } } =
        {
          1: { mealType: "Breakfast", items: [] },
          2: { mealType: "Lunch", items: [] },
          3: { mealType: "Dinner", items: [] },
        };

      rolledOutMenu.forEach((item) => {
        const mealType = groupedMenu[item.meal_type_id];
        if (mealType) {
          mealType.items.push(item);
        }
      });

      console.log(
        "========================================================================================="
      );
      console.log("Rolled out menu items: ...");
      Object.values(groupedMenu).forEach((meal) => {
        console.log(`\n${meal.mealType}:`);
        meal.items.forEach((item) => {
          console.log(`ID: ${item.menu_item_id}, Name: ${item.name}`);
        });
      });
      console.log(
        "========================================================================================="
      );

      await this.voteForTodaysMenu(userId, notificationId, rolledOutMenu);

    } catch (error) {
      console.error(`Error viewing rolled-out menu notification: ${error}`);
    }
  }

  private async voteForTodaysMenu(
    userId: number,
    notificationId: number,
    rolledOutMenu: any[]
  ) {
    try {
      console.log(`\nVote For Today's Menu:`);

      // Group menu items by meal_type_id
      const groupedMenu: { [key: number]: number[] } = {
        1: [],
        2: [],
        3: [],
      };

      rolledOutMenu.forEach((item) => {
        if (groupedMenu[item.meal_type_id]) {
          groupedMenu[item.meal_type_id].push(item.menu_item_id);
        }
      });

      
      const breakfastItemId = await this.getValidItemId(
        "Enter item ID you want to vote for breakfast: ",
        groupedMenu[1]
      );
      const lunchItemId = await this.getValidItemId(
        "Enter item ID you want to vote for lunch: ",
        groupedMenu[2]
      );
      const dinnerItemId = await this.getValidItemId(
        "Enter item ID you want to vote for dinner: ",
        groupedMenu[3]
      );

      console.log(
        "Votes submitted for items - Breakfast:",
        breakfastItemId,
        ", Lunch:",
        lunchItemId,
        ", Dinner:",
        dinnerItemId
      );

      const notificationIdToMarkAsSeen = notificationId;
      const employeeId2 = userId;
      ClientProtocol.sendRequest(
        this.client,
        "employee_markNotificationAsSeen_updateVotedItem",
        {},
        {
          notificationIdToMarkAsSeen,
          breakfastItemId,
          lunchItemId,
          dinnerItemId,
          employeeId2,
        },
        "json"
      );

      ClientProtocol.sendRequest(
        this.client,
        "LogUserActivity",
        {},
        {
          userId,
          message: `Viewed rolled Out Menu and Voted for Today's menu`,
        },
        "json"
      );

      this.employeeMenu(userId);
    } catch (error) {
      console.error(`Error voting for today's menu: ${error}`);
    }
  }

  private async getValidItemId(
    prompt: string,
    validItemIds: number[]
  ): Promise<number> {
    while (true) {
      const itemIdStr = await this.askQuestion(prompt);
      const itemId = parseInt(itemIdStr.trim());

      if (validItemIds.includes(itemId)) {
        return itemId;
      } else {
        console.log("Invalid item ID. Please enter a valid item ID.");
      }
    }
  }

  private async viewAllMenuItemsForEmployee(userId: number) {
    const employeeUserId = userId;
    ClientProtocol.sendRequest(
      this.client,
      "employee_viewAllMenuItem",
      {},
      { employeeUserId },
      "json"
    );
  }

  private async getDetailedFeedback(
    userId: number,
    notificationId: number,
    menuItemId: number,
    menuItemName: string
  ) {
    try {
      console.log(
        `\nWe are trying to improve your experience on Food Item: ${menuItemName} with ID: ${menuItemId}. Please provide your feedback and help us`
      );
      const dislikes = await this.askQuestion(
        `What didn’t you like about ${menuItemName}: `
      );
      const desiredTaste = await this.askQuestion(
        `How would you like ${menuItemName} to taste: `
      );
      const momRecipe = await this.askQuestion(`Share your mom’s recipe: `);
      const notificationIdToMarkAsSeen1 = notificationId;
      const discardedMenuItemId = menuItemId;
      ClientProtocol.sendRequest(
        this.client,
        "employee_markNotificationAsSeen_sendDiscardedItemFeedbackToServer",
        {},
        {
          notificationIdToMarkAsSeen1,
          dislikes,
          desiredTaste,
          momRecipe,
          discardedMenuItemId,
        },
        "json"
      );

      console.log(
        "Feedback is submitted successfully. Thanks For giving your feedback"
      );

      ClientProtocol.sendRequest(
        this.client,
        "LogUserActivity",
        {},
        {
          userId,
          message: `Feedback about Discarded Item with ID: ${menuItemId} is submitted`,
        },
        "json"
      );

      this.employeeMenu(userId);
    } catch (error) {
      console.error(`Error in sending Feedback Request to Server: ${error}`);
    }
  }

  private async updateEmployeeProfile(userId: number) {
    try {
      console.log(
        "\nPlease answer these questions to know about your preferences: "
      );
      const dietaryPreference = await this.askAndValidate.call(
        this,
        "1) Please select one (Vegetarian, Non Vegetarian, Eggetarian): ",
        ["Vegetarian", "Non Vegetarian", "Eggetarian"]
      );
      const spiceLevel = await this.askAndValidate.call(
        this,
        "2) Please select your spice level (High, Medium, Low): ",
        ["High", "Medium", "Low"]
      );
      const cuisinePreference = await this.askAndValidate.call(
        this,
        "3) What do you prefer most (North Indian, South Indian, Other): ",
        ["North Indian", "South Indian", "Other"]
      );
      const sweetToothAnswer = await this.askAndValidate.call(
        this,
        "4) Do you have a sweet tooth (Yes, No): ",
        ["Yes", "No"]
      );
      const sweetTooth = sweetToothAnswer === "Yes";

      console.log("Your preferences have been recorded.");

      const employeeId4 = userId;
      ClientProtocol.sendRequest(
        this.client,
        "employee_updateEmployeeProfile",
        {},
        {
          employeeId4,
          dietaryPreference,
          spiceLevel,
          cuisinePreference,
          sweetTooth,
        },
        "json"
      );

      console.log("Employee Profile Updated Successfully");

      ClientProtocol.sendRequest(
        this.client,
        "LogUserActivity",
        {},
        { userId, message: `Employee Profile is updated` },
        "json"
      );

      this.employeeMenu(userId);
    } catch (error) {
      console.error(
        `Error in sending Update Employee Profile Request to Server: ${error}`
      );
    }
  }
}
