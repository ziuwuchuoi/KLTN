import { cn } from "@/components/utils/general.utils";

type QuizNavigationProps = {
    questionsCount: number;
    answeredQuestions: number[];
    onQuestionClick: (questionId: number) => void;
    currentQuestionId: number;
};

const QuizNavigation = ({ questionsCount, answeredQuestions, onQuestionClick, currentQuestionId }: QuizNavigationProps) => {
    const isAnswered = (questionId: number) => {
        return answeredQuestions.includes(questionId);
    };

    return (
        <div className="bg-quiz-card p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Questions</h2>
            <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: questionsCount }).map((_, index) => {
                    const questionId = index + 1;
                    return (
                        <button
                            key={questionId}
                            onClick={() => onQuestionClick(questionId)}
                            className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                                isAnswered(questionId)
                                    ? "bg-quiz-option-selected text-white"
                                    : "bg-quiz-option text-gray-300 hover:bg-quiz-option-hover",
                                currentQuestionId === questionId && !isAnswered(questionId) ? "ring-2 ring-white" : ""
                            )}
                            aria-label={`Go to question ${questionId}`}
                        >
                            {questionId}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default QuizNavigation;
