import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getListCategoriesService, getListQuizzesService } from "@/services/quiz.service";

export interface TechnicalCategoryItem {
    id: number;
    name: string;
    children?: TechnicalCategoryItem[];
}

export interface TechnicalQuiz {
    id: string;
    title: string;
    categories: string[];
    sourceUrl: string;
    questions: {
        question: string;
        options: string[];
        correctAnswer: number;
        explanation?: string;
    }[];
}

export const useQuizQueries = (selectedCategory: string = "", page: number = 1, limit: number = 20) => {
    const queryClient = useQueryClient();

    const {
        data: technicalCategories,
        isLoading: isLoadingCategories,
        isError: isErrorCategories,
    } = useQuery<TechnicalCategoryItem[]>({
        queryKey: ["technical-categories"],
        queryFn: getListCategoriesService,
    });

    const {
        data,
        isLoading: isLoadingQuizzes,
        isError: isErrorQuizzes,
    } = useQuery({
        queryKey: ["technical-quizzes", selectedCategory, page],
        queryFn: () => getListQuizzesService(selectedCategory, limit, page),
    });

    const technicalQuizzes = data?.items ?? [];
    const paginationMeta = data?.meta ?? { page: 1, limit: 20, total: 0, totalPages: 1 };

    return {
        technicalCategories,
        isLoadingCategories,
        isErrorCategories,

        technicalQuizzes,
        paginationMeta,
        isLoadingQuizzes,
        isErrorQuizzes,

        queryClient,
    };
};
