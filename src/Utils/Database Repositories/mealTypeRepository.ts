import { db } from '../../Database/database';
import { MealType } from '../../Models/mealType';

export class MealTypeRepository {
    public async getAllMealTypes(): Promise<MealType[]> {
        const [rows] = await db.execute('SELECT * FROM Meal_Types');
        return rows as MealType[];
    }

    public async getMealTypeById(id: number): Promise<MealType | null> {
        const [rows] = await db.execute('SELECT * FROM Meal_Types WHERE id = ?', [id]);
        const mealTypes = rows as MealType[];
        return mealTypes.length > 0 ? mealTypes[0] : null;
    }

    public async addMealType(mealType: MealType): Promise<void> {
        await db.execute('INSERT INTO Meal_Types (meal_name) VALUES (?)', [mealType.meal_name]);
    }

    public async updateMealType(mealType: MealType): Promise<void> {
        await db.execute('UPDATE Meal_Types SET meal_name = ? WHERE id = ?', [mealType.meal_name, mealType.id]);
    }

    public async deleteMealType(id: number): Promise<void> {
        await db.execute('DELETE FROM Meal_Types WHERE id = ?', [id]);
    }
}
