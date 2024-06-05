import { AuthenticationService } from '../services/authenticationService';
import { AdminController } from '../Controllers/adminController';
import { ChefController } from '../Controllers/chefController';
import { UserController } from '../Controllers/userController';
import {RoleBasedMenu} from '../features/RoleBasedMenus/roleBasedMenu'
import { createInterface } from 'readline';

const readline = createInterface({
    input: process.stdin,
    output: process.stdout
});

let roleBasedMenuObject = new RoleBasedMenu();

async function main() {
    const authService = new AuthenticationService();
    const adminController = new AdminController();
    const chefController = new ChefController();
    const userController = new UserController();

    console.log("Welcome to the Cafeteria Recommendation Engine");

    readline.question('Enter your ID: ', async (idStr) => {
        const id = parseInt(idStr);
        readline.question('Enter your name: ', async (name) => {
            const user = await authService.authenticateUser(id, name);
            if (user) {
                console.log(`Hello, ${user.name}. You are logged in as ${user.role}.`);
                if (user.role === 'admin') {
                    roleBasedMenuObject.adminMenu(adminController);
                } else if (user.role === 'chef') {
                    roleBasedMenuObject.chefMenu(chefController);
                } else if (user.role === 'employee') {
                    roleBasedMenuObject.userMenu(userController, user.id);
                }
            } else {
                console.log("Authentication failed");
                readline.close();
            }
        });
    });
}

main();
