import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useCodeQueries } from "./hooks/useCodeQueries";
import { CustomTopicFilter } from "@/components/molecules/code/CustomTopicFilter";
import { CustomTable } from "@/components/molecules/dashboard/CustomTable";
import CustomHeroSection from "@/components/molecules/CustomHeroSection";

const difficultyColors = {
    Easy: "bg-green-500/20 text-green-400 border-green-500/30",
    Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Hard: "bg-red-500/20 text-red-400 border-red-500/30",
};

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

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
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
                    columns={[
                        {
                            header: "#",
                            cell: (problem) => <span className="font-medium text-slate-300">{problem.problemId}</span>,
                            className: "w-12",
                        },
                        {
                            header: "Title",
                            cell: (problem) => <div className="font-medium text-white">{problem.title}</div>,
                        },
                        {
                            header: "Difficulty",
                            cell: (problem) => (
                                <Badge variant="outline" className={difficultyColors[problem.difficulty]}>
                                    {problem.difficulty}
                                </Badge>
                            ),
                            className: "w-24",
                        },
                        {
                            header: "Topics",
                            cell: (problem) => (
                                <div className="flex flex-wrap gap-1">
                                    {problem.topicTags.slice(0, 3).map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="secondary"
                                            className="text-xs bg-slate-700 text-slate-300"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                    {problem.topicTags.length > 3 && (
                                        <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                                            +{problem.topicTags.length - 3}
                                        </Badge>
                                    )}
                                </div>
                            ),
                        },
                        {
                            header: "Actions",
                            cell: (problem) => (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleProblemClick(problem.problemId);
                                    }}
                                    className="text-blue-400 hover:text-blue-300"
                                >
                                    View
                                </Button>
                            ),
                            className: "w-20",
                        },
                    ]}
                    isLoading={isCodeProblemsLoading}
                    loadingMessage="Loading problems..."
                    onRowClick={handleProblemClick}
                    className="bg-slate-800/50 border-slate-700"
                />

                {/* Pagination */}
                <div className="flex items-center justify-between mt-8">
                    <div className="text-sm text-slate-400">
                        Showing {(currentPage - 1) * pagination.limit + 1} to{" "}
                        {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} problems
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="border-slate-700"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </Button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                const page = i + 1;
                                return (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handlePageChange(page)}
                                        className="w-8 h-8 p-0 border-slate-700"
                                    >
                                        {page}
                                    </Button>
                                );
                            })}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === pagination.totalPages}
                            className="border-slate-700"
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageLiveCoding;
