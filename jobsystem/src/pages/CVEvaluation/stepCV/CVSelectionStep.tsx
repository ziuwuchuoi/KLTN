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

export function CVSelectionStep({ selectedCVId, onCVSelect, userId }: CVSelectionStepProps) {
    const [showUploadSection, setShowUploadSection] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadPosition, setUploadPosition] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const { cvs, isCVDataLoading, uploadCV } = useCVQueries(userId);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
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

        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile || !uploadPosition) return;

        setIsUploading(true);

        uploadCV.mutate(
            { file: selectedFile, position: uploadPosition },
            {
                onSuccess: (newCV) => {
                    onCVSelect(newCV._id);
                    setShowUploadSection(false);
                    setSelectedFile(null);
                    setUploadPosition("");
                    setIsUploading(false);
                },
                onError: (error) => {
                    console.error("Upload failed:", error);
                    setIsUploading(false);
                    alert("Failed to upload CV. Please try again.");
                },
            }
        );
    };

    const handleCancelUpload = () => {
        setShowUploadSection(false);
        setSelectedFile(null);
        setUploadPosition("");
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="w-full space-y-8">
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
                <CardContent className="space-y-4 overflow-y-auto">
                    {/* Upload Section */}
                    {showUploadSection ? (
                        <Card className="bg-slate-700/30 border-slate-600">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-white">Upload New CV</CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleCancelUpload}
                                        className="text-slate-400 hover:text-white"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Position Selection */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white">Target Position *</label>
                                    <Select value={uploadPosition} onValueChange={setUploadPosition}>
                                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                            <SelectValue placeholder="Choose the position you're targeting" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {positions.map((position) => (
                                                <SelectItem key={position} value={position}>
                                                    {position}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* File Selection */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white">CV File *</label>
                                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                                        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                                        <p className="text-slate-300 mb-2">Choose a file or drag it here</p>
                                        <p className="text-xs text-slate-400 mb-4">PDF, DOC, DOCX up to 5MB</p>

                                        <div className="relative">
                                            <Input
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={handleFileSelect}
                                                disabled={isUploading}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <Button
                                                variant="outline"
                                                disabled={isUploading}
                                                className="border-slate-600 text-slate-300 hover:text-white"
                                            >
                                                {selectedFile ? "Change File" : "Browse Files"}
                                            </Button>
                                        </div>

                                        {selectedFile && (
                                            <div className="mt-4 p-3 bg-blue-600/10 border border-blue-500/20 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="w-4 h-4 text-blue-400" />
                                                    <div className="flex-1 text-left">
                                                        <p className="text-sm text-white font-medium">
                                                            {selectedFile.name}
                                                        </p>
                                                        <p className="text-xs text-slate-400">
                                                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Upload Button */}
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={handleCancelUpload}
                                        className="flex-1 border-slate-600 text-white"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleUpload}
                                        disabled={!selectedFile || !uploadPosition || isUploading}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                                    >
                                        {isUploading ? "Uploading..." : "Upload CV"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="text-white font-semibold">
                            Your list of CVs
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
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
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
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
