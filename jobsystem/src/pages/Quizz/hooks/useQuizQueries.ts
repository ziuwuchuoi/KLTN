import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createQuizService,
    getListCategoriesService,
    getListQuizSubmissionService,
    getListQuizzesService,
    getQuizDetailService,
    getSuggestedQuizzesService,
    QuizItem,
    QuizSubmission,
    submitQuizService,
    TechnicalCategoryItem,
    updateQuizService,
} from "@/services/quiz.service";

export interface SubmitQuizPayload {
    answers: { qIndex: number; chosenOption: number }[];
}

export const useQuizQueries = (
    userId?: string,
    selectedCategory: string = "",
    quizId?: string,
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
        data: technicalQuizzesData,
        isLoading: isLoadingQuizzes,
        isError: isErrorQuizzes,
    } = useQuery<{
        items: Partial<QuizItem>[];
        meta: { limit: number; page: number; total: number; totalPages: number };
    }>({
        queryKey: ["technical-quizzes", userId, selectedCategory, limit, page],
        queryFn: () => getListQuizzesService(userId, selectedCategory, limit, page),
        placeholderData: (previousData) => previousData,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const {
        data: technicalSuggestedQuizzesData,
        isLoading: isLoadingSuggestedQuizzes,
        isError: isErrorSuggestedQuizzes,
    } = useQuery<{
        items: Partial<QuizItem>[];
        meta: { limit: number; page: number; total: number; totalPages: number };
    }>({
        queryKey: ["suggested-technical-quizzes", limit, page],
        queryFn: () => getSuggestedQuizzesService(limit, page),
        placeholderData: (previousData) => previousData,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const {
        data: quizSubmissionsData,
        isLoading: isLoadingQuizSubmissions,
        isError: isErrorQuizSubmissions,
    } = useQuery<{
        items: Partial<QuizSubmission>[];
        meta: { limit: number; page: number; total: number; totalPages: number };
    }>({
        queryKey: ["submission-quizzes", userId, quizId, limit, page],
        queryFn: () => getListQuizSubmissionService(userId, quizId, limit, page),
        placeholderData: (previousData) => previousData,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const useQuizDetail = (quizId: string) => {
        return useQuery<Partial<QuizItem>>({
            queryKey: ["technical-quiz-detail", quizId],
            queryFn: () => getQuizDetailService(quizId),
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
            startTime: Date;
        }) => submitQuizService(quizId, { answers, startTime }),
        onSuccess: (res) => {
            console.log("Quiz submitted successfully:", res);
        },
        onError: (err) => {
            console.error("Error submitting quiz:", err);
        },
    });

    const createQuiz = useMutation({
        mutationFn: (data: Partial<QuizItem>) => createQuizService(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["technical-quizzes"], exact: false });
            console.log("Quiz created successfully");
        },
        onError: (err) => {
            console.error("Error creating quiz:", err);
        },
    });

    const updateQuiz = useMutation({
        mutationFn: ({ quizId, data }: { quizId: string; data: Partial<QuizItem> }) => updateQuizService(quizId, data),
        onSuccess: (_, { quizId }) => {
            queryClient.invalidateQueries({
                queryKey: ["technical-quiz-detail", quizId],
            });
            queryClient.invalidateQueries({ queryKey: ["technical-quizzes"], exact: false });
        },
        onError: (err) => {
            console.error("Error updating quiz:", err);
        },
    });

    const technicalQuizzes = technicalQuizzesData?.items ?? [];
    const paginationMeta = technicalQuizzesData?.meta ?? { page: 1, limit: 20, total: 0, totalPages: 1 };

    const suggestedTechnicalQuizzes = technicalSuggestedQuizzesData?.items ?? [];
    const paginationSuggestedMeta = technicalSuggestedQuizzesData?.meta ?? {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1,
    };

    const quizSubmissions = quizSubmissionsData?.items ?? [];
    const paginationQuizSubmissionsMeta = quizSubmissionsData?.meta ?? {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1,
    };

    return {
        technicalCategories,
        isLoadingCategories,
        isErrorCategories,

        technicalQuizzes,
        paginationMeta,
        isLoadingQuizzes,
        isErrorQuizzes,

        suggestedTechnicalQuizzes,
        paginationSuggestedMeta,
        isLoadingSuggestedQuizzes,
        isErrorSuggestedQuizzes,

        quizSubmissions,
        paginationQuizSubmissionsMeta,
        isLoadingQuizSubmissions,
        isErrorQuizSubmissions,

        createQuiz,
        updateQuiz,
        submitQuiz,

        useQuizDetail,
        queryClient,
    };
};
