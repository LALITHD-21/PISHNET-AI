"use client";

import React, { useMemo } from "react";
import { Activity, AlertTriangle, Brain, Building2, Clock, MousePointerClick, ShieldCheck, Target } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import DashboardCard from "@/components/DashboardCard";
import ChartMount from "@/components/ChartMount";
import { useSim } from "@/context/SimContext";

export default function AnalyticsCenterPage() {
  const { campaigns, departments, employees, logs } = useSim();

  const aggregate = useMemo(() => {
    const sent = campaigns.reduce((sum, item) => sum + item.emailsSent, 0);
    const opened = campaigns.reduce((sum, item) => sum + item.emailsOpened, 0);
    const clicks = campaigns.reduce((sum, item) => sum + item.linksClicked, 0);
    const submitted = campaigns.reduce((sum, item) => sum + item.credentialsSubmitted, 0);
    const reported = campaigns.reduce((sum, item) => sum + item.emailsReported, 0);
    const clickRate = sent ? Math.round((clicks / sent) * 100) : 0;
    const reportRate = sent ? Math.round((reported / sent) * 100) : 0;
    const avgRisk = employees.length ? Math.round(employees.reduce((sum, emp) => sum + emp.riskScore, 0) / employees.length) : 0;
    const resilience = Math.max(0, Math.min(100, Math.round(100 - clickRate * 0.45 - (submitted / Math.max(1, sent)) * 80 + reportRate * 0.25)));
    return { sent, opened, clicks, submitted, reported, clickRate, reportRate, avgRisk, resilience };
  }, [campaigns, employees]);

  const campaignTrend = useMemo(() => campaigns.map((campaign) => ({
    name: campaign.name.length > 16 ? `${campaign.name.slice(0, 16)}...` : campaign.name,
    Sent: campaign.emailsSent,
    Clicked: campaign.linksClicked,
    Reported: campaign.emailsReported,
    Submitted: campaign.credentialsSubmitted,
    "Click %": campaign.emailsSent ? Math.round((campaign.linksClicked / campaign.emailsSent) * 100) : 0,
    "Report %": campaign.emailsSent ? Math.round((campaign.emailsReported / campaign.emailsSent) * 100) : 0
  })), [campaigns]);

  const departmentPosture = useMemo(() => departments.map((dept) => ({
    name: dept.name.replace(" & Accounting", "").replace(" & IT", ""),
    Risk: dept.riskScore,
    Clicks: dept.linksClicked,
    Reports: dept.emailsReported,
    Submissions: dept.credentialsSubmitted,
    "Click Rate": dept.emailsSent ? Math.round((dept.linksClicked / dept.emailsSent) * 100) : 0
  })), [departments]);

  const hourlyEvents = useMemo(() => {
    const buckets = Array.from({ length: 8 }, (_, index) => ({
      hour: `${index * 3}:00`,
      opened: 0,
      clicked: 0,
      reported: 0,
      submitted: 0
    }));

    logs.forEach((log) => {
      const bucket = Math.min(7, Math.floor(new Date(log.timestamp).getHours() / 3));
      if (log.action === "OPENED") buckets[bucket].opened += 1;
      if (log.action === "CLICKED") buckets[bucket].clicked += 1;
      if (log.action === "REPORTED") buckets[bucket].reported += 1;
      if (log.action === "CREDENTIALS_SUBMITTED") buckets[bucket].submitted += 1;
    });

    return buckets;
  }, [logs]);

  const riskMix = useMemo(() => [
    { name: "Safe", value: employees.filter((emp) => emp.riskScore <= 30).length, color: "#10b981" },
    { name: "Medium", value: employees.filter((emp) => emp.riskScore > 30 && emp.riskScore <= 60).length, color: "#f59e0b" },
    { name: "High", value: employees.filter((emp) => emp.riskScore > 60 && emp.riskScore <= 80).length, color: "#fb7185" },
    { name: "Critical", value: employees.filter((emp) => emp.riskScore > 80).length, color: "#ef4444" }
  ], [employees]);

  const kpis = [
    { label: "Human Firewall Index", value: `${aggregate.resilience}%`, icon: ShieldCheck, color: "text-emerald-400", caption: "Weighted by reports, clicks, and simulated submissions" },
    { label: "Average Risk Score", value: aggregate.avgRisk, icon: Brain, color: aggregate.avgRisk > 60 ? "text-rose-400" : "text-primary", caption: "Live average across employee profiles" },
    { label: "Click-Through Rate", value: `${aggregate.clickRate}%`, icon: MousePointerClick, color: "text-amber-400", caption: `${aggregate.clicks} clicks from ${aggregate.sent} simulated deliveries` },
    { label: "Self-Report Rate", value: `${aggregate.reportRate}%`, icon: AlertTriangle, color: "text-accent", caption: `${aggregate.reported} employee reports filed` }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row justify-between gap-4 border-b border-slate-900 pb-4">
        <div>
          <h1 className="font-outfit text-2xl font-black tracking-wide text-slate-100 uppercase flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" /> Analytics Center
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Executive cyber posture, behavioral analytics, and simulation performance intelligence.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] font-bold">
          <span className="rounded border border-primary/20 bg-primary/5 px-3 py-1.5 text-primary">REALTIME DEMO DATA</span>
          <span className="rounded border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-emerald-400">NO REAL SECRETS STORED</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map(({ label, value, icon: Icon, color, caption }) => (
          <div key={label} className="cyber-card rounded-xl border border-slate-900 bg-slate-950/50 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">{label}</p>
                <p className={`font-outfit text-3xl font-black mt-1 ${color}`}>{value}</p>
              </div>
              <Icon className={`w-8 h-8 ${color} opacity-60`} />
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-3">{caption}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <DashboardCard title="CAMPAIGN PERFORMANCE FABRIC" subtitle="Compares deliveries, clicks, reports, and simulated credential submissions.">
            <ChartMount className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={campaignTrend} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(148,163,184,0.08)" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: "#060610", borderColor: "rgba(0,240,255,0.2)", color: "#fff", fontSize: "11px", fontFamily: "monospace" }} />
                  <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 11 }} />
                  <Bar dataKey="Sent" fill="#38bdf8" radius={[4, 4, 0, 0]} fillOpacity={0.35} />
                  <Bar dataKey="Clicked" fill="#f59e0b" radius={[4, 4, 0, 0]} fillOpacity={0.7} />
                  <Line dataKey="Report %" stroke="#10b981" strokeWidth={2} dot={false} />
                  <Line dataKey="Click %" stroke="#ef4444" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartMount>
          </DashboardCard>
        </div>

        <div className="xl:col-span-4">
          <DashboardCard title="RISK CLASSIFICATION MIX" subtitle="Employee distribution by current risk category.">
            <ChartMount className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskMix} innerRadius={70} outerRadius={105} paddingAngle={4} dataKey="value">
                    {riskMix.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#060610", borderColor: "rgba(0,240,255,0.2)", color: "#fff", fontSize: "11px", fontFamily: "monospace" }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartMount>
            <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
              {riskMix.map((slice) => (
                <div key={slice.name} className="rounded border border-slate-900 bg-slate-950/50 px-3 py-2">
                  <span className="inline-block h-2 w-2 rounded-full mr-2" style={{ backgroundColor: slice.color }} />
                  <span className="text-slate-400">{slice.name}</span>
                  <span className="float-right text-slate-100 font-bold">{slice.value}</span>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7">
          <DashboardCard title="EVENT VELOCITY BY TIME WINDOW" subtitle="Interaction events grouped into three-hour windows.">
            <ChartMount className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyEvents} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
                  <XAxis dataKey="hour" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: "#060610", borderColor: "rgba(0,240,255,0.2)", color: "#fff", fontSize: "11px", fontFamily: "monospace" }} />
                  <Area type="monotone" dataKey="opened" stroke="#38bdf8" fill="rgba(56,189,248,0.08)" />
                  <Area type="monotone" dataKey="clicked" stroke="#f59e0b" fill="rgba(245,158,11,0.08)" />
                  <Area type="monotone" dataKey="submitted" stroke="#ef4444" fill="rgba(239,68,68,0.08)" />
                  <Area type="monotone" dataKey="reported" stroke="#10b981" fill="rgba(16,185,129,0.08)" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartMount>
          </DashboardCard>
        </div>

        <div className="xl:col-span-5">
          <DashboardCard title="DEPARTMENT BEHAVIOR HEATMAP" subtitle="Risk density and reporting efficiency by department.">
            <ChartMount className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentPosture} layout="vertical" margin={{ top: 0, right: 20, left: 15, bottom: 0 }}>
                  <XAxis type="number" stroke="#64748b" fontSize={10} />
                  <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={80} />
                  <Tooltip contentStyle={{ backgroundColor: "#060610", borderColor: "rgba(0,240,255,0.2)", color: "#fff", fontSize: "11px", fontFamily: "monospace" }} />
                  <Bar dataKey="Risk" fill="#ef4444" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="Reports" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartMount>
          </DashboardCard>
        </div>
      </div>

      <DashboardCard title="AI EXECUTIVE OBSERVATIONS" subtitle="Generated from the current demo telemetry snapshot.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="rounded-lg border border-slate-900 bg-slate-950/50 p-4">
            <Target className="w-5 h-5 text-amber-400 mb-3" />
            <p className="font-bold text-slate-200">Primary exposure</p>
            <p className="text-slate-500 mt-1">Click behavior is concentrated in {departments.slice().sort((a, b) => b.linksClicked - a.linksClicked)[0]?.name || "Finance"}.</p>
          </div>
          <div className="rounded-lg border border-slate-900 bg-slate-950/50 p-4">
            <Building2 className="w-5 h-5 text-primary mb-3" />
            <p className="font-bold text-slate-200">Department action</p>
            <p className="text-slate-500 mt-1">Prioritize short-form training for the top two departments by risk score before the next campaign.</p>
          </div>
          <div className="rounded-lg border border-slate-900 bg-slate-950/50 p-4">
            <Clock className="w-5 h-5 text-accent mb-3" />
            <p className="font-bold text-slate-200">Timing signal</p>
            <p className="text-slate-500 mt-1">Run follow-up simulations during high event windows and measure reporting latency improvement.</p>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}
