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
exports.MealTypeRepository = void 0;
const database_1 = require("../../Database/database");
class MealTypeRepository {
    getAllMealTypes() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.db.execute("SELECT * FROM Meal_Types");
            return rows;
        });
    }
    getMealTypeById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.db.execute("SELECT * FROM Meal_Types WHERE id = ?", [
                id,
            ]);
            const mealTypes = rows;
            return mealTypes.length > 0 ? mealTypes[0] : null;
        });
    }
    addMealType(mealType) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.execute("INSERT INTO Meal_Types (meal_name) VALUES (?)", [
                mealType.meal_name,
            ]);
        });
    }
    updateMealType(mealType) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.execute("UPDATE Meal_Types SET meal_name = ? WHERE id = ?", [
                mealType.meal_name,
                mealType.id,
            ]);
        });
    }
    deleteMealType(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.execute("DELETE FROM Meal_Types WHERE id = ?", [id]);
        });
    }
}
exports.MealTypeRepository = MealTypeRepository;
