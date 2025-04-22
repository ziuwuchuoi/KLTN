import React, { useMemo, useState } from "react";
import CustomHeader from "@/components/molecules/CustomHeader";
import CustomHeroSection from "@/components/molecules/CustomHeroSection";
import { personalityTopicItems } from "./documents";
import { TbSearch } from "react-icons/tb";
import { Input } from "@/components/ui/input";
import { QuizCard } from "./QuizCategory";

const PagePersonalityQuiz = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const searchResults = useMemo(() => {
        const search = searchQuery.trim().toLowerCase();
        if (!search) return personalityTopicItems;

        return personalityTopicItems.filter(
            (item) => item.title.toLowerCase().includes(search) || item.description.toLowerCase().includes(search)
        );
    }, [searchQuery]);

    return (
        <div className="flex flex-col w-full">
            <CustomHeader />

            <div className="flex flex-col scroll-auto min-h-screen bg-gradient-to-b from-zinc-950 via-slate-900 to-gray-900 px-6 text-white items-center justify-center pb-10">
                <div className="flex flex-row items-end w-full mt-40 mb-5 justify-around">
                    <CustomHeroSection title="Personal" subtitle="Center" align="left" />
                    <div className="relative w-full md:w-96">
                        <TbSearch className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input
                            type="text"
                            placeholder="Search all quizzes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-zinc-800/70 border-zinc-700 text-white w-full"
                        />
                        {searchQuery && searchResults.length > 0 && (
                            <div className="absolute z-50 mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl max-h-96 overflow-y-auto">
                                {searchResults.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => (window.location.href = item.route)}
                                        className="w-full px-4 py-3 text-left hover:bg-zinc-800/50 flex flex-col border-b border-zinc-800 last:border-none"
                                    >
                                        <span className="text-white font-medium">{item.title}</span>
                                        <span className="text-sm text-gray-500 mt-1 line-clamp-2">
                                            {item.description}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 w-full px-4 md:px-10 lg:px-20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {personalityTopicItems.map((item) => (
                            <QuizCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PagePersonalityQuiz;
