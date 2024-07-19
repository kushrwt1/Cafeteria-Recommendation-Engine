import net from "net";
import { ChefController } from "../../Controllers/chefController";
import { NotificationService } from "../../Services/notificationService";

export class ChefHandler {
  private notificationService = new NotificationService();

  public handleChef(socket: net.Socket, command: string, params: string) {
    const chefController = new ChefController();
    let response: string;

    switch (command) {
      case "chef_getRecommendedItems":
        chefController.getRecommendedItems(socket);
        break;
      case "chef_rollOutMenu":
        const { today, selectedItemsInStringFormat } = JSON.parse(params);
        const selectedItems = JSON.parse(selectedItemsInStringFormat);

        for (const { mealType, menuItemId } of selectedItems) {
          chefController.rollOutMenu(today, menuItemId);
        }

        const todaysDate = new Date().toISOString().split("T")[0];
        this.notificationService.addNotificationForAllUsers(
          "See Rolled Out Menu and Vote For an Item",
          todaysDate
        );
        break;
      case "chef_viewAllMenuItem":
        chefController.viewAllMenuItems(socket);
        break;
      case "chef_viewDiscardedMenuItems":
        (async () => {
          await chefController.addDiscarededMenuItemsInDatabase();
          chefController.sendAllDiscardedMenuItemsToClient(socket);
        })();
        break;

      case "chef_removeMenuItem":
        const { foodItemId } = JSON.parse(params);

        chefController.deleteMenuItem(foodItemId);
        break;

      case "chef_sendDiscardedItemFeedbackNotification":
        const { menuItemIdToGetFeedback } = JSON.parse(params);
        const todayDate = new Date().toISOString().split("T")[0];
        (async () => {
          const menuItem = await chefController.getMenuItemById(
            menuItemIdToGetFeedback
          );
          if (menuItem != null) {
            this.notificationService.addNotificationForAllUsers(
              `Give Detailed Feedback On Discarded Menu Item with Menu Item Id and Name as: ${menuItemIdToGetFeedback} > ${menuItem.name}`,
              todayDate
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
