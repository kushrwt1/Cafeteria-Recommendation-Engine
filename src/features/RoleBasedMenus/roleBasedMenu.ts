import net from "net";
import { AdminController } from "../../Controllers/adminController";
import { ChefController } from "../../Controllers/chefController";
import { EmployeeController } from "../../Controllers/employeeController";
import readline from "readline";
import { ClientProtocol } from "../../Client/clientProtocol";
import { AdminMenuOperations } from "./adminMenuOperations";
import { ChefMenuOperations } from "./chefMenuOperations";
import { EmployeeMenuOperations } from "./employeeMenuOperations";

export class RoleBasedMenu {
  private adminMenuOperationsObject!: AdminMenuOperations;
  private chefMenuOperationsObject!: ChefMenuOperations;
  private employeeMenuOperationsObject!: EmployeeMenuOperations;

  constructor(
    private client: net.Socket,
    private rl: readline.Interface,
    private logout: (userId: number) => void
  ) {
    this.adminMenuOperationsObject = new AdminMenuOperations(
      client,
      rl,
      logout
    );
    this.chefMenuOperationsObject = new ChefMenuOperations(client, rl, logout);
    this.employeeMenuOperationsObject = new EmployeeMenuOperations(
      client,
      rl,
      logout
    );
  }

  public showMenu(
    role: string,
    userId: number,
    client: net.Socket,
    rl: readline.Interface,
    logout: (userId: number) => void
  ) {
    switch (role) {
      case "admin":
        this.adminMenuOperationsObject.adminMenu(userId);
        break;
      case "chef":
        this.chefMenuOperationsObject.chefMenu(userId);
        break;
      case "employee":
        this.employeeMenuOperationsObject.employeeMenu(userId);
        break;
      default:
        console.error("Unknown role");
        client.end();
    }
  }
}
