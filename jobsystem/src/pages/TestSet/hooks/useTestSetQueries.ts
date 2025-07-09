import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    linkTestSetService,
    getTestSetByJDService,
    updateTestSetService,
    startTestSetService,
    submitQuizTestSetService,
    submitCodeTestSetService,
    submitTestSetService,
    TestSetItem,
    TestSetDetail,
    TestSetSubmission,
    QuizSubmitTestSet,
    CodeSubmitTestSet,
} from "@/services/testset.service";

export const useTestSetQueries = () => {
    const queryClient = useQueryClient();

    const useTestSetByJD = (jdId: string) => {
        return useQuery<TestSetDetail>({
            queryKey: ["test-set-detail", jdId],
            queryFn: () => getTestSetByJDService(jdId),
            enabled: !!jdId,
        });
    };

    const linkTestSet = useMutation({
        mutationFn: (data: Partial<TestSetItem>) => linkTestSetService(data),
        onSuccess: (_, testSet) => {
            queryClient.invalidateQueries({ queryKey: ["test-set-detail", testSet.jdId] });
            console.log("Linked test set successfully:", testSet);
        },
        onError: (err) => {
            console.error("Error linking test set:", err);
        },
    });

    const updateTestSet = useMutation({
        mutationFn: (data: Partial<TestSetItem>) => updateTestSetService(data),
        onSuccess: (_, updatedTestSet) => {
            queryClient.invalidateQueries({ queryKey: ["test-set-detail", updatedTestSet.jdId] });
            console.log("Updated test set successfully:", updatedTestSet);
        },
        onError: (err) => {
            console.error("Error updating test set:", err);
        },
    });

    const startTestSet = useMutation({
        mutationFn: (testSetId: string) => startTestSetService(testSetId),
        onSuccess: (res) => {
            console.log("Test set started:", res);
        },
        onError: (err) => {
            console.error("Error starting test set:", err);
        },
    });

    const submitQuizTestSet = useMutation({
        mutationFn: (data: QuizSubmitTestSet) => submitQuizTestSetService(data),
        onSuccess: (res) => {
            console.log("Quiz submitted successfully in test set:", res);
        },
        onError: (err) => {
            console.error("Error submitting quiz in test set:", err);
        },
    });

    const submitCodeTestSet = useMutation({
        mutationFn: (data: CodeSubmitTestSet) => submitCodeTestSetService(data),
        onSuccess: (res) => {
            console.log("Code problem submitted in test set:", res);
        },
        onError: (err) => {
            console.error("Error submitting code problem:", err);
        },
    });

    const submitFinalTestSet = useMutation({
        mutationFn: (testSetResultId: string) => submitTestSetService(testSetResultId),
        onSuccess: (res) => {
            console.log("Final test set submitted:", res);
        },
        onError: (err) => {
            console.error("Error submitting final test set:", err);
        },
    });

    return {
        useTestSetByJD,
        linkTestSet,
        updateTestSet,
        startTestSet,
        submitQuizTestSet,
        submitCodeTestSet,
        submitFinalTestSet,
        queryClient,
    };
};
