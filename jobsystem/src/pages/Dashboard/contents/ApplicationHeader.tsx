"use client";

import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Clock, XCircle, Award } from "lucide-react";
import type { ApplicationDetail, ApplicationStatus } from "@/services/file.service";

interface ApplicationHeaderProps {
    applicationDetail: ApplicationDetail | null;
    currentStatus: ApplicationStatus;
    onStatusChange: (status: ApplicationStatus) => void;
}

const statusColors = {
    pending: { bg: "bg-yellow-900/20", text: "text-yellow-400", border: "border-yellow-500/30", icon: Clock },
    shortlisted: { bg: "bg-blue-900/20", text: "text-blue-400", border: "border-blue-500/30", icon: CheckCircle },
    rejected: { bg: "bg-red-900/20", text: "text-red-400", border: "border-red-500/30", icon: XCircle },
    accepted: { bg: "bg-green-900/20", text: "text-green-400", border: "border-green-500/30", icon: Award },
};

export function ApplicationHeader({ applicationDetail, currentStatus, onStatusChange }: ApplicationHeaderProps) {
    const statusConfig = statusColors[currentStatus] || statusColors.pending;
    const StatusIcon = statusConfig.icon;

    return (
        <div className="flex items-center justify-between w-full">
            <div className="space-y-3 flex-1">
                <div className="flex items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Application Details</h2>
                        <div className="text-sm text-gray-400 mt-1">
                            ID: <span className="font-mono">{applicationDetail?._id}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <StatusIcon className={`h-5 w-5 ${statusConfig.text}`} />
                        <Badge
                            variant="outline"
                            className={`${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                        >
                            {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                        </Badge>
                    </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400">Overall Score:</span>
                        <span className="text-2xl font-bold text-blue-400">
                            {applicationDetail?.overallScore ? `${Math.round(applicationDetail.overallScore)}%` : "N/A"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400">Applied:</span>
                        <span className="text-white font-medium">
                            {applicationDetail?.createdAt
                                ? new Date(applicationDetail.createdAt).toLocaleDateString()
                                : "N/A"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 ml-6">
                <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">Status:</span>
                    <Select value={currentStatus} onValueChange={onStatusChange}>
                        <SelectTrigger className="w-36 bg-slate-700 border-slate-600 text-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="shortlisted">Shortlisted</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
