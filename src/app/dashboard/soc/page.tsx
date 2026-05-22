"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import {
  ArrowRight,
  Bot,
  Brain,
  CheckCircle,
  FileSpreadsheet,
  Flame,
  GraduationCap,
  Layers,
  Lock,
  MailCheck,
  RefreshCw,
  Rocket,
  Shield,
  Target,
  Users
} from "lucide-react";
import { useSim } from "@/context/SimContext";
import DashboardCard from "@/components/DashboardCard";
import RadarScan from "@/components/RadarScan";
import LiveThreatMap from "@/components/LiveThreatMap";
import ChartMount from "@/components/ChartMount";

export default function SocDashboard() {
  const { campaigns, departments, employees, logs, templates, trainingCourses, runPrototypeDemo } = useSim();
  const [demoRan, setDemoRan] = useState(false);

  // Aggregate global statistics
  const stats = useMemo(() => {
    const totalSent = campaigns.reduce((acc, c) => acc + c.emailsSent, 0);
    const totalOpened = campaigns.reduce((acc, c) => acc + c.emailsOpened, 0);
    const totalClicks = campaigns.reduce((acc, c) => acc + c.linksClicked, 0);
    const totalCompromised = campaigns.reduce((acc, c) => acc + c.credentialsSubmitted, 0);
    const totalReported = campaigns.reduce((acc, c) => acc + c.emailsReported, 0);

    const clickRate = totalSent > 0 ? Math.round((totalClicks / totalSent) * 100) : 0;
    const submitRate = totalClicks > 0 ? Math.round((totalCompromised / totalClicks) * 100) : 0;
    const reportingRate = totalSent > 0 ? Math.round((totalReported / totalSent) * 100) : 0;

    // Resilience rating calculates reports vs compromises
    const resilienceScore = Math.max(5, Math.min(99, Math.round(100 - (clickRate * 0.4 + (totalCompromised / Math.max(1, totalSent)) * 60))));

    return {
      totalSent,
      totalOpened,
      totalClicks,
      totalCompromised,
      totalReported,
      clickRate,
      submitRate,
      reportingRate,
      resilienceScore
    };
  }, [campaigns]);

  // Map departments data for Recharts visualization
  const deptChartData = useMemo(() => {
    return departments.map(d => ({
      name: d.name.replace(" & Accounting", "").replace(" & IT", ""),
      "Risk Score": d.riskScore,
      "Report Rate": d.emailsSent > 0 ? Math.round((d.emailsReported / d.emailsSent) * 100) : 20,
      "Click Rate": d.emailsSent > 0 ? Math.round((d.linksClicked / d.emailsSent) * 100) : 30
    }));
  }, [departments]);

  // Campaign comparison trend line data
  const campaignHistoryData = useMemo(() => {
    return [...campaigns].reverse().map((c) => ({
      name: c.name.substring(0, 15) + "...",
      "Click %": c.emailsSent > 0 ? Math.round((c.linksClicked / c.emailsSent) * 100) : 0,
      "Report %": c.emailsSent > 0 ? Math.round((c.emailsReported / c.emailsSent) * 100) : 0,
      "Compromised %": c.emailsSent > 0 ? Math.round((c.credentialsSubmitted / c.emailsSent) * 100) : 0
    }));
  }, [campaigns]);

  // Check current threat status
  const threatLevel = useMemo(() => {
    if (stats.clickRate > 50 || stats.totalCompromised > 15) return { text: "CRITICAL ALARM", color: "text-rose-500 bg-rose-500/10 border-rose-500/20" };
    if (stats.clickRate > 25) return { text: "ELEVATED CONCERN", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" };
    return { text: "OPTIMIZED SHIELD", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" };
  }, [stats]);

  const assignedTrainingCount = useMemo(() => trainingCourses.filter((course) => course.status === "Assigned").length, [trainingCourses]);
  const criticalEmployeeCount = useMemo(() => employees.filter((employee) => employee.riskScore >= 80).length, [employees]);
  const activeCampaign = useMemo(() => campaigns.find((campaign) => campaign.status === "Active"), [campaigns]);

  const problemFlow = [
    { label: "Launch", detail: "Admin deploys safe phishing campaign", icon: Rocket, color: "text-primary" },
    { label: "Observe", detail: "Opens, clicks, reports, and demo submissions update live", icon: MailCheck, color: "text-amber-400" },
    { label: "Score", detail: "Human risk scores change by user and department", icon: Brain, color: "text-secondary" },
    { label: "Train", detail: "Adaptive courses unlock for failed users", icon: GraduationCap, color: "text-accent" },
    { label: "Report", detail: "Executive analytics exports prove posture", icon: FileSpreadsheet, color: "text-emerald-400" }
  ];

  const featureTiles = [
    { label: "AI templates", value: templates.length, sub: "attack scenarios", href: "/dashboard/templates", icon: Layers, color: "text-primary" },
    { label: "Employees", value: employees.length, sub: "risk profiles", href: "/dashboard/risk", icon: Users, color: "text-secondary" },
    { label: "Critical users", value: criticalEmployeeCount, sub: "need action", href: "/dashboard/risk", icon: Flame, color: "text-rose-400" },
    { label: "Training", value: assignedTrainingCount, sub: "assigned modules", href: "/dashboard/training", icon: GraduationCap, color: "text-accent" },
    { label: "AI coach", value: "Live", sub: "insight assistant", href: "/dashboard/ai-coach", icon: Bot, color: "text-primary" },
    { label: "Safe lab", value: "6+", sub: "simulation modes", href: "/dashboard/lab", icon: Lock, color: "text-emerald-400" }
  ];

  const handleRunDemo = () => {
    runPrototypeDemo();
    setDemoRan(true);
  };

  return (
    <div className="space-y-6">
      
      {/* HUD System Alerts Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-4">
        <div>
          <h1 className="font-outfit text-2xl font-black tracking-wide text-slate-100 flex items-center gap-2">
            SOC COMMAND CENTER
          </h1>
          <p className="text-xs text-slate-400 font-medium">Real-time organizational vector mapping & behavioral risk profiling.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Active Campaign Status indicator */}
          <div className={`px-3 py-1.5 rounded border text-[10px] font-mono font-bold tracking-wider ${threatLevel.color} flex items-center gap-1.5`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
            SYS-LEVEL: {threatLevel.text}
          </div>

          <div className="px-3 py-1.5 rounded border border-slate-800 bg-slate-950/60 text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "15s" }} />
            <span>REAL-TIME POLLING: ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Prototype Story Deck */}
      <div className="cyber-card rounded-xl border border-primary/20 bg-slate-950/60 p-5 md:p-6 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-70" />
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
          <div className="xl:col-span-5 text-left flex flex-col justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 rounded border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Simple prototype mode
              </div>
              <h2 className="mt-4 font-outfit text-2xl md:text-3xl font-black tracking-tight text-slate-100">
                One screen. Full phishing awareness lifecycle.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-400 max-w-xl">
                PhishNet AI solves the problem statement by safely simulating realistic phishing attacks, measuring employee behavior, scoring human cyber risk, assigning training, and generating executive-ready intelligence.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              {[
                { label: "Campaigns", value: campaigns.length },
                { label: "Events", value: logs.length },
                { label: "Departments", value: departments.length },
                { label: "Risk users", value: criticalEmployeeCount }
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-slate-900 bg-[#030308]/70 p-3">
                  <div className="text-xl font-black font-outfit text-slate-100">{item.value}</div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-500">{item.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleRunDemo}
                className="cyber-btn rounded px-5 py-3 text-[11px] font-mono flex items-center gap-2 cursor-pointer"
              >
                <Rocket className="h-4 w-4" />
                Run judge demo
              </button>
              <Link
                href="/portal"
                className="rounded border border-slate-800 bg-slate-950/80 px-5 py-3 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 hover:border-primary/40 hover:text-primary transition-colors flex items-center gap-2"
              >
                Employee portal <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard/reports"
                className="rounded border border-slate-800 bg-slate-950/80 px-5 py-3 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 hover:border-accent/40 hover:text-accent transition-colors flex items-center gap-2"
              >
                Export reports <FileSpreadsheet className="h-4 w-4" />
              </Link>
            </div>

            {demoRan && (
              <div className="rounded border border-emerald-500/20 bg-emerald-500/5 p-3 text-[11px] font-mono font-bold text-emerald-400">
                DEMO COMPLETE: live campaign, risky users, training assignments, AI brief, and report data have been generated.
              </div>
            )}
          </div>

          <div className="xl:col-span-7 grid grid-cols-1 md:grid-cols-5 gap-3">
            {problemFlow.map(({ label, detail, icon: Icon, color }, index) => (
              <div key={label} className="rounded-xl border border-slate-900 bg-[#030308]/65 p-4 min-h-36 flex flex-col justify-between">
                <div>
                  <div className={`h-9 w-9 rounded-lg border border-current/20 bg-current/5 flex items-center justify-center ${color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="mt-4 text-[10px] font-mono text-slate-500">STEP 0{index + 1}</div>
                  <div className="font-outfit text-sm font-bold text-slate-100 uppercase">{label}</div>
                </div>
                <p className="text-[10px] leading-relaxed text-slate-400 font-medium mt-3">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Overload Console */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
        {featureTiles.map(({ label, value, sub, href, icon: Icon, color }) => (
          <Link
            key={label}
            href={href}
            className="cyber-card rounded-xl border border-slate-900 bg-slate-950/40 p-4 hover:border-primary/30 transition-all min-h-28 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <Icon className={`h-5 w-5 ${color}`} />
              <ArrowRight className="h-3.5 w-3.5 text-slate-600" />
            </div>
            <div>
              <div className={`font-outfit text-2xl font-black ${color}`}>{value}</div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">{label}</div>
              <div className="text-[9px] font-mono uppercase tracking-wider text-slate-600">{sub}</div>
            </div>
          </Link>
        ))}
      </div>

      {activeCampaign && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 font-mono text-[11px] text-amber-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <span>
            ACTIVE STORY: <strong>{activeCampaign.name}</strong> is running across {activeCampaign.targetDepartments.length} departments with {activeCampaign.emailsSent} safe simulated deliveries.
          </span>
          <Link href="/dashboard/campaigns" className="text-amber-400 font-bold hover:text-amber-300 flex items-center gap-1">
            inspect campaign <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Main Aggregated KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cyber-card p-5 rounded-xl bg-slate-950/40 border border-slate-900/60 font-mono text-left relative overflow-hidden">
          <div className="absolute right-3 top-3 opacity-15"><Shield className="w-10 h-10 text-primary" /></div>
          <span className="text-[10px] text-slate-500 block font-bold tracking-wider">CYBER RESILIENCE RATIO</span>
          <span className="text-3xl font-extrabold font-outfit text-primary block my-1 shadow-sm">{stats.resilienceScore}%</span>
          <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold mt-2">
            <span>HUMAN FIREWALL STRENGTH</span>
            <span className="text-primary font-bold">STABLE</span>
          </div>
        </div>

        <div className="cyber-card p-5 rounded-xl bg-slate-950/40 border border-slate-900/60 font-mono text-left relative overflow-hidden">
          <div className="absolute right-3 top-3 opacity-15"><Target className="w-10 h-10 text-amber-500" /></div>
          <span className="text-[10px] text-slate-500 block font-bold tracking-wider">CAMPAIGN TEMPLATE CLICKS</span>
          <span className="text-3xl font-extrabold font-outfit text-amber-500 block my-1">{stats.clickRate}% click-thru</span>
          <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold mt-2">
            <span>TOTAL CLICK EVENTS: {stats.totalClicks}</span>
            <span className="text-amber-500 font-bold">WARNING</span>
          </div>
        </div>

        <div className="cyber-card p-5 rounded-xl bg-slate-950/40 border border-slate-900/60 font-mono text-left relative overflow-hidden">
          <div className="absolute right-3 top-3 opacity-15"><Flame className="w-10 h-10 text-rose-500" /></div>
          <span className="text-[10px] text-slate-500 block font-bold tracking-wider">CREDENTIAL COMPROMISES</span>
          <span className="text-3xl font-extrabold font-outfit text-rose-500 block my-1">{stats.totalCompromised} users</span>
          <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold mt-2">
            <span>EXPLOIT ATTEMPT RATIO: {stats.submitRate}%</span>
            <span className="text-rose-500 font-bold">CRITICAL</span>
          </div>
        </div>

        <div className="cyber-card p-5 rounded-xl bg-slate-950/40 border border-slate-900/60 font-mono text-left relative overflow-hidden">
          <div className="absolute right-3 top-3 opacity-15"><CheckCircle className="w-10 h-10 text-emerald-400" /></div>
          <span className="text-[10px] text-slate-500 block font-bold tracking-wider">SUCCESSFUL SUSPICION REPORTS</span>
          <span className="text-3xl font-extrabold font-outfit text-emerald-400 block my-1">{stats.reportingRate}% reported</span>
          <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold mt-2">
            <span>TOTAL Neutralizations: {stats.totalReported}</span>
            <span className="text-emerald-400 font-bold">SECURE</span>
          </div>
        </div>
      </div>

      {/* Threat Globe and Radar Command Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Animated Threat Vector Map */}
        <div className="lg:col-span-8">
          <DashboardCard title="LIVE THREAT VECTOR MONITOR" subtitle="Geographic simulation routing path analysis.">
            <LiveThreatMap />
          </DashboardCard>
        </div>

        {/* Real-time Cyber Radar Scanning Sweep */}
        <div className="lg:col-span-4">
          <DashboardCard title="REAL-TIME CYBER RADAR" subtitle="Live scanning active department profiles.">
            <RadarScan />
          </DashboardCard>
        </div>

      </div>

      {/* Analytics Graph Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Department vulnerability Heatmap */}
        <div className="lg:col-span-6">
          <DashboardCard title="DEPARTMENT SECURITY POSTURE" subtitle="Risk ratings vs active click outcomes by business group.">
            <ChartMount>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#060610",
                      borderColor: "rgba(0,240,255,0.2)",
                      color: "#fff",
                      fontSize: "11px",
                      fontFamily: "monospace"
                    }}
                  />
                  <Bar dataKey="Risk Score" fill="#ef4444" radius={[4, 4, 0, 0]} name="Risk Rating" />
                  <Bar dataKey="Click Rate" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Click-Thru %" />
                  <Bar dataKey="Report Rate" fill="#10b981" radius={[4, 4, 0, 0]} name="Report Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </ChartMount>
          </DashboardCard>
        </div>

        {/* Historical Campaign Performance Comparisons */}
        <div className="lg:col-span-6">
          <DashboardCard title="CAMPAIGN HISTORICAL SHIELD EFFICIENCY" subtitle="Vulnerability mitigation rates across launch sequences.">
            <ChartMount>
              {campaignHistoryData.length === 0 ? (
                <div className="h-full flex items-center justify-center font-mono text-xs text-slate-500">
                  No historical campaign coordinates available.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={campaignHistoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#060610",
                        borderColor: "rgba(0,240,255,0.2)",
                        color: "#fff",
                        fontSize: "11px",
                        fontFamily: "monospace"
                      }}
                    />
                    <Area type="monotone" dataKey="Click %" stroke="#f59e0b" fill="rgba(245,158,11,0.05)" strokeWidth={1.5} name="Click Ratio" />
                    <Area type="monotone" dataKey="Report %" stroke="#10b981" fill="rgba(16,185,129,0.05)" strokeWidth={1.5} name="Reporting Ratio" />
                    <Area type="monotone" dataKey="Compromised %" stroke="#ef4444" fill="rgba(239,68,68,0.05)" strokeWidth={1.5} name="Compromise Ratio" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </ChartMount>
          </DashboardCard>
        </div>

      </div>

      {/* Live Stream logs activity ticker */}
      <DashboardCard title="REAL-TIME THREAT LOGS TICKER" subtitle="Simulated employee interaction logs stream dynamically.">
        <div className="border border-slate-900 rounded bg-[#030308]/80 max-h-56 overflow-y-auto p-4 font-mono text-[11px] space-y-2 leading-relaxed">
          {logs.length === 0 ? (
            <div className="text-slate-500 text-center py-4">
              [SYSTEM] WAITING FOR VECTOR TRAFFIC INPUT...
            </div>
          ) : (
            logs.map((log) => {
              let alertClass = "text-sky-400";
              if (log.action === "CLICKED") alertClass = "text-amber-500";
              if (log.action === "CREDENTIALS_SUBMITTED") alertClass = "text-rose-500 font-bold";
              if (log.action === "REPORTED") alertClass = "text-emerald-400";

              return (
                <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-900/60 pb-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-slate-600 font-bold">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    <span className="text-slate-400">({log.department})</span>
                    <span className="text-slate-200">{log.employeeName}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] bg-slate-900 border border-slate-800 ${alertClass}`}>
                      {log.action}
                    </span>
                  </div>
                  <span className="text-slate-500 text-right mt-1 sm:mt-0 text-[10px]">{log.details}</span>
                </div>
              );
            })
          )}
        </div>
      </DashboardCard>

    </div>
  );
}
