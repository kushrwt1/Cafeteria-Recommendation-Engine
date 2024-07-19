import net from 'net';
import { AuthenticationService } from '../Services/authenticationService';
import { UserRepository } from '../Utils/Database Repositories/userRepository';
import { RoleRepository } from '../Utils/Database Repositories/roleRepository';
import { UserActivityService } from '../Services/userActivityService';
import { ServerProtocol } from '../Server/serverProtocol';

jest.mock('../Utils/Database Repositories/userRepository');
jest.mock('../Utils/Database Repositories/roleRepository');
jest.mock('../Services/userActivityService');
jest.mock('../Server/serverProtocol');

describe('AuthenticationService', () => {
    let authenticationService: AuthenticationService;
    let userRepository: jest.Mocked<UserRepository>;
    let roleRepository: jest.Mocked<RoleRepository>;
    let userActivityService: jest.Mocked<UserActivityService>;

    beforeEach(() => {
        userRepository = new UserRepository() as jest.Mocked<UserRepository>;
        roleRepository = new RoleRepository() as jest.Mocked<RoleRepository>;
        userActivityService = new UserActivityService() as jest.Mocked<UserActivityService>;
        authenticationService = new AuthenticationService(userRepository, roleRepository, userActivityService);
    });

    it('should authenticate user and send success response', async () => {
        const socket = new net.Socket();
        const body = JSON.stringify({ name: 'testUser', password: 'testPassword' });
        const user = { user_id: 1, name: 'testUser', password: 'testPassword', role_id: 1 };
        const role = { role_id: 1, role_name: 'admin' };

        userRepository.getUserByNameAndPassword.mockResolvedValue(user);
        roleRepository.getRoleById.mockResolvedValue(role);
        const sendResponseSpy = jest.spyOn(ServerProtocol, 'sendResponse');
        const logActivitySpy = jest.spyOn(userActivityService, 'logActivity');

        await authenticationService.authenticateLoginCredentials(socket, body);

        expect(userRepository.getUserByNameAndPassword).toHaveBeenCalledWith('testUser', 'testPassword');
        expect(roleRepository.getRoleById).toHaveBeenCalledWith(1);
        expect(sendResponseSpy).toHaveBeenCalledWith(socket, 'LOGIN_SUCCESS', {}, { role: 'admin', userId: 1, username: 'testUser' }, 'json');
        expect(logActivitySpy).toHaveBeenCalledWith(1, 'Logged In');
    });

    it('should send error response when role is not found', async () => {
        const socket = new net.Socket();
        const body = JSON.stringify({ name: 'testUser', password: 'testPassword' });
        const user = { user_id: 1, name: 'testUser', password: 'testPassword', role_id: 1 };

        userRepository.getUserByNameAndPassword.mockResolvedValue(user);
        roleRepository.getRoleById.mockResolvedValue(null);
        const sendResponseSpy = jest.spyOn(ServerProtocol, 'sendResponse');

        await authenticationService.authenticateLoginCredentials(socket, body);

        expect(userRepository.getUserByNameAndPassword).toHaveBeenCalledWith('testUser', 'testPassword');
        expect(roleRepository.getRoleById).toHaveBeenCalledWith(1);
        expect(sendResponseSpy).toHaveBeenCalledWith(socket, 'ERROR Role not found', {}, 'Role not found', 'string');
    });

    it('should send error response when credentials are invalid', async () => {
        const socket = new net.Socket();
        const body = JSON.stringify({ username: 'testUser', password: 'testPassword' });

        userRepository.getUserByNameAndPassword.mockResolvedValue(null);
        const sendResponseSpy = jest.spyOn(ServerProtocol, 'sendResponse');

        await authenticationService.authenticateLoginCredentials(socket, body);

        expect(userRepository.getUserByNameAndPassword).toHaveBeenCalledWith('testUser', 'testPassword');
        expect(sendResponseSpy).toHaveBeenCalledWith(socket, 'ERROR Invalid credentials', {}, 'Invalid credentials', 'string');
    });

    it('should send error response when an exception occurs', async () => {
        const socket = new net.Socket();
        const body = JSON.stringify({ username: 'testUser', password: 'testPassword' });
        const errorMessage = 'Database connection failed';

        userRepository.getUserByNameAndPassword.mockRejectedValue(new Error(errorMessage));
        const sendResponseSpy = jest.spyOn(ServerProtocol, 'sendResponse');

        await authenticationService.authenticateLoginCredentials(socket, body);

        expect(userRepository.getUserByNameAndPassword).toHaveBeenCalledWith('testUser', 'testPassword');
        expect(sendResponseSpy).toHaveBeenCalledWith(socket, 'ERROR', {}, `ERROR: ${errorMessage}\n`, 'string');
    });
});
