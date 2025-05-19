import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { uploadCVService, getCVByIdService } from "@/services/cv.service";
import { getJDByIdService, uploadJDService } from "@/services/jd.service";
import { JD } from "@/pages/Dashboard/forms/FormUploadJD";

export const QUERY_KEYS = {
    files: {
        cvDetail: (id: string) => ["files", "cv", id] as const,
        jdDetail: (id: string) => ["files", "jd", id] as const,
    },
};

export function useFileQueries() {
    const queryClient = useQueryClient();

    const uploadCV = useMutation({
        mutationFn: (file: File) => uploadCVService(file),
        onSuccess: () => {
            console.log("CV uploaded successfully");
        },
        onError: (error: Error) => {
            console.log("CV uploaded failed", error);
        },
    });

    const uploadJD = useMutation({
        mutationFn: (data: JD) => uploadJDService(data),
        onSuccess: () => {
          console.log("JD uploaded successfully");
        },
        onError: (error: Error) => {
          console.log("JD upload failed", error);
        },
      });
      
    const useCVDetail = (id: string) =>
        useQuery({
            queryKey: QUERY_KEYS.files.cvDetail(id),
            queryFn: () => getCVByIdService(id),
            enabled: !!id,
            staleTime: Infinity,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: 1,
        });

    const useJDDetail = (id: string) =>
        useQuery({
            queryKey: QUERY_KEYS.files.jdDetail(id),
            queryFn: () => getJDByIdService(id),
            enabled: !!id,
            staleTime: Infinity,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: 1,
        });

    return {
        // mutations
        uploadCV,
        uploadJD,

        // queries
        useCVDetail,
        useJDDetail,
    };
}
