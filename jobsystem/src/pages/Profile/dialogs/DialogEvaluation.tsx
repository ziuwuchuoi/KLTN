"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EvaluationResults } from "@/pages/CVEvaluation/resultStep/EvaluationResults";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileItem } from "@/pages/CVEvaluation/items/FileItem";
import { FileText, Briefcase, MapPin, Building2, ChevronUp, ChevronDown } from "lucide-react";
import type { EvaluatedCVDetail, CVDetail, JDDetail } from "@/services/file.service";

interface CustomEvaluationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    evaluation: EvaluatedCVDetail | null;
    cv: CVDetail | null;
    jd: JDDetail | null;
    isLoading?: boolean;
}

export function DialogEvaluation({
    open,
    onOpenChange,
    evaluation,
    cv,
    jd,
    isLoading = false,
}: CustomEvaluationDialogProps) {
    const [showJDDetails, setShowJDDetails] = useState(false);

    const handleCVView = (id: string) => {
        // Handle CV view logic
        console.log("View CV:", id);
    };

    const handleCVDownload = (id: string) => {
        // Handle CV download logic
        console.log("Download CV:", id);
    };

    if (isLoading) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-[80vw] max-h-[90vh] p-0 bg-slate-900 border-slate-700">
                    <div className="flex items-center justify-center h-[80vh]">
                        <p className="text-slate-400">Loading evaluation data...</p>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (!evaluation || !cv || !jd) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[90%] max-h-[90vh] p-0 bg-slate-900 border-slate-700">
                <div className="flex h-[90vh]">
                    {/* Left Column - CV and JD (35% width) */}
                    <div className="w-[35%] border-r border-slate-700 flex flex-col p-4 space-y-2">
                        {/* CV Section */}
                        <FileItem
                            id={cv._id}
                            title={cv.fileName || cv.position}
                            subtitle={cv.position}
                            selected={true}
                            colorScheme="blue"
                            date={new Date(cv.createdAt)}
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
                                        <h3 className="text-lg font-semibold text-white">{jd.title}</h3>
                                        <div className="flex flex-col gap-2 text-slate-400 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4" />
                                                {jd.companyName}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                {jd.location}
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
                                                {jd.description}
                                            </p>
                                        </div>

                                        {/* Requirements */}
                                        {jd.requirements && (
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-semibold text-white">Requirements</h4>

                                                {/* Skills */}
                                                {jd.requirements.skills && jd.requirements.skills.length > 0 && (
                                                    <div>
                                                        <h5 className="font-medium text-slate-300 mb-2 text-xs">
                                                            Skills
                                                        </h5>
                                                        <div className="flex flex-wrap gap-1">
                                                            {jd.requirements.skills.map((skill, index) => (
                                                                <Badge
                                                                    key={index}
                                                                    variant="secondary"
                                                                    className="text-xs bg-slate-700 text-slate-300"
                                                                >
                                                                    {skill}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Experience */}
                                                {jd.requirements.experience &&
                                                    jd.requirements.experience.length > 0 && (
                                                        <div>
                                                            <h5 className="font-medium text-slate-300 mb-2 text-xs">
                                                                Experience
                                                            </h5>
                                                            <ul className="text-xs text-slate-400 space-y-1">
                                                                {jd.requirements.experience.map((exp, index) => (
                                                                    <li key={index} className="flex items-start gap-2">
                                                                        <span className="text-purple-400 mt-1">•</span>
                                                                        <span>{exp}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                {/* Education */}
                                                {jd.requirements.education && jd.requirements.education.length > 0 && (
                                                    <div>
                                                        <h5 className="font-medium text-slate-300 mb-2 text-xs">
                                                            Education
                                                        </h5>
                                                        <ul className="text-xs text-slate-400 space-y-1">
                                                            {jd.requirements.education.map((edu, index) => (
                                                                <li key={index} className="flex items-start gap-2">
                                                                    <span className="text-purple-400 mt-1">•</span>
                                                                    <span>{edu}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* Languages */}
                                                {jd.requirements.languages && jd.requirements.languages.length > 0 && (
                                                    <div>
                                                        <h5 className="font-medium text-slate-300 mb-2 text-xs">
                                                            Languages
                                                        </h5>
                                                        <div className="flex flex-wrap gap-1">
                                                            {jd.requirements.languages.map((lang, index) => (
                                                                <Badge
                                                                    key={index}
                                                                    variant="secondary"
                                                                    className="text-xs bg-slate-700 text-slate-300"
                                                                >
                                                                    {lang}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Certifications */}
                                                {jd.requirements.certifications &&
                                                    jd.requirements.certifications.length > 0 && (
                                                        <div>
                                                            <h5 className="font-medium text-slate-300 mb-2 text-xs">
                                                                Certifications
                                                            </h5>
                                                            <div className="flex flex-wrap gap-1">
                                                                {jd.requirements.certifications.map((cert, index) => (
                                                                    <Badge
                                                                        key={index}
                                                                        variant="secondary"
                                                                        className="text-xs bg-green-700/20 text-green-300 border-green-500/30"
                                                                    >
                                                                        {cert}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                {/* Projects */}
                                                {jd.requirements.projects && jd.requirements.projects.length > 0 && (
                                                    <div>
                                                        <h5 className="font-medium text-slate-300 mb-2 text-xs">
                                                            Project Experience
                                                        </h5>
                                                        <ul className="text-xs text-slate-400 space-y-1">
                                                            {jd.requirements.projects.map((project, index) => (
                                                                <li key={index} className="flex items-start gap-2">
                                                                    <span className="text-purple-400 mt-1">•</span>
                                                                    <span>{project}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* Summary */}
                                                {jd.requirements.summary && (
                                                    <div>
                                                        <h5 className="font-medium text-slate-300 mb-2 text-xs">
                                                            Summary
                                                        </h5>
                                                        <p className="text-xs text-slate-400 leading-relaxed">
                                                            {jd.requirements.summary}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Benefits */}
                                        {jd.benefits && jd.benefits.length > 0 && (
                                            <div className="space-y-2">
                                                <h4 className="text-sm font-semibold text-white">Benefits & Perks</h4>
                                                <div className="space-y-2">
                                                    {jd.benefits.map((benefit, index) => (
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

                    {/* Right Column - Evaluation Results (65% width) */}
                    <div className="w-[65%] overflow-y-auto p-6 py-10">
                        <EvaluationResults result={evaluation} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
