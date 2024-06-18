// import net from 'net';
// import { User } from '../../Models/user';

// export async function handleChef(socket: net.Socket, user: User) {
//     try {
//         socket.write('Welcome Chef\n');
//         socket.on('data', (data) => {
//             try {
//                 const message = data.toString().trim();
//                 // Handle chef commands
//                 socket.write(`Chef command received: ${message}\n`);
//             } catch (error) {
//                 console.error(`Chef handler error: ${error}`);
//                 socket.write(`ERROR ${error}\n`);
//             }
//         });
//     } catch (error) {
//         console.error(`Error in handleChef: ${error}`);
//         socket.write(`ERROR ${error}\n`);
//     }
// }

import net from 'net';
import { ChefController } from '../../Controllers/chefController';
import { RoleBasedMenu } from '../../Features/RoleBasedMenus/roleBasedMenu';

export function handleChef(socket: net.Socket) {
    const chefController = new ChefController();
    // const roleBasedMenu = new RoleBasedMenu();

    try {
        socket.write('Welcome Chef\n');
        // roleBasedMenu.chefMenu(chefController);
    } catch (error) {
        handleError(error, socket, 'Error in chef handler');
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
