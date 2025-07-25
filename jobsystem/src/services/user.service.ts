import { AdminUser, CandidateUser, RecruiterUser } from "@/types/types";
import axiosInstance from "./axiosInstance";

export interface GrantRecruiterResponse {
    _id: string;
    email: string;
    name: string;
    avatar: string;
    canBeRecruiter: boolean;
}

// candidate and recruiter
export const getUserProfileService = async (): Promise<RecruiterUser | CandidateUser > => {
    const response = await axiosInstance.get("/users/getUserProfile");
    return response.data.data;
};

// admin
export const getAdminProfileService = async (): Promise<AdminUser> => {
    const response = await axiosInstance.get("/admins/getAdminInfo");
    return response.data.data;
};

export const grantRecruiterRoleService = async (email: string): Promise<GrantRecruiterResponse> => {
    const response = await axiosInstance.put(`/users/grant-recruiter/${email}`);
    return response.data.data;
};
