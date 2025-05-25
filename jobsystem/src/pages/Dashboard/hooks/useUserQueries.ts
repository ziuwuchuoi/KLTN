import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getListCandidateService } from "@/services/candidate.service";
import { getListRecruiterService } from "@/services/recruiter.service";
import { useState } from "react";

export const QUERY_KEYS = {
    user: {
        candidate: ["user", "candidate"] as const,
        recruiter: ["user", "recruiter"] as const,
    },
};

export function useUserQueries() {
    const queryClient = useQueryClient();

    const [candidatePage, setCandidatePage] = useState(1);
    const [recruiterPage, setRecruiterPage] = useState(1);

    const {
        data: userCandidate,
        isLoading: isLoadingCandidate,
        isError: isErrorCandidate,
    } = useQuery({
        queryKey: ["user-candidate", candidatePage],
        queryFn: () => getListCandidateService(candidatePage),
        placeholderData: (previousData) => previousData,
    });

    const {
        data: userRecruiter,
        isLoading: isLoadingRecruiter,
        isError: isErrorRecruiter,
    } = useQuery({
        queryKey: ["user-recruiter", recruiterPage],
        queryFn: () => getListRecruiterService(recruiterPage),
        placeholderData: (previousData) => previousData,
    });

    const allUser = [...(userCandidate?.items || []), ...(userRecruiter?.items || [])];

    return {
        userCandidate,
        candidateMeta: userCandidate?.meta,
        candidatePage,
        setCandidatePage,
        isLoadingCandidate,
        isErrorCandidate,

        userRecruiter,
        recruiterMeta: userRecruiter?.meta,
        recruiterPage,
        setRecruiterPage,
        isLoadingRecruiter,
        isErrorRecruiter,

        allUser,
    };
}
