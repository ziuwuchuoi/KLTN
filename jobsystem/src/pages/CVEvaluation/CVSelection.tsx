import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { FileText, Calendar, CheckCircle, Upload, Plus, X } from "lucide-react";
import { useCVQueries } from "./hooks/useFileQueries";

interface CVSelectionSectionProps {
    selectedCVId: string;
    onCVSelect: (cvId: string) => void;
    userId: string;
}

export function CVSelectionSection({ selectedCVId, onCVSelect, userId }: CVSelectionSectionProps) {
    const [showUploadSection, setShowUploadSection] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const { cvs, isCVDataLoading, uploadCV } = useCVQueries(userId);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = [".pdf", ".doc", ".docx"];
        const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf("."));
        if (!allowedTypes.includes(fileExtension)) {
            alert("Please upload a PDF, DOC, or DOCX file");
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            alert("File size must be less than 5MB");
            return;
        }

        setIsUploading(true);

        uploadCV.mutate(file, {
            onSuccess: (newCV) => {
                onCVSelect(newCV._id);
                setShowUploadSection(false);
                setIsUploading(false);
            },
            onError: (error) => {
                console.error("Upload failed:", error);
                setIsUploading(false);
                alert("Failed to upload CV. Please try again.");
            },
        });
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="h-full flex flex-col">
            {/* Upload Toggle */}
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <h3 className="text-lg font-semibold text-white">Choose CV</h3>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowUploadSection(!showUploadSection)}
                    className="border-slate-600 text-slate-300 hover:text-white"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Upload New
                </Button>
            </div>

            {/* Upload Section */}
            {showUploadSection && (
                <Card className="bg-slate-700/30 border-slate-600 mb-4 flex-shrink-0">
                    <CardContent className="p-4">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium text-white">Upload New CV</h4>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowUploadSection(false)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="border-2 border-dashed border-slate-600 rounded-lg p-4 text-center">
                                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                                <p className="text-slate-300 mb-1 text-sm">Choose a file or drag it here</p>
                                <p className="text-xs text-slate-400 mb-3">PDF, DOC, DOCX up to 5MB</p>

                                <div className="relative">
                                    <Input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileUpload}
                                        disabled={isUploading}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={isUploading}
                                        className="border-slate-600 text-slate-300 hover:text-white"
                                    >
                                        {isUploading ? "Uploading..." : "Browse Files"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* CV List */}
            <div className="flex-1 min-h-0">
                {isCVDataLoading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="p-4 bg-slate-700/50 rounded-lg animate-pulse">
                                <div className="h-4 bg-slate-600 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-slate-600 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : cvs.length === 0 ? (
                    <div className="text-center py-8">
                        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-white mb-2">No CVs Found</h4>
                        <p className="text-slate-400 mb-4">Upload your first CV to start evaluation.</p>
                        <Button
                            variant="outline"
                            className="border-slate-600"
                            onClick={() => setShowUploadSection(true)}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Upload CV
                        </Button>
                    </div>
                ) : (
                    <ScrollArea className="h-full">
                        <div className="space-y-3 pr-2">
                            {cvs.map((cv) => (
                                <Card
                                    key={cv._id}
                                    className={`cursor-pointer transition-colors border ${
                                        selectedCVId === cv._id
                                            ? "bg-blue-600/20 border-blue-500/50"
                                            : "bg-slate-700/30 border-slate-600 hover:bg-slate-700/50"
                                    }`}
                                    onClick={() => onCVSelect(cv._id)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-3 flex-1">
                                                <FileText className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                                <div className="space-y-1 min-w-0 flex-1">
                                                    <h4 className="font-medium text-white text-sm leading-tight truncate">
                                                        {cv.fileName}
                                                    </h4>
                                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                                        <Calendar className="w-3 h-3 flex-shrink-0" />
                                                        <span className="truncate">
                                                            Uploaded {formatDate(cv.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            {selectedCVId === cv._id && (
                                                <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </div>
        </div>
    );
}
