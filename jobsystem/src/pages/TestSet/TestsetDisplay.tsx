"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Code } from "lucide-react";
import { QuizItem } from "@/services/quiz.service";
import { CodeProblem } from "@/services/code.service";
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

    const containerClass = layout === "grid" ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : "space-y-6";

    return (
        <div className={`${containerClass} ${className}`}>
            {/* Quiz Problems */}
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-blue-400" />
                        Quiz Problems
                        <Badge variant="secondary" className="bg-blue-900/20 text-blue-400">
                            {totalQuizzes}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {totalQuizzes > 0 ? (
                        <div className="space-y-3">
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
                        <div className="text-center py-4 text-gray-400">
                            <HelpCircle className="h-8 w-8 mx-auto mb-2 text-gray-500" />
                            <p className="text-sm">No quiz problems</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Code Problems */}
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Code className="h-5 w-5 text-purple-400" />
                        Code Problems
                        <Badge variant="secondary" className="bg-purple-900/20 text-purple-400">
                            {totalProblems}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {totalProblems > 0 ? (
                        <div className="space-y-3">
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
                        <div className="text-center py-4 text-gray-400">
                            <Code className="h-8 w-8 mx-auto mb-2 text-gray-500" />
                            <p className="text-sm">No code problems</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default TestSetItemsDisplay;
