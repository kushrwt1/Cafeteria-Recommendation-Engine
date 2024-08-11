import { RecommendationService } from '../Services/recommendationService';
import { FeedbackRepository } from '../Utils/Database Repositories/feedbackRepository';
import { MenuItemRepository } from '../Utils/Database Repositories/menuItemRepository';
import { Feedback } from '../Models/feedback';
import { MenuItem } from '../Models/menuItem';

jest.mock('../Utils/Database Repositories/feedbackRepository');
jest.mock('../Utils/Database Repositories/menuItemRepository');
jest.mock('sentiment');

describe('RecommendationService', () => {
    let recommendationService: RecommendationService;
    let feedbackRepositoryMock: jest.Mocked<FeedbackRepository>;
    let menuItemRepositoryMock: jest.Mocked<MenuItemRepository>;

    beforeEach(() => {
        feedbackRepositoryMock = new FeedbackRepository() as jest.Mocked<FeedbackRepository>;
        menuItemRepositoryMock = new MenuItemRepository() as jest.Mocked<MenuItemRepository>;
        recommendationService = new RecommendationService();
        
        (recommendationService as any).feedbackRepositoryObject = feedbackRepositoryMock;
        (recommendationService as any).menuItemRepositoryObject = menuItemRepositoryMock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getRecommendedItems', () => {
        it('should return recommended items sorted by composite score', async () => {
            const feedbackData: Feedback[] = [
                { id: 1, comment: 'Great!', rating: 5, menu_item_id: 1, user_id: 1, date: '2024-08-01' },
                { id: 2, comment: 'Good', rating: 4, menu_item_id: 2, user_id: 2, date: '2024-08-01' },
                { id: 3, comment: 'Average', rating: 3, menu_item_id: 1, user_id: 3, date: '2024-08-01' },
            ];

            const menuItem1: MenuItem = {
                menu_item_id: 1,
                name: 'Pancakes',
                availability: true,
                price: 10,
                meal_type_id: 1,
                dietary_type: 'Vegetarian',
                spice_level: 'Mild',
                cuisine_type: 'American',
                is_sweet: true,
            };

            const menuItem2: MenuItem = {
                menu_item_id: 2,
                name: 'Salad',
                availability: true,
                price: 8,
                meal_type_id: 2,
                dietary_type: 'Vegan',
                spice_level: 'None',
                cuisine_type: 'Mediterranean',
                is_sweet: false,
            };

            feedbackRepositoryMock.getAllFeedback.mockResolvedValue(feedbackData);
            menuItemRepositoryMock.getMenuItemById.mockResolvedValueOnce(menuItem1).mockResolvedValueOnce(menuItem2);

            const sentimentMock = jest.spyOn(require('sentiment').prototype, 'analyze').mockImplementation(comment => {
                switch (comment) {
                    case 'Great!': return { score: 2 };
                    case 'Good': return { score: 1 };
                    case 'Average': return { score: 0 };
                    default: return { score: 0 };
                }
            });

            const result = await recommendationService.getRecommendedItems();

            expect(result).toEqual([
                { ...menuItem1, compositeScore: 3.5 },
                { ...menuItem2, compositeScore: 2.5 },
            ]);

            expect(feedbackRepositoryMock.getAllFeedback).toHaveBeenCalledTimes(1);
            expect(menuItemRepositoryMock.getMenuItemById).toHaveBeenCalledWith(1);
            expect(menuItemRepositoryMock.getMenuItemById).toHaveBeenCalledWith(2);
            expect(sentimentMock).toHaveBeenCalledTimes(3);
        });
    });

    describe('getDiscardedMenuItems', () => {
        it('should return menu items with an average rating of less than 2', async () => {
            const feedbackData: Feedback[] = [
                { id: 1, comment: 'Bad', rating: 1, menu_item_id: 1, user_id: 1, date: '2024-08-01' },
                { id: 2, comment: 'Terrible', rating: 1, menu_item_id: 2, user_id: 2, date: '2024-08-01' },
                { id: 3, comment: 'Not good', rating: 2, menu_item_id: 1, user_id: 3, date: '2024-08-01' },
            ];

            const menuItem1: MenuItem = {
                menu_item_id: 1,
                name: 'Burger',
                availability: true,
                price: 12,
                meal_type_id: 2,
                dietary_type: 'Non-Vegetarian',
                spice_level: 'Medium',
                cuisine_type: 'American',
                is_sweet: false,
            };

            const menuItem2: MenuItem = {
                menu_item_id: 2,
                name: 'Soup',
                availability: true,
                price: 5,
                meal_type_id: 1,
                dietary_type: 'Vegetarian',
                spice_level: 'Mild',
                cuisine_type: 'Italian',
                is_sweet: false,
            };

            feedbackRepositoryMock.getAllFeedback.mockResolvedValue(feedbackData);
            menuItemRepositoryMock.getMenuItemById.mockResolvedValueOnce(menuItem1).mockResolvedValueOnce(menuItem2);

            const result = await recommendationService.getDiscardedMenuItems();

            expect(result).toEqual([
                { ...menuItem1, averageRating: 1.5 },
                { ...menuItem2, averageRating: 1 },
            ]);

            expect(feedbackRepositoryMock.getAllFeedback).toHaveBeenCalledTimes(1);
            expect(menuItemRepositoryMock.getMenuItemById).toHaveBeenCalledWith(1);
            expect(menuItemRepositoryMock.getMenuItemById).toHaveBeenCalledWith(2);
        });
    });
});
