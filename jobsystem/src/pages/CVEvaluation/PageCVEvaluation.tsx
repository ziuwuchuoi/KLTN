"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ChevronRight, Loader2, Zap } from "lucide-react";
import { CVSelectionStep } from "./stepCV/CVSelectionStep";
import { JDSelectionStep } from "./stepJD/JDSelectionStep";
import { ReviewStep } from "./reviewStep/ReviewStep";
import { EvaluationResults } from "./resultStep/EvaluationResults";
import { useAuthStore } from "@/stores/useAuthStore";
import type { JDDetail, EvaluatedCVDetail } from "@/services/file.service";
import { useEvaluationQueries } from "./hooks/useFileQueries";
import CustomHeroSection from "@/components/molecules/CustomHeroSection";

const defaultJD: Partial<JDDetail> = {
    title: "",
    description: "",
    companyName: "",
    location: "",
    requirements: {
        experience: [],
        skills: [],
        education: [],
        projects: [],
        summary: "",
        certifications: [],
        languages: [],
    },
    benefits: [],
    visibility: "private",
};

const mockEvaluatedCV: EvaluatedCVDetail = {
    _id: "cv_eval_123456",
    candidateId: "680e51fe748f15b33661d27a",
    cvId: "683f3eec31d65769c952b27b",
    jdId: "6862b9dd5a4edebd41979ef5",
    reviewCVResponse: {
        ai_review: {
            development_roadmap: [
                "Learn and implement RESTful API design in the next 6 months",
                "Participate in online communities and forums to gain more experience and insights from other Backend Developers",
                "Take online courses or certifications to improve skills in specific areas such as computer vision and machine learning",
            ],
            radar_chart_data: {
                candidate_scores: [6, 8, 8, 8, 9],
                jd_requirements: [7, 8, 9, 6, 8],
                labels: ["Expirience", "Education", "Hard skills", "Soft skills", "Projects"],
            },
            strengths: [
                "Strong background in building scalable and high-performance server-side applications",
                "Experience with multiple technologies such as Node.js, Express, TypeScript, and MongoDB",
                "Good understanding of computer vision and machine learning concepts through projects like Docinsight Application",
            ],
            suggestions: [
                "Focus on building RESTful API projects to improve skills in this area",
                "Consider taking online courses or certifications to gain more experience as a Backend Developer",
                "Practice English language skills to improve overall communication and collaboration",
            ],
            weaknesses: [
                "Limited experience with RESTful and GraphQL API design, which is required in the JD",
                "No direct experience as a Backend Developer, the position being applied for",
                "TOEIC certifications are not directly related to programming or backend development",
            ],
        },
        ats_check: {
            formatting_tips: [
                "Use readable fonts like Arial or Times New Roman, size 10-12.",
                "Avoid tables or images. Use bullet points for experience and skills.",
                "Structure CV with sections: 'Career Objective', 'Work Experience', 'Skills', 'Education'.",
            ],
            issues: ["No issues found"],
            missing_keywords: [
                "api design",
                "design",
                "commerce",
                "developer experience",
                "field project",
                "year backend",
                "developer associate",
                "experience backend",
                "strong",
                "education bachelor",
                "build scalable",
                "certification aws",
                "certify",
                "english good",
                "graphql",
                "science information",
                "backend development",
                "application certification",
                "good reading",
                "design education",
                "basic communication",
                "relate field",
                "good",
                "technology relate",
                "communication skill",
                "build backend",
                "basic",
                "science",
                "restful graphql",
                "communication",
                "high performance",
                "platform summary",
                "performance server",
                "backend developer",
                "bachelor",
                "high",
                "language english",
                "english",
                "summary experience",
                "background build",
                "reading basic",
                "degree",
                "development experience",
                "degree computer",
                "year",
                "language",
                "background",
                "certify developer",
                "associate",
                "scalable high",
                "graphql api",
                "bachelor degree",
                "server application",
                "position backend",
                "field",
                "developer strong",
                "development",
                "scalable",
                "experience year",
                "backend",
                "commerce platform",
                "platform",
                "aws certify",
                "summary",
                "experience restful",
                "relate",
                "backend commerce",
                "experience experience",
                "project build",
                "aws",
                "restful",
                "associate language",
                "strong background",
                "computer science",
            ],
            recommendations: ["No recommendations found"],
        },
        skills_analysis: {
            match_percent: 50,
            matched_skills: ["MongoDB", "Node.js", "Docker"],
            missing_skills: ["Nestjs", "Redis", "Aws"],
        },
        summary: {
            overall_score: 40,
            similarity_score: 67.2,
        },
    },
    createdAt: new Date("2025-06-23T10:00:00Z"),
    updatedAt: new Date("2025-06-23T11:00:00Z"),
};

const steps = [
    { id: 1, title: "Choose CV", description: "Select your CV and position" },
    { id: 2, title: "Job Description", description: "Select or create job requirements" },
    { id: 3, title: "Review & Evaluate", description: "Review and start evaluation" },
];

const PageEvaluateCV = () => {
    const { user } = useAuthStore();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedCVId, setSelectedCVId] = useState<string>("");
    const [selectedJDId, setSelectedJDId] = useState<string>("");
    const [jdData, setJDData] = useState<Partial<JDDetail>>(defaultJD);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const { evaluateCV, useEvaluatedCVDetail } = useEvaluationQueries();
    const [evaluationResult, setEvaluationResult] = useState<EvaluatedCVDetail | null>(null);
    const [showResults, setShowResults] = useState(false);

    // const [demoResult, setDemoResult] = useState<EvaluatedCVDetail | null>(null);
    const { data: demoResult } = useEvaluatedCVDetail("64b0f1a5c1b2fa00123a0005");

    const resultsRef = useRef<HTMLDivElement>(null);

    const isJDDataValid = () => {
        return (
            jdData.title?.trim() && jdData.description?.trim() && jdData.companyName?.trim() && jdData.location?.trim()
        );
    };

    const canProceedStep1 = selectedCVId;
    const canProceedStep2 = selectedJDId || isJDDataValid();
    const canEvaluate = selectedCVId && (selectedJDId || isJDDataValid());

    const handleNextStep = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleEvaluate = async (jdIdToUse?: string) => {
        if (!canEvaluate) return;

        setIsEvaluating(true);
        setShowResults(false);

        try {
            const finalJDId = jdIdToUse || selectedJDId;

            // Evaluate CV against JD
            const result = await evaluateCV.mutateAsync({ cvId: selectedCVId, jdId: finalJDId });

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

    const handleDemo = async () => {
        try {
            setIsEvaluating(true);
            setShowResults(false);

            if (demoResult) {
                setEvaluationResult(demoResult);
            }

            // Delay before showing results and scrolling
            setTimeout(() => {
                setShowResults(true);
                resultsRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }, 2000);
        } catch (error) {
            console.error("Demo evaluation failed:", error);
        } finally {
            setIsEvaluating(false);
        }
    };

    return (
        <div className="w-full">
            {/* First Screen - Steps Section (Full Height) */}
            <div className="min-h-screen flex flex-col">
                {/* Fixed Header Section */}
                <div className="flex-shrink-0">
                    {/* Hero Section */}
                    <div className="flex flex-row items-end w-full justify-around pt-20 pb-8">
                        <CustomHeroSection
                            title="CV Evaluation"
                            subtitle="Studio"
                            align="center"
                            description="Get instant, AI-powered feedback on your CV. Discover strengths, identify areas for improvement, and tailor your profile to your target job."
                        />
                    </div>

                    {/* Steps Progress */}
                    <div className="flex items-center justify-center pb-6">
                        <div className="flex items-center">
                            {steps.map((step, index) => (
                                <div key={step.id} className="flex items-center">
                                    <div className="flex flex-row items-center justify-center">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                                currentStep === step.id
                                                    ? "bg-purple-600 border-purple-600 text-white"
                                                    : currentStep > step.id
                                                      ? "bg-green-600 border-green-600 text-white"
                                                      : "bg-slate-800 border-slate-600 text-slate-400"
                                            }`}
                                        >
                                            {currentStep > step.id ? (
                                                <Check className="w-4 h-4" />
                                            ) : (
                                                <span className="text-sm font-semibold">{step.id}</span>
                                            )}
                                        </div>
                                        <div className="ml-3 text-left">
                                            <div
                                                className={`font-bold ${
                                                    currentStep === step.id
                                                        ? "text-purple-400"
                                                        : currentStep > step.id
                                                          ? "text-green-400"
                                                          : "text-slate-400"
                                                }`}
                                            >
                                                {step.title}
                                            </div>
                                            <div className="text-sm text-slate-500">{step.description}</div>
                                        </div>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <ChevronRight
                                            className={`w-6 h-6 mx-6 ${currentStep > step.id ? "text-green-400" : "text-slate-600"}`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Expandable Content Area */}
                <div className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-y-auto px-6">
                        {/* Consistent Width Container for All Steps */}
                        <div className="max-w-7xl mx-auto">
                            {/* Step 1: CV Selection */}
                            {currentStep === 1 && (
                                <CVSelectionStep
                                    selectedCVId={selectedCVId}
                                    onCVSelect={setSelectedCVId}
                                    userId={user._id}
                                />
                            )}

                            {/* Step 2: JD Selection */}
                            {currentStep === 2 && (
                                <JDSelectionStep
                                    selectedJDId={selectedJDId}
                                    onJDSelect={setSelectedJDId}
                                    jdData={jdData}
                                    onJDDataChange={setJDData}
                                    userId={user._id}
                                />
                            )}

                            {/* Step 3: Review */}
                            {currentStep === 3 && (
                                <ReviewStep
                                    selectedCVId={selectedCVId}
                                    selectedJDId={selectedJDId}
                                    jdData={jdData}
                                    // onEvaluate={handleEvaluate}
                                    onEvaluate={handleDemo}
                                    isEvaluating={isEvaluating}
                                    canEvaluate={canEvaluate ? true : false}
                                />
                            )}
                        </div>
                    </div>

                    {/* Fixed Navigation Buttons */}
                    {!isEvaluating && (
                        <div className="flex-shrink-0 flex justify-between px-6 py-8 border-t border-slate-800">
                            <Button
                                variant="outline"
                                onClick={handlePrevStep}
                                disabled={currentStep === 1}
                                className="border-slate-600 text-slate-300 hover:text-white"
                            >
                                Previous Step
                            </Button>
                            {currentStep < 3 ? (
                                <Button
                                    onClick={handleNextStep}
                                    disabled={
                                        (currentStep === 1 && !canProceedStep1) ||
                                        (currentStep === 2 && !canProceedStep2)
                                    }
                                    className="bg-purple-600 hover:bg-purple-700"
                                >
                                    Next Step
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => handleDemo()}
                                    disabled={!canEvaluate || isEvaluating}
                                    size="lg"
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
                                >
                                    <Zap className="w-5 h-5 mr-2" />
                                    {isEvaluating ? "Evaluating..." : "Start CV Evaluation"}
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {/* Loading State */}
                {isEvaluating && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                        <Card className="bg-slate-800 border-slate-700 p-8">
                            <CardContent className="flex flex-col items-center space-y-4">
                                <Loader2 className="w-12 h-12 animate-spin text-purple-400" />
                                <div className="text-center">
                                    <h3 className="text-xl font-semibold text-white mb-2">Analyzing Your CV</h3>
                                    <p className="text-slate-400">
                                        Our AI is evaluating your CV against the job requirements...
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            {/* Second Screen - Results Section (Starts from second viewport) */}
            {evaluationResult && (
                <div ref={resultsRef} className="min-h-screen">
                    <div className="w-[90%] mx-auto px-6 py-16">
                        <div className="text-center mb-12 pt-16">
                            <div className="inline-flex items-center gap-2 bg-green-600/20 text-green-400 px-4 py-2 rounded-full mb-4">
                                <Check className="w-4 h-4" />
                                Analysis Complete
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4">Your CV Evaluation Results</h2>
                            <p className="text-slate-300 max-w-2xl mx-auto">
                                Here's how your CV performs against the job requirements, along with personalized
                                recommendations.
                            </p>
                        </div>

                        <EvaluationResults result={evaluationResult} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PageEvaluateCV;
