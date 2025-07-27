import {create} from 'zustand';
import {api} from '../api/api';
import type {AuthResponse, LoginData, User} from '../types/auth';

interface AuthState {
    user: User | null;
    token: string | null;
    boardId: string | null;
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
    boardId: localStorage.getItem("board_id"),
    loading: false,
    error: null,

    login: async (data) => {
        set({loading: true, error: null});
        try {
            const res = await api.post<AuthResponse>('/auth/login', data);
            localStorage.setItem('access_token', res.data.access_token);
            set({token: res.data.access_token});
            await useAuthStore.getState().fetchUser();

            // Fetch boards and store default boardId
            const boardsRes = await api.get("/boards");
            const defaultBoard = boardsRes.data[0];
            if (defaultBoard) {
                localStorage.setItem("board_id", defaultBoard.id);
                set({ boardId: defaultBoard.id });
            }
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

            // Fetch boards and store default boardId
            const boardsRes = await api.get("/boards");
            const defaultBoard = boardsRes.data[0];
            if (defaultBoard) {
                localStorage.setItem("board_id", defaultBoard.id);
                set({ boardId: defaultBoard.id });
            }
        } catch (error: any) {
            set({error: error.response?.data?.message || 'Registration failed'});
        } finally {
            set({loading: false});
        }
    },

    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem("board_id");
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