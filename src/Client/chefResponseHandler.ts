import net from "net";
import readline from "readline";
import { DiscardedMenuItem } from "../Models/discardedMenuItem";
import { ClientProtocol } from "./clientProtocol";
import { ChefMenuOperations } from "../Features/RoleBasedMenus/chefMenuOperations";

export class ChefResponseHandler {
  private chefMenuOperationsObject!: ChefMenuOperations;

  constructor(
    private client: net.Socket,
    private rl: readline.Interface,
    private logout: (userId: number) => void
  ) {
    this.chefMenuOperationsObject = new ChefMenuOperations(
      this.client,
      this.rl,
      this.logout.bind(this)
    );
  }

  public handleGetRecommendedItemsResponse(body: any, userId: number) {
    try {
      const { recommendedItemsInStringFormat } = JSON.parse(body);
      const recommendedItems = JSON.parse(recommendedItemsInStringFormat);

      console.log("Recommended Items for Next Day Menu:");
      console.log(
        "========================================================================================="
      );
      const recommendedItemsByMealType: { [key: number]: MealTypeItems } = {
        1: { mealType: "Breakfast", items: [] },
        2: { mealType: "Lunch", items: [] },
        3: { mealType: "Dinner", items: [] },
      };

      // Categorize items by meal_type_id
      recommendedItems.forEach(
        (item: {
          menu_item_id: number;
          name: string;
          meal_type_id: number;
          compositeScore: number;
        }) => {
          if (recommendedItemsByMealType[item.meal_type_id]) {
            recommendedItemsByMealType[item.meal_type_id].items.push(item);
          }
        }
      );

      Object.values(recommendedItemsByMealType).forEach((meal) => {
        if (meal.items.length > 0) {
          console.log(`${meal.mealType}:`);
          meal.items.forEach(
            (item: {
              menu_item_id: number;
              name: string;
              compositeScore: number;
            }) => {
              console.log(
                `  ID: ${item.menu_item_id}, Name: ${
                  item.name
                }, Average Rating: ${item.compositeScore.toFixed(2)}`
              );
            }
          );
        }
      });
      console.log(
        "========================================================================================="
      );

      ClientProtocol.sendRequest(
        this.client,
        "LogUserActivity",
        {},
        { userId: userId, message: "Viewed All Recommended Menu Items" },
        "json"
      );

      this.chefMenuOperationsObject.chefMenu(userId);
    } catch (error) {
      console.error("Error handling Get Recommended Items response:", error);
      this.handleError(userId, "Get Recommended Items");
    }
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

      this.chefMenuOperationsObject.chefMenu(userId);
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
        // Print each item
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

      this.chefMenuOperationsObject.displayMenuForDiscardedItemsForChef(
        userId
      );
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
    this.chefMenuOperationsObject.chefMenu(userId);
  }
}
