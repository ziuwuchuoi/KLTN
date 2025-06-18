"use client";

import { useState, useEffect, useCallback } from "react";
import { JDInputForm } from "@/pages/CVEvaluation/stepJD/JDInput";
import CustomDialog from "@/components/molecules/CustomDialog";
import { useJDQueries } from "@/pages/CVEvaluation/hooks/useFileQueries";
import type { JDDetail } from "@/services/file.service";

interface DialogCreateJDProps {
    isOpen: boolean;
    onClose: () => void;
}

const initialJDData: Partial<JDDetail> = {
    title: "",
    position: "",
    companyName: "",
    location: "",
    description: "",
    requirements: {
        skills: [],
        experience: [],
        education: [],
        projects: [],
        languages: [],
        certifications: [],
        summary: "",
    },
    benefits: [],
    visibility: "public",
};

export function DialogCreateJD({ isOpen, onClose }: DialogCreateJDProps) {
    const [jdData, setJdData] = useState<Partial<JDDetail>>(initialJDData);

    const { uploadJD } = useJDQueries();

    const handleJDDataChange = (data: Partial<JDDetail>) => {
        setJdData(data);
    };

    const resetForm = useCallback(() => {
        setJdData(initialJDData);
    }, []);

    const handleSubmit = async () => {
        try {
            await uploadJD.mutateAsync(jdData);
            resetForm();
            onClose();
        } catch (error) {
            console.error("Failed to create JD:", error);
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    useEffect(() => {
        if (isOpen) {
            resetForm();
        }
    }, [isOpen, resetForm]);

    return (
        <CustomDialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    handleClose();
                }
            }}
            onClose={handleClose}
            dialogTitle="Create New Job Description"
            description="Fill out the form below to create a comprehensive job description. Complete all required fields in the first step to proceed."
            className="bg-slate-900 border-slate-700 w-[90%] h-[90%]"
            childrenContainerClassName="p-0"
        >
            <div className="h-full">
                <JDInputForm jdData={jdData} onJDDataChange={handleJDDataChange} onSubmit={handleSubmit} />
            </div>
        </CustomDialog>
    );
}
