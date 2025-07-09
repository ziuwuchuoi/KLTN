"use client";

import { Badge } from "@/components/ui/badge";
import type { JDDetail } from "@/services/file.service";

interface JobDetailContentProps {
    job: JDDetail;
}

export function JobDetailContent({ job }: JobDetailContentProps) {
    return (
        <div className="p-6 space-y-6">
            {/* Job Description */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Job Description</h3>
                <div className="prose prose-invert max-w-none">
                    <p className="text-sm text-slate-400 leading-relaxed  whitespace-pre-wrap">{job.description}</p>
                </div>
            </div>

            {/* Requirements */}
            {job.requirements && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Requirements</h3>

                    {/* Skills */}
                    {job.requirements.skills && job.requirements.skills.length > 0 && (
                        <div>
                            <h4 className="font-medium text-slate-300 mb-3">Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {job.requirements.skills.map((skill, index) => (
                                    <Badge
                                        key={skill}
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
                    {job.requirements.experience && job.requirements.experience.length > 0 && (
                        <div>
                            <h4 className="font-medium text-slate-300 mb-3">Experience</h4>
                            <ul className="text-sm text-slate-400 space-y-2">
                                {job.requirements.experience.map((exp, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span className="text-blue-400 mt-1">•</span>
                                        <span>{exp}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Education */}
                    {job.requirements.education && job.requirements.education.length > 0 && (
                        <div>
                            <h4 className="font-medium text-slate-300 mb-3">Education</h4>
                            <ul className="text-sm text-slate-400 space-y-2">
                                {job.requirements.education.map((edu, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span className="text-blue-400 mt-1">•</span>
                                        <span>{edu}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Languages */}
                    {job.requirements.languages && job.requirements.languages.length > 0 && (
                        <div>
                            <h4 className="font-medium text-slate-300 mb-3">Languages</h4>
                            <div className="flex flex-wrap gap-2">
                                {job.requirements.languages.map((lang, index) => (
                                    <Badge
                                        key={lang}
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
                    {job.requirements.certifications && job.requirements.certifications.length > 0 && (
                        <div>
                            <h4 className="font-medium text-slate-300 mb-3">Certifications</h4>
                            <div className="flex flex-wrap gap-2">
                                {job.requirements.certifications.map((cert, index) => (
                                    <Badge
                                        key={cert}
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
                    {job.requirements.projects && job.requirements.projects.length > 0 && (
                        <div>
                            <h4 className="font-medium text-slate-300 mb-3">Project Experience</h4>
                            <ul className="text-sm text-slate-400 space-y-2">
                                {job.requirements.projects.map((project, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span className="text-blue-400 mt-1">•</span>
                                        <span>{project}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Summary */}
                    {job.requirements.summary && (
                        <div>
                            <h4 className="font-medium text-slate-300 mb-3">Summary</h4>
                            <p className="text-sm text-slate-400 leading-relaxed">{job.requirements.summary}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">Benefits & Perks</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {job.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center gap-3 text-slate-300">
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                <span className="text-sm">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
