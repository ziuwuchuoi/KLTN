"use client";

import { useState, useEffect } from "react";
import { FileItem } from "@/pages/CVEvaluation/items/FileItem";
import type { EvaluatedCVItem } from "@/services/file.service";
import { BarChart3 } from "lucide-react";
import { DialogEvaluation } from "../dialogs/DialogEvaluation";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCVQueries, useEvaluationQueries, useJDQueries } from "@/pages/CVEvaluation/hooks/useFileQueries";

export function EvaluationContent() {
    const { user } = useAuthStore();
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [selectedEvaluation, setSelectedEvaluation] = useState<EvaluatedCVItem | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { evaluatedCVs, isEvaluatedCVDataLoading, useEvaluatedCVDetail } = useEvaluationQueries(user?._id);

    // Get detailed evaluation data when dialog is open
    const { data: evaluationDetail, isLoading: isEvaluationLoading } = useEvaluatedCVDetail(
        selectedEvaluation?._id || ""
    );

    // Get CV and JD data for the selected evaluation
    const { useCVDetail } = useCVQueries();
    const { useJDDetail } = useJDQueries();

    const { data: cvDetail, isLoading: isCVLoading } = useCVDetail(selectedEvaluation?.cvId || "");
    const { data: jdDetail, isLoading: isJDLoading } = useJDDetail(selectedEvaluation?.jdId || "");

    const handleSelect = (id: string) => {
        setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    };

    const handleViewDetail = (id: string) => {
        const evaluation = evaluatedCVs.find((evaluationItem) => evaluationItem._id === id);
        if (evaluation) {
            setSelectedEvaluation(evaluation);
            setIsDialogOpen(true);
        }
    };

    // Reset selected evaluation when dialog closes
    useEffect(() => {
        if (!isDialogOpen) {
            // Use a timeout to prevent flickering during dialog close animation
            const timer = setTimeout(() => {
                setSelectedEvaluation(null);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isDialogOpen]);

    if (isEvaluatedCVDataLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">CV Evaluations</h2>
                        <p className="text-gray-400">Review your CV evaluation results and feedback</p>
                    </div>
                </div>
                <div className="text-center py-8">
                    <p className="text-gray-400">Loading Evaluations...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">CV Evaluations</h2>
                        <p className="text-gray-400">Review your CV evaluation results and feedback</p>
                    </div>
                </div>

                {evaluatedCVs.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="bg-slate-800/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <BarChart3 className="h-8 w-8 text-slate-400" />
                        </div>
                        <p className="text-gray-400 mb-2">No evaluations available yet</p>
                        <p className="text-gray-500 text-sm">Submit your CV for evaluation to see results here</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {evaluatedCVs.map((evaluation) => (
                            <FileItem
                                key={evaluation._id}
                                id={evaluation._id}
                                title={`Evaluation #${evaluation._id.slice(-6)}`}
                                subtitle="CV Evaluation Report"
                                selected={selectedItems.includes(evaluation._id)}
                                colorScheme="purple"
                                date={new Date(evaluation.createdAt)}
                                datePrefix="Evaluated"
                                onSelect={handleSelect}
                                onViewDetail={handleViewDetail}
                                icon={<BarChart3 className="w-5 h-5 text-purple-400" />}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Custom Evaluation Dialog */}
            <DialogEvaluation
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                evaluation={evaluationDetail || null}
                cv={cvDetail || null}
                jd={jdDetail || null}
                isLoading={isEvaluationLoading || isCVLoading || isJDLoading}
            />
        </>
    );
}
