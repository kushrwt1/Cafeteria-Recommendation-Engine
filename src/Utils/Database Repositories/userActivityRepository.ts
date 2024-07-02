// repositories/UserActivityRepository.ts

import { db } from '../../Database/database';
import { UserActivity } from '../../Models/userActivity';

export class UserActivityRepository {
    public async logActivity(userActivity: UserActivity): Promise<void> {
        const query = `
            INSERT INTO user_activity (user_id, activity_type)
            VALUES (?, ?)
        `;
        await db.execute(query, [userActivity.user_id, userActivity.activity_type]);
    }

    public async getActivitiesByUserId(userId: number): Promise<UserActivity[]> {
        const query = `
            SELECT * FROM user_activity
            WHERE user_id = ?
            ORDER BY activity_timestamp DESC
        `;
        const [rows] = await db.execute(query, [userId]);
        return rows as UserActivity[];
    }

    public async getAllActivities(): Promise<UserActivity[]> {
        const query = `
            SELECT * FROM user_activity
            ORDER BY activity_timestamp DESC
        `;
        const [rows] = await db.execute(query);
        return rows as UserActivity[];
    }
}
