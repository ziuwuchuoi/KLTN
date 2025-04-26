import React from "react";
import { cn } from "../utils/general.utils";

interface CustomHeroSectionProps {
    title?: string;
    subtitle?: string;
    description?: string;
    align?: "left" | "center" | "right" | "justify";
    className?: string;
}

const CustomHeroSection = ({
    title = "Quantum Leap",
    subtitle = "Assessment Center",
    description = "Evaluate your skills, personality, and professional aptitude with our comprehensive quiz collection",
    align = "center",
    className,
}: CustomHeroSectionProps) => {
    const textAlignClass = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
        justify: "text-justify",
    }[align];

    const containerAlignClass = {
        left: "mx-0",
        center: "mx-auto",
        right: "ml-auto",
        justify: "mx-auto",
    }[align];

    return (
        <div className={cn("max-w-6xl", containerAlignClass, textAlignClass, className)}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-sky-400">{title}</span>{" "}
                {subtitle}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">{description}</p>
        </div>
    );
};

export default CustomHeroSection;
