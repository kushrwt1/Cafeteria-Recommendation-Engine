import { db } from '../Database/database';
import { User } from '../models/user';

export class UserRepository {
    public async getAllUsers(): Promise<User[]> {
        const [rows] = await db.execute('SELECT * FROM users');
        return rows as User[];
    }
}