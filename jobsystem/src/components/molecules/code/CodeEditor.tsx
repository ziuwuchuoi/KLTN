"use client";

import { useToast } from "@/components/ui/use-toast";
import { ShowToast } from "@/components/utils/general.utils";
import type React from "react";
import { useRef } from "react";

interface CodeEditorProps {
    value: string;
    onChange: (value: string) => void;
    language: string;
}

export function CodeEditor({ value, onChange, language }: CodeEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { toast } = useToast();
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Tab") {
            e.preventDefault();
            const start = e.currentTarget.selectionStart;
            const end = e.currentTarget.selectionEnd;
            const newValue = value.substring(0, start) + "  " + value.substring(end);
            onChange(newValue);

            // Set cursor position after the inserted spaces
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
                }
            }, 0);
        }
    };

    //Note: Prevent paste
    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        ShowToast(toast, "error", "Paste feature is not allowed!");
    };

    const lineCount = value.split("\n").length;
    const lineNumberWidth = Math.max(2, lineCount.toString().length) * 8 + 24;

    return (
        <div className="h-full bg-slate-900 rounded-lg overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-300 capitalize">{language}</span>
                    <div className="w-1 h-4 bg-slate-600 rounded-full"></div>
                    <span className="text-xs text-slate-500">{lineCount} lines</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors cursor-pointer"></div>
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 relative overflow-hidden">
                {/* Line Numbers */}
                <div
                    className="absolute top-0 left-0 bg-slate-800/50 border-r border-slate-700 flex flex-col text-slate-400 font-mono text-sm select-none z-10"
                    style={{ width: lineNumberWidth }}
                >
                    {value.split("\n").map((_, index) => (
                        <div
                            key={index}
                            className="px-3 py-0.5 text-right leading-6 hover:bg-slate-700/30 transition-colors"
                        >
                            {index + 1}
                        </div>
                    ))}
                </div>

                {/* Code Area */}
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    className="w-full h-full bg-transparent text-white font-mono text-sm resize-none outline-none leading-6 py-0.5"
                    style={{
                        paddingLeft: lineNumberWidth + 16,
                        paddingRight: 16,
                    }}
                    spellCheck={false}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    placeholder="// Start coding here..."
                />

                {/* Syntax highlighting overlay could go here */}
                <div className="absolute bottom-4 right-4 text-xs text-slate-500 bg-slate-800/80 px-2 py-1 rounded">
                    Press Tab for indentation
                </div>
            </div>
        </div>
    );
}
