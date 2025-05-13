import axiosInstance from "./axiosInstance";

// only admin can get list of candidates
export const getListCandidateService = async (
    limit = 20,
    page = 1
): Promise<{
    items;
    meta: { limit: number; page: number; total: number; totalPages: number };
}> => {
    const response = await axiosInstance.get(`/users/candidates?limit=${limit}&page=${page}`);
    console.log("response.data candi", response.data);
    return response.data.data;
};
