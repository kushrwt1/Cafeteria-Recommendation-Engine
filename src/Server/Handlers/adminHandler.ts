import net from 'net';
import { AdminController } from '../../Controllers/adminController';
import { NotificationService } from '../../Services/notificationService';

export class AdminHandler {

    private notificationService = new NotificationService();

    public handleAdmin(socket: net.Socket, command: string, params: string[]) {
        const adminController = new AdminController();
        let response: string;

        switch (command) {
            case 'admin_addMenuItem':
                const [nameStr, priceStr, availabilityStr, mealTypeIdStr, dietary_type, spice_level, cuisine_type, isSweetStr] = params;
                const name = nameStr.toString();
                const price = parseFloat(priceStr);
                const availability = availabilityStr === 'true';
                const meal_type_id = parseInt(mealTypeIdStr);
                const is_sweet = isSweetStr === 'true';
                adminController.addMenuItem({ menu_item_id: 0, name, availability, price, meal_type_id, dietary_type, spice_level, cuisine_type, is_sweet}, socket);
                break;
            case 'admin_updateMenuItem':
                const [menuItemIdStr, newNameStr, newPriceStr, newAvailabilityStr, newMealTypeIdStr, newDietaryType, newSpiceLevel, newCuisineType, newIsSweetStr] = params;
                const menuItemId = parseInt(menuItemIdStr);
                const newName = newNameStr.toString();
                const newPrice = parseFloat(newPriceStr);
                const newAvailability = newAvailabilityStr === 'true';
                const newMealTypeId = parseInt(newMealTypeIdStr);
                const newIsSweet = newIsSweetStr === 'true';
                adminController.updateMenuItem({ menu_item_id: menuItemId, name: newName, availability: newAvailability, price: newPrice, meal_type_id: newMealTypeId, dietary_type: newDietaryType, spice_level: newSpiceLevel, cuisine_type: newCuisineType, is_sweet: newIsSweet});
                break;
            case  'admin_deleteMenuItem':
                const [menuItemIdToDeleteStr] = params;
                const menuItemIdToDelete = parseInt(menuItemIdToDeleteStr);
                adminController.deleteMenuItem(menuItemIdToDelete);
                break;
            case  'admin_viewAllMenuItem':
                adminController.viewAllMenuItems(socket);
                // socket.write(`Response_viewAllMenuItems;${menuItems}`);
                break;
            case  'admin_viewDiscardedMenuItems':
                (async () => {
                    await adminController.addDiscarededMenuItemsInDatabase();
                    adminController.sendAllDiscardedMenuItemsToClient(socket);
                })();
                break;
            case 'admin_removeMenuItem':
                const foodItemId = parseInt(params[0]);
                adminController.deleteMenuItem(foodItemId);
                break;
            case 'admin_sendDiscardedItemFeedbackNotification':
                const menuItemIdToGetFeedback = parseInt(params[0]);
                const today = new Date().toISOString().split('T')[0];
                (async () => {
                    const menuItem = await adminController.getMenuItemById(menuItemIdToGetFeedback);
                    if(menuItem!= null)
                        {
                            this.notificationService.addNotificationForAllUsers(`Give Detailed Feedback On Discarded Menu Item with Menu Item Id and Name as: ${menuItemIdToGetFeedback} > ${menuItem.name}`, today);
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
