import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { ArrowLeft, MapPin, Building2, Search, Users, Clock, DollarSign, Star } from "lucide-react";
import { useJDQueries, useRecommendationQueries } from "../CVEvaluation/hooks/useFileQueries";
import { ApplyJobDialog } from "./dialogs/ApplyJobDialog";
import { useAuthStore } from "@/stores/useAuthStore";

const PageJobDetail = () => {
    const params = useParams();
    const navigate = useNavigate();
    const jobId = params.jobId as string;
    const { user } = useAuthStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedJobId, setSelectedJobId] = useState<string>(jobId || "");
    const [showApplyDialog, setShowApplyDialog] = useState(false);

    // Get public job listings for the left panel
    const { jds, isJDDataLoading, useJDDetail } = useJDQueries(undefined, 1, 50);

    const { recommendedJobs } = useRecommendationQueries(user._id);

    const refinedRecommendedJDs = recommendedJobs?.map((item) => ({
        ...item.values,
        _id: item.id,
    }));

    // Get selected job detail
    const { data: selectedJob, isLoading: isJobDetailLoading } = useJDDetail(selectedJobId);

    // Filter jobs for search
    const filteredJobs = jds.filter(
        (job) =>
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.companyName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Update selected job when URL changes
    useEffect(() => {
        if (jobId && jobId !== selectedJobId) {
            setSelectedJobId(jobId);
        }
    }, [jobId, selectedJobId]);

    const dataToDisplay = refinedRecommendedJDs?.length > 0 ? refinedRecommendedJDs : filteredJobs;

    const handleJobSelect = (job) => {
        setSelectedJobId(job._id);
        navigate(`/jobs/${job._id}`, { replace: true });
    };

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    if (!jobId) {
        navigate("/jobs");
        return null;
    }

    return (
        <div className="flex flex-col w-full">
            {/* Main Content - Full Height */}
            <div className="pt-20 h-screen flex">
                <div className="flex-1 grid lg:grid-cols-5 gap-6 px-6 pb-6 h-full">
                    {/* Left Panel - Job List */}
                    <div className="lg:col-span-2 flex flex-col h-full">
                        <Card className="flex-1 bg-slate-800/50 border-slate-700 flex flex-col">
                            <CardHeader className="pb-4">
                                <div className="space-y-4">
                                    <CardTitle className="text-lg text-white">Available Jobs</CardTitle>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                        <Input
                                            placeholder="Search jobs..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 bg-slate-700 border-slate-600 text-white"
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 p-0">
                                <ScrollArea className="h-[calc(100vh-280px)]">
                                    <div className="space-y-2 p-4">
                                        {isJDDataLoading ? (
                                            Array.from({ length: 10 }).map((_, i) => (
                                                <div key={i} className="p-4 bg-slate-700/50 rounded-lg animate-pulse">
                                                    <div className="h-4 bg-slate-600 rounded w-3/4 mb-2"></div>
                                                    <div className="h-3 bg-slate-600 rounded w-1/2 mb-2"></div>
                                                    <div className="h-3 bg-slate-600 rounded w-full"></div>
                                                </div>
                                            ))
                                        ) : filteredJobs.length === 0 ? (
                                            <div className="text-center py-8 text-slate-400">No jobs found</div>
                                        ) : (
                                            dataToDisplay.map((job) => (
                                                <div
                                                    key={job._id}
                                                    onClick={() => handleJobSelect(job)}
                                                    className={`p-4 rounded-lg cursor-pointer transition-colors border ${
                                                        selectedJobId === job._id
                                                            ? "bg-blue-600/20 border-blue-500/50"
                                                            : "bg-slate-700/30 border-slate-600 hover:bg-slate-700/50"
                                                    }`}
                                                >
                                                    <div className="space-y-2">
                                                        <h3 className="font-semibold text-white text-sm leading-tight">
                                                            {job.title}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                                            <Building2 className="w-3 h-3" />
                                                            {job.companyName}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                                            <MapPin className="w-3 h-3" />
                                                            {job.location}
                                                        </div>
                                                        <p className="text-xs text-slate-400 leading-relaxed">
                                                            {truncateText(job.description, 100)}
                                                        </p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {job.benefits.slice(0, 2).map((benefit, index) => (
                                                                <Badge
                                                                    key={index}
                                                                    variant="secondary"
                                                                    className="text-xs bg-slate-600 text-slate-300"
                                                                >
                                                                    {benefit}
                                                                </Badge>
                                                            ))}
                                                            {job.benefits.length > 2 && (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="text-xs bg-slate-600 text-slate-300"
                                                                >
                                                                    +{job.benefits.length - 2}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Panel - Job Detail */}
                    <div className="lg:col-span-3 flex flex-col h-full">
                        <Card className="flex-1 bg-slate-800/50 border-slate-700 flex flex-col">
                            {isJobDetailLoading ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="animate-pulse text-center">
                                        <div className="h-8 bg-slate-700 rounded w-64 mb-4 mx-auto"></div>
                                        <div className="h-4 bg-slate-700 rounded w-48 mx-auto"></div>
                                    </div>
                                </div>
                            ) : !selectedJob ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="text-center">
                                        <h3 className="text-xl font-semibold mb-2">Select a job to view details</h3>
                                        <p className="text-slate-400">
                                            Choose a job from the list to see full information
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <CardHeader className="border-b border-slate-700">
                                        <div className="space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-2">
                                                    <CardTitle className="text-2xl text-white">
                                                        {selectedJob.title}
                                                    </CardTitle>
                                                    <div className="flex items-center gap-4 text-slate-400">
                                                        <div className="flex items-center gap-2">
                                                            <Building2 className="w-4 h-4" />
                                                            {selectedJob.companyName}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4" />
                                                            {selectedJob.location}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    onClick={() => setShowApplyDialog(true)}
                                                    className="bg-blue-600 hover:bg-blue-700"
                                                >
                                                    Apply Now
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="flex-1 p-0 overflow-y-auto">
                                        <div className="p-6 space-y-6">
                                            {/* Job Description */}
                                            <div className="space-y-3">
                                                <h3 className="text-lg font-semibold text-white">Job Description</h3>
                                                <div className="prose prose-invert max-w-none">
                                                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                                                        {selectedJob.description}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Requirements */}
                                            {selectedJob.requirements && (
                                                <div className="space-y-3">
                                                    <h3 className="text-lg font-semibold text-white">Requirements</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {selectedJob.requirements.skills.length > 0 && (
                                                            <div>
                                                                <h4 className="font-medium text-slate-300 mb-2">
                                                                    Skills
                                                                </h4>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {selectedJob.requirements.skills.map(
                                                                        (skill, index) => (
                                                                            <Badge
                                                                                key={skill}
                                                                                variant="secondary"
                                                                                className="text-xs bg-slate-700 text-slate-300 hover:text-slate-900"
                                                                            >
                                                                                {skill}
                                                                            </Badge>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {selectedJob.requirements.experience.length > 0 && (
                                                            <div>
                                                                <h4 className="font-medium text-slate-300 mb-2">
                                                                    Experience
                                                                </h4>
                                                                <ul className="text-sm text-slate-400 space-y-1">
                                                                    {selectedJob.requirements.experience.map(
                                                                        (exp, index) => (
                                                                            <li key={index}>• {exp}</li>
                                                                        )
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        )}

                                                        {selectedJob.requirements.education.length > 0 && (
                                                            <div>
                                                                <h4 className="font-medium text-slate-300 mb-2">
                                                                    Education
                                                                </h4>
                                                                <ul className="text-sm text-slate-400 space-y-1">
                                                                    {selectedJob.requirements.education.map(
                                                                        (edu, index) => (
                                                                            <li key={index}>• {edu}</li>
                                                                        )
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        )}

                                                        {selectedJob.requirements.languages.length > 0 && (
                                                            <div>
                                                                <h4 className="font-medium text-slate-300 mb-2">
                                                                    Languages
                                                                </h4>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {selectedJob.requirements.languages.map(
                                                                        (lang, index) => (
                                                                            <Badge
                                                                                key={lang}
                                                                                variant="secondary"
                                                                                className="text-xs bg-slate-700 text-slate-300 hover:text-slate-900"
                                                                            >
                                                                                {lang}
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
                                            <div className="space-y-3">
                                                <h3 className="text-lg font-semibold text-white">Benefits & Perks</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    {selectedJob.benefits.map((benefit, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center gap-2 text-slate-300"
                                                        >
                                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                            {benefit}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Apply Section */}
                                            <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-white mb-2">
                                                            Ready to Apply?
                                                        </h3>
                                                        <p className="text-slate-300">
                                                            Submit your application with your best CV and get noticed by{" "}
                                                            {selectedJob.companyName}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        onClick={() => setShowApplyDialog(true)}
                                                        size="lg"
                                                        className="bg-blue-600 hover:bg-blue-700"
                                                    >
                                                        Apply Now
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </>
                            )}
                        </Card>
                    </div>
                </div>
            </div>

            {/* Apply Dialog */}
            {selectedJob && (
                <ApplyJobDialog isOpen={showApplyDialog} onClose={() => setShowApplyDialog(false)} job={selectedJob} />
            )}
        </div>
    );
};

export default PageJobDetail;
