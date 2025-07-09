"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { FileText, Building2, MapPin, ChevronDown, ChevronUp, Zap } from "lucide-react";
import { useCVQueries, useJDQueries } from "../hooks/useFileQueries";
import { useState } from "react";
import { FileItem } from "../items/FileItem";
import type { JDDetail } from "@/services/file.service";

interface ReviewStepProps {
    selectedCVId: string;
    selectedJDId: string;
    jdData: Partial<JDDetail>;
    onEvaluate: (jdId?: string) => Promise<void>;
    isEvaluating: boolean;
    canEvaluate: boolean;
}

export function ReviewStep({
    selectedCVId,
    selectedJDId,
    jdData,
    onEvaluate,
    isEvaluating,
    canEvaluate,
}: ReviewStepProps) {
    const [showJDDetails, setShowJDDetails] = useState(false);
    const { useCVDetail } = useCVQueries();
    const { useJDDetail, uploadJD } = useJDQueries();

    const { data: cvDetail } = useCVDetail(selectedCVId);
    const { data: jdDetail } = useJDDetail(selectedJDId);

    const displayJD = jdDetail || jdData;

    const handleCVView = () => {
        if (cvDetail?.fileUrl) {
            window.open(cvDetail.fileUrl, "_blank");
        }
    };

    const handleCVDownload = () => {
        if (cvDetail?.fileUrl) {
            const link = document.createElement("a");
            link.href = cvDetail.fileUrl;
            link.download = cvDetail.fileName || "cv.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8 h-fit">
            {/* Left Column - CV Details */}
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                        <FileText className="w-5 h-5 text-blue-400" />
                        Your CV
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* CV FileItem Display */}
                    {cvDetail && (
                        <div className="space-y-4">
                            <FileItem
                                id={cvDetail._id}
                                title={cvDetail.fileName || cvDetail.position}
                                subtitle={cvDetail.position}
                                selected={true}
                                colorScheme="blue"
                                date={new Date(cvDetail.createdAt)}
                                datePrefix="Uploaded"
                                onView={handleCVView}
                                onDownload={handleCVDownload}
                                showCheckmark={false}
                                className="border-blue-500/50 bg-blue-600/10"
                            />

                            {/* CV Information Summary */}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Right Column - Job Description */}
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Building2 className="w-5 h-5 text-purple-400" />
                            Job Description
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowJDDetails(!showJDDetails)}
                            className="text-slate-400 hover:text-white"
                        >
                            {showJDDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            <span className="ml-2 text-sm">{showJDDetails ? "Less" : "More"}</span>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Job Header - Always Visible */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-white">{displayJD.title}</h3>
                            <div className="flex items-center gap-4 text-slate-400">
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4" />
                                    {displayJD.companyName}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    {displayJD.location}
                                </div>
                            </div>
                        </div>

                        {/* Brief Description */}
                        {!showJDDetails && (
                            <div>
                                <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
                                    {displayJD.description}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Detailed JD Content (Expandable) - JobDetailContent Style */}
                    {showJDDetails && (
                        <ScrollArea className="h-[350px]">
                            <div className="space-y-6 pr-4">
                                {/* Job Description */}
                                <div className="space-y-3">
                                    <h4 className="text-lg font-semibold text-white">Job Description</h4>
                                    <div className="prose prose-invert max-w-none">
                                        <p className="text-sm text-slate-400 leading-relaxed  whitespace-pre-wrap">
                                            {displayJD.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Requirements */}
                                {displayJD.requirements && (
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-semibold text-white">Requirements</h4>

                                        {/* Skills */}
                                        {displayJD.requirements.skills && displayJD.requirements.skills.length > 0 && (
                                            <div>
                                                <h5 className="font-medium text-slate-300 mb-3">Skills</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {displayJD.requirements.skills.map((skill, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant="secondary"
                                                            className="text-xs bg-slate-700 text-slate-300 hover:text-slate-900"
                                                        >
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Experience */}
                                        {displayJD.requirements.experience &&
                                            displayJD.requirements.experience.length > 0 && (
                                                <div>
                                                    <h5 className="font-medium text-slate-300 mb-3">Experience</h5>
                                                    <ul className="text-sm text-slate-400 space-y-2">
                                                        {displayJD.requirements.experience.map((exp, index) => (
                                                            <li key={index} className="flex items-start gap-2">
                                                                <span className="text-blue-400 mt-1">•</span>
                                                                <span>{exp}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                        {/* Education */}
                                        {displayJD.requirements.education &&
                                            displayJD.requirements.education.length > 0 && (
                                                <div>
                                                    <h5 className="font-medium text-slate-300 mb-3">Education</h5>
                                                    <ul className="text-sm text-slate-400 space-y-2">
                                                        {displayJD.requirements.education.map((edu, index) => (
                                                            <li key={index} className="flex items-start gap-2">
                                                                <span className="text-blue-400 mt-1">•</span>
                                                                <span>{edu}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                        {/* Languages */}
                                        {displayJD.requirements.languages &&
                                            displayJD.requirements.languages.length > 0 && (
                                                <div>
                                                    <h5 className="font-medium text-slate-300 mb-3">Languages</h5>
                                                    <div className="flex flex-wrap gap-2">
                                                        {displayJD.requirements.languages.map((lang, index) => (
                                                            <Badge
                                                                key={index}
                                                                variant="secondary"
                                                                className="text-xs bg-slate-700 text-slate-300 hover:text-slate-900"
                                                            >
                                                                {lang}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                        {/* Certifications */}
                                        {displayJD.requirements.certifications &&
                                            displayJD.requirements.certifications.length > 0 && (
                                                <div>
                                                    <h5 className="font-medium text-slate-300 mb-3">Certifications</h5>
                                                    <div className="flex flex-wrap gap-2">
                                                        {displayJD.requirements.certifications.map((cert, index) => (
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
                                        {displayJD.requirements.projects &&
                                            displayJD.requirements.projects.length > 0 && (
                                                <div>
                                                    <h5 className="font-medium text-slate-300 mb-3">
                                                        Project Experience
                                                    </h5>
                                                    <ul className="text-sm text-slate-400 space-y-2">
                                                        {displayJD.requirements.projects.map((project, index) => (
                                                            <li key={index} className="flex items-start gap-2">
                                                                <span className="text-blue-400 mt-1">•</span>
                                                                <span>{project}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                        {/* Summary */}
                                        {displayJD.requirements.summary && (
                                            <div>
                                                <h5 className="font-medium text-slate-300 mb-3">Summary</h5>
                                                <p className="text-sm text-slate-400 leading-relaxed">
                                                    {displayJD.requirements.summary}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Benefits */}
                                {displayJD.benefits && displayJD.benefits.length > 0 && (
                                    <div className="space-y-3">
                                        <h4 className="text-lg font-semibold text-white">Benefits & Perks</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {displayJD.benefits.map((benefit, index) => (
                                                <div key={index} className="flex items-center gap-3 text-slate-300">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                                    <span className="text-sm">{benefit}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
