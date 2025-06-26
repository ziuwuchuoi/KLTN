"use client";

import { useState } from "react";
import type { ApplicationDetail, ApplicationItem } from "@/services/file.service";
import { useApplicationQueries } from "../CVEvaluation/hooks/useFileQueries";
import { CustomTable } from "@/components/molecules/dashboard/CustomTable";
import { getApplicantionColumns } from "@/components/molecules/dashboard/columns";
import { DialogApplication } from "./dialogs/DialogApplication";
import { CustomPagination } from "@/components/molecules/CustomPagination";

const TabApplication = () => {
    const [selectedApplication, setSelectedApplication] = useState<ApplicationItem | null>(null);
    const [isViewApplicationOpen, setIsViewApplicationOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 20;

    const { applicationsForRecruiter, isApplicationForRecruiterDataLoading, paginationForRecruiter } =
        useApplicationQueries(null, null, limit, currentPage);

    console.log("appRec", applicationsForRecruiter);

    const handleApplicationClick = async (applicationId: string) => {
        try {
            const application = applicationsForRecruiter?.find((app) => app._id === applicationId);
            if (application) {
                // Pass the ApplicationItem instead of fetching ApplicationDetail here
                setSelectedApplication(application);
                setIsViewApplicationOpen(true);
            }
        } catch (error) {
            console.error("Failed to fetch application:", error);
        }
    };

    const handleApplicationUpdate = (updatedApplication: ApplicationDetail) => {
        // Update the selected application with the new data
        if (selectedApplication && updatedApplication._id === selectedApplication._id) {
            const updatedItem: ApplicationItem = {
                ...selectedApplication,
                status: updatedApplication.status,
                updatedAt: updatedApplication.updatedAt,
            };
            setSelectedApplication(updatedItem);
        }
        console.log("Application updated:", updatedApplication);
    };

    const handleCloseViewApplication = () => {
        setIsViewApplicationOpen(false);
        setSelectedApplication(null);
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Applications</h1>
                    <p className="text-gray-400 mt-1">Manage and track job applications</p>
                </div>
            </div>

            <CustomTable
                columns={getApplicantionColumns(handleApplicationClick)}
                data={applicationsForRecruiter || []}
                isLoading={isApplicationForRecruiterDataLoading}
                loadingMessage="Loading applications..."
                emptyMessage="No applications found"
                className="bg-slate-800/50 border-slate-700"
            />

            {paginationForRecruiter.total > 0 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-400">
                        Showing {(currentPage - 1) * paginationForRecruiter.limit + 1} to{" "}
                        {Math.min(currentPage * paginationForRecruiter.limit, paginationForRecruiter.total)} of{" "}
                        {paginationForRecruiter.total} Applications
                    </div>
                    <div>
                        <CustomPagination
                            currentPage={currentPage}
                            totalPages={paginationForRecruiter.totalPages}
                            onPageChange={(newPage) => setCurrentPage(newPage)}
                        />
                    </div>
                </div>
            )}

            <DialogApplication
                isOpen={isViewApplicationOpen}
                onClose={handleCloseViewApplication}
                application={selectedApplication}
                onUpdate={handleApplicationUpdate}
            />
        </div>
    );
};

export default TabApplication;
