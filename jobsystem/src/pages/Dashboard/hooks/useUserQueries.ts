import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Candidate, getListCandidateService } from "@/services/candidate.service";
import { Recruiter, getListRecruiterService } from "@/services/recruiter.service";

export const QUERY_KEYS = {
    candidate: (id: string) => ["users", "candidate", id] as const,
    recruiter: (id: string) => ["users", "recruiter", id] as const,
};

export const useCandidateQueries = (page: number = 1, limit: number = 20) => {
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

export const useRecruiterQueries = (page: number = 1, limit: number = 20) => {
    const {
        data: recruitersData,
        isLoading: isRecruiterLoading,
        error: recruiterError,
    } = useQuery<{
        items: Recruiter[];
        meta: { limit: number; page: number; total: number; totalPages: number };
    }>({
        queryKey: ["recruiter", page, limit],
        queryFn: () => getListRecruiterService(limit, page),
        placeholderData: (previousData) => previousData,
    });

    const pagination = recruitersData?.meta ?? {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1,
    };

    const recruiters = recruitersData?.items.filter((r) => r.user?.canBeRecruiter === true);
    const requestedRecruiters = recruitersData?.items.filter((r) => r.user?.canBeRecruiter === false);

    return { recruiters, requestedRecruiters, pagination, isRecruiterLoading, recruiterError };
};
