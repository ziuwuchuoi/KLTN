import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getListCategoriesService,
    getListQuizzesService,
    getQuizDetailService,
    submitQuizService,
} from "@/services/quiz.service";

export interface TechnicalCategoryItem {
    id: number;
    name: string;
    children?: TechnicalCategoryItem[];
}

export interface Quiz {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
}

export interface TechnicalQuiz {
    _id: string;
    title: string;
    categories: string[];
    sourceUrl: string;
    questions: Quiz[];
}

export interface SubmitQuizPayload {
    answers: { qIndex: number; chosenOption: number }[];
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
        placeholderData: (previousData) => previousData,
    });

    const useQuizDetail = (quizId: string) => {
        return useQuery<TechnicalQuiz>({
            queryKey: ["technical-quiz-detail", quizId],
            queryFn: () => getQuizDetailService(quizId!),
            enabled: !!quizId,
        });
    };

    const submitQuiz = useMutation({
        mutationFn: ({ quizId, answers }: { quizId: string; answers: SubmitQuizPayload["answers"] }) =>
            submitQuizService(quizId, { answers }),
        onSuccess: (res) => {
            console.log("Quiz submitted successfully:", res);
        },
        onError: (err) => {
            console.error("Error submitting quiz:", err);
        },
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

        submitQuiz,

        useQuizDetail,
        queryClient,
    };
};
