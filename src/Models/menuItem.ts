export interface MenuItem {
    menu_item_id: number;
    name: string;
    availability: boolean;
    price: number;
    // meal_type_id: number | null;
    meal_type_id: number;
    dietary_type: string; // Vegetarian, Non Vegetarian, Eggetarian
    spice_level: string; // High, Medium, Low
    cuisine_type: string; // North Indian, South Indian, Other
    is_sweet: boolean; // Yes or No
}