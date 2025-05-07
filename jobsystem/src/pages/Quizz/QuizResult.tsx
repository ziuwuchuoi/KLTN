import { Quiz } from "./hooks/useQuizQueries";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, X } from "lucide-react";

type QuizResultProps = {
    question: Quiz;
    selectedAnswer: number;
    showExplanation: boolean;
};

const QuizResult = ({ question, selectedAnswer, showExplanation }: QuizResultProps) => {
    const isCorrect = selectedAnswer === question.correctAnswer;

    return (
        <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2">
                {isCorrect ? (
                    <div className="flex items-center text-green-500">
                        <Check className="w-5 h-5 mr-1" />
                        <span className="font-medium">Correct</span>
                    </div>
                ) : (
                    <div className="flex items-center text-red-500">
                        <X className="w-5 h-5 mr-1" />
                        <span className="font-medium">Incorrect</span>
                    </div>
                )}
            </div>

            {!isCorrect && (
                <div className="text-sm text-gray-300">
                    <span className="font-medium">Correct answer: </span>
                    {question.options[question.correctAnswer]}
                </div>
            )}

            {showExplanation && question.explanation && (
                <Alert variant="default" className="bg-quiz-card border-quiz-option">
                    <AlertDescription className="text-gray-300">
                        <span className="font-medium block mb-1">Explanation:</span>
                        {question.explanation}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
};

export default QuizResult;
