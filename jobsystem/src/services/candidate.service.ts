import { BaseUser } from "@/types/types";
import axiosInstance from "./axiosInstance";

export interface Candidate {
    _id: string;
    userId: string; // this id the same in the id of the BaseUser
    cvId?: string[];
    user: BaseUser;
    createdAt: Date;
    updatedAt: Date;
}

export interface updateInfoParams {
    experience: string[];
    skills: string[];
    education: string[];
    projects: string[];
    summary: string;
    certifications: string[];
    languages: string[];
}

// only admin can get list of candidates
export const getListCandidateService = async (
    limit = 20,
    page = 1
): Promise<{
    items: Candidate[];
    meta: { limit: number; page: number; total: number; totalPages: number };
}> => {
    const response = await axiosInstance.get(`/users/candidates?limit=${limit}&page=${page}`);
    console.log("response.data.data candi", response.data.data);
    return response.data.data;
};

export const updateCandidateProfileService = async (data: updateInfoParams) => {
    const response = await axiosInstance.post(`/candidates/updateCandidateProfile`, data);

    return response.data.data;
};
