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
        const radius = size / 2 - 70; // Reduced from 80 to bring labels closer
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

        // Calculate label positions with improved positioning logic - closer to circle
        const labelPoints = labels.map((label, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const baseDistance = radius + 25; // Reduced from 45 to bring labels closer

            // Adjust distance based on angle to create better balance
            let adjustedDistance = baseDistance;
            const normalizedAngle = (angle + Math.PI * 2) % (Math.PI * 2);

            // Add minimal extra space for labels at certain angles to prevent overlap
            if (normalizedAngle > Math.PI * 0.25 && normalizedAngle < Math.PI * 0.75) {
                adjustedDistance += 5; // Reduced from 10 - Bottom labels get less extra space
            }
            if (normalizedAngle > Math.PI * 1.25 && normalizedAngle < Math.PI * 1.75) {
                adjustedDistance += 3; // Reduced from 5 - Top labels get minimal extra space
            }

            const x = center + Math.cos(angle) * adjustedDistance;
            const y = center + Math.sin(angle) * adjustedDistance;

            // Determine text anchor based on position
            let textAnchor: "start" | "middle" | "end" = "middle";
            let dominantBaseline: "middle" | "hanging" | "text-before-edge" = "middle";

            // Horizontal positioning
            if (x < center - 10) {
                textAnchor = "end";
            } else if (x > center + 10) {
                textAnchor = "start";
            }

            // Vertical positioning
            if (y < center - 10) {
                dominantBaseline = "text-before-edge";
            } else if (y > center + 10) {
                dominantBaseline = "hanging";
            }

            return {
                x,
                y,
                label,
                angle,
                textAnchor,
                dominantBaseline,
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
        <div className="flex flex-col items-center justify-center">
            {/* Chart */}
            <div className="relative">
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
                            x={chartData.center + circle.radius + 8}
                            y={chartData.center - 2}
                            className="text-xs fill-slate-500 font-medium"
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
                        fill="rgb(251, 191, 36)"
                        fillOpacity="0.15"
                        stroke="rgb(251, 191, 36)"
                        strokeWidth="2"
                        strokeDasharray="none"
                    />

                    {/* Candidate scores polygon (foreground) */}
                    <polygon
                        points={candidatePolygon}
                        fill="rgb(34, 211, 238)"
                        fillOpacity="0.2"
                        stroke="rgb(34, 211, 238)"
                        strokeWidth="2"
                        strokeDasharray="none"
                    />

                    {/* JD requirement points */}
                    {chartData.jdPoints.map((point, index) => (
                        <g key={`jd-${index}`}>
                            <circle
                                cx={point.x}
                                cy={point.y}
                                r="6"
                                fill="rgb(251, 191, 36)"
                                stroke="white"
                                strokeWidth="2"
                                className="drop-shadow-sm"
                            />
                            <text
                                x={point.x}
                                y={point.y - 14}
                                textAnchor="middle"
                                className="text-xs font-bold fill-amber-400 drop-shadow-sm"
                            >
                                {point.score}
                            </text>
                        </g>
                    ))}

                    {/* Candidate score points */}
                    {chartData.candidatePoints.map((point, index) => (
                        <g key={`candidate-${index}`}>
                            <circle
                                cx={point.x}
                                cy={point.y}
                                r="6"
                                fill="rgb(34, 211, 238)"
                                stroke="white"
                                strokeWidth="2"
                                className="drop-shadow-sm"
                            />
                            <text
                                x={point.x}
                                y={point.y + 20}
                                textAnchor="middle"
                                className="text-xs font-bold fill-cyan-400 drop-shadow-sm"
                            >
                                {point.score}
                            </text>
                        </g>
                    ))}

                    {/* Labels with improved positioning - closer to radar circle */}
                    {chartData.labelPoints.map((point, index) => (
                        <g key={`label-${index}`}>
                            <text
                                x={point.x}
                                y={point.y}
                                textAnchor={point.textAnchor}
                                dominantBaseline={point.dominantBaseline}
                                className="text-sm font-semibold fill-slate-200 drop-shadow-sm"
                            >
                                {point.label}
                            </text>
                        </g>
                    ))}
                </svg>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-8 pb-6 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-cyan-400 rounded-full border-2 border-white shadow-sm"></div>
                    <span className="text-slate-300 font-medium">Your Profile</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-amber-400 rounded-full border-2 border-white shadow-sm"></div>
                    <span className="text-slate-300 font-medium">Job Requirements</span>
                </div>
            </div>
        </div>
    );
}
