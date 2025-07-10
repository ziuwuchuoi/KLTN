import axiosInstance from "./axiosInstance";

export interface QuizItem {
    _id: string;
    title: string;
    categories: string[];
    sourceUrl: string;
    questions: Quiz[];
    duration: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface Quiz {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
}

export interface QuizSubmission {
    _id: string;
    quizId: string;
    candidateId: string;
    answers: { qIndex: number; chosenOption: number; isCorrect: boolean; _id: string }[];
    score: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface TechnicalCategoryItem {
    id: number;
    name: string;
    children?: TechnicalCategoryItem[];
}

export const getListCategoriesService = async () => {
    const response = await axiosInstance.get(`/quiz/getAllCategories`);
    return response.data.data;
};

export const getListQuizzesService = async (
    creatorUserId: string,
    category: string,
    limit = 20,
    page = 1
): Promise<{
    items: Partial<QuizItem>[];
    meta: { limit: number; page: number; total: number; totalPages: number };
}> => {
    const base = `/quiz/getListQuizzes?limit=${limit}&page=${page}`;

    const url =
        creatorUserId && category
            ? `${base}&creatorUserId=${creatorUserId}&category=${category}`
            : creatorUserId
              ? `${base}&creatorUserId=${creatorUserId}`
              : category
                ? `${base}&category=${category}`
                : base;

    const response = await axiosInstance.get(url);
    return response.data.data;
};

export const getListQuizSubmissionService = async (
    candidateId?: string,
    quizId?: string,
    limit = 20,
    page = 1
): Promise<{
    items: Partial<QuizSubmission>[];
    meta: { limit: number; page: number; total: number; totalPages: number };
}> => {
    const base = `/quiz/getListSubmissions?limit=${limit}&page=${page}`;

    const url =
        candidateId && quizId
            ? `${base}&candidateId=${candidateId}&quizId=${quizId}`
            : candidateId
              ? `${base}&candidateId=${candidateId}`
              : quizId
                ? `${base}&quizId=${quizId}`
                : base;

    const response = await axiosInstance.get(url);
    return response.data.data;
};

export const getQuizDetailService = async (quizId: string): Promise<Partial<QuizItem>> => {
    const response = await axiosInstance.get(`/quiz/getQuizDetail/${quizId}`);
    return response.data.data;
};

export const submitQuizService = async (quizId: string, data) => {
    const response = await axiosInstance.post(`/quiz/submit/${quizId}`, data);
    return response.data;
};

export const getListQuizSubmitsService = async (quizId: string, candidateId: string, limit = 20, page = 1) => {
    const response = await axiosInstance.get(
        `/quiz/submit/?quizId=${quizId}&candidateId=${candidateId}&limit=${limit}&page=${page}`
    );
    return response.data;
};

// recruiter's

export const createQuizService = async (data: Partial<QuizItem>): Promise<Partial<QuizItem>> => {
    const response = await axiosInstance.post(`/quiz/create-quiz/`, data);
    return response.data;
};

export const updateQuizService = async (quizId: string, data: Partial<QuizItem>): Promise<Partial<QuizItem>> => {
    const response = await axiosInstance.patch(`/quiz/update-quiz/${quizId}`, data);
    console.log("update quiz", response.data);
    return response.data;
};

// suggestion

export const getSuggestedQuizzesService = async (
    limit = 4,
    page = 1
): Promise<{
    items: Partial<QuizItem>[];
    meta: { limit: number; page: number; total: number; totalPages: number };
}> => {
    const url = `/quiz/getSuggestedQuizzes?limit=${limit}&page=${page}`;

    const response = await axiosInstance.get(url);
    return response.data.data;
};
