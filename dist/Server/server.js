"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = __importDefault(require("net"));
const userRepository_1 = require("../Utils/Database Repositories/userRepository");
const roleRepository_1 = require("../Utils/Database Repositories/roleRepository");
const adminHandler_1 = require("../Server/Handlers/adminHandler");
const chefHandler_1 = require("../Server/Handlers/chefHandler");
const employeeHandler_1 = require("../Server/Handlers/employeeHandler");
const userActivityService_1 = require("../Services/userActivityService");
const serverProtocol_1 = require("./serverProtocol");
const authenticationService_1 = require("../Services/authenticationService");
class Server {
    constructor() {
        this.userRepository = new userRepository_1.UserRepository();
        this.roleRepository = new roleRepository_1.RoleRepository();
        this.userActivityService = new userActivityService_1.UserActivityService();
        this.authenticationService = new authenticationService_1.AuthenticationService(this.userRepository, this.roleRepository, this.userActivityService);
        this.startServer();
    }
    startServer() {
        const server = net_1.default.createServer((socket) => {
            console.log("Client connected");
            socket.setEncoding("utf-8");
            socket.on("data", (data) => __awaiter(this, void 0, void 0, function* () {
                const message = data.toString().trim();
                const { command, headers, body } = serverProtocol_1.ServerProtocol.decodeRequest(message);
                if (command === "LOGIN") {
                    yield this.authenticationService.authenticateLoginCredentials(socket, body);
                }
                else if (command.startsWith("admin")) {
                    const adminHandler = new adminHandler_1.AdminHandler();
                    adminHandler.handleAdmin(socket, command, body);
                }
                else if (command.startsWith("chef")) {
                    const chefHandler = new chefHandler_1.ChefHandler();
                    chefHandler.handleChef(socket, command, body);
                }
                else if (command.startsWith("employee")) {
                    const employeeHandler = new employeeHandler_1.EmployeeHandler();
                    employeeHandler.handleEmployee(socket, command, body);
                }
                else if (command === "LogUserActivity") {
                    const { userId, message: activityMessage } = JSON.parse(body);
                    this.userActivityService.logActivity(userId, activityMessage);
                }
                else {
                    serverProtocol_1.ServerProtocol.sendResponse(socket, "ERROR", {}, "ERROR Unknown command\n", "string");
                }
            }));
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
