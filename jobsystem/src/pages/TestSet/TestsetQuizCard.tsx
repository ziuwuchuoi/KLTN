"use client";

import { Badge } from "@/components/ui/badge";
import { QuizItem } from "@/services/quiz.service";

interface QuizItemCardProps {
    quiz: Partial<QuizItem>;
    index: number;
    onClick?: () => void;
    className?: string;
    showClickable?: boolean;
}

const TestsetQuizCard = ({ quiz, index, onClick, className = "", showClickable = false }: QuizItemCardProps) => {
    return (
        <div
            className={`p-3 bg-slate-700/50 rounded-lg transition-colors ${
                showClickable && onClick ? "hover:bg-slate-600/50 cursor-pointer" : ""
            } ${className}`}
            onClick={onClick}
        >
            <h4 className="font-medium text-white text-sm mb-1">
                {index + 1}. {quiz.title}
            </h4>
            <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>{quiz.questions?.length || 0} questions</span>
                <span>{quiz.duration || 0} min</span>
            </div>
            {quiz.categories && quiz.categories.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                    {quiz.categories.slice(0, 2).map((category, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-blue-900/20 text-blue-400 text-xs">
                            {category}
                        </Badge>
                    ))}
                    {quiz.categories.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                            +{quiz.categories.length - 2}
                        </Badge>
                    )}
                </div>
            )}
        </div>
    );
};

export default TestsetQuizCard;
