"use client";

import { useToast } from "@/components/ui/use-toast";
import { ShowToast } from "@/components/utils/general.utils";
import type React from "react";
import { useRef } from "react";

interface CodeEditorProps {
    value: string;
    onChange: (value: string) => void;
    language: string;
    readOnly?: boolean;
}

export function CodeEditor({ value, onChange, language, readOnly = false }: CodeEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { toast } = useToast();
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (readOnly) return;

        if (e.key === "Tab") {
            e.preventDefault();
            const start = e.currentTarget.selectionStart;
            const end = e.currentTarget.selectionEnd;
            const newValue = value.substring(0, start) + "  " + value.substring(end);
            onChange(newValue);

            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
                }
            }, 0);
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        if (readOnly) {
            e.preventDefault();
            return;
        }

        e.preventDefault();
        ShowToast(toast, "error", "Paste feature is not allowed!");
    };

    const lineCount = value.split("\n").length;
    const lineNumberWidth = Math.max(2, lineCount.toString().length) * 8 + 24;

    return (
        <div className="h-full bg-slate-900 rounded-lg overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-300 capitalize">{language}</span>
                    <div className="w-1 h-4 bg-slate-600 rounded-full"></div>
                    <span className="text-xs text-slate-500">{lineCount} lines</span>
                    {readOnly && (
                        <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-1 rounded">Read Only</span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 relative overflow-hidden">
                {/* Line Numbers */}
                <div
                    className="absolute top-0 left-0 bg-slate-800/30 border-r border-slate-700/50 flex flex-col text-slate-500 font-mono text-sm select-none z-10"
                    style={{ width: lineNumberWidth }}
                >
                    {value.split("\n").map((_, index) => (
                        <div
                            key={index}
                            className="px-2 py-0.5 text-right leading-6 hover:bg-slate-700/20 transition-colors"
                        >
                            {index + 1}
                        </div>
                    ))}
                </div>

                {/* Code Area */}
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => !readOnly && onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    readOnly={readOnly}
                    className={`w-full h-full bg-transparent text-white font-mono text-sm resize-none outline-none leading-6 py-0.5 ${
                        readOnly ? "cursor-not-allowed opacity-75" : ""
                    }`}
                    style={{
                        paddingLeft: lineNumberWidth + 12,
                        paddingRight: 16,
                    }}
                    spellCheck={false}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    placeholder={readOnly ? "Code submitted..." : "// Start coding here..."}
                />

                {/* Helper Text */}
                {!readOnly && (
                    <div className="absolute bottom-3 right-3 text-xs text-slate-500 bg-slate-800/60 px-2 py-1 rounded backdrop-blur-sm">
                        Press Tab for indentation
                    </div>
                )}
            </div>
        </div>
    );
}
