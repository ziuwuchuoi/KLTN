"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Mail, Calendar, FileText, Briefcase, X, ExternalLink } from "lucide-react";
import CustomDialog from "@/components/molecules/CustomDialog";
import type { Candidate } from "@/services/candidate.service";

interface DialogCandidateProps {
    isOpen: boolean;
    onClose: () => void;
    candidate: Candidate | null;
}

export function DialogCandidate({ isOpen, onClose, candidate }: DialogCandidateProps) {
    if (!candidate) return null;

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatArray = (arr: string[] | undefined) => {
        if (!arr || arr.length === 0) return "Not specified";
        return arr.join(", ");
    };

    return (
        <CustomDialog
            open={isOpen}
            onOpenChange={(open) => !open && onClose()}
            onClose={onClose}
            dialogTitle="Candidate Profile"
            className="bg-slate-800 border-slate-700 max-w-4xl max-h-[90vh]"
            childrenContainerClassName="p-0"
        >
            <ScrollArea className="max-h-[80vh]">
                <div className="space-y-6 p-6">
                    {/* Candidate Header */}
                    <div className="flex items-center gap-4">
                        <Avatar className="w-20 h-20">
                            <AvatarImage src={candidate.user.avatar || "/placeholder.svg"} alt={candidate.user.name} />
                            <AvatarFallback className="text-2xl">{candidate.user.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mt-3">
                                <h3 className="text-2xl font-bold text-white">{candidate.user.name}</h3>

                                <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                                    {candidate.user.roles?.includes("candidate") ? "Candidate" : "User"}
                                </Badge>
                            </div>
                            <p className="text-slate-400 text-lg">{candidate.user.email}</p>
                        </div>
                    </div>

                    {/* Basic Information */}
                    <Card className="bg-slate-700/30 border-slate-600">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-white text-lg flex items-center gap-2">                                Basic Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-400">Email Address</p>
                                    <p className="text-white">{candidate.user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-400">Member Since</p>
                                    <p className="text-white">{formatDate(candidate.createdAt)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <User className="w-4 h-4 text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-400">User ID</p>
                                    <p className="text-white font-mono text-sm">{candidate.userId}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <FileText className="w-4 h-4 text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-400">CV Status</p>
                                    <p className="text-white">{candidate.cvId ? "Uploaded" : "Not uploaded"}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* CV Information */}
                    {candidate.cvId && (
                        <Card className="bg-slate-700/30 border-slate-600">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-white text-lg flex items-center gap-2">
                                    CV Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-green-600/10 border border-green-500/20 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-6 h-6 text-green-400" />
                                            <div>
                                                <p className="text-green-300 font-medium">CV Document</p>
                                                <p className="text-green-200 text-sm">CV ID: {candidate.cvId}</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                                        >
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            View CV
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Job Applications
          <Card className="bg-slate-700/30 border-slate-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-400" />
                Job Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {candidate.appliedJobIds && candidate.appliedJobIds.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-slate-300">
                      Total Applications:{" "}
                      <span className="text-white font-semibold">{candidate.appliedJobIds.length}</span>
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {candidate.appliedJobIds.map((jobId, index) => (
                      <div key={index} className="bg-slate-600/30 border border-slate-600 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <Briefcase className="w-4 h-4 text-purple-400" />
                          <div className="flex-1">
                            <p className="text-white font-medium">Job Application</p>
                            <p className="text-slate-400 text-sm font-mono">{jobId}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-white mb-2">No Applications Yet</h4>
                  <p className="text-slate-400">This candidate hasn't applied for any jobs.</p>
                </div>
              )}
            </CardContent>
          </Card> */}

                    {/* Account Statistics */}
                    <Card className="bg-slate-700/30 border-slate-600">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-white text-lg flex items-center gap-2">
                                Account Statistics
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {/* <div className="text-center p-4 bg-slate-600/30 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">{candidate.appliedJobIds?.length || 0}</div>
                  <div className="text-xs text-slate-400">Applications</div>
                </div>
                <div className="text-center p-4 bg-slate-600/30 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">{candidate.cvId ? 1 : 0}</div>
                  <div className="text-xs text-slate-400">CV Uploaded</div>
                </div> */}
                                <div className="text-center p-4 bg-slate-600/30 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-400">
                                        {candidate.user.roles?.length || 0}
                                    </div>
                                    <div className="text-xs text-slate-400">Roles</div>
                                </div>
                                <div className="text-center p-4 bg-slate-600/30 rounded-lg">
                                    <div className="text-2xl font-bold text-orange-400">
                                        {Math.floor(
                                            (Date.now() - new Date(candidate.createdAt).getTime()) /
                                                (1000 * 60 * 60 * 24)
                                        )}
                                    </div>
                                    <div className="text-xs text-slate-400">Days Active</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* User Roles */}
                    <Card className="bg-slate-700/30 border-slate-600">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-white text-lg flex items-center gap-2">
                                User Roles & Permissions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {candidate.user.roles && candidate.user.roles.length > 0 ? (
                                    candidate.user.roles.map((role, index) => (
                                        <Badge
                                            key={index}
                                            variant="outline"
                                            className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
                                        >
                                            {role.charAt(0).toUpperCase() + role.slice(1)}
                                        </Badge>
                                    ))
                                ) : (
                                    <Badge
                                        variant="outline"
                                        className="bg-gray-500/20 text-gray-400 border-gray-500/30"
                                    >
                                        No specific roles assigned
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </ScrollArea>
        </CustomDialog>
    );
}
