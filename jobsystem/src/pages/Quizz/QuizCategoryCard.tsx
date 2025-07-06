"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Clock, Zap } from "lucide-react";
import { cn } from "@/components/utils/general.utils";

export interface QuizCategoryItem {
    _id: number | string;
    title: string;
    description: string;
    icon: React.ReactNode;
    quizCount?: number;
    color: string;
    borderColor: string;
    route: string;
    gradient?: string;
    iconColor?: string;
    available?: boolean;
}

interface QuizCategoryCardProps {
    item: QuizCategoryItem;
    onStartClick: () => void;
    requiredConfirm?: boolean;
    color?: string;
    borderColor?: string;
    icon?: React.ReactNode;
}

export const QuizCategoryCard = ({
    item,
    onStartClick,
    requiredConfirm = false,
    color,
    borderColor,
    icon,
}: QuizCategoryCardProps) => {
    const [openConfirm, setOpenConfirm] = useState(false);

    // Check if this is available or coming soon
    const isComingSoon = item.available === false || item.title.toLowerCase().includes("coming soon");

    const handleStart = () => {
        if (isComingSoon) return;
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
                "relative overflow-hidden border transition-all duration-300",
                "w-100 h-full",
                cn(
                    `hover:scale-105 hover:shadow-2xl`,
                    `bg-gradient-to-br ${item.gradient || "from-slate-800/50 to-slate-900/50"}`,
                    isComingSoon ? "hover:shadow-amber-500/20" : "cursor-pointer hover:shadow-purple-500/20",
                    borderColor ?? item.borderColor
                )
            )}
            onClick={handleStart}
        >
            {/* Coming Soon Badge */}
            {isComingSoon && (
                <div className="absolute top-3 right-3 z-10">
                    <Badge className="bg-orange-600/20 text-orange-300 border-orange-500/30 text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        Coming Soon
                    </Badge>
                </div>
            )}

            <CardContent className="p-4 h-full flex flex-col relative z-10">
                {/* Header - Fixed height */}
                <div className="flex items-start gap-3 mb-3">
                    <div
                        className={cn(
                            "w-10 h-10 rounded-lg border flex items-center justify-center flex-shrink-0",
                            "transition-all duration-300",
                            isComingSoon
                                ? "bg-slate-700/50 border-slate-600/50 opacity-70"
                                : "bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50"
                        )}
                    >
                        <div
                            className={cn(
                                "w-5 h-5 flex items-center justify-center",
                                item.iconColor || "text-blue-400"
                            )}
                        >
                            {icon ?? item.icon}
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3
                            className={cn(
                                "text-lg font-semibold transition-colors line-clamp-1",
                                isComingSoon ? "text-slate-300" : "text-white"
                            )}
                        >
                            {item.title}
                        </h3>
                        <p
                            className={cn(
                                "text-sm leading-relaxed line-clamp-4 mt-1",
                                isComingSoon ? "text-slate-400" : "text-slate-300"
                            )}
                        >
                            {item.description}
                        </p>
                    </div>
                </div>

                {/* Quiz Count Badge - Fixed position */}
                {/* {!isComingSoon && item.quizCount && (
                    <div className="mb-3">
                        <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 text-xs">
                            <Zap className="w-3 h-3 mr-1" />
                            {item.quizCount} quizzes available
                        </Badge>
                    </div>
                )} */}

                {/* Spacer to push button to bottom */}
                <div className="flex-1"></div>

                {/* Action Section - Fixed at bottom */}
                <div className="mt-auto">
                    {!isComingSoon ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span>Ready to start</span>
                            </div>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleStart();
                                }}
                                size="sm"
                                className={cn(
                                    "h-8 px-4 bg-gradient-to-r font-semibold transition-all duration-300 hover:scale-105",
                                    item.color || "from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                )}
                            >
                                Start Quiz
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center py-2">
                            <span className="text-sm text-slate-400 italic">Feature in development</span>
                        </div>
                    )}
                </div>
            </CardContent>

            {/* Confirmation Modal Overlay */}
            {openConfirm && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-20 rounded-lg">
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-sm mx-4">
                        <h4 className="text-lg font-semibold text-white mb-2">Start Quiz?</h4>
                        <p className="text-slate-300 text-sm mb-4">
                            Are you ready to begin the {item.title} quiz? This will start your assessment.
                        </p>
                        <div className="flex gap-3">
                            <Button
                                onClick={handleConfirm}
                                size="sm"
                                className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                                Yes, Start
                            </Button>
                            <Button
                                onClick={() => setOpenConfirm(false)}
                                variant="outline"
                                size="sm"
                                className="flex-1 border-slate-600"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
};
