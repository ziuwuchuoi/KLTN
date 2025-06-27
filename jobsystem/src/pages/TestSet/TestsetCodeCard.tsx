"use client";

import { Badge } from "@/components/ui/badge";
import { CodeProblem } from "@/services/code.service";

interface CodeItemCardProps {
    problem: Partial<CodeProblem>;
    index: number;
    onClick?: () => void;
    className?: string;
    showClickable?: boolean;
}

const TestsetCodeCard = ({ problem, index, onClick, className = "", showClickable = false }: CodeItemCardProps) => {
    return (
        <div
            className={`p-3 bg-slate-700/50 rounded-lg transition-colors ${
                showClickable && onClick ? "hover:bg-slate-600/50 cursor-pointer" : ""
            } ${className}`}
            onClick={onClick}
        >
            <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-white text-sm">
                    {index + 1}. {problem.title}
                </h4>
                <Badge
                    variant="outline"
                    className={
                        problem.difficulty === "Easy"
                            ? "bg-green-900/20 text-green-400 border-green-500/30"
                            : problem.difficulty === "Medium"
                              ? "bg-yellow-900/20 text-yellow-400 border-yellow-500/30"
                              : "bg-red-900/20 text-red-400 border-red-500/30"
                    }
                >
                    {problem.difficulty}
                </Badge>
            </div>
            <div className="text-xs text-gray-400 mb-2">Problem #{problem.problemId}</div>
            {problem.topicTags && problem.topicTags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {problem.topicTags.slice(0, 2).map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-purple-900/20 text-purple-400 text-xs">
                            {tag}
                        </Badge>
                    ))}
                    {problem.topicTags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                            +{problem.topicTags.length - 2}
                        </Badge>
                    )}
                </div>
            )}
        </div>
    );
};

export default TestsetCodeCard;
