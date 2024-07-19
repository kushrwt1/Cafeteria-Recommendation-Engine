import net from 'net';
import { UserRepository } from '../Utils/Database Repositories/userRepository';
import { RoleRepository } from '../Utils/Database Repositories/roleRepository';
import { UserActivityService } from '../Services/userActivityService';
import { ServerProtocol } from '../Server/serverProtocol';

export class AuthenticationService {
    constructor(
        private userRepository: UserRepository,
        private roleRepository: RoleRepository,
        private userActivityService: UserActivityService
    ) {}

    public async authenticateLoginCredentials(socket: net.Socket, body: any) {
        const { username, password } = JSON.parse(body);
        try {
            const user = await this.userRepository.getUserByNameAndPassword(username, password);
            if (user) {
                const role = await this.roleRepository.getRoleById(user.role_id);
                if (role) {
                    ServerProtocol.sendResponse(socket, 'LOGIN_SUCCESS', {}, { role: role.role_name, userId: user.user_id, username }, 'json');
                    this.userActivityService.logActivity(user.user_id, 'Logged In');
                } else {
                    ServerProtocol.sendResponse(socket, 'ERROR Role not found', {}, 'Role not found', 'string');
                }
            } else {
                ServerProtocol.sendResponse(socket, 'ERROR Invalid credentials', {}, 'Invalid credentials', 'string');
            }
        } catch (error) {
            console.error(`Error during login: ${error}`);
            ServerProtocol.sendResponse(socket, 'ERROR', {}, `ERROR: ${error}\n`, 'string');
        }
    }
}