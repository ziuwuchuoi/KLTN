"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Play, Upload, Lightbulb, CheckCircle, Loader2 } from "lucide-react";
import { useCodeQueries } from "./hooks/useCodeQueries";
import { CodeEditor } from "@/components/molecules/code/CodeEditor";
import type { CodeLanguage, CodeSubmitResult } from "@/services/code.service";
import { difficultyColors } from "@/components/molecules/dashboard/columns";
import { useTestSetQueries } from "../TestSet/hooks/useTestSetQueries";
import type { TestSetSubmission } from "@/services/testset.service";
import { useToast } from "@/components/ui/use-toast";
import { ShowToast } from "@/components/utils/general.utils";
import { TestResultsDrawer } from "@/components/molecules/code/TestResultDrawer";

interface StoredSubmission extends TestSetSubmission {
    startTime: number;
    duration: number;
}

const PageProblemCodingDetail = () => {
    const { codingId: problemId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const testSetResultId = searchParams.get("submissionId");
    const returnUrl = searchParams.get("returnUrl");
    const isTestsetCode = location.pathname.startsWith("/testset/code/");

    const { useCodeProblemDetail, languages, submitCodeMutation, testCodeMutation } = useCodeQueries();
    const { data: problem, isLoading } = useCodeProblemDetail(problemId);
    const { submitCodeTestSet } = useTestSetQueries();
    const { toast } = useToast();

    const [selectedLanguage, setSelectedLanguage] = useState<CodeLanguage>(languages[0]);
    const [code, setCode] = useState("");
    const [showHints, setShowHints] = useState(false);
    const [submissionResult, setSubmissionResult] = useState<CodeSubmitResult | null>(null);
    const [testResult, setTestResult] = useState<CodeSubmitResult | null>(null);
    const [showResults, setShowResults] = useState(false);
    const [showTestResults, setShowTestResults] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTesting, setIsTesting] = useState(false);

    useEffect(() => {
        const handleCopy = (event: ClipboardEvent) => {
            event.preventDefault();
            ShowToast(toast, "error", "Copy feature is not allowed!");
        };

        document.addEventListener('copy', handleCopy);
        return () => {
            document.removeEventListener('copy', handleCopy);
        };
    }, []);

    useEffect(() => {
        if (languages.length > 0 && !selectedLanguage) {
            setSelectedLanguage(languages[0]);
        }
    }, [languages, selectedLanguage]);

    useEffect(() => {
        if (problem && problem.codeSnippets.length > 0 && selectedLanguage) {
            const matchingSnippet = problem.codeSnippets.find((snippet) =>
                selectedLanguage.name.toLowerCase().includes(snippet.language.toLowerCase())
            );
            if (matchingSnippet) {
                setCode(matchingSnippet.code);
            }
        }
    }, [problem, selectedLanguage]);

    const handleLanguageChange = (languageId: string) => {
        const langId = Number.parseInt(languageId);
        const newLanguage = languages.find((lang) => lang.id === langId);
        if (newLanguage) {
            setSelectedLanguage(newLanguage);
            if (problem && problem.codeSnippets.length > 0) {
                const matchingSnippet = problem.codeSnippets.find((snippet) =>
                    newLanguage.name.toLowerCase().includes(snippet.language.toLowerCase())
                );
                if (matchingSnippet) {
                    setCode(matchingSnippet.code);
                } else {
                    setCode(`// Write your ${newLanguage.name} solution here`);
                }
            }
        }
    };

    const updateLocalStorage = (problemId: string) => {
        if (testSetResultId) {
            const stored = localStorage.getItem(`testset_submission_${testSetResultId}`);
            if (stored) {
                try {
                    const submission: StoredSubmission = JSON.parse(stored);
                    if (!submission.completedProblemIds.includes(problemId)) {
                        const updatedSubmission = {
                            ...submission,
                            completedProblemIds: [...submission.completedProblemIds, problemId],
                        };
                        localStorage.setItem(
                            `testset_submission_${testSetResultId}`,
                            JSON.stringify(updatedSubmission)
                        );
                        window.dispatchEvent(
                            new CustomEvent("localStorageUpdate", {
                                detail: { submissionId: testSetResultId },
                            })
                        );
                    }
                } catch (error) {
                    console.error("Error updating localStorage:", error);
                }
            }
        }
    };

    const handleTestCode = async () => {
        if (!problem || !selectedLanguage) {
            console.error("Problem or language not selected");
            return;
        }

        if (!code.trim()) {
            console.error("No code to test");
            return;
        }

        setIsTesting(true);
        setShowTestResults(false);
        setTestResult(null);

        try {
            const result = await testCodeMutation.mutateAsync({
                sourceCode: code,
                languageId: selectedLanguage.id,
                problemId: problem.problemId,
            });

            setTestResult(result);
            setShowTestResults(true);

            setTimeout(() => {
                const resultsElement = document.getElementById("test-results");
                if (resultsElement) {
                    resultsElement.scrollIntoView({ behavior: "smooth" });
                }
            }, 100);
        } catch (error) {
            console.error("Test failed:", error);
        } finally {
            setIsTesting(false);
        }
    };

    const handleSubmit = async () => {
        if (!problem || !selectedLanguage) return;
        setIsSubmitting(true);
        try {
            if (isTestsetCode) {
                await submitCodeTestSet.mutateAsync({
                    sourceCode: code,
                    languageId: selectedLanguage.id,
                    problemId: problem.problemId,
                    testSetResultId: testSetResultId,
                });
                updateLocalStorage(problem._id);
                setIsSubmitted(true);
                setTimeout(() => {
                    if (returnUrl) {
                        navigate(returnUrl);
                    }
                }, 2000);
            } else {
                const result = await submitCodeMutation.mutateAsync({
                    sourceCode: code,
                    languageId: selectedLanguage.id,
                    problemId: problem.problemId,
                });
                setSubmissionResult(result);
                setShowResults(true);
            }
        } catch (error) {
            console.error("Submission failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRunCode = () => {
        handleTestCode();
    };

    const handleBackNavigation = () => {
        if (isTestsetCode && returnUrl) {
            navigate(returnUrl);
        } else if (isTestsetCode) {
            navigate(-1);
        } else {
            navigate("/code");
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col w-full h-screen bg-slate-900">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
                        <div className="text-slate-300">Loading problem...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (!problem) {
        return (
            <div className="flex flex-col w-full h-screen bg-slate-900">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4 text-white">Problem not found</h1>
                        <Button onClick={handleBackNavigation} variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {isTestsetCode ? "Back to Test Set" : "Back to Problems"}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full">
            {/* Main Content - Full Height */}
            <div className="pt-10 h-screen flex flex-col">
                <div className="flex-shrink-0">
                    <div className="px-6 pt-10 pb-3 mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleBackNavigation}
                                className="text-slate-400 hover:text-slate-900 text-sm font-semibold"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to {isTestsetCode ? "Test Set" : "Problems"}
                            </Button>
                        </div>
                        {isSubmitted && (
                            <div className="text-green-400 text-sm font-medium flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Solution Submitted Successfully
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex-1 grid lg:grid-cols-2 gap-6 px-6 pb-6 h-full">
                    <div className="flex flex-col h-full">
                        <Card className="flex-1 bg-slate-800/50 border-slate-700 flex flex-col">
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-white">
                                        <span>#{problem.problemId}</span>
                                        <h1 className="text-xl font-semibold">{problem.title}</h1>
                                        <Badge className={difficultyColors[problem.difficulty]}>
                                            {problem.difficulty}
                                        </Badge>
                                    </div>
                                </div>
                                <Tabs defaultValue="description" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                                        <TabsTrigger value="description">Description</TabsTrigger>
                                        <TabsTrigger value="submissions">Submissions</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="description" className="mt-4 flex-1">
                                        <ScrollArea className="h-[calc(100vh-280px)]">
                                            <div className="space-y-6 pr-4">
                                                <div
                                                    className="prose prose-invert max-w-none"
                                                    dangerouslySetInnerHTML={{ __html: problem.content }}
                                                />
                                                <div>
                                                    <h3 className="text-sm font-medium text-slate-400 mb-2">Topics</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {problem.topicTags.map((tag) => (
                                                            <Badge
                                                                key={tag}
                                                                variant="secondary"
                                                                className="bg-slate-700 text-slate-300 hover:text-slate-900"
                                                            >
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                {/* Hints */}
                                                {problem.hints.length > 0 && (
                                                    <div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setShowHints(!showHints)}
                                                            className="text-yellow-400 hover:text-slate-900"
                                                        >
                                                            <Lightbulb className="w-4 h-4 mr-2" />
                                                            {showHints ? "Hide" : "Show"} Hints ({problem.hints.length})
                                                        </Button>
                                                        {showHints && (
                                                            <div className="mt-2 space-y-2">
                                                                {problem.hints.map((hint, index) => (
                                                                    <div
                                                                        key={index}
                                                                        className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
                                                                    >
                                                                        <p className="text-sm text-yellow-200">
                                                                            <strong>Hint {index + 1}:</strong> {hint}
                                                                        </p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </ScrollArea>
                                    </TabsContent>
                                    <TabsContent value="submissions">
                                        <div className="text-center py-8 text-slate-400">
                                            Submission history would go here
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardHeader>
                        </Card>
                    </div>
                    {/* Right Panel - Code Editor */}
                    <div className="flex flex-col h-full">
                        <Card className="flex-1 bg-slate-800/50 border-slate-700 flex flex-col">
                            <CardHeader className="p-4 px-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Button
                                            variant="accent"
                                            size="sm"
                                            onClick={handleRunCode}
                                            disabled={isTesting || testCodeMutation.isPending}
                                            className="border-slate-700 mr-3 px-3"
                                        >
                                            {isTesting || testCodeMutation.isPending ? (
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <Play className="w-4 h-4 mr-2" />
                                            )}
                                            {isTesting || testCodeMutation.isPending ? "Testing..." : "Run"}
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={handleSubmit}
                                            disabled={submitCodeMutation.isPending || submitCodeTestSet.isPending}
                                            className="bg-green-600 hover:bg-green-700 px-3"
                                        >
                                            <Upload className="w-4 h-4 mr-2" />
                                            {submitCodeMutation.isPending || submitCodeTestSet.isPending
                                                ? "Submitting..."
                                                : "Submit"}
                                        </Button>
                                    </div>
                                    <Select value={selectedLanguage.id.toString()} onValueChange={handleLanguageChange}>
                                        <SelectTrigger className="w-fit bg-slate-700 border-slate-600 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {languages.map((lang) => (
                                                <SelectItem key={lang.id} value={lang.id.toString()}>
                                                    {lang.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 p-0 flex flex-col max-h-screen">
                                <div className={`flex-1 ${showResults || showTestResults ? "h-1/2" : "h-full"}`}>
                                    <CodeEditor
                                        value={code}
                                        onChange={setCode}
                                        language={selectedLanguage.name.toLowerCase()}
                                    />
                                </div>
                                {/* Success message for testset code */}
                                {isSubmitted && isTestsetCode && (
                                    <div className="p-4 bg-green-900/20 border-t border-green-500/30">
                                        <div className="text-center">
                                            <div className="text-green-400 font-semibold mb-2">Code Submitted!</div>
                                            <div className="text-green-300 text-sm">Returning to assessment...</div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
                {/* Test Results Drawer */}
                {submissionResult && (
                    <TestResultsDrawer
                        result={submissionResult}
                        isVisible={showResults}
                        onToggle={() => setShowResults(!showResults)}
                    />
                )}
                {/* Test Results Drawer for Run Code */}
                {testResult && (
                    <TestResultsDrawer
                        result={testResult}
                        isVisible={showTestResults}
                        onToggle={() => setShowTestResults(!showTestResults)}
                    />
                )}
            </div>
        </div>
    );
};

export default PageProblemCodingDetail;
