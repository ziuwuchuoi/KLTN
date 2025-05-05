import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { quizCategories } from "./documents";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CustomDialog from "@/components/molecules/CustomDialog";
import { TechnicalQuiz } from "./hooks/useQuizQueries";

export interface QuizItem {
    id: number;
    title: string;
    description?: string;
    icon?: React.ReactNode;
    additionalNote?: string;
    quizCount?: number;
    color?: string;
    borderColor?: string;
    route?: string;
    group?: string;
    categories?: string[];
    sourceUrl?: string;
    questions?: {
        question: string;
        options: string[];
        correctAnswer: number;
        explanation?: string;
    }[];
}

const QuizCategoriesList = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full max-w-8xl max-h-xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-3 md:grid-cols-3 gap-6">
                {quizCategories.map((item) => (
                    <QuizCard
                        key={item.id}
                        item={item}
                        onStartClick={() => navigate(item.route)}
                        requiredConfirm={false}
                    />
                ))}
            </div>
        </div>
    );
};

interface QuizCardProps {
    item: QuizItem;
    onStartClick: () => void;
    requiredConfirm?: boolean;
}

export const QuizCard = ({ item, onStartClick, requiredConfirm = true }: QuizCardProps) => {
    const [openConfirm, setOpenConfirm] = useState(false);

    const handleStart = () => {
        if (requiredConfirm) {
            setOpenConfirm(true);
        } else {
            onStartClick();
        }
    };

    const handleConfirm = () => {
        setOpenConfirm(false);
        onStartClick();
    };

    return (
        <Card
            key={item.id}
            className={`group relative overflow-hidden bg-black/40 backdrop-blur-sm border border-zinc-800/50 ${
                item.borderColor
            } transition-all duration-300`}
        >
            <div
                className={`absolute inset-0 bg-gradient-to-br ${
                    item.color
                } opacity-10 group-hover:opacity-20 transition-opacity`}
            />

            <div className="relative p-6 flex flex-col h-full">
                <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-black/30 border border-white/10">{item.icon}</div>
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                        <p className="text-gray-400 text-sm">{item.description}</p>
                    </div>
                </div>

                <div className="mt-auto flex items-center justify-between">
                    <span className="text-xs text-gray-500">{item.quizCount} quizzes available</span>
                    <Button
                        onClick={handleStart}
                        variant="secondary"
                        className="bg-black/50 text-white hover:bg-white/10 text-xs"
                    >
                        Start Quiz <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
            {requiredConfirm && (
                <CustomDialog
                    open={openConfirm}
                    onOpenChange={setOpenConfirm}
                    dialogTitle="Ready to start?"
                    className="max-w-md max-h-fit h-fit bg-gradient-to-b from-zinc-950 via-slate-900 to-gray-900 border border-zinc-800 text-white"
                >
                    <div className="space-y-3 mt-4 text-sm text-gray-300">
                        <p>
                            <strong>Quiz:</strong> {item.title}
                        </p>
                        <p>
                            <strong>Description:</strong> {item.description}
                        </p>
                        <p className="text-gray-400 text-xs">
                            Once you start, the timer begins and you can’t pause. Make sure you're ready.
                        </p>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setOpenConfirm(false)}>
                            Cancel
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-500 text-white" onClick={handleConfirm}>
                            Yes, Start
                        </Button>
                    </div>
                </CustomDialog>
            )}
        </Card>
    );
};

export default QuizCategoriesList;
