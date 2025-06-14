import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getListCodeProblemService,
    getCodeProblemDetailService,
    getCodeProblemTagsService,
    getCodeLanguageService,
    submitCodeProblemService,
    createCodeProblemService,
} from "@/services/code.service";
import { CodeProblem, CodeProblemDetail, CodeLanguage, CodeSubmitData } from "@/services/code.service";

export const useCodeQueries = (
    userId?: string,
    selectedTag: string = "",
    selectedDifficulty: string = "",
    page: number = 1,
    limit: number = 20
) => {
    const queryClient = useQueryClient();

    const {
        data: codeProblemsData,
        isLoading: isCodeProblemsLoading,
        error: codeProblemsError,
    } = useQuery<{
        problems: CodeProblem[];
        pagination: { limit: number; page: number; total: number; totalPages: number };
    }>({
        queryKey: ["code-problems", userId, selectedTag, selectedDifficulty, limit, page],
        queryFn: () => getListCodeProblemService(userId, selectedTag, selectedDifficulty, limit, page),
        placeholderData: (previousData) => previousData,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    // Tags
    const {
        data: tagsData,
        isLoading: isTagsLoading,
        error: tagsError,
    } = useQuery<string[]>({
        queryKey: ["code-tags"],
        queryFn: getCodeProblemTagsService,
    });

    // Problem detail
    const useCodeProblemDetail = (problemId: string) => {
        return useQuery<CodeProblemDetail>({
            queryKey: ["code-problem-detail", problemId],
            queryFn: () => getCodeProblemDetailService(problemId),
            enabled: !!problemId,
        });
    };

    // Languages
    const {
        data: languagesData,
        isLoading: isLanguagesLoading,
        error: languagesError,
    } = useQuery<CodeLanguage[]>({
        queryKey: ["code-languages"],
        queryFn: getCodeLanguageService,
    });

    const submitCodeMutation = useMutation({
        mutationFn: ({ sourceCode, languageId, problemId }: CodeSubmitData) =>
            submitCodeProblemService({
                sourceCode,
                languageId,
                problemId,
            }),
        onSuccess: (res) => {
            console.log("Code submitted successfully:", res);
        },
        onError: (err) => {
            console.error("Error submitting code:", err);
        },
    });

    const createCodeProblem = useMutation({
        mutationFn: (data: Partial<CodeProblemDetail>) => createCodeProblemService(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["code-problems"], exact: false });
            console.log("Code problem created successfully");
        },
        onError: (err) => {
            console.error("Error creating code problem:", err);
        },
    });

    const updateCodeProblem = useMutation({
        mutationFn: ({ problemId, data }: { problemId: string; data: Partial<CodeProblemDetail> }) =>
            updateCodeProblem(problemId, data),
        onSuccess: (_, { problemId }) => {
            // Invalidate the detail view of the updated quiz
            queryClient.invalidateQueries({
                queryKey: ["code-problem-detail", problemId],
            });
        },
        onError: (err) => {
            console.error("Error updating code:", err);
        },
    });

    const pagination = codeProblemsData?.pagination ?? {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1,
    };

    return {
        codeProblems: codeProblemsData?.problems || [],
        pagination,
        isCodeProblemsLoading,
        codeProblemsError,

        tags: tagsData || [],
        isTagsLoading,
        tagsError,

        languages: languagesData || [],
        isLanguagesLoading,
        languagesError,

        useCodeProblemDetail,

        createCodeProblem,
        updateCodeProblem,
        submitCodeMutation,
    };
};
