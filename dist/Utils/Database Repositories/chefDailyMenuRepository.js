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
exports.ChefDailyMenuRepository = void 0;
const database_1 = require("../../Database/database");
class ChefDailyMenuRepository {
    addDailyMenu(dailyMenu) {
        return __awaiter(this, void 0, void 0, function* () {
            const date = new Date(dailyMenu.date).toISOString().split('T')[0];
            yield database_1.db.execute('INSERT INTO Chef_Daily_Menus (menu_item_id, date) VALUES (?, ?)', [dailyMenu.menu_item_id, dailyMenu.date]);
        });
    }
    getAllDailyMenus() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.db.execute('SELECT * FROM Chef_Daily_Menus');
            return rows;
        });
    }
    getDailyMenuById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.db.execute('SELECT * FROM Chef_Daily_Menus WHERE id = ?', [id]);
            const dailyMenus = rows;
            return dailyMenus.length > 0 ? dailyMenus[0] : null;
        });
    }
    updateDailyMenu(dailyMenu) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.execute('UPDATE Chef_Daily_Menus SET menu_item_id = ?, date = ? WHERE id = ?', [dailyMenu.menu_item_id, dailyMenu.date, dailyMenu.id]);
        });
    }
    deleteDailyMenu(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.execute('DELETE FROM Chef_Daily_Menus WHERE id = ?', [id]);
        });
    }
    getTodaysRolledOutMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            // Get today's date in YYYY-MM-DD format
            const today = new Date().toISOString().split('T')[0];
            // Query the database to get the menu for today's date
            const [rows] = yield database_1.db.execute('SELECT * FROM Chef_Daily_Menus WHERE DATE(date) = ?', [today]);
            // Check if any menu is found
            // return rows as ChefDailyMenus[];
            const rolledOutMenu = rows;
            return rolledOutMenu.length > 0 ? rolledOutMenu : null;
        });
    }
}
exports.ChefDailyMenuRepository = ChefDailyMenuRepository;
