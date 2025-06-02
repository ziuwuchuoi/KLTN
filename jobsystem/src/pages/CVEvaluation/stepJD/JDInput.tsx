"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X, ArrowLeft, ArrowRight, Check } from "lucide-react";
import type { JDDetail } from "@/services/file.service";
import { ArrayInput } from "./ArrayInput";

interface JDInputFormProps {
    jdData: Partial<JDDetail>;
    onJDDataChange: (data: Partial<JDDetail>) => void;
    onSubmit: () => Promise<void>;
}

export function JDInputForm({ jdData, onJDDataChange, onSubmit }: JDInputFormProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const steps = ["Basic Information", "Skills & Experience", "Education & Languages", "Benefits"];

    const updateField = (field: string, value: string | string[]) => {
        onJDDataChange({ ...jdData, [field]: value });
    };

    const updateRequirement = (field: string, value: string | string[]) => {
        onJDDataChange({
            ...jdData,
            requirements: { ...jdData.requirements, [field]: value },
        });
    };

    const addArrayItem = (field: string, isRequirement = false) => {
        if (isRequirement) {
            const current = (jdData.requirements?.[field as keyof typeof jdData.requirements] as string[]) || [];
            updateRequirement(field, [...current, ""]);
        } else {
            const current = (jdData[field as keyof typeof jdData] as string[]) || [];
            updateField(field, [...current, ""]);
        }
    };

    const removeArrayItem = (field: string, index: number, isRequirement = false) => {
        if (isRequirement) {
            const current = (jdData.requirements?.[field as keyof typeof jdData.requirements] as string[]) || [];
            updateRequirement(
                field,
                current.filter((_, i) => i !== index)
            );
        } else {
            const current = (jdData[field as keyof typeof jdData] as string[]) || [];
            updateField(
                field,
                current.filter((_, i) => i !== index)
            );
        }
    };

    const updateArrayItem = (field: string, index: number, value: string, isRequirement = false) => {
        if (isRequirement) {
            const current = (jdData.requirements?.[field as keyof typeof jdData.requirements] as string[]) || [];
            const updated = [...current];
            updated[index] = value;
            updateRequirement(field, updated);
        } else {
            const current = (jdData[field as keyof typeof jdData] as string[]) || [];
            const updated = [...current];
            updated[index] = value;
            updateField(field, updated);
        }
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const isBasicInfoValid = () => {
        return (
            jdData.title?.trim() && jdData.companyName?.trim() && jdData.location?.trim() && jdData.description?.trim()
        );
    };

    const handleSubmit = async () => {
        if (!isBasicInfoValid()) return;

        setIsSubmitting(true);
        try {
            await onSubmit();
            setCurrentStep(0);
        } catch (error) {
            console.error("Error submitting JD:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="bg-slate-700/30 border-slate-600 h-full flex flex-col">
            <CardContent className="p-4 flex flex-col h-full">
                {/* Progress Steps */}
                <div className="mb-6 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <div key={index} className="flex items-center">
                                <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                        index === currentStep
                                            ? "bg-purple-600 text-white"
                                            : index < currentStep
                                              ? "bg-green-600 text-white"
                                              : "bg-slate-700 text-slate-400"
                                    }`}
                                >
                                    {index < currentStep ? <Check className="w-3 h-3" /> : index + 1}
                                </div>
                                {index < steps.length - 1 && (
                                    <div
                                        className={`h-1 w-full ${
                                            index < currentStep ? "bg-green-600" : "bg-slate-700"
                                        } mx-1 flex-1 min-w-[2rem]`}
                                    ></div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-1 px-1 text-xs text-slate-400">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className={`${
                                    index === currentStep
                                        ? "text-purple-400 font-medium"
                                        : index < currentStep
                                          ? "text-green-400"
                                          : ""
                                }`}
                            >
                                {step}
                            </div>
                        ))}
                    </div>
                </div>

                <ScrollArea className="flex-1 mb-4">
                    <div className="space-y-4 pr-4">
                        {/* Step 1: Basic Information */}
                        {currentStep === 0 && (
                            <div className="space-y-3">
                                <h4 className="font-semibold text-white text-sm">Basic Information</h4>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-300">Job Title *</label>
                                    <Input
                                        value={jdData.title || ""}
                                        onChange={(e) => updateField("title", e.target.value)}
                                        placeholder="e.g. Senior Software Engineer"
                                        className="bg-slate-700 border-slate-600 text-white h-8"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-300">Position *</label>
                                    <Input
                                        value={jdData.position || ""}
                                        onChange={(e) => updateField("position", e.target.value)}
                                        placeholder="e.g. Software Engineer"
                                        className="bg-slate-700 border-slate-600 text-white h-8"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-300">Company Name *</label>
                                    <Input
                                        value={jdData.companyName || ""}
                                        onChange={(e) => updateField("companyName", e.target.value)}
                                        placeholder="e.g. Tech Corp Inc."
                                        className="bg-slate-700 border-slate-600 text-white h-8"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-300">Location *</label>
                                    <Input
                                        value={jdData.location || ""}
                                        onChange={(e) => updateField("location", e.target.value)}
                                        placeholder="e.g. San Francisco, CA"
                                        className="bg-slate-700 border-slate-600 text-white h-8"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-300">Job Description *</label>
                                    <Textarea
                                        value={jdData.description || ""}
                                        onChange={(e) => updateField("description", e.target.value)}
                                        placeholder="Describe the role, responsibilities, and what you're looking for..."
                                        className="bg-slate-700 border-slate-600 text-white min-h-[60px] text-sm"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 2: Skills & Experience */}
                        {currentStep === 1 && (
                            <div className="space-y-3">
                                <h4 className="font-semibold text-white text-sm">Skills & Experience</h4>
                                <ArrayInput
                                    label="Required Skills"
                                    items={jdData.requirements?.skills || []}
                                    placeholder="e.g. React, Node.js, TypeScript"
                                    onAdd={() => addArrayItem("skills", true)}
                                    onRemove={(index) => removeArrayItem("skills", index, true)}
                                    onChange={(index, value) => updateArrayItem("skills", index, value, true)}
                                />

                                <ArrayInput
                                    label="Requirements - Experience"
                                    items={jdData.requirements?.experience || []}
                                    placeholder="e.g. 3+ years of experience in..."
                                    onAdd={() => addArrayItem("experience", true)}
                                    onRemove={(index) => removeArrayItem("experience", index, true)}
                                    onChange={(index, value) => updateArrayItem("experience", index, value, true)}
                                />

                                <ArrayInput
                                    label="Project Experience"
                                    items={jdData.requirements?.projects || []}
                                    placeholder="e.g. E-commerce platform development"
                                    onAdd={() => addArrayItem("projects", true)}
                                    onRemove={(index) => removeArrayItem("projects", index, true)}
                                    onChange={(index, value) => updateArrayItem("projects", index, value, true)}
                                />

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-300">Summary</label>
                                    <Textarea
                                        value={jdData.requirements?.summary || ""}
                                        onChange={(e) => updateRequirement("summary", e.target.value)}
                                        placeholder="Brief summary of the ideal candidate..."
                                        className="bg-slate-700 border-slate-600 text-white min-h-[50px] text-sm"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Education & Languages */}
                        {currentStep === 2 && (
                            <div className="space-y-3">
                                <h4 className="font-semibold text-white text-sm">Education & Languages</h4>

                                <ArrayInput
                                    label="Education Requirements"
                                    items={jdData.requirements?.education || []}
                                    placeholder="e.g. Bachelor's in Computer Science"
                                    onAdd={() => addArrayItem("education", true)}
                                    onRemove={(index) => removeArrayItem("education", index, true)}
                                    onChange={(index, value) => updateArrayItem("education", index, value, true)}
                                />

                                <ArrayInput
                                    label="Languages"
                                    items={jdData.requirements?.languages || []}
                                    placeholder="e.g. English (fluent), Spanish (conversational)"
                                    onAdd={() => addArrayItem("languages", true)}
                                    onRemove={(index) => removeArrayItem("languages", index, true)}
                                    onChange={(index, value) => updateArrayItem("languages", index, value, true)}
                                />

                                <ArrayInput
                                    label="Certifications"
                                    items={jdData.requirements?.certifications || []}
                                    placeholder="e.g. AWS Certified Developer"
                                    onAdd={() => addArrayItem("certifications", true)}
                                    onRemove={(index) => removeArrayItem("certifications", index, true)}
                                    onChange={(index, value) => updateArrayItem("certifications", index, value, true)}
                                />
                            </div>
                        )}

                        {/* Step 4: Benefits */}
                        {currentStep === 3 && (
                            <div className="space-y-3">
                                <h4 className="font-semibold text-white text-sm">Benefits & Perks</h4>
                                <ArrayInput
                                    label="Benefits"
                                    items={jdData.benefits || []}
                                    placeholder="e.g. Health insurance, Remote work, Flexible hours"
                                    onAdd={() => addArrayItem("benefits", true)}
                                    onRemove={(index) => removeArrayItem("benefits", index, true)}
                                    onChange={(index, value) => updateArrayItem("benefits", index, value, true)}
                                />
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-auto flex-shrink-0">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={prevStep}
                        disabled={currentStep === 0 || isSubmitting}
                        className="border-slate-600 text-slate-300"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                    </Button>

                    {currentStep < steps.length - 1 ? (
                        <Button
                            size="sm"
                            onClick={nextStep}
                            disabled={(currentStep === 0 && !isBasicInfoValid()) || isSubmitting}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            Next
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Check className="w-4 h-4 mr-2" />
                                    Complete
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
