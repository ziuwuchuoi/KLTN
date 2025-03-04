import { type ClassValue, clsx } from "clsx";
import { TbCircleCheck, TbCircleX } from "react-icons/tb";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

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

export const FormatPrice = (
    price: number,
    options: {
        format?: "basic" | "detailed" | "compact",
        currency?: string,
        showCents?: boolean,
        showCurrencySymbol?: boolean
    } = {}
): string => {
    const {
        format = "basic",
        currency = "USD",
        showCents = true,
        showCurrencySymbol = true
    } = options;

    // Currency symbol mapping
    const currencySymbols: Record<string, string> = {
        "USD": "$",
        "EUR": "€",
        "GBP": "£",
        "JPY": "¥",
        "CNY": "¥",
        "INR": "₹",
        "AUD": "A$",
        "CAD": "C$",
        "THB": "฿",
        "SGD": "S$",
        "MYR": "RM",
        "KRW": "₩",
        "VND": "₫"
    };

    // Get the appropriate currency symbol
    const symbol = currencySymbols[currency] || currency;
    
    // Format the price based on the selected format
    if (format === "basic") {
        // Basic format: $XX or $XX.XX
        const formatter = new Intl.NumberFormat('en-US', {
            style: showCurrencySymbol ? 'currency' : 'decimal',
            currency: currency,
            minimumFractionDigits: showCents ? 2 : 0,
            maximumFractionDigits: showCents ? 2 : 0
        });
        
        return formatter.format(price);
    } 
    else if (format === "compact") {
        // Compact format for large numbers: $1K, $1M, etc.
        const formatter = new Intl.NumberFormat('en-US', {
            notation: 'compact',
            compactDisplay: 'short',
            minimumFractionDigits: 0,
            maximumFractionDigits: 1
        });
        
        const formattedValue = formatter.format(price);
        return showCurrencySymbol ? `${symbol}${formattedValue}` : formattedValue;
    }
    else if (format === "detailed") {
        // Detailed format with thousands separators: $1,234.56
        const formatter = new Intl.NumberFormat('en-US', {
            style: showCurrencySymbol ? 'currency' : 'decimal',
            currency: currency,
            minimumFractionDigits: showCents ? 2 : 0,
            maximumFractionDigits: showCents ? 2 : 0
        });
        
        return formatter.format(price);
    }
    
    // Default fallback to basic format
    return showCurrencySymbol ? `${symbol}${price.toFixed(showCents ? 2 : 0)}` : price.toFixed(showCents ? 2 : 0);
};


export const ShowToast = (toast: any, type: "success" | "error", message: string) => {
    const icon =
        type === "success" ? (
            <TbCircleCheck className="flex w-5 h-5 text-green-500 mr-2" />
        ) : (
            <TbCircleX className="flex w-5 h-5 text-red-500 mr-2" />
        );

    toast({
        description: (
            <div className="flex items-center ">
                {icon} {message}
            </div>
        ),
    });
};