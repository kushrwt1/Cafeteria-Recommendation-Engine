"use strict";
// import net from 'net';
// import { UserRepository } from '../Utils/Database Repositories/userRepository';
// import { RoleRepository } from '../Utils/Database Repositories/roleRepository';
// import { handleAdmin } from '../Server/Handlers/adminHandler';
// import { handleChef } from '../Server/Handlers/chefHandler';
// import { handleEmployee } from '../Server/Handlers/employeeHandler';
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
//         const [command, ...args] = message.split(' ');
//         if (command === 'LOGIN') {
//             const [username, password] = args;
//             try {
//                 const user = await userRepository.getUserByNameAndPassword(username, password);
//                 if (user) {
//                     const role = await roleRepository.getRoleById(user.role_id);
//                     if (role) {
//                         socket.write(`LOGIN_SUCCESS ${role.role_name} ${user.user_id}\n`);
//                         switch (role.role_name) {
//                             case 'admin':
//                                 await handleAdmin(socket);
//                                 break;
//                             case 'chef':
//                                 await handleChef(socket);
//                                 break;
//                             case 'employee':
//                                 await handleEmployee(socket, user.user_id);
//                                 break;
//                             default:
//                                 socket.write('ERROR Unknown role\n');
//                         }
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
const userRepository = new userRepository_1.UserRepository();
const roleRepository = new roleRepository_1.RoleRepository();
const server = net_1.default.createServer((socket) => {
    console.log('Client connected');
    socket.setEncoding('utf-8');
    socket.on('data', (data) => __awaiter(void 0, void 0, void 0, function* () {
        const message = data.toString().trim();
        const [command, ...args] = message.split(';');
        if (command === 'LOGIN') {
            const [username, password] = args;
            try {
                const user = yield userRepository.getUserByNameAndPassword(username, password);
                if (user) {
                    const role = yield roleRepository.getRoleById(user.role_id);
                    if (role) {
                        socket.write(`LOGIN_SUCCESS ${role.role_name} ${user.user_id}\n`);
                        // switch (role.role_name) {
                        //     case 'admin':
                        //         await handleAdmin(socket);
                        //         break;
                        //     case 'chef':
                        //         await handleChef(socket);
                        //         break;
                        //     case 'employee':
                        //         await handleEmployee(socket, user.user_id);
                        //         break;
                        //     default:
                        //         socket.write('ERROR Unknown role\n');
                        // }
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
                socket.write(`ERROR ${error}\n`);
            }
        }
        else if (command.startsWith('admin')) {
            (0, adminHandler_1.handleAdmin)(socket, command, args);
        }
        else if (command.startsWith('chef')) {
            // handleChef(socket, command, args);
        }
        else if (command.startsWith('employee')) {
            // handleEmployee(socket, command, args);
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
