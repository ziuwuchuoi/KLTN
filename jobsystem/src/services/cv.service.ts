import axiosInstance from "./axiosInstance";

export const getCVByIdService = async (cvId: string) => {
    const response = await axiosInstance.get(`/cvs/cv/${cvId}`);
    return response.data.data;
};

export const uploadCVService = async (file: File) => {
    console.log("fileCV", file)
    const formData = new FormData();
    formData.append("cv", file);

    const response = await axiosInstance.post(`/cvs/uploadCV`, file);
    console.log("cv", response.data);
    return response.data.data;
};
