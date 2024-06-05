export interface User {
    id: number;
    name: string;
    role: 'admin' | 'chef' | 'employee';
    password: string;
}