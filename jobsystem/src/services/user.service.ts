import axiosInstance from "./axiosInstance";

export interface GrantRecruiterResponse {
    _id: string;
    email: string;
    name: string;
    avatar: string;
    canBeRecruiter: boolean;
}
// candidate and recruiter
export const getUserProfileService = async () => {
    const response = await axiosInstance.get("/users/getUserProfile");
    console.log("pro5", response.data.data);
    return response.data.data;
};

// admin
export const getAdminProfileService = async () => {
    const response = await axiosInstance.get("/admins/getAdminInfo");
    return response.data.data;
};

export const grantRecruiterRoleService = async (email: string): Promise<GrantRecruiterResponse> => {
    console.log("email", email);
    const response = await axiosInstance.put(`/users/grant-recruiter/${email}`);
    console.log("response", response);

    return response.data.data;
};
