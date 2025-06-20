"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Save, X, MapPin, Building2 } from "lucide-react";
import CustomDialog from "@/components/molecules/CustomDialog";
import { JDInputForm } from "@/pages/CVEvaluation/stepJD/JDInput";
import { useJDQueries } from "@/pages/CVEvaluation/hooks/useFileQueries";
import { useTestSetQueries } from "../hooks/useTestSetQueries";
import { DialogAddTestSet } from "./DialogAddTestSet";
import { SubTabJDInformation } from "../SubTabJDInformation";
import { SubTabTestSet } from "../SubTabTestSet";
import type { JDItem, JDDetail } from "@/services/file.service";

interface DialogJDProps {
    isOpen: boolean;
    onClose: () => void;
    jd: JDItem | null;
}

export function DialogJD({ isOpen, onClose, jd }: DialogJDProps) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [editData, setEditData] = useState<Partial<JDDetail>>({});
    const [activeTab, setActiveTab] = useState("information");
    const [isAddTestsetOpen, setIsAddTestsetOpen] = useState(false);

    const { useJDDetail, updateJD } = useJDQueries();
    const { useTestSetByJD, updateTestSet } = useTestSetQueries();

    const { data: jdDetail, isLoading } = useJDDetail(jd?._id || "");
    const { data: testSetDetail, isLoading: isTestSetLoading } = useTestSetByJD(jd?._id || "");

    // Reset edit mode when dialog opens/closes
    useEffect(() => {
        if (isOpen && jdDetail) {
            setEditData(jdDetail);
            setIsEditMode(false);
            setActiveTab("information");
        }
    }, [isOpen, jdDetail]);

    const handleEdit = () => {
        setIsEditMode(true);
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        if (jdDetail) {
            setEditData(jdDetail);
        }
    };

    const handleSave = async () => {
        if (!jd?._id) return;

        try {
            await updateJD.mutateAsync({
                jdId: jd._id,
                data: editData,
            });
            setIsEditMode(false);
        } catch (error) {
            console.error("Failed to update JD:", error);
        }
    };

    const handleEditDataChange = (data: Partial<JDDetail>) => {
        setEditData(data);
    };

    const handleAddTestset = () => {
        setIsAddTestsetOpen(true);
    };

    const handleRemoveQuiz = async (quizId: string) => {
        if (!testSetDetail || !jd?._id) return;

        try {
            const updatedQuizzes = testSetDetail.quizzes?.filter((quiz) => quiz._id !== quizId) || [];
            await updateTestSet.mutateAsync({
                jdId: jd._id,
                quizIds: updatedQuizzes.map((q) => q._id),
                problemIds: testSetDetail.problems?.map((c) => c._id) || [],
            });
        } catch (error) {
            console.error("Failed to remove quiz:", error);
        }
    };

    const handleRemoveCode = async (codeId: string) => {
        if (!testSetDetail || !jd?._id) return;

        try {
            const updatedCodes = testSetDetail.problems?.filter((code) => code._id !== codeId) || [];
            await updateTestSet.mutateAsync({
                jdId: jd._id,
                quizIds: testSetDetail.quizzes?.map((q) => q._id) || [],
                problemIds: updatedCodes.map((c) => c._id),
            });
        } catch (error) {
            console.error("Failed to remove code problem:", error);
        }
    };

    if (!jd) return null;

    return (
        <>
            <CustomDialog
                open={isOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setIsEditMode(false);
                        onClose();
                    }
                }}
                onClose={() => {
                    setIsEditMode(false);
                    onClose();
                }}
                dialogTitle={
                    isEditMode ? (
                        "Edit Job Description"
                    ) : (
                        <div className="space-y-3">
                            <h2 className="text-2xl font-bold text-white leading-tight">{jdDetail?.title}</h2>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                <div className="flex items-center gap-1">
                                    <Building2 className="h-4 w-4" />
                                    <span>{jdDetail?.companyName}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>{jdDetail?.location}</span>
                                </div>
                                <Badge
                                    variant="outline"
                                    className={
                                        jdDetail?.visibility === "public"
                                            ? "border-green-500 text-green-400 bg-green-500/10"
                                            : "border-yellow-500 text-yellow-400 bg-yellow-500/10"
                                    }
                                >
                                    {jdDetail?.visibility?.charAt(0).toUpperCase() + jdDetail?.visibility?.slice(1)}
                                </Badge>
                            </div>
                        </div>
                    )
                }
                className="bg-slate-900 border-slate-700 w-[85%] h-[90%]"
                childrenContainerClassName="p-0 flex flex-col"
            >
                <div className="flex flex-col h-full">
                    {isLoading ? (
                        <div className="flex items-center justify-center flex-1">
                            <div className="text-gray-400">Loading job description...</div>
                        </div>
                    ) : isEditMode ? (
                        <div className="flex-1 flex flex-col">
                            <div className="flex-1">
                                <JDInputForm
                                    jdData={editData}
                                    onJDDataChange={handleEditDataChange}
                                    onSubmit={handleSave}
                                />
                            </div>
                            <div className="border-t border-slate-700 p-4 bg-slate-800/30">
                                <div className="flex justify-end gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={handleCancelEdit}
                                        className="border-gray-600 hover:bg-gray-700"
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSave}
                                        disabled={updateJD.isPending}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        {updateJD.isPending ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full">
                            {/* Fixed Tab Navigation */}
                            <div>
                                <Tabs value={activeTab} onValueChange={setActiveTab}>
                                    <TabsList className="grid w-full grid-cols-2 bg-slate-800 border-slate-700">
                                        <TabsTrigger
                                            value="information"
                                            className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
                                        >
                                            Job Information
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="testset"
                                            className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
                                        >
                                            Test Sets
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>

                            {/* Scrollable Tab Content */}
                            <div className="flex-1 overflow-hidden">
                                <Tabs value={activeTab} className="h-full">
                                    <TabsContent value="information" className="h-full m-0">
                                        <SubTabJDInformation jdDetail={jdDetail} />
                                    </TabsContent>

                                    <TabsContent value="testset" className="h-full m-0">
                                        <SubTabTestSet
                                            testSetDetail={testSetDetail}
                                            isTestSetLoading={isTestSetLoading}
                                            onAddTestset={handleAddTestset}
                                            onRemoveQuiz={handleRemoveQuiz}
                                            onRemoveCode={handleRemoveCode}
                                        />
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    )}
                </div>
            </CustomDialog>

            <DialogAddTestSet
                isOpen={isAddTestsetOpen}
                onClose={() => setIsAddTestsetOpen(false)}
                jdId={jd?._id || ""}
            />
        </>
    );
}
