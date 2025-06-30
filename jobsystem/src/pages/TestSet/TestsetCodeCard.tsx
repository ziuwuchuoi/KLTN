"use client";

import { Badge } from "@/components/ui/badge";
import type { CodeProblem } from "@/services/code.service";
import { Code, Hash, Tag } from "lucide-react";

interface CodeItemCardProps {
    problem: Partial<CodeProblem>;
    index: number;
    onClick?: () => void;
    className?: string;
    showClickable?: boolean;
}

const TestsetCodeCard = ({ problem, index, onClick, className = "", showClickable = false }: CodeItemCardProps) => {
    const getDifficultyColor = (difficulty?: string) => {
        switch (difficulty) {
            case "Easy":
                return "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-300";
            case "Medium":
                return "from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-300";
            case "Hard":
                return "from-red-500/20 to-pink-500/20 border-red-500/30 text-red-300";
            default:
                return "from-slate-500/20 to-gray-500/20 border-slate-500/30 text-slate-300";
        }
    };

    const getDifficultyHoverColor = (difficulty?: string) => {
        switch (difficulty) {
            case "Easy":
                return "hover:from-green-800/20 hover:to-slate-800/80 hover:border-green-500/30 hover:shadow-green-500/10";
            case "Medium":
                return "hover:from-yellow-800/20 hover:to-slate-800/80 hover:border-yellow-500/30 hover:shadow-yellow-500/10";
            case "Hard":
                return "hover:from-red-800/20 hover:to-slate-800/80 hover:border-red-500/30 hover:shadow-red-500/10";
            default:
                return "hover:from-purple-800/20 hover:to-slate-800/80 hover:border-purple-500/30 hover:shadow-purple-500/10";
        }
    };

    return (
        <div
            className={`group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-sm transition-all duration-300 ${
                showClickable && onClick
                    ? `${getDifficultyHoverColor(problem.difficulty)} hover:shadow-lg cursor-pointer transform hover:scale-[1.02]`
                    : ""
            } ${className}`}
            onClick={onClick}
        >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Content */}
            <div className="relative p-4 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-purple-500/20 rounded-lg">
                            <Code className="h-4 w-4 text-purple-400" />
                        </div>
                        <span className="text-xs font-medium text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full">
                            Problem #{index + 1}
                        </span>
                    </div>
                    <Badge
                        className={`bg-gradient-to-r ${getDifficultyColor(problem.difficulty)} border text-xs font-semibold px-2 py-1`}
                    >
                        {problem.difficulty}
                    </Badge>
                </div>

                {/* Title */}
                <h4 className="font-semibold text-white text-sm leading-tight group-hover:text-purple-100 transition-colors line-clamp-2">
                    {problem.title}
                </h4>

                {/* Problem ID */}
                <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Hash className="h-3 w-3" />
                    <span>Problem {problem.problemId}</span>
                </div>

                {/* Topic Tags */}
                {problem.topicTags && problem.topicTags.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap">
                        <Tag className="h-3 w-3 text-slate-500" />
                        {problem.topicTags.slice(0, 2).map((tag, idx) => (
                            <Badge
                                key={idx}
                                variant="secondary"
                                className="bg-purple-500/10 text-purple-300 border-purple-500/20 text-xs px-2 py-0.5 font-medium"
                            >
                                {tag}
                            </Badge>
                        ))}
                        {problem.topicTags.length > 2 && (
                            <Badge variant="secondary" className="bg-slate-700/50 text-slate-400 text-xs px-2 py-0.5">
                                +{problem.topicTags.length - 2}
                            </Badge>
                        )}
                    </div>
                )}
            </div>

            {/* Hover indicator */}
            {showClickable && onClick && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                </div>
            )}
        </div>
    );
};

export default TestsetCodeCard;
