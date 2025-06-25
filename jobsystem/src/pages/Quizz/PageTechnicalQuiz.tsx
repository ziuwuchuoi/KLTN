"use client";

import { useMemo, useState } from "react";
import CustomHeroSection from "@/components/molecules/CustomHeroSection";
import { TbQuote, TbSearch, TbX, TbStar } from "react-icons/tb";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useQuizQueries } from "./hooks/useQuizQueries";
import { QuizCategoryMenu } from "./QuizCategoryMenu";
import { CustomPagination } from "@/components/molecules/CustomPagination";
import { QuizItemCard } from "./QuizItemCard";

const PageTechnicalQuiz = () => {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedCategoryName, setSelectedCategoryName] = useState("");
    const [page, setPage] = useState(1);
    const limit = 20;
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const {
        technicalQuizzes,
        paginationMeta,
        suggestedTechnicalQuizzes,
        isLoadingSuggestedQuizzes,
        technicalCategories,
    } = useQuizQueries(null, selectedCategory, page, limit);

    const filteredQuizzes = useMemo(() => {
        const categoryFiltered = selectedCategory
            ? technicalQuizzes.filter((item) => item.categories.includes(selectedCategory))
            : technicalQuizzes;

        const searchFiltered = categoryFiltered.filter((item) =>
            item.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
        );

        return searchFiltered;
    }, [searchQuery, selectedCategory, technicalQuizzes]);

    const handleQuizClick = (quiz) => {
        const startTime = new Date().toISOString();
        navigate(`/quiz/technical/${quiz._id}`, {
            state: { startTime },
        });
    };

    const handleCategorySelect = (categoryId: string) => {
        setPage(1);
        setSelectedCategory(categoryId);

        // Find the category name for display
        const findCategoryName = (categories, id) => {
            for (const category of categories) {
                if (category.name === id) return category.name;
                if (category.children) {
                    const found = findCategoryName(category.children, id);
                    if (found) return found;
                }
            }
            return id;
        };

        const categoryName = technicalCategories ? findCategoryName(technicalCategories, categoryId) : categoryId;
        setSelectedCategoryName(categoryName);
    };

    const clearCategory = () => {
        setSelectedCategory("");
        setSelectedCategoryName("");
        setPage(1);
    };

    const clearSearch = () => {
        setSearchQuery("");
    };

    return (
        <div className="flex flex-col px-6 w-full min-h-screen">
            {/* Enhanced Header Section with Fixed Layout */}
            <div className="mt-32 mb-8">
                {/* Main Header Layout - Left: Search/Filters, Right: Hero */}
                <div className="flex items-end justify-between gap-8 mb-8">
                    {/* Left Section - Search and Filters (Flexible Width) */}
                    <div className="flex-1 min-w-0">
                        {/* Search and Filter Controls */}
                        <div className="p-6">
                            <div className="flex flex-row gap-4">
                                {/* Search Input Row */}
                                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                    {/* Search Input */}
                                    <div className="relative flex-1 max-w-md">
                                        <TbSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            type="text"
                                            placeholder="Search quizzes..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 pr-10 bg-zinc-800/70 border-zinc-700 text-white focus:border-blue-500 transition-colors"
                                        />
                                        {searchQuery && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={clearSearch}
                                                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-zinc-700"
                                            >
                                                <TbX className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>

                                    {/* Category Filter */}
                                    <div className="flex-shrink-0">
                                        <QuizCategoryMenu
                                            className="bg-zinc-800/70 border-zinc-700 hover:bg-zinc-700 text-white"
                                            onSelectCategory={handleCategorySelect}
                                        />
                                    </div>
                                </div>

                                {/* Active Filters Row */}
                                {(selectedCategory || searchQuery) && (
                                    <div className="flex flex-wrap items-center gap-2">
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
                                                    <TbX className="h-3 w-3" />
                                                </Button>
                                            </Badge>
                                        )}

                                        {selectedCategory && (
                                            <Badge
                                                variant="secondary"
                                                className="bg-blue-600/20 text-blue-300 border-blue-500/30 px-3 py-1 flex items-center gap-2"
                                            >
                                                <span className="text-sm">{selectedCategoryName}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={clearCategory}
                                                    className="h-4 w-4 p-0 hover:bg-blue-500/20"
                                                >
                                                    <TbX className="h-3 w-3" />
                                                </Button>
                                            </Badge>
                                        )}

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                clearSearch();
                                                clearCategory();
                                            }}
                                            className="text-gray-400 hover:text-gray-600 text-xs"
                                        >
                                            Clear all
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Hero (Fixed Width) */}
                    <div className="flex-shrink-0 w-fit">
                        <CustomHeroSection
                            title="Technical Quiz"
                            subtitle="Assessment Center"
                            description="Evaluate your skills, personality, and professional aptitude with our comprehensive quiz collection"
                            align="right"
                        />
                    </div>
                </div>
            </div>

            {/* Suggested Quizzes Section */}
            {!isLoadingSuggestedQuizzes &&
                suggestedTechnicalQuizzes.length > 0 &&
                !searchQuery &&
                !selectedCategory && (
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-yellow-600/20 border border-yellow-500/30">
                                <TbStar className="h-5 w-5 text-yellow-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Suggested for You</h2>
                                <p className="text-gray-400">Recommended quizzes based on your interests</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {suggestedTechnicalQuizzes.slice(0, 4).map((item) => (
                                <QuizItemCard
                                    key={item._id}
                                    item={item}
                                    onStartClick={() => handleQuizClick(item)}
                                    color="hover:from-yellow-500/20 to-orange-500/20"
                                    borderColor="hover:border-yellow-500"
                                    icon={<TbStar className="text-yellow-400" />}
                                />
                            ))}
                        </div>
                    </div>
                )}

            {/* Main Content Section */}
            <div className="flex-1">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            {searchQuery || selectedCategory ? "Search Results" : "All Quizzes"}
                        </h2>
                        <p className="text-gray-400">
                            {searchQuery || selectedCategory
                                ? `${filteredQuizzes.length} quiz${filteredQuizzes.length !== 1 ? "es" : ""} found`
                                : `Explore ${technicalQuizzes.length} technical quizzes`}
                        </p>
                    </div>
                </div>

                {/* Quiz Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {filteredQuizzes.map((item) => (
                        <QuizItemCard
                            key={item._id}
                            item={item}
                            onStartClick={() => handleQuizClick(item)}
                            color="hover:from-purple-500/20 to-pink-500/20"
                            borderColor="hover:border-purple-500"
                            icon={<TbQuote className="text-purple-400" />}
                        />
                    ))}
                </div>

                {/* Empty State */}
                {filteredQuizzes.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800/50 flex items-center justify-center">
                            <TbSearch className="h-8 w-8 text-gray-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No quizzes found</h3>
                        <p className="text-gray-400 mb-4">
                            {searchQuery || selectedCategory
                                ? "Try adjusting your search or filter criteria"
                                : "No quizzes available at the moment"}
                        </p>
                        {(searchQuery || selectedCategory) && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    clearSearch();
                                    clearCategory();
                                }}
                                className="border-zinc-300 text-gray-400 hover:bg-zinc-500 hover:text-gray-200"
                            >
                                Clear filters
                            </Button>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {!searchQuery && filteredQuizzes.length > 0 && (
                    <div className="mt-12">
                        <CustomPagination
                            currentPage={page}
                            totalPages={paginationMeta.totalPages}
                            onPageChange={(newPage) => setPage(newPage)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageTechnicalQuiz;
