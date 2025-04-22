import React from "react";
import { Button } from "@/components/ui/button";
import { quizCategories } from "./documents";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IconType } from "react-icons/lib";
export interface QuizItem {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    additionalNote?: string;
    quizCount?: number;
    color: string;
    borderColor: string;
    route: string;
    group?: string;
}

const QuizCategoriesList = () => {
    return (
        <div className="w-full max-w-8xl max-h-xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-3 md:grid-cols-3 gap-6">
                {quizCategories.map((item) => (
                    <QuizCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};

interface QuizCardProps {
    item: QuizItem;
}

export const QuizCard = ({ item }: QuizCardProps) => {
    const navigate = useNavigate();

    return (
        <Card
            key={item.id}
            className={`group relative overflow-hidden bg-black/40 backdrop-blur-sm border border-zinc-800/50 ${
                item.borderColor
            } transition-all duration-300`}
        >
            <div
                className={`absolute inset-0 bg-gradient-to-br ${
                    item.color
                } opacity-10 group-hover:opacity-20 transition-opacity`}
            />

            <div className="relative p-6 flex flex-col h-full">
                <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-black/30 border border-white/10">{item.icon}</div>
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                        <p className="text-gray-400 text-sm">{item.description}</p>
                    </div>
                </div>

                <div className="mt-auto flex items-center justify-between">
                    <span className="text-xs text-gray-500">{item.quizCount} quizzes available</span>
                    <Button
                        onClick={() => navigate(item.route)}
                        variant="secondary"
                        className="bg-black/50 text-white hover:bg-white/10 text-xs"
                    >
                        Start Quiz <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default QuizCategoriesList;
