import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ReactNode } from "react";
import { cn } from "@/components/lib/general.utils";

interface TooltipWrapperProps {
    children: React.ReactElement;
    tooltipMessage?: ReactNode;
    tooltipDisableMessage?: string;
    tooltipDelay?: number;
    disabled?: boolean;
    className?: string;
    tooltipClassName?: string;
    tooltipContainerClassName?: string;
    side?: "top" | "right" | "bottom" | "left";
}

const TooltipWrapper = ({
    children,
    tooltipMessage,
    tooltipDisableMessage,
    tooltipDelay = 300,
    disabled = false,
    className,
    tooltipClassName,
    tooltipContainerClassName,
    side,
}: TooltipWrapperProps) => {
    const tooltipText = disabled && tooltipDisableMessage ? tooltipDisableMessage : tooltipMessage;

    if (!tooltipText) {
        return children;
    }

    if (disabled) {
        return children;
    }

    return (
        <Tooltip delayDuration={tooltipDelay}>
            <TooltipTrigger asChild className={className}>
                {children}
            </TooltipTrigger>
            <TooltipContent side={side} className={cn("z-10", tooltipContainerClassName)}>
                <span className={cn("text-justify w-fit max-w-sm select-none whitespace-pre-wrap", tooltipClassName)}>
                    {tooltipText}
                </span>
            </TooltipContent>
        </Tooltip>
    );
};

export default TooltipWrapper;
