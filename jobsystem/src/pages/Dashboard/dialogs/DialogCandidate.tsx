"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Mail, Calendar, X, Clock, Activity } from "lucide-react";
import type { Candidate } from "@/services/candidate.service";
import CustomDialog from "@/components/molecules/CustomDialog";

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

    const getDaysActive = () => {
        return Math.floor((Date.now() - new Date(candidate.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    };

    return (
        <CustomDialog
            open={isOpen}
            onOpenChange={(open) => !open && onClose()}
            onClose={onClose}
            dialogTitle="Candidate Profile"
            className="bg-slate-900 border-slate-700 max-w-4xl max-h-[90vh]"
            childrenContainerClassName="p-0"
        >
            <ScrollArea className="max-h-[85vh]">
                <div className="p-6 space-y-6">
                    {/* Enhanced Header Section */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl" />
                        <div className="relative p-6 rounded-xl border border-slate-700/50">
                            <div className="flex items-start gap-6">
                                <div className="relative">
                                    <Avatar className="w-24 h-24 ring-4 ring-blue-500/20">
                                        <AvatarImage
                                            src={candidate.user.avatar || "/placeholder.svg"}
                                            alt={candidate.user.name}
                                        />
                                        <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                            {candidate.user.name?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                </div>

                                <div className="flex-1 space-y-3">
                                    <div>
                                        <h2 className="text-3xl font-bold text-white mb-2">{candidate.user.name}</h2>
                                        <p className="text-slate-300 text-lg">{candidate.user.email}</p>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-3 py-1">
                                            <User className="w-3 h-3 mr-1" />
                                            Candidate
                                        </Badge>

                                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-3 py-1">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {getDaysActive()} days active
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-purple-400 mb-1">{getDaysActive()}</div>
                            <div className="text-xs text-slate-400">Days Active</div>
                        </div>

                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-orange-400 mb-1">
                                {new Date(candidate.createdAt).getFullYear()}
                            </div>
                            <div className="text-xs text-slate-400">Member Since</div>
                        </div>

                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-blue-400 mb-1">Active</div>
                            <div className="text-xs text-slate-400">Account Status</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Personal Information */}
                        <Card className="bg-slate-800/30 border-slate-700">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-white text-lg flex items-center gap-2">
                                    <User className="w-5 h-5 text-blue-400" />
                                    Personal Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                                        <Mail className="w-4 h-4 text-slate-400" />
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-400 mb-1">Email Address</p>
                                            <p className="text-white font-medium">{candidate.user.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-400 mb-1">Member Since</p>
                                            <p className="text-white font-medium">{formatDate(candidate.createdAt)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                                        <Activity className="w-4 h-4 text-slate-400" />
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-400 mb-1">User ID</p>
                                            <p className="text-white font-mono text-sm">{candidate.userId}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Account Status */}
                        <Card className="bg-slate-800/30 border-slate-700">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-white text-lg flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-green-400" />
                                    Account Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="p-3 bg-slate-700/30 rounded-lg">
                                        <p className="text-xs text-slate-400 mb-2">Account Activity</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                            <span className="text-white text-sm">Active Account</span>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-slate-700/30 rounded-lg">
                                        <p className="text-xs text-slate-400 mb-2">Registration Date</p>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            <span className="text-white text-sm">
                                                {formatDate(candidate.createdAt)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-slate-700/30 rounded-lg">
                                        <p className="text-xs text-slate-400 mb-2">Account Type</p>
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-slate-400" />
                                            <span className="text-white text-sm">Candidate Profile</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </ScrollArea>

            {/* Footer */}
            {/* <div className="flex justify-end">
                <Button
                    onClick={onClose}
                    variant="outline"
                    className="border-slate-600 hover:bg-slate-700 bg-transparent text-white"
                >
                    <X className="w-4 h-4 mr-2" />
                    Close
                </Button>
            </div> */}
        </CustomDialog>
    );
}
