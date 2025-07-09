"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { JDDetail } from "@/services/file.service";

interface SubTabJDInformationProps {
    jdDetail: JDDetail;
}

export function SubTabJDInformation({ jdDetail }: SubTabJDInformationProps) {
    return (
        <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
                {/* Position */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Position</h3>
                    <p className="text-gray-300 text-base">{jdDetail?.position}</p>
                </div>

                {/* Job Description */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Job Description</h3>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{jdDetail?.description}</p>
                </div>

                {/* Requirements */}
                {jdDetail?.requirements && (
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Requirements</h3>
                        <div className="space-y-4">
                            {jdDetail.requirements.summary && (
                                <div>
                                    <h4 className="font-medium text-gray-300 mb-2">Summary</h4>
                                    <p className="text-gray-400 leading-relaxed">{jdDetail.requirements.summary}</p>
                                </div>
                            )}

                            {jdDetail.requirements.skills && jdDetail.requirements.skills.length > 0 && (
                                <div>
                                    <h4 className="font-medium text-gray-300 mb-3">Required Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {jdDetail.requirements.skills.map((skill, index) => (
                                            <Badge
                                                key={index}
                                                variant="secondary"
                                                className="bg-blue-900/20 text-blue-400"
                                            >
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {jdDetail.requirements.experience && jdDetail.requirements.experience.length > 0 && (
                                <div>
                                    <h4 className="font-medium text-gray-300 mb-3">Experience</h4>
                                    <ul className="list-disc list-inside space-y-2">
                                        {jdDetail.requirements.experience.map((exp, index) => (
                                            <li key={index} className="text-gray-400">
                                                {exp}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {jdDetail.requirements.education && jdDetail.requirements.education.length > 0 && (
                                <div>
                                    <h4 className="font-medium text-gray-300 mb-3">Education</h4>
                                    <ul className="list-disc list-inside space-y-2">
                                        {jdDetail.requirements.education.map((edu, index) => (
                                            <li key={index} className="text-gray-400">
                                                {edu}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {jdDetail.requirements.projects && jdDetail.requirements.projects.length > 0 && (
                                <div>
                                    <h4 className="font-medium text-gray-300 mb-3">Project Experience</h4>
                                    <ul className="list-disc list-inside space-y-2">
                                        {jdDetail.requirements.projects.map((project, index) => (
                                            <li key={index} className="text-gray-400">
                                                {project}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {jdDetail.requirements.languages && jdDetail.requirements.languages.length > 0 && (
                                <div>
                                    <h4 className="font-medium text-gray-300 mb-3">Languages</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {jdDetail.requirements.languages.map((language, index) => (
                                            <Badge
                                                key={index}
                                                variant="secondary"
                                                className="bg-purple-900/20 text-purple-400"
                                            >
                                                {language}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {jdDetail.requirements.certifications &&
                                jdDetail.requirements.certifications.length > 0 && (
                                    <div>
                                        <h4 className="font-medium text-gray-300 mb-3">Certifications</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {jdDetail.requirements.certifications.map((cert, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="secondary"
                                                    className="bg-green-900/20 text-green-400"
                                                >
                                                    {cert}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>
                )}

                {/* Benefits */}
                {jdDetail?.benefits && jdDetail.benefits.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Benefits & Perks</h3>
                        <ul className="list-disc list-inside space-y-2">
                            {jdDetail.benefits.map((benefit, index) => (
                                <li key={index} className="text-gray-400">
                                    {benefit}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </ScrollArea>
    );
}
