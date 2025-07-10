"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Star, ArrowRight } from "lucide-react";
import { RecommendedJDItem } from "@/services/file.service";

interface JobRecommendationCardProps {
    job: RecommendedJDItem["values"] & { _id: string };
    onJobClick: (job) => void;
}

export function JobRecommendCard({ job, onJobClick }: JobRecommendationCardProps) {
    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    return (
        <Card className="cursor-pointer bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 h-full flex flex-col">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white leading-tight mb-2">{truncateText(job.title, 50)}</CardTitle>

                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-400">
                        <Building2 className="w-4 h-4" />
                        <span className="text-sm font-medium">{job.companyName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{job.location}</span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 space-y-4">
                    {/* <p className="text-slate-300 text-sm leading-relaxed">{truncateText(job.description, 120)}</p> */}

                    {/* Key Skills */}
                    {job.skills && job.skills.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Key Skills</h4>
                            <div className="flex flex-wrap gap-1">
                                {job.skills.slice(0, 4).map((skill, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="text-xs bg-slate-700/50 text-slate-300 border-slate-600"
                                    >
                                        {skill}
                                    </Badge>
                                ))}
                                {job.skills.length > 4 && (
                                    <Badge
                                        variant="secondary"
                                        className="text-xs bg-slate-700/50 text-slate-300 border-slate-600"
                                    >
                                        +{job.skills.length - 4}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Benefits Preview */}
                    {/* {job.benefits && job.benefits.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Benefits</h4>
                            <div className="flex flex-wrap gap-1">
                                {job.benefits.slice(0, 3).map((benefit, index) => (
                                    <Badge
                                        key={index}
                                        variant="outline"
                                        className="text-xs border-green-500/30 text-green-400 bg-green-500/10"
                                    >
                                        {benefit}
                                    </Badge>
                                ))}
                                {job.benefits.length > 3 && (
                                    <Badge
                                        variant="outline"
                                        className="text-xs border-green-500/30 text-green-400 bg-green-500/10"
                                    >
                                        +{job.benefits.length - 3}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )} */}
                </div>

                {/* Action Button */}
                <div className="pt-4 mt-auto">
                    <Button
                        onClick={() => onJobClick(job)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                    >
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
