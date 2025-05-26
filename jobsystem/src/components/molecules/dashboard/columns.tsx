import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const difficultyColors = {
    Easy: "bg-green-500/20 text-green-400 border-green-500/30",
    Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Hard: "bg-red-500/20 text-red-400 border-red-500/30",
};

export const getCodeProblemColumns = (handleProblemClick: (id: string) => void) => [
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
                        className="text-xs bg-slate-700 text-slate-300 hover:text-slate-900"
                    >
                        {tag}
                    </Badge>
                ))}
                {problem.topicTags.length > 3 && (
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
                    handleProblemClick(problem.problemId);
                }}
                className="text-blue-400 hover:text-blue-300"
            >
                View
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
        cell: (item) => <span className="font-medium text-white">{item.user.name}</span>,
    },
    {
        header: "Email",
        cell: (item) => <span className="text-slate-300">{item.user.email}</span>,
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
                View more
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
        cell: (item) => <span className="font-medium text-white">{item.user.name}</span>,
    },
    {
        header: "Email",
        cell: (item) => <span className="text-slate-300">{item.user.email}</span>,
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
                View more
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
        cell: (item) => <span className="font-medium text-white">{item.user.name}</span>,
    },
    {
        header: "Email",
        cell: (item) => <span className="text-slate-300">{item.user.email}</span>,
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
                View more
            </Button>
        ),
        className: "w-24 text-right",
    },
];

export const getJDColumns = (handleJDClick: (id: string) => void) => [];

export const getCVColumns = (handleCVClick: (id: string) => void) => [];

export const getApplicantionColumns = (handleApplicantionClick: (id: string) => void) => [];
