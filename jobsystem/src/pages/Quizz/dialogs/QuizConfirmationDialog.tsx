import React from "react";
import CustomDialog from "@/components/molecules/CustomDialog";
import { Button } from "@/components/ui/button";

interface QuizConfirmationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    quizInfo: {
        title: string;
        totalQuestions: number;
        timeLimit: number; // in minutes
    };
    onConfirm: () => void;
}

const QuizConfirmationDialog: React.FC<QuizConfirmationDialogProps> = ({ open, onOpenChange, quizInfo, onConfirm }) => {
    return (
        <CustomDialog
            open={open}
            onOpenChange={onOpenChange}
            dialogTitle="Ready to start?"
            className="max-w-md bg-gradient-to-b from-zinc-950 via-slate-900 to-gray-900 border border-zinc-800 text-white"
        >
            <div className="space-y-3 mt-4 text-sm text-gray-300">
                <p>
                    <strong>Title:</strong> {quizInfo.title}
                </p>
                <p>
                    <strong>Total Questions:</strong> {quizInfo.totalQuestions}
                </p>
                <p>
                    <strong>Time Limit:</strong> {quizInfo.timeLimit} minutes
                </p>
                <p className="text-gray-400 text-xs">
                    Make sure you’re ready. The timer will start once you begin the quiz.
                </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => onOpenChange(false)}>
                    Cancel
                </Button>
                <Button
                    className="bg-indigo-600 hover:bg-indigo-500 text-white"
                    onClick={() => {
                        onOpenChange(false);
                        onConfirm();
                    }}
                >
                    Yes, Start Quiz
                </Button>
            </div>
        </CustomDialog>
    );
};

export default QuizConfirmationDialog;
