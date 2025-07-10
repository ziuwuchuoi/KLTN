"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    User,
    Mail,
    Calendar,
    Building2,
    Globe,
    Briefcase,
    CheckCircle,
    X,
    Clock,
    Settings,
    Award,
    ExternalLink,
} from "lucide-react";
import type { Recruiter } from "@/services/recruiter.service";
import CustomDialog from "@/components/molecules/CustomDialog";

interface DialogRecruiterProps {
    isOpen: boolean;
    onClose: () => void;
    user: Recruiter | null;
    onRoleUpdate: (email: string) => Promise<void>;
    isUpdating?: boolean;
}

export function DialogRecruiter({ isOpen, onClose, user, onRoleUpdate, isUpdating = false }: DialogRecruiterProps) {
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [hasChanges, setHasChanges] = useState(false);

    const currentRole = user?.user.canBeRecruiter ? "Recruiter" : "In request";

    useEffect(() => {
        if (isOpen && user) {
            const initialRole = user.user.canBeRecruiter ? "Recruiter" : "In request";
            setSelectedRole(initialRole);
            setHasChanges(false);
        }
    }, [isOpen, user]);

    if (!user) return null;

    const handleOpenChange = (open: boolean) => {
        if (!open) onClose();
    };

    const handleRoleChange = (newRole: string) => {
        setSelectedRole(newRole);
        setHasChanges(newRole !== currentRole);
    };

    const handleUpdate = async () => {
        if (selectedRole === "Recruiter" && !user.user.canBeRecruiter) {
            await onRoleUpdate(user.user.email);
            setHasChanges(false);
        }
    };

    const handleCancel = () => {
        setSelectedRole(currentRole);
        setHasChanges(false);
    };

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getDaysActive = () => {
        return Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    };

    return (
        <CustomDialog
            open={isOpen}
            onOpenChange={handleOpenChange}
            onClose={onClose}
            dialogTitle="Recruiter Profile"
            className="bg-slate-900 border-slate-700 max-w-4xl max-h-[97vh]"
            childrenContainerClassName="p-0"
        >
            <div className="max-h-[85vh] overflow-y-auto">
                <div className=" space-y-6">
                    {/* Enhanced Header Section */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-xl" />
                        <div className="relative p-6 rounded-xl border border-slate-700/50">
                            <div className="flex items-start gap-6">
                                <div className="relative">
                                    <Avatar className="w-18 h-18 ring-4 ring-purple-500/20">
                                        <AvatarImage
                                            src={user.user.avatar || "/placeholder.svg"}
                                            alt={user.user.name}
                                        />
                                        <AvatarFallback className="text-xl bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                                            {user.user.name?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    {user.user.canBeRecruiter && (
                                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                            <CheckCircle className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 space-y-3">
                                    <div>
                                        <h2 className="text-3xl font-bold text-white mb-2">{user.user.name}</h2>
                                        <p className="text-slate-300 text-lg">{user.user.email}</p>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-3 py-1">
                                            <Briefcase className="w-3 h-3 mr-1" />
                                            Recruiter
                                        </Badge>

                                        {user.user.canBeRecruiter ? (
                                            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-3 py-1">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Verified Recruiter
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 px-3 py-1">
                                                <Clock className="w-3 h-3 mr-1" />
                                                Pending Approval
                                            </Badge>
                                        )}

                                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-3 py-1">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {getDaysActive()} days active
                                        </Badge>
                                    </div>
                                </div>
                            </div>
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
                                            <p className="text-white font-medium">{user.user.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-400 mb-1">Member Since</p>
                                            <p className="text-white font-medium">{formatDate(user.createdAt)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                                        <User className="w-4 h-4 text-slate-400" />
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-400 mb-1">User ID</p>
                                            <p className="text-white font-mono text-sm">{user.userId}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Company Information */}
                        <Card className="bg-slate-800/30 border-slate-700">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-white text-lg flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-purple-400" />
                                    Company Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                                        <Briefcase className="w-4 h-4 text-slate-400" />
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-400 mb-1">Position</p>
                                            <p className="text-white font-medium">{user.position || "Not specified"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                                        <Building2 className="w-4 h-4 text-slate-400" />
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-400 mb-1">Company Name</p>
                                            <p className="text-white font-medium">
                                                {user.companyName || "Not specified"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                                        <Globe className="w-4 h-4 text-slate-400" />
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-400 mb-1">Company Website</p>
                                            {user.companyWebsite ? (
                                                <div className="flex items-center gap-2">
                                                    <p className="text-white font-medium">{user.companyWebsite}</p>
                                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                                        <ExternalLink className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <p className="text-white font-medium">Not specified</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Role Management */}
                    <Card className="bg-slate-800/30 border-slate-700">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-white text-lg flex items-center gap-2">
                                <Settings className="w-5 h-5 text-green-400" />
                                Role Management
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {user.user.canBeRecruiter ? (
                                <div className="bg-gradient-to-r from-green-600/10 to-emerald-600/10 border border-green-500/20 rounded-lg p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                                            <Award className="w-6 h-6 text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-green-300 font-semibold text-lg">Active Recruiter</p>
                                            <p className="text-green-200 text-sm">
                                                This user has been granted full recruiter permissions and can access all
                                                recruiting features.
                                            </p>
                                            <p className="text-green-200/80 text-xs mt-1">
                                                Verified on {formatDate(user.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white">Role Status</label>
                                        <Select value={selectedRole} onValueChange={handleRoleChange}>
                                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                                <SelectValue placeholder={currentRole} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="In request">In request</SelectItem>
                                                <SelectItem value="Recruiter">Recruiter</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {hasChanges && (
                                        <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/20 rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <Settings className="w-5 h-5 text-blue-400 mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="text-blue-300 font-medium mb-2">
                                                        Confirm Role Change
                                                    </p>
                                                    <p className="text-blue-200 text-sm mb-4">
                                                        You are about to change this user's role from "{currentRole}" to
                                                        "{selectedRole}". This action will grant them full recruiter
                                                        access.
                                                    </p>
                                                    <div className="flex gap-3">
                                                        <Button
                                                            onClick={handleUpdate}
                                                            disabled={isUpdating}
                                                            size="sm"
                                                            className="bg-green-600 hover:bg-green-700 text-white"
                                                        >
                                                            {isUpdating ? "Updating..." : "Confirm Update"}
                                                        </Button>
                                                        <Button
                                                            onClick={handleCancel}
                                                            disabled={isUpdating}
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-slate-600 text-white hover:bg-slate-700 bg-transparent"
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {!hasChanges && (
                                        <div className="bg-slate-600/20 border border-slate-600/30 rounded-lg p-4">
                                            <div className="flex items-center gap-3">
                                                <Clock className="w-5 h-5 text-slate-400" />
                                                <div>
                                                    <p className="text-slate-300 font-medium">Current Status</p>
                                                    <p className="text-slate-400 text-sm">
                                                        Role:{" "}
                                                        <span className="text-white font-medium">{currentRole}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

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
