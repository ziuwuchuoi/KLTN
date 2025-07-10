"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Filter, X, Search } from "lucide-react";

export interface FilterJDs {
    title?: string;
    visibility?: string;
    search?: string;
}

interface FilterJDProps {
    filters: FilterJDs;
    onFiltersChange: (filters: FilterJDs) => void;
    onClearFilters: () => void;
}

const visibilityOptions = [
    { value: "public", label: "Public" },
    { value: "private", label: "Private" },
];

export function FilterJD({ filters, onFiltersChange, onClearFilters }: FilterJDProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [localFilters, setLocalFilters] = useState<FilterJDs>(filters);

    const handleApplyFilters = () => {
        onFiltersChange(localFilters);
        setIsOpen(false);
    };

    const handleClearFilters = () => {
        const emptyFilters: FilterJDs = {};
        setLocalFilters(emptyFilters);
        onClearFilters();
        setIsOpen(false);
    };

    const getActiveFiltersCount = () => {
        return Object.values(filters).filter((value) => value !== undefined && value !== "").length;
    };

    const activeFiltersCount = getActiveFiltersCount();

    return (
        <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                    placeholder="Search by title..."
                    value={filters.search || ""}
                    onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                    className="pl-10 w-64 bg-slate-800 border-slate-700 text-white placeholder:text-gray-400"
                />
            </div>

            {/* Filter Popover */}
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="border-slate-700 bg-slate-800 text-white hover:bg-slate-700">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                        {activeFiltersCount > 0 && (
                            <Badge variant="secondary" className="ml-2 bg-purple-600 text-white">
                                {activeFiltersCount}
                            </Badge>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-slate-800 border-slate-700" align="end">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium text-white">Filter Job Descriptions</h4>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClearFilters}
                                className="text-gray-400 hover:text-white"
                            >
                                Clear all
                            </Button>
                        </div>

                        {/* Title Filter */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-300">Job Title</Label>
                            <Input
                                placeholder="Filter by title"
                                value={localFilters.title || ""}
                                onChange={(e) =>
                                    setLocalFilters({ ...localFilters, title: e.target.value || undefined })
                                }
                                className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                            />
                        </div>

                        {/* Visibility Filter */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-300">Visibility</Label>
                            <Select
                                value={localFilters.visibility || "all"}
                                onValueChange={(value) =>
                                    setLocalFilters({
                                        ...localFilters,
                                        visibility: value === "all" ? undefined : value,
                                    })
                                }
                            >
                                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                    <SelectValue placeholder="Select visibility" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-700 border-slate-600">
                                    <SelectItem value="all" className="text-white">
                                        All Visibility
                                    </SelectItem>
                                    {visibilityOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value} className="text-white">
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Apply Button */}
                        <div className="flex gap-2 pt-2">
                            <Button onClick={handleApplyFilters} className="flex-1 bg-purple-600 hover:bg-purple-700">
                                Apply Filters
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                                className="border-slate-600 text-gray-300"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>

            {/* Active Filters Display */}
            {/* {activeFiltersCount > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                    {filters.title && (
                        <Badge variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-500/30">
                            Title: {filters.title}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="ml-1 h-auto p-0 text-blue-300 hover:text-blue-100"
                                onClick={() => onFiltersChange({ ...filters, title: undefined })}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}
                    {filters.visibility && (
                        <Badge variant="secondary" className="bg-green-600/20 text-green-300 border-green-500/30">
                            Visibility: {visibilityOptions.find((v) => v.value === filters.visibility)?.label}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="ml-1 h-auto p-0 text-green-300 hover:text-green-100"
                                onClick={() => onFiltersChange({ ...filters, visibility: undefined })}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}
                </div>
            )} */}
        </div>
    );
}
