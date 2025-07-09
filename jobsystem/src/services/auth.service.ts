import axiosInstance from "./axiosInstance";
import { LoginParams, SignupRecruiterParams } from "@/stores/useAuthStore";

export const loginService = async ({ role, step, type, data }: LoginParams) => {
    const response = await axiosInstance.post(`/auth/login/${role}`, {
        step,
        type,
        data,
    });
    return response.data.data;
};

export const loginAdminService = async (name: string, password: string) => {
    const response = await axiosInstance.post("/admins/login", {
        name,
        password,
    });

    console.log("Admin login response:", response.data);
    return response.data.data;
};

export const sigupRecruiterService = async ({
    email,
    position,
    companyName,
    companyWebsite,
}: SignupRecruiterParams) => {
    const response = await axiosInstance.post("/auth/signUpRecruiter", {
        email,
        position,
        companyName,
        companyWebsite,
    });
    return response.data;
};

export const logoutService = async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
};
