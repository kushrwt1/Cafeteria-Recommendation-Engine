import { UserActivityRepository } from '../Utils/Database Repositories/userActivityRepository';
import { UserActivity } from '../Models/userActivity';

export class UserActivityService {
    private userActivityRepository: UserActivityRepository;

    constructor() {
        this.userActivityRepository = new UserActivityRepository();
    }

    public async logActivity(userId: number, activityType: string): Promise<void> {
        const userActivity: UserActivity = {
            user_id: userId,
            activity_type: activityType
        };
        await this.userActivityRepository.logActivity(userActivity);
    }

    public async getUserActivities(userId: number): Promise<UserActivity[]> {
        return await this.userActivityRepository.getActivitiesByUserId(userId);
    }

    public async getAllActivities(): Promise<UserActivity[]> {
        return await this.userActivityRepository.getAllActivities();
    }
}
