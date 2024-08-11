import { UserActivityRepository } from '../Utils/Database Repositories/userActivityRepository';
import { UserActivity } from '../Models/userActivity';

export class UserActivityService {
    private userActivityRepository: UserActivityRepository;

    constructor() {
        this.userActivityRepository = new UserActivityRepository();
    }

    public async logActivity(userId: number, activityType: string): Promise<void> {
        try {
            const userActivity: UserActivity = {
                user_id: userId,
                activity_type: activityType
            };
            await this.userActivityRepository.logActivity(userActivity);
        } catch (error) {
            console.error(`Error logging activity for user ${userId}:`, error);
            throw new Error(`Failed to log activity for user ${userId}`);
        }
    }

    public async getUserActivities(userId: number): Promise<UserActivity[]> {
        try {
            return await this.userActivityRepository.getActivitiesByUserId(userId);
        } catch (error) {
            console.error(`Error retrieving activities for user ${userId}:`, error);
            throw new Error(`Failed to retrieve activities for user ${userId}`);
        }
    }

    public async getAllActivities(): Promise<UserActivity[]> {
        try {
            return await this.userActivityRepository.getAllActivities();
        } catch (error) {
            console.error("Error retrieving all activities:", error);
            throw new Error("Failed to retrieve all activities");
        }
    }
}
