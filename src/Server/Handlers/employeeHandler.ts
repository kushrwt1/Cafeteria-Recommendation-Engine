import net from "net";
import { EmployeeController } from "../../Controllers/employeeController";

export class EmployeeHandler {
  public handleEmployee(socket: net.Socket, command: string, params: string) {
    const employeeController = new EmployeeController();
    let response: string;
    let employeeId: number;

    switch (command) {
      case "employee_giveFeedback":
        const { userId, menuItemId, rating, comment, today } =
          JSON.parse(params);
        employeeController.giveFeedback(
          userId,
          menuItemId,
          rating,
          comment,
          today
        );
        break;
      case "employee_viewNotifications":
        const { employeeId } = JSON.parse(params);
        employeeController.getNotifications(socket, employeeId);
        break;
      case "employee_viewRolledOutMenu":
        const { notificationId, employeeId1 } = JSON.parse(params);
        employeeController.getRolledOutMenu(
          socket,
          notificationId,
          employeeId1
        );
        break;
      case "employee_markNotificationAsSeen":
        const { notificationIdToMark } = JSON.parse(params);
        employeeController.markNotificationAsSeen(notificationIdToMark);
        break;
      case "employee_markNotificationAsSeen_updateVotedItem":
        const {
          notificationIdToMarkAsSeen,
          breakfastItemId,
          lunchItemId,
          dinnerItemId,
          employeeId2,
        } = JSON.parse(params);
        employeeController.markNotificationAsSeen(notificationIdToMarkAsSeen);
        employeeController.updateVotedItem(
          breakfastItemId,
          lunchItemId,
          dinnerItemId,
          employeeId2
        );
        break;
      case "employee_markNotificationAsSeen_sendDiscardedItemFeedbackToServer":
        const {
          notificationIdToMarkAsSeen1,
          dislikes,
          desiredTaste,
          momRecipe,
          discardedMenuItemId,
        } = JSON.parse(params);

        employeeController.markNotificationAsSeen(notificationIdToMarkAsSeen1);
        employeeController.addDiscarededMenuItemFeedbackInDatabase(
          dislikes,
          desiredTaste,
          momRecipe,
          discardedMenuItemId
        );
        break;

      case "employee_deleteNotification":
        const { notificationIdToDelete } = JSON.parse(params);
        employeeController.deleteNotification(notificationIdToDelete);
        break;
      case "employee_viewAllMenuItem":
        const { employeeUserId } = JSON.parse(params);
        employeeController.viewAllMenuItems(socket, employeeUserId);
        break;
      case "employee_updateEmployeeProfile":
        const {
          employeeId4,
          dietaryPreference,
          spiceLevel,
          cuisinePreference,
          sweetTooth,
        } = JSON.parse(params);
        employeeController.updateEmployeeProfile(
          employeeId4,
          dietaryPreference,
          spiceLevel,
          cuisinePreference,
          sweetTooth
        );
        break;

      default:
        response = "Unknown admin command";
        break;
    }

    // socket.write(response + '\n');
  }
}
