import { UserRepository } from '../Utils/Database Repositories/userRepository';

(async () => {
    const userRepository = new UserRepository();
    try {
        const users = await userRepository.getAllUsers();
        console.log('All Users:', users);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
})();