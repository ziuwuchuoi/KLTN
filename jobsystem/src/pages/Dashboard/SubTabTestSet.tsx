"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Clock, HelpCircle, Code, Trash2 } from "lucide-react";
import type { TestSetDetail } from "@/services/testset.service";

interface SubTabTestSetProps {
    testSetDetail: TestSetDetail;
    isTestSetLoading: boolean;
    onAddTestset: () => void;
    onRemoveQuiz: (quizId: string) => void;
    onRemoveCode: (codeId: string) => void;
}

export function SubTabTestSet({
    testSetDetail,
    isTestSetLoading,
    onAddTestset,
    onRemoveQuiz,
    onRemoveCode,
}: SubTabTestSetProps) {
    return (
        <div className="h-full flex flex-col">
            {/* Fixed Header for Test Sets */}
            <div className="p-6 border-b border-slate-700 bg-slate-900">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-white">Test Sets</h3>
                        <p className="text-gray-400 text-sm">Quizzes and coding problems linked to this job</p>
                    </div>
                    <Button onClick={onAddTestset} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Test Set
                    </Button>
                </div>
            </div>

            {/* Scrollable Test Sets Content */}
            <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                    <div className="p-6">
                        {isTestSetLoading ? (
                            <div className="text-center py-8 text-gray-400">Loading test sets...</div>
                        ) : (
                            <div className="space-y-6">
                                {/* Quizzes Section */}
                                <div>
                                    <h4 className="text-lg font-semibold text-white mb-4">Quiz Problems</h4>
                                    {testSetDetail?.quizzes && testSetDetail.quizzes.length > 0 ? (
                                        <div className="space-y-3">
                                            {testSetDetail.quizzes.map((quiz) => (
                                                <Card key={quiz._id} className="bg-slate-800/50 border-slate-700">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex-1">
                                                                <h5 className="font-medium text-white mb-2">
                                                                    {quiz.title}
                                                                </h5>
                                                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                                                    <div className="flex items-center gap-1">
                                                                        <HelpCircle className="h-4 w-4" />
                                                                        <span>
                                                                            {quiz.questions?.length || 0} questions
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <Clock className="h-4 w-4" />
                                                                        <span>{quiz.duration || 0} minutes</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-wrap gap-1 mt-2">
                                                                    {quiz.categories?.map((category, index) => (
                                                                        <Badge
                                                                            key={index}
                                                                            variant="secondary"
                                                                            className="bg-blue-900/20 text-blue-400 text-xs"
                                                                        >
                                                                            {category}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => onRemoveQuiz(quiz._id)}
                                                                className="text-red-400 hover:text-red-300"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-400">
                                            <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                                            <p>No quiz problems linked yet</p>
                                        </div>
                                    )}
                                </div>

                                {/* Code Problems Section */}
                                <div>
                                    <h4 className="text-lg font-semibold text-white mb-4">Code Problems</h4>
                                    {testSetDetail?.problems && testSetDetail.problems.length > 0 ? (
                                        <div className="space-y-3">
                                            {testSetDetail.problems.map((code) => (
                                                <Card key={code._id} className="bg-slate-800/50 border-slate-700">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-3 mb-2">
                                                                    <h5 className="font-medium text-white">
                                                                        {code.title}
                                                                    </h5>
                                                                    <Badge
                                                                        variant="outline"
                                                                        className={
                                                                            code.difficulty === "Easy"
                                                                                ? "bg-green-900/20 text-green-400 border-green-500/30"
                                                                                : code.difficulty === "Medium"
                                                                                  ? "bg-yellow-900/20 text-yellow-400 border-yellow-500/30"
                                                                                  : "bg-red-900/20 text-red-400 border-red-500/30"
                                                                        }
                                                                    >
                                                                        {code.difficulty}
                                                                    </Badge>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                                                                    <Code className="h-4 w-4" />
                                                                    <span>Problem #{code.problemId}</span>
                                                                </div>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {code.topicTags?.map((tag, index) => (
                                                                        <Badge
                                                                            key={index}
                                                                            variant="secondary"
                                                                            className="bg-purple-900/20 text-purple-400 text-xs"
                                                                        >
                                                                            {tag}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => onRemoveCode(code._id)}
                                                                className="text-red-400 hover:text-red-300"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-400">
                                            <Code className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                                            <p>No code problems linked yet</p>
                                        </div>
                                    )}
                                </div>

                                {/* Empty State */}
                                {(!testSetDetail?.quizzes || testSetDetail.quizzes.length === 0) &&
                                    (!testSetDetail?.problems || testSetDetail.problems.length === 0) && (
                                        <div className="text-center py-12">
                                            <div className="bg-slate-800/30 rounded-lg p-8">
                                                <div className="flex items-center justify-center mb-4">
                                                    <div className="bg-blue-600/20 p-3 rounded-full">
                                                        <Plus className="h-8 w-8 text-blue-400" />
                                                    </div>
                                                </div>
                                                <h4 className="text-lg font-medium text-white mb-2">
                                                    No test sets linked yet
                                                </h4>
                                                <p className="text-gray-400 mb-4">
                                                    Add quizzes and coding problems to create assessments for this job
                                                </p>
                                                <Button
                                                    onClick={onAddTestset}
                                                    className="bg-blue-600 hover:bg-blue-700"
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Add Your First Test Set
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
