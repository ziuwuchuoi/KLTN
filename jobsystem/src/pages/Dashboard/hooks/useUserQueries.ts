import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type Candidate, getListCandidateService } from "@/services/candidate.service";
import { type Recruiter, getListRecruiterService } from "@/services/recruiter.service";
import { grantRecruiterRoleService } from "@/services/user.service";

export const QUERY_KEYS = {
    candidate: (id: string) => ["users", "candidate", id] as const,
    recruiter: (id: string) => ["users", "recruiter", id] as const,
};

export const useCandidateQueries = (page = 1, limit = 20) => {
    const {
        data: candidatesdata,
        isLoading: isCandidateLoading,
        error: candidateError,
    } = useQuery<{
        items: Candidate[];
        meta: { limit: number; page: number; total: number; totalPages: number };
    }>({
        queryKey: ["candidates", page, limit],
        queryFn: () => getListCandidateService(limit, page),
        placeholderData: (previousData) => previousData,
    });

    const pagination = candidatesdata?.meta ?? {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1,
    };

    return { candidates: candidatesdata?.items || [], pagination, isCandidateLoading, candidateError };
};

export const useRecruiterQueries = (activePage = 1, requestedPage = 1, limit = 10) => {
    const queryClient = useQueryClient();

    const {
        data: activeData,
        isLoading: isActiveLoading,
        error: activeError,
    } = useQuery<{
        items: Recruiter[];
        meta: { limit: number; page: number; total: number; totalPages: number };
    }>({
        queryKey: ["recruiters", "active", activePage, limit],
        queryFn: () => getListRecruiterService(limit, activePage),
        select: (data) => ({
            ...data,
            items: data.items.filter((r) => r.user?.canBeRecruiter === true),
        }),
        placeholderData: (prev) => prev,
    });

    const {
        data: requestedData,
        isLoading: isRequestedLoading,
        error: requestedError,
    } = useQuery<{
        items: Recruiter[];
        meta: { limit: number; page: number; total: number; totalPages: number };
    }>({
        queryKey: ["recruiters", "requested", requestedPage, limit],
        queryFn: () => getListRecruiterService(limit, requestedPage),
        select: (data) => ({
            ...data,
            items: data.items.filter((r) => r.user?.canBeRecruiter === false),
        }),
        placeholderData: (prev) => prev,
    });

    const grantRecruiter = useMutation({
        mutationFn: (email: string) => grantRecruiterRoleService(email),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["recruiters"], exact: false });
            console.log("Granted Recruiter successfully");
        },
        onError: (error: Error) => {
            console.log("Granted Recruiter failed", error);
        },
    });

    return {
        recruiters: activeData?.items ?? [],
        requestedRecruiters: requestedData?.items ?? [],

        paginationRecruiters: activeData?.meta ?? {
            page: activePage,
            limit,
            total: 0,
            totalPages: 1,
        },

        paginationRequestedRecruiters: requestedData?.meta ?? {
            page: requestedPage,
            limit,
            total: 0,
            totalPages: 1,
        },

        isActiveLoading,
        isRequestedLoading,
        activeError,
        requestedError,

        grantRecruiter,
    };
};
