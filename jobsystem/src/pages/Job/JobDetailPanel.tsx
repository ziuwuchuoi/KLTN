"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { JobDetailHeader } from "./JobDetailHeader";
import { JobDetailContent } from "./JobDetailContent";
import type { JDDetail } from "@/services/file.service";
import JobApplyBanner from "./JobApplyBanner";

interface JobDetailPanelProps {
    job: JDDetail | null;
    isLoading: boolean;
    onApplyClick: () => void;
    onReviewClick: () => void;
    userId: string;
}

export function JobDetailPanel({ job, isLoading, onApplyClick, onReviewClick, userId }: JobDetailPanelProps) {
    return (
        <Card className="h-full bg-slate-800/50 border-slate-700 flex flex-col">
            {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-pulse text-center">
                        <div className="h-8 bg-slate-700 rounded w-64 mb-4 mx-auto"></div>
                        <div className="h-4 bg-slate-700 rounded w-48 mx-auto"></div>
                    </div>
                </div>
            ) : !job ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h3 className="text-xl font-semibold mb-2 text-white">Select a job to view details</h3>
                        <p className="text-slate-400">Choose a job from the list to see full information</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Fixed Header - approximately 120px */}
                    <div className="flex-shrink-0">
                        <JobDetailHeader job={job} onApplyClick={onApplyClick} />
                    </div>

                    {/* Scrollable Content with Fixed Height */}
                    <div className="flex-1 overflow-hidden">
                        <ScrollArea className="h-[calc(100vh-440px)]">
                            <JobDetailContent job={job} />
                        </ScrollArea>
                    </div>

                    {/* Fixed Footer Banner - approximately 100px */}
                    <div className="p-4 space-y-2">
                        <JobApplyBanner
                            title="Ready to Apply?"
                            description="Submit your application with your best CV and get noticed by"
                            companyName={job.companyName}
                            buttonLabel="Apply Now"
                            onClick={onApplyClick}
                        />

                        <JobApplyBanner
                            title="Want a Free CV Review?"
                            description="Get feedback and improve your chances before applying."
                            buttonLabel="Review My CV"
                            onClick={onReviewClick}
                            variant="review"
                        />
                    </div>
                </>
            )}
        </Card>
    );
}
