import React from "react";
import { TbLock, TbWorld, TbCircleFilled } from "react-icons/tb";
import { cn } from "../utils/general.utils";

export type VisibilityMode = "private" | "public";

interface CustomVisibilityTabsProps {
    isSelected: VisibilityMode;
    onChange: (mode: VisibilityMode) => void;
    className?: string;
}

interface VisibilityOption {
    mode: VisibilityMode;
    icon: React.ReactNode;
    title: string;
    description: string;
    badgeVariant: string;
    disabled?: boolean;
}

const visibilityOptions: VisibilityOption[] = [
    {
        mode: "private",
        icon: <TbLock className="size-sm mr-1.5 text-muted-foreground" />,
        title: "Private",
        description:
            "Visible only to your internal team and selected collaborators. Keeps the job posting confidential.",
        badgeVariant: "red",
    },
    {
        mode: "public",
        icon: <TbWorld className="size-sm mr-1.5 text-muted-foreground" />,
        title: "Public",
        description: "Accessible to all job seekers. Maximizes reach and attracts a wider pool of candidates.",
        badgeVariant: "green",
    },
];

interface VisibilityCardProps {
    option: VisibilityOption;
    isSelected: boolean;
    onClick: () => void;
}

const VisibilityCard = ({ option, isSelected, onClick }: VisibilityCardProps) => {
    return (
        <div
            className={cn(
                "col-span-1 flex flex-col px-3 py-2 border border-border rounded-lg cursor-pointer select-none group relative",
                isSelected
                    ? "ring-[1.5px] ring-muted-foreground/75"
                    : "hover:ring-[1.5px] ring-muted-foreground/25 hover:border-transparent",
                !option.disabled && "cursor-pointer",
                option.disabled && "opacity-50 pointer-events-none"
            )}
            onClick={onClick}
        >
            <div className="flex items-center h-5">
                {/* Badge could go here if you want */}
                <div className="text-des text-primary font-medium">{option.title}</div>
                <div className="grow" />
            </div>
            <div className="flex flex-col space-y-2 mt-0.5 text-muted-foreground text-xs">
                <div>{option.description}</div>
            </div>
            <div className="absolute top-2 right-2 flex h-full justify-start">
                {isSelected ? (
                    <TbCircleFilled className="size-[18px] p-1 rounded-full text-primary bg-muted" />
                ) : (
                    <TbCircleFilled className="size-[16px] p-1 rounded-full text-transparent border border-muted group-hover:border-[1.5px] group-hover:border-muted-foreground/25" />
                )}
            </div>
        </div>
    );
};

const CustomVisibilityTabs = ({ isSelected, onChange, className }: CustomVisibilityTabsProps) => {
    return (
        <div className={cn("custom-visibility-tabs grid grid-cols-2 gap-4", className)}>
            {visibilityOptions.map((option) => (
                <VisibilityCard
                    key={option.mode}
                    option={option}
                    isSelected={isSelected === option.mode}
                    onClick={() => onChange(option.mode)}
                />
            ))}
        </div>
    );
};

export default CustomVisibilityTabs;
