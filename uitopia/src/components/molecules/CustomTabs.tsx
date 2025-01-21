import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TooltipWrapper from "./helper/TooltipWrapper";
import { cn } from "../lib/general.utils";

interface CustomTabsProps {
    activeTab: string;
    setActiveTab: (value: string) => void;
    tabs: {
        value: string;
        label: React.ReactNode;
        icon?: React.ReactNode;
    }[];
    tooltipMessage?: string;
    className?: string;
    tabListClassName?: string;
    tabItemClassName?: string;
}

const CustomTabs = ({
    activeTab,
    setActiveTab,
    tabs,
    tooltipMessage,
    className,
    tabListClassName,
    tabItemClassName,
}: CustomTabsProps) => {
    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className={cn("flex select-none", className)}>
            <TabsList className={cn("flex w-full h-8 border bg-muted/40 border-border/50", tabListClassName)}>
                {tabs &&
                    tabs.map((tab) => (
                        <TooltipWrapper key={tab.value} tooltipMessage={tooltipMessage}>
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className={cn("py-0.5 text-sm", tabItemClassName)}
                            >
                                <div className="flex items-center">
                                    {tab.icon && <span>{tab.icon}</span>} {tab.label}
                                </div>
                            </TabsTrigger>
                        </TooltipWrapper>
                    ))}
            </TabsList>
        </Tabs>
    );
};

export default CustomTabs;
