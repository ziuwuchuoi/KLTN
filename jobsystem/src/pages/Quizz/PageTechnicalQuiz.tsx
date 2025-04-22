import React, { useMemo, useState } from "react";
import CustomHeader from "@/components/molecules/CustomHeader";
import CustomHeroSection from "@/components/molecules/CustomHeroSection";
import { technicalTopicItems } from "./documents";
import { TbSearch } from "react-icons/tb";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QuizCard, QuizItem } from "./QuizCategory";
import DialogQuiz from "./dialogs/DialogQuiz";

const PageTechnicalQuiz = () => {
    const [searchQuery, setSearchQuery] = useState(""); // search all the items
    const [searchDialogQuery, setSearchDialogQuery] = useState(""); // search inside dialog
    const [activeDialog, setActiveDialog] = useState(null);

    const groupedQuizItems = useMemo(() => {
        return technicalTopicItems.reduce<Record<string, QuizItem[]>>((grouped, item) => {
            const group = item.group;
            if (!grouped[group]) {
                grouped[group] = [];
            }
            grouped[group].push(item);
            return grouped;
        }, {});
    }, []);

    const searchResults = useMemo(() => {
        const search = searchQuery.trim().toLowerCase();
        if (!search) return [];

        return technicalTopicItems.filter(
            (item) =>
                item.title.toLowerCase().includes(search) ||
                item.description.toLowerCase().includes(search) ||
                item.group.toLowerCase().includes(search)
        );
    }, [searchQuery]);

    const filteredDialogItems = useMemo(() => {
        if (!activeDialog) return [];

        const items = groupedQuizItems[activeDialog] || [];
        const search = searchDialogQuery.trim().toLowerCase();

        if (!search) return items;

        return items.filter(
            (item) => item.title.toLowerCase().includes(search) || item.description.toLowerCase().includes(search)
        );
    }, [activeDialog, searchDialogQuery, groupedQuizItems]);

    return (
        <div className="flex flex-col w-full">
            <CustomHeader />

            <div className="flex flex-col scroll-auto min-h-screen bg-gradient-to-b from-zinc-950 via-slate-900 to-gray-900 px-6 text-white items-center justify-center pb-10 border border-green-400">
                <div className="flex flex-row items-end w-full mt-40 mb-5 justify-around">
                    <CustomHeroSection title="Technical" subtitle="Center" align="left" />
                    <div className="relative w-full md:w-96">
                        <TbSearch className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input
                            type="text"
                            placeholder="Search across all quizzes..."
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
                                        <span className="text-xs text-gray-400">{item.group}</span>
                                        <span className="text-sm text-gray-500 mt-1 line-clamp-2">
                                            {item.description}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="space-y-12 mt-8 border border-red-500 w-full px-20">
                    {Object.entries(groupedQuizItems).map(([groupName, items]) => (
                        <div key={groupName} className="space-y-4">
                            <div className="flex justify-between items-end">
                                <h2 className="text-xl font-bold text-white/90">
                                    {groupName}
                                    <span className="ml-2 text-sm font-normal text-gray-500">({items.length})</span>
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
                                {items.slice(0, 4).map((item) => (
                                    <QuizCard key={item.id} item={item} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                {/* The list of quiz*/}
                <DialogQuiz
                    open={!!activeDialog}
                    onOpenChange={(open) => !open && setActiveDialog(null)}
                    dialogTitle={activeDialog ?? ""}
                    searchValue={searchDialogQuery}
                    onSearchChange={setSearchDialogQuery}
                    filteredItems={filteredDialogItems}
                />
            </div>
        </div>
    );
};

export default PageTechnicalQuiz;
