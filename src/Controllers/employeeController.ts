import { Feedback } from "../Models/feedback";
import { FeedbackRepository } from "../Utils/Database Repositories/feedbackRepository";
import { NotificationService } from "../Services/notificationService";
import { ChefDailyMenuRepository } from "../Utils/Database Repositories/chefDailyMenuRepository";
import { EmployeeMenuSelectionRepository } from "../Utils/Database Repositories/employeeMenuSelectionRepository";
import net from "net";
import { EmployeeMenuSelections } from "../Models/employeeMenuSelection";
import { MenuItemRepository } from "../Utils/Database Repositories/menuItemRepository";
import { DiscardedFoodItemFeedback } from "../Models/discardedFoodItemFeedback";
import { DiscardedFoodItemFeedbackRepository } from "../Utils/Database Repositories/discardedFoodItemFeedbackRepository";
import { EmployeeProfile } from "../Models/employeeProfile";
import { EmployeeProfileService } from "../Services/employeeProfileService";
import { EmployeeProfileRepository } from "../Utils/Database Repositories/employeeProfileRepository";
import { MenuItem } from "../Models/menuItem";
import { ServerProtocol } from "../Server/serverProtocol";

export class EmployeeController {
  private feedbackRepositoryObject = new FeedbackRepository();
  private chefdailyMenuRepositoryObject = new ChefDailyMenuRepository();
  private notificationServiceObject = new NotificationService();
  private employeeProfileServiceObject = new EmployeeProfileService();
  private employeeMenuSelectionrepositoryObject =
    new EmployeeMenuSelectionRepository();
  private menuItemRepositoryObject = new MenuItemRepository();
  private discardedFoodItemFeedbackRepositoryObject =
    new DiscardedFoodItemFeedbackRepository();
  private employeeProfileRepositoryObject = new EmployeeProfileRepository();

  public async giveFeedback(
    userId: number,
    menuItemId: number,
    rating: number,
    comment: string,
    date: string
  ) {
    try {
      const feedback: Feedback = {
        id: 0,
        user_id: userId,
        menu_item_id: menuItemId,
        rating: rating,
        comment: comment,
        date: date,
      };

      await this.feedbackRepositoryObject.addFeedback(feedback);
      console.log("Feedback added successfully.");
    } catch (error) {
      console.error(`Error adding feedback: ${error}`);
    }
  }

  public async getNotifications(
    socket: net.Socket,
    userId: number
  ): Promise<void> {
    const notifications =
      await this.notificationServiceObject.getNotificationsByUserId(userId);
    const notificationsInStringFormat = JSON.stringify(notifications);
    ServerProtocol.sendResponse(
      socket,
      "Response_viewNotifications",
      {},
      { notificationsInStringFormat, userId },
      "json"
    );
  }

  public async getRolledOutMenu(
    socket: net.Socket,
    notificationId: number,
    userId: number
  ): Promise<void> {
    try {
      const rolledOutMenu =
        await this.chefdailyMenuRepositoryObject.getTodaysRolledOutMenu();

      const employeeProfile =
        await this.employeeProfileRepositoryObject.getEmployeeProfileByUserId(
          userId
        );
      let isEmployeeProfileExists = "No";

      if (employeeProfile) {
        isEmployeeProfileExists = "Yes";
        const detailedMenuItems: MenuItem[] = [];

        if (rolledOutMenu != null) {
          for (const menu of rolledOutMenu) {
            const menuItem =
              await this.menuItemRepositoryObject.getMenuItemById(
                menu.menu_item_id
              );
            if (menuItem) {
              detailedMenuItems.push(menuItem);
            }
          }

          // Sort detailed menu items based on employee profile
          detailedMenuItems.sort((a: MenuItem, b: MenuItem) => {
            let scoreA = 0;
            let scoreB = 0;

            // Compare dietary type
            if (a.dietary_type === employeeProfile.dietary_preference)
              scoreA += 1;
            if (b.dietary_type === employeeProfile.dietary_preference)
              scoreB += 1;

            // Compare spice level
            if (a.spice_level === employeeProfile.spice_level) scoreA += 1;
            if (b.spice_level === employeeProfile.spice_level) scoreB += 1;

            // Compare cuisine type
            if (a.cuisine_type === employeeProfile.cuisine_preference)
              scoreA += 1;
            if (b.cuisine_type === employeeProfile.cuisine_preference)
              scoreB += 1;

            // Compare sweet preference
            if (a.is_sweet === employeeProfile.sweet_tooth) scoreA += 1;
            if (b.is_sweet === employeeProfile.sweet_tooth) scoreB += 1;

            // Sort by descending score
            const scoreComparison = scoreB - scoreA;
            if (scoreComparison !== 0) {
              return scoreComparison;
            }

            // Tie-breaking based on preferred attributes
            const preferredAttributesA =
              (a.dietary_type === "Vegetarian" ? 1 : 0) +
              (a.spice_level === "Medium" ? 1 : 0) +
              (a.cuisine_type === "North Indian" ? 1 : 0) +
              (a.is_sweet ? 1 : 0);

            const preferredAttributesB =
              (b.dietary_type === "Vegetarian" ? 1 : 0) +
              (b.spice_level === "Medium" ? 1 : 0) +
              (b.cuisine_type === "North Indian" ? 1 : 0) +
              (b.is_sweet ? 1 : 0);

            if (preferredAttributesA !== preferredAttributesB) {
              return preferredAttributesB - preferredAttributesA;
            }

            // Tie-breaking by price (ascending)
            return a.price - b.price;
          });
        }
        const detailedMenuItemsInStringFormat =
          JSON.stringify(detailedMenuItems);
        ServerProtocol.sendResponse(
          socket,
          "Response_rolledOutMenu",
          {},
          {
            detailedMenuItemsInStringFormat,
            userId,
            notificationId,
            isEmployeeProfileExists,
          },
          "json"
        );

        console.log(
          "Rolled Out Menu According To User preference is sent to Client Successfully"
        );
      } else {
        const rolledOutMenuInStringFormat = JSON.stringify(rolledOutMenu);
        ServerProtocol.sendResponse(
          socket,
          "Response_rolledOutMenu",
          {},
          {
            rolledOutMenuInStringFormat,
            userId,
            notificationId,
            isEmployeeProfileExists,
          },
          "json"
        );

        console.log(
          "Rolled Out Menu Without User preference is sent to Client Successfully"
        );
      }
    } catch (error) {
      console.error(`Error fetching rolled out menu: ${error}`);
    }
  }

  public async markNotificationAsSeen(notificationId: number): Promise<void> {
    await this.notificationServiceObject.markNotificationAsSeen(notificationId);
  }

  public async updateVotedItem(
    breakfastItemId: number,
    lunchItemId: number,
    dinnerItemId: number,
    userId: number
  ) {
    const today = new Date().toISOString().split("T")[0];
    const userMenuSelectionForBreakfast: EmployeeMenuSelections = {
      id: 0,
      user_id: userId,
      menu_item_id: breakfastItemId,
      selection_date: today,
    };
    const userMenuSelectionForLunch: EmployeeMenuSelections = {
      id: 0,
      user_id: userId,
      menu_item_id: lunchItemId,
      selection_date: today,
    };
    const userMenuSelectionForDinner: EmployeeMenuSelections = {
      id: 0,
      user_id: userId,
      menu_item_id: dinnerItemId,
      selection_date: today,
    };
    await this.employeeMenuSelectionrepositoryObject.addEmployeeMenuSelection(
      userMenuSelectionForBreakfast
    );
    await this.employeeMenuSelectionrepositoryObject.addEmployeeMenuSelection(
      userMenuSelectionForLunch
    );
    await this.employeeMenuSelectionrepositoryObject.addEmployeeMenuSelection(
      userMenuSelectionForDinner
    );
  }

  public async deleteNotification(notificationId: number): Promise<void> {
    await this.notificationServiceObject.deleteNotification(notificationId);
  }

  public async viewAllMenuItems(socket: net.Socket, userId: number) {
    try {
      const menuItems = await this.menuItemRepositoryObject.getAllMenuItems();
      // console.log("Menu Items:", menuItems);
      // socket.write(`Response_employee_viewAllMenuItems;${JSON.stringify(menuItems)};${userId}`);
      const menuItemsInStringFormat = JSON.stringify(menuItems);
      ServerProtocol.sendResponse(
        socket,
        "Response_employee_viewAllMenuItems",
        {},
        { menuItemsInStringFormat, userId },
        "json"
      );
    } catch (error) {
      console.error(`Error fetching all menu item: ${error}`);
    }
  }

  public async selectMenuItems() {}

  public async sendSelectedMenuItems() {}

  public async addDiscarededMenuItemFeedbackInDatabase(
    dislikes: string,
    desiredTaste: string,
    momRecipe: string,
    discardedMenuItemId: number
  ) {
    const today = new Date().toISOString().split("T")[0];
    const discardedFoodItemFeedback: DiscardedFoodItemFeedback = {
      id: 0,
      menu_item_id: discardedMenuItemId,
      dislikes: dislikes,
      desired_taste: desiredTaste,
      mom_recipe: momRecipe,
      feedback_date: today,
    };
    await this.discardedFoodItemFeedbackRepositoryObject.addFeedback(
      discardedFoodItemFeedback
    );
  }

  public async updateEmployeeProfile(
    userId: number,
    dietaryPreference: string,
    spiceLevel: string,
    cuisinePreference: string,
    sweetTooth: boolean
  ) {
    const today = new Date().toISOString().split("T")[0];
    const profile: EmployeeProfile = {
      id: 0,
      user_id: userId,
      dietary_preference: dietaryPreference,
      spice_level: spiceLevel,
      cuisine_preference: cuisinePreference,
      sweet_tooth: sweetTooth,
      profile_update_date: today,
    };

    try {
      await this.employeeProfileServiceObject.updateEmployeeProfile(profile);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }
}
