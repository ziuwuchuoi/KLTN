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

            error: null,
            isBlurScreenLoading: false,
            isAuthChecking: false,
            isAuthenticated: false,
            isLoading: false,

            setToken: (token) => {
                console.log("🔐 Setting token:", !!token);
                set((state) => {
                    state.token = token;
                    state.isAuthenticated = !!token;
                });
            },

            setUser: (user) => {
                console.log("👤 Setting user:", !!user);
                set((state) => {
                    state.user = user;
                });
            },

            setAdmin: (admin) => {
                console.log("👨‍💼 Setting admin:", !!admin);
                set((state) => {
                    state.admin = admin;
                });
            },

            setRole: (role) => {
                console.log("🎭 Setting role:", role);
                set((state) => {
                    state.role = role;
                });
            },

            setError: (error) => {
                console.log("❌ Setting error:", error);
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
                console.log("=== Auth Store Login ===");
                console.log("Login params:", { role, step, type, data });

                try {
                    set({ isBlurScreenLoading: true });

                    const response = await loginService({ role, step, type, data });
                    console.log("Login service response:", response);

                    if (step === "verify") {
                        const { accessToken } = response;

                        if (accessToken) {
                            console.log("✅ Access token received, setting auth state");
                            set({ token: accessToken, error: null, isAuthenticated: true });
                            get().setRole(role);
                            // Fetch user profile after getting token
                            await get().fetchUserProfile();
                        } else {
                            throw new Error("No access token received on verify step.");
                        }
                    }
                } catch (error) {
                    console.error("❌ Login failed:", error);
                    set({ error: error?.response?.data?.message || "Login failed" });
                    throw error;
                } finally {
                    set({ isBlurScreenLoading: false });
                }
            },

            googleLogin: async (role: string) => {
                console.log("=== Auth Store Google Login ===");
                console.log("Google login role:", role);
                console.log("📦 localStorage before Google login:", {
                    auth_redirect_url: localStorage.getItem("auth_redirect_url"),
                    oauth_role: localStorage.getItem("oauth_role"),
                });

                try {
                    set({ isBlurScreenLoading: true });

                    const response = await loginService({
                        role,
                        step: "request",
                        type: 0,
                    });

                    console.log("Google login service response:", response);

                    const authUrl = response?.data?.data?.authUrl;
                    if (authUrl) {
                        console.log("✅ Auth URL received:", authUrl);
                        localStorage.setItem("oauth_role", role);
                        console.log("💾 Stored OAuth role in localStorage:", role);

                        console.log("📦 localStorage after storing OAuth role:", {
                            auth_redirect_url: localStorage.getItem("auth_redirect_url"),
                            oauth_role: localStorage.getItem("oauth_role"),
                        });

                        console.log("🔄 Redirecting to Google OAuth...");
                        window.location.href = authUrl;
                        return;
                    } else {
                        throw new Error("No authUrl returned");
                    }
                } catch (error) {
                    console.error("❌ Google login failed:", error);
                    set({ error: "Google login failed" });
                    throw error;
                } finally {
                    set({ isBlurScreenLoading: false });
                }
            },

            handleGoogleRedirect: async (isOAuth: boolean, token: string) => {
                console.log("=== Auth Store Handle Google Redirect ===");
                console.log("Handle redirect params:", { isOAuth, token: !!token });
                console.log("📦 localStorage at start of handleGoogleRedirect:", {
                    auth_redirect_url: localStorage.getItem("auth_redirect_url"),
                    oauth_role: localStorage.getItem("oauth_role"),
                });

                try {
                    if (isOAuth && token) {
                        console.log("✅ Valid OAuth callback, setting token");
                        set({ token: token, error: null, isAuthenticated: true });

                        const storedRole = localStorage.getItem("oauth_role");
                        console.log("🔍 Stored OAuth role:", storedRole);

                        if (storedRole) {
                            get().setRole(storedRole);
                            localStorage.removeItem("oauth_role");
                            console.log("🗑️ Removed OAuth role from localStorage");
                        }

                        console.log("👤 Fetching user profile...");
                        await get().fetchUserProfile();
                        console.log("✅ Google redirect handled successfully");
                    } else {
                        console.log("❌ Invalid OAuth callback");
                        toast.error("Authentication failed - no token received");
                        throw new Error("Authentication failed - no token received");
                    }
                } catch (error) {
                    console.error("❌ Failed to handle Google redirect:", error);
                    set({ error: "Failed to finalize Google login" });
                    throw error;
                }
            },

            loginAdmin: async (name, password) => {
                console.log("=== Auth Store Admin Login ===");
                console.log("Admin login params:", { name });

                try {
                    set({ isBlurScreenLoading: true });

                    const response = await loginAdminService(name, password);
                    console.log("Admin login response:", !!response);

                    if (response) {
                        console.log("✅ Admin login successful");
                        set({ token: response, error: null, isAuthenticated: true });
                        get().setRole("admin");
                        await get().fetchAdminProfile();
                    }
                } catch (error) {
                    console.error("❌ Admin login failed:", error);
                    set({ error: error?.response?.data?.message || "Login failed" });
                    throw error;
                } finally {
                    set({ isBlurScreenLoading: false });
                }
            },

            signupRecruiter: async ({ email, position, companyName, companyWebsite }) => {
                console.log("=== Auth Store Recruiter Signup ===");
                console.log("Signup params:", { email, position, companyName, companyWebsite });

                try {
                    set({ isLoading: true });
                    const response = await sigupRecruiterService({
                        email,
                        position,
                        companyName,
                        companyWebsite,
                    });

                    console.log("✅ Recruiter signup successful");
                    toast.success("Signup successful!");
                } catch (error) {
                    console.error("❌ Recruiter signup failed:", error);
                    set({ error: error?.response?.data?.message || "Signup failed" });
                    toast.error(error?.response?.data?.message || "Signup failed");
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },

            logout: async () => {
                console.log("=== Auth Store Logout ===");

                try {
                    set({ isBlurScreenLoading: true });

                    await logoutService();

                    // Clear auth redirect URL on logout
                    localStorage.removeItem("auth_redirect_url");
                    localStorage.removeItem("oauth_role");
                    console.log("🗑️ Cleared localStorage on logout");

                    set((state) => {
                        state.token = null;
                        state.user = null;
                        state.admin = null;
                        state.error = null;
                        state.role = null;
                        state.isAuthenticated = false;
                    });

                    console.log("✅ Logout successful");
                } catch (error) {
                    console.error("❌ Logout error:", error);
                } finally {
                    set({ isBlurScreenLoading: false });
                }
            },

            fetchUserProfile: async () => {
                console.log("=== Auth Store Fetch User Profile ===");

                try {
                    const response = await getUserProfileService();
                    console.log("User profile response:", !!response);

                    if (response) {
                        set((state) => {
                            state.user = response;
                        });
                        console.log("✅ User profile fetched successfully");
                        return response;
                    } else {
                        console.error("❌ Failed to fetch user profile: No data returned");
                        return null;
                    }
                } catch (error) {
                    console.error("❌ Fetch user profile failed", error);
                    return null;
                }
            },

            fetchAdminProfile: async () => {
                console.log("=== Auth Store Fetch Admin Profile ===");

                try {
                    const response = await getAdminProfileService();
                    console.log("Admin profile response:", !!response);

                    if (response) {
                        const responseWithRole = { ...response, role: "admin" };

                        set((state) => {
                            state.admin = responseWithRole;
                        });

                        console.log("✅ Admin profile fetched successfully");
                        return responseWithRole;
                    } else {
                        console.error("❌ Failed to fetch admin profile: No data returned");
                        return null;
                    }
                } catch (error) {
                    console.error("❌ Fetch admin profile failed", error);
                    return null;
                }
            },

            updateUser: (userUpdate) => {
                console.log("=== Auth Store Update User ===");
                console.log("User update:", userUpdate);

                set((state) => {
                    if (state.user) {
                        Object.assign(state.user, userUpdate);
                        console.log("✅ User updated successfully");
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
            }),
        }
    )
);
