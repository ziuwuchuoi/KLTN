"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    CheckCircle,
    XCircle,
    Clock,
    MemoryStick,
    AlertCircle,
    ChevronUp,
    ChevronDown,
    GripHorizontal,
    Minimize2,
} from "lucide-react";
import type { CodeSubmitResult } from "@/services/code.service";

interface TestResultsDrawerProps {
    result: CodeSubmitResult;
    isVisible: boolean;
    onToggle: () => void;
}

export function TestResultsDrawer({ result, isVisible, onToggle }: TestResultsDrawerProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [startY, setStartY] = useState(0);
    const [currentHeight, setCurrentHeight] = useState(400);
    const [isMinimized, setIsMinimized] = useState(false);
    const drawerRef = useRef<HTMLDivElement>(null);

    const minHeight = 80; // Minimized height showing just the header
    const maxHeight = window.innerHeight * 0.7;
    const defaultHeight = 400;

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;

            const deltaY = startY - e.clientY;
            const newHeight = Math.min(Math.max(currentHeight + deltaY, minHeight), maxHeight);
            setCurrentHeight(newHeight);

            // Update minimized state based on height
            setIsMinimized(newHeight <= minHeight + 20);
        };

        const handleMouseUp = () => {
            setIsDragging(false);

            // Snap to minimized or expanded based on height
            if (currentHeight < 150) {
                setCurrentHeight(minHeight);
                setIsMinimized(true);
            } else if (currentHeight < 300) {
                setCurrentHeight(defaultHeight);
                setIsMinimized(false);
            } else {
                setIsMinimized(false);
            }
        };

        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
            document.body.style.cursor = "ns-resize";
            document.body.style.userSelect = "none";
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        };
    }, [isDragging, startY, currentHeight, minHeight, maxHeight, defaultHeight]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartY(e.clientY);
    };

    const handleToggleMinimize = () => {
        if (isMinimized) {
            setCurrentHeight(defaultHeight);
            setIsMinimized(false);
        } else {
            setCurrentHeight(minHeight);
            setIsMinimized(true);
        }
    };

    return (
        <div
            ref={drawerRef}
            className={`fixed bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur-sm border-t border-slate-700 transition-transform duration-300 z-50 shadow-2xl ${
                isVisible ? "translate-y-0" : "translate-y-full"
            }`}
            style={{ height: currentHeight }}
        >
            {/* Drag Handle Header */}
            <div
                className="flex items-center justify-between px-4 py-3 cursor-ns-resize hover:bg-slate-700/30 transition-colors border-b border-slate-700/50"
                onMouseDown={handleMouseDown}
            >
                <div className="flex items-center gap-3">
                    <GripHorizontal className="w-5 h-5 text-slate-400" />
                    <div className="flex items-center gap-2">
                        {result.success ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                            <XCircle className="w-5 h-5 text-red-400" />
                        )}
                        <span className="font-semibold text-white">{result.success ? "Accepted" : "Failed"}</span>
                        <span className="text-sm text-slate-400">
                            ({result.passedTests}/{result.totalTests} test cases passed)
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleToggleMinimize}
                        className="text-slate-400 hover:text-white"
                    >
                        {isMinimized ? <ChevronUp className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                    </Button>
                </div>
            </div>

            {/* Content - Only show when not minimized */}
            {!isMinimized && (
                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                        <div className="p-4 space-y-4">
                            {/* Overall Stats */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                                        <CheckCircle className="w-3 h-3" />
                                        Test Cases
                                    </div>
                                    <div className="text-lg font-semibold text-white">
                                        {result.passedTests}/{result.totalTests}
                                    </div>
                                </div>
                                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                                        <AlertCircle className="w-3 h-3" />
                                        Status
                                    </div>
                                    <div
                                        className={`text-lg font-semibold ${result.success ? "text-green-400" : "text-red-400"}`}
                                    >
                                        {result.success ? "Accepted" : "Failed"}
                                    </div>
                                </div>
                                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                                        <Clock className="w-3 h-3" />
                                        Avg Time
                                    </div>
                                    {/* <div className="text-lg font-semibold text-white">
                                        {Math.round(
                                            result.testResults.reduce((acc, r) => acc + r.time, 0) /
                                                result.testResults.length
                                        )}
                                        ms
                                    </div> */}
                                </div>
                            </div>

                            {/* Test Results */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    Test Results
                                </h4>
                                <div className="space-y-2">
                                    {result.testResults.map((testResult, index) => (
                                        <Card
                                            key={index}
                                            className={`bg-slate-900/30 border ${
                                                testResult.passed ? "border-green-500/30" : "border-red-500/30"
                                            }`}
                                        >
                                            <CardHeader className="pb-2 px-4 py-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        {testResult.passed ? (
                                                            <CheckCircle className="w-4 h-4 text-green-400" />
                                                        ) : (
                                                            <XCircle className="w-4 h-4 text-red-400" />
                                                        )}
                                                        <span className="font-medium text-sm text-white">
                                                            Test Case {index + 1}
                                                        </span>
                                                        {/* <Badge
                                                            variant={testResult.passed ? "default" : "destructive"}
                                                            className="text-xs"
                                                        >
                                                            {testResult.status.description}
                                                        </Badge> */}
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-slate-400">
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {testResult.time}ms
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <MemoryStick className="w-3 h-3" />
                                                            {Math.round(testResult.memory / 1024)}KB
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="px-4 py-2 pt-0">
                                                <div className="space-y-2 text-xs">
                                                    <div className="grid grid-cols-1 gap-2">
                                                        <div>
                                                            <span className="text-slate-400">Input: </span>
                                                            <code className="bg-slate-800 px-2 py-1 rounded text-slate-300 text-xs">
                                                                {testResult.testCase.params
                                                                    .map((p) => p.value)
                                                                    .join(", ")}
                                                            </code>
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-400">Expected: </span>
                                                            <code className="bg-slate-800 px-2 py-1 rounded text-green-400 text-xs">
                                                                {testResult.testCase.expected}
                                                            </code>
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-400">Output: </span>
                                                            <code
                                                                className={`bg-slate-800 px-2 py-1 rounded text-xs ${
                                                                    testResult.passed
                                                                        ? "text-green-400"
                                                                        : "text-red-400"
                                                                }`}
                                                            >
                                                                {testResult.stdout || "undefined"}
                                                            </code>
                                                        </div>
                                                        {/* {testResult.stderr && (
                                                            <div>
                                                                <span className="text-slate-400">Error: </span>
                                                                <code className="bg-red-900/20 px-2 py-1 rounded text-red-400 text-xs">
                                                                    {testResult.stderr}
                                                                </code>
                                                            </div>
                                                        )} */}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            )}
        </div>
    );
}
