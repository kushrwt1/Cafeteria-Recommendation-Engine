"use strict";
// import net from 'net';
// import readline from 'readline';
// import { RoleBasedMenu } from '../Features/RoleBasedMenus/roleBasedMenu';
// import { AdminController } from '../Controllers/adminController';
// import { ChefController } from '../Controllers/chefController';
// import { UserController } from '../Controllers/employeeController';
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
// let rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });
// const client = net.createConnection({ port: 3000 }, () => {
//     console.log('Connected to server');
//     login();
// });
// client.on('data', (data) => {
//     const message = data.toString().trim();
//     console.log(message);
//     if (message.includes('LOGIN_SUCCESS')) {
//         const [_, role, userIdStr] = message.split(' ');
//         const userId = parseInt(userIdStr, 10);
//         showMenu(role, userId);
//     } else if (message.includes('ERROR')) {
//         console.error(message);
//         client.end();
//     }
// });
// client.on('end', () => {
//     console.log('Disconnected from server');
//     rl.close();
// });
// client.on('error', (err) => {
//     console.error(`Client error: ${err.message}`);
// });
// function askQuestion(question: string): Promise<string> {
//     return new Promise((resolve) => rl.question(question, resolve));
// }
// async function login() {
//     try {
//         const username = await askQuestion('Enter username: ');
//         const password = await askQuestion('Enter password: ');
//         client.write(`LOGIN ${username} ${password}`);
//     } catch (error) {
//         console.error(`Login error: ${error}`);
//     }
// }
// function showMenu(role: string, userId: number) {
//     const roleBasedMenu = new RoleBasedMenu();
//     switch (role) {
//         case 'admin':
//             roleBasedMenu.adminMenu(new AdminController(), rl);
//             break;
//         case 'chef':
//             roleBasedMenu.chefMenu(new ChefController(), rl);
//             break;
//         case 'employee':
//             roleBasedMenu.employeeMenu(new UserController(), userId, rl);
//             break;
//         default:
//             console.error('Unknown role');
//             client.end();
//     }
// }
// import net from 'net';
// import readline from 'readline';
// import { RoleBasedMenu } from '../Features/RoleBasedMenus/roleBasedMenu';
// import { AdminController } from '../Controllers/adminController';
// import { ChefController } from '../Controllers/chefController';
// import { UserController } from '../Controllers/employeeController';
// const client = net.createConnection({ port: 3000 }, () => {
//     console.log('Connected to server');
//     login();
// });
// client.on('data', (data) => {
//     const message = data.toString().trim();
//     console.log(data.toString());
//     if (message.includes('LOGIN_SUCCESS')) {
//         const [_, role, userIdStr] = message.split(' ');
//         const userId = parseInt(userIdStr, 10);
//         showMenu(role, userId);
//     }
// });
// client.on('end', () => {
//     console.log('Disconnected from server');
// });
// client.on('error', (err) => {
//     console.error(`Client error: ${err.message}`);
// });
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });
// function login() {
//     rl.question('Enter username: ', (username) => {
//         rl.question('Enter password: ', (password) => {
//             try {
//                 client.write(`LOGIN ${username} ${password}`);
//             } catch (error) {
//                 handleError(error, 'Login error');
//             } finally {
//                 rl.close();
//             }
//         });
//     });
// }
// function showMenu(role: string, userId: number) {
//     // rl.question('Enter command: ', (command) => {
//     //     try {
//     //         client.write(command);
//     //     } catch (error) {
//     //         handleError(error, 'Command error');
//     //     }
//     // });
//     // let roleBasedMenu = new RoleBasedMenu();
//     // switch (role) {
//     //     case 'admin':
//     //         roleBasedMenu.adminMenu(new AdminController());
//     //         break;
//     //     case 'chef':
//     //         roleBasedMenu.chefMenu(new ChefController());
//     //         break;
//     //     case 'employee':
//     //         roleBasedMenu.employeeMenu(new UserController(), userId);
//     //         break;
//     //     default:
//     //         console.error('Unknown role');
//     //         client.end();
//     // }     
// }
// function handleError(error: unknown, context: string) {
//     if (error instanceof Error) {
//         console.error(`${context}: ${error.message}`);
//     } else {
//         console.error(`${context}: ${error}`);
//     }
// }
const net_1 = __importDefault(require("net"));
const readline_1 = __importDefault(require("readline"));
const roleBasedMenu_1 = require("../Features/RoleBasedMenus/roleBasedMenu");
const client = net_1.default.createConnection({ port: 3000 }, () => {
    console.log('Connected to server');
    login();
});
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'COMMAND> '
});
const roleBasedMenu = new roleBasedMenu_1.RoleBasedMenu(client, rl);
client.on('data', (data) => {
    const message = data.toString().trim();
    if (message.includes('LOGIN_SUCCESS')) {
        const [_, role, userIdStr] = message.split(' ');
        const userId = parseInt(userIdStr, 10);
        (0, roleBasedMenu_1.showMenu)(role, userId, client, rl);
    }
    else if (message.includes('Response_viewAllMenuItems')) {
        const [command, menuItemsStr] = message.split(';');
        const menuItems = JSON.parse(menuItemsStr);
        console.log(menuItems);
        roleBasedMenu.adminMenu();
    }
    else if (message.includes('ERROR')) {
        console.error(message);
        client.end();
    }
    else {
        rl.prompt();
    }
});
client.on('end', () => {
    console.log('Disconnected from server');
    rl.close();
});
client.on('error', (err) => {
    console.error(`Client error: ${err.message}`);
});
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//     prompt: 'COMMAND> '
// });
function askQuestion(question) {
    return new Promise((resolve) => rl.question(question, resolve));
}
function login() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const username = yield askQuestion('Enter username: ');
            const password = yield askQuestion('Enter password: ');
            client.write(`LOGIN;${username};${password}`);
        }
        catch (error) {
            console.error(`Login error: ${error}`);
        }
    });
}
// function showMenu(role: string, userId: number) {
//     const roleBasedMenu = new RoleBasedMenu();
//     switch (role) {
//         case 'admin':
//             roleBasedMenu.adminMenu(new AdminController());
//             rl.prompt();
//             break;
//         case 'chef':
//             roleBasedMenu.chefMenu(new ChefController());
//             rl.prompt();
//             break;
//         case 'employee':
//             roleBasedMenu.employeeMenu(new UserController(), userId);
//             rl.prompt();
//             break;
//         default:
//             console.error('Unknown role');
//             client.end();
//     }
//     rl.on('line', (line) => {
//         client.write(`${role}_${line.trim()}`);
//     });
// }
