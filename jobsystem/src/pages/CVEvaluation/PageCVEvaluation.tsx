import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ChevronRight, Loader2 } from "lucide-react";
import { CVSelectionStep } from "./stepCV/CVSelectionStep";
import { JDSelectionStep } from "./stepJD/JDSelectionStep";
import { ReviewStep } from "./reviewStep/ReviewStep";
import { EvaluationResults } from "./resultStep/EvaluationResults";
import { RecommendationsSection } from "./resultStep/RecommendationSection";
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
    const { evaluateCV } = useEvaluationQueries();
    const [evaluationResult, setEvaluationResult] = useState<EvaluatedCVDetail | null>(null);
    const [showResults, setShowResults] = useState(false);

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

    return (
        <div className="flex flex-col p-6 w-full">
            {/* Fixed Section */}
            <div className="flex flex-row items-end w-full justify-around mt-20">
                <CustomHeroSection title="Coding" subtitle="Center" align="center" description="" />
            </div>

            <div className="flex flex-col min-h-screen">
                <div className="flex items-center justify-center mt-2">
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

                {/* Step Content */}
                <div className="flex flex-col min-h-screen">
                    <div className="w-[80%] mx-auto mt-6">
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
                                onEvaluate={handleEvaluate}
                                isEvaluating={isEvaluating}
                                canEvaluate={canEvaluate ? true : false}
                            />
                        )}

                        {/* Navigation Buttons */}
                        {!isEvaluating && (
                            <div className="flex justify-between mt-12">
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
                                ) : null}
                            </div>
                        )}

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
                </div>

                {/* Results Section */}
                {showResults && evaluationResult && (
                    <div ref={resultsRef} className="min-h-screen bg-gradient-to-b from-slate-950 to-black">
                        <div className="max-w-7xl mx-auto px-6 py-16">
                            {/* Results Header */}
                            <div className="text-center mb-12">
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

                            {/* Evaluation Results */}
                            <EvaluationResults result={evaluationResult} />

                            {/* Recommendations */}
                            <RecommendationsSection evaluationResult={evaluationResult} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageEvaluateCV;
