"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Code } from "lucide-react";
import type { QuizItem } from "@/services/quiz.service";
import type { CodeProblem } from "@/services/code.service";
import TestsetQuizCard from "./TestsetQuizCard";
import TestsetCodeCard from "./TestsetCodeCard";

interface TestSetItemsDisplayProps {
    quizzes?: Partial<QuizItem>[];
    problems?: Partial<CodeProblem>[];
    onQuizClick?: (quiz: Partial<QuizItem>, index: number) => void;
    onCodeClick?: (problem: Partial<CodeProblem>, index: number) => void;
    showClickable?: boolean;
    layout?: "grid" | "list";
    className?: string;
}

const TestSetItemsDisplay = ({
    quizzes = [],
    problems = [],
    onQuizClick,
    onCodeClick,
    showClickable = false,
    layout = "grid",
    className = "",
}: TestSetItemsDisplayProps) => {
    const totalQuizzes = quizzes.length;
    const totalProblems = problems.length;

    const containerClass = layout === "grid" ? "grid grid-cols-1 gap-8" : "space-y-8";

    return (
        <div className={`${containerClass} ${className}`}>
            {/* Quiz Problems */}
            <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-white">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <HelpCircle className="h-5 w-5 text-blue-400" />
                        </div>
                        Quiz Problems
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 ml-auto">
                            {totalQuizzes}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {totalQuizzes > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {quizzes.map((quiz, index) => (
                                <TestsetQuizCard
                                    key={quiz._id || index}
                                    quiz={quiz}
                                    index={index}
                                    onClick={onQuizClick ? () => onQuizClick(quiz, index) : undefined}
                                    showClickable={showClickable}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <HelpCircle className="h-8 w-8 text-blue-400/50" />
                            </div>
                            <p className="text-sm font-medium">No quiz problems available</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Code Problems */}
            <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-white">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Code className="h-5 w-5 text-purple-400" />
                        </div>
                        Code Problems
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 ml-auto">
                            {totalProblems}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {totalProblems > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {problems.map((problem, index) => (
                                <TestsetCodeCard
                                    key={problem._id || index}
                                    problem={problem}
                                    index={index}
                                    onClick={onCodeClick ? () => onCodeClick(problem, index) : undefined}
                                    showClickable={showClickable}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Code className="h-8 w-8 text-purple-400/50" />
                            </div>
                            <p className="text-sm font-medium">No code problems available</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default TestSetItemsDisplay;
