"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Building2, MapPin } from "lucide-react";
import { CustomPagination } from "@/components/molecules/CustomPagination";
import type { JDItem } from "@/services/file.service";

interface JobListPanelProps {
    jobs: JDItem[];
    isLoading: boolean;
    selectedJobId: string;
    onJobSelect: (job: JDItem) => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function JobListPanel({
    jobs,
    isLoading,
    selectedJobId,
    onJobSelect,
    currentPage,
    totalPages,
    onPageChange,
}: JobListPanelProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredJobs = jobs.filter(
        (job) =>
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.companyName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    return (
        <Card className="flex-1 bg-slate-800/50 border-slate-700 flex flex-col">
            <CardHeader className="pb-4 flex-shrink-0">
                <div className="space-y-4">
                    <CardTitle className="text-lg text-white">Available Jobs</CardTitle>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                            placeholder="Search jobs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-slate-700 border-slate-600 text-white"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col">
                <ScrollArea className="h-[calc(100vh-310px)]">
                    <div className="space-y-2 p-4">
                        {isLoading ? (
                            Array.from({ length: 10 }).map((_, i) => (
                                <div key={i} className="p-4 bg-slate-700/50 rounded-lg animate-pulse">
                                    <div className="h-4 bg-slate-600 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-slate-600 rounded w-1/2 mb-2"></div>
                                    <div className="h-3 bg-slate-600 rounded w-full"></div>
                                </div>
                            ))
                        ) : filteredJobs.length === 0 ? (
                            <div className="text-center py-8 text-slate-400">No jobs found</div>
                        ) : (
                            filteredJobs.map((job) => (
                                <div
                                    key={job._id}
                                    onClick={() => onJobSelect(job)}
                                    className={`p-4 rounded-lg cursor-pointer transition-colors border ${
                                        selectedJobId === job._id
                                            ? "bg-blue-600/20 border-blue-500/50"
                                            : "bg-slate-700/30 border-slate-600 hover:bg-slate-700/50"
                                    }`}
                                >
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-white text-sm leading-tight">{job.title}</h3>
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <Building2 className="w-3 h-3" />
                                            {job.companyName}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <MapPin className="w-3 h-3" />
                                            {job.location}
                                        </div>
                                        <p className="text-xs text-slate-400 leading-relaxed">
                                            {truncateText(job.description, 100)}
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                            {job.benefits?.slice(0, 2).map((benefit, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="secondary"
                                                    className="text-xs bg-slate-600 text-slate-300"
                                                >
                                                    {benefit}
                                                </Badge>
                                            ))}
                                            {job.benefits && job.benefits.length > 2 && (
                                                <Badge
                                                    variant="secondary"
                                                    className="text-xs bg-slate-600 text-slate-300"
                                                >
                                                    +{job.benefits.length - 2}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>

                {/* Pagination */}
                    <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
            </CardContent>
        </Card>
    );
}
