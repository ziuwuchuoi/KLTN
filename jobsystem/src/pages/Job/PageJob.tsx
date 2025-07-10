"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Sparkles, Target } from "lucide-react";
import { useJDQueries, useRecommendationQueries } from "../CVEvaluation/hooks/useFileQueries";
import { CustomTable } from "@/components/molecules/dashboard/CustomTable";
import { useAuthStore } from "@/stores/useAuthStore";
import CustomHeroSection from "@/components/molecules/CustomHeroSection";
import { CustomPagination } from "@/components/molecules/CustomPagination";
import { getJobColumns } from "@/components/molecules/dashboard/columns";
import { JobRecommendCard } from "./JobRecommendCard";
import { JobRecommendCarousel } from "./JobRecommendCarousel";
import { RecommendedJDItem } from "@/services/file.service";

const PageJDs = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [locationFilter, setLocationFilter] = useState("");

    // Get public jd listings (no userId means public JDs)
    const { jds, pagination, isJDDataLoading } = useJDQueries(undefined, currentPage, 10);
    const { recommendedJobs } = useRecommendationQueries(user._id, currentPage, 7);

    const refinedRecommendedJDs = recommendedJobs?.map((item) => ({
        ...item.values,
        _id: item.id,
    }));

    const filteredJDs = jds.filter((jd) => {
        const matchesSearch =
            jd.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            jd.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            jd.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesLocation = !locationFilter || jd.location.toLowerCase().includes(locationFilter.toLowerCase());

        return matchesSearch && matchesLocation;
    });

    // const dataToDisplay = refinedRecommendedJDs?.length > 0 ? refinedRecommendedJDs : filteredJDs;

    const handleJDClick = (jd) => {
        navigate(`/jobs/${jd._id}`);
    };

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    return (
        <div className="flex flex-col w-full">
            {/* Hero Section */}
            <div className="flex flex-col items-center justify-center px-6">
                <div className="flex flex-col items-center justify-center w-full max-w-7xl mt-40">
                    {/* Hero Title */}
                    <CustomHeroSection
                        title="Job Seeking"
                        subtitle="Studio"
                        align="center"
                        description="Explore curated job opportunities that match your skills and interests. Find the right role and take the next step in your career."
                    />

                    {/* Recommended Jobs Section */}
                    {user && refinedRecommendedJDs && refinedRecommendedJDs.length > 0 && (
                        <div className="w-full px-6 mt-12">
                            <div className="max-w-7xl mx-auto">
                                <div className="text-center mb-12">
                                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-400 px-4 py-2 rounded-full mb-4 border border-purple-500/30">
                                        <Sparkles className="w-4 h-4" />
                                        Personalized Recommendations
                                    </div>
                                    <h2 className="text-3xl font-bold text-white mb-4">Recommended for You</h2>
                                    <p className="text-slate-300 max-w-2xl mx-auto">
                                        Based on your profile and preferences, we've curated these job opportunities
                                        that match your skills and career goals.
                                    </p>
                                </div>

                                <JobRecommendCarousel jobs={refinedRecommendedJDs} onJobClick={handleJDClick} />

                                <div className="text-center mt-8">
                                    <Button
                                        variant="outline"
                                        className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 bg-transparent"
                                        onClick={() => {
                                            // Scroll to all jobs section
                                            document
                                                .getElementById("all-jobs-section")
                                                ?.scrollIntoView({ behavior: "smooth" });
                                        }}
                                    >
                                        <Target className="w-4 h-4 mr-2" />
                                        View All Jobs
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Search Section */}
                    <div className="w-full mt-5">
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardContent className="p-2">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                        <Input
                                            placeholder="JD title, keywords, or company"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-12 bg-slate-700 border-slate-600 text-white h-12"
                                        />
                                    </div>
                                    <div className="relative flex-1">
                                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                        <Input
                                            placeholder="City, state, or remote"
                                            value={locationFilter}
                                            onChange={(e) => setLocationFilter(e.target.value)}
                                            className="pl-12 bg-slate-700 border-slate-600 text-white h-12"
                                        />
                                    </div>
                                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-12 px-8">
                                        Search JDs
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* JDs Section */}
            <div id="all-jobs-section" className="w-full flex flex-col px-6 pt-4 pb-16">
                <div className="max-w-7xl mx-auto w-full">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            {refinedRecommendedJDs && refinedRecommendedJDs.length > 0
                                ? "All Job Opportunities"
                                : "Latest Job Opportunities"}
                        </h2>
                        <p className="text-slate-300">
                            {refinedRecommendedJDs && refinedRecommendedJDs.length > 0
                                ? "Browse through all available positions or use the search filters to find specific roles"
                                : "Discover your next career move from our curated job listings"}
                        </p>
                    </div>

                    {/* JD Listings Table */}
                    <CustomTable
                        data={filteredJDs}
                        columns={getJobColumns(handleJDClick, truncateText)}
                        isLoading={isJDDataLoading}
                        loadingMessage="Loading JDs..."
                        onRowClick={handleJDClick}
                        expandable={false}
                        expandedContent={(jd) => (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-white">JD Details</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Company:</span>
                                                <span className="text-slate-300">{jd.companyName}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Location:</span>
                                                <span className="text-slate-300">{jd.location}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Visibility:</span>
                                                <Badge variant="outline" className="text-xs">
                                                    {jd.visibility}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-white">All Benefits</h4>
                                        <div className="flex flex-wrap gap-1">
                                            {jd.benefits.map((benefit, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="secondary"
                                                    className="text-xs bg-slate-700 text-slate-300"
                                                >
                                                    {benefit}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-white">Description</h4>
                                    <p className="text-slate-300 text-sm leading-relaxed">{jd.description}</p>
                                </div>
                                <div className="flex gap-2 pt-2 border-t border-slate-700">
                                    <Button
                                        size="sm"
                                        onClick={() => handleJDClick(jd)}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        View Full Details & Apply
                                    </Button>
                                </div>
                            </div>
                        )}
                        className="bg-slate-800/50 border-slate-700 p-2"
                        emptyMessage="No JDs found matching your criteria"
                    />
                    {/* Pagination */}
                    {!searchQuery && filteredJDs.length > 0 && (
                        <div className="flex items-center justify-between mt-8">
                            <div className="text-sm text-slate-400">
                                Showing {(currentPage - 1) * pagination.limit + 1} to{" "}
                                {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} jobs
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
                </div>
            </div>
        </div>
    );
};

export default PageJDs;
