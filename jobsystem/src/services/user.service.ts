import axiosInstance from "./axiosInstance";

export const getUserProfileService = async () => {
    const response = await axiosInstance.get("/users/getUserProfile");
    console.log("response pro5", response)
    return response.data.data;
};
