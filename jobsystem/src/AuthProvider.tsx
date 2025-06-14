import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

const AuthProvider = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { handleGoogleRedirect } = useAuthStore();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const isOAuth = urlParams.get("login_oauth2") === "true";
        const token = urlParams.get("token");
        
        console.log("Auth state:", { isOAuth, token, currentUrl: location });
        
        if (isOAuth) {
            const processGoogleCallback = async () => {
                try {
                    if (!token) {
                        throw new Error("No token in URL parameters");
                    }
                    
                    await handleGoogleRedirect(isOAuth, token);
                    toast.success("Login successful!");
                    // Get the redirect URL from params or default to home
                    const redirect = urlParams.get("redirect") || "/";
                    navigate(redirect);
                } catch (error) {
                    console.error("Google login failed:", error);
                    toast.error(error.message || "Login failed");
                    navigate("/signin/candidate");
                }
            };
            processGoogleCallback();
        }
    }, []);

    return children;
};

export default AuthProvider;