"use client";

import type React from "react";

import { useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Code, FileText, Bot, Zap, Clock, Target } from "lucide-react";

interface Feature {
    id: string;
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    available: boolean;
    onClick?: () => void;
}

interface PlatformVisualizationProps {
    features: Feature[];
    onFeatureClick?: (featureId: string) => void;
}

export function PlatformVisualization({ features, onFeatureClick }: PlatformVisualizationProps) {
    const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

    const handleMouseEnter = useCallback((featureId: string) => {
        setHoveredFeature(featureId);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setHoveredFeature(null);
    }, []);

    const handleFeatureClick = useCallback(
        (featureId: string) => {
            onFeatureClick?.(featureId);
        },
        [onFeatureClick]
    );

    return (
        <div className="relative">
            {/* Custom SVG Platform Visualization */}
            <svg
                width="500"
                height="500"
                viewBox="0 0 500 500"
                className="w-full max-w-lg md:max-w-xl lg:max-w-2xl drop-shadow-[0_0px_60px_rgba(79,70,229,0.6)] transition-transform duration-700 hover:scale-105"
            >
                {/* Background Circle */}
                <circle cx="250" cy="250" r="220" fill="url(#backgroundGradient)" opacity="0.1" />

                {/* Central Hub */}
                <circle
                    cx="250"
                    cy="250"
                    r="80"
                    fill="url(#centralGradient)"
                    stroke="rgba(79, 70, 229, 0.5)"
                    strokeWidth="3"
                    onMouseEnter={() => handleMouseEnter("hub")}
                    onMouseLeave={handleMouseLeave}
                    className="cursor-pointer transition-all duration-200 hover:stroke-purple-400"
                />

                {/* Feature Nodes */}
                {/* CV Evaluation Node - Top */}
                <g
                    transform="translate(250, 100)"
                    onMouseEnter={() => handleMouseEnter("evaluate-cv")}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleFeatureClick("evaluate-cv")}
                    className="cursor-pointer"
                >
                    <circle
                        r="50"
                        fill="url(#blueGradient)"
                        opacity={hoveredFeature === "evaluate-cv" ? "1" : "0.9"}
                        className="transition-opacity duration-200"
                    />
                    <rect x="-18" y="-22" width="36" height="44" rx="3" fill="white" opacity="0.95" />
                    <rect x="-12" y="-15" width="24" height="3" fill="#3b82f6" />
                    <rect x="-12" y="-9" width="18" height="3" fill="#3b82f6" />
                    <rect x="-12" y="-3" width="21" height="3" fill="#3b82f6" />
                    <rect x="-12" y="3" width="15" height="3" fill="#3b82f6" />
                    <rect x="-12" y="9" width="20" height="3" fill="#3b82f6" />
                </g>

                {/* Quiz Node - Right */}
                <g
                    transform="translate(400, 250)"
                    onMouseEnter={() => handleMouseEnter("quiz-test")}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleFeatureClick("quiz-test")}
                    className="cursor-pointer"
                >
                    <circle
                        r="50"
                        fill="url(#greenGradient)"
                        opacity={hoveredFeature === "quiz-test" ? "1" : "0.9"}
                        className="transition-opacity duration-200"
                    />
                    <polygon points="-12,-18 12,-18 18,0 12,18 -12,18 -18,0" fill="white" opacity="0.95" />
                    <circle cx="0" cy="-6" r="4" fill="#10b981" />
                    <circle cx="0" cy="6" r="4" fill="#10b981" />
                    <path d="M -6,0 L 6,0" stroke="#10b981" strokeWidth="3" />
                </g>

                {/* Code Node - Bottom */}
                <g
                    transform="translate(250, 400)"
                    onMouseEnter={() => handleMouseEnter("code")}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleFeatureClick("code")}
                    className="cursor-pointer"
                >
                    <circle
                        r="50"
                        fill="url(#purpleGradient)"
                        opacity={hoveredFeature === "code" ? "1" : "0.9"}
                        className="transition-opacity duration-200"
                    />
                    <rect x="-22" y="-15" width="44" height="30" rx="4" fill="white" opacity="0.95" />
                    <rect x="-18" y="-9" width="12" height="3" fill="#8b5cf6" />
                    <rect x="-18" y="-3" width="18" height="3" fill="#8b5cf6" />
                    <rect x="-18" y="3" width="9" height="3" fill="#8b5cf6" />
                    <rect x="-18" y="9" width="15" height="3" fill="#8b5cf6" />
                </g>

                {/* AI Interview Node - Left */}
                <g
                    transform="translate(100, 250)"
                    onMouseEnter={() => handleMouseEnter("ai-interview")}
                    onMouseLeave={handleMouseLeave}
                    className="cursor-pointer"
                >
                    <circle
                        r="50"
                        fill="url(#orangeGradient)"
                        opacity={hoveredFeature === "ai-interview" ? "0.9" : "0.7"}
                        className="transition-opacity duration-200"
                    />
                    <circle cx="0" cy="-8" r="18" fill="white" opacity="0.95" />
                    <rect x="-12" y="8" width="24" height="12" rx="6" fill="white" opacity="0.95" />
                    <circle cx="-6" cy="-8" r="3" fill="#f59e0b" />
                    <circle cx="6" cy="-8" r="3" fill="#f59e0b" />
                    <path d="M -4,0 Q 0,4 4,0" stroke="#f59e0b" strokeWidth="3" fill="none" />
                </g>

                {/* Connection Lines */}
                <line
                    x1="250"
                    y1="170"
                    x2="250"
                    y2="150"
                    stroke="url(#connectionGradient)"
                    strokeWidth="4"
                    opacity="0.7"
                />
                <line
                    x1="330"
                    y1="250"
                    x2="350"
                    y2="250"
                    stroke="url(#connectionGradient)"
                    strokeWidth="4"
                    opacity="0.7"
                />
                <line
                    x1="250"
                    y1="330"
                    x2="250"
                    y2="350"
                    stroke="url(#connectionGradient)"
                    strokeWidth="4"
                    opacity="0.7"
                />
                <line
                    x1="170"
                    y1="250"
                    x2="150"
                    y2="250"
                    stroke="url(#connectionGradient)"
                    strokeWidth="4"
                    opacity="0.5"
                />

                {/* Floating Elements */}
                <g className="animate-pulse">
                    <circle cx="150" cy="150" r="4" fill="#3b82f6" opacity="0.8" />
                    <circle cx="350" cy="150" r="3" fill="#10b981" opacity="0.8" />
                    <circle cx="400" cy="350" r="4" fill="#8b5cf6" opacity="0.8" />
                    <circle cx="100" cy="400" r="3" fill="#f59e0b" opacity="0.6" />
                </g>

                {/* Central Icon */}
                <g transform="translate(250, 250)">
                    <circle r="12" fill="white" />
                    <path d="M -6,-6 L 6,6 M 6,-6 L -6,6" stroke="#4f46e5" strokeWidth="3" />
                </g>

                {/* Gradients */}
                <defs>
                    <radialGradient id="backgroundGradient">
                        <stop offset="0%" stopColor="#4f46e5" />
                        <stop offset="100%" stopColor="#7c3aed" />
                    </radialGradient>
                    <radialGradient id="centralGradient">
                        <stop offset="0%" stopColor="#4f46e5" />
                        <stop offset="100%" stopColor="#1e1b4b" />
                    </radialGradient>
                    <radialGradient id="blueGradient">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#1e40af" />
                    </radialGradient>
                    <radialGradient id="greenGradient">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#047857" />
                    </radialGradient>
                    <radialGradient id="purpleGradient">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#5b21b6" />
                    </radialGradient>
                    <radialGradient id="orangeGradient">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#d97706" />
                    </radialGradient>
                    <linearGradient id="connectionGradient">
                        <stop offset="0%" stopColor="#4f46e5" />
                        <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-full blur-3xl -z-10 animate-pulse"></div>

            {/* Hover Labels - Positioned Outside Circle */}
            {hoveredFeature === "evaluate-cv" && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600/40 to-cyan-600/40 backdrop-blur-sm border border-blue-500/50 rounded-xl px-6 py-3 transition-all duration-200 ease-out">
                    <div className="flex items-center gap-3 text-lg whitespace-nowrap">
                        <FileText className="w-6 h-6 text-blue-400" />
                        <span className="text-blue-200 font-bold">CV Evaluation</span>
                    </div>
                </div>
            )}

            {hoveredFeature === "quiz-test" && (
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-full ml-6 bg-gradient-to-r from-green-600/40 to-emerald-600/40 backdrop-blur-sm border border-green-500/50 rounded-xl px-6 py-3 transition-all duration-200 ease-out">
                    <div className="flex items-center gap-3 text-lg whitespace-nowrap">
                        <Zap className="w-6 h-6 text-green-400" />
                        <span className="text-green-200 font-bold">Quiz Test</span>
                    </div>
                </div>
            )}

            {hoveredFeature === "code" && (
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600/40 to-pink-600/40 backdrop-blur-sm border border-purple-500/50 rounded-xl px-6 py-3 transition-all duration-200 ease-out">
                    <div className="flex items-center gap-3 text-lg whitespace-nowrap">
                        <Code className="w-6 h-6 text-purple-400" />
                        <span className="text-purple-200 font-bold">Coding Test</span>
                    </div>
                </div>
            )}

            {hoveredFeature === "ai-interview" && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full mr-6 bg-gradient-to-r from-orange-600/30 to-amber-600/30 backdrop-blur-sm border border-orange-500/40 rounded-xl px-6 py-3 opacity-80 transition-all duration-200 ease-out">
                    <div className="flex items-center gap-3 text-lg whitespace-nowrap">
                        <Bot className="w-6 h-6 text-orange-400" />
                        <span className="text-orange-200 font-bold">AI Interview</span>
                        <Badge className="bg-orange-600/40 text-orange-300 border-orange-500/50 text-xs ml-2">
                            <Clock className="w-3 h-3 mr-1" />
                            Soon
                        </Badge>
                    </div>
                </div>
            )}

            {hoveredFeature === "hub" && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-600/50 to-purple-600/50 backdrop-blur-sm border border-indigo-500/60 rounded-xl px-4 py-2 transition-all duration-200 ease-out">
                    <div className="flex items-center gap-2 text-base whitespace-nowrap">
                        <Target className="w-5 h-5 text-indigo-300" />
                        <span className="text-indigo-200 font-bold">Codivio</span>
                    </div>
                </div>
            )}
        </div>
    );
}
