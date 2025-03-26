import { SortOption } from "../molecules/universal/CustomSelect";

export const SORT_OPTIONS: SortOption[] = [
    { id: "a2z", label: "A - Z" },
    { id: "recent", label: "Recent" },
    { id: "popular", label: "Popular" },
    { id: "favorite", label: "Favorite" },
];

export type SortableItem = {
    createdAt?: string | Date; // Allow both string and Date types
    name: string;
    interactionCount?: number;
    favoriteCount?: number;
    isFavorited?: boolean;
};

export const sortList = <T extends SortableItem>(items: T[], sortOption: string): T[] => {
    // Make a shallow copy so as not to mutate the original array
    let sorted = [...items];

    // If the sort option is "favorite", return only the favorited items.
    if (sortOption === "favorite") {
        return sorted.filter((item) => item.isFavorited);
    }

    switch (sortOption) {
        case "popular":
            sorted.sort((a, b) => {
                const scoreA = (a.interactionCount || 0) + (a.favoriteCount || 0) * 10;
                const scoreB = (b.interactionCount || 0) + (b.favoriteCount || 0) * 10;
                return scoreB - scoreA;
            });
            break;
        case "a2z":
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case "recent":
            sorted.sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dateB - dateA;
            });
            break;
        default:
            break;
    }
    return sorted;
};
