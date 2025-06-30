import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { loginAdminService, loginService, logoutService, sigupRecruiterService } from "@/services/auth.service";
import { getUserProfileService, getAdminProfileService } from "@/services/user.service";
import { toast } from "sonner";
import { AdminUser, RecruiterUser, CandidateUser } from "@/types/types";

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

    error: string | null;
    isBlurScreenLoading: boolean;
    isAuthChecking: boolean;
    isAuthenticated: boolean;
    isLoading: boolean;

    setToken: (token: string | null) => void;
    setUser: (user: RecruiterUser | CandidateUser | null) => void;
    setAdmin: (admin: AdminUser | null) => void;
    setRole: (role: string | null) => void;

    setError: (error: string | null) => void;
    login: (params: LoginParams) => Promise<void>;
    googleLogin: (role: string, redirectUrl?: string) => Promise<void>;
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
                            set({ token: accessToken, error: null });
                            get().setRole(role);
                            // Fetch user profile after getting token
                            await get().fetchUserProfile();
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

            googleLogin: async (role: string, redirectUrl?: string) => {
                try {
                    set({ isBlurScreenLoading: true });

                    console.log("Google login called with:", { role, redirectUrl });

                    const response = await loginService({
                        role,
                        step: "request",
                        type: 0,
                    });

                    const authUrl = response?.data?.data?.authUrl;
                    if (authUrl) {
                        localStorage.setItem("oauth_role", role);

                        // Store redirect URL if provided
                        if (redirectUrl) {
                            console.log("Storing redirect URL in localStorage:", redirectUrl);
                            localStorage.setItem("oauth_redirect", redirectUrl);
                        }

                        console.log("Redirecting to Google OAuth URL:", authUrl);
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

            handleGoogleRedirect: async (isOAuth: boolean, token: string) => {
                try {
                    console.log("Handling Google redirect:", { isOAuth, token });

                    if (isOAuth && token) {
                        set({ token: token, error: null });

                        const storedRole = localStorage.getItem("oauth_role");
                        console.log("Stored OAuth role:", storedRole);

                        if (storedRole) {
                            get().setRole(storedRole);
                            localStorage.removeItem("oauth_role");
                        }

                        await get().fetchUserProfile();
                        console.log("Google redirect handled successfully");
                    } else {
                        toast.error("Authentication failed - no token received");
                    }
                } catch (error) {
                    console.error("Failed to handle Google redirect:", error);
                    set({ error: "Failed to finalize Google login" });
                }
            },

            loginAdmin: async (name, password) => {
                try {
                    set({ isBlurScreenLoading: true });

                    const response = await loginAdminService(name, password);

                    if (response) {
                        set({ token: response, error: null });
                        get().setRole("admin");
                        await get().fetchAdminProfile();
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
                        state.role = null;
                        state.isAuthenticated = false;
                    });
                } catch (error) {
                    console.error("Logout error:", error);
                } finally {
                    set({ isBlurScreenLoading: false });
                }
            },

            fetchUserProfile: async () => {
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
                        console.error("Failed to fetch user profile: No data returned");
                        return null;
                    }
                } catch (error) {
                    console.error("Fetch admin profile failed", error);
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
                admin: state.admin,
                role: state.role,
            }),
        }
    )
);
