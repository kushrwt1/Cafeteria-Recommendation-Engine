export interface User {
    user_id: number;
    name: string;
    role: 'admin' | 'chef' | 'employee';
    password: string;
}