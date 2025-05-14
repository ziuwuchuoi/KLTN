import { useState, useRef, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import QuizNavigation from "./QuizNavigation";
import QuestionCard from "./QuestionCard";
import { Button } from "@/components/ui/button";
import { useQuizQueries } from "./hooks/useQuizQueries";
import { cn } from "@/components/utils/general.utils";

const PageQuizDetail = () => {
    const { quizId } = useParams();
    const { useQuizDetail, submitQuiz } = useQuizQueries();
    const { data: quiz } = useQuizDetail(quizId);

    const location = useLocation();
    const [startTime] = useState(location.state.startTime);
    const [duration, setDuration] = useState(0); 

    const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
    const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
    const [currentQuestionId, setCurrentQuestionId] = useState<number>(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const questionsContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const diff = Math.floor((Date.now() - new Date(startTime).getTime()) / 1000);
            setDuration(diff);
        }, 1000);
    
        return () => clearInterval(interval);
    }, [startTime]);

    const handleSelectOption = (questionNumber: number, selectedAnswer: number) => {
        setUserAnswers((prev) => ({
            ...prev,
            [questionNumber]: selectedAnswer,
        }));

        if (!answeredQuestions.includes(questionNumber)) {
            setAnsweredQuestions((prev) => [...prev, questionNumber]);
        }
    };

    const handleSubmitQuiz = async () => {
        if (answeredQuestions.length < quiz.questions.length) {
            return;
        }

        const formattedAnswers = quiz.questions.map((_, index) => ({
            qIndex: index,
            chosenOption: userAnswers[index + 1],
        }));

        try {
            await submitQuiz.mutateAsync({
                quizId: quiz._id,
                answers: formattedAnswers,
                startTime: startTime,
            });

            setIsSubmitted(true);
        } catch (error) {
            console.error("Submit quiz failed:", error);
        }
    };

    const handleQuestionClick = (questionId: number) => {
        setCurrentQuestionId(questionId);
        scrollToQuestion(questionId);
    };

    const scrollToQuestion = (questionId: number) => {
        const questionElement = document.getElementById(`question-${questionId}`);
        if (questionElement) {
            questionElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    if (!quiz) {
        return (
            <div className="text-white text-center py-20">
                <p>Quiz not found. Please go back and select a quiz.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col p-6 w-full">
            {/* Fixed Section */}
            <div className="flex flex-row items-end w-full mt-40 mb-5 justify-around">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Sidebar with question navigation */}
                    <div className="md:col-span-1">
                        <div className="sticky top-8">
                            <QuizNavigation
                                questionsCount={quiz.questions.length}
                                answeredQuestions={answeredQuestions}
                                onQuestionClick={handleQuestionClick}
                                currentQuestionId={currentQuestionId}
                            />

                            {/* Quiz progress */}
                            <div className="mt-6 bg-quiz-card p-4 rounded-lg">
                                <div className="mb-2 flex justify-between text-sm">
                                    <div>Progress:</div>
                                    <div>
                                        {answeredQuestions.length} of {quiz.questions.length}
                                    </div>
                                </div>
                                <div className="w-full bg-accent rounded-full h-2">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                        style={{
                                            width: `${(answeredQuestions.length / quiz.questions.length) * 100}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>

                            {!isSubmitted && (
                                <div className="mt-8 flex flex-col items-center gap-3">
                                    <Button
                                        onClick={handleSubmitQuiz}
                                        disabled={answeredQuestions.length < quiz.questions.length}
                                        className={cn(
                                            "w-full max-w-xs px-6 py-3 rounded-lg font-semibold transition-colors duration-200",
                                            answeredQuestions.length < quiz.questions.length
                                                ? "bg-blue-400 text-white cursor-not-allowed"
                                                : "bg-blue-500 hover:bg-blue-600 text-white"
                                        )}
                                    >
                                        Submit Quiz
                                    </Button>

                                    {answeredQuestions.length < quiz.questions.length && (
                                        <div className="text-sm text-gray-400 text-center italic">
                                            Answer all questions to submit
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Questions content */}
                    <div className="md:col-span-2" ref={questionsContainerRef}>
                        {quiz.questions.map((question, index) => (
                            <QuestionCard
                                key={index}
                                questionNumber={index + 1}
                                question={question}
                                onSelectOption={handleSelectOption}
                                userAnswer={userAnswers[index + 1]}
                                showResults={isSubmitted}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageQuizDetail;
