import axiosInstance from "./axiosInstance";

export interface CVItem {
    _id: string;
    candidateId: string;
    fileUrl: string;
    fileName: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface JDItem {
    _id: string;
    creatorUserId: string;
    title: string;
    description: string;
    companyName: string;
    location: string;
    benefits: string[];
    visibility: string; // public or private
}

export interface CVDetail {
    _id: string;
    candidateId: string;
    fileUrl: string;
    fileName: string;
    information: {
        certifications: string[];
        education: string[];
        experience: string[];
        languages: string[];
        projects: string[];
        skills: string[];
        summary: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface JDDetail {
    _id: string;
    creatorUserId: string;
    title: string;
    description: string;
    companyName: string;
    location: string;
    requirements: {
        experience: string[];
        skills: string[];
        education: string[];
        projects: string[];
        languages: string[];
        certifications: string[];
        summary: string;
    };
    benefits: string[];
    visibility: string; // public or private
}

export interface AtsCheckParams {
    formatting_tips: string[];
    issues: string[];
    missing_entities: [];
    missing_keywords: string[];
    recommendations: string[];
}

export interface SkillAnalysisParams {
    match_percent: number;
    matched_skills: string[];
    missing_skills: string[];
}

export interface SummaryParams {
    fit_level: string;
    overall_score: number;
    similarity_score: number;
    skill_match_score: number;
}

export interface EvaluatedCVResult {
    _id: string;
    cvId: string;
    jdId: string;
    candidateId: string;
    reviewCVResponse: {
        ai_review: string;
        ats_check: AtsCheckParams;
        skills_analysis: SkillAnalysisParams;
        summary: SummaryParams;
    };
    createdAt: Date;
    updatedAt: Date;
}

export const getListCVService = async (
    candidateId: string,
    limit = 20,
    page = 1
): Promise<{
    items: CVItem[];
    meta: { limit: number; page: number; total: number; totalPages: number };
}> => {
    const url = candidateId
        ? `/cvs/list-cvs?candidateId=${candidateId}&limit=${limit}&page=${page}`
        : `/cvs/list-cvs?limit=${limit}&page=${page}`;

    const response = await axiosInstance.get(url);
    return response.data.data;
};

export const getCVByIdService = async (cvId: string): Promise<CVDetail> => {
    const response = await axiosInstance.get(`/cvs/cv/${cvId}`);
    return response.data.data;
};

export const uploadCVService = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const uploadRes = await axiosInstance.post("/cvs/uploadFile", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    const imageUrl = uploadRes.data?.data?.imageUrl;

    const fileUrl = imageUrl;
    const fileName = file.name;

    const saveRes = await axiosInstance.post("/cvs/uploadCV", { fileName, fileUrl });

    return saveRes.data?.data;
};

export const getListJDService = async (
    creatorUserId: string,
    limit = 20,
    page = 1
): Promise<{
    items: JDItem[];
    meta: { limit: number; page: number; total: number; totalPages: number };
}> => {
    const url = creatorUserId
        ? `/cvs/list-jds?creatorUserId=${creatorUserId}&limit=${limit}&page=${page}`
        : `/cvs/list-jds?limit=${limit}&page=${page}`;

    const response = await axiosInstance.get(url);
    return response.data.data;
};

export const getJDByIdService = async (jdId: string): Promise<JDDetail> => {
    const response = await axiosInstance.get(`/cvs/jd/${jdId}`);
    return response.data.data;
};

export const uploadJDService = async (data: Partial<JDDetail>) => {
    console.log("uploading JD data", data);

    const response = await axiosInstance.post(`/cvs/uploadJD`, data);

    console.log("response", response.data);
    return response.data.data;
};

export const evaluateCVService = async (cvId: string, jdId: string): Promise<EvaluatedCVResult> => {
    const response = await axiosInstance.post(`/cvs/reviewCV/${cvId}/${jdId}`);

    return response.data.data;
};
