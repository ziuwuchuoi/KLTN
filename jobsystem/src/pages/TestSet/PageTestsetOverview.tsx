"use client";

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, Users } from "lucide-react";
import { useTestSetQueries } from "./hooks/useTestSetQueries";
import CustomHeroSection from "@/components/molecules/CustomHeroSection";
import TestSetItemsDisplay from "./TestsetDisplay";

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
            const submission = await startTestSet.mutateAsync(testSetId);
            if (submission) {
                navigate(`/testset/${testSetId}/${jdId}/take?submissionId=${submission._id}`);
            }
        } catch (error) {
            console.error("Failed to start test set:", error);
            setIsStarting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen bg-gradient-to-b from-zinc-950 via-slate-900 to-gray-900 text-white">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-white">Loading test set...</div>
                </div>
            </div>
        );
    }

    if (error || !testSetDetail) {
        return (
            <div className="flex flex-col min-h-screen bg-gradient-to-b from-zinc-950 via-slate-900 to-gray-900 text-white">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-red-400">Error loading test set</div>
                </div>
            </div>
        );
    }

    const totalQuizzes = testSetDetail.quizzes?.length || 0;
    const totalProblems = testSetDetail.problems?.length || 0;
    const totalItems = totalQuizzes + totalProblems;

    return (
        <div className="flex flex-col p-6 pt-40 w-full">
            {/* Fixed Section */}
            <div className="flex flex-row items-end w-full justify-around mb-10">
                <CustomHeroSection title="Coding" subtitle="Center" align="center" />
            </div>

            {/* Test Set Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Summary Card */}
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Test Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Total Items:</span>
                            <Badge variant="outline" className="text-white">
                                {totalItems}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Duration:</span>
                            <div className="flex items-center gap-1 text-white">
                                <Clock className="h-4 w-4" />
                                <span>{testSetDetail.duration} minutes</span>
                            </div>
                        </div>
                        <div className="pt-4">
                            <Button
                                onClick={handleStartTestSet}
                                disabled={isStarting || startTestSet.isPending}
                                className="w-full bg-green-600 hover:bg-green-700"
                                size="lg"
                            >
                                <Play className="h-5 w-5 mr-2" />
                                {isStarting || startTestSet.isPending ? "Starting..." : "Start Test Set"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Test Set Items Display */}
                <div className="lg:col-span-2">
                    <TestSetItemsDisplay
                        quizzes={testSetDetail.quizzes}
                        problems={testSetDetail.problems}
                        layout="grid"
                    />
                </div>
            </div>

            {/* Instructions */}
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white">Instructions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-gray-300">
                    <div className="flex items-start gap-3">
                        <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mt-0.5">
                            1
                        </div>
                        <div>
                            <p className="font-medium">Start the Test Set</p>
                            <p className="text-sm text-gray-400">
                                Click "Start Test Set" to begin your assessment timer
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mt-0.5">
                            2
                        </div>
                        <div>
                            <p className="font-medium">Complete All Items</p>
                            <p className="text-sm text-gray-400">
                                You can choose any order to complete quiz problems and code problems
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mt-0.5">
                            3
                        </div>
                        <div>
                            <p className="font-medium">Submit Individual Items</p>
                            <p className="text-sm text-gray-400">
                                Each item will be submitted individually as you complete them
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mt-0.5">
                            4
                        </div>
                        <div>
                            <p className="font-medium">Final Submission</p>
                            <p className="text-sm text-gray-400">
                                After completing all items, submit the entire test set to finish your assessment
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PageTestSetOverview;
