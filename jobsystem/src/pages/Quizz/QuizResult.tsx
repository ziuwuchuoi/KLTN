import { Quiz } from "@/services/quiz.service";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, X } from "lucide-react";
import { cn } from "@/components/utils/general.utils";

type QuizResultProps = {
    question: Quiz;
    selectedAnswer: number;
    correctAnswer?: number;
    showExplanation?: boolean;
    explanation?: string;
};

const QuizResult = ({
    question,
    selectedAnswer,
    correctAnswer,
    showExplanation = true,
    explanation,
}: QuizResultProps) => {
    const isCorrect = selectedAnswer === (correctAnswer ?? question.correctAnswer);
    const correctAnswerText = question.options[correctAnswer ?? question.correctAnswer];

    return (
        <div className="mt-4 space-y-3">
            <div className={cn("flex items-center gap-2", isCorrect ? "text-green-500" : "text-red-500")}>
                {isCorrect ? (
                    <>
                        <Check className="w-5 h-5 mr-1" />
                        <span className="font-medium">Correct</span>
                    </>
                ) : (
                    <>
                        <X className="w-5 h-5 mr-1" />
                        <span className="font-medium">Incorrect</span>
                    </>
                )}
            </div>

            {!isCorrect && (
                <div className="text-sm text-gray-300">
                    <span className="font-medium">Correct answer: </span>
                    {correctAnswerText}
                </div>
            )}

            {showExplanation && (explanation && explanation != "No explanation provided") && (
                <Alert variant="default" className="bg-quiz-card border-quiz-option">
                    <AlertDescription className="text-gray-300">
                        <span className="font-medium block mb-1">Explanation:</span>
                        {explanation}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
};

export default QuizResult;
