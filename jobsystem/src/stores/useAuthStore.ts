import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { BaseUser } from "../types/types";
import { loginAdminService, loginService, logoutService, sigupRecruiterService } from "@/services/auth.service";
import { getUserProfileService } from "@/services/user.service";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export interface LoginParams {
    role: string;
    step: "request" | "verify";
    type: 0 | 1; // 0 = Google login, 1 = Email/OTP login
    data?: {
        email: string;
        otp?: string;
    };
}

export interface SignupRecruiterParams {
    email: string;
    position?: string;
    companyName: string;
    companyWebsite?: string;
}

type AuthState = {
    token: string | null;
    user: BaseUser | null;
    error: string | null;
    isBlurScreenLoading: boolean;
    isAuthChecking: boolean;
    isAuthenticated: boolean;
    isLoading: boolean;

    setToken: (token: string | null) => void;
    setUser: (user: BaseUser | null) => void;
    setError: (error: string | null) => void;
    login: (params: LoginParams) => Promise<void>;
    googleLogin: (role: string) => Promise<void>;
    handleGoogleRedirect: () => Promise<void>;
    loginAdmin: (email: string, password: string) => Promise<void>;
    signupRecruiter: (params: SignupRecruiterParams) => Promise<void>;
    logout: () => Promise<void>;
    fetchProfile: () => Promise<BaseUser>; // Return type set to BaseUser
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
            isAuthenticated: false,
            isLoading: false,

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

                    if (step === "verify") {
                        const { accessToken } = response;

                        if (accessToken) {
                            set({ token: accessToken, error: null });

                            // Fetch user profile after getting token
                            await get().fetchProfile();
                        } else {
                            throw new Error("No access token received on verify step.");
                        }
                    }
                } catch (error) {
                    console.error("Login failed:", error);
                    set({ error: error?.response?.data?.message || "Login failed" });
                } finally {
                    set({ isBlurScreenLoading: false });
                }
            },

            googleLogin: async (role: string) => {
                try {
                    set({ isBlurScreenLoading: true });

                    const response = await loginService({
                        role,
                        step: "request",
                        type: 0,
                    });

                    const authUrl = response?.data?.data?.authUrl;

                    if (authUrl) {
                        window.location.href = authUrl;
                        return;
                    } else {
                        throw new Error("No authUrl returned");
                    }
                } catch (error) {
                    console.error("Google login failed:", error);
                    set({ error: "Google login failed" });
                } finally {
                    set({ isBlurScreenLoading: false });
                }
            },

            handleGoogleRedirect: async () => {
                try {
                    set({ isAuthChecking: true });

                    const urlParams = new URLSearchParams(window.location.search);
                    const isOAuth = urlParams.get("login_oauth2") === "true";
                    const token = urlParams.get("token");

                    if (isOAuth && token) {
                        set({ token: token, error: null });
                        await get().fetchProfile();
                    } else {
                        toast.error("Authentication failed - no token received");
                    }
                } catch (error) {
                    console.error("Failed to handle Google redirect:", error);
                    set({ error: "Failed to finalize Google login" });
                } finally {
                    set({ isAuthChecking: false });
                }
            },

            loginAdmin: async (name, password) => {
                try {
                    set({ isBlurScreenLoading: true });

                    const response = await loginAdminService(name, password);

                    if (response) {
                        set({ token: response, error: null });
                        await get().fetchProfile();
                    }
                } catch (error) {
                    console.error("Login failed:", error);
                    set({ error: error?.response?.data?.message || "Login failed" });
                } finally {
                    set({ isBlurScreenLoading: false });
                }
            },

            signupRecruiter: async ({ email, position, companyName, companyWebsite }) => {
                try {
                    set({ isLoading: true });
                    const response = await sigupRecruiterService({
                        email,
                        position,
                        companyName,
                        companyWebsite,
                    });

                    toast.success("Signup successful!");
                } catch (error) {
                    console.error("Signup recruiter failed:", error);
                    set({ error: error?.response?.data?.message || "Signup failed" });
                    toast.error(error?.response?.data?.message || "Signup failed");
                } finally {
                    set({ isLoading: false });
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
                        state.isAuthenticated = false;
                    });
                } catch (error) {
                    console.error("Logout error:", error);
                } finally {
                    set({ isBlurScreenLoading: false });
                }
            },

            fetchProfile: async () => {
                try {
                    const response = await getUserProfileService();
                    if (response) {
                        set((state) => {
                            state.user = response; // Set the user object
                        });
                        return response; // Return the user profile
                    } else {
                        console.error("Failed to fetch user profile: No data returned");
                        return null; // Return null if no user data is found
                    }
                } catch (error) {
                    console.error("Fetch user profile failed", error);
                    return null; // Return null if an error occurs
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
