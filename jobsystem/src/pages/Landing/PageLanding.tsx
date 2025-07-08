"use client";

import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Code, FileText, Bot, Zap, ArrowRight, Clock } from "lucide-react";
import { PlatformVisualization } from "./Visualization";

export default function PageLanding() {
    const navigate = useNavigate();

    const features = [
        {
            id: "evaluate-cv",
            icon: FileText,
            title: "CV Evaluation",
            description:
                "Get instant feedback on your CV. Analyze strengths, spot weaknesses, and tailor it to match job requirements with AI support.",
            color: "blue",
            gradient: "from-blue-600/10 to-cyan-600/20",
            border: "border-blue-500/40",
            iconColor: "text-blue-400",
            available: true,
            path: "/evaluate-cv",
        },
        {
            id: "quiz-test",
            icon: Zap,
            title: "Quiz Test",
            description:
                "Test your knowledge in key IT areas like algorithms, programming, and system design with auto-scored quizzes.",
            color: "green",
            gradient: "from-green-600/10 to-emerald-600/20",
            border: "border-green-500/40",
            iconColor: "text-green-400",
            available: true,
            path: "/quiz",
        },
        {
            id: "code",
            icon: Code,
            title: "Coding Problem Test",
            description:
                "Practice real-world coding challenges in a live environment. Improve your logic and problem-solving skills.",
            color: "purple",
            gradient: "from-purple-600/10 to-pink-600/20",
            border: "border-purple-500/40",
            iconColor: "text-purple-400",
            available: true,
            path: "/code",
        },
        {
            id: "ai-interview",
            icon: Bot,
            title: "AI Interview Simulation",
            description:
                "Prepare for real interviews with AI-driven mock sessions. Get evaluated on your answers, tone, and confidence.",
            color: "orange",
            gradient: "from-orange-600/10 to-amber-600/20",
            border: "border-orange-500/40",
            iconColor: "text-orange-400",
            available: false,
            path: null,
        },
    ];

    const handleFeatureClick = (featureId: string) => {
        const feature = features.find((f) => f.id === featureId);
        if (feature?.available && feature.path) {
            navigate(feature.path);
        }
    };

    const handleCardFeatureClick = (feature: (typeof features)[0]) => {
        if (feature.available && feature.path) {
            navigate(feature.path);
        }
    };

    return (
        <main className="bg-gradient-to-b from-zinc-950 via-slate-900 to-gray-900 text-white min-h-screen">
            {/* Hero Section */}
            <section className="relative justify-around flex flex-col lg:flex-row items-center min-h-screen px-10 md:px-20 pr-10">
                {/* Content */}
                <div className="w-fit text-center lg:text-left z-10 space-y-8">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full px-4 py-2">
                        <CheckCircle className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-medium text-purple-300">Next-Gen Career & Hiring Platform</span>
                    </div>

                    {/* Main Title */}
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                                Empowering the Next Generation
                            </span>
                            <br />
                            {""}
                            <span className="text-white">of IT Talent</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            A complete platform designed for both candidates and recruiters — combining smart CV
                            evaluation, coding challenges, and AI-driven interviews to help top tech talent shine.
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <Button
                            onClick={() => navigate("/evaluate-cv")}
                            size="lg"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
                        >
                            Start Now
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </div>

                {/* Visual Element - Platform Visualization Component */}
                <div className="relative w-fit flex items-center justify-center mt-12 lg:mt-0">
                    <PlatformVisualization
                        features={features.map((f) => ({
                            id: f.id,
                            icon: f.icon,
                            title: f.title,
                            available: f.available,
                        }))}
                        onFeatureClick={handleFeatureClick}
                    />
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 md:py-28 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center space-y-6 mb-16">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 rounded-full px-4 py-2">
                            <Zap className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm font-medium text-emerald-300">
                                Empowering Talent & Hiring Teams
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                                Intelligent Tools
                            </span>
                            <br />
                            <span className="text-white">for Growth & Recruitment</span>
                        </h2>
                        <p className="text-lg text-slate-400 max-w-4xl mx-auto leading-relaxed">
                            Whether you're refining your CV or screening top candidates, our AI-powered platform
                            supports both professionals and recruiters with smart evaluations, technical assessments,
                            and actionable insights.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature) => {
                            const IconComponent = feature.icon;
                            return (
                                <Card
                                    key={feature.id}
                                    className={`relative bg-gradient-to-br ${feature.gradient} ${feature.border} border overflow-hidden transition-all duration-300 hover:scale-105 ${
                                        feature.available
                                            ? "cursor-pointer hover:shadow-2xl hover:shadow-purple-500/20"
                                            : "cursor-not-allowed opacity-75"
                                    }`}
                                    onClick={() => handleCardFeatureClick(feature)}
                                >
                                    {/* Decorative Element */}
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full"></div>

                                    {/* Coming Soon Badge */}
                                    {!feature.available && (
                                        <div className="absolute top-3 right-3 z-10">
                                            <Badge className="bg-orange-600/20 text-orange-300 border-orange-500/30 text-xs">
                                                <Clock className="w-3 h-3 mr-1" />
                                                Coming Soon
                                            </Badge>
                                        </div>
                                    )}

                                    <CardContent className="p-6 space-y-4 relative z-10">
                                        {/* Icon */}
                                        <div className="flex items-center justify-between">
                                            <div
                                                className={`p-3 rounded-xl bg-slate-800/50 border border-slate-700/50`}
                                            >
                                                <IconComponent className={`w-8 h-8 ${feature.iconColor}`} />
                                            </div>
                                            {feature.available && (
                                                <ArrowRight className="w-5 h-5 text-slate-400 transition-transform duration-300 group-hover:translate-x-1" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="space-y-3">
                                            <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                                            <p className="text-slate-300 text-sm leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Bottom CTA */}
                    <div className="text-center mt-16">
                        <Card className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-slate-700 max-w-2xl mx-auto">
                            <CardContent className="p-8">
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-bold text-white">
                                        Ready to Transform How You Hire or Get Hired?
                                    </h3>
                                    <p className="text-slate-300">
                                        Whether you're recruiting top IT talent or preparing to become one, our
                                        intelligent platform helps you move forward with confidence.
                                    </p>
                                    <Button
                                        onClick={() => navigate("/evaluate-cv")}
                                        size="lg"
                                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-8 py-3 rounded-full"
                                    >
                                        Get Started Today
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </main>
    );
}
