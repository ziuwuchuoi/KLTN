import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function TokenExpiryHandler() {
    const { token, tokenExpiry, setToken } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token || !tokenExpiry) return;

        const now = Date.now();
        const delay = tokenExpiry - now;

        if (delay <= 0) {
            toast.warning("Your session has expired. Please sign in again.");
            setToken(null);
            navigate("/signin");
            return;
        }

        const timer = setTimeout(() => {
            toast.warning("Your session has expired. Please sign in again.");
            setToken(null);
            navigate("/signin");
        }, delay);

        return () => clearTimeout(timer);
    }, [token, tokenExpiry, setToken, navigate]);

    return null; // không render gì
}
