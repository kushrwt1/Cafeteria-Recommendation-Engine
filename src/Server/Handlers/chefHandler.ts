import net from 'net';
import { ChefController } from '../../Controllers/chefController';
import { NotificationService } from '../../Services/notificationService';

export class ChefHandler {
    private notificationService = new NotificationService();

    public handleChef(socket: net.Socket, command: string, params: string[]) {
        const chefController = new ChefController();
        let response: string;

        switch (command) {
            case 'chef_getRecommendedItems':
                chefController.getRecommendedItems(socket);
                // const recommendedItems = await chefController.getRecommendedItems();
                break;
            case 'chef_rollOutMenu':
                const [dateStr, selectedItemsStr] = params;
                const date = new Date(dateStr).toISOString().split('T')[0];
                const selectedItems = JSON.parse(selectedItemsStr);

                for (const { mealType, menuItemId } of selectedItems) {
                    chefController.rollOutMenu(date, menuItemId);
                }
                
                const today = new Date().toISOString().split('T')[0];
                this.notificationService.addNotificationForAllUsers("See Rolled Out Menu and Vote For an Item", today);
                break;
            case 'chef_viewAllMenuItem':
                chefController.viewAllMenuItems(socket);
                break;
            case 'chef_viewDiscardedMenuItems':
                (async () => {
                    await chefController.addDiscarededMenuItemsInDatabase();
                    chefController.sendAllDiscardedMenuItemsToClient(socket);
                })();
                break;


            case 'chef_removeMenuItem':
                const foodItemId = parseInt(params[0]);
                chefController.deleteMenuItem(foodItemId);
                break;

            case 'chef_sendDiscardedItemFeedbackNotification':
                const menuItemIdToGetFeedback = parseInt(params[0]);
                const todayDate = new Date().toISOString().split('T')[0];
                (async () => {
                    const menuItem = await chefController.getMenuItemById(menuItemIdToGetFeedback);
                    if(menuItem!= null)
                        {
                            this.notificationService.addNotificationForAllUsers(`Give Detailed Feedback On Discarded Menu Item with Menu Item Id and Name as: ${menuItemIdToGetFeedback} > ${menuItem.name}`, todayDate);
                            console.log("Notification For Getting Detailed feedback is send successfully.");
                        }
                })();
                break;
            default:
                response = 'Unknown admin command';
                break;
        }

        // socket.write(response + '\n');
    }
}