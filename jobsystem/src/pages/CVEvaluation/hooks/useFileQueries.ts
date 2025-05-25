import { useMutation, useQuery } from "@tanstack/react-query";
import { uploadCVService, getCVByIdService, getListCVService, CVItem, CVDetail } from "@/services/file.service";
import { getJDByIdService, uploadJDService, getListJDService, JDItem, JDDetail } from "@/services/file.service";

export const QUERY_KEYS = {
    cvDetail: (id: string) => ["files", "cv", id] as const,
    jdDetail: (id: string) => ["files", "jd", id] as const,
};

export const useCVQueries = (userId: string = "", page: number = 1, limit: number = 20) => {
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
        mutationFn: (file: File) => uploadCVService(file),
        onSuccess: () => {
            console.log("CV uploaded successfully");
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

export const useJDQueries = (userId: string = "", page: number = 1, limit: number = 20) => {
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
            console.log("JD uploaded successfully");
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
