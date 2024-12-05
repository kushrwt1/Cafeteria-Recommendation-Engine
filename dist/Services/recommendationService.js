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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationService = void 0;
const sentiment_1 = __importDefault(require("sentiment"));
const feedbackRepository_1 = require("../Utils/Database Repositories/feedbackRepository");
const menuItemRepository_1 = require("../Utils/Database Repositories/menuItemRepository");
class RecommendationService {
    constructor() {
        this.feedbackRepositoryObject = new feedbackRepository_1.FeedbackRepository();
        this.menuItemRepositoryObject = new menuItemRepository_1.MenuItemRepository();
        this.sentiment = new sentiment_1.default();
    }
    getRecommendedItems() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch all feedback
                const feedbackData = yield this.feedbackRepositoryObject.getAllFeedback();
                // Calculate average rating and sentiment for each menu item
                const ratingsMap = {};
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
                const recommendedItemsByMealType = {
                    1: { mealType: 'Breakfast', items: [] },
                    2: { mealType: 'Lunch', items: [] },
                    3: { mealType: 'Dinner', items: [] }
                };
                for (const item of compositeScores) {
                    const menuItem = yield this.menuItemRepositoryObject.getMenuItemById(item.menu_item_id);
                    if (menuItem && menuItem.meal_type_id in recommendedItemsByMealType) {
                        recommendedItemsByMealType[menuItem.meal_type_id].items.push(Object.assign(Object.assign({}, menuItem), { compositeScore: item.compositeScore }));
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
            }
            catch (error) {
                console.error('Error fetching recommended items:', error);
                throw error;
            }
        });
    }
    getDiscardedMenuItems() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch all feedback
                const feedbackData = yield this.feedbackRepositoryObject.getAllFeedback();
                // Calculate average rating for each menu item
                const ratingsMap = {};
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
                    const menuItem = yield this.menuItemRepositoryObject.getMenuItemById(item.menu_item_id);
                    if (menuItem) {
                        discardedMenuItems.push(Object.assign(Object.assign({}, menuItem), { averageRating: item.averageRating }));
                    }
                }
                return discardedMenuItems;
            }
            catch (error) {
                console.error('Error fetching discarded items:', error);
                throw error;
            }
        });
    }
}
exports.RecommendationService = RecommendationService;
