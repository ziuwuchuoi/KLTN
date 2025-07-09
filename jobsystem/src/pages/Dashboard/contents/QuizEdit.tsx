"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, X } from "lucide-react";
import type { QuizItem, Quiz } from "@/services/quiz.service";

interface QuizEditProps {
    editData: Partial<QuizItem>;
    onBasicInfoChange: (field: keyof QuizItem, value) => void;
    onQuestionChange: (questionIndex: number, field: keyof Quiz, value) => void;
    onOptionChange: (questionIndex: number, optionIndex: number, value: string) => void;
    onAddQuestion: () => void;
    onRemoveQuestion: (questionIndex: number) => void;
    onAddOption: (questionIndex: number) => void;
    onRemoveOption: (questionIndex: number, optionIndex: number) => void;
}

export function QuizEdit({
    editData,
    onBasicInfoChange,
    onQuestionChange,
    onOptionChange,
    onAddQuestion,
    onRemoveQuestion,
    onAddOption,
    onRemoveOption,
}: QuizEditProps) {
    return (
        <div className="flex flex-col h-full">
            <ScrollArea className="flex-1">
                <div className="space-y-6 p-6">
                    {editData.questions?.map((question, questionIndex) => (
                        <Card key={questionIndex} className="bg-slate-800/50 border-slate-700">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium flex-shrink-0">
                                            {questionIndex + 1}
                                        </div>
                                        <div className="flex-1">
                                            <Textarea
                                                value={question.question || ""}
                                                onChange={(e) =>
                                                    onQuestionChange(questionIndex, "question", e.target.value)
                                                }
                                                placeholder="Enter your question"
                                                className="bg-slate-700 border-slate-600 text-white resize-none"
                                                rows={2}
                                            />
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onRemoveQuestion(questionIndex)}
                                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
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
                                                            : "border-gray-500 text-white"
                                                    }`}
                                                >
                                                    {String.fromCharCode(65 + optionIndex)}
                                                </div>
                                                <div className="flex items-center gap-2 flex-1">
                                                    <Input
                                                        value={option || ""}
                                                        onChange={(e) =>
                                                            onOptionChange(questionIndex, optionIndex, e.target.value)
                                                        }
                                                        placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                                                        className="bg-slate-600 border-slate-500 text-white flex-1"
                                                    />
                                                    <Button
                                                        variant={
                                                            question.correctAnswer === optionIndex
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                        size="sm"
                                                        onClick={() =>
                                                            onQuestionChange(
                                                                questionIndex,
                                                                "correctAnswer",
                                                                optionIndex
                                                            )
                                                        }
                                                        className={
                                                            question.correctAnswer === optionIndex
                                                                ? "bg-green-600 hover:bg-green-700 text-white"
                                                                : "border-slate-500 hover:bg-slate-600 text-white"
                                                        }
                                                    >
                                                        {question.correctAnswer === optionIndex ? "✓" : "Set"}
                                                    </Button>
                                                    {question.options && question.options.length > 2 && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => onRemoveOption(questionIndex, optionIndex)}
                                                            className="text-red-400 hover:text-red-300"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onAddOption(questionIndex)}
                                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                                        >
                                            <Plus className="h-3 w-3 mr-1" />
                                            Add Option
                                        </Button>
                                    </div>

                                    <div className="ml-11 mt-4">
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400">Explanation (optional)</label>
                                            <Textarea
                                                value={question.explanation || ""}
                                                onChange={(e) =>
                                                    onQuestionChange(questionIndex, "explanation", e.target.value)
                                                }
                                                placeholder="Explain why this is the correct answer..."
                                                className="bg-slate-700 border-slate-600 text-white resize-none"
                                                rows={2}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <Card className="bg-slate-800/30 border-slate-600 border-dashed">
                        <CardContent className="p-6">
                            <Button
                                variant="outline"
                                onClick={onAddQuestion}
                                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add New Question
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </ScrollArea>
        </div>
    );
}
