import net from 'net';
import { AdminController } from '../../Controllers/adminController';

export function handleAdmin(socket: net.Socket, command: string, params: string[]) {
    const adminController = new AdminController();
    let response: string;

    switch (command) {
        case 'admin_addMenuItem':
            const [nameStr, priceStr, availabilityStr, mealTypeIdStr] = params;
            const name = nameStr.toString();
            const price = parseFloat(priceStr);
            const availability = availabilityStr === 'true';
            const meal_type_id = parseInt(mealTypeIdStr);
            adminController.addMenuItem({ menu_item_id: 0, name, availability, price, meal_type_id});
            break;
        case 'admin_updateMenuItem':
            const [menuItemIdStr, newNameStr, newPriceStr, newAvailabilityStr, newMealTypeIdStr] = params;
            const menuItemId = parseInt(menuItemIdStr);
            const newName = newNameStr.toString();
            const newPrice = parseFloat(newPriceStr);
            const newAvailability = newAvailabilityStr === 'true';
            const newMealTypeId = parseInt(newMealTypeIdStr);
            adminController.updateMenuItem({ menu_item_id: menuItemId, name: newName, availability: newAvailability, price: newPrice, meal_type_id: newMealTypeId});
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
        default:
            response = 'Unknown admin command';
            break;
    }

    // socket.write(response + '\n');
}
