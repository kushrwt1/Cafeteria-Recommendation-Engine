import net from 'net';
import { AdminController } from '../../Controllers/adminController';
import { ChefController } from '../../Controllers/chefController';
import { UserController } from '../../Controllers/employeeController';
import readline from 'readline';


export function showMenu(role: string, userId: number, client: net.Socket, rl:readline.Interface) {
    const roleBasedMenu = new RoleBasedMenu(client, rl);
    switch (role) {
        case 'admin':
            roleBasedMenu.adminMenu();
            break;
        case 'chef':
            roleBasedMenu.chefMenu();
            break;
        case 'employee':
            roleBasedMenu.employeeMenu(userId);
            break;
        default:
            console.error('Unknown role');
            client.end();
    }
}

export class RoleBasedMenu {

    constructor(private client: net.Socket, private rl: readline.Interface) {}

    private askQuestion(question: string): Promise<string> {
        return new Promise((resolve) => this.rl.question(question, resolve));
    }

    public async adminMenu() {
        console.log("1. Add Menu Item");
        console.log("2. Update Menu Item");
        console.log("3. Delete Menu Item");
        console.log("4. View All Menu Items");
        console.log("5. Exit");

        const option = await this.askQuestion('Choose an option: ');

        try {
            switch (option) {
                case '1':
                    await this.addMenuItem();
                    break;
                case '2':
                    this.updateMenuItem();
                    break;
                case '3':
                    this.deleteMenuItem();
                    break;
                case '4':
                    this.viewAllMenuItems();
                    break;
                case '5':
                    this.rl.close();
                    break;
                default:
                    console.log("Invalid option");
                    this.adminMenu();
                    break;
            }
        } catch (error) {
            console.error(`Admin menu error: ${error}`);
            this.adminMenu();
        }
    }

    private async addMenuItem() {
        const name = await this.askQuestion('Enter item name: ');
        const priceStr = await this.askQuestion('Enter item price: ');
        const price = parseFloat(priceStr);
        const availabilityStr = await this.askQuestion('Is the item available? (yes/no): ');
        const availability = availabilityStr.toLowerCase() === 'yes';
        const mealTypeIdStr = await this.askQuestion('Enter Meal Type Id(1 for breakfast, 2 For lunch, 3 for dinner) : ');
        const mealTypeId = parseInt(mealTypeIdStr);

        const command = `admin_addMenuItem;${name};${price};${availability};${mealTypeId}`;
        this.client.write(command);
        this.adminMenu();
    }

    private async updateMenuItem() {
        const menuItemIdStr = await this.askQuestion('Enter Menu item ID: ');
        const menuItemId = parseInt(menuItemIdStr);
        const name = await this.askQuestion('Enter new name of this item: ');
        const priceStr = await this.askQuestion('Enter new price of this item: ');
        const price = parseFloat(priceStr);
        const availabilityStr = await this.askQuestion('Is the item available? (yes/no): ');
        const availability = availabilityStr.toLowerCase() === 'yes';
        const mealTypeIdStr = await this.askQuestion('Enter Meal Type Id(1 for breakfast, 2 For lunch, 3 for dinner) : ');
        const mealTypeId = parseInt(mealTypeIdStr);

        const command = `admin_updateMenuItem;${menuItemId};${name};${price};${availability};${mealTypeId}`;
        this.client.write(command);
        this.adminMenu();
    }

    private async deleteMenuItem() {
        const menuItemIdStr = await this.askQuestion('Enter item ID: ');
        const menuItemId = parseInt(menuItemIdStr);

        const command = `admin_deleteMenuItem;${menuItemId}`;
        this.client.write(command);
        this.adminMenu();
    }

    private async viewAllMenuItems() {
        const command = `admin_viewAllMenuItem`;
        this.client.write(command);
    }


    public async chefMenu() {
        console.log("1. Roll out menu");
        console.log("2. Exit");

        // const option = await this.askQuestion('Choose an option: ');

        // try {
        //     switch (option) {
        //         case '1':
        //             const idsStr = await this.askQuestion('Enter item IDs to roll out (comma-separated): ');
        //             const ids = idsStr.split(',').map(id => parseInt(id.trim()));
        //             await chefController.rollOutMenu(ids);
        //             console.log("Menu rolled out.");
        //             this.chefMenu(chefController);
        //             break;
        //         case '2':
        //             this.rl.close();
        //             break;
        //         default:
        //             console.log("Invalid option");
        //             this.chefMenu(chefController);
        //             break;
        //     }
        // } catch (error) {
        //     console.error(`Chef menu error: ${error}`);
        //     this.chefMenu(chefController);
        // }
    }

    public async employeeMenu(userId: number) {
        console.log("1. Give feedback");
        console.log("2. Exit");

        // const option = await this.askQuestion('Choose an option: ');

        // try {
        //     switch (option) {
        //         case '1':
        //             const itemIdStr = await this.askQuestion('Enter item ID: ');
        //             const itemId = parseInt(itemIdStr);
        //             const ratingStr = await this.askQuestion('Enter rating (1-5): ');
        //             const rating = parseInt(ratingStr);
        //             const comment = await this.askQuestion('Enter comment: ');
        //             await userController.giveFeedback(userId, itemId, rating, comment);
        //             console.log("Feedback submitted.");
        //             this.employeeMenu(userController, userId);
        //             break;
        //         case '2':
        //             this.rl.close();
        //             break;
        //         default:
        //             console.log("Invalid option");
        //             this.employeeMenu(userController, userId);
        //             break;
        //     }
        // } catch (error) {
        //     console.error(`Employee menu error: ${error}`);
        //     this.employeeMenu(userController, userId);
        // }
    }
}
