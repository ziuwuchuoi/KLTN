"use client";

import { Badge } from "@/components/ui/badge";
import type { QuizItem } from "@/services/quiz.service";
import { Clock, HelpCircle, Tag } from "lucide-react";

interface QuizItemCardProps {
    quiz: Partial<QuizItem>;
    index: number;
    onClick?: () => void;
    className?: string;
    showClickable?: boolean;
}

const TestsetQuizCard = ({ quiz, index, onClick, className = "", showClickable = false }: QuizItemCardProps) => {
    return (
        <div
            className={`group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-sm transition-all duration-300 ${
                showClickable && onClick
                    ? "hover:from-blue-800/20 hover:to-slate-800/80 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer transform hover:scale-[1.02]"
                    : ""
            } ${className}`}
            onClick={onClick}
        >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Content */}
            <div className="relative p-4 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-500/20 rounded-lg">
                            <HelpCircle className="h-4 w-4 text-blue-400" />
                        </div>
                        <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">
                            Quiz #{index + 1}
                        </span>
                    </div>
                </div>

                {/* Title */}
                <h4 className="font-semibold text-white text-sm leading-tight group-hover:text-blue-100 transition-colors line-clamp-2">
                    {quiz.title}
                </h4>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                        <HelpCircle className="h-3 w-3" />
                        <span>{quiz.questions?.length || 0} questions</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{quiz.duration || 0} min</span>
                    </div>
                </div>

                {/* Categories */}
                {quiz.categories && quiz.categories.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap">
                        <Tag className="h-3 w-3 text-slate-500" />
                        {quiz.categories.slice(0, 2).map((category, idx) => (
                            <Badge
                                key={idx}
                                variant="secondary"
                                className="bg-blue-500/10 text-blue-300 border-blue-500/20 text-xs px-2 py-0.5 font-medium"
                            >
                                {category}
                            </Badge>
                        ))}
                        {quiz.categories.length > 2 && (
                            <Badge variant="secondary" className="bg-slate-700/50 text-slate-400 text-xs px-2 py-0.5">
                                +{quiz.categories.length - 2}
                            </Badge>
                        )}
                    </div>
                )}
            </div>

            {/* Hover indicator */}
            {showClickable && onClick && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
            )}
        </div>
    );
};

export default TestsetQuizCard;
