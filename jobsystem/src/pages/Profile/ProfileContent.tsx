"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Building, Shield, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { CVContent } from "./contents/CVContent";
import { JDContent } from "./contents/JDContent";
import { ApplicationContent } from "./contents/ApplicationContent";
import { RecruiterUpdateParams } from "@/services/recruiter.service";
import { CandidateUpdateParams } from "@/services/candidate.service";
import { AdminUser, CandidateUser, RecruiterUser } from "@/types/types";
import { EvaluationContent } from "./contents/EvaluationContent";

type TabType = "profile" | "cvs" | "jds" | "applications" | "evaluations";

interface ProfileContentProps {
    userType: "candidate" | "recruiter" | "admin";
    user: CandidateUser | RecruiterUser | AdminUser;
    activeTab?: TabType;
    onUpdateInfo?: (data: RecruiterUpdateParams | CandidateUpdateParams) => void;
}

export function ProfileContent({ userType, user, activeTab, onUpdateInfo }: ProfileContentProps) {
    const [isEditing, setIsEditing] = useState(false);

    const renderCandidateProfile = (user: CandidateUser) => (
        <div className="space-y-6 pb-6">
            <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-400">Full Name</label>
                        <p className="text-sm text-white">{user.name}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-400">Email Address</label>
                        <p className="text-sm text-white">{user.email}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-400">Position</label>
                        <p className="text-sm text-white">{user.extraInfo?.position || "Not specified"}</p>
                    </div>
                </div>

                {user.extraInfo?.information?.summary && (
                    <div>
                        <label className="text-sm font-medium text-gray-400">Summary</label>
                        <p className="text-sm text-white">{user.extraInfo.information.summary}</p>
                    </div>
                )}

                {user.extraInfo?.information?.skills && user.extraInfo.information.skills.length > 0 && (
                    <div>
                        <label className="text-sm font-medium text-gray-400">Skills</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {user.extraInfo.information.skills.map((skill, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-800 text-white text-xs rounded">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderRecruiterProfile = (user: RecruiterUser) => (
        <div className="space-y-6 pb-6">
            <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-400">Full Name</label>
                        <p className="text-sm text-white">{user.name}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-400">Email Address</label>
                        <p className="text-sm text-white">{user.email}</p>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-4">
                    <h3 className="text-lg text-white font-medium mb-4 flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        Company Information
                    </h3>
                    <div className="grid-cols-3 grid">
                        <div>
                            <label className="text-sm font-medium text-gray-400">Position</label>
                            <p className="text-sm text-white">{user.extraInfo?.position || "Not specified"}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-400">Company Name</label>
                            <p className="text-sm text-white">{user.extraInfo?.companyName || "Not specified"}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-400">Company Website</label>
                            <p className="text-sm text-white">
                                {user.extraInfo?.companyWebsite ? (
                                    <a
                                        href={user.extraInfo.companyWebsite}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300"
                                    >
                                        {user.extraInfo.companyWebsite}
                                    </a>
                                ) : (
                                    "Not specified"
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAdminProfile = (user: AdminUser) => (
        <div className="space-y-6 pb-6">
            <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-400">Full Name</label>
                        <p className="text-sm text-white">{user.name}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-400">Email Address</label>
                        <p className="text-sm text-white">{user.email}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-400">Role</label>
                        <p className="text-sm text-white capitalize">{user.role}</p>
                    </div>
                    {user.phoneNumber && (
                        <div>
                            <label className="text-sm font-medium text-gray-400">Phone Number</label>
                            <p className="text-sm text-white">{user.phoneNumber}</p>
                        </div>
                    )}
                </div>

                {user.permissions && user.permissions.length > 0 && (
                    <div className="border-t border-gray-800 pt-4">
                        <h3 className="text-lg text-white font-medium mb-4 flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Permissions
                        </h3>
                        <div className="space-y-2">
                            {user.permissions.map((permission, index) => (
                                <div key={index} className="flex items-center gap-2 text-xs">
                                    <span className="px-2 py-1 text-white">{permission.action.toUpperCase()}:</span>
                                    <span className="px-2 py-1 bg-green-900/20 text-green-400 text-xs rounded border border-green-800">
                                        {permission.subject.toUpperCase()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderAccountInfo = () => {
        const lastLoginDate = "lastLoginDate" in user ? user?.lastLoginDate : null;
        const createdAt = user.createdAt;
        const updatedAt = user.updatedAt;

        return (
            <div className="border-t border-gray-800 pt-4">
                <h3 className="text-lg text-white font-medium mb-4">Account Information</h3>
                <div className="grid gap-3 text-sm">
                    {lastLoginDate && (
                        <div className="flex justify-between">
                            <span className="text-gray-400">Last Login</span>
                            <span className="text-white">{formatDistanceToNow(new Date(lastLoginDate))} ago</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-gray-400">Account Created</span>
                        <span className="text-white">
                            {createdAt ? formatDistanceToNow(new Date(createdAt)) + " ago" : "N/A"}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Last Updated</span>
                        <span className="text-white">
                            {updatedAt ? formatDistanceToNow(new Date(updatedAt)) + " ago" : "N/A"}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    // For candidates with tabs
    if (userType === "candidate" && activeTab) {
        if (activeTab === "cvs") {
            return <CVContent />;
        }
        if (activeTab === "jds") {
            return <JDContent />;
        }
        if (activeTab === "applications") {
            return <ApplicationContent />;
        }
        if (activeTab === "evaluations") {
            return <EvaluationContent />;
        }
    }

    // Profile information for all user types
    return (
        <Card className="border-gray-800 bg-black/20">
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Profile Information
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                        {userType === "candidate" && "Your personal and professional information"}
                        {userType === "recruiter" && "Your recruiter profile and company details"}
                        {userType === "admin" && "Administrator account details and permissions"}
                    </CardDescription>
                </div>
                {onUpdateInfo && (
                    <Button
                        onClick={() => setIsEditing(!isEditing)}
                        variant="outline"
                        className="border-gray-700 hover:bg-gray-800 text-white"
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                {userType === "candidate" && renderCandidateProfile(user as CandidateUser)}
                {userType === "recruiter" && renderRecruiterProfile(user as RecruiterUser)}
                {userType === "admin" && renderAdminProfile(user as AdminUser)}
                {renderAccountInfo()}
            </CardContent>
        </Card>
    );
}
