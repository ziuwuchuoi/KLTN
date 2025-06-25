"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Lightbulb, TestTube, FileCode } from "lucide-react";
import type { CodeProblemDetail, CodeSnippets, ProblemTestCase } from "@/services/code.service";

interface CodeContentProps {
    displayData: Partial<CodeProblemDetail>;
    activeTab: string;
    onTabChange: (tab: string) => void;
    getHints: () => string[];
    getTestCases: () => ProblemTestCase[];
    getCodeSnippets: () => CodeSnippets[];
    getContent: () => string;
}

export function CodeContent({
    displayData,
    activeTab,
    onTabChange,
    getHints,
    getTestCases,
    getCodeSnippets,
    getContent,
}: CodeContentProps) {
    const hints = getHints();
    const testCases = getTestCases();
    const codeSnippets = getCodeSnippets();
    const content = getContent();

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
                                        <div className="prose prose-invert max-w-none">
                                            <div
                                                className="text-gray-300 leading-relaxed whitespace-pre-wrap"
                                                dangerouslySetInnerHTML={{
                                                    __html: content.replace(/\n/g, "<br>"),
                                                }}
                                            />
                                        </div>
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
                                                        <h4 className="font-medium text-white mb-2">
                                                            Hint {index + 1}
                                                        </h4>
                                                        <p className="text-gray-300 leading-relaxed">{hint}</p>
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

                    {/* Test Cases Tab */}
                    <TabsContent value="testcases" className="h-full m-0">
                        <ScrollArea className="h-full">
                            <div className="p-6 space-y-4">
                                {testCases.length > 0 ? (
                                    testCases.map((testcase, index) => (
                                        <Card key={index} className="bg-slate-800/50 border-slate-700">
                                            <CardContent className="p-6">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <TestTube className="h-5 w-5 text-green-400" />
                                                    <h4 className="font-semibold text-white">Test Case {index + 1}</h4>
                                                </div>

                                                <div className="space-y-4">
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

                                                    <div>
                                                        <h5 className="font-medium text-gray-300 mb-2">Explanation:</h5>
                                                        <p className="text-gray-400 leading-relaxed">
                                                            {testcase.explanation || "No explanation provided"}
                                                        </p>
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
                                                <div className="flex items-center gap-2 mb-4">
                                                    <FileCode className="h-5 w-5 text-blue-400" />
                                                    <h4 className="font-semibold text-white">{snippet.language}</h4>
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
                                        <p className="text-gray-400">No code snippets provided for this problem</p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
