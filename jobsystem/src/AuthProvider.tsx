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

        if (isOAuth) {
            const processGoogleCallback = async () => {
                try {
                    if (!token) {
                        throw new Error("No token in URL parameters");
                    }

                    await handleGoogleRedirect(isOAuth, token);
                    toast.success("Login successful!");

                    // Check for stored redirect URL first, then fallback to URL params
                    const storedRedirectUrl = localStorage.getItem("auth_redirect_url");
                    const urlRedirect = urlParams.get("redirect");

                    if (storedRedirectUrl && storedRedirectUrl !== "/") {
                        localStorage.removeItem("auth_redirect_url");
                        navigate(storedRedirectUrl);
                    } else if (urlRedirect && urlRedirect !== "/") {
                        navigate(decodeURIComponent(urlRedirect));
                    } else {
                        navigate("/");
                    }
                } catch (error) {
                    toast.error(error.message || "Login failed");

                    const storedRedirectUrl = localStorage.getItem("auth_redirect_url");

                    if (storedRedirectUrl && storedRedirectUrl !== "/") {
                        const encodedUrl = encodeURIComponent(storedRedirectUrl);
                        navigate(`/signin/candidate?redirect=${encodedUrl}`);
                    } else {
                        navigate("/signin/candidate");
                    }
                }
            };

            processGoogleCallback();
        } else {
            console.log("Not an OAuth callback, continuing normally");
        }
    }, [location, navigate, handleGoogleRedirect]);

    return children;
};

export default AuthProvider;
