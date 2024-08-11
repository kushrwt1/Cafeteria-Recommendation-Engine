import { NotificationRepository } from '../Utils/Database Repositories/notificationRepository';
import { NotificationService } from '../Services/notificationService';

jest.mock('../Utils/Database Repositories/notificationRepository');

const NotificationRepositoryMock = NotificationRepository as jest.MockedClass<typeof NotificationRepository>;

describe('NotificationService', () => {
    let notificationService: NotificationService;
    let notificationRepositoryMock: jest.Mocked<NotificationRepository>;

    beforeEach(() => {
        // Initialize the NotificationService with the mocked repository
        notificationRepositoryMock = new NotificationRepository() as jest.Mocked<NotificationRepository>;

        // Override the methods of the mocked repository
        notificationRepositoryMock.addNotificationForAllUsers = jest.fn();
        notificationRepositoryMock.getNotificationsByUserId = jest.fn();
        notificationRepositoryMock.updateNotificationSeenStatus = jest.fn();
        notificationRepositoryMock.deleteNotification = jest.fn();

        notificationService = new NotificationService();
        (notificationService as any).notificationRepositoryObject = notificationRepositoryMock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should add a notification for all users', async () => {
        const message = "New announcement!";
        const date = new Date().toISOString();

        await notificationService.addNotificationForAllUsers(message, date);

        expect(notificationRepositoryMock.addNotificationForAllUsers).toHaveBeenCalledWith(message, date);
    });

    it('should get notifications by user ID', async () => {
        const userId = 1;
        const notifications = [
            { id: 1, message: 'Test', user_id: 1, date: '2024-07-19', seen: false },
        ];

        notificationRepositoryMock.getNotificationsByUserId.mockResolvedValue(notifications);

        const result = await notificationService.getNotificationsByUserId(userId);

        expect(notificationRepositoryMock.getNotificationsByUserId).toHaveBeenCalledWith(userId);
        expect(result).toEqual(notifications);
    });

    it('should mark a notification as seen', async () => {
        const notificationId = 1;

        await notificationService.markNotificationAsSeen(notificationId);

        expect(notificationRepositoryMock.updateNotificationSeenStatus).toHaveBeenCalledWith(notificationId);
    });

    it('should delete a notification', async () => {
        const notificationId = 1;

        await notificationService.deleteNotification(notificationId);

        expect(notificationRepositoryMock.deleteNotification).toHaveBeenCalledWith(notificationId);
    });
});
