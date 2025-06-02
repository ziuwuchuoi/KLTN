"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, MapPin, Calendar, CheckCircle, Plus, FileText } from "lucide-react";
import { useJDQueries } from "../hooks/useFileQueries";
import { JDInputForm } from "./JDInput";
import type { JDDetail } from "@/services/file.service";
import { FileItem } from "../items/FileItem";

interface JDSelectionStepProps {
    selectedJDId: string;
    onJDSelect: (jdId: string) => void;
    jdData: Partial<JDDetail>;
    onJDDataChange: (data: Partial<JDDetail>) => void;
    userId: string;
}

export function JDSelectionStep({ selectedJDId, onJDSelect, jdData, onJDDataChange, userId }: JDSelectionStepProps) {
    const [activeTab, setActiveTab] = useState("select");

    const { jds, isJDDataLoading, uploadJD } = useJDQueries(userId);

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        if (value === "create") {
            onJDSelect("");
        }
    };

    const handleJDSubmit = async () => {
        try {
            const newJD = await uploadJD.mutateAsync(jdData);
            setActiveTab("select");
            onJDSelect(newJD._id);
            onJDDataChange({
                title: "",
                description: "",
                companyName: "",
                location: "",
                requirements: {
                    experience: [],
                    skills: [],
                    education: [],
                    projects: [],
                    languages: [],
                    certifications: [],
                    summary: "",
                },
                benefits: [],
                visibility: "private",
            });
        } catch (error) {
            console.error("Failed to upload JD:", error);
        }
    };

    return (
        <div className="grid lg:grid-cols-3 gap-8 h-full">
            {/* Left Side - JD List */}
            <div className="lg:col-span-1">
                <Card className="bg-slate-800/50 border-slate-700 h-full">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-white">
                                <Building2 className="w-5 h-5 text-purple-400" />
                                Job Descriptions
                            </CardTitle>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setActiveTab("create")}
                                className="border-slate-600 text-slate-300 hover:text-white"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create New
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isJDDataLoading ? (
                            <div className="space-y-3">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="p-4 bg-slate-700/50 rounded-lg animate-pulse">
                                        <div className="h-4 bg-slate-600 rounded w-3/4 mb-2"></div>
                                        <div className="h-3 bg-slate-600 rounded w-1/2 mb-2"></div>
                                        <div className="h-3 bg-slate-600 rounded w-full"></div>
                                    </div>
                                ))}
                            </div>
                        ) : jds.length === 0 ? (
                            <div className="text-center py-8">
                                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                <h4 className="text-lg font-semibold text-white mb-2">No Job Descriptions</h4>
                                <p className="text-slate-400 mb-4">Create your first job description.</p>
                                <Button
                                    variant="outline"
                                    className="border-slate-600"
                                    onClick={() => setActiveTab("create")}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create JD
                                </Button>
                            </div>
                        ) : (
                            <ScrollArea className="h-[600px]">
                                <div className="space-y-3">
                                    {jds.map((jd) => (
                                        <FileItem
                                            key={jd._id}
                                            id={jd._id}
                                            title={jd.title}
                                            subtitle={jd.companyName}
                                            description={jd.location}
                                            selected={selectedJDId === jd._id}
                                            onSelect={() => {
                                                onJDSelect(jd._id);
                                                setActiveTab("select");
                                            }}
                                            colorScheme="purple"
                                            icon={<Building2 className="w-5 h-5 text-purple-400 flex-shrink-0" />}
                                            descriptionIcon={<MapPin className="w-3 h-3 flex-shrink-0" />}
                                        />
                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Right Side - Create/Edit Form */}
            <div className="lg:col-span-2">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-700 mb-4">
                        <TabsTrigger value="select">Selected JD</TabsTrigger>
                        <TabsTrigger value="create">Create New JD</TabsTrigger>
                    </TabsList>

                    <TabsContent value="select" className="mt-0 h-full">
                        {selectedJDId ? (
                            <Card className="bg-slate-800/50 border-slate-700 h-full">
                                <CardHeader>
                                    <CardTitle className="text-white">Selected Job Description</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-12">
                                        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            Job Description Selected
                                        </h3>
                                        <p className="text-slate-400">
                                            You can proceed to the next step or create a new JD.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="bg-slate-800/50 border-slate-700 h-full">
                                <CardContent className="flex items-center justify-center h-full">
                                    <div className="text-center py-12">
                                        <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-white mb-2">No JD Selected</h3>
                                        <p className="text-slate-400 mb-6">
                                            Select a job description from the list or create a new one.
                                        </p>
                                        <Button
                                            onClick={() => setActiveTab("create")}
                                            className="bg-purple-600 hover:bg-purple-700"
                                        >
                                            Create New JD
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="create" className="mt-0 h-full">
                        <JDInputForm jdData={jdData} onJDDataChange={onJDDataChange} onSubmit={handleJDSubmit} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
