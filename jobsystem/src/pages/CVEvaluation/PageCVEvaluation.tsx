"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Zap, TrendingUp } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCVQueries, useJDQueries } from "./hooks/useFileQueries";
import { evaluateCVService } from "@/services/file.service";
import type { JDDetail, EvaluatedCVDetail } from "@/services/file.service";
import { CVSelectionSection } from "./CVSelection";
import { JDSelectionSection } from "./JDSelection";
import { EvaluationResults } from "./EvaluationResults";
import { RecommendationsSection } from "./RecommendationSection";
import CustomHeroSection from "@/components/molecules/CustomHeroSection";

const defaultJD: Partial<JDDetail> = {
    title: "",
    description: "",
    companyName: "",
    location: "",
    requirements: {
        experience: [""],
        skills: [""],
        education: [""],
        projects: [""],
        summary: "",
        certifications: [""],
        languages: [""],
    },
    benefits: [""],
    visibility: "private",
};

const PageEvaluateCV = () => {
    const { user } = useAuthStore();
    const [selectedCVId, setSelectedCVId] = useState<string>("");
    const [selectedJDId, setSelectedJDId] = useState<string>("");
    const [jdData, setJDData] = useState<Partial<JDDetail>>(defaultJD);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [evaluationResult, setEvaluationResult] = useState<EvaluatedCVDetail | null>(null);
    const [showResults, setShowResults] = useState(false);

    const resultsRef = useRef<HTMLDivElement>(null);

    const { uploadJD } = useJDQueries();

    const handleEvaluate = async () => {
        if (!selectedCVId || (!selectedJDId && !isJDDataValid())) return;

        setIsEvaluating(true);
        setShowResults(false);

        try {
            let jdIdToUse = selectedJDId;

            // If no JD selected, upload the manual JD data
            if (!selectedJDId && isJDDataValid()) {
                const uploadedJD = await uploadJD.mutateAsync(jdData);
                jdIdToUse = uploadedJD._id;
            }

            // Then evaluate CV against JD
            const result = await evaluateCVService(selectedCVId, jdIdToUse);

            setEvaluationResult(result);
            setShowResults(true);

            // Scroll to results after a short delay
            setTimeout(() => {
                resultsRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }, 500);
        } catch (error) {
            console.error("Evaluation failed:", error);
        } finally {
            setIsEvaluating(false);
        }
    };

    const isJDDataValid = () => {
        return (
            jdData.title?.trim() && jdData.description?.trim() && jdData.companyName?.trim() && jdData.location?.trim()
        );
    };

    const canEvaluate = selectedCVId && (selectedJDId || isJDDataValid()) && !isEvaluating;

    return (
        <div className="flex flex-col w-full">
            {/* Main Input Section - Max Screen Height */}
            <div className="max-h-screen flex flex-col px-6 py-8">
                <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0 mt-20">
                    {/* Input Grid */}
                    <div className="flex-1 grid lg:grid-cols-2 gap-6 min-h-0">
                        {/* CV Selection */}
                        <Card className="bg-slate-800/50 border-slate-700 flex flex-col min-h-0">
                            <CardHeader className="flex-shrink-0">
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold">1</span>
                                    </div>
                                    Select Your CV
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 min-h-0">
                                <CVSelectionSection
                                    selectedCVId={selectedCVId}
                                    onCVSelect={setSelectedCVId}
                                    userId={user._id}
                                />
                            </CardContent>
                        </Card>

                        {/* JD Selection/Input */}
                        <Card className="bg-slate-800/50 border-slate-700 flex flex-col min-h-0">
                            <CardHeader className="flex-shrink-0">
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold">2</span>
                                    </div>
                                    Job Description
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 min-h-0">
                                <JDSelectionSection
                                    selectedJDId={selectedJDId}
                                    onJDSelect={setSelectedJDId}
                                    jdData={jdData}
                                    onJDDataChange={setJDData}
                                    userId={user._id}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Evaluate Button */}
                    <div className="mt-6 text-center flex-shrink-0">
                        <Button
                            onClick={handleEvaluate}
                            disabled={!canEvaluate}
                            size="lg"
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            {isEvaluating ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                    Analyzing Your CV...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-5 h-5 mr-3" />
                                    Evaluate CV Match
                                </>
                            )}
                        </Button>
                        {!canEvaluate && !isEvaluating && (
                            <p className="text-slate-400 text-sm mt-2">Please select a CV and job description</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Results Section */}
            {showResults && evaluationResult && (
                <div ref={resultsRef} className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
                    <div className="max-w-7xl mx-auto px-6 py-16">
                        {/* Results Header */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 bg-green-600/20 text-green-400 px-4 py-2 rounded-full mb-4">
                                <TrendingUp className="w-4 h-4" />
                                Analysis Complete
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4">Your CV Evaluation Results</h2>
                            <p className="text-slate-300 max-w-2xl mx-auto">
                                Here's how your CV performs against the job requirements, along with personalized
                                recommendations.
                            </p>
                        </div>

                        {/* Evaluation Results */}
                        <EvaluationResults result={evaluationResult} />

                        {/* Recommendations */}
                        <RecommendationsSection evaluationResult={evaluationResult} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PageEvaluateCV;
