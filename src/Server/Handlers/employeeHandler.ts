// import net from 'net';
// import { User } from '../../Models/user';

// export async function handleEmployee(socket: net.Socket, user: User) {
//     try {
//         socket.write('Welcome Employee\n');
//         socket.on('data', (data) => {
//             try {
//                 const message = data.toString().trim();
//                 // Handle employee commands
//                 socket.write(`Employee command received: ${message}\n`);
//             } catch (error) {
//                 console.error(`Employee handler error: ${error}`);
//                 socket.write(`ERROR: ${error}\n`);
//             }
//         });
//     } catch (error) {
//         console.error(`Error in handleEmployee: ${error}`);
//         socket.write(`ERROR ${error}\n`);
//     }
// }

import net from 'net';
import { UserController } from '../../Controllers/employeeController';
import { RoleBasedMenu } from '../../Features/RoleBasedMenus/roleBasedMenu';

export function handleEmployee(socket: net.Socket, userId: number) {
    const userController = new UserController();
    // const roleBasedMenu = new RoleBasedMenu();

    try {
        socket.write('Welcome Employee\n');
        // roleBasedMenu.employeeMenu(userController, userId);
    } catch (error) {
        handleError(error, socket, 'Error in employee handler');
    }
}

function handleError(error: unknown, socket: net.Socket, context: string) {
    if (error instanceof Error) {
        console.error(`${context}: ${error.message}`);
        socket.write(`ERROR ${error.message}\n`);
    } else {
        console.error(`${context}: ${error}`);
        socket.write(`ERROR ${error}\n`);
    }
}
