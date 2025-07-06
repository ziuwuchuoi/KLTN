"use client";

import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Code, FileText, Bot, Zap, ArrowRight, Clock } from "lucide-react";

export default function PageLanding() {
    const navigate = useNavigate();

    const features = [
        {
            id: "evaluate-cv",
            icon: FileText,
            title: "CV Evaluation",
            description: "AI-powered CV analysis and ranking based on job requirements to find top candidates",
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
            description: "Comprehensive knowledge assessment with algorithms, programming languages and system design",
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
            title: "Live Coding Test",
            description: "Real-time coding environment with integrated compiler and collaborative problem solving",
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
            description: "Intelligent interview simulation with situational questions and objective evaluation",
            color: "orange",
            gradient: "from-orange-600/10 to-amber-600/20",
            border: "border-orange-500/40",
            iconColor: "text-orange-400",
            available: false,
            path: null,
        },
    ];

    const handleFeatureClick = (feature: (typeof features)[0]) => {
        if (feature.available && feature.path) {
            navigate(feature.path);
        }
    };

    return (
        <main className="bg-gradient-to-b from-zinc-950 via-slate-900 to-gray-900 text-white min-h-screen">
            {/* Hero Section */}
            <section className="relative flex flex-col lg:flex-row items-center min-h-screen px-6 md:px-12">
                {/* Content */}
                <div className="lg:w-1/2 text-center lg:text-left z-10 space-y-8">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full px-4 py-2">
                        <CheckCircle className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-medium text-purple-300">Next-Gen Recruitment Platform</span>
                    </div>

                    {/* Main Title */}
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                                Recruiting New Generation
                            </span>
                            <br />
                            <span className="text-white">IT Talent</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            Comprehensive platform for objective assessment, technical interviews, and efficient
                            selection of top IT candidates through AI-powered tools.
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <Button
                            onClick={() => navigate("/evaluate-cv")}
                            size="lg"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
                        >
                            Start Free Assessment
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-slate-500 text-slate-200 hover:bg-slate-800 font-semibold px-8 py-3 rounded-full transition-all duration-300 bg-transparent"
                        >
                            View Demo
                        </Button>
                    </div>
                </div>

                {/* Visual Element */}
                <div className="relative lg:w-1/2 flex items-center justify-center mt-12 lg:mt-0">
                    <div className="relative">
                        <img
                            src="./src/assets/moon.png"
                            alt="Platform Visualization"
                            className="w-full max-w-sm md:max-w-md lg:max-w-xl drop-shadow-[0_0px_60px_rgba(79,70,229,0.6)] transition-transform duration-700 hover:scale-105"
                        />
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 md:py-28 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center space-y-6 mb-16">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 rounded-full px-4 py-2">
                            <Zap className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm font-medium text-emerald-300">Comprehensive Assessment Suite</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                                Powerful Tools
                            </span>
                            <br />
                            <span className="text-white">for Modern Recruitment</span>
                        </h2>
                        <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
                            From CV screening to technical interviews, our AI-powered platform provides everything you
                            need to identify and select the best candidates efficiently.
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
                                    onClick={() => handleFeatureClick(feature)}
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

                                        {/* Action Indicator */}
                                        {feature.available && (
                                            <div className="pt-2">
                                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                    <span>Click to explore</span>
                                                </div>
                                            </div>
                                        )}
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
                                        Ready to Transform Your Hiring Process?
                                    </h3>
                                    <p className="text-slate-300">
                                        Join thousands of companies using our platform to find exceptional IT talent.
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
