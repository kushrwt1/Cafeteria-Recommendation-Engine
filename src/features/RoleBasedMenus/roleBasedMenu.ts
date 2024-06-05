import {AdminController} from '../../Controllers/adminController';
import {ChefController} from '../../Controllers/chefController';
import {UserController} from '../../Controllers/userController';
import { createInterface } from 'readline';

const readline = createInterface({
    input: process.stdin,
    output: process.stdout
});

export class RoleBasedMenu {
    public adminMenu(adminController: AdminController) {
        console.log("1. Add Menu Item");
        console.log("2. Update Menu Item");
        console.log("3. Delete Menu Item");
        console.log("4. Exit");
        readline.question('Choose an option: ', async (option) => {
            switch (option) {
                case '1':
                    readline.question('Enter item name: ', async (name) => {
                        readline.question('Enter item price: ', async (priceStr) => {
                            const price = parseFloat(priceStr);
                            readline.question('Is the item available? (yes/no): ', async (availabilityStr) => {
                                const availability = availabilityStr.toLowerCase() === 'yes';
                                await adminController.addMenuItem({ id: 0, name, price, availability });
                                console.log("Menu item added.");
                                this.adminMenu(adminController);
                            });
                        });
                    });
                    break;
                case '2':
                    readline.question('Enter item ID: ', async (idStr) => {
                        const id = parseInt(idStr);
                        readline.question('Enter new item name: ', async (name) => {
                            readline.question('Enter new item price: ', async (priceStr) => {
                                const price = parseFloat(priceStr);
                                readline.question('Is the item available? (yes/no): ', async (availabilityStr) => {
                                    const availability = availabilityStr.toLowerCase() === 'yes';
                                    await adminController.updateMenuItem({ id, name, price, availability });
                                    console.log("Menu item updated.");
                                    this.adminMenu(adminController);
                                });
                            });
                        });
                    });
                    break;
                case '3':
                    readline.question('Enter item ID: ', async (idStr) => {
                        const id = parseInt(idStr);
                        await adminController.deleteMenuItem(id);
                        console.log("Menu item deleted.");
                        this.adminMenu(adminController);
                    });
                    break;
                case '4':
                    readline.close();
                    break;
                default:
                    console.log("Invalid option");
                    this.adminMenu(adminController);
                    break;
            }
        });
        }
    
    public chefMenu(chefController: ChefController) {
        console.log("1. Roll out menu");
        console.log("2. Exit");
        readline.question('Choose an option: ', async (option) => {
            switch (option) {
                case '1':
                    readline.question('Enter item IDs to roll out (comma-separated): ', async (idsStr) => {
                        const ids = idsStr.split(',').map(id => parseInt(id.trim()));
                        await chefController.rollOutMenu(ids);
                        console.log("Menu rolled out.");
                        this.chefMenu(chefController);
                    });
                    break;
                case '2':
                    readline.close();
                    break;
                default:
                    console.log("Invalid option");
                    this.chefMenu(chefController);
                    break;
            }
        });
}

    public userMenu(userController: UserController, userId: number) {
        console.log("1. Give feedback");
        console.log("2. Exit");
        readline.question('Choose an option: ', async (option) => {
            switch (option) {
                case '1':
                    readline.question('Enter item ID: ', async (itemIdStr) => {
                        const itemId = parseInt(itemIdStr);
                        readline.question('Enter rating (1-5): ', async (ratingStr) => {
                            const rating = parseInt(ratingStr);
                            readline.question('Enter comment: ', async (comment) => {
                                await userController.giveFeedback(userId, itemId, rating, comment);
                                console.log("Feedback submitted.");
                                this.userMenu(userController, userId);
                            });
                        });
                    });
                    break;
                case '2':
                    readline.close();
                    break;
                default:
                    console.log("Invalid option");
                    this.userMenu(userController, userId);
                    break;
            }
        });
    }

}

