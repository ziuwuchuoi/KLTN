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

// only admin can get list of recruiters
export const getListRecruiterService = async (
    limit = 20,
    page = 1
): Promise<{
    items: Recruiter[];
    meta: { limit: number; page: number; total: number; totalPages: number };
}> => {
    const response = await axiosInstance.get(`/users/recruiters?limit=${limit}&page=${page}`);
    console.log("response.data candi", response.data);
    return response.data.data;
};

