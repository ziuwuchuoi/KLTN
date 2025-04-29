import axiosInstance from "./axiosInstance";
import { LoginParams } from "@/stores/useAuthStore";

export const loginService = async ({ role, step, type, data }: LoginParams) => {
    const response = await axiosInstance.post(`/auth/login/${role}`, {
        step,
        type,
        data,
    });
    return response.data.data;
};

export const logoutService = async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
};