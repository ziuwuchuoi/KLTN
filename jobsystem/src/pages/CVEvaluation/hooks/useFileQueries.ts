import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getCVByIdService,
    uploadCVService,
    getListCVService,
    type CVItem,
    type CVDetail,
    applyCVService,
    evaluateCVService,
    getRecommendedJobsService,
    type RecommendedJDItem,
    getListApplicationForRecruiterService,
    updateApplicationStatusService,
} from "@/services/file.service";
import {
    getJDByIdService,
    uploadJDService,
    updateJDService,
    getListJDService,
    type JDItem,
    type JDDetail,
} from "@/services/file.service";
import {
    getEvaluatedCVByIdService,
    getListEvaluatedCVService,
    type EvaluatedCVItem,
    type EvaluatedCVDetail,
} from "@/services/file.service";
import {
    getApplicationByIdService,
    getListApplicationService,
    type ApplicationItem,
    type ApplicationDetail,
    type ApplicationStatus,
} from "@/services/file.service";

// Define proper types for query data structures
interface ApplicationListResponse {
    items: ApplicationItem[];
    meta: {
        limit: number;
        page: number;
        total: number;
        totalPages: number;
    };
}

interface CVListResponse {
    items: CVItem[];
    meta: {
        limit: number;
        page: number;
        total: number;
        totalPages: number;
    };
}

interface JDListResponse {
    items: JDItem[];
    meta: {
        limit: number;
        page: number;
        total: number;
        totalPages: number;
    };
}

interface EvaluationListResponse {
    items: EvaluatedCVItem[];
    meta: {
        limit: number;
        page: number;
        total: number;
        totalPages: number;
    };
}

// Mutation context types
interface UpdateApplicationStatusContext {
    previousRecruiterApps: ApplicationListResponse | undefined;
    previousAppDetail: ApplicationDetail | undefined;
}

interface UpdateApplicationStatusVariables {
    apId: string;
    status: ApplicationStatus;
}

interface ApplyCVVariables {
    cvId: string;
    jdId: string;
}

interface EvaluateCVVariables {
    cvId: string;
    jdId: string;
}

interface UploadCVVariables {
    file: File;
    position: string;
}

interface UpdateJDVariables {
    jdId: string;
    data: Partial<JDDetail>;
}

export const QUERY_KEYS = {
    cvDetail: (id: string) => ["files", "cv", id] as const,
    jdDetail: (id: string) => ["files", "jd", id] as const,
    evaluatedCVDetail: (id: string) => ["files", "evaluation", id] as const,
    applicationDetail: (id: string) => ["files", "application", id] as const,
    applications: (userId?: string, fileId?: string, page?: number, limit?: number) =>
        ["applications", userId, fileId, page, limit] as const,
    recruiterApplications: (userId?: string, fileId?: string, page?: number, limit?: number) =>
        ["recruiter-applications", userId, fileId, page, limit] as const,
    cvs: (userId?: string, page?: number, limit?: number) => ["cvs", userId, page, limit] as const,
    jds: (userId?: string, page?: number, limit?: number, verified?: boolean) =>
        ["jds", userId, page, limit, verified] as const,
    evaluations: (userId?: string, fileId?: string, page?: number, limit?: number) =>
        ["evaluations", userId, fileId, page, limit] as const,
};

export const useApplicationQueries = (userId?: string, fileId?: string, limit = 20, page = 1) => {
    const queryClient = useQueryClient();

    const {
        data: applicationData,
        isLoading: isApplicationDataLoading,
        error: isApplicationError,
    } = useQuery<ApplicationListResponse>({
        queryKey: QUERY_KEYS.applications(userId, fileId, page, limit),
        queryFn: () => getListApplicationService(userId || "", fileId || "", limit, page),
        placeholderData: (previousData) => previousData,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const {
        data: applicationForRecruiterData,
        isLoading: isApplicationForRecruiterDataLoading,
        error: isApplicationForRecruiterError,
    } = useQuery<ApplicationListResponse>({
        queryKey: QUERY_KEYS.recruiterApplications(userId, fileId, page, limit),
        queryFn: () => getListApplicationForRecruiterService(userId || "", fileId || "", limit, page),
        placeholderData: (previousData) => previousData,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const useApplicationDetail = (applicationId: string) =>
        useQuery<ApplicationDetail>({
            queryKey: QUERY_KEYS.applicationDetail(applicationId),
            queryFn: () => getApplicationByIdService(applicationId),
            enabled: !!applicationId,
            staleTime: 0,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: 1,
        });

    const updateApplicationStatus = useMutation<
        Partial<ApplicationItem>,
        Error,
        UpdateApplicationStatusVariables,
        UpdateApplicationStatusContext
    >({
        mutationFn: ({ apId, status }: UpdateApplicationStatusVariables) =>
            updateApplicationStatusService(apId, status),
        onMutate: async ({ apId, status }: UpdateApplicationStatusVariables) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.recruiterApplications() });
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.applicationDetail(apId) });

            // Snapshot the previous values
            const previousRecruiterApps = queryClient.getQueryData<ApplicationListResponse>(
                QUERY_KEYS.recruiterApplications(userId, fileId, page, limit)
            );
            const previousAppDetail = queryClient.getQueryData<ApplicationDetail>(QUERY_KEYS.applicationDetail(apId));

            // Optimistically update the recruiter applications list
            if (previousRecruiterApps) {
                queryClient.setQueryData<ApplicationListResponse>(
                    QUERY_KEYS.recruiterApplications(userId, fileId, page, limit),
                    (old) => {
                        if (!old) return old;
                        return {
                            ...old,
                            items: old.items.map((app: ApplicationItem) =>
                                app._id === apId ? { ...app, status } : app
                            ),
                        };
                    }
                );
            }

            // Optimistically update the application detail
            if (previousAppDetail) {
                queryClient.setQueryData<ApplicationDetail>(QUERY_KEYS.applicationDetail(apId), (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        status,
                        updatedAt: new Date().toISOString(),
                    };
                });
            }

            return { previousRecruiterApps, previousAppDetail };
        },
        onError: (err: Error, { apId }: UpdateApplicationStatusVariables, context) => {
            // Rollback on error
            if (context?.previousRecruiterApps) {
                queryClient.setQueryData<ApplicationListResponse>(
                    QUERY_KEYS.recruiterApplications(userId, fileId, page, limit),
                    context.previousRecruiterApps
                );
            }
            if (context?.previousAppDetail) {
                queryClient.setQueryData<ApplicationDetail>(
                    QUERY_KEYS.applicationDetail(apId),
                    context.previousAppDetail
                );
            }
            console.error("Failed to update application status:", err);
        },
        onSuccess: (updatedApp: Partial<ApplicationItem>, { apId }: UpdateApplicationStatusVariables) => {
            // Update with the actual server response
            queryClient.setQueryData<ApplicationDetail>(QUERY_KEYS.applicationDetail(apId), (old) => {
                if (!old) return old;
                return {
                    ...old,
                    status: updatedApp.status || old.status,
                    updatedAt: new Date().toISOString(),
                };
            });

            // Update the list with the server response
            queryClient.setQueryData<ApplicationListResponse>(
                QUERY_KEYS.recruiterApplications(userId, fileId, page, limit),
                (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        items: old.items.map((app: ApplicationItem) =>
                            app._id === apId ? { ...app, status: updatedApp.status || app.status } : app
                        ),
                    };
                }
            );

            // Invalidate to ensure fresh data on next fetch
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.recruiterApplications(),
                exact: false,
            });
        },
        onSettled: () => {
            // Always refetch after mutation settles
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.recruiterApplications(),
                exact: false,
            });
        },
    });

    const applyCV = useMutation<ApplicationDetail, Error, ApplyCVVariables>({
        mutationFn: ({ cvId, jdId }: ApplyCVVariables) => applyCVService(cvId, jdId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.applications(), exact: false });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.recruiterApplications(), exact: false });
            console.log("Application submitted successfully");
        },
        onError: (error: Error) => {
            console.log("Application failed", error);
        },
    });

    const pagination = applicationData?.meta ?? {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1,
    };

    const paginationForRecruiter = applicationForRecruiterData?.meta ?? {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1,
    };

    return {
        applications: applicationData?.items || [],
        applicationsForRecruiter: applicationForRecruiterData?.items || [],
        useApplicationDetail,
        updateApplicationStatus,
        applyCV,
        pagination,
        paginationForRecruiter,
        isApplicationDataLoading,
        isApplicationError,
        isApplicationForRecruiterDataLoading,
        isApplicationForRecruiterError,
    };
};

export const useCVQueries = (userId?: string, page = 1, limit = 20) => {
    const queryClient = useQueryClient();

    const {
        data: cvsData,
        isLoading: isCVDataLoading,
        error: cvError,
    } = useQuery<CVListResponse>({
        queryKey: QUERY_KEYS.cvs(userId, page, limit),
        queryFn: () => getListCVService(userId || "", limit, page),
        placeholderData: (previousData) => previousData,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const useCVDetail = (id: string) =>
        useQuery<CVDetail>({
            queryKey: QUERY_KEYS.cvDetail(id),
            queryFn: () => getCVByIdService(id),
            enabled: !!id,
            staleTime: Number.POSITIVE_INFINITY,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: 1,
        });

    const uploadCV = useMutation<CVDetail, Error, UploadCVVariables>({
        mutationFn: ({ file, position }: UploadCVVariables) => uploadCVService(file, position),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cvs(), exact: false });
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

export const useJDQueries = (userId?: string, page = 1, limit = 20, verified = true) => {
    const queryClient = useQueryClient();

    const {
        data: jdsData,
        isLoading: isJDDataLoading,
        error: jdError,
    } = useQuery<JDListResponse>({
        queryKey: QUERY_KEYS.jds(userId, page, limit, verified),
        queryFn: () => getListJDService(userId || "", limit, page, verified),
        placeholderData: (previousData) => previousData,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const useJDDetail = (id: string) =>
        useQuery<JDDetail>({
            queryKey: QUERY_KEYS.jdDetail(id),
            queryFn: () => getJDByIdService(id),
            enabled: !!id,
            staleTime: Number.POSITIVE_INFINITY,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: 1,
        });

    const uploadJD = useMutation<JDDetail, Error, Partial<JDDetail>>({
        mutationFn: (data: Partial<JDDetail>) => uploadJDService(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.jds(), exact: false });
            console.log("JD upload successfully");
        },
        onError: (error: Error) => {
            console.log("JD upload failed", error);
        },
    });

    const updateJD = useMutation<JDDetail, Error, UpdateJDVariables>({
        mutationFn: ({ jdId, data }: UpdateJDVariables) => updateJDService(jdId, data),
        onSuccess: (_, { jdId }: UpdateJDVariables) => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.jdDetail(jdId),
            });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.jds(), exact: false });
        },
        onError: (error: Error) => {
            console.log("JD update failed", error);
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
        updateJD,
        uploadJD,
        useJDDetail,
        pagination,
        isJDDataLoading,
        jdError,
    };
};

export const useEvaluationQueries = (userId?: string, fileId?: string, page = 1, limit = 20) => {
    const queryClient = useQueryClient();

    const {
        data: evaluatedCVData,
        isLoading: isEvaluatedCVDataLoading,
        error: evaluatedCVError,
    } = useQuery<EvaluationListResponse>({
        queryKey: QUERY_KEYS.evaluations(userId, fileId, page, limit),
        // Fixed parameter order: candidateId, jdId, limit, page
        queryFn: () => getListEvaluatedCVService(userId || "", fileId || "", limit, page),
        placeholderData: (previousData) => previousData,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const useEvaluatedCVDetail = (id: string) =>
        useQuery<EvaluatedCVDetail>({
            queryKey: QUERY_KEYS.evaluatedCVDetail(id),
            queryFn: () => getEvaluatedCVByIdService(id),
            enabled: !!id,
            staleTime: Number.POSITIVE_INFINITY,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: 1,
        });

    const evaluateCV = useMutation<EvaluatedCVDetail, Error, EvaluateCVVariables>({
        mutationFn: ({ cvId, jdId }: EvaluateCVVariables) => evaluateCVService(cvId, jdId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.evaluations(), exact: false });
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
