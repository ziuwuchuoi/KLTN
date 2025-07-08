"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Trash2 } from "lucide-react";
import CustomDialog from "@/components/molecules/CustomDialog";
import { useQuizQueries } from "@/pages/Quizz/hooks/useQuizQueries";
import type { QuizItem, Quiz } from "@/services/quiz.service";

interface DialogCreateQuizProps {
    isOpen: boolean;
    onClose: () => void;
}

const initialQuizData: Partial<QuizItem> = {
    title: "",
    categories: [],
    questions: [],
    duration: 30,
};

const initialQuestion: Quiz = {
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
};

export function DialogCreateQuiz({ isOpen, onClose }: DialogCreateQuizProps) {
    const [quizData, setQuizData] = useState<Partial<QuizItem>>(initialQuizData);
    const { createQuiz, technicalCategories } = useQuizQueries();

    useEffect(() => {
        if (isOpen) {
            setQuizData(initialQuizData);
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        try {
            await createQuiz.mutateAsync(quizData);
            onClose();
        } catch (error) {
            console.error("Failed to create quiz:", error);
        }
    };

    const addQuestion = () => {
        setQuizData((prev) => ({
            ...prev,
            questions: [...(prev.questions || []), { ...initialQuestion }],
        }));
    };

    const removeQuestion = (index: number) => {
        setQuizData((prev) => ({
            ...prev,
            questions: prev.questions?.filter((_, i) => i !== index) || [],
        }));
    };

    const updateQuestion = (index: number, field: keyof Quiz, value) => {
        setQuizData((prev) => ({
            ...prev,
            questions: prev.questions?.map((q, i) => (i === index ? { ...q, [field]: value } : q)) || [],
        }));
    };

    const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
        setQuizData((prev) => ({
            ...prev,
            questions:
                prev.questions?.map((q, i) =>
                    i === questionIndex
                        ? { ...q, options: q.options.map((opt, oi) => (oi === optionIndex ? value : opt)) }
                        : q
                ) || [],
        }));
    };

    const addCategory = (category: string) => {
        if (category && !quizData.categories?.includes(category)) {
            setQuizData((prev) => ({
                ...prev,
                categories: [...(prev.categories || []), category],
            }));
        }
    };

    const removeCategory = (category: string) => {
        setQuizData((prev) => ({
            ...prev,
            categories: prev.categories?.filter((c) => c !== category) || [],
        }));
    };

    return (
        <CustomDialog
            open={isOpen}
            onOpenChange={onClose}
            onClose={onClose}
            dialogTitle="Create New Quiz"
            description="Create a comprehensive quiz with multiple choice questions"
            className="bg-slate-900 border-slate-700 w-[90%] h-[90%]"
            childrenContainerClassName="p-0 flex flex-col"
        >
            <div className="flex flex-col h-full">
                <ScrollArea className="flex-1 p-6">
                    <div className="space-y-6">
                        {/* Basic Information */}
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardContent className="p-4 space-y-4">
                                <h3 className="text-lg font-semibold text-white">Basic Information</h3>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Quiz Title *</label>
                                    <Input
                                        value={quizData.title || ""}
                                        onChange={(e) => setQuizData((prev) => ({ ...prev, title: e.target.value }))}
                                        placeholder="Enter quiz title"
                                        className="bg-slate-700 border-slate-600 text-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Duration (minutes) *</label>
                                    <Input
                                        type="number"
                                        value={quizData.duration || 30}
                                        onChange={(e) =>
                                            setQuizData((prev) => ({
                                                ...prev,
                                                duration: Number.parseInt(e.target.value) || 30,
                                            }))
                                        }
                                        placeholder="30"
                                        className="bg-slate-700 border-slate-600 text-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Categories</label>
                                    <div className="flex gap-2">
                                        <Select onValueChange={addCategory}>
                                            <SelectTrigger className="text-white bg-slate-700 border-slate-600">
                                                <SelectValue placeholder="Add category" />
                                            </SelectTrigger>
                                            <SelectContent className="text-white bg-slate-800 border-slate-700">
                                                {technicalCategories?.map((category) => (
                                                    <SelectItem key={category.id} value={category.name}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {quizData.categories?.map((category) => (
                                            <div
                                                key={category}
                                                className="flex items-center gap-1 bg-blue-900/20 text-blue-400 px-2 py-1 rounded text-xs"
                                            >
                                                {category}
                                                <button onClick={() => removeCategory(category)}>
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Questions */}
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardContent className="p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-white">Questions</h3>
                                    <Button onClick={addQuestion} size="sm" className="bg-blue-600 hover:bg-blue-700">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Question
                                    </Button>
                                </div>

                                {quizData.questions?.map((question, questionIndex) => (
                                    <Card key={questionIndex} className="bg-slate-700/50 border-slate-600">
                                        <CardContent className="p-4 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium text-white">Question {questionIndex + 1}</h4>
                                                <Button
                                                    onClick={() => removeQuestion(questionIndex)}
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-300">Question *</label>
                                                <Textarea
                                                    value={question.question}
                                                    onChange={(e) =>
                                                        updateQuestion(questionIndex, "question", e.target.value)
                                                    }
                                                    placeholder="Enter your question"
                                                    className="bg-slate-600 border-slate-500 text-white"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-300">Options *</label>
                                                {question.options.map((option, optionIndex) => (
                                                    <div key={optionIndex} className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name={`correct-${questionIndex}`}
                                                            checked={question.correctAnswer === optionIndex}
                                                            onChange={() =>
                                                                updateQuestion(
                                                                    questionIndex,
                                                                    "correctAnswer",
                                                                    optionIndex
                                                                )
                                                            }
                                                            className="text-blue-600"
                                                        />
                                                        <Input
                                                            value={option}
                                                            onChange={(e) =>
                                                                updateOption(questionIndex, optionIndex, e.target.value)
                                                            }
                                                            placeholder={`Option ${optionIndex + 1}`}
                                                            className="bg-slate-600 border-slate-500 text-white"
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-300">
                                                    Explanation (Optional)
                                                </label>
                                                <Textarea
                                                    value={question.explanation || ""}
                                                    onChange={(e) =>
                                                        updateQuestion(questionIndex, "explanation", e.target.value)
                                                    }
                                                    placeholder="Explain why this is the correct answer"
                                                    className="bg-slate-600 border-slate-500 text-white"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}

                                {(!quizData.questions || quizData.questions.length === 0) && (
                                    <div className="text-center py-8 text-gray-400">
                                        <p className="mb-4">No questions added yet</p>
                                        <Button onClick={addQuestion} className="bg-blue-600 hover:bg-blue-700">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Your First Question
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </ScrollArea>

                {/* Footer */}
                <div className="pt-2">
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="text-white border-gray-600 hover:bg-gray-700"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={createQuiz.isPending || !quizData.title || !quizData.questions?.length}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {createQuiz.isPending ? "Creating..." : "Create Quiz"}
                        </Button>
                    </div>
                </div>
            </div>
        </CustomDialog>
    );
}
