import { cn } from "@/components/utils/general.utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type QuizNavigationProps = {
    questionsCount: number;
    answeredQuestions: number[];
    onQuestionClick: (questionId: number) => void;
    currentQuestionId: number;
};

const QuizNavigation = ({
    questionsCount,
    answeredQuestions,
    onQuestionClick,
    currentQuestionId,
}: QuizNavigationProps) => {
    const isAnswered = (questionId: number) => {
        return answeredQuestions.includes(questionId);
    };

    return (
        <Card className="bg-gradient-to-b from-zinc-950 via-slate-900 to-gray-900 border-none text-white">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">Questions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: questionsCount }).map((_, index) => {
                        const questionId = index + 1;
                        return (
                            <Button
                                key={questionId}
                                onClick={() => onQuestionClick(questionId)}
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "rounded-full w-10 h-10 font-medium transition-colors",
                                    isAnswered(questionId)
                                        ? "bg-blue-600 text-white hover:bg-blue-200"
                                        : "bg-accent/10 text-white hover:bg-white hover:text-black",
                                    currentQuestionId === questionId && !isAnswered(questionId) && "ring-2 ring-white"
                                )}
                                aria-label={`Go to question ${questionId}`}
                            >
                                {questionId}
                            </Button>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};

export default QuizNavigation;
