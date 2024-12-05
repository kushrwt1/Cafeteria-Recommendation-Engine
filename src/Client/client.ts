import net from 'net';
import readline from 'readline';
import { RoleBasedMenu } from '../Features/RoleBasedMenus/roleBasedMenu';
import { ClientProtocol } from './clientProtocol';
import { AdminResponseHandler } from './adminResponseHandler';
import { ChefResponseHandler } from './chefResponseHandler';
import { EmployeeResponseHandler } from './employeeResponseHandler';

class Client {
    private client!: net.Socket;
    private rl!: readline.Interface;
    private roleBasedMenuObject!: RoleBasedMenu;
    private userIdFromServer!: number;
    private adminResponseHandlerObject!: AdminResponseHandler;
    private chefResponseHandlerObject!: ChefResponseHandler;
    private employeeResponseHandlerObject!: EmployeeResponseHandler;

    constructor() {
        this.connectToServer();
    }

    private connectToServer() {
        try {
            this.client = net.createConnection({ port: 3000 }, () => {
                console.log('Connected to server');
                console.log("\nEnter Your Credentials to Log In:");
                this.login();
            });

            this.rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
                prompt: 'COMMAND> '
            });

            this.roleBasedMenuObject = new RoleBasedMenu(this.client, this.rl, this.logout.bind(this));
            this.adminResponseHandlerObject = new AdminResponseHandler(this.client, this.rl, this.logout.bind(this));
            this.chefResponseHandlerObject = new ChefResponseHandler(this.client, this.rl, this.logout.bind(this));
            this.employeeResponseHandlerObject = new EmployeeResponseHandler(this.client, this.rl, this.logout.bind(this));

            this.setupClient();
        } catch (error) {
            console.error('Error connecting to server:', error);
            this.retryConnection();
        }
    }

    private setupClient() {
        this.client.on('data', (data) => {
            try {
                const message = data.toString().trim();
                const { command, headers, body } = ClientProtocol.decodeRequest(message);
                this.handlResponses(command, body);
            } catch (error) {
                console.error('Error processing server data:', error);
            }
        });

        this.client.on('end', () => {
            console.log('Disconnected from server');
            this.rl.close();
        });

        this.client.on('error', (err) => {
            console.error(`Client error: ${err.message}`);
            this.retryConnection();
        });
    }

    private askQuestion(question: string): Promise<string> {
        return new Promise((resolve) => this.rl.question(question, resolve));
    }

    private handlResponses(command: string, body: any) {
        try {
            if (command === 'LOGIN_SUCCESS') {
                this.handleLoginResponse(body);
            } 
            else if (command === 'ERROR Invalid credentials') {
                console.log("\nYour Credentials are invalid. Please enter the valid credentials: ");
                this.login();
            }
            else if (command === 'Response_viewAllMenuItems') {
                this.adminResponseHandlerObject.handleViewAllMenuItemsResponse(body, this.userIdFromServer);
            } 
            else if (command === 'Response_getRecommendedItems') {
                this.chefResponseHandlerObject.handleGetRecommendedItemsResponse(body, this.userIdFromServer);
            } 
            else if (command === 'Response_Chef_viewAllMenuItems') {
                this.chefResponseHandlerObject.handleViewAllMenuItemsResponse(body, this.userIdFromServer);
            }
            else if (command === 'Response_employee_viewAllMenuItems') {
                this.employeeResponseHandlerObject.handleViewAllMenuItemsResponse(body, this.userIdFromServer);
            }
            else if (command === 'Response_viewNotifications') {
                this.employeeResponseHandlerObject.handleViewNotificationsResponse(body, this.userIdFromServer);
            } 
            else if (command === 'Response_rolledOutMenu') {
                this.employeeResponseHandlerObject.handleRolledOutMenuResponse(body, this.userIdFromServer);
            } 
            else if (command === 'Response_admin_viewDiscardedMenuItems') {
                this.adminResponseHandlerObject.handleViewDiscardedMenuItemsResponse(body, this.userIdFromServer);
            }
            else if (command === 'Response_chef_viewDiscardedMenuItems') {
                this.chefResponseHandlerObject.handleViewDiscardedMenuItemsResponse(body, this.userIdFromServer);
            }
            else if (command.includes('ERROR')) {
                console.error(command);
                this.client.end();
            } else {
                this.rl.prompt();
            }
        } catch (error) {
            console.error('Error handling response:', error);
        }
    }

    private async login() {
        try {
            const username = await this.askQuestion('Enter username: ');
            const password = await this.askQuestion('Enter password: ');
            ClientProtocol.sendRequest(this.client, 'LOGIN', {}, { username, password }, 'json');
        } catch (error) {
            console.error(`Login error: ${error}`);
        }
    }

    private handleLoginResponse(body: any) {
        try {
            const { role, userId, username } = JSON.parse(body);
            this.userIdFromServer = userId;
            console.log('\n=========================================================================================');
            console.log(`Welcome ${username}`);
            console.log('=========================================================================================');
            this.roleBasedMenuObject.showMenu(role, userId, this.client, this.rl, this.logout.bind(this));
        } catch (error) {
            console.error('Error processing login response:', error);
        }
    }

    private logout(userId: number) {
        try {
            ClientProtocol.sendRequest(this.client, 'LogUserActivity', {}, { userId, message: 'Logged Out' }, 'json');
            this.client.end();
            this.rl.close();
            console.log('Logged out. Please wait while reconnecting...');
            setTimeout(() => {
                this.connectToServer();
            }, 1000);
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }

    private retryConnection() {
        console.log('Attempting to reconnect...');
        setTimeout(() => {
            this.connectToServer();
        }, 5000);
    }
}

const clientObject = new Client();
