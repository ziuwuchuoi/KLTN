"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { JDItem } from "@/services/file.service";
import { useJDQueries } from "@/pages/CVEvaluation/hooks/useFileQueries";
import { CustomTable } from "@/components/molecules/dashboard/CustomTable";
import { getJDColumns } from "@/components/molecules/dashboard/columns";
import { DialogCreateJD } from "./dialogs/DialogCreateJD";
import { DialogJD } from "./dialogs/DialogJD";
import { useAuthStore } from "@/stores/useAuthStore";
import { CustomPagination } from "@/components/molecules/CustomPagination";
import { FilterJD, type FilterJDs } from "./helpers/FilterJD";

const TabJobDescription = () => {
    const { user } = useAuthStore();
    const [selectedJD, setSelectedJD] = useState<JDItem | null>(null);
    const [isViewJDOpen, setIsViewJDOpen] = useState(false);
    const [isCreateJDOpen, setIsCreateJDOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<FilterJDs>({});

    const { jds, isJDDataLoading, pagination } = useJDQueries(user._id, currentPage, 20);

    console.log("jds", jds);

    // Filter job descriptions based on current filters
    const filteredJDs = useMemo(() => {
        if (!jds) return [];

        let filtered = [...jds];

        // Apply search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(
                (jd) =>
                    jd.title?.toLowerCase().includes(searchLower) ||
                    jd.companyName?.toLowerCase().includes(searchLower) ||
                    jd.position?.toLowerCase().includes(searchLower)
            );
        }

        // Apply title filter
        if (filters.title) {
            const titleLower = filters.title.toLowerCase();
            filtered = filtered.filter((jd) => jd.title?.toLowerCase().includes(titleLower));
        }

        // Apply visibility filter
        if (filters.visibility) {
            filtered = filtered.filter((jd) => jd.visibility === filters.visibility);
        }

        return filtered;
    }, [jds, filters]);

    const handleJDClick = (jdId: string) => {
        const jd = filteredJDs?.find((jd) => jd._id === jdId);
        if (jd) {
            setSelectedJD(jd);
            setIsViewJDOpen(true);
        }
    };

    const handleCreateJDClick = () => {
        setIsCreateJDOpen(true);
    };

    const handleCloseCreateJD = () => {
        setIsCreateJDOpen(false);
    };

    const handleCloseViewJD = () => {
        setIsViewJDOpen(false);
        setSelectedJD(null);
    };

    const handleFiltersChange = (newFilters: FilterJDs) => {
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
                    <h1 className="text-3xl font-bold text-white">Job Descriptions</h1>
                    <p className="text-gray-400 mt-1">Manage and track job descriptions</p>
                </div>
                <Button
                    variant="outline"
                    className="border-gray-700 hover:bg-gray-800 bg-transparent"
                    onClick={handleCreateJDClick}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add JD
                </Button>
            </div>

            {/* Filter Component */}
            <div className="mb-6">
                <FilterJD filters={filters} onFiltersChange={handleFiltersChange} onClearFilters={handleClearFilters} />
            </div>

            <CustomTable
                columns={getJDColumns(handleJDClick)}
                data={filteredJDs || []}
                isLoading={isJDDataLoading}
                loadingMessage="Loading job description..."
                emptyMessage="No active jds found"
                className="bg-slate-800/50 border-slate-700"
            />

            {pagination.total > 0 && (
                <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-slate-400">
                        Showing {filteredJDs.length} of {pagination.total} Job descriptions
                        {Object.keys(filters).length > 0 && " (filtered)"}
                    </div>
                    <div>
                        <CustomPagination
                            currentPage={currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={(newPage) => setCurrentPage(newPage)}
                        />
                    </div>
                </div>
            )}

            <DialogCreateJD isOpen={isCreateJDOpen} onClose={handleCloseCreateJD} />
            <DialogJD isOpen={isViewJDOpen} onClose={handleCloseViewJD} jd={selectedJD} />
        </div>
    );
};

export default TabJobDescription;
