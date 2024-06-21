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
            // case 'admin_updateMenuItem':
            //     const [menuItemIdStr, newNameStr, newPriceStr, newAvailabilityStr, newMealTypeIdStr] = params;
            //     const menuItemId = parseInt(menuItemIdStr);
            //     const newName = newNameStr.toString();
            //     const newPrice = parseFloat(newPriceStr);
            //     const newAvailability = newAvailabilityStr === 'true';
            //     const newMealTypeId = parseInt(newMealTypeIdStr);
            //     adminController.updateMenuItem({ menu_item_id: menuItemId, name: newName, availability: newAvailability, price: newPrice, meal_type_id: newMealTypeId});
            //     break;
            // case  'admin_deleteMenuItem':
            //     const [menuItemIdToDeleteStr] = params;
            //     const menuItemIdToDelete = parseInt(menuItemIdToDeleteStr);
            //     adminController.deleteMenuItem(menuItemIdToDelete);
            //     break;
            // case  'admin_viewAllMenuItem':
            //     adminController.viewAllMenuItems(socket);
            //     // socket.write(`Response_viewAllMenuItems;${menuItems}`);
            //     break;
            default:
                response = 'Unknown admin command';
                break;
        }

        // socket.write(response + '\n');
    }
}