"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CustomTable } from "@/components/molecules/dashboard/CustomTable";
import { useCandidateQueries } from "./hooks/useUserQueries";
import { getCandidateColumns } from "@/components/molecules/dashboard/columns";
import type { Candidate } from "@/services/candidate.service";
import { DialogCandidate } from "./dialogs/DialogCandidate";
import { CustomPagination } from "@/components/molecules/CustomPagination";

const TabCandidate = () => {
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 20;

    const { candidates, isCandidateLoading, pagination } = useCandidateQueries(currentPage, limit);

    const handleCandidateClick = (userId: string) => {
        const candidate = candidates?.find((c) => c.userId === userId);
        if (candidate) {
            setSelectedCandidate(candidate);
            setIsDialogOpen(true);
        }
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedCandidate(null);
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Candidates</h1>
                    <p className="text-gray-400 mt-1">Manage and track candidates</p>
                </div>
            </div>

            <CustomTable
                columns={getCandidateColumns(handleCandidateClick)}
                data={candidates || []}
                isLoading={isCandidateLoading}
                loadingMessage="Loading candidates..."
                emptyMessage="No candidates found"
                className="bg-slate-800/50 border-slate-700"
            />

            <div className="flex items-center justify-between">
                <div className="text-sm text-slate-400">
                    Showing {(currentPage - 1) * pagination.limit + 1} to{" "}
                    {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} Candidates
                </div>
                <div>
                    <CustomPagination
                        currentPage={currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={(newPage) => setCurrentPage(newPage)}
                    />
                </div>
            </div>

            <DialogCandidate isOpen={isDialogOpen} onClose={handleCloseDialog} candidate={selectedCandidate} />
        </div>
    );
};

export default TabCandidate;
