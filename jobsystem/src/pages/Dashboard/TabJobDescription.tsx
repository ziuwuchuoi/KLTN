import { Button } from "@/components/ui/button";
import { useState } from "react";
import FormUploadJD from "./forms/FormUploadJD";
import { cn } from "@/components/utils/general.utils";

const TabRecruiter = () => {
    const [isUploading, setIsUploading] = useState(false);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">Job Description</h1>
                <div className={cn("col-span-6 lg:col-span-4 xl:col-span-3")} key="upload-jd">
                    <FormUploadJD
                        onUpload={(isUploading) => {
                            setIsUploading(isUploading);
                        }}
                    >
                        <Button variant="outline">Add Job Description</Button>
                    </FormUploadJD>
                </div>
            </div>
        </div>
    );
};

export default TabRecruiter;
