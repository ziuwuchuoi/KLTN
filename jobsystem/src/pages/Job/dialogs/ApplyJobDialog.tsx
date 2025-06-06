"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Calendar, CheckCircle, Upload, Plus, X, Briefcase } from "lucide-react";
import { useCVQueries } from "@/pages/CVEvaluation/hooks/useFileQueries";
import { useApplicationQueries } from "@/pages/CVEvaluation/hooks/useFileQueries";
import type { JDDetail } from "@/services/file.service";
import { useAuthStore } from "@/stores/useAuthStore";
import CustomDialog from "@/components/molecules/CustomDialog";

interface ApplyJobDialogProps {
    isOpen: boolean;
    onClose: () => void;
    job: JDDetail;
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

export function ApplyJobDialog({ isOpen, onClose, job }: ApplyJobDialogProps) {
    const { user } = useAuthStore();
    const [selectedCVId, setSelectedCVId] = useState<string>("");
    const [isApplying, setIsApplying] = useState(false);
    const [applicationSuccess, setApplicationSuccess] = useState(false);
    const [showUploadSection, setShowUploadSection] = useState(false);
    const [uploadPosition, setUploadPosition] = useState<string>(job.title || "");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    console.log("userId", user._id);
    const { cvs, isCVDataLoading, uploadCV } = useCVQueries(user._id);
    console.log("cv", cvs);
    const { applyCV } = useApplicationQueries();

    const handleApply = async () => {
        if (!selectedCVId) return;

        setIsApplying(true);
        applyCV.mutate(
            { cvId: selectedCVId, jdId: job._id },
            {
                onSuccess: () => {
                    setApplicationSuccess(true);
                    setIsApplying(false);
                },
                onError: (error) => {
                    console.error("Application failed:", error);
                    setIsApplying(false);
                },
            }
        );
    };

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
                    console.log("newCV", newCV);
                    setSelectedCVId(newCV._id);
                    setShowUploadSection(false);
                    setSelectedFile(null);
                    setUploadPosition(job.title || "");
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
        setUploadPosition(job.title || "");
    };

    const handleClose = () => {
        setSelectedCVId("");
        setApplicationSuccess(false);
        setIsApplying(false);
        setShowUploadSection(false);
        setSelectedFile(null);
        setUploadPosition(job.title || "");
        setIsUploading(false);
        onClose();
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (applicationSuccess) {
        return (
            <CustomDialog
                open={isOpen}
                onOpenChange={(open) => !open && handleClose()}
                onClose={handleClose}
                dialogTitle="Application Submitted!"
                className="bg-slate-800 border-slate-700 max-w-md"
                childrenContainerClassName="flex items-center justify-center"
            >
                <div className="text-center py-6">
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Successfully Applied!</h3>
                    <p className="text-slate-300 mb-6">
                        Your application for <strong>{job.title}</strong> at <strong>{job.companyName}</strong> has been
                        submitted.
                    </p>
                    <Button onClick={handleClose} className="bg-blue-600 hover:bg-blue-700">
                        Close
                    </Button>
                </div>
            </CustomDialog>
        );
    }

    return (
        <CustomDialog
            open={isOpen}
            onOpenChange={(open) => !open && handleClose()}
            onClose={handleClose}
            dialogTitle="Apply for Position"
            className="bg-slate-800 border-slate-700 max-w-2xl max-h-[80vh]"
            childrenContainerClassName="space-y-6 p-6"
        >
            {/* Job Info */}
            <div className="bg-slate-700/30 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">{job.title}</h3>
                <p className="text-slate-300 text-sm">
                    {job.companyName} • {job.location}
                </p>
            </div>

            {/* CV Selection */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Select Your CV</h3>
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
                                        onClick={handleCancelUpload}
                                        className="text-slate-400 hover:text-white"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>

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
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Existing CVs */}
                {!showUploadSection && (
                    <>
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
                                <p className="text-slate-400 mb-4">Upload your first CV to start applying for jobs.</p>
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
                            <ScrollArea className="h-64">
                                <div className="space-y-3">
                                    {cvs.map((cv) => (
                                        <Card
                                            key={cv._id}
                                            className={`cursor-pointer transition-colors border ${
                                                selectedCVId === cv._id
                                                    ? "bg-blue-600/20 border-blue-500/50"
                                                    : "bg-slate-700/30 border-slate-600 hover:bg-slate-700/50"
                                            }`}
                                            onClick={() => setSelectedCVId(cv._id)}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start gap-3">
                                                        <FileText className="w-5 h-5 text-blue-400 mt-0.5" />
                                                        <div className="space-y-1">
                                                            <h4 className="font-medium text-white">{cv.fileName}</h4>
                                                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                                                <Calendar className="w-3 h-3" />
                                                                Uploaded {formatDate(cv.createdAt)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {selectedCVId === cv._id && (
                                                        <CheckCircle className="w-5 h-5 text-blue-400" />
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                    </>
                )}
            </div>

            {/* Application Note */}
            {selectedCVId && !showUploadSection && (
                <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Application Details</h4>
                    <ul className="text-sm text-slate-300 space-y-1">
                        <li>• Your CV will be sent to {job.companyName}</li>
                        <li>• You'll receive updates on your application status</li>
                        <li>• The employer may contact you directly</li>
                    </ul>
                </div>
            )}

            {/* Action Buttons */}
            {!showUploadSection && (
                <div className="flex gap-3 pt-4 border-t border-slate-700">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        className="flex-1 border-slate-600 text-white"
                        disabled={isApplying || isUploading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleApply}
                        disabled={!selectedCVId || isApplying || isUploading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                        {isApplying ? "Applying..." : "Submit Application"}
                    </Button>
                </div>
            )}
        </CustomDialog>
    );
}
