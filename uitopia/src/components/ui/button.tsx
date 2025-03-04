import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/components/general.utils";
import { TbLoader } from "react-icons/tb";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",

                secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
                secondaryAlt:
                    "bg-secondary/40 text-primary hover:text-primary font-normal shadow-sm border border-border hover:bg-secondary/80",

                destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
                destructiveGhost: "bg-secondary hover:bg-destructive shadow-sm hover:text-destructive-foreground",
                destructiveOutline:
                    "text-muted-foreground opacity-50 hover:opacity-100 border border-muted/75 hover:bg-destructive hover:text-destructive-foreground hover:text-white",

                outline: "border border-input shadow-sm hover:bg-accent hover:text-accent-foreground",

                dash: "border border-dashed border-input shadow-sm hover:bg-secondary/40 hover:text-accent-foreground",

                ghost: "hover:bg-accent hover:text-accent-foreground",

                link: "text-primary underline-offset-4 hover:underline",

                accent: "bg-indigo-500 dark:bg-indigo-600 text-white shado-sm hover:bg-indigo-600/90 dark:hover:bg-indigo-700",
                iconOnly: "flex w-fit h-fit px-0 m-0 bg-transparent hover:text-muted-foreground",
            },
            size: {
                // default: "h-9 px-4 py-2",
                default: "h-8 px-3 py-1.5",
                sm: "h-6 rounded-md px-2 text-xs font-normal",
                lg: "h-9 rounded-md px-6",
                icon: "h-9 w-9",
                fit: "p-1 h-fit",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    tooltipMessage?: string;
    tooltipDelay?: number;
    side?: "top" | "right" | "bottom" | "left";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant, size, className, asChild = false, tooltipMessage, tooltipDelay = 300, side, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";

        const buttonElement = (
            <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
        );

        if (tooltipMessage) {
            return (
                <Tooltip delayDuration={tooltipDelay}>
                    <TooltipTrigger asChild>{buttonElement}</TooltipTrigger>
                    <TooltipContent side={side}>
                        <p className="text-justify max-w-md mx-auto">{tooltipMessage}</p>
                    </TooltipContent>
                </Tooltip>
            );
        }

        return buttonElement;
    }
);
Button.displayName = "Button";

interface LoadingButtonProps extends ButtonProps {
    isLoading: boolean;
    loadingText?: string;
    icon?: React.ReactNode;
    iconClassName?: string;
}

// Convert LoadingButton to React.forwardRef because Button is already a forwardRef component
const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
    ({ isLoading, loadingText, icon, children, iconClassName, ...props }, ref) => {
        const isIconOnly = !loadingText;
        const content = (
            <>
                {isLoading ? (
                    <span className="flex items-center">
                        <TbLoader
                            className={cn("flex animate-spin icon-sm", isIconOnly ? "" : "mr-1.5", iconClassName)}
                        />
                        <span className="flex mt-0.5">{loadingText}</span>
                    </span>
                ) : (
                    <span className="flex items-center">
                        {icon && <span className="mr-1">{icon}</span>}
                        {children}
                    </span>
                )}
            </>
        );

        return (
            <Button {...props} ref={ref} disabled={isLoading || props.disabled}>
                {content}
            </Button>
        );
    }
);

LoadingButton.displayName = "LoadingButton";

export { Button, LoadingButton, buttonVariants };
