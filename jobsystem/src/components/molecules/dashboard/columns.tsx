import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApplicationStatus } from "@/services/file.service";
import { ArrowRight, Building2, MapPin } from "lucide-react";

export const difficultyColors = {
    Easy: "bg-green-500/20 text-green-400 border-green-500/30",
    Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Hard: "bg-red-500/20 text-red-400 border-red-500/30",
};

export const statusColors = {
    pending: "bg-yellow-900/20 text-yellow-400 border-yellow-500/30",
    shortlisted: "bg-blue-900/20 text-blue-400 border-blue-500/30",
    rejected: "bg-red-900/20 text-red-400 border-red-500/30",
    accepted: "bg-green-900/20 text-green-400 border-green-500/30",
};

export const getCodeProblemColumns = (handleProblemClick: (id: string) => void) => [
    {
        header: "#",
        cell: (problem) => <div className="font-medium text-slate-300">{problem.problemId}</div>,
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
                {problem?.topicTags?.slice(0, 3).map((tag) => (
                    <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs bg-slate-700 text-slate-300 hover:text-slate-900"
                    >
                        {tag}
                    </Badge>
                ))}
                {problem?.topicTags?.length > 3 && (
                    <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300 hover:text-slate-900">
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
                    handleProblemClick(problem._id);
                }}
                className="text-blue-400 hover:text-blue-300"
            >
                View Details
            </Button>
        ),
        className: "w-20",
    },
];

export const getCandidateColumns = (handleCandidateClick: (userId: string) => void) => [
    {
        header: "#",
        cell: (item) => (
            <Avatar>
                <AvatarImage src={item.user.avatar} alt={item.user.name} />
                <AvatarFallback>{item.user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
        ),
    },
    {
        header: "Name",
        cell: (item) => <div className="font-medium text-white">{item.user.name}</div>,
    },
    {
        header: "Email",
        cell: (item) => <div className="text-slate-300">{item.user.email}</div>,
    },
    {
        header: "Role",
        cell: (item) => (
            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                {item.user.roles?.includes("candidate") ? "Candidate" : "User"}
            </Badge>
        ),
        className: "w-28",
    },
    {
        header: "CV",
        cell: (item) => (
            <Badge
                variant="secondary"
                className={`text-xs ${item.cvId ? "bg-green-700 text-green-300" : "bg-gray-700 text-gray-300"}`}
            >
                {item.cvId ? item.cvId : "None"}
            </Badge>
        ),
        className: "w-24",
    },
    {
        header: "Applied Jobs",
        cell: (item) => (
            <div className="text-slate-300">{item.appliedJobIds?.length > 0 ? item.appliedJobIds.join(", ") : "-"}</div>
        ),
    },
    {
        header: "Actions",
        cell: (item) => (
            <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                    e.stopPropagation();
                    handleCandidateClick(item.userId);
                }}
                className="text-blue-400 hover:text-blue-300"
            >
                View Details
            </Button>
        ),
        className: "w-20",
    },
];

export const getRecruiterColumns = (handleRecruiterClick: (userId: string) => void) => [
    {
        header: "#",
        cell: (item) => (
            <Avatar>
                <AvatarImage src={item.user.avatar} alt={item.user.name} />
                <AvatarFallback>{item.user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
        ),
    },
    {
        header: "Name",
        cell: (item) => <div className="font-medium text-white">{item.user.name}</div>,
    },
    {
        header: "Email",
        cell: (item) => <div className="text-slate-300">{item.user.email}</div>,
    },
    {
        header: "Role",
        cell: (item) => (
            <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                {item.user.roles?.includes("recruiter") ? "Recruiter" : "User"}
            </Badge>
        ),
        className: "w-28",
    },
    {
        header: "JD",
        cell: (item) => (
            <Badge
                variant="secondary"
                className={`text-xs ${item.cvId ? "bg-green-700 text-green-300" : "bg-gray-700 text-gray-300"}`}
            >
                {item.cvId ? "Available" : "None"}
            </Badge>
        ),
        className: "w-24",
    },
    {
        header: "Actions",
        cell: (item) => (
            <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                    e.stopPropagation();
                    handleRecruiterClick(item.userId);
                }}
                className="text-blue-400 hover:text-blue-300"
            >
                View Details
            </Button>
        ),
        className: "w-20",
    },
];

export const getRequestRecruiterColumns = (handleRequestRecruiterClick: (userId: string) => void) => [
    {
        header: "#",
        cell: (item) => (
            <Avatar>
                <AvatarImage src={item.user.avatar} alt={item.user.name} />
                <AvatarFallback>{item.user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
        ),
        className: "w-[80px]",
    },
    {
        header: "Name",
        cell: (item) => <div className="font-medium text-white">{item.user.name}</div>,
    },
    {
        header: "Email",
        cell: (item) => <div className="text-slate-300">{item.user.email}</div>,
    },
    {
        header: "Role",
        cell: (item) => (
            <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                {item.user.roles?.includes("recruiter") ? "Request" : "User"}
            </Badge>
        ),
        className: "w-28",
    },
    {
        header: "Applied Jobs",
        cell: (item) => (
            <div className="text-slate-300">{item.appliedJobIds?.length > 0 ? item.appliedJobIds.join(", ") : "-"}</div>
        ),
    },
    {
        header: "Actions",
        cell: (item) => (
            <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                    e.stopPropagation();
                    handleRequestRecruiterClick(item.userId);
                }}
                className="text-blue-400 hover:text-blue-300"
            >
                View Details
            </Button>
        ),
        className: "w-24 text-right",
    },
];

export const getJDColumns = (handleJDClick: (id: string) => void) => [
    {
        header: "#",
        cell: (jd) => <div className="font-medium text-slate-300 truncate">{jd._id}</div>,
        className: "max-w-30",
    },
    {
        header: "Title",
        cell: (jd) => <div className="font-medium text-white truncate">{jd.title}</div>,
        className: "max-w-50",
    },
    {
        header: "Position",
        cell: (jd) => <div className="font-medium text-white">{jd.position}</div>,
    },
    {
        header: "Visibility",
        cell: (jd) => (
            <Badge variant="outline" className={`bg-blue-500/20 text-blue-400 border-blue-500/30`}>
                {jd.visibility == "public" ? "Public" : "Private"}
            </Badge>
        ),
        className: "w-28",
    },
    {
        header: "Actions",
        cell: (jd) => (
            <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                    e.stopPropagation();
                    handleJDClick(jd._id);
                }}
                className="text-blue-400 hover:text-blue-300"
            >
                View Details
            </Button>
        ),
        className: "w-20",
    },
];

export const getCVColumns = (handleCVClick: (id: string) => void) => [
    {
        header: "#",
        cell: (cv) => <div className="font-medium text-slate-300 truncate">{cv._id}</div>,
        className: "max-w-30",
    },
    {
        header: "File Name",
        cell: (cv) => <div className="font-medium text-white truncate">{cv.fileName}</div>,
        className: "max-w-50",
    },
    {
        header: "Position",
        cell: (cv) => <div className="font-medium text-white">{cv.position}</div>,
    },
    {
        header: "Actions",
        cell: (cv) => (
            <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                    e.stopPropagation();
                    handleCVClick(cv._id);
                }}
                className="text-blue-400 hover:text-blue-300"
            >
                View Details
            </Button>
        ),
        className: "w-20",
    },
];

export const getApplicantionColumns = (handleApplicantionClick: (id: string) => void) => [
    {
        header: "#",
        cell: (app) => <div className="font-medium text-slate-300 truncate">{app._id}</div>,
        className: "w-12",
    },
    {
        header: "Title",
        cell: (app) => <div className="font-medium text-white truncate">{app.title}</div>,
    },
    {
        header: "Description",
        cell: (app) => <div className="font-medium text-white truncate">{app.description}</div>,
        className: "w-24",
    },
    {
        header: "Position",
        cell: (app) => <div className="font-medium text-white">{app.position}</div>,
    },
    {
        header: "Status",
        cell: (app) => (
            <Badge variant="outline" className={statusColors[app.status as ApplicationStatus] || statusColors.pending}>
                {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
            </Badge>
        ),
        className: "w-28",
    },
    {
        header: "Applied Date",
        cell: (app) => <div className="text-slate-400 text-sm">{new Date(app.createdAt).toLocaleDateString()}</div>,
        className: "w-28",
    },
    {
        header: "Actions",
        cell: (app) => (
            <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                    e.stopPropagation();
                    handleApplicantionClick(app._id);
                }}
                className="text-blue-400 hover:text-blue-300"
            >
                View Details
            </Button>
        ),
        className: "w-20",
    },
];

export const getCodeColumns = (handleCodeClick: (id: string) => void) => [
    {
        header: "Title",
        cell: (code) => <div className="font-medium text-white truncate">{code.title}</div>,
    },
    {
        header: "Difficulty",
        cell: (code) => (
            <Badge variant="outline" className={difficultyColors[code.difficulty]}>
                {code.difficulty}
            </Badge>
        ),
        className: "w-24",
    },
    {
        header: "Topic Tags",
        cell: (code) => (
            <div className="flex flex-wrap gap-1">
                {code.topicTags?.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-purple-900/20 text-purple-400 text-xs">
                        {tag}
                    </Badge>
                ))}
                {code.topicTags?.length > 2 && (
                    <Badge variant="secondary" className="bg-gray-900/20 text-gray-400 text-xs">
                        +{code.topicTags.length - 2}
                    </Badge>
                )}
            </div>
        ),
        className: "w-48",
    },
    {
        header: "Problem ID",
        cell: (code) => <div className="font-mono text-slate-300 text-sm">{code.problemId}</div>,
        className: "w-24",
    },
    {
        header: "Actions",
        cell: (code) => (
            <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                    e.stopPropagation();
                    handleCodeClick(code._id);
                }}
                className="text-purple-400 hover:text-purple-300"
            >
                View Details
            </Button>
        ),
        className: "w-20",
    },
];

export const getQuizColumns = (handleQuizClick: (id: string) => void) => [
    {
        header: "Id",
        cell: (quiz) => <div className="font-medium text-slate-300">{quiz._id}</div>,
        className: "w-24",
    },
    {
        header: "Title",
        cell: (quiz) => <div className="font-medium text-white truncate">{quiz.title}</div>,
    },
    {
        header: "Categories",
        cell: (quiz) => (
            <div className="flex flex-wrap gap-1">
                {quiz.categories?.slice(0, 2).map((category, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-900/20 text-blue-400 text-xs">
                        {category}
                    </Badge>
                ))}
                {quiz.categories?.length > 2 && (
                    <Badge variant="secondary" className="bg-gray-900/20 text-gray-400 text-xs">
                        +{quiz.categories.length - 2}
                    </Badge>
                )}
            </div>
        ),
        className: "w-48",
    },
    {
        header: "Questions",
        cell: (quiz) => <div className="font-medium text-slate-300">{quiz.questions?.length || 0} questions</div>,
        className: "w-24",
    },
    {
        header: "Duration",
        cell: (quiz) => <div className="font-medium text-slate-300">{quiz.duration || 0} min</div>,
        className: "w-20",
    },
    {
        header: "Created",
        cell: (quiz) => <div className="text-slate-400 text-sm">{new Date(quiz.createdAt).toLocaleDateString()}</div>,
        className: "w-28",
    },
    {
        header: "Actions",
        cell: (quiz) => (
            <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                    e.stopPropagation();
                    handleQuizClick(quiz._id);
                }}
                className="text-blue-400 hover:text-blue-300"
            >
                View Details
            </Button>
        ),
        className: "w-20",
    },
];

export const getJobColumns = (handleJobClick: (id: string) => void, truncateText) => [
    {
        header: "JD Title",
        cell: (jd) => (
            <div className="space-y-1">
                <div className="font-semibold text-white">{jd.title}</div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Building2 className="w-4 h-4" />
                    {jd.companyName}
                </div>
            </div>
        ),
    },
    {
        header: "Location",
        cell: (jd) => (
            <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4" />
                {jd.location}
            </div>
        ),
        className: "w-48",
    },
    {
        header: "Description",
        cell: (jd) => <div className="text-slate-400 text-sm">{truncateText(jd.description, 120)}</div>,
    },
    {
        header: "Benefits",
        cell: (jd) => (
            <div className="flex flex-wrap gap-1">
                {jd.benefits.slice(0, 2).map((benefit, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                        {benefit}
                    </Badge>
                ))}
                {jd.benefits.length > 2 && (
                    <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                        +{jd.benefits.length - 2}
                    </Badge>
                )}
            </div>
        ),
        className: "w-48",
    },
    {
        header: "Actions",
        cell: (jd) => (
            <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                    e.stopPropagation();
                    handleJobClick(jd);
                }}
                className="text-blue-400 hover:text-blue-300"
            >
                View Details
                <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        ),
        className: "w-32",
    },
];
