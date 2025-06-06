import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getCVByIdService,
    uploadCVService,
    getListCVService,
    CVItem,
    CVDetail,
    applyCVService,
    evaluateCVService,
    getRecommendedJobsService,
    RecommendedJDItem,
} from "@/services/file.service";
import { getJDByIdService, uploadJDService, getListJDService, JDItem, JDDetail } from "@/services/file.service";
import {
    getEvaluatedCVByIdService,
    getListEvaluatedCVService,
    EvaluatedCVItem,
    EvaluatedCVDetail,
} from "@/services/file.service";
import {
    getApplicationByIdService,
    getListApplicationService,
    ApplicationItem,
    ApplicationDetail,
    ApplicationStatus,
} from "@/services/file.service";

export const QUERY_KEYS = {
    cvDetail: (id: string) => ["files", "cv", id] as const,
    jdDetail: (id: string) => ["files", "jd", id] as const,
    evaluatedCVDetail: (id: string) => ["files", "evaluation", id] as const,
    applicationDetail: (id: string) => ["files", "application", id] as const,
};

export const useCVQueries = (userId?: string, page: number = 1, limit: number = 20) => {
    const queryClient = useQueryClient();

    const {
        data: cvsData,
        isLoading: isCVDataLoading,
        error: cvError,
    } = useQuery<{
        items: CVItem[];
        meta: { limit: number; page: number; total: number; totalPages: number };
    }>({
        queryKey: ["cvs", userId, page, limit],
        queryFn: () => getListCVService(userId, limit, page),
        placeholderData: (previousData) => previousData,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const useCVDetail = (id: string) =>
        useQuery<CVDetail>({
            queryKey: QUERY_KEYS.cvDetail(id),
            queryFn: () => getCVByIdService(id),
            enabled: !!id,
            staleTime: Infinity,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: 1,
        });

    const uploadCV = useMutation({
        mutationFn: ({ file, position }: { file: File; position: string }) => uploadCVService(file, position),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cvs"], exact: false });
            console.log("CV upload successfully");
        },
        onError: (error: Error) => {
            console.log("CV upload failed", error);
        },
    });

    const pagination = cvsData?.meta ?? {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1,
    };

    return {
        cvs: cvsData?.items || [],
        uploadCV,
        useCVDetail,
        pagination,
        isCVDataLoading,
        cvError,
    };
};

export const useJDQueries = (userId?: string, page: number = 1, limit: number = 20) => {
    const queryClient = useQueryClient();

    const {
        data: jdsData,
        isLoading: isJDDataLoading,
        error: jdError,
    } = useQuery<{
        items: JDItem[];
        meta: { limit: number; page: number; total: number; totalPages: number };
    }>({
        queryKey: ["jds", userId, page, limit],
        queryFn: () => getListJDService(userId, limit, page),
        placeholderData: (previousData) => previousData,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const useJDDetail = (id: string) =>
        useQuery<JDDetail>({
            queryKey: QUERY_KEYS.jdDetail(id),
            queryFn: () => getJDByIdService(id),
            enabled: !!id,
            staleTime: Infinity,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: 1,
        });

    const uploadJD = useMutation({
        mutationFn: (data: Partial<JDDetail>) => uploadJDService(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jds"], exact: false });
            console.log("CV upload successfully");
        },
        onError: (error: Error) => {
            console.log("JD upload failed", error);
        },
    });

    const pagination = jdsData?.meta ?? {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1,
    };

    return {
        jds: jdsData?.items || [],
        uploadJD,
        useJDDetail,
        pagination,
        isJDDataLoading,
        jdError,
    };
};

export const useEvaluationQueries = (userId?: string, fileId?: string, page: number = 1, limit: number = 20) => {
    const {
        data: evaluatedCVData,
        isLoading: isEvaluatedCVDataLoading,
        error: evaluatedCVError,
    } = useQuery<{
        items: EvaluatedCVItem[];
        meta: { limit: number; page: number; total: number; totalPages: number };
    }>({
        queryKey: ["evaluations", userId, fileId, page, limit],
        queryFn: () => getListEvaluatedCVService(userId, fileId, page, limit),
        placeholderData: (previousData) => previousData,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const useEvaluatedCVDetail = (id: string) =>
        useQuery<EvaluatedCVDetail>({
            queryKey: QUERY_KEYS.evaluatedCVDetail(id),
            queryFn: () => getEvaluatedCVByIdService(id),
            enabled: !!id,
            staleTime: Infinity,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: 1,
        });

    const evaluateCV = useMutation({
        mutationFn: ({ cvId, jdId }: { cvId: string; jdId: string }) => evaluateCVService(cvId, jdId),
        onSuccess: () => {
            console.log("Evaluate successful");
        },
        onError: (error: Error) => {
            console.log("Evaluate failed", error);
        },
    });

    const pagination = evaluatedCVData?.meta ?? {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1,
    };

    return {
        evaluatedCVs: evaluatedCVData?.items || [],
        useEvaluatedCVDetail,
        evaluateCV,
        pagination,
        isEvaluatedCVDataLoading,
        evaluatedCVError,
    };
};

export const useApplicationQueries = (userId?: string, fileId?: string, page: number = 1, limit: number = 20) => {
    const queryClient = useQueryClient();

    const {
        data: applicationData,
        isLoading: isApplicationDataLoading,
        error: applicationError,
    } = useQuery<{
        items: ApplicationItem[];
        meta: { limit: number; page: number; total: number; totalPages: number };
    }>({
        queryKey: ["applications", userId, fileId, page, limit],
        queryFn: () => getListApplicationService(userId, fileId, page, limit),
        placeholderData: (previousData) => previousData,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const useApplicationDetail = (id: string) =>
        useQuery<ApplicationDetail>({
            queryKey: QUERY_KEYS.applicationDetail(id),
            queryFn: () => getApplicationByIdService(id),
            enabled: !!id,
            staleTime: Infinity,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: 1,
        });

    const applyCV = useMutation({
        mutationFn: ({ cvId, jdId }: { cvId: string; jdId: string }) => applyCVService(cvId, jdId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["applications"], exact: false });
            console.log("Application submitted successfully");
        },
        onError: (error: Error) => {
            console.log("Application failed", error);
        },
    });

    const updateApplicationStatus = useMutation({
        mutationFn: ({ apId, status }: { apId: string; status: ApplicationStatus }) =>
            updateApplicationStatus(apId, status),
        onSuccess: (_, updatedApplication) => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.applicationDetail(updatedApplication.apId),
            });
        },
        onError: (error: Error) => {
            console.log("Application update failed", error);
        },
    });

    const pagination = applicationData?.meta ?? {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1,
    };

    return {
        applications: applicationData?.items || [],
        useApplicationDetail,
        updateApplicationStatus,
        applyCV,
        pagination,
        isApplicationDataLoading,
        applicationError,
    };
};

export const useRecommendationQueries = (userId: string) => {
    const {
        data: recommendedJobsData,
        isLoading: isRecJobDataLoading,
        error: recJobError,
    } = useQuery<RecommendedJDItem[]>({
        queryKey: ["recommended-jobs", userId],
        queryFn: () => getRecommendedJobsService(userId),
        placeholderData: (prev) => prev,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    return {
        recommendedJobs: recommendedJobsData || [],
        isRecJobDataLoading,
        recJobError,
    };
};
