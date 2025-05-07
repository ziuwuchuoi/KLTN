import { useMemo, useState } from "react";
import CustomHeroSection from "@/components/molecules/CustomHeroSection";
import { TbSearch } from "react-icons/tb";
import { Input } from "@/components/ui/input";

import { useNavigate } from "react-router-dom";
import { TechnicalQuiz, useQuizQueries } from "./hooks/useQuizQueries";
import { QuizCategoryMenu } from "./QuizCategoryMenu";
import { QuizCard } from "./QuizCategory";

import { CustomPagination } from "@/components/molecules/CustomPagination";

const PageTechnicalQuiz = () => {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [page, setPage] = useState(1);
    const limit = 20;
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const { technicalQuizzes, paginationMeta } = useQuizQueries(selectedCategory, page, limit);

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
        console.log("quiz", quiz);
        navigate(`/quiz/technical/${quiz._id}`, { state: { quiz } });
    };

    return (
        <>
            <div className="flex flex-col px-6 w-full">
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

                        <QuizCategoryMenu
                            className="md:ml-8 w-full md:w-auto"
                            onSelectCategory={(id) => setSelectedCategory(id.toString())}
                        />

                        {/* Selected Category Display */}
                        {selectedCategory && (
                            <div className="ml-10 text-lg font-medium text-blue-400">
                                <span>Selected Category: </span>
                                <span className="text-white">{selectedCategory}</span>
                            </div>
                        )}
                    </div>

                    <CustomHeroSection title="Technical" subtitle="Center" align="right" />
                </div>

                <div>
                    {/* Quiz Grid */}
                    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredQuizzes.map((item) => (
                            <QuizCard key={item.id} item={item} onStartClick={() => handleQuizClick(item)} />
                        ))}

                        {searchQuery && filteredQuizzes.length === 0 && (
                            <div className="text-white/50 col-span-full text-center text-lg py-10">
                                No results found.
                            </div>
                        )}
                    </div>

                    {/* Pagination (only show when not searching) */}
                    {!searchQuery && (
                        <CustomPagination
                            currentPage={page}
                            totalPages={paginationMeta.totalPages}
                            onPageChange={(newPage) => setPage(newPage)}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default PageTechnicalQuiz;
