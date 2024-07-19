export interface MenuItem {
  menu_item_id: number;
  name: string;
  availability: boolean;
  price: number;
  meal_type_id: number;
  dietary_type: string;
  spice_level: string;
  cuisine_type: string;
  is_sweet: boolean;
}
