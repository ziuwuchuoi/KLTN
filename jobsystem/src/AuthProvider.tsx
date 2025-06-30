"use client";

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

        console.log("urlParams", urlParams);

        if (isOAuth) {
            const processGoogleCallback = async () => {
                try {
                    if (!token) {
                        throw new Error("No token in URL parameters");
                    }

                    await handleGoogleRedirect(isOAuth, token);
                    toast.success("Login successful!");

                    // Get the redirect URL from params or default to home
                    const redirect = urlParams.get("redirect");
                    console.log("Redirect URL:", redirect);
                    if (redirect) {
                        // Decode the redirect URL and navigate to it
                        navigate(decodeURIComponent(redirect));
                    } else {
                        navigate("/");
                    }
                } catch (error) {
                    console.error("Google login failed:", error);
                    toast.error(error.message || "Login failed");

                    // If there was a redirect URL, preserve it when going back to signin
                    const redirect = urlParams.get("redirect");
                    if (redirect) {
                        navigate(`/signin/candidate?redirect=${redirect}`);
                    } else {
                        navigate("/signin/candidate");
                    }
                }
            };

            processGoogleCallback();
        }
    }, [location.search, navigate, handleGoogleRedirect]);

    return children;
};

export default AuthProvider;
