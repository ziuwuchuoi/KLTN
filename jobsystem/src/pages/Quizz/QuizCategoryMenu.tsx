import React, { useState } from "react";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuPortal,
    DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown, Folder, FolderOpen } from "lucide-react";
import { cn } from "@/components/utils/general.utils";
import { useNavigate } from "react-router-dom";
import { useQuizQueries, TechnicalCategoryItem } from "./hooks/useQuizQueries";

interface QuizCategoryMenuProps {
    className?: string;
}

export const QuizCategoryMenu = ({ className }: QuizCategoryMenuProps) => {
    const navigate = useNavigate();
    const { technicalCategories, isLoadingCategories } = useQuizQueries();

    if (isLoadingCategories) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="h-4 w-4 border-t-2 border-r-2 border-blue-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className={cn("w-fit flex items-center gap-2", className)}>
                    <span>Categories</span>
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gradient-to-b from-zinc-950 via-slate-900 to-gray-900 text-white">
                {technicalCategories
                    ?.slice()
                    .sort((a, b) => {
                        const aHasChildren = a.children && a.children.length > 0;
                        const bHasChildren = b.children && b.children.length > 0;
                        return aHasChildren === bHasChildren ? 0 : aHasChildren ? -1 : 1;
                    })
                    .map((category) => (
                        <CategoryDropdownItem
                            key={category.id}
                            category={category}
                            onSelectCategory={(id) => navigate(`/quiz/technical/${id}`)}
                        />
                    ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const CategoryDropdownItem = ({
    category,
    onSelectCategory,
    depth = 0,
}: {
    category: TechnicalCategoryItem;
    onSelectCategory: (id: number) => void;
    depth?: number;
}) => {
    if (!category.children || category.children.length === 0) {
        return (
            <DropdownMenuItem onClick={() => onSelectCategory(category.id)} className="cursor-pointer text-white">
                <span className={cn("pl-2", depth > 0 && "pl-2")}>{category.name}</span>
            </DropdownMenuItem>
        );
    }

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer text-white">
                <span className={cn("flex items-center", depth > 0 && "pl-2")}>
                    <Folder className="h-4 w-4 text-blue-400 mr-2" />
                    {category.name}
                </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
                <DropdownMenuSubContent className="bg-gradient-to-b from-zinc-950 via-slate-900 to-gray-900 text-white">
                    {category.children
                        .slice()
                        .sort((a, b) => {
                            const aHasChildren = a.children && a.children.length > 0;
                            const bHasChildren = b.children && b.children.length > 0;
                            return aHasChildren === bHasChildren ? 0 : aHasChildren ? -1 : 1;
                        })
                        .map((subcategory) => (
                            <CategoryDropdownItem
                                key={subcategory.id}
                                category={subcategory}
                                onSelectCategory={onSelectCategory}
                                depth={depth + 1}
                            />
                        ))}
                </DropdownMenuSubContent>
            </DropdownMenuPortal>
        </DropdownMenuSub>
    );
};

export default QuizCategoryMenu;
