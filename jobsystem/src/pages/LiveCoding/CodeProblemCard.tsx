"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, Users, Star, TrendingUp } from "lucide-react";
import { cn } from "@/components/utils/general.utils";
import type { CodeProblem } from "@/services/code.service";

interface CodeProblemCardProps {
    problem: CodeProblem;
    onClick: () => void;
    variant?: "default" | "suggested";
}

const difficultyConfig = {
    Easy: {
        color: "bg-green-600/20 text-green-300 border-green-500/30",
        icon: "🟢",
    },
    Medium: {
        color: "bg-yellow-600/20 text-yellow-300 border-yellow-500/30",
        icon: "🟡",
    },
    Hard: {
        color: "bg-red-600/20 text-red-300 border-red-500/30",
        icon: "🔴",
    },
};

export function CodeProblemCard({ problem, onClick, variant = "default" }: CodeProblemCardProps) {
    const difficultyStyle =
        difficultyConfig[problem.difficulty as keyof typeof difficultyConfig] || difficultyConfig.Easy;

    return (
        <Card
            className={cn(
                "group relative overflow-hidden bg-black/40 backdrop-blur-sm border border-zinc-800/50 transition-all duration-300 cursor-pointer hover:border-blue-400",
                variant === "suggested" && "hover:border-yellow-400"
            )}
            onClick={onClick}
        >
            <div
                className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity",
                    variant === "suggested" ? "from-yellow-600/20 to-orange-400/20" : "from-blue-600/20 to-blue-400/20"
                )}
            />

            <CardHeader className="relative pb-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <div
                                className={cn(
                                    "p-2 rounded-lg border",
                                    variant === "suggested"
                                        ? "bg-yellow-600/20 border-yellow-500/30"
                                        : "bg-blue-600/20 border-blue-500/30"
                                )}
                            >
                                {variant === "suggested" ? (
                                    <Star className="w-4 h-4 text-yellow-400" />
                                ) : (
                                    <Code className="w-4 h-4 text-blue-400" />
                                )}
                            </div>
                            <span className="text-sm text-gray-400">#{problem.problemId}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{problem.title}</h3>
                    </div>
                </div>

                {/* Difficulty and topicTags */}
                <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className={cn("text-xs", difficultyStyle.color)}>
                        <span className="mr-1">{difficultyStyle.icon}</span>
                        {problem.difficulty}
                    </Badge>

                    {problem.topicTags?.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-zinc-600 text-zinc-300">
                            {tag}
                        </Badge>
                    ))}

                    {problem.topicTags && problem.topicTags.length > 2 && (
                        <Badge variant="outline" className="text-xs border-zinc-600 text-zinc-400">
                            +{problem.topicTags.length - 2}
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="relative pt-0">
                {/* Problem Stats */}
                {/* <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                    <div className="flex items-center gap-4">
                        {problem.acceptanceRate && (
                            <div className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                <span>{problem.acceptanceRate}% accepted</span>
                            </div>
                        )}
                        {problem.submissions && (
                            <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                <span>{problem.submissions} submissions</span>
                            </div>
                        )}
                    </div>
                </div> */}

                {/* Action Button */}
                <Button
                    variant="secondary"
                    size="sm"
                    className={cn(
                        "w-full text-white",
                        variant === "suggested"
                            ? "bg-yellow-600/20 hover:bg-yellow-600/30 border-yellow-500/30"
                            : "bg-blue-600/20 hover:bg-blue-600/30 border-blue-500/30"
                    )}
                >
                    {variant === "suggested" ? "Try Suggested" : "Solve Problem"}
                </Button>
            </CardContent>
        </Card>
    );
}
