import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { BrandRadarChart, ScoreCard, CompetitionAnalysis, TrademarkRiskTable, DomainAvailabilityCard } from '../components/AnalysisComponents';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Printer, ArrowLeft, CheckCircle2, XCircle, Star, Shield, Globe } from "lucide-react";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, query } = location.state || {};

  if (!data) {
    return (
        <div className="min-h-screen flex items-center justify-center flex-col bg-slate-50">
            <h2 className="text-xl mb-4 font-bold text-slate-800">No data found</h2>
            <Button onClick={() => navigate('/')}>Go Back</Button>
        </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-20 print:bg-white font-sans selection:bg-violet-200">
      {/* Navbar - Hidden on Print */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4 flex justify-between items-center print:hidden shadow-sm">
        <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="hover:bg-violet-50 hover:text-violet-600 rounded-full">
                <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600">RIGHTNAME</h1>
        </div>
        <Button onClick={handlePrint} variant="outline" className="gap-2 rounded-full border-2 hover:bg-slate-50">
            <Printer className="h-4 w-4" />
            Export PDF
        </Button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        
        {/* Header Section */}
        <section className="space-y-6">
            <div className="flex items-end justify-between">
                <div>
                     <Badge className="mb-4 bg-violet-100 text-violet-700 hover:bg-violet-200 border-0 px-3 py-1 text-xs tracking-wider font-bold">PROJECT REPORT</Badge>
                     <h1 className="text-5xl font-black text-slate-900 tracking-tight">{query.category} Analysis</h1>
                </div>
                <div className="text-right">
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mb-1">Market Scope</p>
                    <p className="font-bold text-xl text-slate-700">{query.market_scope}</p>
                </div>
            </div>
            <Card className="playful-card bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-xl">
                <CardContent className="pt-8 pb-8 px-8">
                    <h3 className="text-xs font-black uppercase tracking-widest text-violet-300 mb-4 flex items-center gap-2">
                        <Star className="w-4 h-4" /> Executive Summary
                    </h3>
                    <p className="text-xl font-medium leading-relaxed opacity-95 text-slate-100">
                        {data.executive_summary}
                    </p>
                </CardContent>
            </Card>
        </section>

        {/* Comparison Verdict */}
        {data.brand_scores.length > 1 && (
            <section className="bg-white p-8 rounded-3xl border-2 border-blue-100 shadow-lg shadow-blue-50">
                <div className="flex items-center gap-3 mb-4">
                     <span className="text-3xl">🏆</span>
                     <h2 className="text-2xl font-extrabold text-slate-900">Final Verdict</h2>
                </div>
                <p className="text-xl text-slate-700 font-medium leading-relaxed border-l-4 border-blue-500 pl-6">
                    {data.comparison_verdict}
                </p>
            </section>
        )}

        {/* Brand Details */}
        <div className="grid grid-cols-1 gap-24">
            {data.brand_scores.map((brand, idx) => (
                <div key={idx} className="space-y-12 break-inside-avoid">
                    
                    {/* Brand Header */}
                    <div className="flex items-center justify-between border-b-2 border-slate-100 pb-6">
                        <h2 className="text-6xl font-black tracking-tighter text-slate-900 flex items-center gap-4">
                            {brand.brand_name}
                            {brand.verdict === 'GO' && <CheckCircle2 className="w-10 h-10 text-emerald-500" />}
                        </h2>
                         <Badge className={`text-xl px-6 py-2 rounded-full font-bold ${
                            brand.verdict === 'GO' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-500'
                         }`}>
                            {brand.verdict}
                         </Badge>
                    </div>

                    {/* Overall Strategic Verdict Section */}
                    <Card className="playful-card bg-white border-0 ring-1 ring-slate-100">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="text-xs font-black uppercase text-slate-400 tracking-widest">Strategy Snapshot</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-8">
                            <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                <span className="text-violet-500">❝</span>
                                {brand.strategic_classification || "Analysis unavailable"}
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                                    <h4 className="flex items-center text-sm font-black text-emerald-700 uppercase mb-4 tracking-wide">
                                        <CheckCircle2 className="w-5 h-5 mr-2" />
                                        Delivers
                                    </h4>
                                    <ul className="space-y-3">
                                        {brand.pros && brand.pros.map((pro, i) => (
                                            <li key={i} className="flex items-start text-base text-slate-700 font-medium">
                                                <span className="mr-3 text-emerald-500 font-bold">•</span>
                                                {pro}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100">
                                    <h4 className="flex items-center text-sm font-black text-rose-700 uppercase mb-4 tracking-wide">
                                        <XCircle className="w-5 h-5 mr-2" />
                                        Sacrifices
                                    </h4>
                                    <ul className="space-y-3">
                                        {brand.cons && brand.cons.map((con, i) => (
                                            <li key={i} className="flex items-start text-base text-slate-700 font-medium">
                                                <span className="mr-3 text-rose-500 font-bold">•</span>
                                                {con}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Core Metrics Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Scores & Domain */}
                        <div className="space-y-8">
                            <ScoreCard 
                                title="NameScore™ Index" 
                                score={brand.namescore} 
                                verdict={brand.verdict}
                                subtitle="Composite Consulting Grade"
                            />
                            
                            {/* Domain Availability */}
                            {brand.domain_analysis && (
                                <DomainAvailabilityCard analysis={brand.domain_analysis} />
                            )}
                        </div>

                        {/* Middle Column: Radar */}
                        <div className="playful-card p-4 flex items-center justify-center bg-white">
                            <BrandRadarChart data={brand.dimensions} />
                        </div>

                         {/* Right Column: Cultural & Positioning */}
                         <div className="space-y-8">
                            <Card className="playful-card border-l-4 border-l-cyan-400">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xs font-bold uppercase text-cyan-500 tracking-widest">Positioning Fit</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <p className="text-base font-medium text-slate-700 leading-relaxed">{brand.positioning_fit}</p>
                                </CardContent>
                            </Card>

                             <Card className="playful-card border-l-4 border-l-fuchsia-400">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xs font-bold uppercase text-fuchsia-500 tracking-widest flex items-center gap-2">
                                        <Globe className="w-3 h-3" /> Cultural Resonance
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6 pt-4">
                                    {brand.cultural_analysis.map((c, i) => (
                                        <div key={i} className="bg-fuchsia-50/50 p-4 rounded-xl">
                                            <div className="flex justify-between font-bold text-base mb-2 text-slate-800">
                                                <span>{c.country}</span>
                                                <span className="text-fuchsia-600">{c.cultural_resonance_score}/10</span>
                                            </div>
                                            <p className="text-sm text-slate-600 font-medium">{c.cultural_notes}</p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                         </div>
                    </div>

                    {/* Competitor Analysis Section */}
                    {brand.competitor_analysis && (
                        <div className="mt-8">
                            <CompetitionAnalysis data={brand.competitor_analysis} />
                        </div>
                    )}
                    
                    {/* Trademark Risk Matrix Section - SEPARATED & CLEARLY PLACED */}
                    {brand.trademark_matrix && (
                        <div className="mt-16">
                            <div className="flex items-center space-x-4 mb-8">
                                <div className="h-10 w-1 bg-gradient-to-b from-rose-500 to-orange-500 rounded-full"></div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900">Legal Risk Analysis</h3>
                                    <p className="text-slate-500 font-medium">Detailed breakdown of potential IP conflicts</p>
                                </div>
                            </div>
                            <TrademarkRiskTable matrix={brand.trademark_matrix} />
                        </div>
                    )}


                    {/* Detailed Framework Analysis - Full Cards */}
                    <div className="mt-20 space-y-8">
                        <div className="flex items-center space-x-4 mb-8">
                             <div className="h-10 w-1 bg-gradient-to-b from-violet-500 to-blue-500 rounded-full"></div>
                             <div>
                                <h3 className="text-2xl font-black text-slate-900">Deep Dive Analysis</h3>
                                <p className="text-slate-500 font-medium">6-Factor Framework Breakdown</p>
                             </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {brand.dimensions.map((dim, i) => (
                                <Card key={i} className="playful-card border-slate-100 hover:translate-y-[-4px] transition-transform duration-300">
                                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg font-bold text-slate-800">{dim.name}</CardTitle>
                                            <Badge variant="outline" className="bg-white text-violet-600 font-black border-slate-200 text-lg px-3">
                                                {dim.score}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <div className="text-sm text-slate-600 leading-loose whitespace-pre-wrap font-medium">
                                            {dim.reasoning}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                </div>
            ))}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
