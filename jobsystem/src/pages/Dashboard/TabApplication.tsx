"use client";

import { useState } from "react";
import type { ApplicationItem } from "@/services/file.service";
import { useApplicationQueries } from "../CVEvaluation/hooks/useFileQueries";
import { CustomTable } from "@/components/molecules/dashboard/CustomTable";
import { getApplicantionColumns } from "@/components/molecules/dashboard/columns";
import { DialogApplication } from "./dialogs/DialogApplication";
import { CustomPagination } from "@/components/molecules/CustomPagination";

const TabApplication = () => {
    const [selectedApplication, setSelectedApplication] = useState<ApplicationItem | null>(null);
    const [isViewApplicationOpen, setIsViewApplicationOpen] = useState(false);

    const { applications, isApplicationDataLoading } = useApplicationQueries();

    const handleApplicationClick = (applicationId: string) => {
        const application = applications?.find((app) => app._id === applicationId);
        if (application) {
            setSelectedApplication(application);
            setIsViewApplicationOpen(true);
        }
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
                data={applications || []}
                isLoading={isApplicationDataLoading}
                loadingMessage="Loading applications..."
                emptyMessage="No applications found"
                className="bg-slate-800/50 border-slate-700"
            />

            {/*Missing the pagination*/}

            <DialogApplication
                isOpen={isViewApplicationOpen}
                onClose={handleCloseViewApplication}
                application={selectedApplication}
            />
        </div>
    );
};

export default TabApplication;
