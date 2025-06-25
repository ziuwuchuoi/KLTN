import { BaseUser } from "@/types/types";
import axiosInstance from "./axiosInstance";

export interface Recruiter {
    _id: string;
    userId: string; // this id the same in the id of the BaseUser
    position: string;
    companyName: string;
    companyWebsite: string;
    user: BaseUser;
    createdAt: Date;
    updatedAt: Date;
}

export interface RecruiterUpdateParams {
    position: string;
    companyName: string;
    companyWebsite: string;
}

// only admin can get list of recruiters
export const getListRecruiterService = async (
    limit = 20,
    page = 1
): Promise<{
    items: Recruiter[];
    meta: { limit: number; page: number; total: number; totalPages: number };
}> => {
    const response = await axiosInstance.get(`/users/recruiters?limit=${limit}&page=${page}`);
    return response.data.data;
};

export const updateRecruiterProfileService = async (data: RecruiterUpdateParams) => {
    const response = await axiosInstance.post(`/recruiters/updateRecruiter`, data);
    return response.data.data;
};
