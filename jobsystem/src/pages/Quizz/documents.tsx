import { TbBriefcase, TbDeviceDesktop, TbEmpathize } from "react-icons/tb";
import { QuizCategoryItem } from "./QuizCategoryCard";

export const quizCategories: QuizCategoryItem[] = [
    {
        _id: "technical-it",
        title: "Technical IT",
        description: "Test your technical knowledge in programming, networking, cybersecurity, and more",
        icon: <TbDeviceDesktop className="icon-sm text-blue-400" />,
        quizCount: 12,
        color: "from-blue-600/20 to-blue-400/20",
        borderColor: "hover:border-blue-400",
        route: "/quiz/technical",
    },
    {
        _id: "case",
        title: "Situational Cases (Coming soon)",
        description: "Assess how you would handle real-world workplace scenarios and challenges",
        icon: <TbBriefcase className="icon-sm text-purple-400" />,
        quizCount: 8,
        color: "from-purple-600/20 to-purple-400/20",
        borderColor: "hover:border-purple-400",
        route: "/quiz/case",
    },
    {
        _id: "personality",
        title: "Personality & MBTI (Coming soon)",
        description: "Discover your personality type, work preferences, and character traits",
        icon: <TbEmpathize className="icon-sm text-amber-400" />,
        quizCount: 6,
        color: "from-amber-600/20 to-amber-400/20",
        borderColor: "hover:border-amber-400",
        route: "/quiz/personality",
    },
];
