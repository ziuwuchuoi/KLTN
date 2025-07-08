"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { FileItem } from "@/pages/CVEvaluation/items/FileItem";
import { useJDQueries } from "@/pages/CVEvaluation/hooks/useFileQueries";
import { useAuthStore } from "@/stores/useAuthStore";
import type { JDItem } from "@/services/file.service";

export function JDContent() {
    const { user } = useAuthStore();
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [selectedJD, setSelectedJD] = useState<JDItem | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { jds, isJDDataLoading } = useJDQueries(user._id, 1, 20, false);

    const handleSelect = (id: string) => {
        setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    };

    const handleViewDetail = (id: string) => {
        const jd = jds.find((jd) => jd._id === id);
        if (jd) {
            setSelectedJD(jd);
            setIsDialogOpen(true);
        }
    };

    if (isJDDataLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Job Descriptions</h2>
                        <p className="text-gray-400">Job descriptions you've created or saved</p>
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
                        <p className="text-gray-400">Job descriptions you've created or saved</p>
                    </div>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Create JD
                    </Button>
                </div>

                {jds.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400 mb-4">No job descriptions created yet</p>
                        <Button className="bg-purple-600 hover:bg-purple-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Your First JD
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {jds.map((jd) => (
                            <FileItem
                                key={jd._id}
                                id={jd._id}
                                title={jd.title}
                                subtitle={jd.position}
                                description={jd.location}
                                selected={selectedItems.includes(jd._id)}
                                colorScheme="purple"
                                date={new Date()}
                                datePrefix="Created"
                                onViewDetail={handleViewDetail}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* JD Detail Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-900 border-slate-700">
                    <DialogHeader>
                        <DialogTitle className="text-white text-xl">{selectedJD?.title}</DialogTitle>
                    </DialogHeader>

                    {selectedJD && (
                        <div className="space-y-6 text-white">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold text-gray-300 mb-2">Position</h3>
                                    <p>{selectedJD.position}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-300 mb-2">Company</h3>
                                    <p>{selectedJD.companyName}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-300 mb-2">Location</h3>
                                    <p>{selectedJD.location}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-300 mb-2">Visibility</h3>
                                    <p className="capitalize">{selectedJD.visibility}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-300 mb-2">Description</h3>
                                <p className="text-gray-200 leading-relaxed">{selectedJD.description}</p>
                            </div>

                            {selectedJD.benefits && selectedJD.benefits.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-gray-300 mb-2">Benefits</h3>
                                    <ul className="list-disc list-inside space-y-1">
                                        {selectedJD.benefits.map((benefit, index) => (
                                            <li key={index} className="text-gray-200">
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
