import axiosInstance from "./axiosInstance";

export type ApplicationStatus = "pending" | "shortlisted" | "rejected" | "accepted";

export interface CVItem {
    _id: string;
    candidateId: string;
    position: string;
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
    position: string;
    companyName: string;
    location: string;
    benefits: string[];
    visibility: string; // public or private
}

export interface ApplicationItem {
    _id: string;
    candidateId: string;
    cvId: string;
    jdId: string;
    evaluationId: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    overallScore: number;
    cv: Partial<CVItem>; // no createdAt updatedAt
    jd: JDItem;
}

export interface EvaluatedCVItem {
    _id: string;
    candidateId: string;
    cvId: string;
    jdId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CVDetail {
    _id: string;
    candidateId: string;
    fileUrl: string;
    fileName: string;
    position: string;
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
    position: string;
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
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ApplicationDetail {
    _id: string;
    candidateId: string;
    cvId: string;
    jdId: string;
    evaluationId: string;
    status: string;
    overallScore: number;
    cv: CVDetail;
    jd: JDDetail;
    evaluation: EvaluatedCVDetail;
    createdAt: string;
    updatedAt: string;
}

export interface AtsCheckParams {
    formatting_tips: string[];
    issues: string[];
    missing_keywords: string[];
    recommendations: string[];
}

export interface SkillAnalysisParams {
    match_percent: number;
    matched_skills: string[];
    missing_skills: string[];
}

export interface SummaryParams {
    overall_score: number;
    similarity_score: number;
}

export interface RadarChartData {
    candidate_scores: number[];
    jd_requirements: number[];
    labels: string[];
}

export interface AIReviewParams {
    development_roadmap: string[];
    radar_chart_data: RadarChartData;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
}

export interface ReviewCVResponse {
    ai_review: AIReviewParams;
    ats_check: AtsCheckParams;
    skills_analysis: SkillAnalysisParams;
    summary: SummaryParams;
}

export interface EvaluatedCVDetail {
    _id: string;
    candidateId: string;
    cvId: string;
    jdId: string;
    reviewCVResponse: ReviewCVResponse;
    createdAt: Date;
    updatedAt: Date;
}

export interface RecommendedJDItem {
    id: string;
    values: {
        candidateId: string;
        creatorUserId: string;
        title: string;
        position: string;
        description: string;
        companyName: string;
        location: string;
        summary: string;
        experience: string[];
        education: string[];
        certifications: string[];
        languages: string[];
        projects: string[];
        skills: string[];
        benefits: string[];
        type: string;
        visibility: string;
        verified: boolean;
    };
}

// CV

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

export const uploadCVService = async (file: File, position: string) => {
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

    const saveRes = await axiosInstance.post("/cvs/uploadCV", { position, fileUrl, fileName });

    return saveRes.data?.data;
};

// JD

export const getListJDService = async (
    creatorUserId: string, // list by candidate or recruiter
    limit = 20,
    page = 1
): Promise<{
    items: JDItem[];
    meta: { limit: number; page: number; total: number; totalPages: number };
}> => {
    const url = creatorUserId
        ? `/cvs/list-jds?creatorUserId=${creatorUserId}&limit=${limit}&page=${page}`
        : `/cvs/list-jds?visibility=public&verified=true&limit=${limit}&page=${page}`;

    const response = await axiosInstance.get(url);

    return response.data.data;
};

export const getJDByIdService = async (jdId: string): Promise<JDDetail> => {
    const response = await axiosInstance.get(`/cvs/jd/${jdId}`);
    return response.data.data;
};

export const uploadJDService = async (data: Partial<JDDetail>) => {
    const response = await axiosInstance.post(`/cvs/uploadJD`, data);
    return response.data.data;
};

export const updateJDService = async (jdId: string, data: Partial<JDDetail>): Promise<JDDetail> => {
    const response = await axiosInstance.patch(`/cvs/updateJD/${jdId}`, data);
    return response.data.data;
};

// Application

export const getListApplicationService = async (
    candidateId: string, // sort in candidate
    jdId: string, // sort in recruiter
    limit = 20,
    page = 1
): Promise<{
    items: ApplicationItem[];
    meta: { limit: number; page: number; total: number; totalPages: number };
}> => {
    const url = candidateId
        ? `/cvs/list-applications?candidateId=${candidateId}&limit=${limit}&page=${page}`
        : jdId
          ? `/cvs/list-applications?jdId=${jdId}&limit=${limit}&page=${page}`
          : `/cvs/list-applications?limit=${limit}&page=${page}`;

    const response = await axiosInstance.get(url);
    return response.data.data;
};

export const getListApplicationForRecruiterService = async (
    candidateId: string, // sort in candidate
    jdId: string, // sort in recruiter
    limit = 20,
    page = 1
): Promise<{
    items: ApplicationItem[];
    meta: { limit: number; page: number; total: number; totalPages: number };
}> => {
    const url = candidateId
        ? `/cvs/list-applications-for-recruiter?candidateId=${candidateId}&limit=${limit}&page=${page}`
        : jdId
          ? `/cvs/list-applications-for-recruiter?jdId=${jdId}&limit=${limit}&page=${page}`
          : `/cvs/list-applications-for-recruiter?limit=${limit}&page=${page}`;

    const response = await axiosInstance.get(url);

    return response.data.data;
};

export const getApplicationByIdService = async (apId: string): Promise<ApplicationDetail> => {
    const response = await axiosInstance.get(`/cvs/application/${apId}`);
    return response.data.data[0];
};

export const updateApplicationStatusService = async (
    apId: string,
    status: ApplicationStatus
): Promise<Partial<ApplicationItem>> => {
    console.log(apId, status);
    const response = await axiosInstance.patch(`/cvs/application/${apId}/status`, {
        status,
    });
    console.log("update app", response.data.data);
    return response.data.data;
};

export const applyCVService = async (cvId: string, jdId: string): Promise<ApplicationDetail> => {
    const response = await axiosInstance.post(`/cvs/applyCV/${cvId}/${jdId}`);

    return response.data.data;
};

// evaluation

export const getListEvaluatedCVService = async (
    candidateId: string, // sort in candidate
    jdId: string, // sort in recruiter
    limit = 20,
    page = 1
): Promise<{
    items: EvaluatedCVItem[];
    meta: { limit: number; page: number; total: number; totalPages: number };
}> => {
    const url = candidateId
        ? `/cvs/list-evaluations?candidateId=${candidateId}&limit=${limit}&page=${page}`
        : jdId
          ? `/cvs/list-evaluations?jdId=${jdId}&limit=${limit}&page=${page}`
          : `/cvs/list-evaluations?limit=${limit}&page=${page}`;

    const response = await axiosInstance.get(url);
    return response.data.data;
};

export const getEvaluatedCVByIdService = async (evaluationId: string): Promise<EvaluatedCVDetail> => {
    const response = await axiosInstance.get(`/cvs/evaluation/${evaluationId}`);
    return response.data.data;
};

export const evaluateCVService = async (cvId: string, jdId: string): Promise<EvaluatedCVDetail> => {
    const response = await axiosInstance.post(`/cvs/reviewCV/${cvId}/${jdId}`);
    return response.data.data;
};

// recommended JD

export const getRecommendedJobsService = async (
    candidateId: string, // list by candidate or recruiter
    limit = 20,
    page = 1
): Promise<
    RecommendedJDItem[]
    // meta: { limit: number; page: number; total: number; totalPages: number };
> => {
    const url = `/recombee/recommend/jd?candidateId=${candidateId}&limit=${limit}&page=${page}`;

    const response = await axiosInstance.get(url);

    return response.data.data;
};
