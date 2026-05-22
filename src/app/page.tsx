"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Target, Cpu, Users, ArrowRight, Play, CheckCircle } from "lucide-react";
import LiveThreatMap from "@/components/LiveThreatMap";
import CyberParticles from "@/components/CyberParticles";
import PhishNetLogo from "@/components/PhishNetLogo";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative min-h-screen bg-[#020205] text-slate-100 overflow-hidden font-sans">
      
      {/* Cyber Particles background */}
      <CyberParticles />
      
      {/* Cyber Grid Background */}
      <div className="cyber-grid absolute inset-0 z-0"></div>
      
      {/* Glowing Neon Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Futuristic Header */}
      <header className="relative z-10 border-b border-slate-900 bg-slate-950/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <PhishNetLogo compact markClassName="h-11 w-11" />

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wider font-mono text-slate-400">
            <Link href="#features" className="hover:text-primary transition-colors">FEATURES</Link>
            <Link href="#map" className="hover:text-primary transition-colors">THREAT MAP</Link>
            <Link href="#analytics" className="hover:text-primary transition-colors">ANALYTICS</Link>
            <Link href="/portal" className="text-accent hover:text-accent/80 transition-colors flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              EMPLOYEE PORTAL
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold tracking-wider font-mono hover:text-primary transition-colors">
              LOG IN
            </Link>
            <Link href="/signup" className="cyber-btn text-xs px-4 py-2 rounded border border-primary/50 text-slate-100 flex items-center gap-1.5">
              GET STARTED <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Sections */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24">
        
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-mono text-primary font-bold mb-6 tracking-wide shadow-[0_0_12px_rgba(0,240,255,0.1)]">
              <Zap className="w-3.5 h-3.5" /> NEXT-GEN SOC SECURITY PARADIGM
            </div>
            
            <h1 className="font-outfit text-5xl md:text-6xl font-black leading-tight tracking-tight mb-6">
              Building <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent text-glow-primary">Human Firewalls</span> with Cyber-Intelligence
            </h1>
            
            <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed mb-8 max-w-2xl">
              Transform employee vulnerabilities into active cyber defense vectors. Launch dynamic AI-phishing campaigns, calculate real-time human risk scores, and deploy automated micro-learning models.
            </p>

            <div className="flex flex-wrap gap-4 w-full sm:w-auto">
              <Link href="/login" className="cyber-btn px-8 py-3.5 rounded text-sm tracking-wider font-mono flex items-center justify-center gap-2 group w-full sm:w-auto">
                DEPLOY SIMULATION <Play className="w-4 h-4 text-primary fill-primary group-hover:fill-slate-900 group-hover:text-slate-900" />
              </Link>
              <Link href="/portal" className="bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-300 px-8 py-3.5 rounded text-sm tracking-wider font-mono flex items-center justify-center gap-2 transition-all w-full sm:w-auto">
                ENTER EMPLOYEE PORTAL <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-12 w-full max-w-lg border-t border-slate-900 pt-8 text-left font-mono">
              <div>
                <span className="block text-2xl font-bold font-outfit text-primary">92%</span>
                <span className="text-[10px] text-slate-500 font-semibold tracking-wider">RESILIENCE RATING</span>
              </div>
              <div>
                <span className="block text-2xl font-bold font-outfit text-accent">0.8s</span>
                <span className="text-[10px] text-slate-500 font-semibold tracking-wider">THREAT REPORT AVG</span>
              </div>
              <div>
                <span className="block text-2xl font-bold font-outfit text-secondary">10K+</span>
                <span className="text-[10px] text-slate-500 font-semibold tracking-wider">HUMAN DEFENDERS</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            id="map"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 w-full flex flex-col justify-center"
          >
            <div className="p-1 rounded-xl bg-gradient-to-tr from-primary/20 via-transparent to-secondary/20 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
              <LiveThreatMap />
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="mb-24 text-center">
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="font-outfit text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              Comprehensive Human Risk Mitigation
            </h2>
            <p className="text-slate-400 text-md font-medium">
              We leverage adaptive machine learning to intercept social engineering at the weakest link: the human factor.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left"
          >
            <motion.div variants={itemVariants} className="cyber-card p-8 rounded-xl border border-slate-900 bg-slate-950/40">
              <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                <Cpu className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-outfit text-lg font-bold mb-3 tracking-wide">AI Campaign Synthesizer</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Generate highly convincing phishing templates and email drafts customized to departments. AI clones HR directives, invoice formats, and SSO authorization screens.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="cyber-card p-8 rounded-xl border border-slate-900 bg-slate-950/40">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-outfit text-lg font-bold mb-3 tracking-wide">Human Risk Intelligence</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Collect micro-analytics on email opens, click responses, credential submissions, and reporting latency. Translate user behaviors into quantified Risk Scores (0-100).
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="cyber-card p-8 rounded-xl border border-slate-900 bg-slate-950/40">
              <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-outfit text-lg font-bold mb-3 tracking-wide">Adaptive Training Path</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Trigger instant, personalized training assignments immediately when an employee fails a test. Boost defense awareness with gamified quizzes and leaderboard badges.
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* Dashboard Showcase Preview */}
        <section id="analytics" className="mb-16">
          <div className="cyber-card p-8 md:p-12 rounded-2xl border border-slate-900 bg-slate-950/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 blur-[80px] pointer-events-none"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 text-left">
                <h2 className="font-outfit text-3xl font-extrabold tracking-tight mb-4">
                  Futuristic SOC Command Center
                </h2>
                <p className="text-slate-400 text-md leading-relaxed mb-6 font-medium">
                  Equip security analysts with enterprise dashboards. Track live campaigns, examine real-time department threat profiles, interact with the AI assistant, and export audit reports instantly.
                </p>
                
                <ul className="space-y-3.5 font-medium text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span>Real-time Cyber Radar & Event Feed</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span>Cross-department vulnerability heatmap</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span>AI Cyber Coach integration</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span>Export audit reports (PDF / Excel)</span>
                  </li>
                </ul>

                <Link href="/login" className="cyber-btn mt-8 px-6 py-3 rounded text-xs tracking-wider font-mono inline-flex items-center gap-2">
                  ENTER AN ANALYST CONSOLE <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="lg:col-span-7 border border-slate-900 rounded-xl bg-slate-950/80 p-3 shadow-2xl relative">
                {/* Fake dashboard interface visualizer preview */}
                <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="text-[9px] font-mono text-slate-500 ml-2">SECURITY_CONTROLLER_V3.8</span>
                  </div>
                  <span className="text-[9px] font-mono text-primary font-bold">SECURE ENCRYPTED NODE</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-slate-900/60 p-4 rounded bg-[#030308]/60 text-left font-mono">
                    <span className="text-[10px] text-slate-500 block font-bold">HUMAN RISK SCORE</span>
                    <span className="text-2xl font-bold font-outfit text-amber-500">42.8 / 100</span>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: "42.8%" }}></div>
                    </div>
                  </div>

                  <div className="border border-slate-900/60 p-4 rounded bg-[#030308]/60 text-left font-mono">
                    <span className="text-[10px] text-slate-500 block font-bold">REPORTED CRITICAL THREATS</span>
                    <span className="text-2xl font-bold font-outfit text-emerald-400">91.4% RESILIENT</span>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full" style={{ width: "91.4%" }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 border border-slate-900/60 p-4 rounded bg-[#030308]/60 text-left font-mono">
                  <span className="text-[10px] text-slate-500 block font-bold mb-2">LIVE ANOMALY FEED (SIMULATED)</span>
                  <div className="space-y-1.5 text-[9px] font-mono leading-none">
                    <div className="text-emerald-400 flex justify-between">
                      <span>[REPORT] J. Connor flagged &quot;MFA fatigue scam&quot;</span>
                      <span className="text-slate-600">03s ago</span>
                    </div>
                    <div className="text-rose-500 flex justify-between">
                      <span>[EXPLOIT] D. Vance entered credentials &quot;M365 link&quot;</span>
                      <span className="text-slate-600">12s ago</span>
                    </div>
                    <div className="text-slate-400 flex justify-between">
                      <span>[DELIVERY] Payload email routed to HR staff</span>
                      <span className="text-slate-600">24s ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Cyber Footer */}
      <footer className="border-t border-slate-900 py-12 relative z-10 bg-slate-950/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-xs font-mono text-slate-500">
          <div>
            © 2026 PHISHNET AI CORP. ALL RIGHTS SECURED. PATENTED HUMAN-AI INTERFACE.
          </div>
          <div className="flex gap-6 mt-4 md:mt-0 font-semibold">
            <Link href="/portal" className="hover:text-primary">EMPLOYEE LEARNING NODE</Link>
            <Link href="/login" className="hover:text-primary">ANALYST NODE</Link>
            <span className="text-accent">STABLE DEMO CONSOLE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
