"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    FileText,
    Building2,
    MapPin,
    Calendar,
    ChevronDown,
    ChevronUp,
    User,
    Clock,
    Target,
    Briefcase,
} from "lucide-react";
import { FileItem } from "@/pages/CVEvaluation/items/FileItem";
import type { ApplicationItem, ApplicationStatus } from "@/services/file.service";
import { useApplicationQueries } from "@/pages/CVEvaluation/hooks/useFileQueries";

interface DialogApplicationProps {
    isOpen: boolean;
    onClose: () => void;
    application: ApplicationItem | null;
}

const statusColors = {
    pending: "bg-yellow-900/20 text-yellow-400 border-yellow-500/30",
    shortlisted: "bg-blue-900/20 text-blue-400 border-blue-500/30",
    rejected: "bg-red-900/20 text-red-400 border-red-500/30",
    accepted: "bg-green-900/20 text-green-400 border-green-500/30",
};

export function DialogApplication({ isOpen, onClose, application }: DialogApplicationProps) {
    const [showJDDetails, setShowJDDetails] = useState(false);
    const { useApplicationDetail } = useApplicationQueries();
    const { data: applicationDetail, isLoading, error } = useApplicationDetail(application?._id || "");

    const handleCVView = (cvId: string) => {
        if (applicationDetail?.cv?.fileUrl) {
            window.open(applicationDetail.cv.fileUrl, "_blank");
        }
    };

    const handleCVDownload = (cvId: string) => {
        if (applicationDetail?.cv?.fileUrl) {
            const link = document.createElement("a");
            link.href = applicationDetail.cv.fileUrl;
            link.download = applicationDetail.cv.fileName || "cv.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (!application) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-6xl w-[80vw] h-[90vh] bg-slate-900 border-slate-700">
                    <div className="flex items-center justify-center h-full">
                        <div className="text-gray-400">No application selected.</div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (isLoading) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-6xl w-[80vw] h-[90vh] bg-slate-900 border-slate-700">
                    <div className="flex items-center justify-center h-full">
                        <div className="text-gray-400">Loading application details...</div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (error || !applicationDetail) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-6xl w-[80vw] h-[90vh] bg-slate-900 border-slate-700">
                    <div className="flex items-center justify-center h-full">
                        <div className="text-red-400">Error loading application details</div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[90%] max-h-[90vh] p-0 bg-slate-900 border-slate-700">
                <div className="flex h-[90vh]">
                    {/* Left Column - CV and JD (35% width) */}
                    <div className="w-[35%] border-r border-slate-700 flex flex-col p-4 space-y-2">
                        {/* CV Section */}
                        <FileItem
                            id={applicationDetail.cv._id}
                            title={applicationDetail.cv.fileName || applicationDetail.cv.position}
                            subtitle={applicationDetail.cv.position}
                            selected={true}
                            colorScheme="blue"
                            date={new Date(applicationDetail.cv.createdAt)}
                            datePrefix="Uploaded"
                            onView={handleCVView}
                            onDownload={handleCVDownload}
                            showCheckmark={false}
                            className="border-blue-500/50 bg-blue-600/10"
                        />

                        {/* JD Section */}
                        <Card className="bg-slate-800/50 border-slate-700 h-[60%] flex flex-col pb-4">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-white">
                                        <Briefcase className="w-5 h-5 text-purple-400" />
                                        Job Description
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-hidden">
                                {/* Job Header - Always Visible */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold text-white">
                                            {applicationDetail.jd.title}
                                        </h3>
                                        <div className="flex flex-col gap-2 text-slate-400 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4" />
                                                {applicationDetail.jd.companyName}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                {applicationDetail.jd.location}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed JD Content*/}
                                <ScrollArea className="h-[80%] mt-4">
                                    <div className="space-y-4 pr-2">
                                        {/* Job Description */}
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-semibold text-white">Job Description</h4>
                                            <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap">
                                                {applicationDetail.jd.description}
                                            </p>
                                        </div>

                                        {/* Requirements */}
                                        {applicationDetail.jd.requirements && (
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-semibold text-white">Requirements</h4>

                                                {/* Skills */}
                                                {applicationDetail.jd.requirements.skills &&
                                                    applicationDetail.jd.requirements.skills.length > 0 && (
                                                        <div>
                                                            <h5 className="font-medium text-slate-300 mb-2 text-xs">
                                                                Skills
                                                            </h5>
                                                            <div className="flex flex-wrap gap-1">
                                                                {applicationDetail.jd.requirements.skills.map(
                                                                    (skill, index) => (
                                                                        <Badge
                                                                            key={index}
                                                                            variant="secondary"
                                                                            className="text-xs bg-slate-700 text-slate-300"
                                                                        >
                                                                            {skill}
                                                                        </Badge>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                {/* Experience */}
                                                {applicationDetail.jd.requirements.experience &&
                                                    applicationDetail.jd.requirements.experience.length > 0 && (
                                                        <div>
                                                            <h5 className="font-medium text-slate-300 mb-2 text-xs">
                                                                Experience
                                                            </h5>
                                                            <ul className="text-xs text-slate-400 space-y-1">
                                                                {applicationDetail.jd.requirements.experience.map(
                                                                    (exp, index) => (
                                                                        <li
                                                                            key={index}
                                                                            className="flex items-start gap-2"
                                                                        >
                                                                            <span className="text-purple-400 mt-1">
                                                                                •
                                                                            </span>
                                                                            <span>{exp}</span>
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        </div>
                                                    )}

                                                {/* Education */}
                                                {applicationDetail.jd.requirements.education &&
                                                    applicationDetail.jd.requirements.education.length > 0 && (
                                                        <div>
                                                            <h5 className="font-medium text-slate-300 mb-2 text-xs">
                                                                Education
                                                            </h5>
                                                            <ul className="text-xs text-slate-400 space-y-1">
                                                                {applicationDetail.jd.requirements.education.map(
                                                                    (edu, index) => (
                                                                        <li
                                                                            key={index}
                                                                            className="flex items-start gap-2"
                                                                        >
                                                                            <span className="text-purple-400 mt-1">
                                                                                •
                                                                            </span>
                                                                            <span>{edu}</span>
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        </div>
                                                    )}

                                                {/* Languages */}
                                                {applicationDetail.jd.requirements.languages &&
                                                    applicationDetail.jd.requirements.languages.length > 0 && (
                                                        <div>
                                                            <h5 className="font-medium text-slate-300 mb-2 text-xs">
                                                                Languages
                                                            </h5>
                                                            <div className="flex flex-wrap gap-1">
                                                                {applicationDetail.jd.requirements.languages.map(
                                                                    (lang, index) => (
                                                                        <Badge
                                                                            key={index}
                                                                            variant="secondary"
                                                                            className="text-xs bg-slate-700 text-slate-300"
                                                                        >
                                                                            {lang}
                                                                        </Badge>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                {/* Certifications */}
                                                {applicationDetail.jd.requirements.certifications &&
                                                    applicationDetail.jd.requirements.certifications.length > 0 && (
                                                        <div>
                                                            <h5 className="font-medium text-slate-300 mb-2 text-xs">
                                                                Certifications
                                                            </h5>
                                                            <div className="flex flex-wrap gap-1">
                                                                {applicationDetail.jd.requirements.certifications.map(
                                                                    (cert, index) => (
                                                                        <Badge
                                                                            key={index}
                                                                            variant="secondary"
                                                                            className="text-xs bg-green-700/20 text-green-300 border-green-500/30"
                                                                        >
                                                                            {cert}
                                                                        </Badge>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                {/* Projects */}
                                                {applicationDetail.jd.requirements.projects &&
                                                    applicationDetail.jd.requirements.projects.length > 0 && (
                                                        <div>
                                                            <h5 className="font-medium text-slate-300 mb-2 text-xs">
                                                                Project Experience
                                                            </h5>
                                                            <ul className="text-xs text-slate-400 space-y-1">
                                                                {applicationDetail.jd.requirements.projects.map(
                                                                    (project, index) => (
                                                                        <li
                                                                            key={index}
                                                                            className="flex items-start gap-2"
                                                                        >
                                                                            <span className="text-purple-400 mt-1">
                                                                                •
                                                                            </span>
                                                                            <span>{project}</span>
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        </div>
                                                    )}

                                                {/* Summary */}
                                                {applicationDetail.jd.requirements.summary && (
                                                    <div>
                                                        <h5 className="font-medium text-slate-300 mb-2 text-xs">
                                                            Summary
                                                        </h5>
                                                        <p className="text-xs text-slate-400 leading-relaxed">
                                                            {applicationDetail.jd.requirements.summary}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Benefits */}
                                        {applicationDetail.jd.benefits && applicationDetail.jd.benefits.length > 0 && (
                                            <div className="space-y-2">
                                                <h4 className="text-sm font-semibold text-white">Benefits & Perks</h4>
                                                <div className="space-y-2">
                                                    {applicationDetail.jd.benefits.map((benefit, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center gap-2 text-slate-300"
                                                        >
                                                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0"></div>
                                                            <span className="text-xs">{benefit}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Application Timeline & Details */}
                    <div className="flex-1 flex flex-col">
                        {/* Application Overview */}
                        <div className="p-4">
                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-white text-sm">
                                        <Target className="w-4 h-4 text-green-400" />
                                        Application Overview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                        <div>
                                            <span className="text-slate-400">Applied Date</span>
                                            <p className="text-white font-medium">
                                                {new Date(applicationDetail.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-slate-400">Last Updated</span>
                                            <p className="text-white font-medium">
                                                {new Date(applicationDetail.updatedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    {applicationDetail.overallScore && (
                                        <div>
                                            <span className="text-slate-400 text-xs">Overall Score</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="text-lg font-bold text-green-400">
                                                    {applicationDetail.overallScore}%
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-slate-400 text-xs">Current Status</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge
                                                variant="outline"
                                                className={`${statusColors[applicationDetail.status as ApplicationStatus]} text-sm px-3 py-1`}
                                            >
                                                {applicationDetail.status.charAt(0).toUpperCase() +
                                                    applicationDetail.status.slice(1)}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <ScrollArea className="flex-1">
                            <div className="p-6 space-y-6">
                                {/* Application Metadata */}
                                <Card className="bg-slate-800/50 border-slate-700">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-white">
                                            <FileText className="w-5 h-5 text-purple-400" />
                                            Application Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {applicationDetail.overallScore && (
                                            <div>
                                                <h4 className="font-medium text-slate-300 mb-2">Overall Match Score</h4>
                                                <div className="flex items-center gap-3">
                                                    <div className="text-2xl font-bold text-green-400">
                                                        {applicationDetail.overallScore}%
                                                    </div>
                                                    <div className="flex-1 bg-slate-700 rounded-full h-2">
                                                        <div
                                                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                                            style={{ width: `${applicationDetail.overallScore}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
