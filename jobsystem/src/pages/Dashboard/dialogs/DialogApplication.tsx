"use client";

import { useState, useEffect } from "react";
import CustomDialog from "@/components/molecules/CustomDialog";
import { useApplicationQueries } from "@/pages/CVEvaluation/hooks/useFileQueries";
import type { ApplicationItem, ApplicationStatus, ApplicationDetail } from "@/services/file.service";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import { ApplicationHeader } from "../contents/ApplicationHeader";
import { ApplicationContent } from "../contents/ApplicationContent";

interface DialogApplicationProps {
    isOpen: boolean;
    onClose: () => void;
    application: ApplicationItem | null;
    onUpdate?: (updatedApplication: ApplicationDetail) => void;
}

export function DialogApplication({ isOpen, onClose, application, onUpdate }: DialogApplicationProps) {
    const [currentStatus, setCurrentStatus] = useState<ApplicationStatus>("pending");
    const [originalStatus, setOriginalStatus] = useState<ApplicationStatus>("pending");
    const [hasStatusChanged, setHasStatusChanged] = useState(false);

    const { useApplicationDetail, updateApplicationStatus } = useApplicationQueries();
    const { data: applicationDetail, isLoading, error } = useApplicationDetail(application?._id || "");

    // Initialize status when data loads
    useEffect(() => {
        if (isOpen && applicationDetail) {
            const status = applicationDetail.status as ApplicationStatus;
            setCurrentStatus(status);
            setOriginalStatus(status);
            setHasStatusChanged(false);
        }
    }, [isOpen, applicationDetail]);

    const handleStatusChange = (newStatus: ApplicationStatus) => {
        setCurrentStatus(newStatus);
        setHasStatusChanged(newStatus !== originalStatus);
    };

    const handleSaveStatus = async () => {
        if (!application?._id || !hasStatusChanged) return;

        try {
            // Use the mutation and wait for it to complete
            const updatedResponse = await updateApplicationStatus.mutateAsync({
                apId: application._id,
                status: currentStatus,
            });

            // Update local state
            setOriginalStatus(currentStatus);
            setHasStatusChanged(false);

            // Notify parent component with the updated application detail
            if (onUpdate && applicationDetail) {
                const updatedApplication: ApplicationDetail = {
                    ...applicationDetail,
                    status: (updatedResponse.status as ApplicationStatus) || currentStatus,
                    updatedAt: new Date().toISOString(),
                };
                onUpdate(updatedApplication);
            }

            console.log("Application status updated successfully");
        } catch (error) {
            console.error("Failed to update application status:", error);
            // Reset to original status on error
            setCurrentStatus(originalStatus);
            setHasStatusChanged(false);
        }
    };

    const handleCancelStatusEdit = () => {
        setCurrentStatus(originalStatus);
        setHasStatusChanged(false);
    };

    const handleClose = () => {
        // Reset any unsaved changes
        if (hasStatusChanged) {
            setCurrentStatus(originalStatus);
            setHasStatusChanged(false);
        }
        onClose();
    };

    if (!application) {
        return (
            <CustomDialog open={isOpen} onOpenChange={handleClose}>
                <div className="flex items-center justify-center p-8">
                    <div className="text-gray-400">No application provided.</div>
                </div>
            </CustomDialog>
        );
    }

    if (isLoading) {
        return (
            <CustomDialog open={isOpen} onOpenChange={handleClose}>
                <div className="flex items-center justify-center p-8">
                    <div className="text-gray-400">Loading application details...</div>
                </div>
            </CustomDialog>
        );
    }

    if (error) {
        return (
            <CustomDialog open={isOpen} onOpenChange={handleClose}>
                <div className="flex items-center justify-center p-8">
                    <div className="text-red-400">Error loading application: {error.message}</div>
                </div>
            </CustomDialog>
        );
    }

    return (
        <CustomDialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    handleClose();
                }
            }}
            onClose={handleClose}
            dialogTitle={
                <ApplicationHeader
                    applicationDetail={applicationDetail}
                    currentStatus={currentStatus}
                    onStatusChange={handleStatusChange}
                />
            }
            className="bg-slate-900 border-slate-700 w-[90vw] h-[90vw] max-w-[1200px] max-h-[90vh] overflow-hidden"
            childrenContainerClassName="flex flex-col"
        >
            <ApplicationContent applicationDetail={applicationDetail} />

            {/* Fixed Footer with Cancel/Save buttons */}
            {hasStatusChanged && (
                <div className="pt-4">
                    <div className="flex items-center justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={handleCancelStatusEdit}
                            className="border-gray-600 hover:bg-gray-700 text-white"
                        >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveStatus}
                            disabled={updateApplicationStatus.isPending}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {updateApplicationStatus.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </div>
            )}
        </CustomDialog>
    );
}
