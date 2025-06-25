"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/stores/useAuthStore";
import { useQuizQueries } from "../Quizz/hooks/useQuizQueries";
import { CustomTable } from "@/components/molecules/dashboard/CustomTable";
import { getCodeColumns, getQuizColumns } from "@/components/molecules/dashboard/columns";
import { getCodeProblemDetailService, type CodeProblemDetail } from "@/services/code.service";
import { useCodeQueries } from "../LiveCoding/hooks/useCodeQueries";
import type { QuizItem } from "@/services/quiz.service";
import { DialogQuiz } from "./dialogs/DialogQuiz";
import { DialogCreateCode } from "./dialogs/DialogCreateCode";

import { DialogCreateQuiz } from "./dialogs/DialogCreateQuiz";
import { CustomPagination } from "@/components/molecules/CustomPagination";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DialogCode } from "./dialogs/DialogCode";

const TabTestset = () => {
    const [activeTab, setActiveTab] = useState("quiz");
    const { user } = useAuthStore();
    const [selectedQuiz, setSelectedQuiz] = useState<Partial<QuizItem> | null>(null);
    const [isCreateQuizOpen, setIsCreateQuizOpen] = useState(false);
    const [isViewQuizOpen, setIsViewQuizOpen] = useState(false);

    const [codePage, setCodePage] = useState(1);
    const [quizPage, setQuizPage] = useState(1);

    const { technicalQuizzes, isLoadingQuizzes, paginationMeta } = useQuizQueries(user?._id, null, quizPage);

    const [selectedCodeProblem, setSelectedCodeProblem] = useState<CodeProblemDetail | null>(null);
    const [isCreateCodeOpen, setIsCreateCodeOpen] = useState(false);
    const [isViewCodeOpen, setIsViewCodeOpen] = useState(false);

    const { codeProblems, isCodeProblemsLoading, pagination, useCodeProblemDetail } = useCodeQueries(
        user?._id,
        null,
        null,
        codePage
    );
    const codeProblemDetailHook = useCodeProblemDetail;

    const handleQuizClick = (quizId: string) => {
        const quiz = technicalQuizzes?.find((q) => q._id === quizId);
        if (quiz) {
            setSelectedQuiz(quiz);
            setIsViewQuizOpen(true);
        }
    };

    const handleCreateQuiz = () => {
        setIsCreateQuizOpen(true);
    };

    const handleCodeClick = async (codeId: string) => {
        try {
            const codeDetail = await getCodeProblemDetailService(codeId);
            if (codeDetail) {
                setSelectedCodeProblem(codeDetail);
                setIsViewCodeOpen(true);
            }
        } catch (error) {
            console.error("Failed to fetch code problem detail:", error);
        }
    };
    const handleCreateCode = () => {
        setIsCreateCodeOpen(true);
    };

    const handleCodeProblemUpdate = (updatedCodeProblem: CodeProblemDetail) => {
        setSelectedCodeProblem(updatedCodeProblem);
    };

    return (
        <div className="w-full">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white">Test Sets</h1>
                <p className="text-gray-400 mt-1">Manage quiz and coding problems for assessments</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-800 border-slate-700">
                    <TabsTrigger
                        value="quiz"
                        className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
                    >
                        Quiz Problems
                    </TabsTrigger>
                    <TabsTrigger
                        value="code"
                        className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
                    >
                        Code Problems
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="quiz" className="mt-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-white">Quiz Problems</h2>
                            <p className="text-gray-400 text-sm">Manage your technical quiz questions</p>
                        </div>
                        <Button onClick={handleCreateQuiz} className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Quiz
                        </Button>
                    </div>
                    <CustomTable
                        columns={getQuizColumns(handleQuizClick)}
                        data={technicalQuizzes || []}
                        isLoading={isLoadingQuizzes}
                        loadingMessage="Loading quizzes..."
                        emptyMessage="No quizzes found"
                        className="bg-slate-800/50 border-slate-700"
                    />

                    {paginationMeta.total > 0 && (
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-slate-400">
                                Showing {(quizPage - 1) * paginationMeta.limit + 1} to{" "}
                                {Math.min(quizPage * paginationMeta.limit, paginationMeta.total)} of{" "}
                                {paginationMeta.total} Quizzes
                            </div>
                            <div>
                                <CustomPagination
                                    currentPage={quizPage}
                                    totalPages={paginationMeta.totalPages}
                                    onPageChange={(newPage) => setQuizPage(newPage)}
                                />
                            </div>
                        </div>
                    )}

                    <DialogCreateQuiz isOpen={isCreateQuizOpen} onClose={() => setIsCreateQuizOpen(false)} />
                    <DialogQuiz isOpen={isViewQuizOpen} onClose={() => setIsViewQuizOpen(false)} quiz={selectedQuiz} />
                </TabsContent>

                <TabsContent value="code" className="mt-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-white">Code Problems</h2>
                            <p className="text-gray-400 text-sm">Manage your coding challenges</p>
                        </div>
                        <Button onClick={handleCreateCode} className="bg-purple-600 hover:bg-purple-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Problem
                        </Button>
                    </div>
                    <CustomTable
                        columns={getCodeColumns(handleCodeClick)}
                        data={codeProblems || []}
                        isLoading={isCodeProblemsLoading}
                        loadingMessage="Loading code problems..."
                        emptyMessage="No code problems found"
                        className="bg-slate-800/50 border-slate-700"
                    />

                    {pagination.total > 0 && (
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-slate-400">
                                Showing {(codePage - 1) * pagination.limit + 1} to{" "}
                                {Math.min(codePage * pagination.limit, pagination.total)} of {pagination.total} Problems
                            </div>
                            <div>
                                <CustomPagination
                                    currentPage={codePage}
                                    totalPages={pagination.totalPages}
                                    onPageChange={(newPage) => setCodePage(newPage)}
                                />
                            </div>
                        </div>
                    )}

                    <DialogCreateCode isOpen={isCreateCodeOpen} onClose={() => setIsCreateCodeOpen(false)} />
                    <DialogCode
                        isOpen={isViewCodeOpen}
                        onClose={() => {
                            setIsViewCodeOpen(false);
                            setSelectedCodeProblem(null);
                        }}
                        codeProblem={selectedCodeProblem}
                        onUpdate={handleCodeProblemUpdate}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default TabTestset;
