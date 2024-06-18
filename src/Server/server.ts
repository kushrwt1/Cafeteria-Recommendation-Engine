import net from 'net';
import { UserRepository } from '../Utils/Database Repositories/userRepository';
import { RoleRepository } from '../Utils/Database Repositories/roleRepository';
import { handleAdmin } from '../Server/Handlers/adminHandler';
import { handleChef } from '../Server/Handlers/chefHandler';
import { handleEmployee } from '../Server/Handlers/employeeHandler';

const userRepository = new UserRepository();
const roleRepository = new RoleRepository();

const server = net.createServer((socket) => {
    console.log('Client connected');
    socket.setEncoding('utf-8');

    socket.on('data', async (data) => {
        const message = data.toString().trim();
        const [command, ...args] = message.split(';');

        if (command === 'LOGIN') {
            const [username, password] = args;
            try {
                const user = await userRepository.getUserByNameAndPassword(username, password);
                if (user) {
                    const role = await roleRepository.getRoleById(user.role_id);
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
                    } else {
                        socket.write('ERROR Role not found\n');
                    }
                } else {
                    socket.write('ERROR Invalid credentials\n');
                }
            } catch (error) {
                console.error(`Error during login: ${error}`);
                socket.write(`ERROR ${error}\n`);
            }
        } else if (command.startsWith('admin')) {
            handleAdmin(socket, command, args);
        } else if (command.startsWith('chef')) {
            // handleChef(socket, command, args);
        } else if (command.startsWith('employee')) {
            // handleEmployee(socket, command, args);
        } else {
            socket.write('ERROR Unknown command\n');
        }
    });

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