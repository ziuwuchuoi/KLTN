"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { JDItem } from "@/services/file.service";
import { useJDQueries } from "../CVEvaluation/hooks/useFileQueries";
import { CustomTable } from "@/components/molecules/dashboard/CustomTable";
import { getJDColumns } from "@/components/molecules/dashboard/columns";
import { DialogCreateJD } from "./dialogs/DialogCreateJD";
import { DialogJD } from "./dialogs/DialogJD";
import { useAuthStore } from "@/stores/useAuthStore";
import { CustomPagination } from "@/components/molecules/CustomPagination";

const TabJobDescription = () => {
    const { user } = useAuthStore();
    const [selectedJD, setSelectedJD] = useState<JDItem | null>(null);
    const [isViewJDOpen, setIsViewJDOpen] = useState(false);
    const [isCreateJDOpen, setIsCreateJDOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const { jds, isJDDataLoading, pagination } = useJDQueries(user._id, currentPage, 20);
    console.log("jds", jds);

    const handleJDClick = (jdId: string) => {
        const jd = jds?.find((jd) => jd._id === jdId);
        if (jd) {
            setSelectedJD(jd);
            setIsViewJDOpen(true);
        }
    };

    const handleCreateJDClick = () => {
        setIsCreateJDOpen(true);
    };

    const handleCloseCreateJD = () => {
        setIsCreateJDOpen(false);
    };

    const handleCloseViewJD = () => {
        setIsViewJDOpen(false);
        setSelectedJD(null);
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Job Descriptions</h1>
                    <p className="text-gray-400 mt-1">Manage and track job descriptions</p>
                </div>{" "}
                <Button variant="outline" className="border-gray-700 hover:bg-gray-800" onClick={handleCreateJDClick}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add JD
                </Button>
            </div>

            <CustomTable
                columns={getJDColumns(handleJDClick)}
                data={jds || []}
                isLoading={isJDDataLoading}
                loadingMessage="Loading job description..."
                emptyMessage="No active jds found"
                className="bg-slate-800/50 border-slate-700"
            />

            {pagination.total > 0 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-400">
                        Showing {(currentPage - 1) * pagination.limit + 1} to{" "}
                        {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} Job
                        descriptions
                    </div>
                    <div>
                        <CustomPagination
                            currentPage={currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={(newPage) => setCurrentPage(newPage)}
                        />
                    </div>
                </div>
            )}

            <DialogCreateJD isOpen={isCreateJDOpen} onClose={handleCloseCreateJD} />
            <DialogJD isOpen={isViewJDOpen} onClose={handleCloseViewJD} jd={selectedJD} />
        </div>
    );
};

export default TabJobDescription;
