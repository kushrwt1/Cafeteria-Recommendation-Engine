import net from "net";
import { UserRepository } from "../Utils/Database Repositories/userRepository";
import { RoleRepository } from "../Utils/Database Repositories/roleRepository";
import { AdminHandler } from "../Server/Handlers/adminHandler";
import { ChefHandler } from "../Server/Handlers/chefHandler";
import { EmployeeHandler } from "../Server/Handlers/employeeHandler";
import { UserActivityService } from "../Services/userActivityService";
import { ServerProtocol } from "./serverProtocol";
import { AuthenticationService } from "../Services/authenticationService";

class Server {
  private userRepository: UserRepository;
  private roleRepository: RoleRepository;
  private userActivityService: UserActivityService;
  private authenticationService: AuthenticationService;

  constructor() {
    this.userRepository = new UserRepository();
    this.roleRepository = new RoleRepository();
    this.userActivityService = new UserActivityService();
    this.authenticationService = new AuthenticationService(
      this.userRepository,
      this.roleRepository,
      this.userActivityService
    );
    this.startServer();
  }

  private startServer() {
    const server = net.createServer((socket) => {
      console.log("Client connected");
      socket.setEncoding("utf-8");

      socket.on("data", async (data) => {
        try {
          const message = data.toString().trim();
          const { command, headers, body } = ServerProtocol.decodeRequest(message);

          if (command === "LOGIN") {
            await this.authenticationService.authenticateLoginCredentials(socket, body);
          } else if (command.startsWith("admin")) {
            const adminHandler = new AdminHandler();
            adminHandler.handleAdmin(socket, command, body);
          } else if (command.startsWith("chef")) {
            const chefHandler = new ChefHandler();
            chefHandler.handleChef(socket, command, body);
          } else if (command.startsWith("employee")) {
            const employeeHandler = new EmployeeHandler();
            employeeHandler.handleEmployee(socket, command, body);
          } else if (command === "LogUserActivity") {
            const { userId, message: activityMessage } = JSON.parse(body);
            this.userActivityService.logActivity(userId, activityMessage);
          } else {
            ServerProtocol.sendResponse(
              socket,
              "ERROR",
              {},
              "ERROR Unknown command\n",
              "string"
            );
          }
        } catch (error) {
          console.error("Error handling data:", error);
          ServerProtocol.sendResponse(
            socket,
            "ERROR",
            {},
            "ERROR Processing request\n",
            "string"
          );
        }
      });

      socket.on("end", () => {
        console.log("Client disconnected");
      });

      socket.on("error", (err) => {
        console.error(`Socket error: ${err.message}`);
      });
    });

    server.listen(3000, () => {
      console.log("Server listening on port 3000");
    });
  }
}

const serverObject = new Server();