"use client";

import { Button } from "@/components/ui/button";
import { CustomTable } from "@/components/molecules/dashboard/CustomTable";
import { useRecruiterQueries } from "./hooks/useUserQueries";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getRecruiterColumns, getRequestRecruiterColumns } from "@/components/molecules/dashboard/columns";
import type { Recruiter } from "@/services/recruiter.service";
import { DialogRecruiter } from "./dialogs/DialogRecruiter";

const TabRecruiter = () => {
    const [activeTab, setActiveTab] = useState("recruiters");
    const [selectedUser, setSelectedUser] = useState<Recruiter | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { recruiters, requestedRecruiters, isRecruiterLoading, grantRecruiter } = useRecruiterQueries();

    const handleRecruiterClick = (userId: string) => {
        const recruiter = recruiters?.find((r) => r.userId === userId);
        if (recruiter) {
            setSelectedUser(recruiter);
            setIsDialogOpen(true);
        }
    };

    const handleRequestRecruiterClick = (userId: string) => {
        const recruiter = requestedRecruiters?.find((r) => r.userId === userId);
        if (recruiter) {
            setSelectedUser(recruiter);
            setIsDialogOpen(true);
        }
    };

    const handleRoleUpdate = async (email: string) => {
        try {
            await grantRecruiter.mutateAsync(email);
            setIsDialogOpen(false);
            setSelectedUser(null);
        } catch (error) {
            console.error("Failed to update role:", error);
        }
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedUser(null);
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">Recruiters</h1>
                <Button variant="outline">Add Recruiter</Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="recruiters">Active Recruiters ({recruiters?.length || 0})</TabsTrigger>
                    <TabsTrigger value="requests">Recruiter Requests ({requestedRecruiters?.length || 0})</TabsTrigger>
                </TabsList>

                <TabsContent value="recruiters">
                    <CustomTable
                        columns={getRecruiterColumns(handleRecruiterClick)}
                        data={recruiters || []}
                        isLoading={isRecruiterLoading}
                        loadingMessage="Loading recruiters..."
                        emptyMessage="No active recruiters found"
                        className="bg-slate-800/50 border-slate-700"
                    />
                </TabsContent>

                <TabsContent value="requests">
                    <CustomTable
                        columns={getRequestRecruiterColumns(handleRequestRecruiterClick)}
                        data={requestedRecruiters || []}
                        isLoading={isRecruiterLoading}
                        loadingMessage="Loading recruiter requests..."
                        emptyMessage="No pending recruiter requests"
                        className="bg-slate-800/50 border-slate-700"
                    />
                </TabsContent>
            </Tabs>

            {/* User Detail Dialog */}
            <DialogRecruiter
                isOpen={isDialogOpen}
                onClose={handleCloseDialog}
                user={selectedUser}
                onRoleUpdate={handleRoleUpdate}
                isUpdating={grantRecruiter.isPending}
            />
        </div>
    );
};

export default TabRecruiter;
