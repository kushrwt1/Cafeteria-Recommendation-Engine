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
exports.RoleRepository = void 0;
const database_1 = require("../../Database/database");
class RoleRepository {
    getAllRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.db.execute("SELECT * FROM Roles");
            return rows;
        });
    }
    getRoleById(role_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.db.execute("SELECT * FROM Roles WHERE role_id = ?", [
                role_id,
            ]);
            const roles = rows;
            return roles.length > 0 ? roles[0] : null;
        });
    }
    addRole(role) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.execute("INSERT INTO Roles (role_name) VALUES (?)", [
                role.role_name,
            ]);
        });
    }
    updateRole(role) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.execute("UPDATE Roles SET role_name = ? WHERE role_id = ?", [
                role.role_name,
                role.role_id,
            ]);
        });
    }
    deleteRole(role_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.execute("DELETE FROM Roles WHERE role_id = ?", [role_id]);
        });
    }
}
exports.RoleRepository = RoleRepository;
