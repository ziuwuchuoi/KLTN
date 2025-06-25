"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/stores/useAuthStore";
import { useQuizQueries } from "../Quizz/hooks/useQuizQueries";
import { CustomTable } from "@/components/molecules/dashboard/CustomTable";
import { getCodeColumns, getQuizColumns } from "@/components/molecules/dashboard/columns";
import { CodeProblem } from "@/services/code.service";
import { useCodeQueries } from "../LiveCoding/hooks/useCodeQueries";
import { QuizItem } from "@/services/quiz.service";
import { DialogQuiz } from "./dialogs/DialogQuiz";
import { DialogCreateCode } from "./dialogs/DialogCreateCode";
import { DialogCode } from "./dialogs/DialogCode";
import { DialogCreateQuiz } from "./dialogs/DialogCreateQuiz";
import { CustomPagination } from "@/components/molecules/CustomPagination";

const TabTestset = () => {
    const [activeTab, setActiveTab] = useState("quiz");
    const { user } = useAuthStore();
    const [selectedQuiz, setSelectedQuiz] = useState<Partial<QuizItem> | null>(null);
    const [isCreateQuizOpen, setIsCreateQuizOpen] = useState(false);
    const [isViewQuizOpen, setIsViewQuizOpen] = useState(false);

    const [codePage, setCodePage] = useState(1);
    const [quizPage, setQuizPage] = useState(1);

    const { technicalQuizzes, isLoadingQuizzes, paginationMeta } = useQuizQueries(user?._id, null, quizPage);

    const [selectedCode, setSelectedCode] = useState<CodeProblem | null>(null);
    const [isCreateCodeOpen, setIsCreateCodeOpen] = useState(false);
    const [isViewCodeOpen, setIsViewCodeOpen] = useState(false);

    const { codeProblems, isCodeProblemsLoading, pagination } = useCodeQueries(user?._id, null, null, codePage);

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

    const handleCodeClick = (codeId: string) => {
        const code = codeProblems?.find((c) => c._id === codeId);
        if (code) {
            setSelectedCode(code);
            setIsViewCodeOpen(true);
        }
    };

    const handleCreateCode = () => {
        setIsCreateCodeOpen(true);
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
                    <CustomTable
                        columns={getQuizColumns(handleQuizClick)}
                        data={technicalQuizzes || []}
                        isLoading={isLoadingQuizzes}
                        loadingMessage="Loading quizzes..."
                        emptyMessage="No quizzes found"
                        className="bg-slate-800/50 border-slate-700"
                    />
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-400">
                            Showing {(quizPage - 1) * paginationMeta.limit + 1} to{" "}
                            {Math.min(quizPage * paginationMeta.limit, paginationMeta.total)} of {paginationMeta.total}{" "}
                            Quizzes
                        </div>
                        <div>
                            <CustomPagination
                                currentPage={quizPage}
                                totalPages={paginationMeta.totalPages}
                                onPageChange={(newPage) => setQuizPage(newPage)}
                            />
                        </div>
                    </div>
                    <DialogCreateQuiz isOpen={isCreateQuizOpen} onClose={() => setIsCreateQuizOpen(false)} />
                    <DialogQuiz isOpen={isViewQuizOpen} onClose={() => setIsViewQuizOpen(false)} quiz={selectedQuiz} />
                </TabsContent>

                <TabsContent value="code" className="mt-6">
                    <CustomTable
                        columns={getCodeColumns(handleCodeClick)}
                        data={codeProblems || []}
                        isLoading={isCodeProblemsLoading}
                        loadingMessage="Loading code problems..."
                        emptyMessage="No code problems found"
                        className="bg-slate-800/50 border-slate-700"
                    />
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-400">
                            Showing {(codePage - 1) * pagination.limit + 1} to{" "}
                            {Math.min(codePage * pagination.limit, pagination.total)} of {pagination.total} Recruiters
                        </div>
                        <div>
                            <CustomPagination
                                currentPage={codePage}
                                totalPages={pagination.totalPages}
                                onPageChange={(newPage) => setCodePage(newPage)}
                            />
                        </div>
                    </div>

                    <DialogCreateCode isOpen={isCreateCodeOpen} onClose={() => setIsCreateCodeOpen(false)} />
                    <DialogCode isOpen={isViewCodeOpen} onClose={() => setIsViewCodeOpen(false)} code={selectedCode} />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default TabTestset;
