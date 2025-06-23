"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, Clock, BookOpen } from "lucide-react";
import { cn } from "@/components/utils/general.utils";
import CustomDialog from "@/components/molecules/CustomDialog";
import { QuizItem } from "@/services/quiz.service";

interface QuizItemCardProps {
    item: Partial<QuizItem>;
    onStartClick: () => void;
    requiredConfirm?: boolean;
    color?: string;
    borderColor?: string;
    icon?: React.ReactNode;
}

export const QuizItemCard = ({
    item,
    onStartClick,
    requiredConfirm = true,
    color,
    borderColor,
    icon,
}: QuizItemCardProps) => {
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
            className={cn(
                "group relative overflow-hidden bg-black/40 backdrop-blur-sm border border-zinc-800/50 transition-all duration-300 cursor-pointer",
                borderColor ?? "hover:border-blue-400"
            )}
        >
            <div
                className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity",
                    color ?? "from-blue-600/20 to-blue-400/20"
                )}
            />

            <div className="relative px-6 pt-4 pb-3 flex flex-col h-full">
                <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-black/30 border border-white/10">
                        {icon ?? <BookOpen className="w-5 h-5 text-blue-400" />}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                        <div className="flex flex-wrap gap-1 mb-2">
                            {item.categories.slice(0, 3).map((category, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 text-xs bg-blue-600/20 text-blue-300 rounded-md border border-blue-500/30"
                                >
                                    {category}
                                </span>
                            ))}
                            {item.categories.length > 3 && (
                                <span className="px-2 py-1 text-xs bg-gray-600/20 text-gray-400 rounded-md">
                                    +{item.categories.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-row mt-auto justify-between items-center">
                    {/* Quiz Stats */}
                    <div className="flex space-x-3 items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                            <BookOpen className="text-gray-50 w-3 h-3" />
                            <span>{item.questions.length} questions</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="text-gray-50 w-3 h-3" />
                            <span>{item.duration} min</span>
                        </div>
                    </div>

                    {/* Start Button */}
                    <Button
                        onClick={handleStart}
                        variant="secondary"
                        className="w-fit bg-black/50 text-white hover:bg-white/10 text-xs"
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
                            <strong>Questions:</strong> {item.questions.length}
                        </p>
                        <p>
                            <strong>Duration:</strong> {item.duration} minutes
                        </p>
                        <p>
                            <strong>Categories:</strong> {item.categories.join(", ")}
                        </p>
                        <p className="text-gray-400 text-xs">
                            Once you start, the timer begins and you can't pause. Make sure you're ready.
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
