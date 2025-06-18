"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Save, X, Clock, HelpCircle } from "lucide-react";
import CustomDialog from "@/components/molecules/CustomDialog";
import { useQuizQueries } from "@/pages/Quizz/hooks/useQuizQueries";
import type { QuizItem } from "@/services/quiz.service";

interface DialogQuizProps {
    isOpen: boolean;
    onClose: () => void;
    quiz: Partial<QuizItem> | null;
}

export function DialogQuiz({ isOpen, onClose, quiz }: DialogQuizProps) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [editData, setEditData] = useState<Partial<QuizItem>>({});

    const { useQuizDetail, updateQuiz } = useQuizQueries();
    const { data: quizDetail, isLoading } = useQuizDetail(quiz?._id || "");

    useEffect(() => {
        if (isOpen && quizDetail) {
            setEditData(quizDetail);
            setIsEditMode(false);
        }
    }, [isOpen, quizDetail]);

    const handleEdit = () => {
        setIsEditMode(true);
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        if (quizDetail) {
            setEditData(quizDetail);
        }
    };

    const handleSave = async () => {
        if (!quiz?._id) return;

        try {
            await updateQuiz.mutateAsync({
                quizId: quiz._id,
                data: editData,
            });
            setIsEditMode(false);
        } catch (error) {
            console.error("Failed to update quiz:", error);
        }
    };

    if (!quiz) return null;

    return (
        <CustomDialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    setIsEditMode(false);
                    onClose();
                }
            }}
            onClose={() => {
                setIsEditMode(false);
                onClose();
            }}
            dialogTitle={
                <div className="flex items-center justify-between w-full">
                    {isEditMode ? (
                        "Edit Quiz"
                    ) : (
                        <div className="space-y-3">
                            <h2 className="text-2xl font-bold text-white leading-tight">
                                {quizDetail?.title || quiz.title}
                            </h2>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{quizDetail?.duration || quiz.duration} minutes</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <HelpCircle className="h-4 w-4" />
                                    <span>
                                        {quizDetail?.questions?.length || quiz.questions?.length || 0} questions
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {(quizDetail?.categories || quiz.categories)?.map((category, index) => (
                                    <Badge key={index} variant="secondary" className="bg-blue-900/20 text-blue-400">
                                        {category}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-2">
                        {!isEditMode ? (
                            <Button
                                variant="outline"
                                onClick={handleEdit}
                                className="border-gray-600 hover:bg-gray-700"
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Quiz
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={handleCancelEdit}
                                    className="border-gray-600 hover:bg-gray-700"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={updateQuiz.isPending}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {updateQuiz.isPending ? "Saving..." : "Save Changes"}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            }
            className="bg-slate-900 border-slate-700 w-[85%] h-[90%]"
            childrenContainerClassName="p-0 flex flex-col"
        >
            <div className="flex flex-col h-full">
                {isLoading ? (
                    <div className="flex items-center justify-center flex-1">
                        <div className="text-gray-400">Loading quiz details...</div>
                    </div>
                ) : (
                    <div className="flex flex-col h-full">
                        <ScrollArea className="flex-1">
                            <div className="space-y-6">
                                {(quizDetail?.questions || quiz.questions)?.map((question, index) => (
                                    <Card key={index} className="bg-slate-800/50 border-slate-700">
                                        <CardContent className="p-6">
                                            <div className="space-y-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                                                        {index + 1}
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
                                                                    ? "bg-green-900/20 border-green-500/30 text-green-400"
                                                                    : "bg-slate-700/30 border-slate-600 text-gray-300"
                                                            }`}
                                                        >
                                                            <div
                                                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                                                                    question.correctAnswer === optionIndex
                                                                        ? "border-green-500 bg-green-500 text-white"
                                                                        : "border-gray-500"
                                                                }`}
                                                            >
                                                                {String.fromCharCode(65 + optionIndex)}
                                                            </div>
                                                            <span>{option}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {question.explanation && (
                                                    <div className="ml-11 mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                                                        <p className="text-sm text-blue-300">
                                                            <strong>Explanation:</strong> {question.explanation}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}

                                {(!quizDetail?.questions || quizDetail.questions.length === 0) && (
                                    <div className="text-center py-12">
                                        <p className="text-gray-400">No questions found in this quiz</p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                )}
            </div>
        </CustomDialog>
    );
}
