"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import type { QuizItem } from "@/services/quiz.service";

interface QuizContentProps {
    displayData: Partial<QuizItem>;
    isLoading: boolean;
}

export function QuizContent({ displayData, isLoading }: QuizContentProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center flex-1">
                <div className="text-gray-400">Loading quiz details...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <ScrollArea className="flex-1">
                <div className="space-y-6 p-6">
                    {displayData?.questions?.map((question, questionIndex) => (
                        <Card key={questionIndex} className="bg-slate-800/50 border-slate-700">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium flex-shrink-0">
                                            {questionIndex + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-white leading-relaxed">
                                                {question.question}
                                            </h4>
                                        </div>
                                    </div>

                                    <div className="ml-11 space-y-2">
                                        {question.options?.map((option, optionIndex) => (
                                            <div
                                                key={optionIndex}
                                                className={`flex items-center gap-3 p-3 rounded-lg border ${
                                                    question.correctAnswer === optionIndex
                                                        ? "bg-green-900/20 border-green-500/30"
                                                        : "bg-slate-700/30 border-slate-600"
                                                }`}
                                            >
                                                <div
                                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                                                        question.correctAnswer === optionIndex
                                                            ? "border-green-500 bg-green-500 text-white"
                                                            : "border-gray-500"
                                                    }`}
                                                >
                                                    {String.fromCharCode(65 + optionIndex)}
                                                </div>
                                                <span
                                                    className={
                                                        question.correctAnswer === optionIndex
                                                            ? "text-green-400"
                                                            : "text-gray-300"
                                                    }
                                                >
                                                    {option}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {question.explanation && (
                                        <div className="ml-11 mt-4">
                                            <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                                                <p className="text-sm text-blue-300">
                                                    <strong>Explanation:</strong> {question.explanation}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {(!displayData?.questions || displayData.questions.length === 0) && (
                        <div className="text-center py-12">
                            <p className="text-gray-400">No questions found in this quiz</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
