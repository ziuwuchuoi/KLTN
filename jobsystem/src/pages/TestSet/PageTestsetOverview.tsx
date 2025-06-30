"use client";

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, Sparkles, BookOpen } from "lucide-react";
import { useTestSetQueries } from "./hooks/useTestSetQueries";
import CustomHeroSection from "@/components/molecules/CustomHeroSection";
import TestSetItemsDisplay from "./TestsetDisplay";
import type { TestSetSubmission } from "@/services/testset.service";

const PageTestSetOverview = () => {
    const { testSetId, jdId } = useParams<{ testSetId: string; jdId: string }>();
    const navigate = useNavigate();
    const [isStarting, setIsStarting] = useState(false);

    const { useTestSetByJD, startTestSet } = useTestSetQueries();
    const { data: testSetDetail, isLoading, error } = useTestSetByJD(jdId!);

    const handleStartTestSet = async () => {
        if (!testSetId) return;

        setIsStarting(true);
        try {
            const submission: TestSetSubmission = await startTestSet.mutateAsync(testSetId);
            if (submission) {
                // Save submission to localStorage with start time
                const submissionWithTimer = {
                    ...submission,
                    startTime: Date.now(),
                    duration: testSetDetail?.duration || 0, // duration in minutes
                };
                localStorage.setItem(`testset_submission_${submission._id}`, JSON.stringify(submissionWithTimer));

                navigate(`/testset/${testSetId}/${jdId}/take?submissionId=${submission._id}`);
            }
        } catch (error) {
            console.error("Failed to start test set:", error);
            setIsStarting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-900 to-gray-900 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                    <p className="text-slate-300 font-medium">Loading your assessment...</p>
                </div>
            </div>
        );
    }

    if (error || !testSetDetail) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-900 to-gray-900 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-red-400 text-2xl">⚠</span>
                    </div>
                    <p className="text-red-400 font-medium">Unable to load assessment</p>
                </div>
            </div>
        );
    }

    const totalQuizzes = testSetDetail.quizzes?.length || 0;
    const totalProblems = testSetDetail.problems?.length || 0;
    const totalItems = totalQuizzes + totalProblems;

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-900 to-gray-900">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="relative px-6 pt-24 pb-12">
                    <div className="max-w-7xl mx-auto text-center">
                        <CustomHeroSection
                            title="Technical"
                            subtitle="Assessment"
                            description="Demonstrate your skills through our comprehensive evaluation"
                            align="center"
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 pb-12">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Sidebar - Guidelines & Start */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Start Card */}
                            <Card className="relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 backdrop-blur-sm sticky top-6">
                                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5"></div>
                                <CardHeader className="relative pb-4">
                                    <CardTitle className="flex items-center gap-3 text-white text-lg">
                                        <div className="p-2 bg-green-500/20 rounded-lg">
                                            <Sparkles className="h-5 w-5 text-green-400" />
                                        </div>
                                        Ready to Begin
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="relative space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400 text-sm font-medium">Items</span>
                                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-sm">
                                                {totalItems}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400 text-sm font-medium">Duration</span>
                                            <div className="flex items-center gap-2 text-slate-300">
                                                <Clock className="h-4 w-4 text-blue-400" />
                                                <span className="font-semibold text-sm">{testSetDetail.duration}m</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleStartTestSet}
                                        disabled={isStarting || startTestSet.isPending}
                                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-green-500/25"
                                    >
                                        {isStarting || startTestSet.isPending ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                                Starting...
                                            </>
                                        ) : (
                                            <>
                                                <Play className="h-5 w-5 mr-2" />
                                                Start Assessment
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Guidelines */}
                            <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 backdrop-blur-sm">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-3 text-white text-lg">
                                        <div className="p-2 bg-blue-500/20 rounded-lg">
                                            <BookOpen className="h-5 w-5 text-blue-400" />
                                        </div>
                                        Guidelines
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {[
                                        {
                                            step: "1",
                                            title: "Begin",
                                            description: "Start your timed assessment",
                                            color: "from-blue-500 to-cyan-500",
                                        },
                                        {
                                            step: "2",
                                            title: "Complete",
                                            description: "Work through all items",
                                            color: "from-purple-500 to-pink-500",
                                        },
                                        {
                                            step: "3",
                                            title: "Save",
                                            description: "Progress auto-saves",
                                            color: "from-orange-500 to-red-500",
                                        },
                                        {
                                            step: "4",
                                            title: "Submit",
                                            description: "Final submission",
                                            color: "from-green-500 to-emerald-500",
                                        },
                                    ].map((instruction, index) => (
                                        <div key={index} className="flex items-start gap-3 group">
                                            <div
                                                className={`w-8 h-8 rounded-full bg-gradient-to-r ${instruction.color} flex items-center justify-center text-white font-bold text-xs shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                                            >
                                                {instruction.step}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <h4 className="font-semibold text-white text-sm group-hover:text-blue-300 transition-colors">
                                                    {instruction.title}
                                                </h4>
                                                <p className="text-slate-400 text-xs leading-relaxed">
                                                    {instruction.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Main Content - Items Display */}
                        <div className="lg:col-span-3">
                            <TestSetItemsDisplay
                                quizzes={testSetDetail.quizzes}
                                problems={testSetDetail.problems}
                                layout="grid"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageTestSetOverview;
