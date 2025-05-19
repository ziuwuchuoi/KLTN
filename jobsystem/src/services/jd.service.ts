import { JD } from "@/pages/Dashboard/forms/FormUploadJD";
import axiosInstance from "./axiosInstance";

export const getJDByIdService = async (jdId: string) => {
    const response = await axiosInstance.get(`/cvs/jd/${jdId}`);
    return response.data.data;
};

export const uploadJDService = async (data: JD) => {
    console.log("uploading JD data", data);
  
    const response = await axiosInstance.post(`/cvs/uploadJD`, data);
  
    console.log("response", response.data);
    return response.data.data;
  };
  
