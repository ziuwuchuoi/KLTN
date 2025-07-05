"use client";

import { useMemo } from "react";
import type { RadarChartData } from "@/services/file.service";

interface RadarChartProps {
    data: RadarChartData;
    size?: number;
}

export function RadarChart({ data, size = 300 }: RadarChartProps) {
    const { candidate_scores, jd_requirements, labels } = data;

    const chartData = useMemo(() => {
        const center = size / 2;
        const radius = size / 2 - 60; // More space for labels
        const angleStep = (2 * Math.PI) / labels.length;

        // Use scores as-is (level 10 scale)
        const candidateScores = candidate_scores;
        const jdRequirements = jd_requirements;

        // Calculate points for each polygon (convert to percentage for positioning)
        const candidatePoints = candidateScores.map((score, index) => {
            const angle = index * angleStep - Math.PI / 2; // Start from top
            const distance = (score / 10) * radius; // Convert to percentage of radius
            return {
                x: center + Math.cos(angle) * distance,
                y: center + Math.sin(angle) * distance,
                score: score, // Keep original score for display
                label: labels[index],
            };
        });

        const jdPoints = jdRequirements.map((score, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const distance = (score / 10) * radius; // Convert to percentage of radius
            return {
                x: center + Math.cos(angle) * distance,
                y: center + Math.sin(angle) * distance,
                score: score, // Keep original score for display
                label: labels[index],
            };
        });

        // Calculate label positions (outside the chart)
        const labelPoints = labels.map((label, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const distance = radius + 35;
            return {
                x: center + Math.cos(angle) * distance,
                y: center + Math.sin(angle) * distance,
                label,
                angle,
            };
        });

        // Grid circles (based on 10-point scale)
        const gridLevels = [2, 4, 6, 8, 10];
        const gridCircles = gridLevels.map((level) => ({
            radius: (level / 10) * radius,
            level,
        }));

        // Grid lines (axes)
        const gridLines = labels.map((_, index) => {
            const angle = index * angleStep - Math.PI / 2;
            return {
                x1: center,
                y1: center,
                x2: center + Math.cos(angle) * radius,
                y2: center + Math.sin(angle) * radius,
            };
        });

        return {
            candidatePoints,
            jdPoints,
            labelPoints,
            gridCircles,
            gridLines,
            center,
            radius,
        };
    }, [candidate_scores, jd_requirements, labels, size]);

    const candidatePolygon = chartData.candidatePoints.map((p) => `${p.x},${p.y}`).join(" ");
    const jdPolygon = chartData.jdPoints.map((p) => `${p.x},${p.y}`).join(" ");

    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            {/* Legend */}
            <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
                    <span className="text-slate-300 font-medium">Your Profile</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                    <span className="text-slate-300 font-medium">Job Requirements</span>
                </div>
            </div>

            {/* Chart */}
            <svg width={size} height={size} className="overflow-visible">
                {/* Grid circles */}
                {chartData.gridCircles.map((circle, index) => (
                    <circle
                        key={index}
                        cx={chartData.center}
                        cy={chartData.center}
                        r={circle.radius}
                        fill="none"
                        stroke="rgb(71 85 105)"
                        strokeWidth="1"
                        opacity="0.3"
                    />
                ))}

                {/* Grid level labels */}
                {chartData.gridCircles.map((circle, index) => (
                    <text
                        key={`level-${index}`}
                        x={chartData.center + circle.radius + 5}
                        y={chartData.center - 2}
                        className="text-xs fill-slate-500"
                        textAnchor="start"
                    >
                        {circle.level}
                    </text>
                ))}

                {/* Grid lines */}
                {chartData.gridLines.map((line, index) => (
                    <line
                        key={index}
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        stroke="rgb(71 85 105)"
                        strokeWidth="1"
                        opacity="0.3"
                    />
                ))}

                {/* JD Requirements polygon (background) */}
                <polygon
                    points={jdPolygon}
                    fill="rgb(239 68 68)"
                    fillOpacity="0.15"
                    stroke="rgb(239 68 68)"
                    strokeWidth="2"
                />

                {/* Candidate scores polygon (foreground) */}
                <polygon
                    points={candidatePolygon}
                    fill="rgb(34 197 94)"
                    fillOpacity="0.25"
                    stroke="rgb(34 197 94)"
                    strokeWidth="2"
                />

                {/* JD requirement points */}
                {chartData.jdPoints.map((point, index) => (
                    <g key={`jd-${index}`}>
                        <circle cx={point.x} cy={point.y} r="5" fill="rgb(239 68 68)" stroke="white" strokeWidth="2" />
                        <text
                            x={point.x}
                            y={point.y - 12}
                            textAnchor="middle"
                            className="text-xs font-bold fill-red-400"
                        >
                            {point.score}
                        </text>
                    </g>
                ))}

                {/* Candidate score points */}
                {chartData.candidatePoints.map((point, index) => (
                    <g key={`candidate-${index}`}>
                        <circle cx={point.x} cy={point.y} r="5" fill="rgb(34 197 94)" stroke="white" strokeWidth="2" />
                        <text
                            x={point.x}
                            y={point.y + 18}
                            textAnchor="middle"
                            className="text-xs font-bold fill-green-400"
                        >
                            {point.score}
                        </text>
                    </g>
                ))}

                {/* Labels */}
                {chartData.labelPoints.map((point, index) => (
                    <text
                        key={index}
                        x={point.x}
                        y={point.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-sm font-semibold fill-slate-200"
                    >
                        {point.label}
                    </text>
                ))}
            </svg>
        </div>
    );
}
