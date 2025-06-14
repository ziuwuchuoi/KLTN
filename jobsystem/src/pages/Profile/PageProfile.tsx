import { useState } from "react";
import { ProfileContent } from "./ProfileContent";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileSidebar } from "./ProfileSideBar";
import { useAuthStore } from "@/stores/useAuthStore";

export type TabType = "profile" | "cvs" | "jds" | "applications";

const PageProfile = () => {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState<TabType>("profile");

    const updateAvatar = (avatar: string) => {
        
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-slate-900 to-gray-900 text-white">
            <div className="container max-w-6xl mx-auto px-4 py-12">
                <div className="space-y-8">
                    {/* Profile Header - Avatar, Name, Email */}
                    <ProfileHeader user={user} updateAvatar={updateAvatar} />

                    {/* Main Content Area with Sidebar */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar Menu */}
                        <div className="lg:col-span-1">
                            <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                        </div>

                        {/* Content Area */}
                        <div className="lg:col-span-3">
                            <ProfileContent activeTab={activeTab} user={user} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default PageProfile