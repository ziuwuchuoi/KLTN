import { TechnicalQuiz } from "@/pages/Quizz/hooks/useQuizQueries";
import axiosInstance from "./axiosInstance";
import { QuizItem } from "@/pages/Quizz/QuizCategory";

export const getListCategoriesService = async () => {
    const response = await axiosInstance.get(`/quiz/getAllCategories`);
    return response.data.data;
};

export const getListQuizzesService = async (
    category: string,
    limit = 20,
    page = 1
  ): Promise<{ items: QuizItem[]; meta: { limit: number; page: number; total: number; totalPages: number } }> => {
    const url = category
      ? `/quiz/getListQuizzes?category=${category}&limit=${limit}&page=${page}`
      : `/quiz/getListQuizzes?limit=${limit}&page=${page}`;
  
    const response = await axiosInstance.get(url);
    return response.data.data;
  };
  