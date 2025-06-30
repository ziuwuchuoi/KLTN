import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    ArrowLeft,
    Play,
    Upload,
    Lightbulb,
    CheckCircle,
    XCircle,
    Clock,
    MemoryStick,
    AlertCircle,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { useCodeQueries } from "./hooks/useCodeQueries";
import { CodeEditor } from "@/components/molecules/code/CodeEditor";
import type { CodeLanguage, CodeSubmitResult } from "@/services/code.service";
import { difficultyColors } from "@/components/molecules/dashboard/columns";
import { useTestSetQueries } from "../TestSet/hooks/useTestSetQueries";
import type { TestSetSubmission } from "@/services/testset.service";

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

    const { useCodeProblemDetail, languages, submitCodeMutation } = useCodeQueries();
    const { data: problem, isLoading } = useCodeProblemDetail(problemId);
    const { submitCodeTestSet } = useTestSetQueries();

    const [selectedLanguage, setSelectedLanguage] = useState<CodeLanguage>(languages[0]);
    const [code, setCode] = useState("");
    const [showHints, setShowHints] = useState(false);
    const [submissionResult, setSubmissionResult] = useState<CodeSubmitResult | null>(null);
    const [showResults, setShowResults] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

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
                const submission: StoredSubmission = JSON.parse(stored);

                // Add problem ID to completed problems if not already present
                if (!submission.completedProblemIds.includes(problemId)) {
                    const updatedSubmission = {
                        ...submission,
                        completedProblemIds: [...submission.completedProblemIds, problemId],
                    };
                    localStorage.setItem(`testset_submission_${testSetResultId}`, JSON.stringify(updatedSubmission));
                }
            }
        }
    };

    const handleSubmit = async () => {
        if (!problem || !selectedLanguage) return;

        try {
            if (isTestsetCode) {
                // Use testset mutation
                await submitCodeTestSet.mutateAsync({
                    sourceCode: code,
                    languageId: selectedLanguage.id,
                    problemId: problem.problemId,
                    testSetResultId: testSetResultId,
                });

                // Update localStorage
                updateLocalStorage(problem._id);

                setIsSubmitted(true);

                // Navigate back to taking page after a short delay
                setTimeout(() => {
                    if (returnUrl) {
                        navigate(returnUrl);
                    }
                }, 2000);
            } else {
                // Use normal mutation
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
        }
    };

    const handleRunCode = () => {
        console.log("Running code with test cases...");
    };

    if (isLoading) {
        return (
            <div className="flex flex-col w-full pt-20">
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-pulse text-center">
                        <div className="h-8 bg-slate-700 rounded w-64 mb-4 mx-auto"></div>
                        <div className="h-4 bg-slate-700 rounded w-48 mx-auto"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!problem) {
        return (
            <div className="flex flex-col w-full pt-20">
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Problem not found</h1>
                        <Button onClick={() => navigate("/live-coding")} variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Problems
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full">
            {/* Main Content - Full Height */}
            <div className="pt-20 h-screen flex">
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
                                            className="border-slate-700 mr-3 px-3"
                                        >
                                            <Play className="w-4 h-4 mr-2" />
                                            Run
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
                                <div className={`flex-1 ${showResults ? "h-1/2" : "h-full"}`}>
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

                                {/* Submission Results */}
                                {submissionResult && showResults && (
                                    <div className="border-t border-slate-700">
                                        <div className="flex items-center justify-between p-4 bg-slate-800/50 border-b border-slate-700">
                                            <div className="flex items-center gap-2">
                                                {submissionResult.success ? (
                                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                                ) : (
                                                    <XCircle className="w-5 h-5 text-red-400" />
                                                )}
                                                <span className="font-semibold">
                                                    {submissionResult.success ? "Accepted" : "Failed"}
                                                </span>
                                                <span className="text-slate-400">
                                                    ({submissionResult.passedTests}/{submissionResult.totalTests} test
                                                    cases passed)
                                                </span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setShowResults(!showResults)}
                                            >
                                                {showResults ? (
                                                    <ChevronDown className="w-4 h-4" />
                                                ) : (
                                                    <ChevronUp className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </div>

                                        <div className="p-4 space-y-4 overflow-y-auto">
                                            {/* Overall Stats */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-slate-900/50 p-3 rounded-lg">
                                                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                                                        <CheckCircle className="w-4 h-4" />
                                                        Test Cases
                                                    </div>
                                                    <div className="text-lg font-semibold">
                                                        {submissionResult.passedTests}/{submissionResult.totalTests}
                                                    </div>
                                                </div>
                                                <div className="bg-slate-900/50 p-3 rounded-lg">
                                                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                                                        <AlertCircle className="w-4 h-4" />
                                                        Status
                                                    </div>
                                                    <div
                                                        className={`text-lg font-semibold ${submissionResult.success ? "text-green-400" : "text-red-400"}`}
                                                    >
                                                        {submissionResult.success ? "Accepted" : "Failed"}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Test Results */}
                                            <div className="space-y-3">
                                                <h4 className="font-semibold text-white">Test Results</h4>
                                                {submissionResult.testResults.map((result, index) => (
                                                    <Card
                                                        key={index}
                                                        className={`bg-slate-900/50 border-slate-700 ${result.passed ? "border-green-500/30" : "border-red-500/30"}`}
                                                    >
                                                        <CardHeader className="pb-2">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    {result.passed ? (
                                                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                                                    ) : (
                                                                        <XCircle className="w-4 h-4 text-red-400" />
                                                                    )}
                                                                    <span className="font-medium">
                                                                        Test Case {index + 1}
                                                                    </span>
                                                                    <Badge
                                                                        variant={
                                                                            result.passed ? "default" : "destructive"
                                                                        }
                                                                        className="text-xs"
                                                                    >
                                                                        {result.status.description}
                                                                    </Badge>
                                                                </div>
                                                                <div className="flex items-center gap-4 text-xs text-slate-400">
                                                                    <div className="flex items-center gap-1">
                                                                        <Clock className="w-3 h-3" />
                                                                        {result.time}ms
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <MemoryStick className="w-3 h-3" />
                                                                        {result.memory}KB
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </CardHeader>
                                                        {/* <CardContent className="pt-0">
                                                            <div className="grid grid-cols-1 gap-3 text-sm">
                                                                <div>
                                                                    <div className="text-slate-400 mb-1">Input:</div>
                                                                    <div className="bg-slate-800 p-2 rounded font-mono text-xs">
                                                                        {result.stdin || "No input"}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-slate-400 mb-1">
                                                                        Expected Output:
                                                                    </div>
                                                                    <div className="bg-slate-800 p-2 rounded font-mono text-xs">
                                                                        {result.expected_output}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-slate-400 mb-1">
                                                                        Your Output:
                                                                    </div>
                                                                    <div
                                                                        className={`bg-slate-800 p-2 rounded font-mono text-xs ${!result.passed ? "border border-red-500/30" : ""}`}
                                                                    >
                                                                        {result.stdout || "No output"}
                                                                    </div>
                                                                </div>
                                                                {result.stderr && (
                                                                    <div>
                                                                        <div className="text-red-400 mb-1">Error:</div>
                                                                        <div className="bg-red-900/20 border border-red-500/30 p-2 rounded font-mono text-xs text-red-300">
                                                                            {result.stderr}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </CardContent> */}
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageProblemCodingDetail;
