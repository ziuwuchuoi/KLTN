import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { type Candidate, getListCandidateService } from "@/services/candidate.service"
import { type Recruiter, getListRecruiterService } from "@/services/recruiter.service"
import { grantRecruiterRoleService } from "@/services/user.service"

export const QUERY_KEYS = {
  candidate: (id: string) => ["users", "candidate", id] as const,
  recruiter: (id: string) => ["users", "recruiter", id] as const,
}

export const useCandidateQueries = (page = 1, limit = 20) => {
  const {
    data: candidatesdata,
    isLoading: isCandidateLoading,
    error: candidateError,
  } = useQuery<{
    items: Candidate[]
    meta: { limit: number; page: number; total: number; totalPages: number }
  }>({
    queryKey: ["candidates", page, limit],
    queryFn: () => getListCandidateService(limit, page),
    placeholderData: (previousData) => previousData,
  })

  const pagination = candidatesdata?.meta ?? {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  }

  return { candidates: candidatesdata?.items || [], pagination, isCandidateLoading, candidateError }
}

export const useRecruiterQueries = (page = 1, limit = 20) => {
  const queryClient = useQueryClient()

  const {
    data: recruitersData,
    isLoading: isRecruiterLoading,
    error: recruiterError,
  } = useQuery<{
    items: Recruiter[]
    meta: { limit: number; page: number; total: number; totalPages: number }
  }>({
    queryKey: ["recruiters", page, limit],
    queryFn: () => getListRecruiterService(limit, page),
    placeholderData: (previousData) => previousData,
  })

  const grantRecruiter = useMutation({
    mutationFn: (email: string) => grantRecruiterRoleService(email),
    onSuccess: () => {
      // Invalidate and refetch recruiters data to update the lists
      queryClient.invalidateQueries({ queryKey: ["recruiters"] })
      console.log("Granted Recruiter successfully")
    },
    onError: (error: Error) => {
      console.log("Granted Recruiter failed", error)
    },
  })

  const pagination = recruitersData?.meta ?? {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  }

  const recruiters = recruitersData?.items.filter((r) => r.user?.canBeRecruiter === true)
  const requestedRecruiters = recruitersData?.items.filter((r) => r.user?.canBeRecruiter === false)

  return { recruiters, grantRecruiter, requestedRecruiters, pagination, isRecruiterLoading, recruiterError }
}
