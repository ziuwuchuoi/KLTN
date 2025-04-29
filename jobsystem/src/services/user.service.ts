import axiosInstance from "./axiosInstance";

export const getUserService = async () => {
    const response = await axiosInstance.get("/users/getUserProfile");
    console.log("response", response)
    return response.data.data.user;
};
