import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { BaseUser } from "../types/types";
import { loginService, logoutService, getUserService } from "@/services/auth.service";

export interface LoginParams {
    role: string;
    step: "request" | "verify";
    type: 0 | 1; // 0 = Google login, 1 = Email/OTP login
    data?: {
        email: string;
        otp?: string;
    };
}

type AuthState = {
    token: string | null;
    user: BaseUser | null;
    error: string | null;
    isBlurScreenLoading: boolean;
    isAuthChecking: boolean;

    setToken: (token: string | null) => void;
    setUser: (user: BaseUser | null) => void;
    setError: (error: string | null) => void;
    login: (params: LoginParams) => Promise<void>;
    logout: () => Promise<void>;
    fetchProfile: () => Promise<void>;
    updateUser: (user: Partial<BaseUser>) => void;
    setIsBlurScreenLoading: (isLoading: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        immer<AuthState>((set, get) => ({
            token: null,
            user: null,
            error: null,
            isBlurScreenLoading: false,
            isAuthChecking: false,

            setToken: (token) => {
                set((state) => {
                    state.token = token;
                });
            },

            setUser: (user) => {
                set((state) => {
                    state.user = user;
                });
            },

            setError: (error) => {
                set((state) => {
                    state.error = error;
                });
            },

            setIsBlurScreenLoading: (isLoading) => {
                set((state) => {
                    state.isBlurScreenLoading = isLoading;
                });
            },

            login: async ({ role, step, type, data }) => {
                try {
                    set({ isBlurScreenLoading: true });

                    const response = await loginService({ role, step, type, data });
                    const { accessToken } = response;

                    set((state) => {
                        state.token = accessToken;
                        state.error = null;
                    });

                    // Fetch user profile immediately after login
                    await get().fetchProfile();
                } catch (error) {
                    console.error("Login failed:", error);
                    set((state) => {
                        state.error = error?.response?.data?.message || "Failed to login";
                    });
                } finally {
                    set({ isBlurScreenLoading: false });
                }
            },

            logout: async () => {
                try {
                    set({ isBlurScreenLoading: true });

                    await logoutService();
                    set((state) => {
                        state.token = null;
                        state.user = null;
                        state.error = null;
                    });
                } catch (error) {
                    console.error("Logout error:", error);
                } finally {
                    set({ isBlurScreenLoading: false });
                }
            },

            fetchProfile: async () => {
                try {
                    const user = await getUserService();
                    set((state) => {
                        state.user = user;
                    });
                } catch (error) {
                    console.error("Fetch user profile failed:", error);
                }
            },

            updateUser: (userUpdate) => {
                set((state) => {
                    if (state.user) {
                        Object.assign(state.user, userUpdate);
                    }
                });
            },
        })),
        {
            name: "auth_storage", // Key for localStorage
            partialize: (state) => ({
                token: state.token,
                user: state.user,
            }),
        }
    )
);
