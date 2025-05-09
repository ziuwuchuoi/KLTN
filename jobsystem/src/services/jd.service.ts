import axiosInstance from "./axiosInstance";

export const getJDByIdService = async (jdId: string) => {
    const response = await axiosInstance.get(`/cvs/jd/${jdId}`);
    return response.data.data;
};

export const uploadJDService = async (file: File) => {
    console.log("fileJD", file);

    const formData = new FormData();
    formData.append("jd", file);

    const response = await axiosInstance.post(`/cvs/uploadJD`, file);
    console.log("jd", response.data);
    return response.data.data;
};
