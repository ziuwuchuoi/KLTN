"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Zap } from "lucide-react";
import CustomDialog from "@/components/molecules/CustomDialog";
import { CVSelectionStep } from "@/pages/CVEvaluation/stepCV/CVSelectionStep";
import { useEvaluationQueries } from "@/pages/CVEvaluation/hooks/useFileQueries";
import type { JDDetail, EvaluatedCVDetail } from "@/services/file.service";
import { EvaluationResults } from "@/pages/CVEvaluation/resultStep/EvaluationResults";

interface DialogReviewCVProps {
    isOpen: boolean;
    onClose: () => void;
    job: JDDetail;
    userId: string;
}

export default function DialogReviewCV({ isOpen, onClose, job, userId }: DialogReviewCVProps) {
    const [selectedCVId, setSelectedCVId] = useState("");
    const [evaluationResult, setEvaluationResult] = useState<EvaluatedCVDetail | null>(null);
    const [showCVSelection, setShowCVSelection] = useState(true);
    const [showResults, setShowResults] = useState(false);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const { evaluateCV } = useEvaluationQueries();
    const resultsRef = useRef<HTMLDivElement>(null);

    const handleEvaluate = async () => {
        if (!selectedCVId || !job._id) return;

        setShowResults(false);
        setIsEvaluating(true);

        try {
            const result = await evaluateCV.mutateAsync({ cvId: selectedCVId, jdId: job._id });
            setEvaluationResult(result);
            setShowResults(true);
            setTimeout(() => {
                resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 500);
        } catch (error) {
            console.error("Evaluation failed:", error);
        } finally {
            setIsEvaluating(false);
        }
    };

    const handleClose = () => {
        if (!isEvaluating) {
            onClose();
        }
    };

    return (
        <CustomDialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open && !isEvaluating) {
                    onClose();
                }
            }}
            onClose={handleClose}
            dialogTitle={`CV Evaluation for ${job.position}`}
            description={`Get insights on how well your CV matches this role at ${job.companyName}`}
            className="max-w-5xl bg-slate-900 border-slate-700 w-[80%] h-fit max-h-[80%]"
            childrenContainerClassName="p-0 flex flex-col"
        >
            <div className="flex flex-col h-full">
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto mb-4">
                    {showCVSelection && (
                        <div className={`relative ${isEvaluating ? "pointer-events-none opacity-60" : ""}`}>
                            <CVSelectionStep
                                selectedCVId={selectedCVId}
                                onCVSelect={setSelectedCVId}
                                userId={userId}
                                disabled={isEvaluating}
                            />
                            
                        </div>
                    )}

                    {showResults && evaluationResult && (
                        <div
                            ref={resultsRef}
                            className="min-h-screen bg-gradient-to-b from-slate-950 to-black px-6 py-16 -mx-6"
                        >
                            <div className="max-w-7xl mx-auto">
                                <div className="text-center mb-12">
                                    <div className="inline-flex items-center gap-2 bg-green-600/20 text-green-400 px-4 py-2 rounded-full mb-4">
                                        <Check className="w-4 h-4" />
                                        Analysis Complete
                                    </div>
                                    <h2 className="text-3xl font-bold text-white mb-4">Your CV Evaluation Results</h2>
                                    <p className="text-slate-300 max-w-2xl mx-auto">
                                        Here's how your CV performs against the job requirements, along with
                                        personalized recommendations.
                                    </p>
                                </div>

                                <EvaluationResults result={evaluationResult} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Fixed Footer with Action Buttons */}
                {showCVSelection && (
                    <div className="flex-shrink-0">
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleEvaluate}
                                disabled={!selectedCVId || evaluateCV.isPending}
                                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                            >
                                {evaluateCV.isPending ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                        Evaluating...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="h-4 w-4 mr-2" />
                                        Evaluate CV
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </CustomDialog>
    );
}
