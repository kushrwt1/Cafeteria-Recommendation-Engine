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

// import net from 'net';
// import { UserController } from '../../Controllers/employeeController';
// import { RoleBasedMenu } from '../../Features/RoleBasedMenus/roleBasedMenu';

// export class EmployeeHandler {

//     public handleEmployee(socket: net.Socket, userId: number) {
//         const userController = new UserController();
//         // const roleBasedMenu = new RoleBasedMenu();

//         try {
//             socket.write('Welcome Employee\n');
//             // roleBasedMenu.employeeMenu(userController, userId);
//         } catch (error) {
//             this.handleError(error, socket, 'Error in employee handler');
//         }
//     }

//     public handleError(error: unknown, socket: net.Socket, context: string) {
//         if (error instanceof Error) {
//             console.error(`${context}: ${error.message}`);
//             socket.write(`ERROR ${error.message}\n`);
//         } else {
//             console.error(`${context}: ${error}`);
//             socket.write(`ERROR ${error}\n`);
//         }
//     }

// }

import net from 'net';
import { ChefController } from '../../Controllers/chefController';
import { EmployeeController } from '../../Controllers/employeeController';

export class EmployeeHandler {

    public handleEmployee(socket: net.Socket, command: string, params: string[]) {
        const employeeController = new EmployeeController();
        let response: string;

        switch (command) {
            case 'employee_giveFeedback':
                const [userIdStr, menuItemIdStr, ratingStr, comment, dateStr] = params;
                const userId = parseInt(userIdStr);
                const menuItemId = parseInt(menuItemIdStr);
                const rating = parseInt(ratingStr);
                const date = new Date(dateStr).toISOString().split('T')[0];
                employeeController.giveFeedback(userId, menuItemId, rating, comment, date);
                // const recommendedItems = await chefController.getRecommendedItems();
                break;
            case 'employee_viewNotifications':
                const employeeId = parseInt(params[0]);
                employeeController.getNotifications(socket, employeeId);
                // socket.write(JSON.stringify(notifications));
                break;
            case 'employee_viewRolledOutMenu':
                const [notificationIdStr, employeeIdIdStr] = params;
                const notificationId = parseInt(notificationIdStr);
                const employeeId1 = parseInt(employeeIdIdStr) ;
                employeeController.getRolledOutMenu(socket,notificationId, employeeId1);
                break;
            case 'employee_markNotificationAsSeen':
                const notificationIdToMark = parseInt(params[0]);
                employeeController.markNotificationAsSeen(notificationIdToMark);
                break;
            case 'employee_markNotificationAsSeen_updateVotedItem':
                const [notificationIdToMarkAsSeenStr, itemIdStr, employeeId2Str] = params;
                const notificationIdToMarkAsSeen = parseInt(notificationIdToMarkAsSeenStr);
                const itemId = parseInt(itemIdStr);
                const employeeId2 = parseInt(employeeId2Str);
                employeeController.markNotificationAsSeen(notificationIdToMarkAsSeen);
                employeeController.updateVotedItem(itemId, employeeId2);
                break;
            case 'employee_deleteNotification':
                const notificationIdToDelete = parseInt(params[0]);
                employeeController.deleteNotification(notificationIdToDelete);
                break;
            case 'employee_viewAllMenuItem':
                const employeeUserId = parseInt(params[0]);
                employeeController.viewAllMenuItems(socket, employeeUserId);
                // const notificationIdToDelete = parseInt(params[0]);
                // employeeController.deleteNotification(notificationIdToDelete);
                break;
                
            default:
                response = 'Unknown admin command';
                break;
        }

        // socket.write(response + '\n');
    }
}