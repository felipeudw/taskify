import {create} from 'zustand';
import {api} from '../api/api';
import type {AuthResponse, LoginData, User} from '../types/auth';

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    login: (data: LoginData) => Promise<void>;
    register: (data: LoginData) => Promise<void>;
    logout: () => void;
    fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: localStorage.getItem('access_token'),
    loading: false,
    error: null,

    login: async (data) => {
        set({loading: true, error: null});
        try {
            const res = await api.post<AuthResponse>('/auth/login', data);
            localStorage.setItem('access_token', res.data.access_token);
            set({token: res.data.access_token});
            await useAuthStore.getState().fetchUser();
        } catch (error: any) {
            set({error: error.response?.data?.message || 'Login failed'});
        } finally {
            set({loading: false});
        }
    },

    register: async (data) => {
        set({loading: true, error: null});
        try {
            const res = await api.post<AuthResponse>('/auth/register', data);
            localStorage.setItem('access_token', res.data.access_token);
            set({token: res.data.access_token});
            await useAuthStore.getState().fetchUser();
        } catch (error: any) {
            set({error: error.response?.data?.message || 'Registration failed'});
        } finally {
            set({loading: false});
        }
    },

    logout: () => {
        localStorage.removeItem('access_token');
        set({user: null, token: null});
    },

    fetchUser: async () => {
        try {
            const res = await api.get<User>('/users/me');
            set({user: res.data});
        } catch {
            set({user: null});
        }
    },
}));