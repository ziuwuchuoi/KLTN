import { TbBriefcase, TbDeviceDesktop, TbEmpathize } from "react-icons/tb";
import { QuizCategoryItem } from "./QuizCategoryCard";
import { Award, Brain, Briefcase, Code, Target, Users } from "lucide-react";

export const quizCategories: QuizCategoryItem[] = [
    {
        _id: 1,
        title: "Technical IT",
        description: "Test your technical knowledge in programming, networking, cybersecurity, and more",
        icon: <Code className="w-5 h-5" />,
        quizCount: 12,
        color: "from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
        borderColor: "border-blue-500/30",
        route: "/quiz/technical",
        gradient: "from-blue-900/20 to-purple-900/20",
        iconColor: "text-blue-400",
        available: true,
    },
    {
        _id: 2,
        title: "Situational Cases",
        description: "Assess how you would handle real-world workplace scenarios and challenges",
        icon: <Target className="w-5 h-5" />,
        quizCount: 0,
        color: "from-amber-500 to-orange-500",
        borderColor: "border-orange-500/40",
        route: "/quiz/situational",
        gradient: "from-orange-600/10 to-amber-600/20",
        iconColor: "text-amber-600",
        available: false,
    },
    {
        _id: 3,
        title: "Personality Traits",
        description: "Discover your personality traits and how they align with different work environments",
        icon: <Award className="w-5 h-5" />,
        quizCount: 0,
        color: "from-amber-500 to-orange-500",
        borderColor: "border-orange-500/40",
        route: "/quiz/personality",
        gradient: "from-orange-600/10 to-amber-600/20",
        iconColor: "text-amber-600",
        available: false,
    },
];
