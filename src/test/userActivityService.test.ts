import { UserActivityService } from '../Services/userActivityService';
import { UserActivityRepository } from '../Utils/Database Repositories/userActivityRepository';
import { UserActivity } from '../Models/userActivity';

jest.mock('../Utils/Database Repositories/userActivityRepository');

describe('UserActivityService', () => {
    let userActivityService: UserActivityService;
    let userActivityRepositoryMock: jest.Mocked<UserActivityRepository>;

    beforeEach(() => {
        userActivityRepositoryMock = new UserActivityRepository() as jest.Mocked<UserActivityRepository>;
        userActivityService = new UserActivityService();
        (userActivityService as any).userActivityRepository = userActivityRepositoryMock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('logActivity', () => {
        it('should log the user activity', async () => {
            const userId = 1;
            const activityType = 'LOGIN';

            await userActivityService.logActivity(userId, activityType);

            expect(userActivityRepositoryMock.logActivity).toHaveBeenCalledWith({
                user_id: userId,
                activity_type: activityType,
            });
            expect(userActivityRepositoryMock.logActivity).toHaveBeenCalledTimes(1);
        });
    });

    describe('getUserActivities', () => {
        it('should return user activities for a given user ID', async () => {
            const userId = 1;
            const userActivities: UserActivity[] = [
                { id: 1, user_id: userId, activity_type: 'LOGIN', activity_timestamp: new Date() },
                { id: 2, user_id: userId, activity_type: 'LOGOUT', activity_timestamp: new Date() },
            ];

            userActivityRepositoryMock.getActivitiesByUserId.mockResolvedValue(userActivities);

            const result = await userActivityService.getUserActivities(userId);

            expect(result).toEqual(userActivities);
            expect(userActivityRepositoryMock.getActivitiesByUserId).toHaveBeenCalledWith(userId);
            expect(userActivityRepositoryMock.getActivitiesByUserId).toHaveBeenCalledTimes(1);
        });
    });

    describe('getAllActivities', () => {
        it('should return all user activities', async () => {
            const allActivities: UserActivity[] = [
                { id: 1, user_id: 1, activity_type: 'LOGIN', activity_timestamp: new Date() },
                { id: 2, user_id: 2, activity_type: 'LOGOUT', activity_timestamp: new Date() },
            ];

            userActivityRepositoryMock.getAllActivities.mockResolvedValue(allActivities);

            const result = await userActivityService.getAllActivities();

            expect(result).toEqual(allActivities);
            expect(userActivityRepositoryMock.getAllActivities).toHaveBeenCalledTimes(1);
        });
    });
});
