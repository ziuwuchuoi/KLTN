"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Building2, CheckCircle, Upload, FileText, X } from "lucide-react";
import { useJDQueries } from "../hooks/useFileQueries";
import { JDInputForm } from "./JDInput";
import { FileItem } from "../items/FileItem";
import type { JDDetail } from "@/services/file.service";

interface JDSelectionStepProps {
    selectedJDId: string;
    onJDSelect: (jdId: string) => void;
    jdData: Partial<JDDetail>;
    onJDDataChange: (data: Partial<JDDetail>) => void;
    userId: string;
}

export function JDSelectionStep({ selectedJDId, onJDSelect, jdData, onJDDataChange, userId }: JDSelectionStepProps) {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const { jds, isJDDataLoading, uploadJD } = useJDQueries(userId);

    const handleUpload = async () => {
        try {
            setIsUploading(true);

            uploadJD.mutate(jdData, {
                onSuccess: (newJD) => {
                    setShowCreateForm(false);
                    onJDSelect(newJD._id);
                    // Reset form data
                    onJDDataChange({
                        title: "",
                        position: "",
                        description: "",
                        companyName: "",
                        location: "",
                        requirements: {
                            experience: [""],
                            skills: [""],
                            education: [""],
                            projects: [""],
                            languages: [""],
                            certifications: [""],
                            summary: "",
                        },
                        benefits: [""],
                        visibility: "private",
                    });
                },
            });
        } catch (error) {
            console.error("Failed to upload JD:", error);
        }
    };

    const handleBackToSelection = () => {
        setShowCreateForm(false);
    };

    return (
        <div className="w-full space-y-8">
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-white">
                            <FileText className="w-5 h-5 text-blue-400" />
                            Select Your JD
                        </CardTitle>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowCreateForm(!showCreateForm)}
                            className="border-slate-600 text-slate-300 hover:text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Upload New JD
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 overflow-y-auto">
                    {/* Upload Section */}
                    {showCreateForm ? (
                        <Card className="bg-slate-700/30 border-slate-600">
                            <CardContent className="p-4">
                                <div className="space-y-6">
                                    {/* Header with back button */}
                                    <div className="flex items-center gap-4">
                                        <Button
                                            variant="ghost"
                                            onClick={handleBackToSelection}
                                            className="text-slate-300 hover:text-white"
                                        >
                                            ← Back to Selection
                                        </Button>
                                    </div>

                                    {/* Form */}
                                    <JDInputForm
                                        jdData={jdData}
                                        onJDDataChange={onJDDataChange}
                                        onSubmit={handleUpload}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="text-white font-semibold">
                            Your list of JDs
                            {/* CV List */}
                            {isJDDataLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="p-4 bg-slate-700/50 rounded-lg animate-pulse">
                                            <div className="h-4 bg-slate-600 rounded w-3/4 mb-2"></div>
                                            <div className="h-3 bg-slate-600 rounded w-1/2"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : jds.length === 0 ? (
                                <div className="text-center py-12">
                                    <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                                    <h4 className="text-xl font-semibold text-white mb-2">No JDs Found</h4>
                                    <p className="text-slate-400 mb-6">Upload your first JD to start evaluation.</p>
                                    <Button
                                        variant="outline"
                                        className="border-slate-600"
                                        onClick={() => setShowCreateForm(true)}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Upload JD
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                    {jds.map((jd) => (
                                        <FileItem
                                            key={jd._id}
                                            id={jd._id}
                                            title={jd.title}
                                            subtitle={jd.companyName}
                                            description={`We are looking for a ${jd.title.toLowerCase()}...`}
                                            selected={selectedJDId === jd._id}
                                            onSelect={onJDSelect}
                                            colorScheme="purple"
                                            icon={<Building2 className="w-5 h-5 text-purple-400 flex-shrink-0" />}
                                            maxTitleLength={50}
                                            maxSubtitleLength={40}
                                            maxDescriptionLength={60}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
