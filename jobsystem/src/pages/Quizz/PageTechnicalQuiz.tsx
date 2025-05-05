import React, { useMemo, useState } from "react";
import CustomHeader from "@/components/molecules/CustomHeader";
import CustomHeroSection from "@/components/molecules/CustomHeroSection";
import { TbSearch } from "react-icons/tb";
import { Input } from "@/components/ui/input";

import { useNavigate } from "react-router-dom";
import { useQuizQueries } from "./hooks/useQuizQueries";
import { QuizCategoryMenu } from "./QuizCategoryMenu";
import { QuizCard } from "./QuizCategory";

const PageTechnicalQuiz = () => {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [page, setPage] = useState(1);
    const limit = 20;

    const { technicalQuizzes, paginationMeta, isLoadingQuizzes, isErrorQuizzes } = useQuizQueries(
        selectedCategory,
        page,
        limit
    );

    // Example pagination controls
    const nextPage = () => setPage((prev) => Math.min(prev + 1, paginationMeta.totalPages));
    const prevPage = () => setPage((prev) => Math.max(prev - 1, 1));

    const [searchQuery, setSearchQuery] = useState("");
    const [searchDialogQuery, setSearchDialogQuery] = useState("");
    const [activeDialog, setActiveDialog] = useState(null);
    const navigate = useNavigate();

    const searchResults = useMemo(() => {
        const search = searchQuery.trim().toLowerCase();
        if (!search) return [];

        return technicalQuizzes.filter((item) => item.title.toLowerCase().includes(search));
    }, [searchQuery, technicalQuizzes]);

    console.log("technicalQuizzes", technicalQuizzes);

    return (
        <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-zinc-950 via-slate-900 to-gray-900 text-white">
            <CustomHeader />

            <div className="flex flex-col px-6">
                {/* Fixed Section */}
                <div className="flex flex-row items-end w-full mt-40 mb-5 justify-around">
                    <div className="flex flex-row justify-center items-center">
                        <div className="relative w-full md:w-96">
                            <TbSearch className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input
                                type="text"
                                placeholder="Search across all quizzes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-zinc-800/70 border-zinc-700 text-white w-full"
                            />
                        </div>

                        <QuizCategoryMenu className="ml-10" />
                    </div>

                    <CustomHeroSection title="Technical" subtitle="Center" align="right" />
                </div>

                <div>
                    {/* Your UI here */}
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {technicalQuizzes.map((item) => (
                            <QuizCard key={item.id} item={item} onStartClick={() => {}} />
                        ))}
                    </div>

                    {/* Pagination UI */}
                    <div className="flex justify-center gap-4 mt-4">
                        <button onClick={prevPage} disabled={page === 1}>
                            Previous
                        </button>
                        <span>
                            Page {paginationMeta.page} of {paginationMeta.totalPages}
                        </span>
                        <button onClick={nextPage} disabled={page === paginationMeta.totalPages}>
                            Next
                        </button>
                    </div>
                </div>

                {/* Scrollable or normal section */}
                {/* <div className="space-y-12 mt-8 w-full px-20">
                    {searchQuery && searchResults.length === 0 ? (
                        <div className="text-center text-white/50 text-lg py-10">No results found.</div>
                    ) : (
                        Object.entries(groupedQuizItems).map(([groupName, items]) => {
                            const filteredItems = searchQuery
                                ? searchResults.filter((item) => item.group === groupName)
                                : items;

                            if (filteredItems.length === 0) return null;

                            return (
                                <div key={groupName} className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <h2 className="text-xl font-bold text-white/90">
                                            {groupName}
                                            <span className="ml-2 text-sm font-normal text-gray-500">
                                                ({filteredItems.length})
                                            </span>
                                        </h2>
                                        <Button
                                            variant="ghost"
                                            className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/50"
                                            onClick={() => setActiveDialog(groupName)}
                                        >
                                            See all
                                        </Button>
                                    </div>

                                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {filteredItems.slice(0, 4).map((item) => (
                                            <QuizCard
                                                key={item.id}
                                                item={item}
                                                onStartClick={() => navigate(item.route)}
                                                requiredConfirm
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div> */}
            </div>

            {/* <QuizDialog
                open={!!activeDialog}
                onOpenChange={(open) => !open && setActiveDialog(null)}
                dialogTitle={activeDialog ?? ""}
                searchValue={searchDialogQuery}
                onSearchChange={setSearchDialogQuery}
                filteredItems={filteredDialogItems}
            /> */}
        </div>
    );
};

export default PageTechnicalQuiz;
