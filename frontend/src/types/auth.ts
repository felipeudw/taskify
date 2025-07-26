export interface AuthResponse {
    access_token: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface User {
    userId: string;
    email: string;
}