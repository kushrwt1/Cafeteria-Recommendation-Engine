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
exports.EmployeeMenuSelectionRepository = void 0;
const database_1 = require("../../Database/database");
class EmployeeMenuSelectionRepository {
    getAllEmployeeMenuSelections() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.db.execute('SELECT * FROM Employee_Menu_Selections');
            return rows;
        });
    }
    getEmployeeMenuSelectionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.db.execute('SELECT * FROM Employee_Menu_Selections WHERE id = ?', [id]);
            const userMenuSelections = rows;
            return userMenuSelections.length > 0 ? userMenuSelections[0] : null;
        });
    }
    addEmployeeMenuSelection(userMenuSelection) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.execute('INSERT INTO Employee_Menu_Selections (user_id, menu_item_id, selection_date) VALUES (?, ?, ?)', [userMenuSelection.user_id, userMenuSelection.menu_item_id, userMenuSelection.selection_date]);
        });
    }
    updateEmployeeMenuSelection(userMenuSelection) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.execute('UPDATE Employee_Menu_Selections SET user_id = ?, menu_item_id = ?, selection_date = ? WHERE id = ?', [userMenuSelection.user_id, userMenuSelection.menu_item_id, userMenuSelection.selection_date, userMenuSelection.id]);
        });
    }
    deleteEmployeeMenuSelection(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.execute('DELETE FROM Employee_Menu_Selections WHERE id = ?', [id]);
        });
    }
}
exports.EmployeeMenuSelectionRepository = EmployeeMenuSelectionRepository;
