"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { CVContent } from "./contents/CVContent";
import { JDContent } from "./contents/JDContent";
import { ApplicationContent } from "./contents/ApplicationContent";
import type { TabType } from "./PageProfile";

interface ProfileContentProps {
    activeTab: TabType;
    user: {
        _id: string;
        name: string;
        email: string;
        lastLoginDate: Date;
        createdAt?: Date;
        updatedAt?: Date;
    };
}

export function ProfileContent({ activeTab, user }: ProfileContentProps) {
    const [isEditing, setIsEditing] = useState(false);

    if (activeTab === "profile") {
        return (
            <Card className="border-gray-800 bg-black/20">
                <CardHeader className="flex flex-row justify-between">
                    <div>
                        <CardTitle className="text-white text-lg">Profile Information</CardTitle>
                        <CardDescription className="text-gray-400">
                            Your account details and information
                        </CardDescription>
                    </div>
                    <Button
                        onClick={() => setIsEditing(!isEditing)}
                        variant="outline"
                        className="border-gray-700 hover:bg-gray-800 text-white"
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6">
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
                            <h3 className="text-lg text-white font-medium mb-4">Account Information</h3>
                            <div className="grid gap-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Last Login</span>
                                    <span className="text-white">{formatDistanceToNow(user.lastLoginDate)} ago</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Account Created</span>
                                    <span className="text-white">
                                        {user.createdAt ? formatDistanceToNow(user.createdAt) + " ago" : "N/A"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Last Updated</span>
                                    <span className="text-white">
                                        {user.updatedAt ? formatDistanceToNow(user.updatedAt) + " ago" : "N/A"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (activeTab === "cvs") {
        return <CVContent />;
    }

    if (activeTab === "jds") {
        return <JDContent />;
    }

    if (activeTab === "applications") {
        return <ApplicationContent />;
    }

    return null;
}
