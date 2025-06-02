import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Calendar, CheckCircle, Upload, Plus, X, Briefcase } from "lucide-react";
import { useCVQueries } from "../hooks/useFileQueries";
import { FileItem } from "../items/FileItem";

interface CVSelectionStepProps {
    selectedCVId: string;
    onCVSelect: (cvId: string) => void;
    selectedPosition: string;
    onPositionSelect: (position: string) => void;
    userId: string;
}

const positions = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Mobile Developer",
    "DevOps Engineer",
    "Data Scientist",
    "Product Manager",
    "UI/UX Designer",
    "Software Engineer",
    "Senior Software Engineer",
    "Tech Lead",
    "Engineering Manager",
];

export function CVSelectionStep({
    selectedCVId,
    onCVSelect,
    selectedPosition,
    onPositionSelect,
    userId,
}: CVSelectionStepProps) {
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

    return (
        <div className="w-full space-y-8">
            {/* Position Selection */}
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                        <Briefcase className="w-5 h-5 text-purple-400" />
                        Select Target Position
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Select value={selectedPosition} onValueChange={onPositionSelect}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue placeholder="Choose the position you're applying for" />
                        </SelectTrigger>
                        <SelectContent>
                            {positions.map((position) => (
                                <SelectItem key={position} value={position}>
                                    {position}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {/* CV Selection */}
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-white">
                            <FileText className="w-5 h-5 text-blue-400" />
                            Select Your CV
                        </CardTitle>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowUploadSection(!showUploadSection)}
                            className="border-slate-600 text-slate-300 hover:text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Upload New CV
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Upload Section */}
                    {showUploadSection && (
                        <Card className="bg-slate-700/30 border-slate-600">
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

                                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                                        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                                        <p className="text-slate-300 mb-2">Choose a file or drag it here</p>
                                        <p className="text-xs text-slate-400 mb-4">PDF, DOC, DOCX up to 5MB</p>

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
                    {isCVDataLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="p-4 bg-slate-700/50 rounded-lg animate-pulse">
                                    <div className="h-4 bg-slate-600 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-slate-600 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : cvs.length === 0 ? (
                        <div className="text-center py-12">
                            <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                            <h4 className="text-xl font-semibold text-white mb-2">No CVs Found</h4>
                            <p className="text-slate-400 mb-6">Upload your first CV to start evaluation.</p>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {cvs.map((cv) => (
                                <FileItem
                                    key={cv._id}
                                    id={cv._id}
                                    title={cv.fileName}
                                    date={cv.createdAt}
                                    selected={selectedCVId === cv._id}
                                    onSelect={() => onCVSelect(cv._id)}
                                    colorScheme="blue"
                                    icon={<FileText className="w-5 h-5 text-blue-400 flex-shrink-0" />}
                                    datePrefix="Uploaded"
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
