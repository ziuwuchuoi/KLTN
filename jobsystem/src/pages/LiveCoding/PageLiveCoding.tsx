import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useCodeQueries } from "./hooks/useCodeQueries";
import { CustomTopicFilter } from "@/components/molecules/code/CustomTopicFilter";
import { CustomTable } from "@/components/molecules/dashboard/CustomTable";
import CustomHeroSection from "@/components/molecules/CustomHeroSection";
import { CustomPagination } from "@/components/molecules/CustomPagination";
import { difficultyColors, getCodeProblemColumns } from "@/components/molecules/dashboard/columns";

const PageLiveCoding = () => {
    const navigate = useNavigate();
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedDifficulty, setSelectedDifficulty] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const { codeProblems, pagination, isCodeProblemsLoading, tags, isTagsLoading } = useCodeQueries(
        selectedTags.join(","),
        selectedDifficulty === "All" ? "" : selectedDifficulty,
        currentPage,
        20
    );

    const filteredProblems = codeProblems.filter(
        (problem) =>
            problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            problem.problemId.toString().includes(searchQuery)
    );

    const handleProblemClick = (problemId) => {
        navigate(`/live-coding/${problemId}`);
    };

    return (
        <div className="flex flex-col p-6 w-full">
            {/* Fixed Section */}
            <div className="flex flex-row items-end w-full mt-40 mb-5 justify-around">
                <CustomHeroSection title="Coding" subtitle="Center" align="center" />
            </div>

            {/* Problems Section */}
            <div className="max-w-7xl mx-auto w-full">
                {/* Filters and Search */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder="Search questions"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-slate-800 border-slate-700"
                        />
                    </div>

                    <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                        <SelectTrigger className="w-full sm:w-[180px] bg-slate-800 border-slate-700">
                            <SelectValue placeholder="Difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Difficulties</SelectItem>
                            <SelectItem value="Easy">Easy</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="flex justify-center">
                        <CustomTopicFilter
                            availableTags={tags}
                            selectedTags={selectedTags}
                            onTagsChange={setSelectedTags}
                            isLoading={isTagsLoading}
                        />
                    </div>
                </div>

                {/* Problems Table */}
                <CustomTable
                    data={filteredProblems}
                    columns={getCodeProblemColumns(handleProblemClick)}
                    isLoading={isCodeProblemsLoading}
                    loadingMessage="Loading problems..."
                    onRowClick={handleProblemClick}
                    className="bg-slate-800/50 border-slate-700"
                />

                {/* Pagination */}
                <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-400">
                        Showing {(currentPage - 1) * pagination.limit + 1} to{" "}
                        {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} problems
                    </div>
                    <div>
                        <CustomPagination
                            currentPage={currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={(newPage) => setCurrentPage(newPage)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageLiveCoding;
