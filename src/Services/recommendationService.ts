import Sentiment from 'sentiment';
import { FeedbackRepository } from '../Utils/Database Repositories/feedbackRepository';
import { MenuItemRepository } from '../Utils/Database Repositories/menuItemRepository';

export class RecommendationService {
    private feedbackRepositoryObject = new FeedbackRepository();
    private menuItemRepositoryObject = new MenuItemRepository();
    private sentiment: Sentiment;

    constructor() {
        this.sentiment = new Sentiment();
    }

    public async getRecommendedItems() {
        try {
            // Fetch all feedback
            const feedbackData = await this.feedbackRepositoryObject.getAllFeedback();

            // Calculate average rating and sentiment for each menu item
            const ratingsMap: { [key: number]: { totalRating: number, totalSentiment: number, count: number } } = {};

            feedbackData.forEach(feedback => {
                if (!ratingsMap[feedback.menu_item_id]) {
                    ratingsMap[feedback.menu_item_id] = { totalRating: 0, totalSentiment: 0, count: 0 };
                }
                ratingsMap[feedback.menu_item_id].totalRating += feedback.rating;
                const sentimentResult = this.sentiment.analyze(feedback.comment);
                ratingsMap[feedback.menu_item_id].totalSentiment += sentimentResult.score;
                ratingsMap[feedback.menu_item_id].count += 1;
            });

            // Calculate average ratings and sentiments
            const averageScores = Object.keys(ratingsMap).map(menuItemId => ({
                menu_item_id: parseInt(menuItemId),
                averageRating: ratingsMap[parseInt(menuItemId)].totalRating / ratingsMap[parseInt(menuItemId)].count,
                averageSentiment: ratingsMap[parseInt(menuItemId)].totalSentiment / ratingsMap[parseInt(menuItemId)].count
            }));

            // Calculate a composite score (simple average of averageRating and averageSentiment)
            const compositeScores = averageScores.map(item => ({
                menu_item_id: item.menu_item_id,
                compositeScore: (item.averageRating + item.averageSentiment) / 2
            }));

            // Sort by composite score
            compositeScores.sort((a, b) => b.compositeScore - a.compositeScore);

            // Fetch menu item details for top-rated items and categorize them by meal type
            const recommendedItemsByMealType: { [key: number]: MealTypeItems } = {
                1: { mealType: 'Breakfast', items: [] },
                2: { mealType: 'Lunch', items: [] },
                3: { mealType: 'Dinner', items: [] }
            };

            for (const item of compositeScores) {
                const menuItem = await this.menuItemRepositoryObject.getMenuItemById(item.menu_item_id);
                if (menuItem && menuItem.meal_type_id in recommendedItemsByMealType) {
                    recommendedItemsByMealType[menuItem.meal_type_id].items.push({ ...menuItem, compositeScore: item.compositeScore });
                }
            }

            // Get top 5 items for each meal type
            const recommendedItems = [];
            for (const mealType in recommendedItemsByMealType) {
                const meal = recommendedItemsByMealType[mealType];
                meal.items.sort((a, b) => b.compositeScore - a.compositeScore);
                recommendedItems.push(...meal.items.slice(0, 5));
            }
            // console.log(recommendedItems);
            return recommendedItems;
        } catch (error) {
            console.error('Error fetching recommended items:', error);
            throw error;
        }
    }

    public async getDiscardedMenuItems() {
        try {
            // Fetch all feedback
            const feedbackData = await this.feedbackRepositoryObject.getAllFeedback();
    
            // Calculate average rating for each menu item
            const ratingsMap: { [key: number]: { totalRating: number, count: number } } = {};
    
            feedbackData.forEach(feedback => {
                if (!ratingsMap[feedback.menu_item_id]) {
                    ratingsMap[feedback.menu_item_id] = { totalRating: 0, count: 0 };
                }
                ratingsMap[feedback.menu_item_id].totalRating += feedback.rating;
                ratingsMap[feedback.menu_item_id].count += 1;
            });
    
            // Calculate average ratings
            const averageScores = Object.keys(ratingsMap).map(menuItemId => ({
                menu_item_id: parseInt(menuItemId),
                averageRating: ratingsMap[parseInt(menuItemId)].totalRating / ratingsMap[parseInt(menuItemId)].count
            }));
    
            // Filter items with average rating less than 2
            const discardedItems = averageScores.filter(item => item.averageRating < 2);
    
            // Fetch menu item details for discarded items
            const discardedMenuItems = [];
            for (const item of discardedItems) {
                const menuItem = await this.menuItemRepositoryObject.getMenuItemById(item.menu_item_id);
                if (menuItem) {
                    discardedMenuItems.push({ ...menuItem, averageRating: item.averageRating });
                }
            }
    
            return discardedMenuItems;
        } catch (error) {
            console.error('Error fetching discarded items:', error);
            throw error;
        }
    }
    
}
