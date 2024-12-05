import net from "net";
import readline from "readline";
import { ClientProtocol } from "./clientProtocol";
import { EmployeeMenuOperations } from "../Features/RoleBasedMenus/employeeMenuOperations";

export class EmployeeResponseHandler {
  private employeeMenuOperationsObject!: EmployeeMenuOperations;

  constructor(
    private client: net.Socket,
    private rl: readline.Interface,
    private logout: (userId: number) => void
  ) {
    this.employeeMenuOperationsObject = new EmployeeMenuOperations(
      this.client,
      this.rl,
      this.logout.bind(this)
    );
  }

  public handleViewAllMenuItemsResponse(body: any, employeeId: number) {
    try {
      const { menuItemsInStringFormat, userId } = JSON.parse(body);
      const menuItems = JSON.parse(menuItemsInStringFormat);
      console.table(menuItems);

      ClientProtocol.sendRequest(
        this.client,
        "LogUserActivity",
        {},
        { userId: employeeId, message: "Viewed All Menu Items" },
        "json"
      );

      this.employeeMenuOperationsObject.employeeMenu(userId);
    } catch (error) {
      console.error("Error handling View All Menu Items response:", error);
      this.handleError(employeeId, "View All Menu Items");
    }
  }

  public handleViewNotificationsResponse(body: any, employeeId: number) {
    try {
      const { notificationsInStringFormat, userId } = JSON.parse(body);
      const notifications = JSON.parse(notificationsInStringFormat);

      ClientProtocol.sendRequest(
        this.client,
        "LogUserActivity",
        {},
        { userId: employeeId, message: "Viewed Notification" },
        "json"
      );

      this.employeeMenuOperationsObject.handleNotificationsResponseFromServer(
        notifications,
        userId
      );
    } catch (error) {
      console.error("Error handling View Notifications response:", error);
      this.handleError(employeeId, "View Notifications");
    }
  }

  public handleRolledOutMenuResponse(body: any, employeeId: number) {
    try {
      const parsedBody = JSON.parse(body);
      const {
        rolledOutMenuInStringFormat = null,
        detailedMenuItemsInStringFormat = null,
        userId,
        notificationId,
        isEmployeeProfileExists,
      } = parsedBody;

      const menuItemsInStringFormat =
        rolledOutMenuInStringFormat || detailedMenuItemsInStringFormat;

      const rolledOutMenu = JSON.parse(menuItemsInStringFormat);

      this.employeeMenuOperationsObject.viewRolledOutMenuNotification(
        rolledOutMenu,
        userId,
        notificationId,
        isEmployeeProfileExists
      );
    } catch (error) {
      console.error("Error handling Rolled Out Menu response:", error);
      this.handleError(employeeId, "View Rolled Out Menu");
    }
  }

  private handleError(employeeId: number, operation: string) {
    console.error(`Operation "${operation}" failed for employee ID ${employeeId}`);
    ClientProtocol.sendRequest(
      this.client,
      "LogUserActivity",
      {},
      { userId: employeeId, message: `Failed to ${operation}` },
      "json"
    );
    this.employeeMenuOperationsObject.employeeMenu(employeeId);
  }
}
