export interface UserActivity {
  id?: number;
  user_id: number;
  activity_type: string;
  activity_timestamp?: Date;
}