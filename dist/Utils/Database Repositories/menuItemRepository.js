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
exports.MenuItemRepository = void 0;
const database_1 = require("../../Database/database");
class MenuItemRepository {
    getAllMenuItems() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.db.execute('SELECT * FROM Menu_Items');
            return rows;
        });
    }
    getMenuItemById(menu_item_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.db.execute('SELECT * FROM Menu_Items WHERE menu_item_id = ?', [menu_item_id]);
            const menuItems = rows;
            return menuItems.length > 0 ? menuItems[0] : null;
        });
    }
    addMenuItem(menuItem, socket) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.execute('INSERT INTO Menu_Items (name, availability, price, meal_type_id) VALUES (?, ?, ?, ?)', [menuItem.name, menuItem.availability, menuItem.price, menuItem.meal_type_id]);
            socket.write("Menu Item Added Successfully");
            console.log("Menu Item added successfully");
        });
    }
    updateMenuItem(menuItem) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.execute('UPDATE Menu_Items SET name = ?, availability = ?, price = ?, meal_type_id = ? WHERE menu_item_id = ?', [menuItem.name, menuItem.availability, menuItem.price, menuItem.meal_type_id, menuItem.menu_item_id]);
        });
    }
    deleteMenuItem(menu_item_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.execute('DELETE FROM Menu_Items WHERE menu_item_id = ?', [menu_item_id]);
            console.log(`Menu Item with Menu Item Id: ${menu_item_id} is deleted from the database`);
        });
    }
}
exports.MenuItemRepository = MenuItemRepository;
