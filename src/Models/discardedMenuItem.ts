export interface DiscardedMenuItem {
    id: number;
    menu_item_id: number;
    discarded_date: string; // Using string to represent date in ISO format
    name: string;
}
