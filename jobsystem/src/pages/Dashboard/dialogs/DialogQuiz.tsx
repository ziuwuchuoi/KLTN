"use client";

import { useState, useEffect } from "react";
import CustomDialog from "@/components/molecules/CustomDialog";
import { useQuizQueries } from "@/pages/Quizz/hooks/useQuizQueries";
import type { QuizItem, Quiz } from "@/services/quiz.service";
import { QuizEdit } from "../contents/QuizEdit";
import { QuizContent } from "../contents/QuizContent";
import { QuizHeader } from "../contents/QuizHeader";


interface DialogQuizProps {
    isOpen: boolean;
    onClose: () => void;
    quiz: Partial<QuizItem> | null;
    onUpdate?: (updatedQuiz: QuizItem) => void;
}

export function DialogQuiz({ isOpen, onClose, quiz, onUpdate }: DialogQuizProps) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [editData, setEditData] = useState<Partial<QuizItem>>({});

    const { useQuizDetail, updateQuiz } = useQuizQueries();
    const { data: quizDetail, isLoading } = useQuizDetail(quiz?._id || "");

    useEffect(() => {
        if (isOpen && quizDetail) {
            setEditData({
                ...quizDetail,
                questions: quizDetail.questions?.map((q) => ({ ...q })) || [],
            });
            setIsEditMode(false);
        }
    }, [isOpen, quizDetail]);

    const handleEdit = () => {
        setIsEditMode(true);
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        if (quizDetail) {
            setEditData({
                ...quizDetail,
                questions: quizDetail.questions?.map((q) => ({ ...q })) || [],
            });
        }
    };

    // Enhanced validation function
    const validateQuizData = (data: Partial<QuizItem>): { isValid: boolean; errors: string[] } => {
        const errors: string[] = [];

        // Check required fields
        if (!data.title?.trim()) {
            errors.push("Title is required");
        }

        if (!data.duration || data.duration <= 0) {
            errors.push("Duration must be greater than 0");
        }

        if (!data.categories || data.categories.length === 0) {
            errors.push("At least one category is required");
        }

        if (!data.questions || data.questions.length === 0) {
            errors.push("At least one question is required");
        }

        // Validate questions
        data.questions?.forEach((question, index) => {
            if (!question.question?.trim()) {
                errors.push(`Question ${index + 1}: Question text is required`);
            }

            if (!question.options || question.options.length < 2) {
                errors.push(`Question ${index + 1}: At least 2 options are required`);
            }

            // Check if all options have content
            question.options?.forEach((option, optIndex) => {
                if (!option?.trim()) {
                    errors.push(`Question ${index + 1}, Option ${optIndex + 1}: Option text is required`);
                }
            });

            // Validate correct answer index
            if (
                question.correctAnswer === undefined ||
                question.correctAnswer < 0 ||
                question.correctAnswer >= (question.options?.length || 0)
            ) {
                errors.push(`Question ${index + 1}: Invalid correct answer selection`);
            }
        });

        return {
            isValid: errors.length === 0,
            errors,
        };
    };

    // Enhanced save function with validation and data cleaning
    const handleSave = async () => {
        if (!quiz?._id) return;

        try {
            // Clean and prepare data
            const cleanedData: Partial<QuizItem> = {
                title: editData.title?.trim(),
                duration: Number(editData.duration),
                categories: editData.categories?.filter((cat) => cat.trim()).map((cat) => cat.trim()) || [],
                questions: editData.questions
                    ?.filter((q) => q.question?.trim()) // Remove empty questions
                    .map((question) => ({
                        question: question.question?.trim() || "",
                        options: question.options?.filter((opt) => opt?.trim()).map((opt) => opt.trim()) || [],
                        correctAnswer: Number(question.correctAnswer) || 0,
                        explanation: question.explanation?.trim() || "",
                    })),
            };

            // Validate data
            const validation = validateQuizData(cleanedData);
            if (!validation.isValid) {
                console.error("Validation errors:", validation.errors);
                alert(`Please fix the following errors:\n${validation.errors.join("\n")}`);
                return;
            }

            console.log("Sending cleaned data:", cleanedData);

            await updateQuiz.mutateAsync({
                quizId: quiz._id,
                data: cleanedData,
            });

            setIsEditMode(false);
        } catch (error) {
            console.error("Failed to update quiz:", error);
            // More detailed error logging
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
            }
        }
    };

    const handleBasicInfoChange = (field: keyof QuizItem, value) => {
        setEditData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleQuestionChange = (questionIndex: number, field: keyof Quiz, value) => {
        setEditData((prev) => ({
            ...prev,
            questions:
                prev.questions?.map((q, index) => (index === questionIndex ? { ...q, [field]: value } : q)) || [],
        }));
    };

    const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
        setEditData((prev) => ({
            ...prev,
            questions:
                prev.questions?.map((q, qIndex) =>
                    qIndex === questionIndex
                        ? {
                              ...q,
                              options: q.options?.map((opt, oIndex) => (oIndex === optionIndex ? value : opt)) || [],
                          }
                        : q
                ) || [],
        }));
    };

    const addQuestion = () => {
        const newQuestion: Quiz = {
            question: "",
            options: ["", "", "", ""],
            correctAnswer: 0,
            explanation: "",
        };

        setEditData((prev) => ({
            ...prev,
            questions: [...(prev.questions || []), newQuestion],
        }));
    };

    const removeQuestion = (questionIndex: number) => {
        setEditData((prev) => ({
            ...prev,
            questions: prev.questions?.filter((_, index) => index !== questionIndex) || [],
        }));
    };

    const addOption = (questionIndex: number) => {
        setEditData((prev) => ({
            ...prev,
            questions:
                prev.questions?.map((q, index) =>
                    index === questionIndex
                        ? {
                              ...q,
                              options: [...(q.options || []), ""],
                          }
                        : q
                ) || [],
        }));
    };

    const removeOption = (questionIndex: number, optionIndex: number) => {
        setEditData((prev) => ({
            ...prev,
            questions:
                prev.questions?.map((q, qIndex) =>
                    qIndex === questionIndex
                        ? {
                              ...q,
                              options: q.options?.filter((_, oIndex) => oIndex !== optionIndex) || [],
                              correctAnswer:
                                  q.correctAnswer >= optionIndex && q.correctAnswer > 0
                                      ? q.correctAnswer - 1
                                      : q.correctAnswer,
                          }
                        : q
                ) || [],
        }));
    };

    if (!quiz) return null;

    const displayData = isEditMode ? editData : quizDetail || quiz;

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
                <QuizHeader
                    isEditMode={isEditMode}
                    editData={editData}
                    displayData={displayData}
                    onEdit={handleEdit}
                    onCancelEdit={handleCancelEdit}
                    onSave={handleSave}
                    onBasicInfoChange={handleBasicInfoChange}
                    isSaving={updateQuiz.isPending}
                />
            }
            className="bg-slate-900 border-slate-700 w-full h-[90%]"
            childrenContainerClassName="p-0 flex flex-col"
        >
            <div className="flex flex-col h-full">
                {isEditMode ? (
                    <QuizEdit
                        editData={editData}
                        onBasicInfoChange={handleBasicInfoChange}
                        onQuestionChange={handleQuestionChange}
                        onOptionChange={handleOptionChange}
                        onAddQuestion={addQuestion}
                        onRemoveQuestion={removeQuestion}
                        onAddOption={addOption}
                        onRemoveOption={removeOption}
                    />
                ) : (
                    <QuizContent displayData={displayData} isLoading={isLoading} />
                )}
            </div>
        </CustomDialog>
    );
}
