export interface EmployeeProfile {
    id: number;
    user_id: number;
    dietary_preference: string; // Vegetarian, Non Vegetarian, Eggetarian
    spice_level: string; // High, Medium, Low
    cuisine_preference: string; // North Indian, South Indian, Other
    sweet_tooth: boolean; // Yes, No
    profile_update_date: string;
}
