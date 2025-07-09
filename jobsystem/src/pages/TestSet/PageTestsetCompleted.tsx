"use client";

import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, HelpCircle, Code, Clock, Trophy, Home, Star, Award, Target, TrendingUp } from "lucide-react";
import type { TestSetSubmission } from "@/services/testset.service";
import CustomHeroSection from "@/components/molecules/CustomHeroSection";

interface StoredSubmission extends TestSetSubmission {
    startTime: number;
    duration: number;
}

const PageTestSetCompleted = () => {
    const { testSetId } = useParams<{ testSetId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const submissionId = urlParams.get("submissionId");

    const [submission, setSubmission] = useState<StoredSubmission | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadSubmissionFromStorage = () => {
            if (submissionId) {
                const stored = localStorage.getItem(`testset_submission_${submissionId}`);
                if (stored) {
                    try {
                        const submission: StoredSubmission = JSON.parse(stored);
                        setSubmission(submission);
                        console.log("Loaded submission from localStorage:", submission);
                    } catch (error) {
                        console.error("Error parsing localStorage:", error);
                        // Redirect to home if no valid submission found
                        navigate("/");
                    }
                } else {
                    console.error("No submission found in localStorage");
                    // Redirect to home if no submission found
                    navigate("/");
                }
            } else {
                console.error("No submissionId provided");
                navigate("/");
            }
            setIsLoading(false);
        };

        loadSubmissionFromStorage();
    }, [submissionId, navigate]);

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins}m`;
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return "text-emerald-400";
        if (score >= 80) return "text-green-400";
        if (score >= 70) return "text-blue-400";
        if (score >= 60) return "text-yellow-400";
        return "text-red-400";
    };

    const getScoreBadgeColor = (score: number) => {
        if (score >= 90) return "bg-emerald-900/20 text-emerald-400 border-emerald-500/30";
        if (score >= 80) return "bg-green-900/20 text-green-400 border-green-500/30";
        if (score >= 70) return "bg-blue-900/20 text-blue-400 border-blue-500/30";
        if (score >= 60) return "bg-yellow-900/20 text-yellow-400 border-yellow-500/30";
        return "bg-red-900/20 text-red-400 border-red-500/30";
    };

    const getPerformanceLevel = (score: number) => {
        if (score >= 90) return "Outstanding";
        if (score >= 80) return "Excellent";
        if (score >= 70) return "Good";
        if (score >= 60) return "Satisfactory";
        return "Needs Improvement";
    };

    const getPerformanceIcon = (score: number) => {
        if (score >= 90) return <Award className="h-6 w-6 text-emerald-400" />;
        if (score >= 80) return <Trophy className="h-6 w-6 text-green-400" />;
        if (score >= 70) return <Star className="h-6 w-6 text-blue-400" />;
        if (score >= 60) return <Target className="h-6 w-6 text-yellow-400" />;
        return <TrendingUp className="h-6 w-6 text-red-400" />;
    };

    const calculateActualDuration = (submission: StoredSubmission) => {
        if (submission.actualDuration) {
            return submission.actualDuration;
        }
        // Calculate from startTime if actualDuration is not available
        const endTime = submission.endAt ? new Date(submission.endAt).getTime() : Date.now();
        const startTime = submission.startTime || new Date(submission.startedAt).getTime();
        return Math.floor((endTime - startTime) / (1000 * 60)); // Convert to minutes
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-900 to-gray-900 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                    <p className="text-slate-300 font-medium">Loading your results...</p>
                </div>
            </div>
        );
    }

    if (!submission) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-900 to-gray-900 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-red-400 text-2xl">⚠</span>
                    </div>
                    <p className="text-red-400 font-medium">No submission found</p>
                    <Button onClick={() => navigate("/")} variant="outline">
                        <Home className="h-4 w-4 mr-2" />
                        Return to Home
                    </Button>
                </div>
            </div>
        );
    }

    const completedQuizzes = submission.completedQuizIds.length;
    const completedProblems = submission.completedProblemIds.length;
    const totalCompleted = completedQuizzes + completedProblems;
    const finalScore = Number.parseFloat(submission.finalScore);
    const actualDuration = calculateActualDuration(submission);

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-900 to-gray-900">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="relative px-6 pt-24 pb-12">
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="mb-8">
                            <div className="bg-green-500/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="h-12 w-12 text-green-400" />
                            </div>
                            <CustomHeroSection
                                title="Assessment"
                                subtitle="Completed"
                                description="Your technical assessment has been successfully submitted"
                                align="center"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 pb-12">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Performance Overview */}
                    <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 backdrop-blur-sm">
                        <CardContent className="p-8">
                            <div className="text-center space-y-6">
                                <div className="flex items-center justify-center gap-4">
                                    {getPerformanceIcon(finalScore)}
                                    <div>
                                        <div className={`text-5xl font-bold mb-2 ${getScoreColor(finalScore)}`}>
                                            {finalScore}%
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={`${getScoreBadgeColor(finalScore)} text-lg px-4 py-2`}
                                        >
                                            {getPerformanceLevel(finalScore)}
                                        </Badge>
                                    </div>
                                </div>
                                <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                                    You've demonstrated strong technical skills across multiple domains. Your
                                    performance will be reviewed by our technical team.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Detailed Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-white text-lg flex items-center gap-2">
                                    <div className="p-2 bg-green-500/20 rounded-lg">
                                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                                    </div>
                                    Completion
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-400 mb-2">{totalCompleted}</div>
                                    <p className="text-slate-400 text-sm">Items Completed</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-white text-lg flex items-center gap-2">
                                    <div className="p-2 bg-blue-500/20 rounded-lg">
                                        <HelpCircle className="h-5 w-5 text-blue-400" />
                                    </div>
                                    Quiz Score
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center">
                                    <div
                                        className={`text-3xl font-bold mb-2 ${getScoreColor(submission.totalQuizScore)}`}
                                    >
                                        {submission.totalQuizScore}%
                                    </div>
                                    <p className="text-slate-400 text-sm">{completedQuizzes} Quizzes</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-white text-lg flex items-center gap-2">
                                    <div className="p-2 bg-purple-500/20 rounded-lg">
                                        <Code className="h-5 w-5 text-purple-400" />
                                    </div>
                                    Coding
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-purple-400 mb-2">
                                        {submission.totalPassedCodingProblems}/{submission.totalCodingProblems}
                                    </div>
                                    <p className="text-slate-400 text-sm">Problems Solved</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-white text-lg flex items-center gap-2">
                                    <div className="p-2 bg-orange-500/20 rounded-lg">
                                        <Clock className="h-5 w-5 text-orange-400" />
                                    </div>
                                    Duration
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-orange-400 mb-2">
                                        {formatDuration(actualDuration)}
                                    </div>
                                    <p className="text-slate-400 text-sm">Time Taken</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Detailed Breakdown */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Quiz Performance */}
                        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <div className="p-2 bg-blue-500/20 rounded-lg">
                                        <HelpCircle className="h-5 w-5 text-blue-400" />
                                    </div>
                                    Quiz Performance
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-slate-700/50 rounded-lg">
                                    <span className="text-slate-300">Completed Quizzes</span>
                                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                                        {completedQuizzes}
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-slate-700/50 rounded-lg">
                                    <span className="text-slate-300">Average Score</span>
                                    <span
                                        className={`font-semibold text-lg ${getScoreColor(submission.totalQuizScore)}`}
                                    >
                                        {submission.totalQuizScore}%
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {submission.completedQuizIds.length > 0 ? (
                                        submission.completedQuizIds.map((quizId, index) => (
                                            <div
                                                key={quizId}
                                                className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg"
                                            >
                                                <CheckCircle2 className="h-4 w-4 text-green-400" />
                                                <span className="text-slate-300 text-sm">
                                                    Quiz {index + 1} - Completed
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4 text-slate-400">No quizzes completed</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Coding Performance */}
                        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <div className="p-2 bg-purple-500/20 rounded-lg">
                                        <Code className="h-5 w-5 text-purple-400" />
                                    </div>
                                    Coding Performance
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-slate-700/50 rounded-lg">
                                    <span className="text-slate-300">Completed Problems</span>
                                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                                        {completedProblems}
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-slate-700/50 rounded-lg">
                                    <span className="text-slate-300">Success Rate</span>
                                    <span className="font-semibold text-lg text-green-400">
                                        {submission.totalPassedCodingProblems}/{submission.totalCodingProblems}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {submission.completedProblemIds.length > 0 ? (
                                        submission.completedProblemIds.map((problemId, index) => (
                                            <div
                                                key={problemId}
                                                className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg"
                                            >
                                                <CheckCircle2 className="h-4 w-4 text-green-400" />
                                                <span className="text-slate-300 text-sm">
                                                    Problem {index + 1} - Solved
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4 text-slate-400">
                                            No coding problems completed
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Assessment Details */}
                    <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-white text-xl">Assessment Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-white">Test Set Information</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Test Set ID:</span>
                                            <span className="text-slate-300">{submission.testSetId}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Submission ID:</span>
                                            <span className="text-slate-300">{submission._id}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Started At:</span>
                                            <span className="text-slate-300">
                                                {new Date(submission.startedAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Completed At:</span>
                                            <span className="text-slate-300">
                                                {submission.endAt
                                                    ? new Date(submission.endAt).toLocaleString()
                                                    : "In Progress"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-white">Performance Metrics</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Final Score:</span>
                                            <span className={`font-semibold ${getScoreColor(finalScore)}`}>
                                                {finalScore}%
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Quiz Score:</span>
                                            <span
                                                className={`font-semibold ${getScoreColor(submission.totalQuizScore)}`}
                                            >
                                                {submission.totalQuizScore}%
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Coding Success:</span>
                                            <span className="text-green-400 font-semibold">
                                                {submission.totalPassedCodingProblems}/{submission.totalCodingProblems}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Status:</span>
                                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                                {submission.submitted ? "Submitted" : "In Progress"}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Next Steps */}
                    <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-white text-xl">What Happens Next?</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <p className="text-slate-300 text-lg">
                                Thank you for completing your technical assessment! Here's what you can expect:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center space-y-3">
                                    <div className="bg-blue-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                                        <span className="text-blue-400 text-2xl font-bold">1</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-2">Review Process</h3>
                                        <p className="text-slate-400 text-sm">
                                            Our technical team will thoroughly review your solutions and provide
                                            detailed feedback
                                        </p>
                                    </div>
                                </div>
                                <div className="text-center space-y-3">
                                    <div className="bg-yellow-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                                        <span className="text-yellow-400 text-2xl font-bold">2</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-2">Results Notification</h3>
                                        <p className="text-slate-400 text-sm">
                                            You'll receive comprehensive results and feedback within 2-3 business days
                                        </p>
                                    </div>
                                </div>
                                <div className="text-center space-y-3">
                                    <div className="bg-green-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                                        <span className="text-green-400 text-2xl font-bold">3</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-2">Next Interview</h3>
                                        <p className="text-slate-400 text-sm">
                                            If successful, we'll schedule your next interview round with our team
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center pt-6">
                                <Button
                                    onClick={() => navigate("/")}
                                    size="lg"
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-blue-500/25"
                                >
                                    <Home className="h-5 w-5 mr-2" />
                                    Return to Dashboard
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PageTestSetCompleted;
