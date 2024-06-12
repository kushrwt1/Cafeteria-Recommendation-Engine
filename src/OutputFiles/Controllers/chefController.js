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
exports.ChefController = void 0;
const database_1 = require("../Database/database");
class ChefController {
    getRecommendedItems() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    selectItemsFromMenu() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    makeMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            this.getRecommendedItems();
            this.selectItemsFromMenu();
        });
    }
    getSelectedMenuItemsFromUsers() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    rollOutMenu(items) {
        return __awaiter(this, void 0, void 0, function* () {
            // Logic to roll out menu items for the next day
            // Example implementation, adapt as necessary
            yield database_1.db.execute('INSERT INTO rolled_out_menu (item_id) VALUES ?', [items.map(item => [item])]);
        });
    }
}
exports.ChefController = ChefController;
