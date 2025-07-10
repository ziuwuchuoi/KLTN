"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Filter, X, Search, SortAsc, SortDesc } from "lucide-react";

export interface FilterApplications {
    status?: string;
    jobTitle?: string;
    overallScoreSort?: "asc" | "desc";
    search?: string;
}

interface FilterApplicationProps {
    filters: FilterApplications;
    onFiltersChange: (filters: FilterApplications) => void;
    onClearFilters: () => void;
}

const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "shortlisted", label: "Shortlisted" },
    { value: "rejected", label: "Rejected" },
    { value: "accepted", label: "Accepted" },
];

export function FilterApplication({ filters, onFiltersChange, onClearFilters }: FilterApplicationProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [localFilters, setLocalFilters] = useState<FilterApplications>(filters);

    const handleApplyFilters = () => {
        onFiltersChange(localFilters);
        setIsOpen(false);
    };

    const handleClearFilters = () => {
        const emptyFilters: FilterApplications = {};
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
                    placeholder="Search by job title..."
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
                            <h4 className="font-medium text-white">Filter Applications</h4>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClearFilters}
                                className="text-gray-400 hover:text-white"
                            >
                                Clear all
                            </Button>
                        </div>

                        {/* Status Filter */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-300">Status</Label>
                            <Select
                                value={localFilters.status || "all"}
                                onValueChange={(value) =>
                                    setLocalFilters({ ...localFilters, status: value === "all" ? undefined : value })
                                }
                            >
                                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-700 border-slate-600">
                                    <SelectItem value="all" className="text-white">
                                        All Statuses
                                    </SelectItem>
                                    {statusOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value} className="text-white">
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Job Title Filter */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-300">Job Title</Label>
                            <Input
                                placeholder="Filter by job title"
                                value={localFilters.jobTitle || ""}
                                onChange={(e) =>
                                    setLocalFilters({ ...localFilters, jobTitle: e.target.value || undefined })
                                }
                                className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                            />
                        </div>

                        {/* Overall Score Sort */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-300">Sort by Overall Score</Label>
                            <Select
                                value={localFilters.overallScoreSort || "none"}
                                onValueChange={(value) =>
                                    setLocalFilters({
                                        ...localFilters,
                                        overallScoreSort: value === "none" ? undefined : (value as "asc" | "desc"),
                                    })
                                }
                            >
                                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                    <SelectValue placeholder="Select sort order" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-700 border-slate-600">
                                    <SelectItem value="none" className="text-white">
                                        No sorting
                                    </SelectItem>
                                    <SelectItem value="desc" className="text-white">
                                        <div className="flex items-center gap-2">
                                            <SortDesc className="h-4 w-4" />
                                            Highest first
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="asc" className="text-white">
                                        <div className="flex items-center gap-2">
                                            <SortAsc className="h-4 w-4" />
                                            Lowest first
                                        </div>
                                    </SelectItem>
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
                    {filters.status && (
                        <Badge variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-500/30">
                            Status: {statusOptions.find((s) => s.value === filters.status)?.label}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="ml-1 h-auto p-0 text-blue-300 hover:text-blue-100"
                                onClick={() => onFiltersChange({ ...filters, status: undefined })}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}
                    {filters.jobTitle && (
                        <Badge variant="secondary" className="bg-green-600/20 text-green-300 border-green-500/30">
                            Job: {filters.jobTitle}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="ml-1 h-auto p-0 text-green-300 hover:text-green-100"
                                onClick={() => onFiltersChange({ ...filters, jobTitle: undefined })}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}
                    {filters.overallScoreSort && (
                        <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-500/30">
                            Score: {filters.overallScoreSort === "desc" ? "High to Low" : "Low to High"}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="ml-1 h-auto p-0 text-purple-300 hover:text-purple-100"
                                onClick={() => onFiltersChange({ ...filters, overallScoreSort: undefined })}
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
