"use client";

import { useState, useMemo } from "react";
import type { ApplicationDetail, ApplicationItem } from "@/services/file.service";
import { useApplicationQueries } from "../CVEvaluation/hooks/useFileQueries";
import { CustomTable } from "@/components/molecules/dashboard/CustomTable";
import { getApplicantionColumns } from "@/components/molecules/dashboard/columns";
import { DialogApplication } from "./dialogs/DialogApplication";
import { CustomPagination } from "@/components/molecules/CustomPagination";
import { FilterApplication, type FilterApplications } from "./helpers/FilterApplication";

const TabApplication = () => {
    const [selectedApplication, setSelectedApplication] = useState<ApplicationItem | null>(null);
    const [isViewApplicationOpen, setIsViewApplicationOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<FilterApplications>({});
    const limit = 20;

    const { applicationsForRecruiter, isApplicationForRecruiterDataLoading, paginationForRecruiter } =
        useApplicationQueries(null, null, limit, currentPage);

    console.log("appRec", applicationsForRecruiter);

    // Filter and sort applications based on current filters
    const filteredAndSortedApplications = useMemo(() => {
        if (!applicationsForRecruiter) return [];

        let filtered = [...applicationsForRecruiter];

        // Apply search filter
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(
                (app) =>
                    app.jd?.title?.toLowerCase().includes(searchTerm) ||
                    app.jd?.companyName?.toLowerCase().includes(searchTerm) ||
                    app.jd?.position?.toLowerCase().includes(searchTerm)
            );
        }

        // Apply status filter
        if (filters.status) {
            filtered = filtered.filter((app) => app.status === filters.status);
        }

        // Apply job title filter
        if (filters.jobTitle) {
            const jobTitleTerm = filters.jobTitle.toLowerCase();
            filtered = filtered.filter((app) => app.jd?.title?.toLowerCase().includes(jobTitleTerm));
        }

        // Apply overall score sorting
        if (filters.overallScoreSort) {
            filtered.sort((a, b) => {
                const scoreA = a.overallScore || 0;
                const scoreB = b.overallScore || 0;
                return filters.overallScoreSort === "desc" ? scoreB - scoreA : scoreA - scoreB;
            });
        }

        return filtered;
    }, [applicationsForRecruiter, filters]);

    // Calculate pagination for filtered results
    const filteredPagination = useMemo(() => {
        const total = filteredAndSortedApplications.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (currentPage - 1) * limit;
        const endIndex = startIndex + limit;
        const currentPageData = filteredAndSortedApplications.slice(startIndex, endIndex);

        return {
            total,
            totalPages,
            currentPage,
            limit,
            data: currentPageData,
        };
    }, [filteredAndSortedApplications, currentPage, limit]);

    const handleApplicationClick = async (applicationId: string) => {
        try {
            const application = applicationsForRecruiter?.find((app) => app._id === applicationId);
            if (application) {
                setSelectedApplication(application);
                setIsViewApplicationOpen(true);
            }
        } catch (error) {
            console.error("Failed to fetch application:", error);
        }
    };

    const handleApplicationUpdate = (updatedApplication: ApplicationDetail) => {
        if (selectedApplication && updatedApplication._id === selectedApplication._id) {
            const updatedItem: ApplicationItem = {
                ...selectedApplication,
                status: updatedApplication.status,
                updatedAt: new Date(updatedApplication.updatedAt),
            };
            setSelectedApplication(updatedItem);
        }
        console.log("Application updated:", updatedApplication);
    };

    const handleCloseViewApplication = () => {
        setIsViewApplicationOpen(false);
        setSelectedApplication(null);
    };

    const handleFiltersChange = (newFilters: FilterApplications) => {
        setFilters(newFilters);
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handleClearFilters = () => {
        setFilters({});
        setCurrentPage(1);
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Applications</h1>
                    <p className="text-gray-400 mt-1">Manage and track job applications</p>
                </div>
            </div>

            {/* Filter Component */}
            <div className="mb-6">
                <FilterApplication
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onClearFilters={handleClearFilters}
                />
            </div>

            <CustomTable
                columns={getApplicantionColumns(handleApplicationClick)}
                data={filteredPagination.data}
                isLoading={isApplicationForRecruiterDataLoading}
                loadingMessage="Loading applications..."
                emptyMessage={
                    Object.keys(filters).some((key) => filters[key as keyof FilterApplications])
                        ? "No applications match your filters"
                        : "No applications found"
                }
                className="bg-slate-800/50 border-slate-700"
            />

            {filteredPagination.total > 0 && (
                <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-slate-400">
                        Showing {(currentPage - 1) * limit + 1} to{" "}
                        {Math.min(currentPage * limit, filteredPagination.total)} of {filteredPagination.total}{" "}
                        Applications
                        {Object.keys(filters).some((key) => filters[key as keyof FilterApplications]) && (
                            <span className="text-purple-400">
                                {" "}
                                (filtered from {paginationForRecruiter.total} total)
                            </span>
                        )}
                    </div>
                    <div>
                        <CustomPagination
                            currentPage={currentPage}
                            totalPages={filteredPagination.totalPages}
                            onPageChange={(newPage) => setCurrentPage(newPage)}
                        />
                    </div>
                </div>
            )}

            <DialogApplication
                isOpen={isViewApplicationOpen}
                onClose={handleCloseViewApplication}
                application={selectedApplication}
                onUpdate={handleApplicationUpdate}
            />
        </div>
    );
};

export default TabApplication;
