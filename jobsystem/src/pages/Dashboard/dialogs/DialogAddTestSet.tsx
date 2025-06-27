"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import CustomDialog from "@/components/molecules/CustomDialog";
import { useQuizQueries } from "@/pages/Quizz/hooks/useQuizQueries";
import { useCodeQueries } from "@/pages/LiveCoding/hooks/useCodeQueries";
import { useAuthStore } from "@/stores/useAuthStore";

import type { CodeProblem } from "@/services/code.service";
import { QuizItem } from "@/services/quiz.service";
import { CheckCircle2, Clock, Code, HelpCircle, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTestSetQueries } from "@/pages/TestSet/hooks/useTestSetQueries";

interface DialogAddTestSetProps {
    isOpen: boolean;
    onClose: () => void;
    jdId: string;
}

export function DialogAddTestSet({ isOpen, onClose, jdId }: DialogAddTestSetProps) {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState("quiz");

    console.log("jdId", jdId);
    const [selectedQuizzes, setSelectedQuizzes] = useState<string[]>([]);
    const [selectedCodes, setSelectedCodes] = useState<string[]>([]);

    const { technicalQuizzes, isLoadingQuizzes } = useQuizQueries(user?._id);
    const { codeProblems, isCodeProblemsLoading } = useCodeQueries(user?._id);

    const { linkTestSet, useTestSetByJD } = useTestSetQueries();

    const handleQuizSelect = (quizId: string, checked: boolean) => {
        if (checked) {
            setSelectedQuizzes((prev) => [...prev, quizId]);
        } else {
            setSelectedQuizzes((prev) => prev.filter((id) => id !== quizId));
        }
    };

    const handleCodeSelect = (codeId: string, checked: boolean) => {
        if (checked) {
            setSelectedCodes((prev) => [...prev, codeId]);
        } else {
            setSelectedCodes((prev) => prev.filter((id) => id !== codeId));
        }
    };

    const handleAddToJD = async () => {
        try {
            console.log("jdId in handle", jdId);
            await linkTestSet.mutateAsync({
                jdId: jdId,
                quizIds: selectedQuizzes,
                problemIds: selectedCodes,
                duration: 0,
            });

            // Reset selections and close dialog
            setSelectedQuizzes([]);
            setSelectedCodes([]);
            onClose();
        } catch (error) {
            console.error("Failed to link test sets:", error);
        }
    };

    const totalSelected = selectedQuizzes.length + selectedCodes.length;

    return (
        <CustomDialog
            open={isOpen}
            onOpenChange={onClose}
            onClose={onClose}
            dialogTitle="Add Test Sets to Job"
            description="Select quizzes and coding problems to link with this job description"
            className="bg-slate-900 border-slate-700 w-[80%] h-[80%]"
            childrenContainerClassName="p-0 flex flex-col"
        >
            <div className="flex flex-col h-full">
                <div>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2 bg-slate-800 border-slate-700">
                            <TabsTrigger
                                value="quiz"
                                className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
                            >
                                Quiz Problems ({selectedQuizzes.length})
                            </TabsTrigger>
                            <TabsTrigger
                                value="code"
                                className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
                            >
                                Code Problems ({selectedCodes.length})
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <div className="flex-1 overflow-hidden">
                    <Tabs value={activeTab} className="h-full">
                        <TabsContent value="quiz" className="h-full m-0">
                            <ScrollArea className="flex-1 mt-4">
                                <div className="p-2">
                                    {isLoadingQuizzes ? (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="text-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                                                <p className="text-gray-400">Loading quizzes...</p>
                                            </div>
                                        </div>
                                    ) : technicalQuizzes.length === 0 ? (
                                        <div className="text-center py-12">
                                            <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                                            <p className="text-gray-400">No quiz problems available</p>
                                        </div>
                                    ) : (
                                        <div className="grid gap-4">
                                            {technicalQuizzes.map((quiz: QuizItem) => (
                                                <Card
                                                    key={quiz._id}
                                                    className={`bg-slate-800/30 border-slate-700 hover:bg-slate-800/50 transition-all cursor-pointer ${
                                                        selectedQuizzes.includes(quiz._id)
                                                            ? "ring-2 ring-blue-500 bg-slate-800/60"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        handleQuizSelect(quiz._id, !selectedQuizzes.includes(quiz._id))
                                                    }
                                                >
                                                    <CardContent className="p-4">
                                                        <div className="flex items-start gap-3">
                                                            <Checkbox
                                                                checked={selectedQuizzes.includes(quiz._id)}
                                                                onCheckedChange={(checked) =>
                                                                    handleQuizSelect(quiz._id, checked as boolean)
                                                                }
                                                                className="mt-1"
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <h4 className="font-medium text-white truncate">
                                                                        {quiz.title}
                                                                    </h4>
                                                                    {selectedQuizzes.includes(quiz._id) && (
                                                                        <CheckCircle2 className="h-4 w-4 text-blue-400 flex-shrink-0" />
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                                                                    <div className="flex items-center gap-1">
                                                                        <HelpCircle className="h-3 w-3" />
                                                                        <span>
                                                                            {quiz.questions?.length || 0} questions
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <Clock className="h-3 w-3" />
                                                                        <span>{quiz.duration || 0} min</span>
                                                                    </div>
                                                                </div>
                                                                {quiz.categories && quiz.categories.length > 0 && (
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {quiz.categories
                                                                            .slice(0, 3)
                                                                            .map((category, index) => (
                                                                                <Badge
                                                                                    key={index}
                                                                                    variant="secondary"
                                                                                    className="bg-blue-900/30 text-blue-300 text-xs px-2 py-0.5"
                                                                                >
                                                                                    {category}
                                                                                </Badge>
                                                                            ))}
                                                                        {quiz.categories.length > 3 && (
                                                                            <Badge
                                                                                variant="secondary"
                                                                                className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5"
                                                                            >
                                                                                +{quiz.categories.length - 3}
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="code" className="h-full m-0">
                            <ScrollArea className="flex-1 mt-4">
                                <div className="p-2">
                                    {isCodeProblemsLoading ? (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="text-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                                                <p className="text-gray-400">Loading code problems...</p>
                                            </div>
                                        </div>
                                    ) : codeProblems.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Code className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                                            <p className="text-gray-400">No code problems available</p>
                                        </div>
                                    ) : (
                                        <div className="grid gap-4">
                                            {codeProblems.map((code: CodeProblem) => (
                                                <Card
                                                    key={code._id}
                                                    className={`bg-slate-800/30 border-slate-700 hover:bg-slate-800/50 transition-all cursor-pointer ${
                                                        selectedCodes.includes(code._id)
                                                            ? "ring-2 ring-blue-500 bg-slate-800/60"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        handleCodeSelect(code._id, !selectedCodes.includes(code._id))
                                                    }
                                                >
                                                    <CardContent className="p-4">
                                                        <div className="flex items-start gap-3">
                                                            <Checkbox
                                                                checked={selectedCodes.includes(code._id)}
                                                                onCheckedChange={(checked) =>
                                                                    handleCodeSelect(code._id, checked as boolean)
                                                                }
                                                                className="mt-1"
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <h4 className="font-medium text-white truncate">
                                                                        {code.title}
                                                                    </h4>
                                                                    <Badge
                                                                        variant="outline"
                                                                        className={`text-xs ${
                                                                            code.difficulty === "Easy"
                                                                                ? "bg-green-900/30 text-green-300 border-green-500/30"
                                                                                : code.difficulty === "Medium"
                                                                                  ? "bg-yellow-900/30 text-yellow-300 border-yellow-500/30"
                                                                                  : "bg-red-900/30 text-red-300 border-red-500/30"
                                                                        }`}
                                                                    >
                                                                        {code.difficulty}
                                                                    </Badge>
                                                                    {selectedCodes.includes(code._id) && (
                                                                        <CheckCircle2 className="h-4 w-4 text-blue-400 flex-shrink-0" />
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                                                                    <Code className="h-3 w-3" />
                                                                    <span>Problem #{code.problemId}</span>
                                                                </div>
                                                                {code.topicTags && code.topicTags.length > 0 && (
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {code.topicTags
                                                                            .slice(0, 3)
                                                                            .map((tag, index) => (
                                                                                <Badge
                                                                                    key={index}
                                                                                    variant="secondary"
                                                                                    className="bg-purple-900/30 text-purple-300 text-xs px-2 py-0.5"
                                                                                >
                                                                                    {tag}
                                                                                </Badge>
                                                                            ))}
                                                                        {code.topicTags.length > 3 && (
                                                                            <Badge
                                                                                variant="secondary"
                                                                                className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5"
                                                                            >
                                                                                +{code.topicTags.length - 3}
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Action Footer */}
                <div className="border-t border-slate-700 bg-slate-900/50 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            {totalSelected > 0 ? (
                                <>
                                    <CheckCircle2 className="h-4 w-4 text-blue-400" />
                                    <span className="text-blue-400 font-medium">
                                        {totalSelected} assessment{totalSelected !== 1 ? "s" : ""} selected
                                    </span>
                                </>
                            ) : (
                                <span>Select assessments to add to this job</span>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={onClose} className="border-slate-600 hover:bg-slate-700">
                                Cancel
                            </Button>
                            <Button
                                onClick={handleAddToJD}
                                disabled={totalSelected === 0 || linkTestSet.isPending}
                                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                            >
                                {linkTestSet.isPending ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add to Job {totalSelected > 0 && `(${totalSelected})`}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </CustomDialog>
    );
}
