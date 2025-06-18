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

    console.log("url quiz", url);
    const response = await axiosInstance.get(url);
    console.log("quiz data", response.data.data);

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
    return response.data;
};
