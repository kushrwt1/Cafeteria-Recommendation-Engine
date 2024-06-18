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
    addDailyMenu(dailyMenu) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.execute('INSERT INTO Chef_Daily_Menus (menu_item_id, date) VALUES (?, ?)', [dailyMenu.menu_item_id, dailyMenu.date]);
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
}
exports.ChefDailyMenuRepository = ChefDailyMenuRepository;
