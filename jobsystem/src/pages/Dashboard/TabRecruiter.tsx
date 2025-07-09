"use client";

import { CustomTable } from "@/components/molecules/dashboard/CustomTable";
import { useRecruiterQueries } from "./hooks/useUserQueries";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getRecruiterColumns, getRequestRecruiterColumns } from "@/components/molecules/dashboard/columns";
import type { Recruiter } from "@/services/recruiter.service";
import { DialogRecruiter } from "./dialogs/DialogRecruiter";
import { CustomPagination } from "@/components/molecules/CustomPagination";

const TabRecruiter = () => {
    const [activeTab, setActiveTab] = useState("recruiters");
    const [selectedUser, setSelectedUser] = useState<Recruiter | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [activePage, setActivePage] = useState(1);
    const [requestPage, setRequestPage] = useState(1);
    const limit = 10;

    const {
        recruiters,
        requestedRecruiters,
        paginationRecruiters,
        paginationRequestedRecruiters,
        isActiveLoading,
        isRequestedLoading,
        grantRecruiter,
    } = useRecruiterQueries(activePage, requestPage, limit);

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
                <div>
                    <h1 className="text-3xl font-bold text-white">Recruiters</h1>
                    <p className="text-gray-400 mt-1">Manage and track recruiters</p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-800 border-slate-700">
                    <TabsTrigger
                        value="recruiters"
                        className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
                    >
                        Active Recruiters ({recruiters?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger
                        value="requests"
                        className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
                    >
                        Recruiter Requests ({requestedRecruiters?.length || 0})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="recruiters">
                    <CustomTable
                        columns={getRecruiterColumns(handleRecruiterClick)}
                        data={recruiters || []}
                        isLoading={isActiveLoading}
                        loadingMessage="Loading recruiters..."
                        emptyMessage="No active recruiters found"
                        className="bg-slate-800/50 border-slate-700"
                    />

                    {paginationRecruiters.total > 0 && (
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-slate-400">
                                Showing {(activePage - 1) * paginationRecruiters.limit + 1} to{" "}
                                {Math.min(activePage * paginationRecruiters.limit, paginationRecruiters.total)} of{" "}
                                {paginationRecruiters.total} Recruiters
                            </div>
                            <div>
                                <CustomPagination
                                    currentPage={activePage}
                                    totalPages={paginationRecruiters.totalPages}
                                    onPageChange={(newPage) => setActivePage(newPage)}
                                />
                            </div>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="requests">
                    <CustomTable
                        columns={getRequestRecruiterColumns(handleRequestRecruiterClick)}
                        data={requestedRecruiters || []}
                        isLoading={isRequestedLoading}
                        loadingMessage="Loading recruiter requests..."
                        emptyMessage="No pending recruiter requests"
                        className="bg-slate-800/50 border-slate-700"
                    />

                    {paginationRequestedRecruiters.total > 0 && (
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-slate-400">
                                Showing {(requestPage - 1) * paginationRequestedRecruiters.limit + 1} to{" "}
                                {Math.min(
                                    requestPage * paginationRequestedRecruiters.limit,
                                    paginationRequestedRecruiters.total
                                )}
                                of {paginationRequestedRecruiters.total} Requested recruiters
                            </div>
                            <div>
                                <CustomPagination
                                    currentPage={requestPage}
                                    totalPages={paginationRequestedRecruiters.totalPages}
                                    onPageChange={(newPage) => setRequestPage(newPage)}
                                />
                            </div>
                        </div>
                    )}
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
