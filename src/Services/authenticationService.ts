import { db } from '../Utils/database';
import { User } from '../Models/user';  

export class AuthenticationService {
    public async authenticateUser(id: number, name: string): Promise<User | null> {
        const [rows] = await db.execute('SELECT * FROM users WHERE id = ? AND name = ?', [id, name]);
        if (rows.length > 0) {
            const user = rows[0];
            return new User(user.id, user.name, user.role);
        }
        return null;
    }
}