import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createQuizService,
    getListCategoriesService,
    getListQuizzesService,
    getQuizDetailService,
    QuizCreation,
    submitQuizService,
    updateQuizService,
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

export const useQuizQueries = (
    userId?: string,
    selectedCategory: string = "",
    page: number = 1,
    limit: number = 20
) => {
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
        queryKey: ["technical-quizzes", userId, selectedCategory, limit, page],
        queryFn: () => getListQuizzesService(userId, selectedCategory, limit, page),
        placeholderData: (previousData) => previousData,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const useQuizDetail = (quizId: string) => {
        return useQuery<TechnicalQuiz>({
            queryKey: ["technical-quiz-detail", quizId],
            queryFn: () => getQuizDetailService(quizId!),
            enabled: !!quizId,
        });
    };

    const submitQuiz = useMutation({
        mutationFn: ({
            quizId,
            answers,
            startTime,
        }: {
            quizId: string;
            answers: SubmitQuizPayload["answers"];
            startTime: string;
        }) => submitQuizService(quizId, { answers, startTime }),
        onSuccess: (res) => {
            console.log("Quiz submitted successfully:", res);
        },
        onError: (err) => {
            console.error("Error submitting quiz:", err);
        },
    });

    const createQuiz = useMutation({
        mutationFn: (data: Partial<QuizCreation>) => createQuizService(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["technical-quizzes"], exact: false });
            console.log("Quiz created successfully");
        },
        onError: (err) => {
            console.error("Error creating quiz:", err);
        },
    });

    const updateQuiz = useMutation({
        mutationFn: ({ quizId, data }: { quizId: string; data: Partial<QuizCreation> }) =>
            updateQuizService(quizId, data),
        onSuccess: (_, { quizId }) => {
            // Invalidate the detail view of the updated quiz
            queryClient.invalidateQueries({
                queryKey: ["technical-quiz-detail", quizId],
            });
        },
        onError: (err) => {
            console.error("Error updating quiz:", err);
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

        createQuiz,
        updateQuiz,
        submitQuiz,

        useQuizDetail,
        queryClient,
    };
};
