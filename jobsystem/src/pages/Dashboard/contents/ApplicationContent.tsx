"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Building2,
    MapPin,
    Calendar,
    TrendingUp,
    FileText,
    Target,
    BarChart3,
    CheckCircle2,
    AlertCircle,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { FileItem } from "@/pages/CVEvaluation/items/FileItem";
import type { ApplicationDetail } from "@/services/file.service";

interface ApplicationContentProps {
    applicationDetail: ApplicationDetail | null;
}

export function ApplicationContent({ applicationDetail }: ApplicationContentProps) {
    const [showJDDetails, setShowJDDetails] = useState(false);

    if (!applicationDetail) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-gray-400">No application data available</div>
            </div>
        );
    }

    const handleCVView = () => {
        if (applicationDetail.cv?.fileUrl) {
            window.open(applicationDetail.cv.fileUrl, "_blank");
        }
    };

    const handleCVDownload = () => {
        if (applicationDetail.cv?.fileUrl) {
            const link = document.createElement("a");
            link.href = applicationDetail.cv.fileUrl;
            link.download = applicationDetail.cv.fileName || "cv.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
                {/* Key Metrics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="h-6 w-6 text-blue-400" />
                                <div>
                                    <p className="text-xs text-gray-400">Overall Score</p>
                                    <p className="text-lg font-bold text-white">
                                        {applicationDetail.overallScore
                                            ? `${Math.round(applicationDetail.overallScore)}%`
                                            : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <BarChart3 className="h-6 w-6 text-purple-400" />
                                <div>
                                    <p className="text-xs text-gray-400">Similarity</p>
                                    <p className="text-lg font-bold text-white">
                                        {applicationDetail.evaluation?.reviewCVResponse?.summary?.similarity_score
                                            ? `${Math.round(applicationDetail.evaluation.reviewCVResponse.summary.similarity_score)}%`
                                            : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-6 w-6 text-green-400" />
                                <div>
                                    <p className="text-xs text-gray-400">Applied</p>
                                    <p className="text-sm font-semibold text-white">
                                        {new Date(applicationDetail.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <Target className="h-6 w-6 text-orange-400" />
                                <div>
                                    <p className="text-xs text-gray-400">Skills Match</p>
                                    <p className="text-lg font-bold text-white">
                                        {applicationDetail.evaluation?.reviewCVResponse?.skills_analysis?.match_percent
                                            ? `${applicationDetail.evaluation.reviewCVResponse.skills_analysis.match_percent}%`
                                            : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* CV Section */}
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <FileText className="w-5 h-5 text-blue-400" />
                            Candidate CV
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* CV FileItem Display */}
                        {applicationDetail.cv && (
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
                        )}
                    </CardContent>
                </Card>

                {/* Job Description Section */}
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
                                {showJDDetails ? (
                                    <ChevronUp className="w-4 h-4" />
                                ) : (
                                    <ChevronDown className="w-4 h-4" />
                                )}
                                <span className="ml-2 text-sm">{showJDDetails ? "Less" : "More"}</span>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Job Header - Always Visible */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold text-white">{applicationDetail.jd.title}</h3>
                                <div className="flex items-center gap-4 text-slate-400">
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

                            {/* Brief Description */}
                            {!showJDDetails && (
                                <div>
                                    <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
                                        {applicationDetail.jd.description}
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
                                            <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">
                                                {applicationDetail.jd.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Requirements */}
                                    {applicationDetail.jd.requirements && (
                                        <div className="space-y-4">
                                            <h4 className="text-lg font-semibold text-white">Requirements</h4>

                                            {/* Skills */}
                                            {applicationDetail.jd.requirements.skills &&
                                                applicationDetail.jd.requirements.skills.length > 0 && (
                                                    <div>
                                                        <h5 className="font-medium text-slate-300 mb-3">Skills</h5>
                                                        <div className="flex flex-wrap gap-2">
                                                            {applicationDetail.jd.requirements.skills.map(
                                                                (skill, index) => (
                                                                    <Badge
                                                                        key={index}
                                                                        variant="secondary"
                                                                        className="text-xs bg-slate-700 text-slate-300 hover:text-slate-900"
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
                                                        <h5 className="font-medium text-slate-300 mb-3">Experience</h5>
                                                        <ul className="text-sm text-slate-400 space-y-2">
                                                            {applicationDetail.jd.requirements.experience.map(
                                                                (exp, index) => (
                                                                    <li key={index} className="flex items-start gap-2">
                                                                        <span className="text-blue-400 mt-1">•</span>
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
                                                        <h5 className="font-medium text-slate-300 mb-3">Education</h5>
                                                        <ul className="text-sm text-slate-400 space-y-2">
                                                            {applicationDetail.jd.requirements.education.map(
                                                                (edu, index) => (
                                                                    <li key={index} className="flex items-start gap-2">
                                                                        <span className="text-blue-400 mt-1">•</span>
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
                                                        <h5 className="font-medium text-slate-300 mb-3">Languages</h5>
                                                        <div className="flex flex-wrap gap-2">
                                                            {applicationDetail.jd.requirements.languages.map(
                                                                (lang, index) => (
                                                                    <Badge
                                                                        key={index}
                                                                        variant="secondary"
                                                                        className="text-xs bg-slate-700 text-slate-300 hover:text-slate-900"
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
                                                        <h5 className="font-medium text-slate-300 mb-3">
                                                            Certifications
                                                        </h5>
                                                        <div className="flex flex-wrap gap-2">
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
                                                        <h5 className="font-medium text-slate-300 mb-3">
                                                            Project Experience
                                                        </h5>
                                                        <ul className="text-sm text-slate-400 space-y-2">
                                                            {applicationDetail.jd.requirements.projects.map(
                                                                (project, index) => (
                                                                    <li key={index} className="flex items-start gap-2">
                                                                        <span className="text-blue-400 mt-1">•</span>
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
                                                    <h5 className="font-medium text-slate-300 mb-3">Summary</h5>
                                                    <p className="text-sm text-slate-400 leading-relaxed">
                                                        {applicationDetail.jd.requirements.summary}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Benefits */}
                                    {applicationDetail.jd.benefits && applicationDetail.jd.benefits.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="text-lg font-semibold text-white">Benefits & Perks</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {applicationDetail.jd.benefits.map((benefit, index) => (
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

                {/* AI Evaluation Results */}
                {applicationDetail.evaluation?.reviewCVResponse && (
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <Target className="h-5 w-5 text-purple-400" />
                                AI Evaluation Results
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Skills Analysis */}
                            {applicationDetail.evaluation.reviewCVResponse.skills_analysis && (
                                <div>
                                    <h5 className="font-medium text-gray-300 mb-4 flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                                        Skills Analysis
                                    </h5>

                                    <div className="bg-slate-700/30 p-4 rounded-lg space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">Skills Match</span>
                                            <span className="text-2xl font-bold text-green-400">
                                                {
                                                    applicationDetail.evaluation.reviewCVResponse.skills_analysis
                                                        .match_percent
                                                }
                                                %
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h6 className="text-sm font-medium text-gray-400 mb-2">
                                                    Matched Skills
                                                </h6>
                                                <div className="flex flex-wrap gap-1">
                                                    {applicationDetail.evaluation.reviewCVResponse.skills_analysis.matched_skills?.map(
                                                        (skill, index) => (
                                                            <Badge
                                                                key={index}
                                                                variant="outline"
                                                                className="text-xs bg-green-900/20 text-green-400 border-green-500/30"
                                                            >
                                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                                {skill}
                                                            </Badge>
                                                        )
                                                    )}
                                                </div>
                                            </div>

                                            {applicationDetail.evaluation.reviewCVResponse.skills_analysis
                                                .missing_skills?.length > 0 && (
                                                <div>
                                                    <h6 className="text-sm font-medium text-gray-400 mb-2">
                                                        Missing Skills
                                                    </h6>
                                                    <div className="flex flex-wrap gap-1">
                                                        {applicationDetail.evaluation.reviewCVResponse.skills_analysis.missing_skills.map(
                                                            (skill, index) => (
                                                                <Badge
                                                                    key={index}
                                                                    variant="outline"
                                                                    className="text-xs bg-red-900/20 text-red-400 border-red-500/30"
                                                                >
                                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                                    {skill}
                                                                </Badge>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ATS Check */}
                            {applicationDetail.evaluation.reviewCVResponse.ats_check && (
                                <div>
                                    <h5 className="font-medium text-gray-300 mb-3">ATS Analysis</h5>
                                    <div className="bg-slate-700/30 p-4 rounded-lg space-y-3">
                                        {applicationDetail.evaluation.reviewCVResponse.ats_check.recommendations
                                            ?.length > 0 && (
                                            <div>
                                                <h6 className="text-sm font-medium text-gray-400 mb-2">
                                                    Recommendations
                                                </h6>
                                                <ul className="space-y-1">
                                                    {applicationDetail.evaluation.reviewCVResponse.ats_check.recommendations.map(
                                                        (rec, index) => (
                                                            <li
                                                                key={index}
                                                                className="text-sm text-gray-300 flex items-start gap-2"
                                                            >
                                                                <span className="text-blue-400 mt-1">•</span>
                                                                {rec}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </ScrollArea>
    );
}
