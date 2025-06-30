"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { HelpCircle, Code, CheckCircle2, Circle, Send, Timer, Target, AlertTriangle } from "lucide-react";
import { useTestSetQueries } from "./hooks/useTestSetQueries";
import CustomHeroSection from "@/components/molecules/CustomHeroSection";
import type { TestSetSubmission } from "@/services/testset.service";

interface ItemStatus {
    id: string;
    type: "quiz" | "code";
    title: string;
    completed: boolean;
    difficulty?: string;
    duration?: number;
    questionCount?: number;
    problemId?: number;
}

interface StoredSubmission extends TestSetSubmission {
    startTime: number;
    duration: number;
}

const PageTestSetTaking = () => {
    const { testSetId, jdId } = useParams<{ testSetId: string; jdId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);

    const submissionId = urlParams.get("submissionId");

    const [itemStatuses, setItemStatuses] = useState<ItemStatus[]>([]);
    const [timeRemaining, setTimeRemaining] = useState<number>(0);
    const [storedSubmission, setStoredSubmission] = useState<StoredSubmission | null>(null);

    const { useTestSetByJD, submitFinalTestSet } = useTestSetQueries();
    const { data: testSetDetail, isLoading } = useTestSetByJD(jdId!);

    // Function to check and update localStorage
    const checkLocalStorage = useCallback(() => {
        if (submissionId) {
            const stored = localStorage.getItem(`testset_submission_${submissionId}`);
            if (stored) {
                try {
                    const submission: StoredSubmission = JSON.parse(stored);
                    setStoredSubmission(submission);

                    // Calculate remaining time based on elapsed time
                    const elapsed = Math.floor((Date.now() - submission.startTime) / 1000);
                    const totalTime = submission.duration * 60; // convert minutes to seconds
                    const remaining = Math.max(0, totalTime - elapsed);
                    setTimeRemaining(remaining);

                    return submission;
                } catch (error) {
                    console.error("Error parsing localStorage:", error);
                    return null;
                }
            }
        }
        return null;
    }, [submissionId]);

    // Load submission from localStorage and initialize
    useEffect(() => {
        checkLocalStorage();
    }, [checkLocalStorage]);

    // Initialize item statuses when testSetDetail loads
    useEffect(() => {
        if (testSetDetail && storedSubmission) {
            const quizItems: ItemStatus[] =
                testSetDetail.quizzes?.map((quiz) => ({
                    id: quiz._id!,
                    type: "quiz" as const,
                    title: quiz.title!,
                    completed: storedSubmission.completedQuizIds.includes(quiz._id!),
                    duration: quiz.duration,
                    questionCount: quiz.questions?.length || 0,
                })) || [];

            const codeItems: ItemStatus[] =
                testSetDetail.problems?.map((problem) => ({
                    id: problem._id!,
                    type: "code" as const,
                    title: problem.title!,
                    completed: storedSubmission.completedProblemIds.includes(problem._id!),
                    difficulty: problem.difficulty,
                    problemId: problem.problemId,
                })) || [];

            setItemStatuses([...quizItems, ...codeItems]);
        }
    }, [testSetDetail, storedSubmission]);

    // Timer countdown with localStorage sync
    useEffect(() => {
        if (timeRemaining > 0 && storedSubmission && !isNaN(timeRemaining)) {
            const timer = setInterval(() => {
                setTimeRemaining((prev) => {
                    const newTime = prev - 1;

                    // Update localStorage with current time
                    const updatedSubmission = {
                        ...storedSubmission,
                        actualDuration: Math.floor((Date.now() - storedSubmission.startTime) / 1000 / 60), // in minutes
                    };
                    localStorage.setItem(`testset_submission_${submissionId}`, JSON.stringify(updatedSubmission));

                    if (newTime <= 0) {
                        handleFinalSubmit();
                        return 0;
                    }
                    return newTime;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [timeRemaining, storedSubmission, submissionId]);

    // Listen for page visibility changes and focus events
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                // Page became visible, check localStorage for updates
                const updated = checkLocalStorage();
                if (updated && testSetDetail) {
                    // Update item statuses immediately
                    const quizItems: ItemStatus[] =
                        testSetDetail.quizzes?.map((quiz) => ({
                            id: quiz._id!,
                            type: "quiz" as const,
                            title: quiz.title!,
                            completed: updated.completedQuizIds.includes(quiz._id!),
                            duration: quiz.duration,
                            questionCount: quiz.questions?.length || 0,
                        })) || [];

                    const codeItems: ItemStatus[] =
                        testSetDetail.problems?.map((problem) => ({
                            id: problem._id!,
                            type: "code" as const,
                            title: problem.title!,
                            completed: updated.completedProblemIds.includes(problem._id!),
                            difficulty: problem.difficulty,
                            problemId: problem.problemId,
                        })) || [];

                    setItemStatuses([...quizItems, ...codeItems]);
                }
            }
        };

        const handleFocus = () => {
            // Window gained focus, check for updates
            handleVisibilityChange();
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("focus", handleFocus);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("focus", handleFocus);
        };
    }, [checkLocalStorage, testSetDetail]);

    // Listen for storage events from other tabs
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === `testset_submission_${submissionId}` && e.newValue) {
                try {
                    const submission: StoredSubmission = JSON.parse(e.newValue);
                    setStoredSubmission(submission);

                    // Update item statuses based on completed items
                    if (testSetDetail) {
                        const quizItems: ItemStatus[] =
                            testSetDetail.quizzes?.map((quiz) => ({
                                id: quiz._id!,
                                type: "quiz" as const,
                                title: quiz.title!,
                                completed: submission.completedQuizIds.includes(quiz._id!),
                                duration: quiz.duration,
                                questionCount: quiz.questions?.length || 0,
                            })) || [];

                        const codeItems: ItemStatus[] =
                            testSetDetail.problems?.map((problem) => ({
                                id: problem._id!,
                                type: "code" as const,
                                title: problem.title!,
                                completed: submission.completedProblemIds.includes(problem._id!),
                                difficulty: problem.difficulty,
                                problemId: problem.problemId,
                            })) || [];

                        setItemStatuses([...quizItems, ...codeItems]);
                    }
                } catch (error) {
                    console.error("Error parsing storage event:", error);
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [submissionId, testSetDetail]);

    const handleItemClick = (item: ItemStatus) => {
        if (item.completed) return;

        const baseUrl = item.type === "quiz" ? `/testset/quiz/${item.id}` : `/testset/code/${item.id}`;
        const returnUrl = `/testset/${testSetId}/${jdId}/take?submissionId=${submissionId}`;

        const params = new URLSearchParams({
            submissionId: submissionId!,
            returnUrl,
        });

        navigate(`${baseUrl}?${params.toString()}`);
    };

    const handleFinalSubmit = async () => {
        if (!submissionId) return;

        try {
            await submitFinalTestSet.mutateAsync(submissionId);
            // Clear localStorage after successful submission
            localStorage.removeItem(`testset_submission_${submissionId}`);
            navigate(`/testset/${testSetId}/${jdId}/completed?submissionId=${submissionId}`);
        } catch (error) {
            console.error("Failed to submit test set:", error);
        }
    };

    const formatTime = (seconds: number) => {
        if (isNaN(seconds) || seconds < 0) {
            return "00:00";
        }

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
        }
        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    };

    const getDifficultyColor = (difficulty?: string) => {
        switch (difficulty) {
            case "Easy":
                return "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-300";
            case "Medium":
                return "from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-300";
            case "Hard":
                return "from-red-500/20 to-pink-500/20 border-red-500/30 text-red-300";
            default:
                return "from-slate-500/20 to-gray-500/20 border-slate-500/30 text-slate-300";
        }
    };

    const completedItems = itemStatuses.filter((item) => item.completed).length;
    const totalItems = itemStatuses.length;
    const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
    const allCompleted = completedItems === totalItems && totalItems > 0;
    const isTimeRunningLow = timeRemaining < 300 && timeRemaining > 0;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-900 to-gray-900 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                    <p className="text-slate-300 font-medium">Loading assessment...</p>
                </div>
            </div>
        );
    }

    if (!testSetDetail || !submissionId || !storedSubmission) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-900 to-gray-900 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-red-400 text-2xl">⚠</span>
                    </div>
                    <p className="text-red-400 font-medium">Invalid test session</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-900 to-gray-900">
            {/* Hero Section with Timer */}
            <div className="relative overflow-hidden">
                <div className="relative px-6 pt-24 pb-12">
                    <div className="w-[80%] mx-auto flex flex-row items-center justify-between space-x-8">
                        <CustomHeroSection
                            title="Assessment"
                            subtitle="In Progress"
                            description="Complete all items to finish"
                            align="left"
                        />
                        <div className="flex flex-row gap-6 w-full max-w-md">
                            <div
                                className={`flex items-center gap-4 px-6 py-4 rounded-xl backdrop-blur-sm ${
                                    isTimeRunningLow
                                        ? "bg-red-900/30 border border-red-500/30"
                                        : "bg-slate-800/40 border border-slate-600/30"
                                }`}
                            >
                                <div
                                    className={`p-3 ${isTimeRunningLow ? "bg-red-500/20" : "bg-blue-500/20"} rounded-lg`}
                                >
                                    <Timer
                                        className={`h-7 w-7 ${isTimeRunningLow ? "text-red-400" : "text-blue-400"}`}
                                    />
                                </div>
                                <div className="text-center">
                                    <div
                                        className={`text-4xl font-mono font-bold ${isTimeRunningLow ? "text-red-400" : "text-white"}`}
                                    >
                                        {formatTime(timeRemaining)}
                                    </div>
                                    <p className="text-slate-400 text-sm mt-1">Time Remaining</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 px-6 py-4 rounded-xl bg-slate-800/40 border border-slate-600/30 backdrop-blur-sm">
                                <div className="p-3 bg-green-500/20 rounded-lg">
                                    <Target className="h-7 w-7 text-green-400" />
                                </div>
                                <div className="min-w-[120px]">
                                    <div className="text-2xl font-bold text-white mb-1">
                                        {completedItems}/{totalItems}
                                    </div>
                                    <p className="text-slate-400 text-sm mb-2">Items Completed</p>
                                    <Progress value={progressPercentage} className="h-2 w-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 pb-12">
                <div className="w-[80%] mx-auto space-y-8">
                    {/* Items Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {itemStatuses.map((item, index) => (
                            <Card
                                key={item.id}
                                className={`group relative overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                                    item.completed
                                        ? "bg-gradient-to-br from-green-800/40 to-green-900/40 border-green-500/30 hover:from-green-700/40 hover:to-green-800/40"
                                        : "bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 hover:from-slate-700/60 hover:to-slate-800/60 hover:border-slate-600/50"
                                } backdrop-blur-sm hover:shadow-lg`}
                                onClick={() => handleItemClick(item)}
                            >
                                {/* Gradient overlay */}
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${item.type === "quiz" ? "from-blue-500/5 to-cyan-500/5" : "from-purple-500/5 to-pink-500/5"} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                                ></div>

                                <CardHeader className="relative pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`p-1.5 ${item.type === "quiz" ? "bg-blue-500/20" : "bg-purple-500/20"} rounded-lg`}
                                            >
                                                {item.type === "quiz" ? (
                                                    <HelpCircle className="h-4 w-4 text-blue-400" />
                                                ) : (
                                                    <Code className="h-4 w-4 text-purple-400" />
                                                )}
                                            </div>
                                            <span
                                                className={`text-xs font-medium ${item.type === "quiz" ? "text-blue-400 bg-blue-500/10" : "text-purple-400 bg-purple-500/10"} px-2 py-1 rounded-full`}
                                            >
                                                {item.type === "quiz" ? "Quiz" : "Code"} #{index + 1}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {item.completed ? (
                                                <CheckCircle2 className="h-5 w-5 text-green-400" />
                                            ) : (
                                                <Circle className="h-5 w-5 text-slate-500" />
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="relative pt-0 space-y-3">
                                    <h3 className="font-semibold text-white text-sm leading-tight group-hover:text-blue-100 transition-colors line-clamp-2">
                                        {item.title}
                                    </h3>

                                    <div className="space-y-2">
                                        {item.type === "quiz" && (
                                            <div className="flex items-center justify-between text-xs text-slate-400">
                                                <span>{item.questionCount} questions</span>
                                                <span>{item.duration} min</span>
                                            </div>
                                        )}

                                        {item.type === "code" && (
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-400">Problem #{item.problemId}</span>
                                                <Badge
                                                    className={`bg-gradient-to-r ${getDifficultyColor(item.difficulty)} border text-xs font-semibold px-2 py-1`}
                                                >
                                                    {item.difficulty}
                                                </Badge>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-2 border-t border-slate-700/50">
                                        <Button
                                            variant={item.completed ? "secondary" : "default"}
                                            size="sm"
                                            className={`w-full ${item.completed ? "bg-green-600/20 text-green-300 border-green-500/30" : ""}`}
                                            disabled={item.completed}
                                        >
                                            {item.completed ? "✓ Completed" : "Start"}
                                        </Button>
                                    </div>
                                </CardContent>

                                {/* Hover indicator */}
                                {!item.completed && (
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div
                                            className={`w-2 h-2 ${item.type === "quiz" ? "bg-blue-400" : "bg-purple-400"} rounded-full animate-pulse`}
                                        ></div>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>

                    {/* Final Submit Section */}
                    {allCompleted && (
                        <Card className="bg-gradient-to-br from-green-800/40 to-green-900/40 border-green-500/30 backdrop-blur-sm">
                            <CardContent className="p-8">
                                <div className="text-center space-y-6">
                                    <div className="bg-green-500/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                                        <CheckCircle2 className="h-10 w-10 text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-2">All Items Completed!</h3>
                                        <p className="text-green-100 max-w-2xl mx-auto">
                                            Congratulations! You have successfully completed all {totalItems} items in
                                            this assessment. Click the button below to submit your final results.
                                        </p>
                                    </div>
                                    <Button
                                        onClick={handleFinalSubmit}
                                        disabled={submitFinalTestSet.isPending}
                                        size="lg"
                                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-green-500/25"
                                    >
                                        {submitFinalTestSet.isPending ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-5 w-5 mr-2" />
                                                Submit Assessment
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Emergency Submit (if time is running low) */}
                    {!allCompleted && isTimeRunningLow && (
                        <Card className="bg-gradient-to-br from-yellow-800/40 to-orange-900/40 border-yellow-500/30 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-yellow-500/20 rounded-lg">
                                            <AlertTriangle className="h-6 w-6 text-yellow-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-yellow-400 mb-1">Time Running Low!</h4>
                                            <p className="text-yellow-100 text-sm">
                                                Less than 5 minutes remaining. You can submit early if needed.
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={handleFinalSubmit}
                                        disabled={submitFinalTestSet.isPending}
                                        variant="outline"
                                        className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 bg-transparent"
                                    >
                                        Submit Early
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PageTestSetTaking;
