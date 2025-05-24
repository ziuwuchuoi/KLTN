import axiosInstance from "./axiosInstance";

// candidate and recruiter
export const getUserProfileService = async () => {
    const response = await axiosInstance.get("/users/getUserProfile");
    console.log("response pro5", response)
    return response.data.data;
};

// admin 
export const getAdminProfileService = async () => {
    const response = await axiosInstance.get("/admins/getAdminInfo");
    console.log("response pro5", response)
    return response.data.data;
};