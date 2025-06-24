"use client";

import { CandidateUpdateParams } from "@/services/candidate.service";
import ProfileSubPage from "./ProfileSubPage";
import { useAuthStore } from "@/stores/useAuthStore";
import { RecruiterUpdateParams } from "@/services/recruiter.service";

const PageProfile = () => {
    const { user, admin, role } = useAuthStore();
    const getUserTypeAndData = () => {
        switch (role) {
            case "admin":
                return {
                    userType: "admin" as const,
                    userData: admin,
                };
            case "recruiter":
                return {
                    userType: "recruiter" as const,
                    userData: user,
                };
            case "candidate":
                return {
                    userType: "candidate" as const,
                    userData: user,
                };
            default:
                // Fallback: if user has multiple roles, prioritize candidate
                if (user?.roles?.includes("candidate")) {
                    return {
                        userType: "candidate" as const,
                        userData: user,
                    };
                } else if (user?.roles?.includes("recruiter")) {
                    return {
                        userType: "recruiter" as const,
                        userData: user,
                    };
                }
                return {
                    userType: "candidate" as const,
                    userData: user,
                };
        }
    };

    const { userType, userData } = getUserTypeAndData();

    const handleUpdateAvatar = async (avatar: string) => {
        try {
            // TODO: Implement your avatar update API call here
            console.log("Updating avatar:", avatar);

            // Example API call:
            // await updateUserAvatar(userData._id, avatar)

            // Update the store after successful API call
            // updateUserInStore({ ...userData, avatar })
        } catch (error) {
            console.error("Failed to update avatar:", error);
            // Handle error (show toast, etc.)
        }
    };

    // Handle profile info update
    const handleUpdateInfo = async (data: CandidateUpdateParams | RecruiterUpdateParams) => {
        try {
            console.log("Updating profile info:", data);

            // TODO: Implement your profile update API calls here
            // Based on userType, call different APIs:

            if (userType === "candidate") {
                // await updateCandidateInfo(userData._id, data)
            } else if (userType === "recruiter") {
                // await updateRecruiterInfo(userData._id, data)
            } else if (userType === "admin") {
                // await updateAdminInfo(userData._id, data)
            }

            // Update the store after successful API call
            // updateUserInStore({ ...userData, ...data })
        } catch (error) {
            console.error("Failed to update profile info:", error);
            // Handle error (show toast, etc.)
        }
    };

    // Show loading state if no user data
    if (!userData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <ProfileSubPage
            userType={userType}
            user={userData}
            onUpdateAvatar={handleUpdateAvatar}
            onUpdateInfo={handleUpdateInfo}
        />
    );
};

export default PageProfile;
