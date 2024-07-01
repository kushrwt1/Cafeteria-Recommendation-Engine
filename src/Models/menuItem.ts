export interface MenuItem {
    menu_item_id: number;
    name: string;
    availability: boolean;
    price: number;
    // meal_type_id: number | null;
    meal_type_id: number;
}