"use client";

import { useState } from "react";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileContent } from "./ProfileContent";
import { Button } from "@/components/ui/button";
import { User, FileText, Briefcase, Send } from "lucide-react";
import { AdminUser, CandidateUser, RecruiterUser } from "@/types/types";
import { CandidateUpdateParams } from "@/services/candidate.service";
import { RecruiterUpdateParams } from "@/services/recruiter.service";

export type TabType = "profile" | "cvs" | "jds" | "applications";

interface ProfileSubPageProps {
    userType: "candidate" | "recruiter" | "admin";
    user: AdminUser | RecruiterUser | CandidateUser;
    onUpdateAvatar?: (avatar: string) => void;
    onUpdateInfo?: (data: CandidateUpdateParams | RecruiterUpdateParams) => void;
}

const ProfileSubPage = ({ userType, user, onUpdateAvatar, onUpdateInfo }: ProfileSubPageProps) => {
    const [activeTab, setActiveTab] = useState<TabType>("profile");

    const candidateTabs = [
        { id: "profile" as TabType, label: "Profile", icon: User },
        { id: "cvs" as TabType, label: "My CVs", icon: FileText },
        { id: "jds" as TabType, label: "Job Descriptions", icon: Briefcase },
        { id: "applications" as TabType, label: "Applications", icon: Send },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            <div className="container mx-auto px-4 py-12 pt-28">
                <div className="max-w-6xl mx-auto">
                    {/* Profile Header */}
                    <div className="mb-8">
                        <ProfileHeader user={user} userType={userType} updateAvatar={onUpdateAvatar} />
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar - Only show for candidates */}
                        {userType === "candidate" && (
                            <div className="lg:w-64 flex-shrink-0">
                                <div className="bg-black/20 border border-gray-800 rounded-lg p-4">
                                    <nav className="space-y-2">
                                        {candidateTabs.map((tab) => {
                                            const Icon = tab.icon;
                                            return (
                                                <Button
                                                    key={tab.id}
                                                    onClick={() => setActiveTab(tab.id)}
                                                    variant={activeTab === tab.id ? "secondary" : "ghost"}
                                                    className={`w-full justify-start ${
                                                        activeTab === tab.id
                                                            ? "bg-gray-800 text-white"
                                                            : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                                                    }`}
                                                >
                                                    <Icon className="h-4 w-4 mr-3" />
                                                    {tab.label}
                                                </Button>
                                            );
                                        })}
                                    </nav>
                                </div>
                            </div>
                        )}

                        {/* Main Content */}
                        <div className="flex-1">
                            <ProfileContent
                                userType={userType}
                                user={user}
                                activeTab={userType === "candidate" ? activeTab : undefined}
                                onUpdateInfo={onUpdateInfo}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSubPage;
