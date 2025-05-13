import axiosInstance from "./axiosInstance";

// only admin can get list of recruiters
export const getListRecruiterService = async (
    limit = 20,
    page = 1
): Promise<{
    items;
    meta: { limit: number; page: number; total: number; totalPages: number };
}> => {
    const response = await axiosInstance.get(`/users/recruiters?limit=${limit}&page=${page}`);
    console.log("response.data candi", response.data);
    return response.data.data;
};
