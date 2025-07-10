"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Building2, MapPin, Calendar, CheckCircle } from "lucide-react";
import type { JDItem } from "@/services/file.service";
import { useJDQueries } from "@/pages/CVEvaluation/hooks/useFileQueries";

interface DialogJDProps {
    isOpen: boolean;
    onClose: () => void;
    jd: JDItem | null;
}

export function DialogJD({ isOpen, onClose, jd }: DialogJDProps) {
    const { useJDDetail } = useJDQueries();
    const { data: jdDetail, isLoading, error } = useJDDetail(jd?._id || "");

    if (!jd) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-4xl w-[80vw] h-[90vh] bg-slate-900 border-slate-700">
                    <div className="flex items-center justify-center h-full">
                        <div className="text-gray-400">No job description selected.</div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (isLoading) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-4xl w-[80vw] h-[90vh] bg-slate-900 border-slate-700">
                    <div className="flex items-center justify-center h-full">
                        <div className="text-gray-400">Loading job description...</div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (error || !jdDetail) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-4xl w-[80vw] h-[90vh] bg-slate-900 border-slate-700">
                    <div className="flex items-center justify-center h-full">
                        <div className="text-red-400">Error loading job description</div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl w-[50%] h-fit bg-slate-900 border-slate-700 p-0">
                <div className="p-6">
                    {/* Job Header */}
                    <div className="mb-4">
                        <h1 className="text-2xl font-bold text-white mb-2">{jdDetail.title}</h1>
                        <div className="flex items-center gap-6 text-slate-300 mb-2">
                            <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-purple-400" />
                                <span className="text-sm">{jdDetail.companyName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-purple-400" />
                                <span className="text-sm">{jdDetail.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-purple-400" />
                                <span className="text-sm">
                                    Posted {new Date(jdDetail.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30 text-xs">
                            {jdDetail.position}
                        </Badge>
                    </div>

                    <ScrollArea className="h-[80%] mt-4">
                        <div className="space-y-4 pr-2">
                            {/* Job Description */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-white">Job Description</h4>
                                <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap">
                                    {jdDetail.description}
                                </p>
                            </div>

                            {/* Requirements */}
                            {jdDetail.requirements && (
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-white">Requirements</h4>

                                    {/* Skills */}
                                    {jdDetail.requirements.skills && jdDetail.requirements.skills.length > 0 && (
                                        <div>
                                            <h5 className="font-medium text-slate-300 mb-2 text-xs">Skills</h5>
                                            <div className="flex flex-wrap gap-1">
                                                {jdDetail.requirements.skills.map((skill, index) => (
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
                                    {jdDetail.requirements.experience &&
                                        jdDetail.requirements.experience.length > 0 && (
                                            <div>
                                                <h5 className="font-medium text-slate-300 mb-2 text-xs">Experience</h5>
                                                <ul className="text-xs text-slate-400 space-y-1">
                                                    {jdDetail.requirements.experience.map((exp, index) => (
                                                        <li key={index} className="flex items-start gap-2">
                                                            <span className="text-purple-400 mt-1">•</span>
                                                            <span>{exp}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                    {/* Education */}
                                    {jdDetail.requirements.education && jdDetail.requirements.education.length > 0 && (
                                        <div>
                                            <h5 className="font-medium text-slate-300 mb-2 text-xs">Education</h5>
                                            <ul className="text-xs text-slate-400 space-y-1">
                                                {jdDetail.requirements.education.map((edu, index) => (
                                                    <li key={index} className="flex items-start gap-2">
                                                        <span className="text-purple-400 mt-1">•</span>
                                                        <span>{edu}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Languages */}
                                    {jdDetail.requirements.languages && jdDetail.requirements.languages.length > 0 && (
                                        <div>
                                            <h5 className="font-medium text-slate-300 mb-2 text-xs">Languages</h5>
                                            <div className="flex flex-wrap gap-1">
                                                {jdDetail.requirements.languages.map((lang, index) => (
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
                                    {jdDetail.requirements.certifications &&
                                        jdDetail.requirements.certifications.length > 0 && (
                                            <div>
                                                <h5 className="font-medium text-slate-300 mb-2 text-xs">
                                                    Certifications
                                                </h5>
                                                <div className="flex flex-wrap gap-1">
                                                    {jdDetail.requirements.certifications.map((cert, index) => (
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
                                    {jdDetail.requirements.projects && jdDetail.requirements.projects.length > 0 && (
                                        <div>
                                            <h5 className="font-medium text-slate-300 mb-2 text-xs">
                                                Project Experience
                                            </h5>
                                            <ul className="text-xs text-slate-400 space-y-1">
                                                {jdDetail.requirements.projects.map((project, index) => (
                                                    <li key={index} className="flex items-start gap-2">
                                                        <span className="text-purple-400 mt-1">•</span>
                                                        <span>{project}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Summary */}
                                    {jdDetail.requirements.summary && (
                                        <div>
                                            <h5 className="font-medium text-slate-300 mb-2 text-xs">Summary</h5>
                                            <p className="text-xs text-slate-400 leading-relaxed">
                                                {jdDetail.requirements.summary}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Benefits */}
                            {jdDetail.benefits && jdDetail.benefits.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-white">Benefits & Perks</h4>
                                    <div className="space-y-2">
                                        {jdDetail.benefits.map((benefit, index) => (
                                            <div key={index} className="flex items-center gap-2 text-slate-300">
                                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0"></div>
                                                <span className="text-xs">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}
