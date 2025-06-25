"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Lightbulb, TestTube, FileCode, Plus, Trash2 } from "lucide-react";
import type { CodeProblemDetail, CodeSnippets, ProblemTestCase } from "@/services/code.service";

interface CodeEditProps {
    editData: Partial<CodeProblemDetail>;
    activeTab: string;
    onTabChange: (tab: string) => void;
    onBasicInfoChange: (field: keyof CodeProblemDetail, value) => void;
    onHintChange: (index: number, value: string) => void;
    onAddHint: () => void;
    onRemoveHint: (index: number) => void;
    onTestCaseChange: (index: number, field: keyof ProblemTestCase, value) => void;
    onAddTestCase: () => void;
    onRemoveTestCase: (index: number) => void;
    onCodeSnippetChange: (index: number, field: keyof CodeSnippets, value: string) => void;
    onAddCodeSnippet: () => void;
    onRemoveCodeSnippet: (index: number) => void;
    getTopicTags: () => string[];
}

export function CodeEdit({
    editData,
    activeTab,
    onTabChange,
    onBasicInfoChange,
    onHintChange,
    onAddHint,
    onRemoveHint,
    onTestCaseChange,
    onAddTestCase,
    onRemoveTestCase,
    onCodeSnippetChange,
    onAddCodeSnippet,
    onRemoveCodeSnippet,
    getTopicTags,
}: CodeEditProps) {
    const hints = editData.hints || [];
    const testCases = editData.testcases || [];
    const codeSnippets = editData.codeSnippets || [];

    return (
        <div className="flex flex-col h-full">
            {/* Fixed Tabs Header */}
            <div className="flex-shrink-0 border-b border-slate-700">
                <Tabs value={activeTab} onValueChange={onTabChange}>
                    <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700 rounded-none">
                        <TabsTrigger
                            value="problem"
                            className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
                        >
                            <Code className="h-4 w-4 mr-2" />
                            Problem
                        </TabsTrigger>
                        <TabsTrigger
                            value="hints"
                            className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
                        >
                            <Lightbulb className="h-4 w-4 mr-2" />
                            Hints ({hints.length})
                        </TabsTrigger>
                        <TabsTrigger
                            value="testcases"
                            className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
                        >
                            <TestTube className="h-4 w-4 mr-2" />
                            Test Cases ({testCases.length})
                        </TabsTrigger>
                        <TabsTrigger
                            value="snippets"
                            className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
                        >
                            <FileCode className="h-4 w-4 mr-2" />
                            Code Snippets ({codeSnippets.length})
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-hidden">
                <Tabs value={activeTab} className="h-full">
                    {/* Problem Tab */}
                    <TabsContent value="problem" className="h-full m-0">
                        <ScrollArea className="h-full">
                            <div className="p-6">
                                <Card className="bg-slate-800/50 border-slate-700">
                                    <CardContent className="p-6">
                                        <h3 className="text-lg font-semibold text-white mb-4">Problem Description</h3>
                                        <Textarea
                                            value={editData.content || ""}
                                            onChange={(e) => onBasicInfoChange("content", e.target.value)}
                                            placeholder="Enter the problem description..."
                                            className="min-h-[400px] bg-slate-700 border-slate-600 text-white resize-none"
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    {/* Hints Tab */}
                    <TabsContent value="hints" className="h-full m-0">
                        <ScrollArea className="h-full">
                            <div className="p-6 space-y-4">
                                {hints.length > 0 ? (
                                    hints.map((hint, index) => (
                                        <Card key={index} className="bg-slate-800/50 border-slate-700">
                                            <CardContent className="p-4">
                                                <div className="flex gap-3">
                                                    <div className="bg-yellow-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium flex-shrink-0">
                                                        <Lightbulb className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h4 className="font-medium text-white">Hint {index + 1}</h4>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => onRemoveHint(index)}
                                                                className="text-red-400 hover:text-red-300"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                        <Textarea
                                                            value={hint}
                                                            onChange={(e) => onHintChange(index, e.target.value)}
                                                            placeholder="Enter hint..."
                                                            className="bg-slate-700 border-slate-600 text-white resize-none"
                                                            rows={3}
                                                        />
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

                                <Card className="bg-slate-800/30 border-slate-600 border-dashed">
                                    <CardContent className="p-6">
                                        <Button
                                            variant="outline"
                                            onClick={onAddHint}
                                            className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Hint
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    {/* Test Cases Tab */}
                    <TabsContent value="testcases" className="h-full m-0">
                        <ScrollArea className="h-full">
                            <div className="p-6 space-y-4">
                                {testCases.length > 0 ? (
                                    testCases.map((testcase, index) => (
                                        <Card key={index} className="bg-slate-800/50 border-slate-700">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <TestTube className="h-5 w-5 text-green-400" />
                                                        <h4 className="font-semibold text-white">
                                                            Test Case {index + 1}
                                                        </h4>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onRemoveTestCase(index)}
                                                        className="text-red-400 hover:text-red-300"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                <div className="space-y-4">
                                                    <div>
                                                        <h5 className="font-medium text-gray-300 mb-2">
                                                            Expected Output:
                                                        </h5>
                                                        <Textarea
                                                            value={testcase.expected}
                                                            onChange={(e) =>
                                                                onTestCaseChange(index, "expected", e.target.value)
                                                            }
                                                            placeholder="Enter expected output..."
                                                            className="bg-slate-700 border-slate-600 text-white resize-none font-mono"
                                                            rows={3}
                                                        />
                                                    </div>

                                                    <div>
                                                        <h5 className="font-medium text-gray-300 mb-2">Explanation:</h5>
                                                        <Textarea
                                                            value={testcase.explanation || ""}
                                                            onChange={(e) =>
                                                                onTestCaseChange(index, "explanation", e.target.value)
                                                            }
                                                            placeholder="Enter explanation (optional)..."
                                                            className="bg-slate-700 border-slate-600 text-white resize-none"
                                                            rows={2}
                                                        />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <TestTube className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                                        <p className="text-gray-400">No test cases provided for this problem</p>
                                    </div>
                                )}

                                <Card className="bg-slate-800/30 border-slate-600 border-dashed">
                                    <CardContent className="p-6">
                                        <Button
                                            variant="outline"
                                            onClick={onAddTestCase}
                                            className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Test Case
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    {/* Code Snippets Tab */}
                    <TabsContent value="snippets" className="h-full m-0">
                        <ScrollArea className="h-full">
                            <div className="p-6 space-y-4">
                                {codeSnippets.length > 0 ? (
                                    codeSnippets.map((snippet, index) => (
                                        <Card key={index} className="bg-slate-800/50 border-slate-700">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <FileCode className="h-5 w-5 text-blue-400" />
                                                        <Input
                                                            value={snippet.language}
                                                            onChange={(e) =>
                                                                onCodeSnippetChange(index, "language", e.target.value)
                                                            }
                                                            placeholder="Language (e.g., Python, JavaScript)"
                                                            className="bg-slate-700 border-slate-600 text-white"
                                                        />
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onRemoveCodeSnippet(index)}
                                                        className="text-red-400 hover:text-red-300"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                <Textarea
                                                    value={snippet.code}
                                                    onChange={(e) => onCodeSnippetChange(index, "code", e.target.value)}
                                                    placeholder="Enter code snippet..."
                                                    className="bg-slate-900 border-slate-600 text-white resize-none font-mono min-h-[200px]"
                                                />
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <FileCode className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                                        <p className="text-gray-400">No code snippets provided for this problem</p>
                                    </div>
                                )}

                                <Card className="bg-slate-800/30 border-slate-600 border-dashed">
                                    <CardContent className="p-6">
                                        <Button
                                            variant="outline"
                                            onClick={onAddCodeSnippet}
                                            className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Code Snippet
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
