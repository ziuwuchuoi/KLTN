import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { loginAdminService, loginService, logoutService, sigupRecruiterService } from "@/services/auth.service";
import { getUserProfileService, getAdminProfileService } from "@/services/user.service";
import { toast } from "sonner";
import type { AdminUser, RecruiterUser, CandidateUser } from "@/types/types";

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
    user: RecruiterUser | CandidateUser | null;
    admin: AdminUser | null;
    role: string | null;
    tokenExpiry: number | null;

    error: string | null;
    isBlurScreenLoading: boolean;
    isAuthChecking: boolean;
    isAuthenticated: boolean;
    isLoading: boolean;

    setToken: (token: string | null) => void;
    setsetTokenExpiry: (expiry: number | null) => void;
    setUser: (user: RecruiterUser | CandidateUser | null) => void;
    setAdmin: (admin: AdminUser | null) => void;
    setRole: (role: string | null) => void;

    setError: (error: string | null) => void;
    login: (params: LoginParams) => Promise<void>;
    googleLogin: (role: string) => Promise<void>;
    handleGoogleRedirect: (isOAuth: boolean, token: string) => Promise<void>;
    loginAdmin: (email: string, password: string) => Promise<void>;
    signupRecruiter: (params: SignupRecruiterParams) => Promise<void>;
    logout: () => Promise<void>;
    fetchUserProfile: () => Promise<RecruiterUser | CandidateUser>;
    fetchAdminProfile: () => Promise<AdminUser>;
    updateUser: (user: Partial<RecruiterUser | CandidateUser>) => void;
    setIsBlurScreenLoading: (isLoading: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        immer<AuthState>((set, get) => ({
            token: null,
            user: null,
            admin: null,
            role: null,
            tokenExpiry: null,

            error: null,
            isBlurScreenLoading: false,
            isAuthChecking: false,
            isAuthenticated: false,
            isLoading: false,

            setToken: (token) => {
                const TWO_HOURS = 2 * 60 * 60 * 1000;
                const expiryTime = token ? Date.now() + TWO_HOURS : null;

                set((state) => {
                    state.token = token;
                    state.isAuthenticated = !!token;
                    state.tokenExpiry = expiryTime;
                });
            },

            setsetTokenExpiry: (expiry) => {
                set((state) => {
                    state.tokenExpiry = expiry;
                });
            },

            setUser: (user) => {
                set((state) => {
                    state.user = user;
                });
            },

            setAdmin: (admin) => {
                set((state) => {
                    state.admin = admin;
                });
            },

            setRole: (role) => {
                set((state) => {
                    state.role = role;
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
                            get().setToken(accessToken);
                            set({ error: null, isAuthenticated: true });
                            get().setRole(role);
                            await get().fetchUserProfile();
                        } else {
                            throw new Error("No access token received on verify step.");
                        }
                    }
                } catch (error) {
                    set({ error: error?.response?.data?.message || "Login failed" });
                    throw error;
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
                        localStorage.setItem("oauth_role", role);

                        window.location.href = authUrl;
                        return;
                    } else {
                        throw new Error("No authUrl returned");
                    }
                } catch (error) {
                    set({ error: "Google login failed" });
                    throw error;
                } finally {
                    set({ isBlurScreenLoading: false });
                }
            },

            handleGoogleRedirect: async (isOAuth: boolean, token: string) => {
                try {
                    if (isOAuth && token) {
                        get().setToken(token);
                        set({ error: null, isAuthenticated: true });

                        const storedRole = localStorage.getItem("oauth_role");

                        if (storedRole) {
                            get().setRole(storedRole);
                            localStorage.removeItem("oauth_role");
                        }

                        await get().fetchUserProfile();
                    } else {
                        toast.error("Authentication failed - no token received");
                        throw new Error("Authentication failed - no token received");
                    }
                } catch (error) {
                    set({ error: "Failed to finalize Google login" });
                    throw error;
                }
            },

            loginAdmin: async (name, password) => {
                try {
                    set({ isBlurScreenLoading: true });

                    const response = await loginAdminService(name, password);

                    console.log("Admin login response:", response);

                    if (response) {
                        get().setToken(response);
                        set({ error: null, isAuthenticated: true });
                        get().setRole("admin");
                        await get().fetchAdminProfile();
                    }
                } catch (error) {
                    set({ error: error?.response?.data?.message || "Login failed" });
                    throw error;
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
                    set({ error: error?.response?.data?.message || "Signup failed" });
                    toast.error(error?.response?.data?.message || "Signup failed");
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },

            logout: async () => {
                try {
                    set({ isBlurScreenLoading: true });

                    await logoutService();

                    // Clear auth redirect URL on logout
                    localStorage.removeItem("auth_redirect_url");
                    localStorage.removeItem("oauth_role");

                    set((state) => {
                        state.token = null;
                        state.tokenExpiry = null;
                        state.user = null;
                        state.admin = null;
                        state.error = null;
                        state.role = null;
                        state.isAuthenticated = false;
                    });
                } catch (error) {
                    console.error("❌ Logout error:", error);
                } finally {
                    set({ isBlurScreenLoading: false });
                }
            },

            fetchUserProfile: async () => {
                try {
                    const response = await getUserProfileService();

                    if (response) {
                        set((state) => {
                            state.user = response;
                        });
                        return response;
                    } else {
                        return null;
                    }
                } catch (error) {
                    return null;
                }
            },

            fetchAdminProfile: async () => {
                try {
                    const response = await getAdminProfileService();
                    if (response) {
                        const responseWithRole = { ...response, role: "admin" };

                        set((state) => {
                            state.admin = responseWithRole;
                        });

                        return responseWithRole;
                    } else {
                        return null;
                    }
                } catch (error) {
                    return null;
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
            name: "auth_storage",
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                admin: state.admin,
                role: state.role,
                isAuthenticated: state.isAuthenticated,
                tokenExpiry: state.tokenExpiry,
            }),
        }
    )
);
