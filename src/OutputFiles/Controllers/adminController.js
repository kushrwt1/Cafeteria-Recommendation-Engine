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
exports.AdminController = void 0;
const database_1 = require("../Database/database");
class AdminController {
    addMenuItem(item) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.execute('INSERT INTO menu_items (name, price, availability) VALUES (?, ?, ?)', [item.name, item.price, item.availability]);
        });
    }
    updateMenuItem(item) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.execute('UPDATE menu_items SET name = ?, price = ?, availability = ? WHERE id = ?', [item.name, item.price, item.availability, item.id]);
        });
    }
    deleteMenuItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.execute('DELETE FROM menu_items WHERE id = ?', [id]);
        });
    }
    viewMenuItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.execute('DELETE FROM menu_items WHERE id = ?', [id]);
        });
    }
}
exports.AdminController = AdminController;
