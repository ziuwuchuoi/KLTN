import axiosInstance from "./axiosInstance";

// candidate and recruiter
export const getUserProfileService = async () => {
    const response = await axiosInstance.get("/users/getUserProfile");
    return response.data.data;
};

// admin
export const getAdminProfileService = async () => {
    const response = await axiosInstance.get("/admins/getAdminInfo");
    return response.data.data;
};

export const grantRecruiterRoleService = async (email: string) => {
    const response = await axiosInstance.get(`/users/grant-recruiter/${email}`);
    return response.data;
};
