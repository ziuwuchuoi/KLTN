"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Save, X, Code, ExternalLink, Lightbulb, TestTube, FileCode } from "lucide-react";
import CustomDialog from "@/components/molecules/CustomDialog";
import { useCodeQueries } from "@/pages/LiveCoding/hooks/useCodeQueries";
import type { CodeProblem, CodeProblemDetail } from "@/services/code.service";

interface DialogCodeProps {
    isOpen: boolean;
    onClose: () => void;
    code: CodeProblem | null;
}

const difficultyColors = {
    Easy: { bg: "bg-green-900/20", text: "text-green-400", border: "border-green-500/30" },
    Medium: { bg: "bg-yellow-900/20", text: "text-yellow-400", border: "border-yellow-500/30" },
    Hard: { bg: "bg-red-900/20", text: "text-red-400", border: "border-red-500/30" },
};

export function DialogCode({ isOpen, onClose, code }: DialogCodeProps) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [editData, setEditData] = useState<Partial<CodeProblemDetail>>({});
    const [activeTab, setActiveTab] = useState("problem");

    const { useCodeProblemDetail, updateCodeProblem } = useCodeQueries();
    const { data: codeDetail, isLoading } = useCodeProblemDetail(code?._id || "");

    useEffect(() => {
        if (isOpen && codeDetail) {
            setEditData(codeDetail);
            setIsEditMode(false);
            setActiveTab("problem");
        }
    }, [isOpen, codeDetail]);

    const handleEdit = () => {
        setIsEditMode(true);
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        if (codeDetail) {
            setEditData(codeDetail);
        }
    };

    const handleSave = async () => {
        if (!code?._id) return;

        try {
            await updateCodeProblem.mutateAsync({
                problemId: code._id,
                data: editData,
            });
            setIsEditMode(false);
        } catch (error) {
            console.error("Failed to update code problem:", error);
        }
    };

    if (!code) return null;

    const difficultyConfig = difficultyColors[codeDetail?.difficulty || code.difficulty || "Easy"];

    return (
        <CustomDialog
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
                <div className="flex items-center justify-between w-full">
                    {isEditMode ? (
                        "Edit Code"
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold text-white leading-tight">
                                    {codeDetail?.title || code.title}
                                </h2>
                                <Badge
                                    variant="outline"
                                    className={`${difficultyConfig.bg} ${difficultyConfig.text} ${difficultyConfig.border}`}
                                >
                                    {codeDetail?.difficulty || code.difficulty}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                {(codeDetail?.sourceUrl || code.sourceUrl) && (
                                    <div className="flex items-center gap-1">
                                        <ExternalLink className="h-4 w-4" />
                                        <a
                                            href={codeDetail?.sourceUrl || code.sourceUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300"
                                        >
                                            Source
                                        </a>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {(codeDetail?.topicTags || code.topicTags)?.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="bg-purple-900/20 text-purple-400">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3">
                        {!isEditMode ? (
                            <Button
                                variant="outline"
                                onClick={handleEdit}
                                className="border-gray-600 hover:bg-gray-700"
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Problem
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={handleCancelEdit}
                                    className="border-gray-600 hover:bg-gray-700"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={updateCodeProblem.isPending}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {updateCodeProblem.isPending ? "Saving..." : "Save Changes"}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            }
            className="bg-slate-900 border-slate-700 w-[85%] h-[90%]"
            childrenContainerClassName="p-0 flex flex-col"
        >
            <div className="flex flex-col h-full">
                {isLoading ? (
                    <div className="flex items-center justify-center flex-1">
                        <div className="text-gray-400">Loading code problem...</div>
                    </div>
                ) : (
                    <div className="flex flex-col h-full">
                        <div>
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
                                    <TabsTrigger
                                        value="problem"
                                        className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
                                    >
                                        Problem
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="hints"
                                        className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
                                    >
                                        Hints
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="testcases"
                                        className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
                                    >
                                        Test Cases
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="snippets"
                                        className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
                                    >
                                        Code Snippets
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        <div className="flex-1 flex flex-col">
                            <Tabs value={activeTab} className="flex-1 flex flex-col">
                                <TabsContent value="problem" className="flex-1 flex flex-col m-0">
                                    <ScrollArea className="flex-1 mt-4">
                                        <Card className="bg-slate-800/50 border-slate-700">
                                            <CardContent className="p-6">
                                                <h3 className="text-lg font-semibold text-white mb-4">
                                                    Problem Description
                                                </h3>
                                                <div className="prose prose-invert max-w-none">
                                                    <div
                                                        className="text-gray-300 leading-relaxed"
                                                        dangerouslySetInnerHTML={{
                                                            __html: (codeDetail?.content || code.title || "").replace(
                                                                /\n/g,
                                                                "<br>"
                                                            ),
                                                        }}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </ScrollArea>
                                </TabsContent>

                                <TabsContent value="hints" className="flex-1 flex flex-col m-0">
                                    <ScrollArea className="flex-1 mt-4">
                                        <div className="space-y-4">
                                            {codeDetail?.hints && codeDetail.hints.length > 0 ? (
                                                codeDetail.hints.map((hint, index) => (
                                                    <Card key={index} className="bg-slate-800/50 border-slate-700">
                                                        <CardContent className="p-4">
                                                            <div className="flex gap-3">
                                                                <div className="bg-yellow-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium flex-shrink-0">
                                                                    <Lightbulb className="h-4 w-4" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <h4 className="font-medium text-white mb-2">
                                                                        Hint {index + 1}
                                                                    </h4>
                                                                    <p className="text-gray-300 leading-relaxed">
                                                                        {hint}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))
                                            ) : (
                                                <div className="text-center py-12">
                                                    <Lightbulb className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                                                    <p className="text-gray-400">No hints provided for this problem</p>
                                                </div>
                                            )}
                                        </div>
                                    </ScrollArea>
                                </TabsContent>

                                <TabsContent value="testcases" className="flex-1 flex flex-col m-0">
                                    <ScrollArea className="flex-1 mt-4">
                                        <div className="space-y-4">
                                            {codeDetail?.testcases && codeDetail.testcases.length > 0 ? (
                                                codeDetail.testcases.map((testcase, index) => (
                                                    <Card key={index} className="bg-slate-800/50 border-slate-700">
                                                        <CardContent className="p-6">
                                                            <div className="flex items-center gap-2 mb-4">
                                                                <TestTube className="h-5 w-5 text-green-400" />
                                                                <h4 className="font-semibold text-white">
                                                                    Test Case {index + 1}
                                                                </h4>
                                                            </div>

                                                            <div className="space-y-4">
                                                                {testcase.params && testcase.params.length > 0 && (
                                                                    <div>
                                                                        <h5 className="font-medium text-gray-300 mb-2">
                                                                            Parameters:
                                                                        </h5>
                                                                        <div className="space-y-2">
                                                                            {testcase.params.map(
                                                                                (param, paramIndex) => (
                                                                                    <div
                                                                                        key={paramIndex}
                                                                                        className="bg-slate-700/50 p-3 rounded-lg border border-slate-600"
                                                                                    >
                                                                                        <div className="flex items-center gap-2 text-sm">
                                                                                            <span className="text-blue-400 font-medium">
                                                                                                {param.name}
                                                                                            </span>
                                                                                            <span className="text-gray-400">
                                                                                                ({param.type}):
                                                                                            </span>
                                                                                            <code className="text-green-400 font-mono">
                                                                                                {param.value}
                                                                                            </code>
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                <div>
                                                                    <h5 className="font-medium text-gray-300 mb-2">
                                                                        Expected Output:
                                                                    </h5>
                                                                    <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600">
                                                                        <code className="text-blue-400 font-mono text-sm whitespace-pre-wrap">
                                                                            {testcase.expected}
                                                                        </code>
                                                                    </div>
                                                                </div>

                                                                {testcase.explanation && (
                                                                    <div>
                                                                        <h5 className="font-medium text-gray-300 mb-2">
                                                                            Explanation:
                                                                        </h5>
                                                                        <p className="text-gray-400 leading-relaxed">
                                                                            {testcase.explanation}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))
                                            ) : (
                                                <div className="text-center py-12">
                                                    <TestTube className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                                                    <p className="text-gray-400">
                                                        No test cases provided for this problem
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </ScrollArea>
                                </TabsContent>

                                <TabsContent value="snippets" className="flex-1 flex flex-col m-0">
                                    <ScrollArea className="flex-1 mt-4">
                                        <div className="space-y-4">
                                            {codeDetail?.codeSnippets && codeDetail.codeSnippets.length > 0 ? (
                                                codeDetail.codeSnippets.map((snippet, index) => (
                                                    <Card key={index} className="bg-slate-800/50 border-slate-700">
                                                        <CardContent className="p-6">
                                                            <div className="flex items-center gap-2 mb-4">
                                                                <FileCode className="h-5 w-5 text-blue-400" />
                                                                <h4 className="font-semibold text-white">
                                                                    {snippet.language}
                                                                </h4>
                                                            </div>

                                                            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600 overflow-x-auto">
                                                                <pre className="text-sm">
                                                                    <code className="text-gray-300 font-mono whitespace-pre-wrap">
                                                                        {snippet.code}
                                                                    </code>
                                                                </pre>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))
                                            ) : (
                                                <div className="text-center py-12">
                                                    <FileCode className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                                                    <p className="text-gray-400">
                                                        No code snippets provided for this problem
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </ScrollArea>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                )}
            </div>
        </CustomDialog>
    );
}
