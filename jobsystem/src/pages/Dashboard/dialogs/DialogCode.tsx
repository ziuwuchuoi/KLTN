"use client";

import { useState, useEffect } from "react";
import CustomDialog from "@/components/molecules/CustomDialog";
import { useCodeQueries } from "@/pages/LiveCoding/hooks/useCodeQueries";
import type { CodeProblemDetail, CodeSnippets, ProblemTestCase } from "@/services/code.service";
import { CodeHeader } from "../contents/CodeHeader";
import { CodeEdit } from "../contents/CodeEdit";
import { CodeContent } from "../contents/CodeContent";

interface DialogCodeProps {
    isOpen: boolean;
    onClose: () => void;
    codeProblem: CodeProblemDetail | null;
    onUpdate?: (updatedCodeProblem: CodeProblemDetail) => void;
}

const difficultyColors = {
    Easy: { bg: "bg-green-900/20", text: "text-green-400", border: "border-green-500/30" },
    Medium: { bg: "bg-yellow-900/20", text: "text-yellow-400", border: "border-yellow-500/30" },
    Hard: { bg: "bg-red-900/20", text: "text-red-400", border: "border-red-500/30" },
};

export function DialogCode({ isOpen, onClose, codeProblem, onUpdate }: DialogCodeProps) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [editData, setEditData] = useState<Partial<CodeProblemDetail>>({});
    const [activeTab, setActiveTab] = useState("problem");

    const { updateCodeProblem } = useCodeQueries();

    // Initialize data when dialog opens or codeProblem changes
    useEffect(() => {
        if (isOpen && codeProblem) {
            const newEditData = {
                ...codeProblem,
                hints: [...(codeProblem.hints || [])],
                testcases: codeProblem.testcases?.map((tc) => ({ ...tc, params: [...(tc.params || [])] })) || [],
                codeSnippets: codeProblem.codeSnippets?.map((cs) => ({ ...cs })) || [],
                topicTags: [...(codeProblem.topicTags || [])],
            };
            setEditData(newEditData);
            setIsEditMode(false);
            setActiveTab("problem");
        }
    }, [isOpen, codeProblem]);

    // Event handlers
    const handleEdit = () => setIsEditMode(true);

    const handleCancelEdit = () => {
        setIsEditMode(false);
        if (codeProblem) {
            setEditData({
                ...codeProblem,
                hints: [...(codeProblem.hints || [])],
                testcases: codeProblem.testcases?.map((tc) => ({ ...tc, params: [...(tc.params || [])] })) || [],
                codeSnippets: codeProblem.codeSnippets?.map((cs) => ({ ...cs })) || [],
                topicTags: [...(codeProblem.topicTags || [])],
            });
        }
    };

    const validateCodeData = (data: Partial<CodeProblemDetail>): { isValid: boolean; errors: string[] } => {
        const errors: string[] = [];
        if (!data.title?.trim()) errors.push("Title is required");
        if (!data.content?.trim()) errors.push("Problem content is required");
        if (!data.difficulty) errors.push("Difficulty is required");
        if (!data.topicTags || data.topicTags.length === 0) errors.push("At least one topic tag is required");
        return { isValid: errors.length === 0, errors };
    };

    const handleSave = async () => {
        if (!codeProblem?._id) return;

        try {
            const cleanedData: Partial<CodeProblemDetail> = {
                title: editData.title?.trim(),
                content: editData.content?.trim(),
                difficulty: editData.difficulty,
                topicTags: editData.topicTags?.filter((tag) => tag.trim()).map((tag) => tag.trim()) || [],
                hints: editData.hints?.filter((hint) => hint.trim()).map((hint) => hint.trim()) || [],
                testcases: editData.testcases?.filter((tc) => tc.expected?.trim()) || [],
                codeSnippets: editData.codeSnippets?.filter((cs) => cs.code?.trim() && cs.language?.trim()) || [],
                sourceUrl: editData.sourceUrl?.trim(),
            };

            const validation = validateCodeData(cleanedData);
            if (!validation.isValid) {
                alert(`Please fix the following errors:\n${validation.errors.join("\n")}`);
                return;
            }

            const updatedProblem = await updateCodeProblem.mutateAsync({
                problemId: codeProblem._id,
                data: cleanedData,
            });

            // Update the parent component's state with the fresh data
            if (onUpdate && updatedProblem) {
                onUpdate(updatedProblem);
            }

            setIsEditMode(false);
        } catch (error) {
            console.error("Failed to update code problem:", error);
        }
    };

    const handleBasicInfoChange = (field: keyof CodeProblemDetail, value) => {
        setEditData((prev) => ({ ...prev, [field]: value }));
    };

    // Hint handlers
    const handleHintChange = (index: number, value: string) => {
        setEditData((prev) => ({
            ...prev,
            hints: prev.hints?.map((hint, i) => (i === index ? value : hint)) || [],
        }));
    };

    const addHint = () => {
        setEditData((prev) => ({ ...prev, hints: [...(prev.hints || []), ""] }));
    };

    const removeHint = (index: number) => {
        setEditData((prev) => ({
            ...prev,
            hints: prev.hints?.filter((_, i) => i !== index) || [],
        }));
    };

    // Test case handlers
    const handleTestCaseChange = (index: number, field: keyof ProblemTestCase, value) => {
        setEditData((prev) => ({
            ...prev,
            testcases: prev.testcases?.map((tc, i) => (i === index ? { ...tc, [field]: value } : tc)) || [],
        }));
    };

    const addTestCase = () => {
        const newTestCase: ProblemTestCase = { params: [], expected: "", explanation: "" };
        setEditData((prev) => ({ ...prev, testcases: [...(prev.testcases || []), newTestCase] }));
    };

    const removeTestCase = (index: number) => {
        setEditData((prev) => ({
            ...prev,
            testcases: prev.testcases?.filter((_, i) => i !== index) || [],
        }));
    };

    // Code snippet handlers
    const handleCodeSnippetChange = (index: number, field: keyof CodeSnippets, value: string) => {
        setEditData((prev) => ({
            ...prev,
            codeSnippets: prev.codeSnippets?.map((cs, i) => (i === index ? { ...cs, [field]: value } : cs)) || [],
        }));
    };

    const addCodeSnippet = () => {
        const newSnippet: CodeSnippets = { language: "", code: "" };
        setEditData((prev) => ({ ...prev, codeSnippets: [...(prev.codeSnippets || []), newSnippet] }));
    };

    const removeCodeSnippet = (index: number) => {
        setEditData((prev) => ({
            ...prev,
            codeSnippets: prev.codeSnippets?.filter((_, i) => i !== index) || [],
        }));
    };

    // Helper functions
    const getDisplayData = () => (isEditMode ? editData : codeProblem);
    const getHints = (): string[] => (isEditMode ? editData.hints || [] : codeProblem?.hints || []);
    const getTestCases = (): ProblemTestCase[] =>
        isEditMode ? editData.testcases || [] : codeProblem?.testcases || [];
    const getCodeSnippets = (): CodeSnippets[] =>
        isEditMode ? editData.codeSnippets || [] : codeProblem?.codeSnippets || [];
    const getContent = (): string =>
        isEditMode ? editData.content || "" : codeProblem?.content || "No content available";
    const getTopicTags = (): string[] => (isEditMode ? editData.topicTags || [] : codeProblem?.topicTags || []);

    if (!codeProblem) {
        return (
            <CustomDialog open={isOpen} onOpenChange={onClose}>
                <div className="flex items-center justify-center p-8">
                    <div className="text-gray-400">No code problem provided.</div>
                </div>
            </CustomDialog>
        );
    }

    const displayData = getDisplayData();
    const difficultyConfig = difficultyColors[displayData?.difficulty || "Easy"];

    return (
        <CustomDialog
            key={`${codeProblem?._id}-${isOpen}`}
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    setIsEditMode(false);
                    onClose();
                }
            }}
            onClose={() => {
                setIsEditMode(false);
                onClose();
            }}
            dialogTitle={
                <CodeHeader
                    isEditMode={isEditMode}
                    editData={editData}
                    displayData={displayData}
                    difficultyConfig={difficultyConfig}
                    getTopicTags={getTopicTags}
                    onEdit={handleEdit}
                    onCancelEdit={handleCancelEdit}
                    onSave={handleSave}
                    onBasicInfoChange={handleBasicInfoChange}
                    isSaving={updateCodeProblem.isPending}
                />
            }
            className="bg-slate-900 border-slate-700 w-[90%] h-[90%]"
            childrenContainerClassName="p-0 flex flex-col"
        >
            <div className="flex flex-col h-full">
                {isEditMode ? (
                    <CodeEdit
                        editData={editData}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        onBasicInfoChange={handleBasicInfoChange}
                        onHintChange={handleHintChange}
                        onAddHint={addHint}
                        onRemoveHint={removeHint}
                        onTestCaseChange={handleTestCaseChange}
                        onAddTestCase={addTestCase}
                        onRemoveTestCase={removeTestCase}
                        onCodeSnippetChange={handleCodeSnippetChange}
                        onAddCodeSnippet={addCodeSnippet}
                        onRemoveCodeSnippet={removeCodeSnippet}
                        getTopicTags={getTopicTags}
                    />
                ) : (
                    <CodeContent
                        displayData={displayData}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        getHints={getHints}
                        getTestCases={getTestCases}
                        getCodeSnippets={getCodeSnippets}
                        getContent={getContent}
                    />
                )}
            </div>
        </CustomDialog>
    );
}
