import net from 'net';
import readline from 'readline';
import { RoleBasedMenu, showMenu } from '../Features/RoleBasedMenus/roleBasedMenu';
import { AdminController } from '../Controllers/adminController';
import { ChefController } from '../Controllers/chefController';
import { UserController } from '../Controllers/employeeController';


const client = net.createConnection({ port: 3000 }, () => {
    console.log('Connected to server');
    login();
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'COMMAND> '
});

const roleBasedMenu = new RoleBasedMenu(client, rl);

client.on('data', (data) => {
    const message = data.toString().trim();

    if (message.includes('LOGIN_SUCCESS')) {
        const [_, role, userIdStr] = message.split(' ');
        const userId = parseInt(userIdStr, 10);
        showMenu(role, userId, client, rl);
    } else if (message.includes('Response_viewAllMenuItems')) {
        const [command, menuItemsStr] = message.split(';');
        const menuItems = JSON.parse(menuItemsStr);
        console.log(menuItems);
        roleBasedMenu.adminMenu();
    }
    else if (message.includes('ERROR')) {
        console.error(message);
        client.end();
    } else {
        rl.prompt();
    }
});

client.on('end', () => {
    console.log('Disconnected from server');
    rl.close();
});

client.on('error', (err) => {
    console.error(`Client error: ${err.message}`);
});

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//     prompt: 'COMMAND> '
// });

function askQuestion(question: string): Promise<string> {
    return new Promise((resolve) => rl.question(question, resolve));
}

async function login() {
    try {
        const username = await askQuestion('Enter username: ');
        const password = await askQuestion('Enter password: ');
        client.write(`LOGIN;${username};${password}`);
    } catch (error) {
        console.error(`Login error: ${error}`);
    }
}