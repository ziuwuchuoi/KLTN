import axiosInstance from "./axiosInstance";

export interface CodeProblem {
    _id: string;
    problemId: number;
    title: string;
    titleSlug: string;
    difficulty: "Easy" | "Medium" | "Hard";
    topicTags: string[];
    sourceUrl: string;
}

export interface CodeSnippets {
    language: string;
    code: string;
}

export interface ProblemTestCase {
    params: { name: string; type: string; value: string; _id: string }[];
    expected: string;
    explanation: string;
}

export interface ProblemTestCaseResult {
    testCase: ProblemTestCase;
    status: { id: number; description: string };
    stdout: string;
    stderr: string;
    compile_output: string;
    time: string;
    memory: number;
    message: string;
    passed: boolean;
}

export interface CodeProblemDetail {
    _id: string;
    problemId: number;
    title: string;
    titleSlug: string;
    difficulty: "Easy" | "Medium" | "Hard";
    content: string;
    topicTags: string[];
    hints: string[];
    codeSnippets: CodeSnippets[];
    testcases: ProblemTestCase[];
    sourceUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CodeLanguage {
    id: number;
    name: string;
}

export interface CodeSubmitData {
    sourceCode: string;
    languageId: number;
    problemId: number;
}

export interface CodeSubmitResult {
    success: boolean; // true or false
    passedTests: number;
    totalTests: number;
    testResults: ProblemTestCaseResult[];
}

export const getListCodeProblemService = async (
    tag: string,
    difficulty: string,
    limit = 20,
    page = 1
): Promise<{
    problems: CodeProblem[];
    pagination: { limit: number; page: number; total: number; totalPages: number };
}> => {
    const url =
        tag && difficulty
            ? `/leetcode/problems?tag=${tag}&difficulty=${difficulty}&limit=${limit}&page=${page}`
            : tag
              ? `/leetcode/problems?tag=${tag}&limit=${limit}&page=${page}`
              : difficulty
                ? `/leetcode/problems?difficulty=${difficulty}&limit=${limit}&page=${page}`
                : `/leetcode/problems?limit=${limit}&page=${page}`;

    const response = await axiosInstance.get(url);
    return response.data.data;
};

export const getCodeProblemDetailService = async (codingId: string): Promise<CodeProblemDetail> => {
    const response = await axiosInstance.get(`/leetcode/problems/${codingId}`);
    return response.data.data;
};

export const getCodeProblemTagsService = async () => {
    const response = await axiosInstance.get(`/leetcode/tags`);
    return response.data.data;
};

export const getCodeLanguageService = async (): Promise<CodeLanguage[]> => {
    const response = await axiosInstance.get(`/judge/languages`);
    return response.data.data;
};

export const submitCodeProblemService = async (data: CodeSubmitData): Promise<CodeSubmitResult> => {
    const response = await axiosInstance.post(`/judge/submit`, data);
    return response.data.data;
};
