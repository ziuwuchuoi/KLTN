import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CustomVisibilityTabs, { VisibilityMode } from "@/components/molecules/CustomVisibilityTabs";
import { useFileQueries } from "@/pages/CVEvaluation/hooks/useFileQueries";

const defaultJD = {
    title: "",
    description: "",
    companyName: "",
    location: "",
    requirements: {
        experience: [""],
        skills: [""],
        education: [""],
        projects: [""],
        summary: "",
        certifications: [""],
        languages: [""],
    },
    benefits: [""],
    visibility: "public",
};

export type JD = typeof defaultJD;

const FormUploadJD = ({
    children,
    onUpload,
}: {
    children: React.ReactNode;
    onUpload: (isUploading: boolean) => void;
}) => {
    const [open, setOpen] = useState(false);
    const [jobData, setJobData] = useState<JD>(defaultJD);
    const [activeTab, setActiveTab] = useState("manual");

    const {uploadJD} = useFileQueries();

    const handleChange = (key: keyof JD) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setJobData((prev) => ({ ...prev, [key]: e.target.value }));
    };

    const handleRequirementsChange = (key: keyof JD["requirements"], index: number, value: string) => {
        const current = jobData.requirements[key];
        if (Array.isArray(current)) {
            const updated = [...current];
            updated[index] = value;
            setJobData((prev) => ({
                ...prev,
                requirements: { ...prev.requirements, [key]: updated },
            }));
        }
    };

    const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = JSON.parse(e.target?.result as string);
                setJobData(content);
                setActiveTab("manual");
            } catch {
                alert("Invalid JSON format.");
            }
        };
        reader.readAsText(file);
    };

    const handleSubmit = () => {
        setOpen(false);
        uploadJD.mutate(jobData, {
            onSettled: () => {
                onUpload(false); // Ensure upload state is reset
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Upload Job Description</DialogTitle>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="w-full mb-4">
                        <TabsTrigger value="file" className="flex-1">
                            Upload File
                        </TabsTrigger>
                        <TabsTrigger value="manual" className="flex-1">
                            Manual Input
                        </TabsTrigger>
                    </TabsList>

                    {/* File -> change into custom file upload :)*/}
                    <TabsContent value="file">
                        <Label className="mt-4">Upload .json file</Label>
                        <Input className="mt-2" type="file" accept=".json" onChange={handleUploadFile} />
                    </TabsContent>

                    <TabsContent value="manual">
                        <div className="flex flex-col">
                            <Label className="mt-4">Title</Label>
                            <Input className="mt-2" value={jobData.title} onChange={handleChange("title")} />
                            <Label className="mt-4">Description</Label>
                            <Textarea
                                className="mt-2"
                                value={jobData.description}
                                onChange={handleChange("description")}
                                rows={3}
                            />
                            <Label className="mt-4">Company Name</Label>
                            <Input
                                className="mt-2"
                                value={jobData.companyName}
                                onChange={handleChange("companyName")}
                            />
                            <Label className="mt-4">Location</Label>
                            <Input className="mt-2" value={jobData.location} onChange={handleChange("location")} />
                            <Label className="mt-4">Summary</Label>
                            <Textarea
                                className="mt-2"
                                value={jobData.requirements.summary}
                                onChange={(e) =>
                                    setJobData((prev) => ({
                                        ...prev,
                                        requirements: {
                                            ...prev.requirements,
                                            summary: e.target.value,
                                        },
                                    }))
                                }
                                rows={2}
                            />
                            {(
                                [
                                    "experience",
                                    "skills",
                                    "education",
                                    "projects",
                                    "certifications",
                                    "languages",
                                ] as (keyof JD["requirements"])[]
                            ).map((field) => (
                                <div key={field}>
                                    <Label className="capitalize mt-4">{field}</Label>
                                    {Array.isArray(jobData.requirements[field]) &&
                                        jobData.requirements[field].map((val, i) => (
                                            <Input
                                                key={i}
                                                className="mt-2"
                                                value={val}
                                                onChange={(e) => handleRequirementsChange(field, i, e.target.value)}
                                            />
                                        ))}
                                </div>
                            ))}
                            <Label className="mt-4">Benefits</Label>
                            {jobData.benefits.map((b, i) => (
                                <Input
                                    key={i}
                                    className="mt-2"
                                    value={b}
                                    onChange={(e) => {
                                        const updated = [...jobData.benefits];
                                        updated[i] = e.target.value;
                                        setJobData((prev) => ({ ...prev, benefits: updated }));
                                    }}
                                />
                            ))}
                            <Label className="mt-4">Visibility</Label>
                            <CustomVisibilityTabs
                                className="mt-2"
                                isSelected={jobData.visibility as VisibilityMode}
                                onChange={(mode) =>
                                    setJobData((prev) => ({
                                        ...prev,
                                        visibility: mode,
                                    }))
                                }
                            />
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end mt-6">
                    <DialogClose asChild>
                        <Button variant="secondary" className="mr-2">
                            Cancel
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button onClick={handleSubmit}>Submit</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FormUploadJD;
