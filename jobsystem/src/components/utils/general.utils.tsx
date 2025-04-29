import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TbCircleCheck, TbAlertCircle, TbCircleX, TbX } from "react-icons/tb";
import { BaseUser, UserRole } from "@/types/types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getActiveRoute = () => {
    const path = location.pathname.split("/")[1]; // Get first part of path
    return path || "home";
};

export const FormatDate = (
    dateString: string,
    mode: "simple" | "detail" | "relative" | "withDay" = "detail"
): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInWeeks = Math.floor(diffInDays / 7);

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    if (mode === "relative") {
        // Handle relative time formatting
        if (diffInMinutes < 60) {
            return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
        } else if (diffInDays < 7) {
            return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
        } else if (diffInWeeks < 4) {
            return `${diffInWeeks} ${diffInWeeks === 1 ? "week" : "weeks"} ago`;
        } else {
            // Format as Month Day Year
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
        }
    }

    // Original formatting logic
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    if (mode === "simple") {
        return `${day}/${month}/${year}`;
    } else if (mode === "withDay") {
        const dayName = dayNames[date.getDay()];
        return `${dayName}, ${day}/${month}/${year}`;
    } else {
        return `${hours}:${minutes} ${day}/${month}/${year}`;
    }
};

export const ShowToast = (toast, type: "success" | "error", message: string) => {
    const icon =
        type === "success" ? (
            <TbCircleCheck className="flex size-5 text-green-500 mr-2" />
        ) : (
            <TbCircleX className="flex size-5 text-red-500 mr-2" />
        );

    toast({
        description: (
            <div className="flex items-center ">
                {icon} {message}
            </div>
        ),
    });
};

export const HandleError = (error, message, toast) => {
    console.error(message, error);
    if (toast) ShowToast(toast, "error", message);
};

export const getUserFromStorage = (): BaseUser | null => {
    if (typeof window === "undefined") return null;

    try {
        const authStorage = localStorage.getItem("auth_storage");
        if (authStorage) {
            const parsed = JSON.parse(authStorage);
            // Access the user object from the nested structure
            return parsed.state?.user || null;
        }
        return null;
    } catch (error) {
        console.error("Error parsing auth storage:", error);
        return null;
    }
};

export const calculateDailyOperationalCost = (platformCost, totalUsers) => {
    const today = new Date(); // Get current date
    const currentMonth = today.getMonth(); // Get current month (0-11)
    const currentYear = today.getFullYear(); // Get current year

    // Calculate days in the current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // console.log("Days in month:", daysInMonth);

    const dailyCostPerUser = platformCost / totalUsers / daysInMonth;
    return dailyCostPerUser;
};

export const getMimeExtension = (mimeType: string) => {
    return mimeType.split("/")[1];
};

export const getNamePart = (name: string) => {
    return name.split(".")[0];
};

const rolePriority: Record<UserRole, number> = {
    candidate: 1,
    recruiter: 2,
    admin: 3,
};

export function canAccess(userRole: UserRole, requiredRole: UserRole): boolean {
    return rolePriority[userRole] >= rolePriority[requiredRole];
}

// Helper: Extract first name from email
export const getFirstName = (user) => {
    const email = user?.email;
    if (email) {
        // Matches optional "fixed-term." or "external." then captures firstName
        const regex = /^(?:fixed-term\.|external\.)?([a-z]+)\.[a-z]+@/i;
        const match = email.match(regex);
        if (match && match[1]) {
            const firstName = match[1];
            return firstName.charAt(0).toUpperCase() + firstName.slice(1);
        }
    }
    return user?.name || "User";
};

// Helper: Greeting based on local time
export const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
};
