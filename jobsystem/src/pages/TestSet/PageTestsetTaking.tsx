"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, HelpCircle, Code, CheckCircle2, Circle, Send } from "lucide-react";
import { useTestSetQueries } from "./hooks/useTestSetQueries";
import CustomHeroSection from "@/components/molecules/CustomHeroSection";

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

const PageTestSetTaking = () => {
    const { testSetId, jdId } = useParams<{ testSetId: string; jdId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);

    const submissionId = urlParams.get("submissionId");

    const [itemStatuses, setItemStatuses] = useState<ItemStatus[]>([]);
    const [timeRemaining, setTimeRemaining] = useState<number>(0);
    const [startTime, setStartTime] = useState<Date | null>(null);

    const { useTestSetByJD, submitFinalTestSet } = useTestSetQueries();
    const { data: testSetDetail, isLoading } = useTestSetByJD(jdId!);

    // Initialize item statuses and timer
    useEffect(() => {
        if (testSetDetail && submissionId) {
            const quizItems: ItemStatus[] =
                testSetDetail.quizzes?.map((quiz) => ({
                    id: quiz._id!,
                    type: "quiz" as const,
                    title: quiz.title!,
                    completed: false,
                    duration: quiz.duration,
                    questionCount: quiz.questions?.length || 0,
                })) || [];

            const codeItems: ItemStatus[] =
                testSetDetail.problems?.map((problem) => ({
                    id: problem._id!,
                    type: "code" as const,
                    title: problem.title!,
                    completed: false,
                    difficulty: problem.difficulty,
                    problemId: problem.problemId,
                })) || [];

            setItemStatuses([...quizItems, ...codeItems]);
            setTimeRemaining(testSetDetail.duration * 60);
            setStartTime(new Date());
        }
    }, [testSetDetail, submissionId]);

    // Timer countdown
    useEffect(() => {
        if (timeRemaining > 0) {
            const timer = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1) {
                        // Auto-submit when time runs out
                        handleFinalSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [timeRemaining]);

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
            navigate(`/testset/${testSetId}/${jdId}/completed?submissionId=${submissionId}`);
        } catch (error) {
            console.error("Failed to submit test set:", error);
        }
    };

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
        }
        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    };

    const completedItems = itemStatuses.filter((item) => item.completed).length;
    const totalItems = itemStatuses.length;
    const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
    const allCompleted = completedItems === totalItems && totalItems > 0;

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen bg-gradient-to-b from-zinc-950 via-slate-900 to-gray-900 text-white">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-white">Loading test set...</div>
                </div>
            </div>
        );
    }

    if (!testSetDetail || !submissionId) {
        return (
            <div className="flex flex-col min-h-screen bg-gradient-to-b from-zinc-950 via-slate-900 to-gray-900 text-white">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-red-400">Invalid test set session</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col p-6 pt-40 w-full">
            {/* Fixed Section */}
            <div className="flex flex-row items-end w-full justify-around mb-10">
                <CustomHeroSection title="Coding" subtitle="Center" align="center" />
                <div className="text-right">
                    <div className="flex items-center gap-2 text-lg font-mono text-white mb-1">
                        <Clock className="h-5 w-5" />
                        <span className={timeRemaining < 300 ? "text-red-400" : "text-white"}>
                            {formatTime(timeRemaining)}
                        </span>
                    </div>
                    <p className="text-sm text-gray-400">Time remaining</p>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white">
                            {completedItems} of {totalItems} completed
                        </span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                </div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {itemStatuses.map((item, index) => (
                    <Card
                        key={item.id}
                        className={`cursor-pointer transition-all duration-200 ${
                            item.completed
                                ? "bg-green-900/20 border-green-500/30 hover:bg-green-900/30"
                                : "bg-slate-800/50 border-slate-700 hover:bg-slate-700 hover:border-slate-600"
                        }`}
                        onClick={() => handleItemClick(item)}
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {item.type === "quiz" ? (
                                        <HelpCircle className="h-5 w-5 text-blue-400" />
                                    ) : (
                                        <Code className="h-5 w-5 text-purple-400" />
                                    )}
                                    <span className="text-sm font-medium text-gray-400">
                                        {item.type === "quiz" ? "Quiz" : "Code"} #{index + 1}
                                    </span>
                                </div>
                                {item.completed ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                                ) : (
                                    <Circle className="h-5 w-5 text-gray-500" />
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <h3 className="font-medium text-white mb-3 line-clamp-2">{item.title}</h3>

                            <div className="space-y-2">
                                {item.type === "quiz" && (
                                    <div className="flex items-center justify-between text-sm text-gray-400">
                                        <span>{item.questionCount} questions</span>
                                        <span>{item.duration} min</span>
                                    </div>
                                )}

                                {item.type === "code" && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">Problem #{item.problemId}</span>
                                        <Badge
                                            variant="outline"
                                            className={
                                                item.difficulty === "Easy"
                                                    ? "bg-green-900/20 text-green-400 border-green-500/30"
                                                    : item.difficulty === "Medium"
                                                      ? "bg-yellow-900/20 text-yellow-400 border-yellow-500/30"
                                                      : "bg-red-900/20 text-red-400 border-red-500/30"
                                            }
                                        >
                                            {item.difficulty}
                                        </Badge>
                                    </div>
                                )}
                            </div>

                            <div className="mt-3 pt-3 border-t border-slate-700">
                                <Button
                                    variant={item.completed ? "secondary" : "default"}
                                    size="sm"
                                    className="w-full"
                                    disabled={item.completed}
                                >
                                    {item.completed ? "Completed" : "Start"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Final Submit Section */}
            {allCompleted && (
                <Card className="bg-green-900/20 border-green-500/30">
                    <CardContent className="p-6">
                        <div className="text-center">
                            <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">All Items Completed!</h3>
                            <p className="text-gray-300 mb-6">
                                You have successfully completed all {totalItems} items in this test set. Click the
                                button below to submit your final assessment.
                            </p>
                            <Button
                                onClick={handleFinalSubmit}
                                disabled={submitFinalTestSet.isPending}
                                size="lg"
                                className="bg-green-600 hover:bg-green-700"
                            >
                                <Send className="h-5 w-5 mr-2" />
                                {submitFinalTestSet.isPending ? "Submitting..." : "Submit Test Set"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Emergency Submit (if time is running low) */}
            {!allCompleted && timeRemaining < 300 && (
                <Card className="bg-yellow-900/20 border-yellow-500/30">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium text-yellow-400 mb-1">Time Running Low</h4>
                                <p className="text-sm text-gray-300">You can submit your test set early if needed</p>
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
    );
};

export default PageTestSetTaking;
