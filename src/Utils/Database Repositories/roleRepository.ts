import { db } from '../../Database/database';
import { Role } from '../../Models/role';

export class RoleRepository {
    public async getAllRoles(): Promise<Role[]> {
        const [rows] = await db.execute('SELECT * FROM Roles');
        return rows as Role[];
    }
    
    public async getRoleById(role_id: number): Promise<Role | null> {
        const [rows] = await db.execute('SELECT * FROM Roles WHERE role_id = ?', [role_id]);
        const roles = rows as Role[];
        return roles.length > 0 ? roles[0] : null;
    }

    public async addRole(role: Role): Promise<void> {
        await db.execute('INSERT INTO Roles (role_name) VALUES (?)', [role.role_name]);
    }

    public async updateRole(role: Role): Promise<void> {
        await db.execute('UPDATE Roles SET role_name = ? WHERE role_id = ?', [role.role_name, role.role_id]);
    }

    public async deleteRole(role_id: number): Promise<void> {
        await db.execute('DELETE FROM Roles WHERE role_id = ?', [role_id]);
    }
}
