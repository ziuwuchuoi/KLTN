import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import QuizNavigation from "./QuizNavigation";
import QuestionCard from "./QuestionCard";
import { Button } from "@/components/ui/button";
import { useQuizQueries } from "./hooks/useQuizQueries";
import { cn, ShowToast } from "@/components/utils/general.utils";
import { ArrowLeft } from "lucide-react";
import { useTestSetQueries } from "../TestSet/hooks/useTestSetQueries";
import type { TestSetSubmission } from "@/services/testset.service";
import { toast } from "sonner";

export type QuizResult = {
    actualDuration: number;
    correctCount: number;
    duration: number;
    feedback: {
        qIndex: number;
        chosenOption: number;
        isCorrect: boolean;
        correctAnswer: number;
        explanation: string;
    }[];
    score: number;
    total: number;
};

interface StoredSubmission extends TestSetSubmission {
    startTime: number;
    duration: number;
}

const PageQuizDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { quizId } = useParams();
    const searchParams = new URLSearchParams(location.search);
    const testSetResultId = searchParams.get("submissionId");
    const returnUrl = searchParams.get("returnUrl");
    const { useQuizDetail, submitQuiz } = useQuizQueries();
    const { data: quiz, isLoading } = useQuizDetail(quizId);
    const isTestsetQuiz = location.pathname.startsWith("/testset/quiz/");

    const [startTime] = useState(new Date());
    const [duration, setDuration] = useState(0);

    const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
    const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
    const [currentQuestionId, setCurrentQuestionId] = useState<number>(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { submitQuizTestSet } = useTestSetQueries();

    const [resultQuestion, setResultQuestion] = useState<QuizResult>(null);
    const questionsContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleCopy = (event: ClipboardEvent) => {
            event.preventDefault();
            ShowToast(toast, "error", "Copy feature is not allowed!");
        };

        document.addEventListener("copy", handleCopy);
        return () => {
            document.removeEventListener("copy", handleCopy);
        };
    }, []);

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

    useEffect(() => {
        if (resultQuestion) {
            console.log("result updated", resultQuestion);
        }
    }, [resultQuestion]);

    const updateLocalStorage = (quizId: string) => {
        if (testSetResultId) {
            const stored = localStorage.getItem(`testset_submission_${testSetResultId}`);
            if (stored) {
                const submission: StoredSubmission = JSON.parse(stored);

                // Add quiz ID to completed quizzes if not already present
                if (!submission.completedQuizIds.includes(quizId)) {
                    const updatedSubmission = {
                        ...submission,
                        completedQuizIds: [...submission.completedQuizIds, quizId],
                    };
                    localStorage.setItem(`testset_submission_${testSetResultId}`, JSON.stringify(updatedSubmission));
                }
            }
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

        console.log("isTestsetQuiz && testSetResultId:", isTestsetQuiz, testSetResultId);

        try {
            if (isTestsetQuiz && testSetResultId) {
                // Use testset mutation
                await submitQuizTestSet.mutateAsync({
                    quizId: quiz._id,
                    answers: formattedAnswers,
                    startTime: startTime,
                    testSetResultId: testSetResultId,
                });

                // Update localStorage
                updateLocalStorage(quiz._id);

                setIsSubmitted(true);

                // Navigate back to taking page after a short delay
                setTimeout(() => {
                    if (returnUrl) {
                        navigate(returnUrl);
                    }
                }, 2000);
            } else {
                // Use normal mutation
                const response = await submitQuiz.mutateAsync({
                    quizId: quiz._id,
                    answers: formattedAnswers,
                    startTime: startTime,
                });
                setResultQuestion(response.data);
                setIsSubmitted(true);
            }
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

    const handleBackNavigation = () => {
        if (isTestsetQuiz && returnUrl) {
            navigate(returnUrl);
        } else if (isTestsetQuiz) {
            navigate(-1);
        } else {
            navigate("/quiz/technical");
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col w-full pt-20">
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-pulse text-center">
                        <div className="h-8 bg-slate-700 rounded w-64 mb-4 mx-auto"></div>
                        <div className="h-4 bg-slate-700 rounded w-48 mx-auto"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="flex flex-col w-full pt-20">
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Quiz not found</h1>
                        <Button onClick={() => navigate("/quiz")} variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Quizzes
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col p-6 w-full">
            {/* Fixed Section */}
            <div className="flex flex-row items-end w-full mt-20 mb-5 justify-around">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Sidebar with question navigation */}
                    <div className="md:col-span-1">
                        <div className="sticky top-8">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleBackNavigation}
                                    className="text-slate-400 hover:text-slate-900 text-sm font-semibold"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to {isTestsetQuiz ? "Test Set" : "Quizzes"}
                                </Button>
                                <span className="text-lg font-semibold text-white">{quiz.title}</span>
                            </div>
                            <QuizNavigation
                                questionsCount={quiz.questions.length}
                                answeredQuestions={answeredQuestions}
                                onQuestionClick={handleQuestionClick}
                                currentQuestionId={currentQuestionId}
                                resultQuestion={resultQuestion}
                                isSubmitted={isSubmitted}
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

                            {/* Success message for testset quiz */}
                            {isSubmitted && isTestsetQuiz && (
                                <div className="mt-8 p-4 bg-green-900/20 border border-green-500/30 rounded-lg text-center">
                                    <div className="text-green-400 font-semibold mb-2">Quiz Completed!</div>
                                    <div className="text-green-300 text-sm">Returning to assessment...</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Questions content */}
                    <div className="md:col-span-2" ref={questionsContainerRef}>
                        {quiz.questions.map((question, index) => {
                            const feedbackItem = resultQuestion?.feedback?.find((f) => f.qIndex === index);

                            return (
                                <QuestionCard
                                    key={index}
                                    questionNumber={index + 1}
                                    question={question}
                                    onSelectOption={handleSelectOption}
                                    userAnswer={userAnswers[index + 1]}
                                    showResults={isSubmitted}
                                    correctAnswer={feedbackItem?.correctAnswer}
                                    isCorrect={feedbackItem?.isCorrect}
                                    explanation={feedbackItem?.explanation}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageQuizDetail;
