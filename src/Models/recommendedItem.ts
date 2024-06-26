interface RecommendedItem {
    menu_item_id: number;
    name: string;
    meal_type_id: number;
    compositeScore: number;
}

interface MealTypeItems {
    mealType: string;
    items: RecommendedItem[];
}