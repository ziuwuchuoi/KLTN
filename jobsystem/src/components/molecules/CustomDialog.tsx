import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { cn } from "../utils/general.utils";

interface CustomDialogProps {
    children: React.ReactNode;
    dialogTitle?: React.ReactNode;
    description?: React.ReactNode;
    trigger?: React.ReactNode;
    className?: string;
    childrenContainerClassName?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    showCloseButton?: boolean;
    onClose?: () => void;
}

const CustomDialog = ({
    children,
    dialogTitle,
    description,
    trigger,
    className,
    childrenContainerClassName,
    open: controlledOpen,
    onOpenChange,
    showCloseButton = true,
    onClose,
}: CustomDialogProps) => {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

    // Use controlled state if provided, otherwise use internal state
    const isOpen = controlledOpen ?? uncontrolledOpen;
    const handleOpenChange = onOpenChange ?? setUncontrolledOpen;

    useEffect(() => {
        if (!isOpen && onClose) {
            onClose();
        }
    }, [isOpen, onClose]);

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent
                className={cn(
                    "flex flex-col rounded-lg shadow-xl",
                    "w-[90vw] xl:w-[60vw] h-[90vh] xl:h-[80vh] min-w-[700px] max-h-[825px]",
                    "outline-none focus:outline-none",
                    className
                )}
                onOpenAutoFocus={(e) => e.preventDefault()}
                showCloseButton={showCloseButton}
            >
                {dialogTitle && (
                    <DialogHeader className="text-white space-y-1">
                        <DialogTitle className="text-2xl font-semibold text-white">{dialogTitle}</DialogTitle>
                        {description && <div className="text-sm text-gray-300 leading-loose">{description}</div>}
                    </DialogHeader>
                )}
                {/* <div className="border-b border-border"></div> */}
                <div
                    className={cn(
                        "flex flex-col w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent",
                        childrenContainerClassName
                    )}
                >
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CustomDialog;
