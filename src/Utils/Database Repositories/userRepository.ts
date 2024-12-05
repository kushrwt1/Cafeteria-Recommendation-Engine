import { db } from "../../Database/database";
import { User } from "../../Models/user";

export class UserRepository {
  public async getUserByNameAndPassword(
    name: string,
    password: string
  ): Promise<User | null> {
    try {
      const [rows] = await db.execute(
        "SELECT * FROM Users WHERE name = ? AND password = ?",
        [name, password]
      );
      const users = rows as User[];
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error(`Error fetching user: ${error}`);
      throw new Error("Database query failed");
    }
  }

  public async getAllUsers(): Promise<User[]> {
    const [rows] = await db.execute("SELECT * FROM Users");
    return rows as User[];
  }

  public async getUserById(user_id: number): Promise<User | null> {
    const [rows] = await db.execute("SELECT * FROM Users WHERE user_id = ?", [
      user_id,
    ]);
    const users = rows as User[];
    return users.length > 0 ? users[0] : null;
  }

  public async addUser(user: User): Promise<void> {
    await db.execute(
      "INSERT INTO Users (name, password, role_id) VALUES (?, ?, ?)",
      [user.name, user.password, user.role_id]
    );
  }

  public async updateUser(user: User): Promise<void> {
    await db.execute(
      "UPDATE Users SET name = ?, password = ?, role_id = ? WHERE user_id = ?",
      [user.name, user.password, user.role_id, user.user_id]
    );
  }

  public async deleteUser(user_id: number): Promise<void> {
    await db.execute("DELETE FROM Users WHERE user_id = ?", [user_id]);
  }
}
