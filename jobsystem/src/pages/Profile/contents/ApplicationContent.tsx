"use client";

import { useState } from "react";
import { FileItem } from "@/pages/CVEvaluation/items/FileItem";
import { useAuthStore } from "@/stores/useAuthStore";
import type { ApplicationItem, ApplicationStatus } from "@/services/file.service";
import { useApplicationQueries } from "@/pages/CVEvaluation/hooks/useFileQueries";
import { DialogApplication } from "../dialogs/DialogApplication";

export function ApplicationContent() {
    const { user } = useAuthStore();
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [selectedApplication, setSelectedApplication] = useState<ApplicationItem | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { applications, isApplicationDataLoading } = useApplicationQueries(user?._id);

    const handleSelect = (id: string) => {
        setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    };

    const handleViewDetail = (id: string) => {
        const application = applications.find((app) => app._id === id);
        if (application) {
            setSelectedApplication(application);
            setIsDialogOpen(true);
        }
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedApplication(null);
    };

    if (isApplicationDataLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Applications</h2>
                        <p className="text-gray-400">Track your job applications and their status</p>
                    </div>
                </div>
                <div className="text-center py-8">
                    <p className="text-gray-400">Loading Applications...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Applications</h2>
                        <p className="text-gray-400">Track your job applications and their status</p>
                    </div>
                </div>

                {applications.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400">No applications submitted yet</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {applications.map((application) => (
                            <FileItem
                                key={application._id}
                                id={application._id}
                                title={`Application #${application._id.slice(-6)}`}
                                subtitle="Job Application"
                                selected={selectedItems.includes(application._id)}
                                onSelect={handleSelect}
                                colorScheme="yellow"
                                date={new Date(application.createdAt)}
                                datePrefix="Applied"
                                onViewDetail={handleViewDetail}
                                status={application.status as ApplicationStatus}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Application Detail Dialog */}
            <DialogApplication isOpen={isDialogOpen} onClose={handleCloseDialog} application={selectedApplication} />
        </>
    );
}
