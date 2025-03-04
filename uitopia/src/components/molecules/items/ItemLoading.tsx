import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/components/general.utils";

interface ItemLoadingProps {
    isLoading?: boolean;
    fallbackMessage?: string;
    itemContainerClassName?: string;
    skeletonClassName?: string;
    hasCreateItem?: boolean;
    maxItems?: {
        md?: number;
        lg?: number;
        xl?: number;
        "2xl"?: number;
    };
}

const defaultMaxItems = {
    md: 6,
    lg: 6,
    xl: 8,
    "2xl": 10,
};

const ItemLoading = ({
    isLoading,
    fallbackMessage,
    itemContainerClassName,
    skeletonClassName,
    hasCreateItem = false,
    maxItems = defaultMaxItems,
}: ItemLoadingProps) => {
    const [numItems, setNumItems] = useState(maxItems.md || defaultMaxItems.md);

    useEffect(() => {
        const updateNumItems = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth >= 1536) {
                // 2xl breakpoint
                setNumItems(maxItems["2xl"] || defaultMaxItems["2xl"]);
            } else if (screenWidth >= 1280) {
                // xl breakpoint
                setNumItems(maxItems.xl || defaultMaxItems.xl);
            } else if (screenWidth >= 1024) {
                // lg breakpoint
                setNumItems(maxItems.lg || defaultMaxItems.lg);
            } else {
                // md breakpoint (default)
                setNumItems(maxItems.md || defaultMaxItems.md);
            }
        };

        updateNumItems();
        window.addEventListener("resize", updateNumItems);
        return () => window.removeEventListener("resize", updateNumItems);
    }, [maxItems]);

    const actualNumberOfItems = hasCreateItem ? numItems - 1 : numItems;

    return (
        isLoading &&
        Array.from({ length: actualNumberOfItems }, (_, index) => (
            <div
                className={cn("col-span-6 lg:col-span-4 xl:col-span-3 2xl:col-span-2 gap-4", itemContainerClassName)}
                key={index}
            >
                <Skeleton className={cn("h-[160px] mb-2 w-full rounded-xl", skeletonClassName)} />
            </div>
        ))
    );
};

export default ItemLoading;
