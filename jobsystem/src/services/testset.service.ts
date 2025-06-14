import axiosInstance from "./axiosInstance";
import { CodeProblem } from "./code.service";
import { QuizCreation } from "./quiz.service";

export interface TestSetItem {
    _id: string;
    creatorUserId: string;
    jdId: string;
    quizIds: string[];
    problemIds: string[]; // id in string type
    duration: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface TestSetDetail {
    _id: string;
    creatorUserId: string;
    jdId: string;
    duration: number;
    quizzes: Partial<QuizCreation>[]; // no createdAt and updatedAt
    problems: Partial<CodeProblem>[]; // no url
}

export interface TestSetSubmission {
    _id: string;
    testSetId: string;
    candidateId: string;
    completedQuizIds: string;
    completedProblemIds: string; // id in string type
    totalQuizScore: number;
    totalPassedCodingProblems: number;
    totalCodingProblems: number;
    finalScore: string;
    submitted: boolean;
    actualDuration: number;
    startedAt: Date;
    endAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface QuizSubmitTestSet {
    answers: { qIndex: number; chosenOption: number }[];
    startTime: Date;
    testSetResultId: string; // TestSetSubmission's id
    quizId: string; // quiz's id
}

export interface CodeSubmitTestSet {
    sourceCode: string;
    languageId: number;
    problemId: number; // id in number type
    testSetResultId: string; // TestSetSubmission's id
}

export const linkTestSetService = async (data: Partial<TestSetItem>): Promise<TestSetItem> => {
    const response = await axiosInstance.post(`/testSet/linkTestSet/`, data);
    return response.data.data;
};

export const getTestSetByJDService = async (jdId: string): Promise<TestSetDetail> => {
    const response = await axiosInstance.get(`/testSet/getTestSetDetail/${jdId}`);
    return response.data.data;
};

export const updateTestSetService = async (data: Partial<TestSetItem>): Promise<TestSetItem> => {
    const response = await axiosInstance.patch(`/testSet/linkTestSet/`, data);
    return response.data.data;
};

// start

export const startTestSetService = async (testSetId: string): Promise<TestSetSubmission> => {
    const response = await axiosInstance.post(`/testSet/startTestSet/${testSetId}`);
    return response.data.data;
};

export const submitQuizTestSetService = async (data: QuizSubmitTestSet): Promise<TestSetSubmission> => {
    const response = await axiosInstance.post(`/testSet/submitQuizTestSet`, data);
    return response.data.data;
};

export const submitCodeTestSetService = async (data: CodeSubmitTestSet): Promise<TestSetSubmission> => {
    const response = await axiosInstance.post(`/testSet/submitProblemTestSet`, data);
    return response.data.data;
};

export const submitTestSetService = async (testSetResultId: string): Promise<TestSetSubmission> => {
    const response = await axiosInstance.post(`/testSet/submitFinalTestSet/${testSetResultId}`);
    return response.data.data;
};
