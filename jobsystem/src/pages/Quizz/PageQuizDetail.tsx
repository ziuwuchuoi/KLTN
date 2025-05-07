import { useState, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import QuizNavigation from "./QuizNavigation";
import QuestionCard from "./QuestionCard";
import { Button } from "@/components/ui/button";
import { TechnicalQuiz } from "./hooks/useQuizQueries";

const PageQuizDetail = () => {
    const location = useLocation();
    const quiz = (location.state as { quiz: TechnicalQuiz })?.quiz;

    const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
    const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
    const [currentQuestionId, setCurrentQuestionId] = useState<number>(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const questionsContainerRef = useRef<HTMLDivElement>(null);

    const handleSelectOption = (questionNumber: number, selectedAnswer: number) => {
        setUserAnswers((prev) => ({
            ...prev,
            [questionNumber]: selectedAnswer,
        }));

        if (!answeredQuestions.includes(questionNumber)) {
            setAnsweredQuestions((prev) => [...prev, questionNumber]);
        }
    };

    // Handle submitting the whole quiz
    const handleSubmitQuiz = () => {
        if (answeredQuestions.length < quiz.questions.length) {
            // toast({
            //     title: "Quiz Incomplete",
            //     description: `You've answered ${answeredQuestions.length} of ${quiz.questions.length} questions. Please answer all questions before submitting.`,
            //     variant: "destructive",
            // });
            return;
        }

        setIsSubmitted(true);
        // toast({
        //     title: "Quiz Submitted",
        //     description: "Your answers have been submitted. You can now review your results.",
        // });
    };

    // Handle clicking on a question in the navigation
    const handleQuestionClick = (questionId: number) => {
        setCurrentQuestionId(questionId);
        scrollToQuestion(questionId);
    };

    // Scroll to a specific question
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
        <div className="min-h-screen bg-quiz-background text-white">
            <div className="container py-8">
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
                                <div className="mb-2 flex justify-between">
                                    <span>Progress:</span>
                                    <span>
                                        {answeredQuestions.length} of {quiz.questions.length}
                                    </span>
                                </div>
                                <div className="w-full bg-quiz-option rounded-full h-2">
                                    <div
                                        className="bg-quiz-blue h-2 rounded-full transition-all duration-300"
                                        style={{
                                            width: `${(answeredQuestions.length / quiz.questions.length) * 100}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>

                            {!isSubmitted && (
                                <div className="mt-6">
                                    <Button
                                        onClick={handleSubmitQuiz}
                                        disabled={answeredQuestions.length < quiz.questions.length}
                                        className="w-full bg-quiz-blue hover:bg-quiz-dark-blue"
                                    >
                                        Submit Quiz
                                    </Button>
                                    {answeredQuestions.length < quiz.questions.length && (
                                        <p className="text-sm text-gray-400 mt-2">Answer all questions to submit</p>
                                    )}
                                </div>
                            )}

                            {quiz.sourceUrl && (
                                <div className="mt-6 bg-quiz-card p-4 rounded-lg">
                                    <h3 className="text-sm font-medium mb-2">Source</h3>
                                    <a
                                        href={quiz.sourceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-quiz-blue hover:underline text-sm break-words"
                                    >
                                        {quiz.sourceUrl}
                                    </a>
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
