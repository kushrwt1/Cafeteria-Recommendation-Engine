"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleBasedMenu = void 0;
const adminMenuOperations_1 = require("./adminMenuOperations");
const chefMenuOperations_1 = require("./chefMenuOperations");
const employeeMenuOperations_1 = require("./employeeMenuOperations");
class RoleBasedMenu {
    constructor(client, rl, logout) {
        this.client = client;
        this.rl = rl;
        this.logout = logout;
        this.adminMenuOperationsObject = new adminMenuOperations_1.AdminMenuOperations(client, rl, logout);
        this.chefMenuOperationsObject = new chefMenuOperations_1.ChefMenuOperations(client, rl, logout);
        this.employeeMenuOperationsObject = new employeeMenuOperations_1.EmployeeMenuOperations(client, rl, logout);
    }
    showMenu(role, userId, client, rl, logout) {
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
exports.RoleBasedMenu = RoleBasedMenu;
