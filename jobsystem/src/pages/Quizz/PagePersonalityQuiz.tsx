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
        <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-zinc-950 via-slate-900 to-gray-900 text-white">
            <CustomHeader />

            <div className="flex flex-col px-6">
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
                    </div>
                </div>

                <div className="space-y-12 mt-8 w-full px-20">
                    {searchQuery && searchResults.length === 0 ? (
                        <div className="text-center text-white/50 text-lg py-10">No results found.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {searchResults.map((item) => (
                                            <QuizCard key={item.id} item={item} onStartClick={() => {}} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PagePersonalityQuiz;
