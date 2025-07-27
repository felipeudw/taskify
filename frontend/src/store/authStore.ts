import {toast} from "sonner";
import {create} from "zustand";
import {persist} from "zustand/middleware";
import {api} from "../api/api";
import type {AuthResponse, LoginData, User} from "../types/auth";

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

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            boardId: null,
            loading: false,
            error: null,

            login: async (data) => {
                set({loading: true, error: null});
                try {
                    const res = await api.post<AuthResponse>("/auth/login", data);
                    const token = res.data.access_token;
                    set({token});

                    await get().fetchUser();

                    const boardsRes = await api.get("/boards");
                    const defaultBoard = boardsRes.data[0];
                    if (defaultBoard) set({boardId: defaultBoard.id});
                } catch (error: any) {
                    set({error: error.response?.data?.message || "Login failed"});
                } finally {
                    set({loading: false});
                }
            },

            register: async (data) => {
                set({loading: true, error: null});
                try {
                    const res = await api.post<AuthResponse>("/auth/register", data);
                    const token = res.data.access_token;
                    set({token});

                    await get().fetchUser();

                    const boardsRes = await api.get("/boards");
                    const defaultBoard = boardsRes.data[0];
                    if (defaultBoard) set({boardId: defaultBoard.id});

                    toast.success("Account created successfully! Welcome 🎉");
                } catch (error: any) {
                    set({error: error.response?.data?.message || "Registration failed"});
                    toast.error("Registration failed. Please try again.");
                } finally {
                    set({loading: false});
                }
            },

            logout: () => {
                set({user: null, token: null, boardId: null});
            },

            fetchUser: async () => {
                try {
                    const res = await api.get<User>("/users/me");
                    set({user: res.data});
                } catch {
                    set({user: null});
                }
            },
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                boardId: state.boardId,
            }),
        }
    )
);
