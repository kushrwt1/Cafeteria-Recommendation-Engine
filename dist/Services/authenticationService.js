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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
const serverProtocol_1 = require("../Server/serverProtocol");
class AuthenticationService {
    constructor(userRepository, roleRepository, userActivityService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userActivityService = userActivityService;
    }
    authenticateLoginCredentials(socket, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = JSON.parse(body);
            try {
                const user = yield this.userRepository.getUserByNameAndPassword(username, password);
                if (user) {
                    const role = yield this.roleRepository.getRoleById(user.role_id);
                    if (role) {
                        serverProtocol_1.ServerProtocol.sendResponse(socket, 'LOGIN_SUCCESS', {}, { role: role.role_name, userId: user.user_id, username }, 'json');
                        this.userActivityService.logActivity(user.user_id, 'Logged In');
                    }
                    else {
                        serverProtocol_1.ServerProtocol.sendResponse(socket, 'ERROR Role not found', {}, 'Role not found', 'string');
                    }
                }
                else {
                    serverProtocol_1.ServerProtocol.sendResponse(socket, 'ERROR Invalid credentials', {}, 'Invalid credentials', 'string');
                }
            }
            catch (error) {
                console.error(`Error during login: ${error}`);
                serverProtocol_1.ServerProtocol.sendResponse(socket, 'ERROR', {}, `ERROR: ${error}\n`, 'string');
            }
        });
    }
}
exports.AuthenticationService = AuthenticationService;
