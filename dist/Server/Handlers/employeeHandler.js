"use strict";
// import net from 'net';
// import { User } from '../../Models/user';
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleEmployee = void 0;
const employeeController_1 = require("../../Controllers/employeeController");
function handleEmployee(socket, userId) {
    const userController = new employeeController_1.UserController();
    // const roleBasedMenu = new RoleBasedMenu();
    try {
        socket.write('Welcome Employee\n');
        // roleBasedMenu.employeeMenu(userController, userId);
    }
    catch (error) {
        handleError(error, socket, 'Error in employee handler');
    }
}
exports.handleEmployee = handleEmployee;
function handleError(error, socket, context) {
    if (error instanceof Error) {
        console.error(`${context}: ${error.message}`);
        socket.write(`ERROR ${error.message}\n`);
    }
    else {
        console.error(`${context}: ${error}`);
        socket.write(`ERROR ${error}\n`);
    }
}
