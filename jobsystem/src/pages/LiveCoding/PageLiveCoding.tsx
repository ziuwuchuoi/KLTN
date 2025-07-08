"use client";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, X } from "lucide-react";
import { useCodeQueries } from "./hooks/useCodeQueries";
import { CustomTopicFilter } from "@/components/molecules/code/CustomTopicFilter";
import { CustomTable } from "@/components/molecules/dashboard/CustomTable";
import CustomHeroSection from "@/components/molecules/CustomHeroSection";
import { CustomPagination } from "@/components/molecules/CustomPagination";
import { getCodeProblemColumns } from "@/components/molecules/dashboard/columns";

// Mock suggested problems data
const mockSuggestedProblems = [
    {
        _id: "suggested_1",
        problemId: 1,
        title: "Two Sum",
        difficulty: "Easy",
        topicTags: ["Array", "Hash Table"],
        acceptanceRate: 49.2,
        submissions: 8234567,
    },
    {
        _id: "suggested_2",
        problemId: 15,
        title: "3Sum",
        difficulty: "Medium",
        topicTags: ["Array", "Two Pointers", "Sorting"],
        acceptanceRate: 32.1,
        submissions: 2456789,
    },
    {
        _id: "suggested_3",
        problemId: 206,
        title: "Reverse Linked List",
        difficulty: "Easy",
        topicTags: ["Linked List", "Recursion"],
        acceptanceRate: 71.8,
        submissions: 3567890,
    },
    {
        _id: "suggested_4",
        problemId: 121,
        title: "Best Time to Buy and Sell Stock",
        difficulty: "Easy",
        topicTags: ["Array", "Dynamic Programming"],
        acceptanceRate: 54.3,
        submissions: 4123456,
    },
];

const PageCodeProblems = () => {
    const navigate = useNavigate();
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedDifficulty, setSelectedDifficulty] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const {
        codeProblems,
        pagination,
        isCodeProblemsLoading,
        suggestedCodeProblems,
        isSuggestedCodeProblemsLoading,
        tags,
        isTagsLoading,
    } = useCodeQueries(
        null,
        selectedTags.join(","),
        selectedDifficulty === "All" ? "" : selectedDifficulty,
        currentPage,
        20
    );

    const filteredProblems = useMemo(() => {
        return codeProblems.filter(
            (problem) =>
                problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                problem.problemId.toString().includes(searchQuery)
        );
    }, [codeProblems, searchQuery]);

    const handleProblemClick = (problem) => {
        navigate(`/code/${problem._id}`);
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedTags([]);
        setSelectedDifficulty("All");
        setCurrentPage(1);
    };

    const clearSearch = () => {
        setSearchQuery("");
    };

    const clearTags = () => {
        setSelectedTags([]);
    };

    const clearDifficulty = () => {
        setSelectedDifficulty("All");
    };

    const hasActiveFilters = searchQuery || selectedTags.length > 0 || selectedDifficulty !== "All";

    return (
        <div className="flex flex-col p-6 pt-40 w-full">
            {/* Fixed Section */}
            <div className="flex flex-row items-end w-full justify-around mb-10">
                <CustomHeroSection
                    title="Code Problem"
                    subtitle="Studio"
                    align="center"
                    description="Sharpen your coding skills with real-world problems in an interactive, compiler-integrated environment. Practice, solve, and grow."
                />
            </div>

            {/* Problems Section */}
            <div className="max-w-7xl mx-auto w-full">
                {/* Filters and Search */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder="Search questions"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-10 bg-slate-800 border-slate-700"
                        />
                        {searchQuery && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearSearch}
                                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-700"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                        <SelectTrigger className="w-full sm:w-[180px] bg-slate-800 border-slate-700">
                            <SelectValue placeholder="Difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Difficulties</SelectItem>
                            <SelectItem value="Easy">Easy</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="flex justify-center">
                        <CustomTopicFilter
                            availableTags={tags}
                            selectedTags={selectedTags}
                            onTagsChange={setSelectedTags}
                            isLoading={isTagsLoading}
                        />
                    </div>
                </div>

                {/* Active Filters */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                        <span className="text-sm text-gray-400">Active filters:</span>

                        {searchQuery && (
                            <Badge
                                variant="secondary"
                                className="bg-green-600/20 text-green-300 border-green-500/30 px-3 py-1 flex items-center gap-2"
                            >
                                <span className="text-sm">Search: "{searchQuery}"</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearSearch}
                                    className="h-4 w-4 p-0 hover:bg-green-500/20"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                        )}

                        {selectedDifficulty !== "All" && (
                            <Badge
                                variant="secondary"
                                className="bg-blue-600/20 text-blue-300 border-blue-500/30 px-3 py-1 flex items-center gap-2"
                            >
                                <span className="text-sm">Difficulty: {selectedDifficulty}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearDifficulty}
                                    className="h-4 w-4 p-0 hover:bg-blue-500/20"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                        )}

                        {selectedTags.length > 0 && (
                            <Badge
                                variant="secondary"
                                className="bg-purple-600/20 text-purple-300 border-purple-500/30 px-3 py-1 flex items-center gap-2"
                            >
                                <span className="text-sm">
                                    {selectedTags.length === 1 ? selectedTags[0] : `${selectedTags.length} topics`}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearTags}
                                    className="h-4 w-4 p-0 hover:bg-purple-500/20"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                        )}

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="text-gray-400 hover:text-white text-xs"
                        >
                            Clear all
                        </Button>
                    </div>
                )}

                {/* Suggested Problems Section */}
                {!hasActiveFilters && mockSuggestedProblems.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-yellow-600/20 border border-yellow-500/30">
                                <Star className="h-5 w-5 text-yellow-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Recommended for You</h2>
                                <p className="text-gray-400">Popular problems to boost your coding skills</p>
                            </div>
                        </div>

                        <div className="relative">
                            <CustomTable
                                data={mockSuggestedProblems}
                                columns={getCodeProblemColumns(handleProblemClick)}
                                isLoading={false}
                                loadingMessage="Loading suggested problems..."
                                onRowClick={handleProblemClick}
                                className="bg-slate-800/50 border-slate-700"
                            />
                        </div>
                    </div>
                )}

                {/* Main Content Section */}
                <div>
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                {hasActiveFilters ? "Search Results" : "All Problems"}
                            </h2>
                            <p className="text-gray-400">
                                {hasActiveFilters
                                    ? `${filteredProblems.length} problem${filteredProblems.length !== 1 ? "s" : ""} found`
                                    : `Explore all coding problems`}
                            </p>
                        </div>
                    </div>

                    {/* Problems Table */}
                    <CustomTable
                        data={filteredProblems}
                        columns={getCodeProblemColumns(handleProblemClick)}
                        isLoading={isCodeProblemsLoading}
                        loadingMessage="Loading problems..."
                        onRowClick={handleProblemClick}
                        className="bg-slate-800/50 border-slate-700"
                    />

                    {/* Empty State */}
                    {!isCodeProblemsLoading && filteredProblems.length === 0 && (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                                <Search className="h-8 w-8 text-gray-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No problems found</h3>
                            <p className="text-gray-400 mb-4">
                                {hasActiveFilters
                                    ? "Try adjusting your search or filter criteria"
                                    : "No problems available at the moment"}
                            </p>
                            {hasActiveFilters && (
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                    className="border-slate-700 text-white hover:bg-slate-800"
                                >
                                    Clear filters
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {!searchQuery && filteredProblems.length > 0 && (
                        <div className="flex items-center justify-between mt-8">
                            <div className="text-sm text-slate-400">
                                Showing {(currentPage - 1) * pagination.limit + 1} to{" "}
                                {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total}{" "}
                                problems
                            </div>
                            <div>
                                <CustomPagination
                                    currentPage={currentPage}
                                    totalPages={pagination.totalPages}
                                    onPageChange={(newPage) => setCurrentPage(newPage)}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PageCodeProblems;
