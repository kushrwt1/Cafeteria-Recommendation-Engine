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
exports.UserRepository = void 0;
const database_1 = require("../../Database/database");
class UserRepository {
    getUserByNameAndPassword(name, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [rows] = yield database_1.db.execute("SELECT * FROM Users WHERE name = ? AND password = ?", [name, password]);
                const users = rows;
                return users.length > 0 ? users[0] : null;
            }
            catch (error) {
                console.error(`Error fetching user: ${error}`);
                throw new Error("Database query failed");
            }
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.db.execute("SELECT * FROM Users");
            return rows;
        });
    }
    getUserById(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.db.execute("SELECT * FROM Users WHERE user_id = ?", [
                user_id,
            ]);
            const users = rows;
            return users.length > 0 ? users[0] : null;
        });
    }
    addUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.execute("INSERT INTO Users (name, password, role_id) VALUES (?, ?, ?)", [user.name, user.password, user.role_id]);
        });
    }
    updateUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.execute("UPDATE Users SET name = ?, password = ?, role_id = ? WHERE user_id = ?", [user.name, user.password, user.role_id, user.user_id]);
        });
    }
    deleteUser(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.execute("DELETE FROM Users WHERE user_id = ?", [user_id]);
        });
    }
}
exports.UserRepository = UserRepository;
