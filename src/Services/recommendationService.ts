import { db } from '../Utils/database';
import { MenuItem } from '../Models/menuItem';

export class RecommendationService {
    public async getRecommendations(): Promise<MenuItem[]> {
        const [rows] = await db.execute('SELECT * FROM recommendations');
        return rows.map((row: any) => new MenuItem(row.id, row.name, row.price, row.availability));
    }
}
