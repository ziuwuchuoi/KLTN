import React, { useRef, useEffect, useCallback, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { cn, ShowToast } from "@/components/utils/general.utils";
import { DocumentFormat, ImageFormat } from "@aws-sdk/client-bedrock-runtime";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TbFiles } from "react-icons/tb";
import { DialogTitle } from "@radix-ui/react-dialog";

export const allowedDocumentFormats: DocumentFormat[] = [
    "pdf",
    "csv",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "html",
    "txt",
    "md",
];
export const allowedImageFormats: ImageFormat[] = ["gif", "jpeg", "png", "webp"];

export const combinedAllowedFormats = [
    ...allowedDocumentFormats.map((format) => `.${format}`),
    ...allowedImageFormats.map((format) => `.${format}`),
].join(", ");

const BYTES_PER_MB = 1024 * 1024;
const DEFAULT_MAX_FILE_SIZE_MB = 25;
const DEFAULT_MAX_FILES = 10;

interface ImportFileProps {
    onSingleFileChange?: (file: File) => void;
    onMultipleFilesChange?: (files: File[]) => void;
    children: React.ReactNode;
    accept?: string | string[]; // Accept can be a string or array
    maxFileSizeMB?: number;
    className?: string;
    multiple?: boolean;
    maxFiles?: number;
    showDropIndicator?: boolean;
    dropTitle?: string;
    dropDescription?: string;
}

const CustomImportFile = ({
    onSingleFileChange,
    onMultipleFilesChange,
    children,
    accept = combinedAllowedFormats,
    maxFileSizeMB = DEFAULT_MAX_FILE_SIZE_MB,
    className,
    multiple = false,
    maxFiles = DEFAULT_MAX_FILES,
    showDropIndicator = true,
    dropTitle = "Drop files here",
    dropDescription = `Up to ${maxFiles} files (max ${maxFileSizeMB}MB each)`,
}: ImportFileProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const [showDropDialog, setShowDropDialog] = useState(false);
    const dragCounter = useRef(0);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    // Normalize accept prop to a string and compute allowed extensions
    const acceptString = Array.isArray(accept)
        ? accept.map((ext) => (ext.startsWith(".") ? ext : `.${ext}`)).join(",")
        : accept;
    const allowedExtensions = acceptString.split(",").map((ext) => ext.trim().toLowerCase());

    const processFiles = useCallback(
        (files: File[]) => {
            const maxFileSizeBytes = maxFileSizeMB * BYTES_PER_MB;

            if (multiple) {
                if (files.length > maxFiles) {
                    ShowToast(
                        toast,
                        "error",
                        `You have selected too many files. Please select up to ${maxFiles} files at a time.`
                    );
                    return;
                }

                const oversizedFiles = files.filter((file) => file.size > maxFileSizeBytes);
                if (oversizedFiles.length > 0) {
                    ShowToast(toast, "error", `Some files exceed ${maxFileSizeMB}MB`);
                    return;
                }

                onMultipleFilesChange?.(files);
            } else {
                const file = files[0];
                if (file) {
                    if (file.size > maxFileSizeBytes) {
                        ShowToast(toast, "error", `File size exceeds ${maxFileSizeMB}MB`);
                        return;
                    }
                    onSingleFileChange?.(file);
                }
            }
        },
        [maxFiles, maxFileSizeMB, multiple, onMultipleFilesChange, onSingleFileChange, toast]
    );

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = Array.from(e.target.files || []);

            // Check for invalid files
            const invalidFile = files.find((file) => {
                const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
                return !allowedExtensions.includes(fileExtension);
            });

            if (invalidFile) {
                const fileExtension = `.${invalidFile.name.split(".").pop()?.toLowerCase()}`;
                ShowToast(toast, "error", `${fileExtension.toUpperCase()} type is not allowed`);
                return;
            }

            processFiles(files);

            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        },
        [allowedExtensions, processFiles, toast]
    );

    const handlePaste = useCallback(
        (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            let hasFiles = false;
            const files: File[] = [];

            for (const item of Array.from(items)) {
                if (item.kind === "file") {
                    hasFiles = true;
                    const file = item.getAsFile();
                    if (file) {
                        const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
                        if (allowedExtensions.includes(fileExtension)) {
                            files.push(file);
                        } else {
                            ShowToast(toast, "error", `${fileExtension.toUpperCase()} is not allowed`);
                            return;
                        }
                    }
                }
            }

            if (hasFiles) {
                e.preventDefault();
                if (files.length > 0) {
                    processFiles(files);
                }
            }
        },
        [allowedExtensions, processFiles, toast]
    );

    const handleDragEnter = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const hasFiles = Array.from(e.dataTransfer?.items || []).some((item) => item.kind === "file");
        if (hasFiles) {
            dragCounter.current++;
            if (dragCounter.current === 1) {
                setShowDropDialog(true);
            }
        }
    }, []);

    const handleDragLeave = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current--;
        if (dragCounter.current === 0) {
            setShowDropDialog(false);
        }
    }, []);

    const handleDragOver = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback(
        (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setShowDropDialog(false);
            dragCounter.current = 0;
            const droppedFiles = Array.from(e.dataTransfer?.files || []);

            const invalidFile = droppedFiles.find((file) => {
                const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
                return !allowedExtensions.includes(fileExtension);
            });

            if (invalidFile) {
                const fileExtension = `.${invalidFile.name.split(".").pop()?.toLowerCase()}`;
                ShowToast(toast, "error", `${fileExtension.toUpperCase()} type is not allowed`);
                return;
            }

            processFiles(droppedFiles);
        },
        [allowedExtensions, processFiles, toast]
    );

    useEffect(() => {
        if (showDropIndicator) {
            document.addEventListener("dragenter", handleDragEnter);
            document.addEventListener("dragleave", handleDragLeave);
            document.addEventListener("dragover", handleDragOver);
            document.addEventListener("drop", handleDrop);
            document.addEventListener("paste", handlePaste);

            return () => {
                document.removeEventListener("dragenter", handleDragEnter);
                document.removeEventListener("dragleave", handleDragLeave);
                document.removeEventListener("dragover", handleDragOver);
                document.removeEventListener("drop", handleDrop);
                document.removeEventListener("paste", handlePaste);
            };
        }
    }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop, handlePaste, showDropIndicator]);

    return (
        <>
            <div className={cn(className)} onClick={handleClick}>
                {children}
            </div>
            <input
                ref={fileInputRef}
                type="file"
                accept={acceptString}
                onChange={handleChange}
                className="hidden"
                multiple={multiple}
            />
            <Dialog open={showDropDialog} onOpenChange={() => setShowDropDialog(false)}>
                <DialogTitle className="hidden"></DialogTitle>
                <DialogContent
                    showCloseButton={false}
                    className="w-screen h-screen min-w-full bg-primary-foreground/50"
                >
                    <div className="flex items-center justify-center">
                        <div className={cn("flex flex-col items-center justify-center")}>
                            <TbFiles className="size-24 text-primary my-6 stroke-1" />
                            {dropTitle && <div className="text-lg font-medium text-center">{dropTitle}</div>}
                            {dropDescription && <div className="text-sm text-gray-500 mt-2">{dropDescription}</div>}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CustomImportFile;
