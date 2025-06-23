"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useJDQueries, useRecommendationQueries } from "../CVEvaluation/hooks/useFileQueries";
import { useAuthStore } from "@/stores/useAuthStore";
import { DialogApplyJob } from "./dialogs/DialogApplyJob";
import { JobListPanel } from "./JobListPanel";
import { JobDetailPanel } from "./JobDetailPanel";
import type { JDItem } from "@/services/file.service";
import DialogReviewCV from "./dialogs/DialogReviewCV";

const PageJobDetail = () => {
    const params = useParams();
    const navigate = useNavigate();
    const jobId = params.jobId as string;
    const { user } = useAuthStore();

    const [selectedJobId, setSelectedJobId] = useState<string>(jobId || "");
    const [showApplyDialog, setShowApplyDialog] = useState(false);
    const [showReviewDialog, setShowReviewDialog] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 20;

    const { jds, isJDDataLoading, useJDDetail, pagination } = useJDQueries(undefined, currentPage, pageSize);
    const { recommendedJobs } = useRecommendationQueries(user._id);

    const refinedRecommendedJDs = recommendedJobs?.map((item) => ({
        ...item.values,
        _id: item.id,
    }));

    const { data: selectedJob, isLoading: isJobDetailLoading } = useJDDetail(selectedJobId);

    const dataToDisplay = refinedRecommendedJDs?.length > 0 ? refinedRecommendedJDs : jds;

    useEffect(() => {
        if (jobId && jobId !== selectedJobId) {
            setSelectedJobId(jobId);
        }
    }, [jobId, selectedJobId]);

    const handleJobSelect = (job: JDItem) => {
        setSelectedJobId(job._id);
        navigate(`/jobs/${job._id}`, { replace: true });
    };


    if (!jobId) {
        navigate("/jobs");
        return null;
    }

    return (
        <div className="flex flex-col w-full h-screen">
            {/* Main Content - Full Height */}
            <div className="flex-1 flex pt-20">
                <div className="flex-1 grid lg:grid-cols-5 gap-6 px-6 pb-6 h-full max-h-full">
                    {/* Left Panel - Job List */}
                    <div className="lg:col-span-2 flex flex-col h-full min-h-0">
                        <JobListPanel
                            jobs={dataToDisplay}
                            isLoading={isJDDataLoading}
                            selectedJobId={selectedJobId}
                            onJobSelect={handleJobSelect}
                            currentPage={currentPage}
                            totalPages={pagination?.totalPages || 1}
                            onPageChange={(newPage) => setCurrentPage(newPage)}
                        />
                    </div>

                    {/* Right Panel - Job Detail */}
                    <div className="lg:col-span-3 flex flex-col h-full min-h-0">
                         <JobDetailPanel
                            job={selectedJob}
                            isLoading={isJobDetailLoading}
                            onApplyClick={() => setShowApplyDialog(true)}
                            onReviewClick={() => setShowReviewDialog(true)} 
                            userId={user?._id || ""}
                        />
                    </div>
                </div>
            </div>

            {/* Apply Dialog */}
            {selectedJob && (
                <DialogApplyJob isOpen={showApplyDialog} onClose={() => setShowApplyDialog(false)} job={selectedJob} />
            )}

            {/* Review Dialog */}
            {selectedJob && (
                <DialogReviewCV
                    isOpen={showReviewDialog}
                    onClose={() => setShowReviewDialog(false)}
                    job={selectedJob}
                    userId={user?._id || ""}
                />
            )}
        </div>
    );
};

export default PageJobDetail;
