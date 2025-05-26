import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getListCodeProblemService,
    getCodeProblemDetailService,
    getCodeProblemTagsService,
    getCodeLanguageService,
    submitCodeProblemService,
} from "@/services/code.service";
import {
    CodeProblem,
    CodeProblemDetail,
    CodeLanguage,
    CodeSubmitData,
} from "@/services/code.service";

export const useCodeQueries = (
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
        queryKey: ["code-problems", selectedTag, selectedDifficulty, page, limit],
        queryFn: () => getListCodeProblemService(selectedTag, selectedDifficulty, limit, page),
        placeholderData: (previousData) => previousData,
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
    const useCodeProblemDetail = (codingId: string) => {
        return useQuery<CodeProblemDetail>({
            queryKey: ["code-problem-detail", codingId],
            queryFn: () => getCodeProblemDetailService(codingId),
            enabled: !!codingId,
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

        submitCodeMutation, 
    };
};
