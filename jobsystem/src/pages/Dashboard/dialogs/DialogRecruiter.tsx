"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Calendar, Building2, Globe, Briefcase, CheckCircle, X } from "lucide-react";
import CustomDialog from "@/components/molecules/CustomDialog";
import type { Recruiter } from "@/services/recruiter.service";

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

    return (
        <CustomDialog
            open={isOpen}
            onOpenChange={handleOpenChange}
            onClose={onClose}
            dialogTitle="Recruiter Details"
            className="bg-slate-800 border-slate-700 max-w-2xl"
            childrenContainerClassName="space-y-6"
        >
            {/* User Header */}
            <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                    <AvatarImage src={user.user.avatar || "/placeholder.svg"} alt={user.user.name} />
                    <AvatarFallback className="text-lg">{user.user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mt-2">
                        <h3 className="text-xl font-semibold text-white">{user.user.name}</h3>

                        <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            {user.user.roles?.includes("recruiter") ? "Recruiter" : "User"}
                        </Badge>
                        {user.user.canBeRecruiter && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified
                            </Badge>
                        )}
                    </div>
                    <p className="text-slate-400">{user.user.email}</p>
                </div>
            </div>

            {/* User Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <Card className="bg-slate-700/30 border-slate-600">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-white text-lg flex items-center gap-2">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-slate-400" />
                            <div>
                                <p className="text-xs text-slate-400">Email</p>
                                <p className="text-white">{user.user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <div>
                                <p className="text-xs text-slate-400">Joined</p>
                                <p className="text-white">{formatDate(user.createdAt)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <User className="w-4 h-4 text-slate-400" />
                            <div>
                                <p className="text-xs text-slate-400">User ID</p>
                                <p className="text-white font-mono text-sm">{user.userId}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recruiter Information */}
                <Card className="bg-slate-700/30 border-slate-600">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-white text-lg flex items-center gap-2">
                            Recruiter Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Briefcase className="w-4 h-4 text-slate-400" />
                            <div>
                                <p className="text-xs text-slate-400">Position</p>
                                <p className="text-white">{user.position || "Not specified"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Building2 className="w-4 h-4 text-slate-400" />
                            <div>
                                <p className="text-xs text-slate-400">Company</p>
                                <p className="text-white">{user.companyName || "Not specified"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Globe className="w-4 h-4 text-slate-400" />
                            <div>
                                <p className="text-xs text-slate-400">Website</p>
                                <p className="text-white">{user.companyWebsite || "Not specified"}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Role Management */}
            <Card className="bg-slate-700/30 border-slate-600">
                <CardHeader className="pb-3">
                    <CardTitle className="text-white text-lg">Role Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* If user is already a recruiter, just show current status */}
                    {user.user.canBeRecruiter ? (
                        <div className="bg-green-600/10 border border-green-500/20 rounded-lg p-4">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                <div className="ml-2">
                                    <p className="text-green-300 font-medium">Active Recruiter</p>
                                    <p className="text-green-200 text-sm">
                                        This user has been granted recruiter permissions
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Show role selection only for pending requests */
                        <>
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
                                <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4">
                                    <p className="text-blue-300 text-sm mb-3">
                                        You are about to change this user's role from "{currentRole}" to "{selectedRole}
                                        ".
                                    </p>
                                    <div className="flex gap-3">
                                        <Button
                                            onClick={handleUpdate}
                                            disabled={isUpdating}
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            {isUpdating ? "Updating..." : "Confirm Update"}
                                        </Button>
                                        <Button
                                            onClick={handleCancel}
                                            disabled={isUpdating}
                                            variant="outline"
                                            size="sm"
                                            className="border-slate-600 text-white"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {!hasChanges && (
                                <div className="bg-slate-600/20 border border-slate-600/30 rounded-lg p-4">
                                    <p className="text-slate-400 text-sm">
                                        Current status: <span className="text-white font-medium">{currentRole}</span>
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </CustomDialog>
    );
}
