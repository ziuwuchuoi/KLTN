import { Quiz } from "./hooks/useQuizQueries";
import { cn } from "@/components/utils/general.utils";
import QuizResult from "./QuizResult";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

type QuestionCardProps = {
    question: Quiz;
    questionNumber: number;
    onSelectOption: (questionNumber: number, selectedAnswer: number) => void;
    userAnswer?: number;
    showResults: boolean;
};

const QuestionCard = ({ question, questionNumber, onSelectOption, userAnswer, showResults }: QuestionCardProps) => {
    const handleSelectOption = (optionIndex: number) => {
        if (showResults) return; 
        onSelectOption(questionNumber, optionIndex);
    };

    const getOptionStyles = (index: number) => {
        if (showResults) {
            const isCorrect = index === question.correctAnswer;
            const isSelected = userAnswer === index;
            const isIncorrectSelection = isSelected && !isCorrect;

            return {
                container: cn(
                    "relative overflow-hidden group transition-all duration-200",
                    isCorrect && "bg-green-500/10 border-green-500",
                    isIncorrectSelection && "bg-red-500/10 border-red-500",
                    !isCorrect && !isSelected && "opacity-70"
                ),
                indicator: cn(
                    "text-sm font-medium border",
                    isCorrect && "border-green-500 bg-green-500/20 text-green-200",
                    isIncorrectSelection && "border-red-500 bg-red-500/20 text-red-200",
                    !isCorrect && !isSelected && "border-gray-400 text-gray-300"
                ),
            };
        }

        const isSelected = userAnswer === index;
        return {
            container: cn(
                "group transition-all duration-200 hover:translate-x-1",
                isSelected
                    ? "bg-accent text-slate-900 border-slate-900/20"
                    : "bg-transparent hover:text-slate-900 hover:bg-blue-100"
            ),
            indicator: cn(
                "text-sm font-medium border transition-colors duration-200",
                isSelected
                    ? "border-slate-900 bg-white/10 text-slate-900"
                    : "border-white group-hover:border-slate-900 group-hover:text-slate-900"
            ),
        };
    };

    return (
        <Card
            id={`question-${questionNumber}`}
            className="bg-gradient-to-b from-zinc-950 via-slate-900 to-gray-900 border-none text-white mb-8 scroll-mt-24 shadow-lg"
        >
            <CardHeader className="pb-2">
                <Badge variant="secondary" className="w-fit px-2 mb-2 text-sm font-normal">
                    Question {questionNumber}
                </Badge>
                <CardTitle className="text-xl font-medium leading-tight">{question.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
                {question.options.map((option, index) => {
                    const styles = getOptionStyles(index);

                    return (
                        <button
                            key={index}
                            onClick={() => handleSelectOption(index)}
                            disabled={showResults}
                            className={cn(
                                "w-full text-left p-4 rounded-lg border border-transparent",
                                styles.container
                            )}
                        >
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mr-3">
                                    <div
                                        className={cn(
                                            "w-7 h-7 rounded-full flex items-center justify-center",
                                            styles.indicator
                                        )}
                                    >
                                        {String.fromCharCode(65 + index)}
                                    </div>
                                </div>
                                <div className="pt-1">{option}</div>
                            </div>
                        </button>
                    );
                })}

                {showResults && userAnswer !== undefined && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-6"
                    >
                        <QuizResult question={question} selectedAnswer={userAnswer} showExplanation={true} />
                    </motion.div>
                )}
            </CardContent>
        </Card>
    );
};

export default QuestionCard;
