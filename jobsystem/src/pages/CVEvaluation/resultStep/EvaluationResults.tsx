"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    TrendingUp,
    Target,
    CheckCircle,
    AlertTriangle,
    Brain,
    FileText,
    Award,
    Lightbulb,
    Star,
    ArrowUp,
    Zap,
    Info,
} from "lucide-react";
import type { EvaluatedCVDetail } from "@/services/file.service";
import { RadarChart } from "./RadarChart";

interface EvaluationResultsProps {
    result: EvaluatedCVDetail;
}

export function EvaluationResults({ result }: EvaluationResultsProps) {
    const { reviewCVResponse } = result;
    const { summary, skills_analysis, ats_check, ai_review } = reviewCVResponse;

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-emerald-400";
        if (score >= 60) return "text-amber-400";
        return "text-red-400";
    };

    const getScoreBg = (score: number) => {
        if (score >= 80) return "bg-emerald-500/10 border-emerald-400/30";
        if (score >= 60) return "bg-amber-500/10 border-amber-400/30";
        return "bg-red-500/10 border-red-400/30";
    };

    return (
        <div className="space-y-8">
            {/* Hero Score Section */}
            <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full px-6 py-3">
                    <Award className="w-6 h-6 text-purple-400" />
                    <span className="text-lg font-semibold text-white">Overall Match Score</span>
                </div>

                <div className="relative">
                    <div className={`text-7xl font-bold ${getScoreColor(summary.overall_score)} mb-4`}>
                        {summary.overall_score}%
                    </div>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className={`${getScoreBg(summary.overall_score)} border relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full"></div>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Award className="w-8 h-8 text-emerald-400" />
                            <div className={`text-2xl font-bold ${getScoreColor(summary.overall_score)}`}>
                                {summary.overall_score}%
                            </div>
                        </div>
                        <h3 className="font-semibold text-white mb-2">Overall Match</h3>
                        <Progress value={summary.overall_score} className="h-2 bg-slate-700" />
                    </CardContent>
                </Card>

                <Card className={`${getScoreBg(skills_analysis.match_percent)} border relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full"></div>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Target className="w-8 h-8 text-blue-400" />
                            <div className={`text-2xl font-bold ${getScoreColor(skills_analysis.match_percent)}`}>
                                {skills_analysis.match_percent}%
                            </div>
                        </div>
                        <h3 className="font-semibold text-white mb-2">Skills Match</h3>
                        <Progress value={skills_analysis.match_percent} className="h-2 bg-slate-700" />
                    </CardContent>
                </Card>

                <Card className={`${getScoreBg(summary.similarity_score)} border relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full"></div>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Brain className="w-8 h-8 text-purple-400" />
                            <div className={`text-2xl font-bold ${getScoreColor(summary.similarity_score)}`}>
                                {summary.similarity_score.toFixed(1)}%
                            </div>
                        </div>
                        <h3 className="font-semibold text-white mb-2">Content Similarity</h3>
                        <Progress value={summary.similarity_score} className="h-2 bg-slate-700" />
                    </CardContent>
                </Card>
            </div>

            {/* Radar Chart Section */}
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-3 text-white">
                        <TrendingUp className="w-6 h-6 text-blue-400" />
                        Skills Radar Analysis
                    </CardTitle>
                    {/* Explanation Section */}
                </CardHeader>
                <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                        <div className="flex-1">
                            <RadarChart data={ai_review.radar_chart_data} size={400} />
                            <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600/30">
                                <div className="flex items-start gap-3">
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <span className="font-semibold text-emerald-400">Candidate Scores:</span>
                                            <span className="text-slate-300 ml-2">
                                                Reflect the candidate's demonstrated proficiency in each dimension—such
                                                as Experience, Education, and Hard Skills—as extracted from their CV.
                                            </span>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-red-400">JD Requirements:</span>
                                            <span className="text-slate-300 ml-2">
                                                Indicate the expected competency levels for each corresponding area, as
                                                defined by the job description.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                {ai_review.radar_chart_data.labels.map((label, index) => (
                                    <div key={label} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-medium text-slate-300">{label}</span>
                                            <div className="flex gap-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                                                    <span className="text-xs text-emerald-400 font-semibold">
                                                        {ai_review.radar_chart_data.candidate_scores[index]}/10
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                                    <span className="text-xs text-red-400 font-semibold">
                                                        {ai_review.radar_chart_data.jd_requirements[index]}/10
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-slate-400 w-16">Your:</span>
                                                <Progress
                                                    value={
                                                        (ai_review.radar_chart_data.candidate_scores[index] / 10) * 100
                                                    }
                                                    className="h-2 bg-slate-700 flex-1"
                                                    indicatorClassname="bg-emerald-500"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-slate-400 w-16">Required:</span>
                                                <Progress
                                                    value={
                                                        (ai_review.radar_chart_data.jd_requirements[index] / 10) * 100
                                                    }
                                                    className="h-2 bg-slate-700 flex-1"
                                                    indicatorClassname="bg-red-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Skills Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-gradient-to-br from-green-600/10 to-emerald-600/20 border-green-500/40">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-white">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            Matched Skills ({skills_analysis.matched_skills.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {skills_analysis.matched_skills.map((skill, index) => (
                                <Badge
                                    key={index}
                                    className="bg-green-600/20 text-green-300 border-green-500/30 hover:bg-green-600/30"
                                >
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-600/10 to-orange-600/20 border-amber-500/40">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-white">
                            <AlertTriangle className="w-5 h-5 text-amber-400" />
                            Skills to Develop ({skills_analysis.missing_skills.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {skills_analysis.missing_skills.map((skill, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="border-amber-500/30 text-amber-300 hover:bg-amber-600/20"
                                >
                                    <ArrowUp className="w-3 h-3 mr-1" />
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* AI Insights Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Strengths */}
                <Card className="bg-gradient-to-br from-blue-600/10 to-cyan-600/20 border-blue-500/40">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-white">
                            <Star className="w-5 h-5 text-blue-400" />
                            Key Strengths
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {ai_review.strengths.map((strength, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 p-3 bg-blue-600/10 rounded-lg border border-blue-500/20"
                            >
                                <ArrowUp className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                <p className="text-blue-200 text-sm leading-relaxed">{strength}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Areas for Improvement */}
                <Card className="bg-gradient-to-br from-purple-600/10 to-pink-600/20 border-purple-500/40">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-white">
                            <ArrowUp className="w-5 h-5 text-purple-400" />
                            Areas for Improvement
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {ai_review.weaknesses.map((weakness, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 p-3 bg-purple-600/10 rounded-lg border border-purple-500/20"
                            >
                                <AlertTriangle className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                                <p className="text-purple-200 text-sm leading-relaxed">{weakness}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Development Roadmap */}
            <Card className="bg-gradient-to-br from-emerald-600/10 to-teal-600/20 border-emerald-500/40">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2 text-white">
                        <Zap className="w-6 h-6 text-emerald-400" />
                        Development Roadmap
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {ai_review.development_roadmap.map((step, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-4 p-4 bg-emerald-600/10 rounded-lg border border-emerald-500/20"
                            >
                                <div className="flex-shrink-0 w-8 h-8 bg-emerald-600/20 rounded-full flex items-center justify-center border border-emerald-500/30">
                                    <span className="text-emerald-400 font-semibold text-sm">{index + 1}</span>
                                </div>
                                <p className="text-emerald-200 leading-relaxed">{step}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* ATS Optimization */}
            <Card className="bg-gradient-to-br from-slate-600/10 to-slate-700/20 border-slate-500/40">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2 text-white">
                        <FileText className="w-6 h-6 text-slate-400" />
                        ATS Optimization Report
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Issues */}
                    {ats_check.issues.length > 0 && ats_check.issues[0] !== "No issues found" && (
                        <div>
                            <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-red-400" />
                                Issues Found
                            </h4>
                            <div className="space-y-2">
                                {ats_check.issues.map((issue, index) => (
                                    <div key={index} className="p-3 bg-red-600/10 border border-red-500/20 rounded-lg">
                                        <p className="text-red-300 text-sm">{issue}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Formatting Tips */}
                    {ats_check.formatting_tips.length > 0 && (
                        <div>
                            <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                                <Lightbulb className="w-4 h-4 text-blue-400" />
                                Formatting Tips
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {ats_check.formatting_tips.map((tip, index) => (
                                    <div
                                        key={index}
                                        className="p-3 bg-blue-600/10 border border-blue-500/20 rounded-lg"
                                    >
                                        <p className="text-blue-300 text-sm">{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Missing Keywords Preview */}
                    {ats_check.missing_keywords.length > 0 && (
                        <div>
                            <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                                <Target className="w-4 h-4 text-orange-400" />
                                Key Missing Keywords ({ats_check.missing_keywords.length})
                            </h4>
                            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                                {ats_check.missing_keywords.slice(0, 20).map((keyword, index) => (
                                    <Badge
                                        key={index}
                                        variant="outline"
                                        className="border-orange-500/30 text-orange-400 text-xs"
                                    >
                                        {keyword}
                                    </Badge>
                                ))}
                                {ats_check.missing_keywords.length > 20 && (
                                    <Badge variant="outline" className="border-slate-500/30 text-slate-400 text-xs">
                                        +{ats_check.missing_keywords.length - 20} more
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
