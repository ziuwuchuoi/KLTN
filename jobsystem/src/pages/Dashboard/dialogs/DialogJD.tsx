"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Edit, Save, X, MapPin, Building2, Plus, Clock, HelpCircle, Code, Trash2 } from "lucide-react"
import CustomDialog from "@/components/molecules/CustomDialog"
import { JDInputForm } from "@/pages/CVEvaluation/stepJD/JDInput"
import { useJDQueries } from "@/pages/CVEvaluation/hooks/useFileQueries"
import { useTestSetQueries } from "../hooks/useTestSetQueries"
import { AddTestsetDialog } from "./DialogAddTestSet"
import type { JDItem, JDDetail } from "@/services/file.service"

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
                    <div className="flex items-center justify-between w-full">
                        {isEditMode ? (
                            "Edit Job Description"
                        ) : (
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-white">{jdDetail?.title}</h2>
                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <Building2 className="h-4 w-4" />
                                            <span>{jdDetail?.companyName}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            <span>{jdDetail?.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Badge
                                                variant="outline"
                                                className={
                                                    jdDetail?.visibility === "public"
                                                        ? "border-green-500 text-green-400"
                                                        : "border-yellow-500 text-yellow-400"
                                                }
                                            >
                                                {jdDetail?.visibility?.charAt(0).toUpperCase() +
                                                    jdDetail?.visibility?.slice(1)}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            {!isEditMode ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleEdit}
                                    className="border-gray-600 hover:bg-gray-700"
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                            ) : (
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCancelEdit}
                                        className="border-gray-600 hover:bg-gray-700"
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Cancel
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleSave}
                                        disabled={updateJD.isPending}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        {updateJD.isPending ? "Saving..." : "Save"}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                }
                className="bg-slate-900 border-slate-700 w-[80%] h-[90%]"
                childrenContainerClassName="p-0"
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
                            <div className="border-b border-slate-700 px-6 pt-4">
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

                            <div className="flex-1 flex flex-col">
                                <Tabs value={activeTab} className="flex-1 flex flex-col">
                                    <TabsContent value="information" className="flex-1 flex flex-col m-0">
                                        <ScrollArea className="flex-1 p-6">
                                            <div className="space-y-6">
                                                {/* Position */}
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white mb-3">Position</h3>
                                                    <p className="text-gray-300 text-base">{jdDetail?.position}</p>
                                                </div>

                                                {/* Job Description */}
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white mb-3">
                                                        Job Description
                                                    </h3>
                                                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                                        {jdDetail?.description}
                                                    </p>
                                                </div>

                                                {/* Requirements */}
                                                {jdDetail?.requirements && (
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-white mb-4">
                                                            Requirements
                                                        </h3>
                                                        <div className="space-y-4">
                                                            {jdDetail.requirements.summary && (
                                                                <div>
                                                                    <h4 className="font-medium text-gray-300 mb-2">
                                                                        Summary
                                                                    </h4>
                                                                    <p className="text-gray-400 leading-relaxed">
                                                                        {jdDetail.requirements.summary}
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {jdDetail.requirements.skills &&
                                                                jdDetail.requirements.skills.length > 0 && (
                                                                    <div>
                                                                        <h4 className="font-medium text-gray-300 mb-3">
                                                                            Required Skills
                                                                        </h4>
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {jdDetail.requirements.skills.map(
                                                                                (skill, index) => (
                                                                                    <Badge
                                                                                        key={index}
                                                                                        variant="secondary"
                                                                                        className="bg-blue-900/20 text-blue-400"
                                                                                    >
                                                                                        {skill}
                                                                                    </Badge>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                            {jdDetail.requirements.experience &&
                                                                jdDetail.requirements.experience.length > 0 && (
                                                                    <div>
                                                                        <h4 className="font-medium text-gray-300 mb-3">
                                                                            Experience
                                                                        </h4>
                                                                        <ul className="list-disc list-inside space-y-2">
                                                                            {jdDetail.requirements.experience.map(
                                                                                (exp, index) => (
                                                                                    <li
                                                                                        key={index}
                                                                                        className="text-gray-400"
                                                                                    >
                                                                                        {exp}
                                                                                    </li>
                                                                                )
                                                                            )}
                                                                        </ul>
                                                                    </div>
                                                                )}

                                                            {jdDetail.requirements.education &&
                                                                jdDetail.requirements.education.length > 0 && (
                                                                    <div>
                                                                        <h4 className="font-medium text-gray-300 mb-3">
                                                                            Education
                                                                        </h4>
                                                                        <ul className="list-disc list-inside space-y-2">
                                                                            {jdDetail.requirements.education.map(
                                                                                (edu, index) => (
                                                                                    <li
                                                                                        key={index}
                                                                                        className="text-gray-400"
                                                                                    >
                                                                                        {edu}
                                                                                    </li>
                                                                                )
                                                                            )}
                                                                        </ul>
                                                                    </div>
                                                                )}

                                                            {jdDetail.requirements.projects &&
                                                                jdDetail.requirements.projects.length > 0 && (
                                                                    <div>
                                                                        <h4 className="font-medium text-gray-300 mb-3">
                                                                            Project Experience
                                                                        </h4>
                                                                        <ul className="list-disc list-inside space-y-2">
                                                                            {jdDetail.requirements.projects.map(
                                                                                (project, index) => (
                                                                                    <li
                                                                                        key={index}
                                                                                        className="text-gray-400"
                                                                                    >
                                                                                        {project}
                                                                                    </li>
                                                                                )
                                                                            )}
                                                                        </ul>
                                                                    </div>
                                                                )}

                                                            {jdDetail.requirements.languages &&
                                                                jdDetail.requirements.languages.length > 0 && (
                                                                    <div>
                                                                        <h4 className="font-medium text-gray-300 mb-3">
                                                                            Languages
                                                                        </h4>
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {jdDetail.requirements.languages.map(
                                                                                (language, index) => (
                                                                                    <Badge
                                                                                        key={index}
                                                                                        variant="secondary"
                                                                                        className="bg-purple-900/20 text-purple-400"
                                                                                    >
                                                                                        {language}
                                                                                    </Badge>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                            {jdDetail.requirements.certifications &&
                                                                jdDetail.requirements.certifications.length > 0 && (
                                                                    <div>
                                                                        <h4 className="font-medium text-gray-300 mb-3">
                                                                            Certifications
                                                                        </h4>
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {jdDetail.requirements.certifications.map(
                                                                                (cert, index) => (
                                                                                    <Badge
                                                                                        key={index}
                                                                                        variant="secondary"
                                                                                        className="bg-green-900/20 text-green-400"
                                                                                    >
                                                                                        {cert}
                                                                                    </Badge>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Benefits */}
                                                {jdDetail?.benefits && jdDetail.benefits.length > 0 && (
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-white mb-3">
                                                            Benefits & Perks
                                                        </h3>
                                                        <ul className="list-disc list-inside space-y-2">
                                                            {jdDetail.benefits.map((benefit, index) => (
                                                                <li key={index} className="text-gray-400">
                                                                    {benefit}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </ScrollArea>
                                    </TabsContent>

                                    <TabsContent value="testset" className="flex-1 flex flex-col m-0">
                                        <div className="p-6 border-b border-slate-700">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white">Test Sets</h3>
                                                    <p className="text-gray-400 text-sm">
                                                        Quizzes and coding problems linked to this job
                                                    </p>
                                                </div>
                                                <Button
                                                    onClick={handleAddTestset}
                                                    className="bg-blue-600 hover:bg-blue-700"
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Add Test Set
                                                </Button>
                                            </div>
                                        </div>

                                        <ScrollArea className="flex-1 p-6">
                                            {isTestSetLoading ? (
                                                <div className="text-center py-8 text-gray-400">
                                                    Loading test sets...
                                                </div>
                                            ) : (
                                                <div className="space-y-6">
                                                    {/* Quizzes Section */}
                                                    <div>
                                                        <h4 className="text-lg font-semibold text-white mb-4">
                                                            Quiz Problems
                                                        </h4>
                                                        {testSetDetail?.quizzes && testSetDetail.quizzes.length > 0 ? (
                                                            <div className="space-y-3">
                                                                {testSetDetail.quizzes.map((quiz) => (
                                                                    <Card
                                                                        key={quiz._id}
                                                                        className="bg-slate-800/50 border-slate-700"
                                                                    >
                                                                        <CardContent className="p-4">
                                                                            <div className="flex items-center justify-between">
                                                                                <div className="flex-1">
                                                                                    <h5 className="font-medium text-white mb-2">
                                                                                        {quiz.title}
                                                                                    </h5>
                                                                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                                                                        <div className="flex items-center gap-1">
                                                                                            <HelpCircle className="h-4 w-4" />
                                                                                            <span>
                                                                                                {quiz.questions
                                                                                                    ?.length || 0}{" "}
                                                                                                questions
                                                                                            </span>
                                                                                        </div>
                                                                                        <div className="flex items-center gap-1">
                                                                                            <Clock className="h-4 w-4" />
                                                                                            <span>
                                                                                                {quiz.duration || 0}{" "}
                                                                                                minutes
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                                                        {quiz.categories?.map(
                                                                                            (category, index) => (
                                                                                                <Badge
                                                                                                    key={index}
                                                                                                    variant="secondary"
                                                                                                    className="bg-blue-900/20 text-blue-400 text-xs"
                                                                                                >
                                                                                                    {category}
                                                                                                </Badge>
                                                                                            )
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    onClick={() =>
                                                                                        handleRemoveQuiz(quiz._id)
                                                                                    }
                                                                                    className="text-red-400 hover:text-red-300"
                                                                                >
                                                                                    <Trash2 className="h-4 w-4" />
                                                                                </Button>
                                                                            </div>
                                                                        </CardContent>
                                                                    </Card>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-8 text-gray-400">
                                                                <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                                                                <p>No quiz problems linked yet</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Code Problems Section */}
                                                    <div>
                                                        <h4 className="text-lg font-semibold text-white mb-4">
                                                            Code Problems
                                                        </h4>
                                                        {testSetDetail?.problems &&
                                                        testSetDetail.problems.length > 0 ? (
                                                            <div className="space-y-3">
                                                                {testSetDetail.problems.map((code) => (
                                                                    <Card
                                                                        key={code._id}
                                                                        className="bg-slate-800/50 border-slate-700"
                                                                    >
                                                                        <CardContent className="p-4">
                                                                            <div className="flex items-center justify-between">
                                                                                <div className="flex-1">
                                                                                    <div className="flex items-center gap-3 mb-2">
                                                                                        <h5 className="font-medium text-white">
                                                                                            {code.title}
                                                                                        </h5>
                                                                                        <Badge
                                                                                            variant="outline"
                                                                                            className={
                                                                                                code.difficulty ===
                                                                                                "Easy"
                                                                                                    ? "bg-green-900/20 text-green-400 border-green-500/30"
                                                                                                    : code.difficulty ===
                                                                                                        "Medium"
                                                                                                      ? "bg-yellow-900/20 text-yellow-400 border-yellow-500/30"
                                                                                                      : "bg-red-900/20 text-red-400 border-red-500/30"
                                                                                            }
                                                                                        >
                                                                                            {code.difficulty}
                                                                                        </Badge>
                                                                                    </div>
                                                                                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                                                                                        <Code className="h-4 w-4" />
                                                                                        <span>
                                                                                            Problem #{code.problemId}
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="flex flex-wrap gap-1">
                                                                                        {code.topicTags?.map(
                                                                                            (tag, index) => (
                                                                                                <Badge
                                                                                                    key={index}
                                                                                                    variant="secondary"
                                                                                                    className="bg-purple-900/20 text-purple-400 text-xs"
                                                                                                >
                                                                                                    {tag}
                                                                                                </Badge>
                                                                                            )
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    onClick={() =>
                                                                                        handleRemoveCode(code._id)
                                                                                    }
                                                                                    className="text-red-400 hover:text-red-300"
                                                                                >
                                                                                    <Trash2 className="h-4 w-4" />
                                                                                </Button>
                                                                            </div>
                                                                        </CardContent>
                                                                    </Card>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-8 text-gray-400">
                                                                <Code className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                                                                <p>No code problems linked yet</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Empty State */}
                                                    {(!testSetDetail?.quizzes || testSetDetail.quizzes.length === 0) &&
                                                        (!testSetDetail?.problems ||
                                                            testSetDetail.problems.length === 0) && (
                                                            <div className="text-center py-12">
                                                                <div className="bg-slate-800/30 rounded-lg p-8">
                                                                    <div className="flex items-center justify-center mb-4">
                                                                        <div className="bg-blue-600/20 p-3 rounded-full">
                                                                            <Plus className="h-8 w-8 text-blue-400" />
                                                                        </div>
                                                                    </div>
                                                                    <h4 className="text-lg font-medium text-white mb-2">
                                                                        No test sets linked yet
                                                                    </h4>
                                                                    <p className="text-gray-400 mb-4">
                                                                        Add quizzes and coding problems to create
                                                                        assessments for this job
                                                                    </p>
                                                                    <Button
                                                                        onClick={handleAddTestset}
                                                                        className="bg-blue-600 hover:bg-blue-700"
                                                                    >
                                                                        <Plus className="h-4 w-4 mr-2" />
                                                                        Add Your First Test Set
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                </div>
                                            )}
                                        </ScrollArea>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    )}
                </div>
            </CustomDialog>
            <AddTestsetDialog
                isOpen={isAddTestsetOpen}
                onClose={() => setIsAddTestsetOpen(false)}
                jdId={jd?._id || ""}
            />
        </>
    );
}
