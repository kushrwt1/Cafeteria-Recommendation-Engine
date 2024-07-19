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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeController = void 0;
const feedbackRepository_1 = require("../Utils/Database Repositories/feedbackRepository");
const notificationService_1 = require("../Services/notificationService");
const chefDailyMenuRepository_1 = require("../Utils/Database Repositories/chefDailyMenuRepository");
const employeeMenuSelectionRepository_1 = require("../Utils/Database Repositories/employeeMenuSelectionRepository");
const menuItemRepository_1 = require("../Utils/Database Repositories/menuItemRepository");
const discardedFoodItemFeedbackRepository_1 = require("../Utils/Database Repositories/discardedFoodItemFeedbackRepository");
const employeeProfileService_1 = require("../Services/employeeProfileService");
const employeeProfileRepository_1 = require("../Utils/Database Repositories/employeeProfileRepository");
const serverProtocol_1 = require("../Server/serverProtocol");
class EmployeeController {
    constructor() {
        this.feedbackRepositoryObject = new feedbackRepository_1.FeedbackRepository();
        this.chefdailyMenuRepositoryObject = new chefDailyMenuRepository_1.ChefDailyMenuRepository();
        this.notificationServiceObject = new notificationService_1.NotificationService();
        this.employeeProfileServiceObject = new employeeProfileService_1.EmployeeProfileService();
        this.employeeMenuSelectionrepositoryObject = new employeeMenuSelectionRepository_1.EmployeeMenuSelectionRepository();
        this.menuItemRepositoryObject = new menuItemRepository_1.MenuItemRepository();
        this.discardedFoodItemFeedbackRepositoryObject = new discardedFoodItemFeedbackRepository_1.DiscardedFoodItemFeedbackRepository();
        this.employeeProfileRepositoryObject = new employeeProfileRepository_1.EmployeeProfileRepository();
    }
    giveFeedback(userId, menuItemId, rating, comment, date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const feedback = {
                    id: 0,
                    user_id: userId,
                    menu_item_id: menuItemId,
                    rating: rating,
                    comment: comment,
                    date: date,
                };
                yield this.feedbackRepositoryObject.addFeedback(feedback);
                console.log("Feedback added successfully.");
            }
            catch (error) {
                console.error(`Error adding feedback: ${error}`);
            }
        });
    }
    getNotifications(socket, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notifications = yield this.notificationServiceObject.getNotificationsByUserId(userId);
            const notificationsInStringFormat = JSON.stringify(notifications);
            serverProtocol_1.ServerProtocol.sendResponse(socket, "Response_viewNotifications", {}, { notificationsInStringFormat, userId }, "json");
        });
    }
    getRolledOutMenu(socket, notificationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rolledOutMenu = yield this.chefdailyMenuRepositoryObject.getTodaysRolledOutMenu();
                const employeeProfile = yield this.employeeProfileRepositoryObject.getEmployeeProfileByUserId(userId);
                let isEmployeeProfileExists = "No";
                if (employeeProfile) {
                    isEmployeeProfileExists = "Yes";
                    const detailedMenuItems = [];
                    if (rolledOutMenu != null) {
                        for (const menu of rolledOutMenu) {
                            const menuItem = yield this.menuItemRepositoryObject.getMenuItemById(menu.menu_item_id);
                            if (menuItem) {
                                detailedMenuItems.push(menuItem);
                            }
                        }
                        // Sort detailed menu items based on employee profile
                        detailedMenuItems.sort((a, b) => {
                            let scoreA = 0;
                            let scoreB = 0;
                            // Compare dietary type
                            if (a.dietary_type === employeeProfile.dietary_preference)
                                scoreA += 1;
                            if (b.dietary_type === employeeProfile.dietary_preference)
                                scoreB += 1;
                            // Compare spice level
                            if (a.spice_level === employeeProfile.spice_level)
                                scoreA += 1;
                            if (b.spice_level === employeeProfile.spice_level)
                                scoreB += 1;
                            // Compare cuisine type
                            if (a.cuisine_type === employeeProfile.cuisine_preference)
                                scoreA += 1;
                            if (b.cuisine_type === employeeProfile.cuisine_preference)
                                scoreB += 1;
                            // Compare sweet preference
                            if (a.is_sweet === employeeProfile.sweet_tooth)
                                scoreA += 1;
                            if (b.is_sweet === employeeProfile.sweet_tooth)
                                scoreB += 1;
                            // Sort by descending score
                            const scoreComparison = scoreB - scoreA;
                            if (scoreComparison !== 0) {
                                return scoreComparison;
                            }
                            // Tie-breaking based on preferred attributes
                            const preferredAttributesA = (a.dietary_type === "Vegetarian" ? 1 : 0) +
                                (a.spice_level === "Medium" ? 1 : 0) +
                                (a.cuisine_type === "North Indian" ? 1 : 0) +
                                (a.is_sweet ? 1 : 0);
                            const preferredAttributesB = (b.dietary_type === "Vegetarian" ? 1 : 0) +
                                (b.spice_level === "Medium" ? 1 : 0) +
                                (b.cuisine_type === "North Indian" ? 1 : 0) +
                                (b.is_sweet ? 1 : 0);
                            if (preferredAttributesA !== preferredAttributesB) {
                                return preferredAttributesB - preferredAttributesA;
                            }
                            // Tie-breaking by price (ascending)
                            return a.price - b.price;
                        });
                    }
                    const detailedMenuItemsInStringFormat = JSON.stringify(detailedMenuItems);
                    serverProtocol_1.ServerProtocol.sendResponse(socket, "Response_rolledOutMenu", {}, {
                        detailedMenuItemsInStringFormat,
                        userId,
                        notificationId,
                        isEmployeeProfileExists,
                    }, "json");
                    console.log("Rolled Out Menu According To User preference is sent to Client Successfully");
                }
                else {
                    const rolledOutMenuInStringFormat = JSON.stringify(rolledOutMenu);
                    serverProtocol_1.ServerProtocol.sendResponse(socket, "Response_rolledOutMenu", {}, {
                        rolledOutMenuInStringFormat,
                        userId,
                        notificationId,
                        isEmployeeProfileExists,
                    }, "json");
                    console.log("Rolled Out Menu Without User preference is sent to Client Successfully");
                }
            }
            catch (error) {
                console.error(`Error fetching rolled out menu: ${error}`);
            }
        });
    }
    markNotificationAsSeen(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.notificationServiceObject.markNotificationAsSeen(notificationId);
        });
    }
    updateVotedItem(breakfastItemId, lunchItemId, dinnerItemId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const today = new Date().toISOString().split("T")[0];
            const userMenuSelectionForBreakfast = {
                id: 0,
                user_id: userId,
                menu_item_id: breakfastItemId,
                selection_date: today,
            };
            const userMenuSelectionForLunch = {
                id: 0,
                user_id: userId,
                menu_item_id: lunchItemId,
                selection_date: today,
            };
            const userMenuSelectionForDinner = {
                id: 0,
                user_id: userId,
                menu_item_id: dinnerItemId,
                selection_date: today,
            };
            yield this.employeeMenuSelectionrepositoryObject.addEmployeeMenuSelection(userMenuSelectionForBreakfast);
            yield this.employeeMenuSelectionrepositoryObject.addEmployeeMenuSelection(userMenuSelectionForLunch);
            yield this.employeeMenuSelectionrepositoryObject.addEmployeeMenuSelection(userMenuSelectionForDinner);
        });
    }
    deleteNotification(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.notificationServiceObject.deleteNotification(notificationId);
        });
    }
    viewAllMenuItems(socket, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const menuItems = yield this.menuItemRepositoryObject.getAllMenuItems();
                // console.log("Menu Items:", menuItems);
                // socket.write(`Response_employee_viewAllMenuItems;${JSON.stringify(menuItems)};${userId}`);
                const menuItemsInStringFormat = JSON.stringify(menuItems);
                serverProtocol_1.ServerProtocol.sendResponse(socket, "Response_employee_viewAllMenuItems", {}, { menuItemsInStringFormat, userId }, "json");
            }
            catch (error) {
                console.error(`Error fetching all menu item: ${error}`);
            }
        });
    }
    selectMenuItems() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    sendSelectedMenuItems() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    addDiscarededMenuItemFeedbackInDatabase(dislikes, desiredTaste, momRecipe, discardedMenuItemId) {
        return __awaiter(this, void 0, void 0, function* () {
            const today = new Date().toISOString().split("T")[0];
            const discardedFoodItemFeedback = {
                id: 0,
                menu_item_id: discardedMenuItemId,
                dislikes: dislikes,
                desired_taste: desiredTaste,
                mom_recipe: momRecipe,
                feedback_date: today,
            };
            yield this.discardedFoodItemFeedbackRepositoryObject.addFeedback(discardedFoodItemFeedback);
        });
    }
    updateEmployeeProfile(userId, dietaryPreference, spiceLevel, cuisinePreference, sweetTooth) {
        return __awaiter(this, void 0, void 0, function* () {
            const today = new Date().toISOString().split("T")[0];
            const profile = {
                id: 0,
                user_id: userId,
                dietary_preference: dietaryPreference,
                spice_level: spiceLevel,
                cuisine_preference: cuisinePreference,
                sweet_tooth: sweetTooth,
                profile_update_date: today,
            };
            try {
                yield this.employeeProfileServiceObject.updateEmployeeProfile(profile);
            }
            catch (error) {
                console.error("Error updating profile:", error);
            }
        });
    }
}
exports.EmployeeController = EmployeeController;
