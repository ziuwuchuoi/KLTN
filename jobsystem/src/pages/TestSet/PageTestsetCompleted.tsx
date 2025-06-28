"use client";

import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, HelpCircle, Code, Clock, Trophy, Home } from "lucide-react";
import type { TestSetSubmission } from "@/services/testset.service";
import CustomHeroSection from "@/components/molecules/CustomHeroSection";

const PageTestSetCompleted = () => {
    const { testSetId } = useParams<{ testSetId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);

    const submissionId = urlParams.get("submissionId");

    const [submission, setSubmission] = useState<TestSetSubmission | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setSubmission(null);
        setIsLoading(false);
    }, [submissionId, testSetId]);

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins}m`;
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-400";
        if (score >= 60) return "text-yellow-400";
        return "text-red-400";
    };

    const getScoreBadgeColor = (score: number) => {
        if (score >= 80) return "bg-green-900/20 text-green-400 border-green-500/30";
        if (score >= 60) return "bg-yellow-900/20 text-yellow-400 border-yellow-500/30";
        return "bg-red-900/20 text-red-400 border-red-500/30";
    };

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen bg-gradient-to-b from-zinc-950 via-slate-900 to-gray-900 text-white">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-white">Loading results...</div>
                </div>
            </div>
        );
    }

    if (!submission) {
        return (
            <div className="flex flex-col min-h-screen bg-gradient-to-b from-zinc-950 via-slate-900 to-gray-900 text-white">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-red-400">No submission found</div>
                </div>
            </div>
        );
    }

    const completedQuizzes = submission.completedQuizIds.split(",").filter(Boolean);
    const completedProblems = submission.completedProblemIds.split(",").filter(Boolean);
    const totalCompleted = completedQuizzes.length + completedProblems.length;
    const finalScore = Number.parseFloat(submission.finalScore);

    return (
        <div className="flex flex-col p-6 pt-40 w-full">
            {/* Fixed Section */}
            <div className="flex flex-row items-end w-full justify-around mb-10">
                <CustomHeroSection title="Coding" subtitle="Center" align="center" />
            </div>

            {/* Results Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-white text-lg flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-yellow-400" />
                            Final Score
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center">
                            <div className={`text-3xl font-bold mb-2 ${getScoreColor(finalScore)}`}>{finalScore}%</div>
                            <Badge variant="outline" className={getScoreBadgeColor(finalScore)}>
                                {finalScore >= 80 ? "Excellent" : finalScore >= 60 ? "Good" : "Needs Improvement"}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-white text-lg flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-400" />
                            Completion
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-400 mb-2">{totalCompleted}</div>
                            <p className="text-gray-400 text-sm">Items Completed</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-white text-lg flex items-center gap-2">
                            <Clock className="h-5 w-5 text-blue-400" />
                            Duration
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-400 mb-2">
                                {formatDuration(submission.actualDuration)}
                            </div>
                            <p className="text-gray-400 text-sm">Time Taken</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Quiz Results */}
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <HelpCircle className="h-5 w-5 text-blue-400" />
                            Quiz Performance
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Completed Quizzes:</span>
                            <Badge variant="secondary" className="bg-blue-900/20 text-blue-400">
                                {completedQuizzes.length}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Average Score:</span>
                            <span className={`font-semibold ${getScoreColor(submission.totalQuizScore)}`}>
                                {submission.totalQuizScore}%
                            </span>
                        </div>
                        <div className="space-y-2">
                            {completedQuizzes.map((quizId, index) => (
                                <div key={quizId} className="flex items-center gap-2 p-2 bg-slate-700/50 rounded">
                                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                                    <span className="text-sm text-gray-300">Quiz {index + 1} - Completed</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Code Results */}
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Code className="h-5 w-5 text-purple-400" />
                            Coding Performance
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Completed Problems:</span>
                            <Badge variant="secondary" className="bg-purple-900/20 text-purple-400">
                                {completedProblems.length}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Success Rate:</span>
                            <span className="font-semibold text-green-400">
                                {submission.totalPassedCodingProblems}/{submission.totalCodingProblems}
                            </span>
                        </div>
                        <div className="space-y-2">
                            {completedProblems.map((problemId, index) => (
                                <div key={problemId} className="flex items-center gap-2 p-2 bg-slate-700/50 rounded">
                                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                                    <span className="text-sm text-gray-300">Problem {index + 1} - Solved</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Next Steps */}
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white">What's Next?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-gray-300">
                        Your assessment has been submitted and will be reviewed by our team. Here's what happens next:
                    </p>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mt-0.5">
                                1
                            </div>
                            <div>
                                <p className="font-medium text-white">Review Process</p>
                                <p className="text-sm text-gray-400">
                                    Our technical team will review your solutions and provide feedback
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mt-0.5">
                                2
                            </div>
                            <div>
                                <p className="font-medium text-white">Results Notification</p>
                                <p className="text-sm text-gray-400">
                                    You'll receive an email with detailed results within 2-3 business days
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mt-0.5">
                                3
                            </div>
                            <div>
                                <p className="font-medium text-white">Next Steps</p>
                                <p className="text-sm text-gray-400">
                                    If successful, we'll contact you to schedule the next interview round
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="pt-4">
                        <Button
                            onClick={() => {
                                navigate("/");
                            }}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Home className="h-4 w-4 mr-2" />
                            Return to Dashboard
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PageTestSetCompleted;
