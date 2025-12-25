import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Star, Shield, Globe, TrendingUp, Lock, Sparkles, CheckCircle2, BarChart3 } from "lucide-react";

// Sample report data for preview
const sampleReport = {
    brandName: "TechNova",
    score: 87,
    verdict: "GO",
    executiveSummary: "TechNova presents a strong, distinctive brand identity with excellent trademark clearance and high memorability scores. Strategic positioning aligns perfectly with the premium tech market.",
    dimensions: [
        { name: "Distinctiveness", score: 9.2 },
        { name: "Memorability", score: 8.8 },
        { name: "Trust Curve", score: 8.5 },
        { name: "Cultural Fit", score: 9.0 },
    ],
    strengths: [
        "Unique phonetic structure",
        "Strong tech association",
        "Available .com domain"
    ]
};

// Score Card Preview
const ScoreCardPreview = ({ isHovered }) => (
    <div className={`transition-all duration-500 ${isHovered ? 'scale-105' : ''}`}>
        <div className="bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">RIGHTNAME™ INDEX</p>
                    <p className="text-[10px] text-slate-400">Composite Consulting Grade</p>
                </div>
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <div className="text-center">
                <span className="text-6xl font-black text-emerald-600">{sampleReport.score}</span>
                <span className="text-2xl text-slate-400">/100</span>
            </div>
            <div className="mt-4 flex justify-center">
                <Badge className="bg-emerald-500 text-white font-bold px-4 py-1 text-sm">
                    {sampleReport.verdict}
                </Badge>
            </div>
        </div>
    </div>
);

// Dimensions Preview Card
const DimensionsPreview = ({ isHovered }) => (
    <div className={`transition-all duration-500 ${isHovered ? 'scale-105' : ''}`}>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-4 h-4 text-violet-500" />
                <p className="text-xs font-bold uppercase tracking-widest text-violet-600">Dimensions Analysis</p>
            </div>
            <div className="space-y-3">
                {sampleReport.dimensions.map((dim, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <span className="text-xs font-medium text-slate-600 w-24 truncate">{dim.name}</span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-1000"
                                style={{ width: `${dim.score * 10}%` }}
                            />
                        </div>
                        <span className="text-xs font-bold text-slate-700 w-8">{dim.score}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// Executive Summary Preview
const SummaryPreview = ({ isHovered }) => (
    <div className={`transition-all duration-500 ${isHovered ? 'scale-105' : ''}`}>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-amber-500" />
                <p className="text-xs font-bold uppercase tracking-widest text-amber-600">Executive Summary</p>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                {sampleReport.executiveSummary}
            </p>
        </div>
    </div>
);

// Locked Section Preview (teaser)
const LockedPreview = ({ title, icon: Icon }) => (
    <div className="relative">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-lg filter blur-[2px]">
            <div className="h-3 w-3/4 bg-slate-200 rounded mb-2"></div>
            <div className="h-3 w-1/2 bg-slate-200 rounded mb-3"></div>
            <div className="grid grid-cols-2 gap-2">
                <div className="h-8 bg-slate-100 rounded"></div>
                <div className="h-8 bg-slate-100 rounded"></div>
            </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-2xl">
            <div className="text-center">
                <Lock className="w-5 h-5 mx-auto mb-1 text-slate-400" />
                <p className="text-xs font-bold text-slate-500">{title}</p>
            </div>
        </div>
    </div>
);

// Main Stacked Cards Component for Landing Page
export const ReportPreviewCards = () => {
    const [hoveredCard, setHoveredCard] = useState(null);

    return (
        <div className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <Badge className="bg-violet-100 text-violet-700 font-bold mb-4">
                        <Sparkles className="w-3 h-3 mr-1" /> PREVIEW
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
                        See What You'll Get
                    </h2>
                    <p className="text-slate-500 max-w-lg mx-auto">
                        Here's a sneak peek of the comprehensive analysis for <span className="font-bold text-violet-600">"{sampleReport.brandName}"</span>
                    </p>
                </div>

                {/* Brand Name Display */}
                <div className="text-center mb-8">
                    <h3 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
                        {sampleReport.brandName}
                    </h3>
                    <div className="flex justify-center gap-2 mt-3">
                        <Badge className="bg-slate-900 text-white">{sampleReport.verdict}</Badge>
                        <Badge variant="outline" className="text-slate-500">Premium Tech</Badge>
                    </div>
                </div>

                {/* Stacked Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {/* Score Card - Main */}
                    <div 
                        className="md:col-span-1 cursor-pointer transform transition-all duration-300 hover:-translate-y-2"
                        onMouseEnter={() => setHoveredCard('score')}
                        onMouseLeave={() => setHoveredCard(null)}
                    >
                        <ScoreCardPreview isHovered={hoveredCard === 'score'} />
                    </div>

                    {/* Summary Card */}
                    <div 
                        className="md:col-span-2 cursor-pointer transform transition-all duration-300 hover:-translate-y-2"
                        onMouseEnter={() => setHoveredCard('summary')}
                        onMouseLeave={() => setHoveredCard(null)}
                    >
                        <SummaryPreview isHovered={hoveredCard === 'summary'} />
                    </div>

                    {/* Dimensions Card */}
                    <div 
                        className="md:col-span-2 cursor-pointer transform transition-all duration-300 hover:-translate-y-2"
                        onMouseEnter={() => setHoveredCard('dimensions')}
                        onMouseLeave={() => setHoveredCard(null)}
                    >
                        <DimensionsPreview isHovered={hoveredCard === 'dimensions'} />
                    </div>

                    {/* Locked Preview */}
                    <div className="md:col-span-1 transform transition-all duration-300 hover:-translate-y-1">
                        <LockedPreview title="Trademark Risk" icon={Shield} />
                    </div>
                </div>

                {/* Strengths Pills */}
                <div className="flex flex-wrap justify-center gap-2 mt-8">
                    {sampleReport.strengths.map((strength, i) => (
                        <Badge key={i} variant="outline" className="bg-white text-slate-600 border-slate-200 font-medium">
                            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" />
                            {strength}
                        </Badge>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Compact Preview for Auth Modal
export const ReportPreviewCompact = () => (
    <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 mb-6 border border-slate-100">
        <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-violet-500" />
            <span className="text-xs font-bold text-slate-600">SAMPLE REPORT PREVIEW</span>
        </div>
        
        <div className="flex items-center gap-4 mb-3">
            <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl flex flex-col items-center justify-center border border-emerald-200">
                    <span className="text-xl font-black text-emerald-600">87</span>
                    <span className="text-[8px] text-emerald-500 font-bold">SCORE</span>
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 text-sm">{sampleReport.brandName}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    Strong brand identity with excellent trademark clearance...
                </p>
            </div>
            <Badge className="bg-emerald-500 text-white text-xs font-bold flex-shrink-0">GO</Badge>
        </div>

        {/* Mini dimension bars */}
        <div className="grid grid-cols-2 gap-2">
            {sampleReport.dimensions.slice(0, 2).map((dim, i) => (
                <div key={i} className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 w-16 truncate">{dim.name}</span>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-violet-500 rounded-full"
                            style={{ width: `${dim.score * 10}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-center gap-1 text-xs text-slate-400">
            <Lock className="w-3 h-3" />
            <span>Register to unlock full analysis</span>
        </div>
    </div>
);

export default ReportPreviewCards;
