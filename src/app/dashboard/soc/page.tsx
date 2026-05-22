"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  Activity,
  ArrowRight,
  Award,
  Bot,
  Brain,
  CheckCircle,
  Cpu,
  FileText,
  Flame,
  GraduationCap,
  Lock,
  MailCheck,
  Network,
  Radar,
  RefreshCw,
  Shield,
  Sparkles,
  Target,
  Users,
  Zap
} from "lucide-react";
import { useSim } from "@/context/SimContext";
import DashboardCard from "@/components/DashboardCard";
import RadarScan from "@/components/RadarScan";
import LiveThreatMap from "@/components/LiveThreatMap";
import ChartMount from "@/components/ChartMount";

const OPEN_MODEL_STACK = [
  {
    id: "mesh",
    name: "Run All Models",
    model: "Free AI Mesh",
    role: "Orchestrates every local/open model for one executive verdict.",
    signal: "Campaign telemetry + employee behavior + training status",
    output: "Unified executive cyber-resilience verdict",
    color: "text-primary",
    border: "border-primary/30 bg-primary/5"
  },
  {
    id: "phishbert",
    name: "PhishBERT",
    model: "Email NLP",
    role: "Classifies phishing language, urgency, spoofing, and malicious intent.",
    signal: "Subject lines, sender cues, link intent, urgency language",
    output: "Template realism and phishing-indicator explanation",
    color: "text-[#EBEBEB]",
    border: "border-white/15 bg-white/[0.035]"
  },
  {
    id: "minilm",
    name: "MiniLM",
    model: "Behavior Clustering",
    role: "Groups employees by click, report, response, and training patterns.",
    signal: "Open rate, click rate, response time, repeat failures",
    output: "Vulnerable user segments and department clusters",
    color: "text-emerald-200",
    border: "border-emerald-400/25 bg-emerald-400/5"
  },
  {
    id: "mistral",
    name: "Mistral 7B",
    model: "SOC Reasoning",
    role: "Generates analyst-grade recommendations from live campaign data.",
    signal: "Risk hotspots, campaign trends, credential attempts",
    output: "SOC analyst recommendations and next actions",
    color: "text-amber-300",
    border: "border-amber-400/30 bg-amber-400/5"
  },
  {
    id: "llama",
    name: "Llama 3",
    model: "Executive Brief",
    role: "Turns raw telemetry into simple board-ready security language.",
    signal: "KPI summary, risk movement, department posture",
    output: "Board-ready executive report narrative",
    color: "text-emerald-300",
    border: "border-emerald-400/30 bg-emerald-400/5"
  },
  {
    id: "gemma",
    name: "Gemma",
    model: "Training Coach",
    role: "Recommends adaptive awareness modules for risky employees.",
    signal: "Click events, safe credential attempts, ignored warnings",
    output: "Adaptive training path and quiz assignment",
    color: "text-rose-300",
    border: "border-rose-400/30 bg-rose-400/5"
  }
];

const WORKFLOW_STEPS = [
  { title: "Simulate", text: "Launch safe phishing campaigns by department.", icon: Target, color: "text-primary" },
  { title: "Observe", text: "Track opens, clicks, reports, and demo submissions.", icon: Radar, color: "text-amber-400" },
  { title: "Score", text: "Convert behavior into human cyber risk scores.", icon: Brain, color: "text-secondary" },
  { title: "Train", text: "Assign micro-learning when users fail simulations.", icon: GraduationCap, color: "text-accent" },
  { title: "Report", text: "Export executive intelligence for leadership.", icon: FileText, color: "text-emerald-400" }
];

export default function SocDashboard() {
  const { campaigns, departments, employees, logs, templates, trainingCourses } = useSim();
  const [activeModel, setActiveModel] = useState(OPEN_MODEL_STACK[0]);
  const [activeAiFeature, setActiveAiFeature] = useState("risk-predictor");

  const stats = useMemo(() => {
    const totalSent = campaigns.reduce((acc, c) => acc + c.emailsSent, 0);
    const totalOpened = campaigns.reduce((acc, c) => acc + c.emailsOpened, 0);
    const totalClicks = campaigns.reduce((acc, c) => acc + c.linksClicked, 0);
    const totalCompromised = campaigns.reduce((acc, c) => acc + c.credentialsSubmitted, 0);
    const totalReported = campaigns.reduce((acc, c) => acc + c.emailsReported, 0);
    const activeCampaigns = campaigns.filter((c) => c.status === "Active").length;

    const openRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;
    const clickRate = totalSent > 0 ? Math.round((totalClicks / totalSent) * 100) : 0;
    const submitRate = totalClicks > 0 ? Math.round((totalCompromised / totalClicks) * 100) : 0;
    const reportingRate = totalSent > 0 ? Math.round((totalReported / totalSent) * 100) : 0;
    const resilienceScore = Math.max(5, Math.min(99, Math.round(100 - (clickRate * 0.45 + (totalCompromised / Math.max(1, totalSent)) * 70) + reportingRate * 0.18)));
    const avgDeptRisk = Math.round(departments.reduce((acc, dept) => acc + dept.riskScore, 0) / Math.max(1, departments.length));
    const criticalUsers = employees.filter((employee) => employee.riskScore >= 75).length;
    const assignedTraining = trainingCourses.filter((course) => course.status === "Assigned").length;

    return {
      totalSent,
      totalOpened,
      totalClicks,
      totalCompromised,
      totalReported,
      activeCampaigns,
      openRate,
      clickRate,
      submitRate,
      reportingRate,
      resilienceScore,
      avgDeptRisk,
      criticalUsers,
      assignedTraining
    };
  }, [campaigns, departments, employees, trainingCourses]);

  const threatLevel = useMemo(() => {
    if (stats.criticalUsers >= 4 || stats.totalCompromised > 12) {
      return { label: "CRITICAL HUMAN-RISK SURGE", tone: "text-rose-400 border-rose-500/30 bg-rose-500/10", pulse: "bg-rose-400" };
    }
    if (stats.clickRate > 25 || stats.avgDeptRisk > 55) {
      return { label: "ELEVATED SOCIAL-ENGINEERING EXPOSURE", tone: "text-amber-300 border-amber-400/30 bg-amber-400/10", pulse: "bg-amber-300" };
    }
    return { label: "RESILIENT HUMAN FIREWALL", tone: "text-emerald-300 border-emerald-400/30 bg-emerald-400/10", pulse: "bg-emerald-300" };
  }, [stats]);

  const topRiskDepartment = useMemo(() => [...departments].sort((a, b) => b.riskScore - a.riskScore)[0], [departments]);
  const safestDepartment = useMemo(() => [...departments].sort((a, b) => a.riskScore - b.riskScore)[0], [departments]);
  const topRiskEmployees = useMemo(() => [...employees].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5), [employees]);

  const deptChartData = useMemo(() => (
    departments.map((d) => ({
      name: d.name.replace(" & Accounting", "").replace(" & IT", ""),
      "Risk Score": d.riskScore,
      "Click Rate": d.emailsSent > 0 ? Math.round((d.linksClicked / d.emailsSent) * 100) : 0,
      "Report Rate": d.emailsSent > 0 ? Math.round((d.emailsReported / d.emailsSent) * 100) : 0
    }))
  ), [departments]);

  const campaignHistoryData = useMemo(() => (
    [...campaigns].reverse().map((c) => ({
      name: c.name.length > 15 ? `${c.name.substring(0, 15)}...` : c.name,
      "Click %": c.emailsSent > 0 ? Math.round((c.linksClicked / c.emailsSent) * 100) : 0,
      "Report %": c.emailsSent > 0 ? Math.round((c.emailsReported / c.emailsSent) * 100) : 0,
      "Compromise %": c.emailsSent > 0 ? Math.round((c.credentialsSubmitted / c.emailsSent) * 100) : 0
    }))
  ), [campaigns]);

  const riskDistribution = useMemo(() => [
    { name: "Safe", value: employees.filter((e) => e.riskScore <= 30).length, color: "#10b981" },
    { name: "Medium", value: employees.filter((e) => e.riskScore > 30 && e.riskScore <= 60).length, color: "#f59e0b" },
    { name: "High", value: employees.filter((e) => e.riskScore > 60 && e.riskScore < 75).length, color: "#fb7185" },
    { name: "Critical", value: employees.filter((e) => e.riskScore >= 75).length, color: "#ef4444" }
  ], [employees]);

  const aiInsight = useMemo(() => {
    const deptName = topRiskDepartment?.name || "No department";
    const safeName = safestDepartment?.name || "No department";
    const leadUser = topRiskEmployees[0];

    if (activeModel.id === "phishbert") {
      return `PhishBERT flags ${templates.length} active template patterns. The strongest triggers are urgency, spoofed domains, fake SSO portals, payroll fear, QR authentication, and executive pressure.`;
    }
    if (activeModel.id === "minilm") {
      return `MiniLM clusters ${employees.length} employees into behavior groups. ${deptName} is the highest-risk segment, while ${safeName} shows the strongest reporting behavior.`;
    }
    if (activeModel.id === "mistral") {
      return `Mistral recommends immediate manager coaching for ${deptName}, stricter verification on payroll/payment workflows, and a 48-hour follow-up simulation.`;
    }
    if (activeModel.id === "llama") {
      return `Executive summary: the organization has a ${stats.resilienceScore}/100 human-firewall score, ${stats.criticalUsers} critical users, and ${stats.reportingRate}% reporting coverage.`;
    }
    if (activeModel.id === "gemma") {
      return `Gemma assigns adaptive modules to ${stats.assignedTraining || 1} training path(s), prioritizing credential safety, QR phishing, and MFA fatigue awareness.`;
    }

    return `AI mesh verdict: ${deptName} needs priority action, ${leadUser?.name || "top risky users"} should receive guided training, and leadership can explain progress through resilience, reporting, click, and compromise metrics.`;
  }, [activeModel, employees, safestDepartment, stats, templates, topRiskDepartment, topRiskEmployees]);

  const modelConfidence = useMemo(() => {
    const base = 88 + Math.min(9, Math.round(logs.length / 5));
    return activeModel.id === "mesh" ? Math.min(99, base + 2) : Math.min(98, base);
  }, [activeModel.id, logs.length]);

  const explainBullets = [
    "The dashboard shows how employees react to safe phishing simulations.",
    "AI models analyze emails, behavior, departments, training needs, and executive risk.",
    "Risk scores update from clicks, reports, submissions, and training progress.",
    "Security teams can explain who is risky, why they are risky, and what action fixes it.",
    "All AI panels run in demo mode from local data, so the prototype works without paid API keys."
  ];

  const kpiCards = [
    { label: "Human Firewall Score", value: `${stats.resilienceScore}%`, sub: "Resilience against phishing", icon: Shield, color: "text-primary", bar: "bg-primary", progress: stats.resilienceScore, status: "EXECUTIVE" },
    { label: "Click Exposure", value: `${stats.clickRate}%`, sub: `${stats.totalClicks} risky click events`, icon: Target, color: "text-amber-400", bar: "bg-amber-400", progress: stats.clickRate, status: "WATCH" },
    { label: "Credential Events", value: stats.totalCompromised, sub: `${stats.submitRate}% submit-after-click`, icon: Flame, color: "text-rose-400", bar: "bg-rose-400", progress: Math.min(100, stats.totalCompromised * 8), status: "CRITICAL" },
    { label: "Self Reports", value: `${stats.reportingRate}%`, sub: `${stats.totalReported} threats neutralized`, icon: CheckCircle, color: "text-emerald-400", bar: "bg-emerald-400", progress: stats.reportingRate, status: "SECURE" }
  ];

  const featureTiles = [
    { title: "Campaign Engine", value: campaigns.length, href: "/dashboard/campaigns", icon: Zap, text: "Create, launch, and monitor simulations" },
    { title: "Template AI", value: templates.length, href: "/dashboard/templates", icon: Sparkles, text: "Generate realistic phishing scenarios" },
    { title: "Risk Intel", value: employees.length, href: "/dashboard/risk", icon: Users, text: "Score employees and departments" },
    { title: "Training", value: stats.assignedTraining, href: "/dashboard/training", icon: GraduationCap, text: "Adaptive learning assignments" },
    { title: "AI Assistant", value: "Live", href: "/dashboard/ai-coach", icon: Bot, text: "Ask natural-language SOC questions" },
    { title: "Reports", value: "CSV", href: "/dashboard/reports", icon: FileText, text: "Export executive evidence" }
  ];

  const problemStatementPoints = [
    "Configurable phishing simulation campaigns using safe, controlled templates",
    "AI-powered analytics for click rates, credential submissions, reporting behavior, and response patterns",
    "Department-level risk assessment dashboards and organizational vulnerability analysis",
    "Automated awareness training workflows triggered by simulated phishing behavior",
    "Secure campaign management and centralized monitoring"
  ];

  const requirementCards = [
    {
      title: "Controlled Campaigns",
      text: "Configurable phishing simulations using safe templates for Microsoft 365, payroll, invoices, QR phishing, CEO fraud, and MFA fatigue.",
      icon: Target,
      status: "Live",
      metric: `${campaigns.length} campaigns`,
      proof: "Campaign builder, scheduler, templates, and demo tracking",
      href: "/dashboard/campaigns"
    },
    {
      title: "AI Behavioral Analytics",
      text: "Click rates, credential-submission attempts, reporting behavior, response patterns, and resilience scores are calculated from live simulation data.",
      icon: Brain,
      status: "Live",
      metric: `${stats.clickRate}% click rate`,
      proof: "Human Cyber Risk Score, AI model mesh, trend analysis",
      href: "/dashboard/analytics"
    },
    {
      title: "Department Risk Assessment",
      text: "Risk heatmaps compare HR, Finance, Engineering, Sales, and Operations to reveal organizational vulnerability hotspots.",
      icon: Users,
      status: "Live",
      metric: `${stats.avgDeptRisk}/100 avg risk`,
      proof: "Department heatmaps, posture charts, executive hotspots",
      href: "/dashboard/risk"
    },
    {
      title: "Adaptive Training",
      text: "Awareness modules and quizzes are triggered when employees click links, submit demo credentials, or need reinforcement.",
      icon: GraduationCap,
      status: "Live",
      metric: `${stats.assignedTraining} assigned`,
      proof: "Auto training queue, quizzes, badges, employee portal",
      href: "/dashboard/training"
    },
    {
      title: "Secure Monitoring",
      text: "Centralized SOC command center with MFA-ready auth, RBAC-ready roles, audit logs, safe simulation design, and realtime event monitoring.",
      icon: Lock,
      status: "Live",
      metric: `${logs.length} events`,
      proof: "SOC dashboard, audit logs, JWT/RBAC architecture, reports",
      href: "/dashboard/settings"
    }
  ];

  const analyticsModels = [
    {
      name: "Human Cyber Risk Score",
      signal: "Opens, risky clicks, demo credential submissions, reports, repeat failures",
      output: `${stats.resilienceScore}/100 resilience score`,
      icon: Shield
    },
    {
      name: "Department Exposure Index",
      signal: "Aggregated department click rate, report rate, and credential-attempt rate",
      output: `${topRiskDepartment?.name || "Top department"} hotspot detection`,
      icon: Users
    },
    {
      name: "Response Pattern Analyzer",
      signal: "Time-to-open, time-to-click, time-to-report, recovery behavior",
      output: "Vulnerable cohorts and behavior clusters",
      icon: Activity
    },
    {
      name: "Adaptive Training Recommender",
      signal: "Simulation failures, ignored warning signs, weak reporting behavior",
      output: "Personalized awareness workflow",
      icon: GraduationCap
    },
    {
      name: "Executive Insight Generator",
      signal: "Campaign history, risk movement, training completion, live SOC events",
      output: "Board-ready technical report narrative",
      icon: FileText
    }
  ];

  const aiFeaturePanels = [
    {
      id: "risk-predictor",
      title: "Risk Predictor",
      label: "Predict vulnerable users",
      text: "AI ranks employees and departments by phishing susceptibility using clicks, submissions, reports, repeat failures, and training history.",
      metric: `${stats.criticalUsers} critical users`,
      decision: `${topRiskDepartment?.name || "Highest-risk department"} needs priority coaching`,
      action: "Assign adaptive training and schedule a follow-up campaign",
      icon: Brain
    },
    {
      id: "click-analytics",
      title: "Click Pattern AI",
      label: "Analyze click behavior",
      text: "Correlates open rate, click rate, response timing, and template type to expose risky behavior patterns without real phishing harm.",
      metric: `${stats.clickRate}% click exposure`,
      decision: `${stats.totalClicks} simulated risky clicks require awareness reinforcement`,
      action: "Run focused micro-training on link inspection and urgency pressure",
      icon: Target
    },
    {
      id: "credential-guard",
      title: "Credential Guard",
      label: "Detect safe submission attempts",
      text: "Flags safe demo credential submissions as high-signal training moments while avoiding real credential collection.",
      metric: `${stats.totalCompromised} demo submissions`,
      decision: `${stats.submitRate}% of clickers attempted credential entry`,
      action: "Trigger credential hygiene training and manager review",
      icon: Lock
    },
    {
      id: "reporting-coach",
      title: "Reporting Coach",
      label: "Improve reporting behavior",
      text: "Scores self-reporting behavior and recommends drills that turn employees into active sensors for the SOC team.",
      metric: `${stats.reportingRate}% report rate`,
      decision: `${stats.totalReported} simulated threats were reported by users`,
      action: "Reward strong reporters and repeat reporting drills for low-report teams",
      icon: MailCheck
    },
    {
      id: "training-orchestrator",
      title: "Training Orchestrator",
      label: "Auto-assign awareness modules",
      text: "Maps every failed simulation behavior to a specific awareness path, quiz, badge, and follow-up measurement cycle.",
      metric: `${stats.assignedTraining} active assignments`,
      decision: "Training is triggered by click, credential, and warning-ignore behavior",
      action: "Push adaptive modules for QR phishing, MFA fatigue, payroll scams, and fake SSO",
      icon: GraduationCap
    },
    {
      id: "executive-copilot",
      title: "Executive Copilot",
      label: "Generate leadership insight",
      text: "Converts raw telemetry into board-ready language, resilience metrics, department hotspots, and technical report evidence.",
      metric: `${stats.resilienceScore}/100 resilience`,
      decision: "Leadership can explain posture with measurable human-risk intelligence",
      action: "Export executive report and compare the next campaign cycle",
      icon: Bot
    }
  ];

  const activeFeature = aiFeaturePanels.find((feature) => feature.id === activeAiFeature) || aiFeaturePanels[0];

  const deliverableCards = [
    { title: "Deployment-Ready Prototype", text: "Next.js app, Express API, FastAPI AI layer, Prisma schema, Docker setup, and GitHub source code.", icon: Cpu },
    { title: "Campaign & Analytics Dashboard", text: "SOC dashboard, campaign management, template lab, risk intelligence, analytics center, and reports.", icon: Radar },
    { title: "Templates & Training Modules", text: `${templates.length} phishing templates and ${trainingCourses.length} awareness courses with quizzes and badges.`, icon: MailCheck },
    { title: "Security Architecture Docs", text: "README explains workflow, database schema, safe simulation design, Docker, API, and AI service strategy.", icon: Network },
    { title: "Technical Report Evidence", text: "Reports center exports campaign, department, employee, and threat-event CSV files for judges.", icon: FileText }
  ];

  const audienceCards = [
    "Enterprises",
    "Educational institutions",
    "Government agencies",
    "Cybersecurity trainers",
    "SOC teams"
  ];

  const architectureFlow = [
    { layer: "Frontend", value: "Next.js SOC Dashboard" },
    { layer: "API", value: "Express Secure Routes" },
    { layer: "AI", value: "FastAPI + Free Model Mesh" },
    { layer: "Data", value: "Prisma + PostgreSQL Ready" },
    { layer: "Realtime", value: "Socket.IO Event Stream" }
  ];

  const technicalReportSections = [
    { title: "Analytics Model", text: "Weighted scoring blends clicks, submissions, reports, timing, repeat failures, and training progress." },
    { title: "Security Controls", text: "Safe templates, sandboxed demo portals, JWT/RBAC/MFA design, rate limits, audit logs, and no real credential storage." },
    { title: "Implementation Strategy", text: "Next.js interface, Express routes, FastAPI AI service, Prisma/PostgreSQL schema, Socket.IO events, Docker deployment." },
    { title: "Workflow Evidence", text: "Campaign creation, simulated interaction, risk scoring, training automation, reports, and architecture documentation." }
  ];

  const heroStats = [
    { label: "Requirement Coverage", value: "5/5", icon: CheckCircle, color: "text-emerald-400", text: "All key features mapped" },
    { label: "Deliverables", value: "5/5", icon: Award, color: "text-primary", text: "Prototype, docs, reports" },
    { label: "AI Models", value: "6", icon: Brain, color: "text-[#EBEBEB]", text: "Free/local model mesh" },
    { label: "Live Events", value: logs.length, icon: Activity, color: "text-amber-400", text: "Realtime simulation logs" }
  ];

  return (
    <div className="soc-showcase space-y-8 pb-10">
      <div className="cyber-card relative overflow-hidden rounded-3xl border border-white/10 bg-[#050505] p-6 md:p-8 shadow-[0_30px_110px_rgba(0,0,0,0.58)]">
        <div className="absolute inset-0 cyber-grid opacity-40 pointer-events-none" />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />

        <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-4 py-2 cyber-metadata text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Hackathon Software Track / Live Prototype
            </div>
            <h1 className="mt-5 max-w-5xl font-outfit text-6xl md:text-8xl xl:text-9xl font-black leading-[0.86] tracking-tighter text-[#EBEBEB]">
              Human Firewall <span className="italic text-primary">Intelligence</span> Platform
            </h1>
            <p className="mt-6 max-w-4xl text-lg md:text-xl font-bold leading-relaxed text-white/78">
              PhishNet AI is a safe, controlled phishing simulation and cybersecurity awareness platform that lets organizations launch campaigns, analyze human behavior with AI, measure phishing resilience, and trigger adaptive training from one centralized SOC command center.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {problemStatementPoints.map((point, index) => (
                <div key={point} className="flex items-start gap-3 rounded-3xl border border-white/10 bg-white/[0.025] px-4 py-3">
                  <span className="mt-0.5 font-mono text-sm font-black text-primary">0{index + 1}</span>
                  <span className="text-base font-bold leading-relaxed text-white/88">{point}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/dashboard/campaigns" className="cyber-btn px-5 py-3 text-[11px] font-mono flex items-center gap-2">
                Launch Campaign <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/dashboard/reports" className="rounded-full border border-white/15 bg-white/[0.02] px-5 py-3 text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-white/70 transition-colors hover:border-primary/40 hover:text-primary">
                Executive Report
              </Link>
              <Link href="/dashboard/ai-coach" className="rounded-full border border-white/15 bg-white/[0.02] px-5 py-3 text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-white/70 transition-colors hover:border-primary/40 hover:text-primary">
                Ask AI Coach
              </Link>
            </div>
          </div>

          <div className="xl:col-span-5">
            <div className={`rounded-full border px-4 py-3 text-[11px] font-mono font-bold uppercase tracking-[0.18em] ${threatLevel.tone} flex items-center justify-between gap-3`}>
              <span className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${threatLevel.pulse} animate-pulse`} />
                {threatLevel.label}
              </span>
              <RefreshCw className="h-4 w-4 animate-spin" style={{ animationDuration: "12s" }} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {heroStats.map(({ label, value, icon: Icon, color, text }) => (
                <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.025] p-4">
                  <div className="flex items-center justify-between">
                    <Icon className={`h-4 w-4 ${color}`} />
                    <span className={`font-outfit text-4xl font-black ${color}`}>{value}</span>
                  </div>
                  <div className="mt-3 cyber-metadata text-white/80">{label}</div>
                  <div className="mt-1 text-sm font-bold text-white/62">{text}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-3xl border border-primary/20 bg-primary/[0.035] p-5">
              <div className="cyber-metadata text-primary">Judge-ready explanation</div>
              <p className="mt-3 text-lg font-bold leading-relaxed text-white/82">
                The prototype demonstrates source code, deployment-ready structure, campaign management, analytics visualization, safe simulated templates, awareness training, architecture workflow, and a technical-report narrative.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 cyber-card rounded-3xl border border-white/10 bg-white/[0.02] p-6 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 text-left">
              <p className="cyber-metadata text-primary">Explain this in 20 seconds</p>
              <h2 className="mt-3 font-outfit text-5xl md:text-6xl font-black tracking-tighter text-[#EBEBEB]">From phishing test to measurable cyber resilience.</h2>
              <p className="mt-4 text-lg font-bold leading-relaxed text-white/78">
                PhishNet AI launches safe simulated phishing, watches employee actions, scores human risk, predicts weak departments, assigns training, and gives leaders a live cybersecurity posture report.
              </p>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-5 gap-3">
                {WORKFLOW_STEPS.map(({ title, text, icon: Icon, color }, index) => (
                  <div key={title} className="relative rounded-3xl border border-white/10 bg-[#050505]/80 p-3 min-h-32 overflow-hidden">
                    <span className="absolute right-3 top-3 font-mono text-[10px] font-black text-white/10">0{index + 1}</span>
                    <Icon className={`h-5 w-5 ${color}`} />
                    <div className="mt-3 font-outfit text-2xl font-black text-[#EBEBEB]">{title}</div>
                    <p className="mt-1 text-sm font-bold leading-relaxed text-white/66">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 rounded-3xl border border-white/10 bg-[#050505]/80 p-4 font-mono">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="cyber-metadata text-white/40">AI Executive Brief</span>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1 text-[9px] font-bold text-emerald-400">LIVE</span>
              </div>
              <div className="mt-4 space-y-3">
                {explainBullets.map((bullet, index) => (
                  <div key={bullet} className="flex gap-2 text-[11px] leading-relaxed text-white/62">
                    <span className="text-primary font-bold">0{index + 1}</span>
                    <span className="font-semibold">{bullet}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 cyber-card rounded-3xl border border-white/10 bg-white/[0.02] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="cyber-metadata text-primary">AI Model Hub</p>
              <h3 className="mt-2 font-outfit text-4xl font-black tracking-tighter text-[#EBEBEB]">Free AI Model Mesh</h3>
            </div>
            <Cpu className="h-8 w-8 text-primary" />
          </div>
          <p className="mt-3 text-base font-bold leading-relaxed text-white/76">
            Demo-mode AI uses local telemetry and open/free model profiles. No paid API key is required for the dashboard analysis.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {OPEN_MODEL_STACK.map((model) => (
              <button
                key={model.id}
                onClick={() => setActiveModel(model)}
                className={`rounded-3xl border p-3 text-left transition-all cursor-pointer ${
                  activeModel.id === model.id ? `${model.border} shadow-[0_0_22px_rgba(16,185,129,0.10)]` : "border-white/10 bg-[#050505]/70 hover:border-primary/30"
                }`}
              >
                <div className={`font-mono text-sm font-black uppercase ${model.color}`}>{model.name}</div>
                <div className="mt-1 text-xs font-bold text-white/64">{model.model}</div>
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-3xl border border-white/10 bg-[#050505]/70 p-4">
            <div className="cyber-metadata text-white/55">Selected model output</div>
            <p className="mt-2 text-base font-bold leading-relaxed text-white/82">{activeModel.output}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map(({ label, value, sub, icon: Icon, color, bar, progress, status }) => (
          <div key={label} className="cyber-card rounded-3xl border border-white/10 bg-white/[0.02] p-5 text-left relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/45 to-transparent" />
            <Icon className={`absolute right-4 top-4 h-11 w-11 opacity-15 ${color}`} />
            <span className="cyber-metadata text-white/58 block">{label}</span>
            <span className={`text-6xl md:text-7xl font-black font-outfit tracking-tighter block my-1 ${color}`}>{value}</span>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className={`h-full rounded-full ${bar} transition-all duration-700`} style={{ width: `${Math.max(6, Math.min(100, progress))}%` }} />
            </div>
            <div className="mt-3 flex items-center justify-between gap-2 text-[9px] font-mono font-bold uppercase">
              <span className="text-sm text-white/68">{sub}</span>
              <span className={color}>{status}</span>
            </div>
          </div>
        ))}
      </div>

      <DashboardCard
        title="AI FEATURE COMMAND CENTER"
        subtitle="Simple demo-ready AI controls for the exact problem statement: campaigns, behavior analytics, department risk, training automation, and executive intelligence."
        glowColor="rgba(16, 185, 129, 0.16)"
      >
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className="xl:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {aiFeaturePanels.map(({ id, title, label, icon: Icon }) => {
              const isActive = activeFeature.id === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveAiFeature(id)}
                  className={`group rounded-3xl border p-4 text-left transition-all ${
                    isActive
                      ? "border-primary/45 bg-primary/[0.07] shadow-[0_0_34px_rgba(16,185,129,0.14)]"
                      : "border-white/10 bg-[#050505]/70 hover:border-primary/30 hover:bg-primary/[0.035]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-2.5">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className={`h-2.5 w-2.5 rounded-full ${isActive ? "bg-primary shadow-[0_0_16px_var(--primary)]" : "bg-white/20"}`} />
                  </div>
                  <h3 className="mt-4 font-outfit text-3xl font-black tracking-tighter text-[#EBEBEB]">{title}</h3>
                  <p className="mt-2 text-sm font-black uppercase tracking-[0.16em] text-white/68">{label}</p>
                </button>
              );
            })}
          </div>

          <div className="xl:col-span-5 rounded-3xl border border-primary/20 bg-[#050505]/80 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="cyber-metadata text-primary">Active AI Module</div>
                <h3 className="mt-3 font-outfit text-5xl md:text-6xl font-black tracking-tighter text-[#EBEBEB]">{activeFeature.title}</h3>
              </div>
              <activeFeature.icon className="h-9 w-9 text-primary" />
            </div>
            <p className="mt-5 text-lg font-bold leading-relaxed text-white/82">{activeFeature.text}</p>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-4">
                <div className="cyber-metadata text-white/50">Live Metric</div>
                <div className="mt-2 font-outfit text-4xl font-black tracking-tighter text-primary">{activeFeature.metric}</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-4">
                <div className="cyber-metadata text-white/50">AI Decision</div>
                <p className="mt-2 text-base font-bold leading-relaxed text-white/82">{activeFeature.decision}</p>
              </div>
            </div>

            <div className="mt-4 rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.04] p-4">
              <div className="cyber-metadata text-primary">Recommended Automation</div>
              <p className="mt-2 text-lg font-bold leading-relaxed text-white/86">{activeFeature.action}</p>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveModel(OPEN_MODEL_STACK[0])}
                className="cyber-btn px-5 py-3 text-[11px] font-mono"
              >
                Run AI Mesh
              </button>
              <Link href="/dashboard/ai-coach" className="rounded-full border border-white/15 bg-white/[0.02] px-5 py-3 text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-white/78 transition-colors hover:border-primary/40 hover:text-primary">
                Ask AI Assistant
              </Link>
            </div>
          </div>
        </div>
      </DashboardCard>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
        {featureTiles.map(({ title, value, href, icon: Icon, text }) => (
          <Link
            key={title}
            href={href}
            className="cyber-card group rounded-3xl border border-white/10 bg-white/[0.02] p-4 min-h-32 flex flex-col justify-between hover:border-primary/40 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-2xl border border-primary/15 bg-primary/5 p-2">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-white/25 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </div>
            <div>
              <div className="font-outfit text-5xl font-black tracking-tighter text-[#EBEBEB]">{value}</div>
              <div className="cyber-metadata text-white/70">{title}</div>
              <p className="mt-2 text-sm font-bold leading-relaxed text-white/66">{text}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <DashboardCard
            title="HACKATHON REQUIREMENT MATRIX"
            subtitle="Every problem-statement requirement is highlighted, measurable, and linked to a working module."
            glowColor="rgba(16, 185, 129, 0.14)"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-5 gap-4">
              {requirementCards.map(({ title, text, icon: Icon, status, metric, proof, href }, index) => (
                <Link key={title} href={href} className="group rounded-3xl border border-white/10 bg-[#050505]/70 p-4 min-h-56 text-left flex flex-col justify-between transition-all hover:border-primary/35 hover:bg-primary/[0.035]">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-black text-primary">R{index + 1}</span>
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="rounded-full border border-emerald-400/20 bg-emerald-400/5 px-2.5 py-1 text-[8px] font-mono font-bold uppercase text-emerald-400">
                        {status}
                      </span>
                    </div>
                    <h3 className="mt-4 font-outfit text-3xl font-black tracking-tighter text-[#EBEBEB]">{title}</h3>
                    <p className="mt-3 text-base font-bold leading-relaxed text-white/76">{text}</p>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div>
                      <div className="cyber-metadata text-white/50">Proof</div>
                      <div className="mt-2 text-sm font-bold leading-relaxed text-white/82">{proof}</div>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/10 pt-3">
                      <span className="font-mono text-sm font-black uppercase text-primary">{metric}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-white/25 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </DashboardCard>
        </div>

        <div className="xl:col-span-4">
          <DashboardCard
            title="IMPACT & TARGET AUDIENCE"
            subtitle="Who benefits from this platform and why it matters."
            glowColor="rgba(0, 255, 208, 0.14)"
          >
            <div className="rounded-3xl border border-white/10 bg-[#050505]/70 p-5">
              <p className="text-xl font-bold leading-relaxed text-white/84">
                PhishNet AI reduces phishing susceptibility, improves awareness, measures resilience, and strengthens security posture for high-risk organizations.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {audienceCards.map((audience) => (
                  <span key={audience} className="rounded-full border border-accent/20 bg-accent/5 px-3 py-1.5 text-[10px] font-mono font-bold uppercase text-accent">
                    {audience}
                  </span>
                ))}
              </div>
              <div className="mt-5 border-t border-white/10 pt-4">
                <div className="cyber-metadata text-primary">Impact claim</div>
                <p className="mt-3 text-base font-bold leading-relaxed text-white/76">
                  Enterprises, campuses, agencies, trainers, and SOC teams can prove resilience improvement using measurable user behavior instead of one-time awareness completion.
                </p>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>

      <DashboardCard
        title="AI ANALYTICS MODELS"
        subtitle="The intelligence layer converts campaign events into risk scores, vulnerable-user predictions, training triggers, and executive reports."
        glowColor="rgba(16, 185, 129, 0.13)"
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {analyticsModels.map(({ name, signal, output, icon: Icon }, index) => (
            <div key={name} className="rounded-3xl border border-white/10 bg-[#050505]/70 p-5 min-h-52">
              <div className="flex items-center justify-between">
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-2.5">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className="font-mono text-[10px] font-black text-white/15">M{index + 1}</span>
              </div>
              <h3 className="mt-4 font-outfit text-3xl font-black tracking-tighter text-[#EBEBEB]">{name}</h3>
              <div className="mt-4 space-y-3">
                <div>
                  <div className="cyber-metadata text-white/50">Signals</div>
                  <p className="mt-2 text-sm font-bold leading-relaxed text-white/76">{signal}</p>
                </div>
                <div>
                  <div className="cyber-metadata text-primary">Output</div>
                  <p className="mt-2 text-base font-black leading-relaxed text-white/86">{output}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7">
          <DashboardCard
            title="EXPECTED DELIVERABLES STATUS"
            subtitle="Judges can verify the required source code, dashboards, templates, training, security docs, and reports."
            glowColor="rgba(16, 185, 129, 0.12)"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-5 gap-4">
              {deliverableCards.map(({ title, text, icon: Icon }) => (
                <div key={title} className="rounded-3xl border border-white/10 bg-[#050505]/70 p-4 min-h-44 text-left">
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-2 w-fit">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="mt-3 font-outfit text-3xl font-black tracking-tighter text-[#EBEBEB]">{title}</h3>
                  <p className="mt-2 text-sm font-bold leading-relaxed text-white/74">{text}</p>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-2.5 py-1 text-[8px] font-mono font-bold uppercase text-emerald-400">
                    <CheckCircle className="h-3 w-3" />
                    Ready
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

        <div className="xl:col-span-5">
          <DashboardCard
            title="SECURITY ARCHITECTURE WORKFLOW"
            subtitle="A simple architecture map for explaining implementation strategy."
            glowColor="rgba(16, 185, 129, 0.14)"
          >
            <div className="space-y-3">
              {architectureFlow.map(({ layer, value }, index) => (
                <div key={layer} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl border border-primary/20 bg-primary/5 flex items-center justify-center font-mono text-[10px] font-black text-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1 rounded-3xl border border-white/10 bg-[#050505]/75 px-4 py-3">
                    <div className="cyber-metadata text-white/50">{layer}</div>
                    <div className="font-outfit text-2xl font-black tracking-tighter text-[#EBEBEB]">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>

      <DashboardCard
        title="TECHNICAL REPORT BLUEPRINT"
        subtitle="A clean explanation layer for analytics models, security considerations, and implementation strategy."
        glowColor="rgba(16, 185, 129, 0.12)"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {technicalReportSections.map(({ title, text }, index) => (
            <div key={title} className="rounded-3xl border border-white/10 bg-[#050505]/70 p-5">
              <div className="flex items-center justify-between">
                <span className="cyber-metadata text-primary">Section {index + 1}</span>
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <h3 className="mt-4 font-outfit text-3xl font-black tracking-tighter text-[#EBEBEB]">{title}</h3>
              <p className="mt-3 text-base font-bold leading-relaxed text-white/76">{text}</p>
            </div>
          ))}
        </div>
      </DashboardCard>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <DashboardCard
            title={`${activeModel.name.toUpperCase()} INTELLIGENCE OUTPUT`}
            subtitle={`${activeModel.model} confidence ${modelConfidence}% - generated from current simulation telemetry`}
            glowColor="rgba(16, 185, 129, 0.13)"
            headerAction={
              <div className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 font-mono text-[10px] font-bold text-primary">
                LOCAL / FREE AI
              </div>
            }
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-[#050505]/75 p-5 text-left">
                <div className="flex items-start gap-3">
                  <div className={`rounded-2xl border p-2.5 ${activeModel.border}`}>
                    <Brain className={`h-5 w-5 ${activeModel.color}`} />
                  </div>
                  <div>
                    <h3 className="font-outfit text-4xl font-black tracking-tighter text-[#EBEBEB]">{activeModel.name}</h3>
                    <p className="mt-2 text-base font-bold leading-relaxed text-white/78">{activeModel.role}</p>
                  </div>
                </div>
                <p className="mt-5 text-xl font-bold leading-relaxed text-white/86">{aiInsight}</p>
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-4">
                    <div className="cyber-metadata text-white/50">Input signals</div>
                    <p className="mt-2 text-sm font-bold leading-relaxed text-white/78">{activeModel.signal}</p>
                  </div>
                  <div className="rounded-3xl border border-primary/20 bg-primary/[0.035] p-4">
                    <div className="cyber-metadata text-primary">AI output</div>
                    <p className="mt-2 text-sm font-black leading-relaxed text-white/86">{activeModel.output}</p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3 font-mono text-center">
                  <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-3">
                    <div className="text-3xl font-black text-primary">{modelConfidence}%</div>
                    <div className="text-[9px] text-white/35 uppercase">confidence</div>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-3">
                    <div className="text-3xl font-black text-amber-400">{stats.avgDeptRisk}</div>
                    <div className="text-[9px] text-white/35 uppercase">avg risk</div>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-3">
                    <div className="text-3xl font-black text-rose-400">{stats.criticalUsers}</div>
                    <div className="text-[9px] text-white/35 uppercase">critical</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 rounded-3xl border border-white/10 bg-[#050505]/75 p-5">
                <div className="flex items-center justify-between">
                  <span className="cyber-metadata text-white/35">Recommended Actions</span>
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div className="mt-4 space-y-3 font-mono text-[11px]">
                  {[
                    `Prioritize ${topRiskDepartment?.name || "highest-risk department"} training.`,
                    `Coach ${topRiskEmployees[0]?.name || "highest-risk employee"} with credential safety.`,
                    `Increase reporting drills until report rate exceeds 70%.`,
                    `Export executive report after next campaign cycle.`
                  ].map((action, index) => (
                    <div key={action} className="flex gap-2 rounded-3xl border border-white/10 bg-white/[0.025] p-3 text-white/62">
                      <span className="text-primary font-bold">A{index + 1}</span>
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>

        <div className="xl:col-span-4">
          <DashboardCard title="EMPLOYEE TRIAGE QUEUE" subtitle="Top users by AI-predicted phishing vulnerability.">
            <div className="space-y-3 font-mono text-xs">
              {topRiskEmployees.map((employee, index) => (
                <div key={employee.id} className="flex items-center gap-3 rounded-xl border border-slate-900 bg-[#030308]/65 p-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-black ${
                    index === 0 ? "bg-rose-500/15 text-rose-400" : "bg-slate-900 text-slate-400"
                  }`}>
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-bold text-slate-200">{employee.name}</div>
                    <div className="truncate text-[10px] text-slate-500">{employee.department}</div>
                  </div>
                  <div className="text-right">
                    <div className={employee.riskScore >= 75 ? "font-black text-rose-400" : employee.riskScore >= 50 ? "font-black text-amber-400" : "font-black text-emerald-400"}>
                      {employee.riskScore}
                    </div>
                    <div className="text-[9px] text-slate-600">risk</div>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <DashboardCard title="LIVE THREAT VECTOR MONITOR" subtitle="Geographic simulation routing path analysis.">
            <LiveThreatMap />
          </DashboardCard>
        </div>

        <div className="lg:col-span-4">
          <DashboardCard title="REAL-TIME CYBER RADAR" subtitle="Recent behavior events plotted as live targets.">
            <RadarScan />
          </DashboardCard>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-6">
          <DashboardCard title="DEPARTMENT SECURITY POSTURE" subtitle="Risk, click exposure, and report behavior by business unit.">
            <ChartMount>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: "#060610", borderColor: "rgba(0,240,255,0.2)", color: "#fff", fontSize: "11px", fontFamily: "monospace" }} />
                  <Bar dataKey="Risk Score" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Click Rate" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Report Rate" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartMount>
          </DashboardCard>
        </div>

        <div className="xl:col-span-4">
          <DashboardCard title="CAMPAIGN TREND INTELLIGENCE" subtitle="Historical click, report, and compromise trendlines.">
            <ChartMount>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={campaignHistoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: "#060610", borderColor: "rgba(0,240,255,0.2)", color: "#fff", fontSize: "11px", fontFamily: "monospace" }} />
                  <Area type="monotone" dataKey="Click %" stroke="#f59e0b" fill="rgba(245,158,11,0.05)" strokeWidth={1.5} />
                  <Area type="monotone" dataKey="Report %" stroke="#10b981" fill="rgba(16,185,129,0.05)" strokeWidth={1.5} />
                  <Area type="monotone" dataKey="Compromise %" stroke="#ef4444" fill="rgba(239,68,68,0.05)" strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartMount>
          </DashboardCard>
        </div>

        <div className="xl:col-span-2">
          <DashboardCard title="RISK MIX" subtitle="Employee population.">
            <ChartMount className="h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskDistribution} dataKey="value" innerRadius={42} outerRadius={74} paddingAngle={4}>
                    {riskDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} fillOpacity={0.85} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#060610", borderColor: "rgba(0,240,255,0.2)", color: "#fff", fontSize: "11px", fontFamily: "monospace" }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartMount>
            <div className="space-y-2 font-mono text-[10px]">
              {riskDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-500">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <span className="font-bold text-slate-300">{item.value}</span>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>

      <DashboardCard title="REAL-TIME THREAT LOGS TICKER" subtitle="Live event stream across simulated deliveries, opens, clicks, reports, and safe credential-submission events.">
        <div className="border border-slate-900 rounded bg-[#030308]/80 max-h-64 overflow-y-auto p-4 font-mono text-[11px] space-y-2 leading-relaxed">
          {logs.length === 0 ? (
            <div className="text-slate-500 text-center py-4">[SYSTEM] WAITING FOR VECTOR TRAFFIC INPUT...</div>
          ) : (
            logs.slice(0, 40).map((log) => {
              let alertClass = "text-sky-400";
              if (log.action === "CLICKED") alertClass = "text-amber-400";
              if (log.action === "CREDENTIALS_SUBMITTED") alertClass = "text-rose-400 font-bold";
              if (log.action === "REPORTED") alertClass = "text-emerald-400";

              return (
                <div key={log.id} className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-900/60 pb-1.5 gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-slate-600 font-bold">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    <span className="text-slate-400">({log.department})</span>
                    <span className="text-slate-200">{log.employeeName}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] bg-slate-900 border border-slate-800 ${alertClass}`}>{log.action}</span>
                  </div>
                  <span className="text-slate-500 lg:text-right text-[10px]">{log.details}</span>
                </div>
              );
            })
          )}
        </div>
      </DashboardCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Security Architecture", value: "JWT + RBAC + MFA", icon: Lock },
          { label: "Realtime Layer", value: "Socket.IO Ready", icon: Network },
          { label: "AI Layer", value: "FastAPI + Free Models", icon: Cpu }
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-slate-900 bg-slate-950/40 p-4 flex items-center gap-3">
            <Icon className="h-5 w-5 text-primary" />
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">{label}</div>
              <div className="font-outfit text-sm font-bold text-slate-200">{value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
