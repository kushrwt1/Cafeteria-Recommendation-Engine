"use strict";
// import net from 'net';
// import { User } from '../../Models/user';
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleChef = void 0;
const chefController_1 = require("../../Controllers/chefController");
function handleChef(socket) {
    const chefController = new chefController_1.ChefController();
    // const roleBasedMenu = new RoleBasedMenu();
    try {
        socket.write('Welcome Chef\n');
        // roleBasedMenu.chefMenu(chefController);
    }
    catch (error) {
        handleError(error, socket, 'Error in chef handler');
    }
}
exports.handleChef = handleChef;
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
