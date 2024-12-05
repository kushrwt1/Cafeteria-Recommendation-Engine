"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = __importDefault(require("net"));
const readline_1 = __importDefault(require("readline"));
const roleBasedMenu_1 = require("../Features/RoleBasedMenus/roleBasedMenu");
const clientProtocol_1 = require("./clientProtocol");
const adminResponseHandler_1 = require("./adminResponseHandler");
const chefResponseHandler_1 = require("./chefResponseHandler");
const employeeResponseHandler_1 = require("./employeeResponseHandler");
class Client {
    constructor() {
        this.connectToServer();
    }
    connectToServer() {
        this.client = net_1.default.createConnection({ port: 3000 }, () => {
            console.log('Connected to server');
            console.log("\nEnter Your Credentials to Log In:");
            this.login();
        });
        this.rl = readline_1.default.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: 'COMMAND> '
        });
        this.roleBasedMenuObject = new roleBasedMenu_1.RoleBasedMenu(this.client, this.rl, this.logout.bind(this));
        this.adminResponseHandlerObject = new adminResponseHandler_1.AdminResponseHandler(this.client, this.rl, this.logout.bind(this));
        this.chefResponseHandlerObject = new chefResponseHandler_1.ChefResponseHandler(this.client, this.rl, this.logout.bind(this));
        this.employeeResponseHandlerObject = new employeeResponseHandler_1.EmployeeResponseHandler(this.client, this.rl, this.logout.bind(this));
        this.setupClient();
    }
    setupClient() {
        this.client.on('data', (data) => {
            const message = data.toString().trim();
            const { command, headers, body } = clientProtocol_1.ClientProtocol.decodeRequest(message);
            this.handlResponses(command, body);
        });
        this.client.on('end', () => {
            console.log('Disconnected from server');
            this.rl.close();
        });
        this.client.on('error', (err) => {
            console.error(`Client error: ${err.message}`);
        });
    }
    askQuestion(question) {
        return new Promise((resolve) => this.rl.question(question, resolve));
    }
    handlResponses(command, body) {
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
        }
        else {
            this.rl.prompt();
        }
    }
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const username = yield this.askQuestion('Enter username: ');
                const password = yield this.askQuestion('Enter password: ');
                clientProtocol_1.ClientProtocol.sendRequest(this.client, 'LOGIN', {}, { username, password }, 'json');
            }
            catch (error) {
                console.error(`Login error: ${error}`);
            }
        });
    }
    handleLoginResponse(body) {
        const { role, userId, username } = JSON.parse(body);
        this.userIdFromServer = userId;
        console.log('\n=========================================================================================');
        console.log(`Welcome ${username}`);
        console.log('=========================================================================================');
        this.roleBasedMenuObject.showMenu(role, userId, this.client, this.rl, this.logout.bind(this));
    }
    logout(userId) {
        clientProtocol_1.ClientProtocol.sendRequest(this.client, 'LogUserActivity', {}, { userId, message: 'Logged Out' }, 'json');
        this.client.end();
        this.rl.close();
        console.log('Logged out. Please wait while reconnecting...');
        setTimeout(() => {
            this.connectToServer();
        }, 1000);
    }
}
const clientObject = new Client();
