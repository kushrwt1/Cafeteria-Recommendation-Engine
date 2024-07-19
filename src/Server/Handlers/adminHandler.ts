import net from "net";
import { AdminController } from "../../Controllers/adminController";
import { NotificationService } from "../../Services/notificationService";

export class AdminHandler {
  private notificationService = new NotificationService();

  public handleAdmin(socket: net.Socket, command: string, params: string) {
    const adminController = new AdminController();
    let response: string;

    switch (command) {
      case "admin_addMenuItem":

        const {
          name,
          price,
          availability,
          mealTypeId,
          dietaryType,
          spiceLevel,
          cuisineType,
          isSweet,
        } = JSON.parse(params);
        adminController.addMenuItem(
          {
            menu_item_id: 0,
            name,
            availability,
            price,
            meal_type_id: mealTypeId,
            dietary_type: dietaryType,
            spice_level: spiceLevel,
            cuisine_type: cuisineType,
            is_sweet: isSweet,
          },
          socket
        );

        const todaysDate = new Date().toISOString().split("T")[0];
        this.notificationService.addNotificationForAllUsers(
          `Menu item is added with name: ${name}`,
          todaysDate
        );
        break;
      case "admin_updateMenuItem":
        const {
          menuItemId,
          newName,
          newPrice,
          newAvailability,
          newMealTypeId,
          newDietaryType,
          newSpiceLevel,
          newCuisineType,
          newIsSweet,
        } = JSON.parse(params);

        adminController.updateMenuItem({
          menu_item_id: menuItemId,
          name: newName,
          availability: newAvailability,
          price: newPrice,
          meal_type_id: newMealTypeId,
          dietary_type: newDietaryType,
          spice_level: newSpiceLevel,
          cuisine_type: newCuisineType,
          is_sweet: newIsSweet,
        });
        break;
      case "admin_deleteMenuItem":
        const { menuItemIdToDelete } = JSON.parse(params);
        adminController.deleteMenuItem(menuItemIdToDelete);
        break;
      case "admin_viewAllMenuItem":
        adminController.viewAllMenuItems(socket);
        break;
      case "admin_viewDiscardedMenuItems":
        (async () => {
          await adminController.addDiscarededMenuItemsInDatabase();
          adminController.sendAllDiscardedMenuItemsToClient(socket);
        })();
        break;
      case "admin_removeMenuItem":
        const { foodItemId } = JSON.parse(params);
        adminController.deleteMenuItem(foodItemId);
        break;
      case "admin_sendDiscardedItemFeedbackNotification":
        const { menuItemIdToGetFeedback } = JSON.parse(params);

        const today = new Date().toISOString().split("T")[0];
        (async () => {
          const menuItem = await adminController.getMenuItemById(
            menuItemIdToGetFeedback
          );
          if (menuItem != null) {
            this.notificationService.addNotificationForAllUsers(
              `Give Detailed Feedback On Discarded Menu Item with Menu Item Id and Name as: ${menuItemIdToGetFeedback} > ${menuItem.name}`,
              today
            );
            console.log(
              "Notification For Getting Detailed feedback is send successfully."
            );
          }
        })();
        break;
      default:
        response = "Unknown admin command";
        break;
    }

    // socket.write(response + '\n');
  }
}
