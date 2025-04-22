import React from "react";
import CustomDialog from "@/components/molecules/CustomDialog";
import { TbSearch } from "react-icons/tb";
import { Input } from "@/components/ui/input";
import { QuizCard, QuizItem } from "../QuizCategory";

interface DialogQuizProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    dialogTitle?: string;
    searchValue: string;
    onSearchChange: (value: string) => void;
    filteredItems: QuizItem[];
}

const DialogQuiz: React.FC<DialogQuizProps> = ({
    open,
    onOpenChange,
    dialogTitle,
    searchValue,
    onSearchChange,
    filteredItems,
}) => {
    return (
        <CustomDialog
            open={open}
            onOpenChange={onOpenChange}
            dialogTitle={dialogTitle}
            className="lg:max-w-[60vw] 2xl:max-w-[65vw] lg:max-h-[80h] max-h-[90vh] bg-gradient-to-b from-zinc-950 via-slate-900 to-gray-900 border border-zinc-800 text-white"
        >
            <div className="mt-4 mb-6">
                <div className="relative">
                    <TbSearch className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                        type="text"
                        placeholder="Search quizzes..."
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 bg-zinc-800/70 border-zinc-700 text-white"
                    />
                </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredItems.length === 0 ? (
                        <p className="text-gray-400 col-span-2 text-center py-8">
                            No quizzes found matching your search.
                        </p>
                    ) : (
                        filteredItems.map((item) => <QuizCard key={item.id} item={item} />)
                    )}
                </div>
            </div>
        </CustomDialog>
    );
};

export default DialogQuiz;
