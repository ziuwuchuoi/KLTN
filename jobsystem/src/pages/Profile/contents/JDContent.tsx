"use client";

import { useState } from "react";
import { FileItem } from "@/pages/CVEvaluation/items/FileItem";
import { useAuthStore } from "@/stores/useAuthStore";
import type { JDItem } from "@/services/file.service";
import { useJDQueries } from "@/pages/CVEvaluation/hooks/useFileQueries";
import { DialogJD } from "../dialogs/DialogJD";

export function JDContent() {
    const { user } = useAuthStore();
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [selectedJD, setSelectedJD] = useState<JDItem | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { jds, isJDDataLoading } = useJDQueries(user?._id);

    const handleSelect = (id: string) => {
        setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    };

    const handleViewDetail = (id: string) => {
        const jd = jds.find((job) => job._id === id);
        if (jd) {
            setSelectedJD(jd);
            setIsDialogOpen(true);
        }
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedJD(null);
    };

    if (isJDDataLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Job Descriptions</h2>
                        <p className="text-gray-400">Manage your job postings and requirements</p>
                    </div>
                </div>
                <div className="text-center py-8">
                    <p className="text-gray-400">Loading Job Descriptions...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Job Descriptions</h2>
                        <p className="text-gray-400">Manage your job postings and requirements</p>
                    </div>
                </div>

                {jds.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400">No job descriptions created yet</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {jds.map((jd) => (
                            <FileItem
                                key={jd._id}
                                id={jd._id}
                                title={jd.title}
                                subtitle={jd.companyName}
                                description={`${jd.location} • ${jd.position}`}
                                selected={selectedItems.includes(jd._id)}
                                onSelect={handleSelect}
                                colorScheme="purple"
                                datePrefix="Created"
                                onViewDetail={handleViewDetail}
                                maxTitleLength={50}
                                maxSubtitleLength={40}
                                maxDescriptionLength={60}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* JD Detail Dialog */}
            <DialogJD isOpen={isDialogOpen} onClose={handleCloseDialog} jd={selectedJD} />
        </>
    );
}
