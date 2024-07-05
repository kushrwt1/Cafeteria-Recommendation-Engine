"use strict";
// import net from 'net';
// import { UserRepository } from '../Utils/Database Repositories/userRepository';
// import { RoleRepository } from '../Utils/Database Repositories/roleRepository';
// import { AdminHandler } from '../Server/Handlers/adminHandler';
// import { ChefHandler } from '../Server/Handlers/chefHandler';
// import { EmployeeHandler } from '../Server/Handlers/employeeHandler';
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
// const userRepository = new UserRepository();
// const roleRepository = new RoleRepository();
// const server = net.createServer((socket) => {
//     console.log('Client connected');
//     socket.setEncoding('utf-8');
//     socket.on('data', async (data) => {
//         const message = data.toString().trim();
//         const [command, ...args] = message.split(';');
//         if (command === 'LOGIN') {
//             const [username, password] = args;
//             try {
//                 const user = await userRepository.getUserByNameAndPassword(username, password);
//                 if (user) {
//                     const role = await roleRepository.getRoleById(user.role_id);
//                     if (role) {
//                         socket.write(`LOGIN_SUCCESS ${role.role_name} ${user.user_id}\n`);
//                         // switch (role.role_name) {
//                         //     case 'admin':
//                         //         await handleAdmin(socket);
//                         //         break;
//                         //     case 'chef':
//                         //         await handleChef(socket);
//                         //         break;
//                         //     case 'employee':
//                         //         await handleEmployee(socket, user.user_id);
//                         //         break;
//                         //     default:
//                         //         socket.write('ERROR Unknown role\n');
//                         // }
//                     } else {
//                         socket.write('ERROR Role not found\n');
//                     }
//                 } else {
//                     socket.write('ERROR Invalid credentials\n');
//                 }
//             } catch (error) {
//                 console.error(`Error during login: ${error}`);
//                 socket.write(`ERROR ${error}\n`);
//             }
//         } else if (command.startsWith('admin')) {
//             const adminHandlerObject = new AdminHandler();
//             adminHandlerObject.handleAdmin(socket, command, args);
//         } else if (command.startsWith('chef')) {
//             const chefHandlerObject = new ChefHandler();
//             chefHandlerObject.handleChef(socket, command, args);
//         } else if (command.startsWith('employee')) {
//             const employeeHandlerObject = new EmployeeHandler();
//             // employeeHandlerObject.handleEmployee(socket, command, args);
//         } else {
//             socket.write('ERROR Unknown command\n');
//         }
//     });
//     socket.on('end', () => {
//         console.log('Client disconnected');
//     });
//     socket.on('error', (err) => {
//         console.error(`Socket error: ${err.message}`);
//     });
// });
// server.listen(3000, () => {
//     console.log('Server listening on port 3000');
// });
const net_1 = __importDefault(require("net"));
const userRepository_1 = require("../Utils/Database Repositories/userRepository");
const roleRepository_1 = require("../Utils/Database Repositories/roleRepository");
const adminHandler_1 = require("../Server/Handlers/adminHandler");
const chefHandler_1 = require("../Server/Handlers/chefHandler");
const employeeHandler_1 = require("../Server/Handlers/employeeHandler");
const userActivityService_1 = require("../Services/userActivityService");
class Server {
    constructor() {
        this.userRepository = new userRepository_1.UserRepository();
        this.roleRepository = new roleRepository_1.RoleRepository();
        this.userActivityService = new userActivityService_1.UserActivityService();
        this.startServer();
    }
    startServer() {
        const server = net_1.default.createServer((socket) => {
            console.log('Client connected');
            socket.setEncoding('utf-8');
            socket.on('data', (data) => __awaiter(this, void 0, void 0, function* () {
                const message = data.toString().trim();
                const [command, ...args] = message.split(';');
                if (command === 'LOGIN') {
                    yield this.handleLogin(socket, args);
                }
                else if (command.startsWith('admin')) {
                    const adminHandler = new adminHandler_1.AdminHandler();
                    adminHandler.handleAdmin(socket, command, args);
                }
                else if (command.startsWith('chef')) {
                    const chefHandler = new chefHandler_1.ChefHandler();
                    chefHandler.handleChef(socket, command, args);
                }
                else if (command.startsWith('employee')) {
                    const employeeHandler = new employeeHandler_1.EmployeeHandler();
                    employeeHandler.handleEmployee(socket, command, args);
                }
                else if (command === 'LogUserActivity') {
                    const [userIdStr, logMessage] = args;
                    const userId = parseInt(userIdStr);
                    this.userActivityService.logActivity(userId, logMessage);
                }
                else {
                    socket.write('ERROR Unknown command\n');
                }
            }));
            socket.on('end', () => {
                console.log('Client disconnected');
            });
            socket.on('error', (err) => {
                console.error(`Socket error: ${err.message}`);
            });
        });
        server.listen(3000, () => {
            console.log('Server listening on port 3000');
        });
    }
    handleLogin(socket, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const [username, password] = args;
            try {
                const user = yield this.userRepository.getUserByNameAndPassword(username, password);
                if (user) {
                    const role = yield this.roleRepository.getRoleById(user.role_id);
                    if (role) {
                        socket.write(`LOGIN_SUCCESS ${role.role_name} ${user.user_id} ${username}\n`);
                        this.userActivityService.logActivity(user.user_id, 'Logged In');
                    }
                    else {
                        socket.write('ERROR Role not found\n');
                    }
                }
                else {
                    socket.write('ERROR Invalid credentials\n');
                }
            }
            catch (error) {
                console.error(`Error during login: ${error}`);
                socket.write(`ERROR: ${error}\n`);
            }
        });
    }
}
const serverObject = new Server();
// import net from 'net';
// import { UserRepository } from '../Utils/Database Repositories/userRepository';
// import { RoleRepository } from '../Utils/Database Repositories/roleRepository';
// import { AdminHandler } from '../Server/Handlers/adminHandler';
// import { ChefHandler } from '../Server/Handlers/chefHandler';
// import { EmployeeHandler } from '../Server/Handlers/employeeHandler';
// class Server {
//     private userRepository: UserRepository;
//     private roleRepository: RoleRepository;
//     constructor() {
//         this.userRepository = new UserRepository();
//         this.roleRepository = new RoleRepository();
//         this.startServer();
//     }
//     private startServer() {
//         const server = net.createServer((socket) => {
//             console.log('Client connected');
//             const clientAddress = socket.remoteAddress;
//             console.log(clientAddress);
//             socket.setEncoding('utf-8');
//             socket.on('data', async (data) => {
//                 const message = data.toString().trim();
//                 console.log(message);
//                 const [command, ...args] = message.split(';');
//                 console.log(command);
//                 if (command === 'LOGIN') {
//                     await this.handleLogin(socket, args);
//                 } else if (command.startsWith('admin')) {
//                     const adminHandler = new AdminHandler();
//                     adminHandler.handleAdmin(socket, command, args);
//                 } else if (command.startsWith('chef')) {
//                     const chefHandler = new ChefHandler();
//                     chefHandler.handleChef(socket, command, args);
//                 } else if (command.startsWith('employee')) {
//                     const employeeHandler = new EmployeeHandler();
//                     employeeHandler.handleEmployee(socket, command, args);
//                 } else {
//                     socket.write('ERROR Unknown command\n');
//                 }
//             });
//             socket.on('end', () => {
//                 console.log('Client disconnected');
//             });
//             socket.on('error', (err) => {
//                 console.error(`Socket error: ${err.message}`);
//             });
//         });
//         // Listen on all interfaces
//         server.listen(3000, '0.0.0.0', () => {
//             console.log('Server listening on port 3000');
//         });
//     }
//     private async handleLogin(socket: net.Socket, args: string[]) {
//         const [username, password] = args;
//         try {
//             const user = await this.userRepository.getUserByNameAndPassword(username, password);
//             if (user) {
//                 const role = await this.roleRepository.getRoleById(user.role_id);
//                 if (role) {
//                     // socket.write(`${role.role_name}\n`);
//                     socket.write(`${role.role_name}`);
//                 } else {
//                     socket.write('ERROR Role not found\n');
//                 }
//             } else {
//                 socket.write('ERROR Invalid credentials\n');
//             }
//         } catch (error) {
//             console.error(`Error during login: ${error}`);
//             socket.write(`ERROR ${error}\n`);
//         }
//     }
// }
// const serverObject = new Server();
