"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  BarChart3,
  Brain,
  CheckCircle,
  Clock,
  Download,
  FileSpreadsheet,
  Filter,
  Gauge,
  Layers,
  Pause,
  Play,
  Plus,
  Radio,
  Rocket,
  Search,
  ShieldAlert,
  ShieldCheck,
  Target,
  Users,
  Zap
} from "lucide-react";
import { useSim, type SimLog } from "@/context/SimContext";
import DashboardCard from "@/components/DashboardCard";

export default function CampaignsPage() {
  const { campaigns, templates, departments, logs, createCampaign, launchCampaign } = useSim();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [campName, setCampName] = useState("");
  const [tplId, setTplId] = useState(templates[0]?.id || "");
  const [targetDepts, setTargetDepts] = useState<string[]>([]);
  const [validationError, setValidationError] = useState("");
  const [isFeedPaused, setIsFeedPaused] = useState(false);
  const [feedSnapshot, setFeedSnapshot] = useState<SimLog[]>([]);
  const [exportStatus, setExportStatus] = useState("");
  const [systemTime, setSystemTime] = useState("--:--:--");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Draft" | "Completed">("All");
  const [selectedCampaignId, setSelectedCampaignId] = useState("");

  useEffect(() => {
    const updateClock = () => {
      setSystemTime(new Date().toLocaleTimeString([], { hour12: false }));
    };

    updateClock();
    const interval = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (campaigns.length === 0) {
      setSelectedCampaignId("");
      return;
    }

    if (!selectedCampaignId || !campaigns.some((campaign) => campaign.id === selectedCampaignId)) {
      setSelectedCampaignId(campaigns.find((campaign) => campaign.status === "Active")?.id || campaigns[0].id);
    }
  }, [campaigns, selectedCampaignId]);

  const activeCampaignNames = useMemo(
    () => campaigns.filter((campaign) => campaign.status === "Active").map((campaign) => campaign.name),
    [campaigns]
  );

  const liveFeedLogs = useMemo(() => {
    const activeLogs = logs.filter((log) => activeCampaignNames.includes(log.campaignName));
    return (activeLogs.length > 0 ? activeLogs : logs).slice(0, 18);
  }, [activeCampaignNames, logs]);

  const visibleFeedLogs = isFeedPaused ? feedSnapshot : liveFeedLogs;

  const feedStats = useMemo(() => ({
    critical: visibleFeedLogs.filter((log) => log.severity === "critical").length,
    clicks: visibleFeedLogs.filter((log) => log.action === "CLICKED").length,
    reports: visibleFeedLogs.filter((log) => log.action === "REPORTED").length,
    credentials: visibleFeedLogs.filter((log) => log.action === "CREDENTIALS_SUBMITTED").length
  }), [visibleFeedLogs]);

  const campaignStats = useMemo(() => {
    const totalSent = campaigns.reduce((acc, campaign) => acc + campaign.emailsSent, 0);
    const totalClicks = campaigns.reduce((acc, campaign) => acc + campaign.linksClicked, 0);
    const totalReports = campaigns.reduce((acc, campaign) => acc + campaign.emailsReported, 0);
    const totalCredentials = campaigns.reduce((acc, campaign) => acc + campaign.credentialsSubmitted, 0);
    const reportRate = totalSent > 0 ? Math.round((totalReports / totalSent) * 100) : 0;
    const clickRate = totalSent > 0 ? Math.round((totalClicks / totalSent) * 100) : 0;
    const defenseRate = Math.max(0, Math.min(100, Math.round(100 - clickRate + reportRate * 0.35 - totalCredentials * 0.8)));

    return {
      active: campaigns.filter((campaign) => campaign.status === "Active").length,
      draft: campaigns.filter((campaign) => campaign.status === "Draft").length,
      completed: campaigns.filter((campaign) => campaign.status === "Completed").length,
      totalSent,
      totalClicks,
      totalReports,
      totalCredentials,
      reportRate,
      clickRate,
      defenseRate
    };
  }, [campaigns]);

  const filteredCampaigns = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return campaigns.filter((campaign) => {
      const template = templates.find((item) => item.id === campaign.templateId);
      const matchesStatus = statusFilter === "All" || campaign.status === statusFilter;
      const haystack = [
        campaign.name,
        campaign.status,
        template?.name || "",
        template?.category || "",
        campaign.targetDepartments.join(" ")
      ].join(" ").toLowerCase();

      return matchesStatus && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }, [campaigns, searchQuery, statusFilter, templates]);

  const selectedCampaign = campaigns.find((campaign) => campaign.id === selectedCampaignId) || campaigns[0];
  const selectedTemplate = selectedCampaign ? templates.find((template) => template.id === selectedCampaign.templateId) : undefined;
  const selectedClickRate = selectedCampaign && selectedCampaign.emailsSent > 0 ? Math.round((selectedCampaign.linksClicked / selectedCampaign.emailsSent) * 100) : 0;
  const selectedReportRate = selectedCampaign && selectedCampaign.emailsSent > 0 ? Math.round((selectedCampaign.emailsReported / selectedCampaign.emailsSent) * 100) : 0;
  const selectedCredentialRate = selectedCampaign && selectedCampaign.emailsSent > 0 ? Math.round((selectedCampaign.credentialsSubmitted / selectedCampaign.emailsSent) * 100) : 0;
  const selectedDepartmentCoverage = selectedCampaign ? Math.round((selectedCampaign.targetDepartments.length / Math.max(1, departments.length)) * 100) : 0;

  const aiPlaybook = useMemo(() => {
    if (!selectedCampaign) {
      return [
        "Create a controlled phishing simulation to unlock AI campaign recommendations.",
        "Choose target departments and a safe template before launching."
      ];
    }

    const topDepartment = selectedCampaign.targetDepartments[0] || departments[0]?.name || "target department";
    return [
      `${selectedCampaign.name} is using ${selectedTemplate?.category || "controlled simulation"} behavior signals for risk scoring.`,
      selectedClickRate > 30
        ? `Click exposure is high at ${selectedClickRate}%. Trigger link-inspection training for ${topDepartment}.`
        : `Click exposure is controlled at ${selectedClickRate}%. Continue measuring reporting speed and repeat behavior.`,
      selectedCredentialRate > 0
        ? `${selectedCampaign.credentialsSubmitted} safe credential attempts detected. Assign credential-defense micro-training immediately.`
        : "No safe credential attempts in this campaign yet. Keep monitoring login-portal behavior.",
      selectedReportRate < 40
        ? `Reporting rate is ${selectedReportRate}%. Run reporting drills and reward fast reporters.`
        : `Reporting rate is ${selectedReportRate}%. Reporting culture is trending positively.`
    ];
  }, [departments, selectedCampaign, selectedClickRate, selectedCredentialRate, selectedReportRate, selectedTemplate]);

  const departmentTargetMatrix = useMemo(() => (
    departments
      .map((department) => ({
        ...department,
        targeted: selectedCampaign?.targetDepartments.includes(department.name) || false
      }))
      .sort((a, b) => Number(b.targeted) - Number(a.targeted) || b.riskScore - a.riskScore)
  ), [departments, selectedCampaign]);

  const escapeCsv = (value: string | number | boolean | null | undefined) => `"${String(value ?? "").replace(/"/g, '""')}"`;

  const downloadCsv = (filename: string, header: string[], rows: Array<Array<string | number | boolean | null | undefined>>) => {
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => escapeCsv(cell)).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFeedToggle = () => {
    if (isFeedPaused) {
      setIsFeedPaused(false);
      setExportStatus("Live feed resumed.");
    } else {
      setFeedSnapshot(liveFeedLogs);
      setIsFeedPaused(true);
      setExportStatus("Feed paused. Snapshot locked for review.");
    }
  };

  const handleExportRecentLogs = () => {
    const exportLogs = visibleFeedLogs.length > 0 ? visibleFeedLogs : liveFeedLogs;

    if (exportLogs.length === 0) {
      setExportStatus("No recent logs available to export yet.");
      return;
    }

    const header = ["timestamp", "campaign", "employee", "email", "department", "action", "severity", "details"];
    const rows = exportLogs.map((log) => [
      log.timestamp,
      log.campaignName,
      log.employeeName,
      log.employeeEmail,
      log.department,
      log.action,
      log.severity,
      log.details
    ]);

    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    downloadCsv(`phishnet_recent_threat_logs_${stamp}.csv`, header, rows);
    setExportStatus(`Exported ${exportLogs.length} recent SOC event logs.`);
  };

  const handleExportCampaigns = () => {
    if (filteredCampaigns.length === 0) {
      setExportStatus("No campaigns match the current filter.");
      return;
    }

    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    downloadCsv(
      `phishnet_campaign_register_${stamp}.csv`,
      ["campaign", "status", "template", "targets", "delivered", "opened", "clicks", "safe_credential_attempts", "reports", "created_at"],
      filteredCampaigns.map((campaign) => {
        const template = templates.find((item) => item.id === campaign.templateId);
        return [
          campaign.name,
          campaign.status,
          template?.name || "Unknown template",
          campaign.targetDepartments.join("; "),
          campaign.emailsSent,
          campaign.emailsOpened,
          campaign.linksClicked,
          campaign.credentialsSubmitted,
          campaign.emailsReported,
          campaign.createdAt
        ];
      })
    );
    setExportStatus(`Exported ${filteredCampaigns.length} campaign records.`);
  };

  const handleExportSelectedCampaign = () => {
    if (!selectedCampaign) {
      setExportStatus("Select a campaign before exporting.");
      return;
    }

    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    downloadCsv(
      `phishnet_campaign_intelligence_${selectedCampaign.id}_${stamp}.csv`,
      ["field", "value"],
      [
        ["Campaign", selectedCampaign.name],
        ["Status", selectedCampaign.status],
        ["Template", selectedTemplate?.name || "Unknown template"],
        ["Template Category", selectedTemplate?.category || "Unknown"],
        ["Target Departments", selectedCampaign.targetDepartments.join("; ")],
        ["Department Coverage", `${selectedDepartmentCoverage}%`],
        ["Emails Sent", selectedCampaign.emailsSent],
        ["Emails Opened", selectedCampaign.emailsOpened],
        ["Links Clicked", selectedCampaign.linksClicked],
        ["Safe Credential Attempts", selectedCampaign.credentialsSubmitted],
        ["Reports", selectedCampaign.emailsReported],
        ["Click Rate", `${selectedClickRate}%`],
        ["Report Rate", `${selectedReportRate}%`],
        ["Credential Attempt Rate", `${selectedCredentialRate}%`],
        ["AI Recommendation", aiPlaybook.join(" | ")]
      ]
    );
    setExportStatus(`Exported campaign intelligence for ${selectedCampaign.name}.`);
  };

  const getLogTone = (log: SimLog) => {
    if (log.action === "CREDENTIALS_SUBMITTED" || log.severity === "critical") {
      return {
        border: "border-rose-500/30 bg-rose-500/[0.045]",
        text: "text-rose-300",
        dot: "bg-rose-400 shadow-[0_0_16px_rgba(251,113,133,0.55)]"
      };
    }
    if (log.action === "CLICKED" || log.severity === "high") {
      return {
        border: "border-amber-400/30 bg-amber-400/[0.045]",
        text: "text-amber-300",
        dot: "bg-amber-300 shadow-[0_0_16px_rgba(251,191,36,0.45)]"
      };
    }
    if (log.action === "REPORTED") {
      return {
        border: "border-emerald-400/30 bg-emerald-400/[0.045]",
        text: "text-emerald-300",
        dot: "bg-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.45)]"
      };
    }
    return {
      border: "border-white/10 bg-white/[0.025]",
      text: "text-white/70",
      dot: "bg-primary shadow-[0_0_16px_rgba(16,185,129,0.35)]"
    };
  };

  const handleDeptToggle = (name: string) => {
    if (targetDepts.includes(name)) {
      setTargetDepts(targetDepts.filter(d => d !== name));
    } else {
      setTargetDepts([...targetDepts, name]);
    }
  };

  const handleSelectAllDepts = () => {
    if (targetDepts.length === departments.length) {
      setTargetDepts([]);
    } else {
      setTargetDepts(departments.map(d => d.name));
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campName) {
      setValidationError("Campaign name is required.");
      return;
    }
    if (targetDepts.length === 0) {
      setValidationError("Please select at least one target department.");
      return;
    }

    createCampaign(campName, tplId, targetDepts);
    
    // Reset state
    setCampName("");
    setTargetDepts([]);
    setValidationError("");
    setShowCreateModal(false);
  };

  const commandMetrics = [
    { label: "Active Campaigns", value: campaignStats.active, sub: `+${campaignStats.draft} drafts ready`, icon: Rocket, tone: "text-primary" },
    { label: "Targeted Users", value: campaignStats.totalSent, sub: "safe simulated delivery", icon: Users, tone: "text-[#EBEBEB]" },
    { label: "Click Exposure", value: `${campaignStats.clickRate}%`, sub: `${campaignStats.totalClicks} risky clicks`, icon: Target, tone: "text-amber-300" },
    { label: "Defense Rate", value: `${campaignStats.defenseRate}%`, sub: `${campaignStats.totalReports} user reports`, icon: ShieldCheck, tone: "text-emerald-300" },
    { label: "Safe Cred Attempts", value: campaignStats.totalCredentials, sub: "no real credentials stored", icon: ShieldAlert, tone: "text-rose-300" }
  ];

  return (
    <div className="soc-showcase space-y-7">
      <div className="cyber-card relative overflow-hidden rounded-3xl border border-white/10 bg-[#050505] p-6 md:p-8">
        <div className="absolute inset-0 cyber-grid opacity-45 pointer-events-none" />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />
        <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-6 items-end">
          <div className="xl:col-span-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-4 py-2 cyber-metadata text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Campaign Engine / Controlled Simulation Ops
            </div>
            <h1 className="mt-5 font-outfit text-6xl md:text-8xl font-black leading-[0.88] tracking-tighter text-[#EBEBEB]">
              Simulation Campaign <span className="italic text-primary">Command</span>
            </h1>
            <p className="mt-5 max-w-4xl text-lg font-bold leading-relaxed text-white/74">
              Create safe phishing campaigns, launch controlled templates, track employee behavior, export recent logs, and convert every signal into AI-guided awareness action.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="cyber-btn px-5 py-3 text-[11px] font-mono flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Initiate Campaign
              </button>
              <button
                onClick={handleExportCampaigns}
                className="rounded-full border border-white/15 bg-white/[0.02] px-5 py-3 text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-white/78 transition-colors hover:border-primary/40 hover:text-primary"
              >
                <Download className="mr-2 inline h-4 w-4" /> Export Register
              </button>
              <Link
                href="/dashboard/templates"
                className="rounded-full border border-white/15 bg-white/[0.02] px-5 py-3 text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-white/78 transition-colors hover:border-primary/40 hover:text-primary"
              >
                Template Arsenal
              </Link>
            </div>
          </div>

          <div className="xl:col-span-4">
            <div className="rounded-3xl border border-primary/20 bg-primary/[0.035] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="cyber-metadata text-primary">Global System Time</div>
                  <div className="mt-2 font-mono text-4xl font-black tracking-[0.1em] text-primary">{systemTime}</div>
                </div>
                <Clock className="h-9 w-9 text-primary" />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-[#050505]/70 p-3">
                  <div className="cyber-metadata text-white/48">Mode</div>
                  <div className="mt-1 font-outfit text-2xl font-black tracking-tighter text-[#EBEBEB]">Secure</div>
                </div>
                <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.045] p-3">
                  <div className="cyber-metadata text-amber-300">Defcon</div>
                  <div className="mt-1 font-outfit text-2xl font-black tracking-tighter text-amber-300">
                    {campaignStats.active > 0 ? "3" : "5"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-5 gap-4">
        {commandMetrics.map(({ label, value, sub, icon: Icon, tone }) => (
          <div key={label} className="cyber-card rounded-3xl border border-white/10 bg-white/[0.02] p-5 min-h-40">
            <div className="flex items-center justify-between">
              <div className="cyber-metadata text-white/58">{label}</div>
              <Icon className={`h-6 w-6 ${tone}`} />
            </div>
            <div className={`mt-4 font-outfit text-6xl font-black tracking-tighter ${tone}`}>{value}</div>
            <div className="mt-2 text-sm font-bold text-white/58">{sub}</div>
          </div>
        ))}
      </div>

      <DashboardCard
        title="CAMPAIGN CONTROL CENTER"
        subtitle="Search, filter, inspect, launch, and export campaign intelligence from one operator view."
        glowColor="rgba(16, 185, 129, 0.14)"
      >
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className="xl:col-span-4 space-y-4">
            <div className="rounded-3xl border border-white/10 bg-[#050505]/75 p-4">
              <label className="cyber-metadata text-white/55">Search Campaigns</label>
              <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3">
                <Search className="h-5 w-5 text-primary" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by campaign, template, department..."
                  className="w-full bg-transparent text-sm font-bold text-white/82 outline-none placeholder:text-white/32"
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {(["All", "Active", "Draft", "Completed"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`rounded-full border px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.16em] transition-all ${
                      statusFilter === status
                        ? "border-primary/35 bg-primary/[0.08] text-primary"
                        : "border-white/10 bg-white/[0.02] text-white/55 hover:border-primary/30 hover:text-primary"
                    }`}
                  >
                    <Filter className="mr-1.5 inline h-3.5 w-3.5" />
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="max-h-[390px] space-y-2 overflow-y-auto pr-1">
              {filteredCampaigns.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-5 text-center text-sm font-bold text-white/52">
                  No campaigns match the current filter.
                </div>
              ) : (
                filteredCampaigns.map((campaign) => {
                  const isSelected = selectedCampaign?.id === campaign.id;
                  const template = templates.find((item) => item.id === campaign.templateId);
                  return (
                    <button
                      key={campaign.id}
                      onClick={() => setSelectedCampaignId(campaign.id)}
                      className={`w-full rounded-3xl border p-4 text-left transition-all ${
                        isSelected
                          ? "border-primary/45 bg-primary/[0.065] shadow-[0_0_28px_rgba(16,185,129,0.12)]"
                          : "border-white/10 bg-[#050505]/70 hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-outfit text-2xl font-black tracking-tighter text-[#EBEBEB]">{campaign.name}</span>
                        <span className={`rounded-full border px-2 py-1 font-mono text-[8px] font-black uppercase ${
                          campaign.status === "Active"
                            ? "border-amber-400/30 bg-amber-400/5 text-amber-300"
                            : campaign.status === "Completed"
                              ? "border-emerald-400/30 bg-emerald-400/5 text-emerald-300"
                              : "border-white/10 bg-white/[0.02] text-white/50"
                        }`}>
                          {campaign.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs font-bold leading-relaxed text-white/50">{template?.name || "Unknown template"}</p>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="xl:col-span-8">
            <div className="rounded-3xl border border-primary/20 bg-[#050505]/80 p-5">
              {selectedCampaign ? (
                <>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="cyber-metadata text-primary">Selected Campaign Intelligence</div>
                      <h2 className="mt-3 font-outfit text-5xl font-black tracking-tighter text-[#EBEBEB]">
                        {selectedCampaign.name}
                      </h2>
                      <p className="mt-2 text-base font-bold leading-relaxed text-white/68">
                        {selectedTemplate?.name || "Unknown template"} - {selectedTemplate?.difficulty || "Medium"} difficulty - {selectedDepartmentCoverage}% department coverage
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedCampaign.status !== "Completed" && (
                        <button
                          onClick={() => launchCampaign(selectedCampaign.id)}
                          className="cyber-btn px-4 py-2 text-[10px] font-mono"
                        >
                          <Rocket className="mr-1.5 inline h-3.5 w-3.5" />
                          Launch
                        </button>
                      )}
                      <button
                        onClick={handleExportSelectedCampaign}
                        className="rounded-full border border-white/15 bg-white/[0.02] px-4 py-2 text-[10px] font-mono font-black uppercase tracking-[0.16em] text-white/75 transition-all hover:border-primary/35 hover:text-primary"
                      >
                        <FileSpreadsheet className="mr-1.5 inline h-3.5 w-3.5" />
                        Export Intel
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { label: "Click Rate", value: `${selectedClickRate}%`, icon: Target, tone: "text-amber-300" },
                      { label: "Report Rate", value: `${selectedReportRate}%`, icon: ShieldCheck, tone: "text-emerald-300" },
                      { label: "Cred Attempts", value: selectedCampaign.credentialsSubmitted, icon: ShieldAlert, tone: "text-rose-300" },
                      { label: "Delivered", value: selectedCampaign.emailsSent, icon: Users, tone: "text-primary" }
                    ].map(({ label, value, icon: Icon, tone }) => (
                      <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.025] p-4">
                        <div className="flex items-center justify-between">
                          <div className="cyber-metadata text-white/50">{label}</div>
                          <Icon className={`h-5 w-5 ${tone}`} />
                        </div>
                        <div className={`mt-3 font-outfit text-4xl font-black tracking-tighter ${tone}`}>{value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5">
                      <div className="flex items-center gap-2 cyber-metadata text-primary">
                        <Brain className="h-4 w-4" />
                        AI Campaign Playbook
                      </div>
                      <div className="mt-4 space-y-3">
                        {aiPlaybook.map((item, index) => (
                          <div key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-[#050505]/70 p-3">
                            <span className="font-mono text-sm font-black text-primary">0{index + 1}</span>
                            <p className="text-sm font-bold leading-relaxed text-white/72">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5">
                      <div className="flex items-center gap-2 cyber-metadata text-primary">
                        <BarChart3 className="h-4 w-4" />
                        Engagement Flow
                      </div>
                      {[
                        { label: "Delivered", value: 100, tone: "bg-primary" },
                        { label: "Opened", value: selectedCampaign.emailsSent ? Math.round((selectedCampaign.emailsOpened / selectedCampaign.emailsSent) * 100) : 0, tone: "bg-sky-400" },
                        { label: "Clicked", value: selectedClickRate, tone: "bg-amber-400" },
                        { label: "Reported", value: selectedReportRate, tone: "bg-emerald-400" }
                      ].map((item) => (
                        <div key={item.label} className="mt-4">
                          <div className="mb-2 flex items-center justify-between font-mono text-xs font-black uppercase tracking-[0.14em]">
                            <span className="text-white/62">{item.label}</span>
                            <span className="text-white/82">{item.value}%</span>
                          </div>
                          <div className="h-3 overflow-hidden rounded-full bg-white/10">
                            <div className={`h-full rounded-full ${item.tone} transition-all duration-700`} style={{ width: `${Math.max(4, Math.min(100, item.value))}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
                  <Layers className="mx-auto h-10 w-10 text-primary" />
                  <h2 className="mt-4 font-outfit text-4xl font-black tracking-tighter text-[#EBEBEB]">No campaign selected</h2>
                  <p className="mt-2 text-sm font-bold text-white/58">Create or select a campaign to activate campaign intelligence.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardCard>

      <DashboardCard
        title="DEPARTMENT TARGET MATRIX"
        subtitle="A working coverage board showing which departments are in scope for the selected campaign."
        glowColor="rgba(16, 185, 129, 0.12)"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
          {departmentTargetMatrix.map((department) => (
            <div
              key={department.name}
              className={`rounded-3xl border p-4 ${
                department.targeted
                  ? "border-primary/30 bg-primary/[0.055]"
                  : "border-white/10 bg-[#050505]/70"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-outfit text-2xl font-black tracking-tighter text-[#EBEBEB]">{department.name.replace(" & Accounting", "").replace(" & IT", "")}</h3>
                <span className={`rounded-full border px-2 py-1 font-mono text-[8px] font-black uppercase ${
                  department.targeted ? "border-primary/30 text-primary bg-primary/5" : "border-white/10 text-white/38 bg-white/[0.02]"
                }`}>
                  {department.targeted ? "Targeted" : "Standby"}
                </span>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <div className="cyber-metadata text-white/48">Risk Score</div>
                  <div className={`mt-1 font-outfit text-4xl font-black tracking-tighter ${
                    department.riskScore >= 65 ? "text-rose-300" : department.riskScore >= 45 ? "text-amber-300" : "text-emerald-300"
                  }`}>
                    {department.riskScore}%
                  </div>
                </div>
                <Gauge className="h-6 w-6 text-primary" />
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-primary" style={{ width: `${department.riskScore}%` }} />
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>

      {/* active simulation overview metrics */}
      {campaigns.some(c => c.status === "Active") ? (
        campaigns.filter(c => c.status === "Active").map((camp) => {
          const tpl = templates.find(t => t.id === camp.templateId);
          const clickRate = camp.emailsSent > 0 ? Math.round((camp.linksClicked / camp.emailsSent) * 100) : 0;
          const reportRate = camp.emailsSent > 0 ? Math.round((camp.emailsReported / camp.emailsSent) * 100) : 0;
          
          return (
            <DashboardCard
              key={camp.id}
              title={`ACTIVE SIMULATION RUNNING: ${camp.name}`}
              subtitle={`Payload: ${tpl?.name || "Safe Simulation Template"} - Targets: ${camp.targetDepartments.join(", ")}`}
              glowColor="rgba(245, 158, 11, 0.15)"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
                
                {/* Stats */}
                <div className="border-r border-slate-900 pr-4 text-left font-mono">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">DELIVERIES SUCCESS</span>
                  <span className="text-3xl font-extrabold text-slate-200">{camp.emailsSent} users</span>
                  <span className="text-[9px] text-slate-400 block mt-1">100% INBOX PENETRATION</span>
                </div>

                <div className="border-r border-slate-900 pr-4 text-left font-mono">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">OPENS LOGGED</span>
                  <span className="text-3xl font-extrabold text-blue-400">{camp.emailsOpened} opened</span>
                  <span className="text-[9px] text-slate-400 block mt-1">OPEN RATE: {camp.emailsSent > 0 ? Math.round((camp.emailsOpened / camp.emailsSent) * 100) : 0}%</span>
                </div>

                <div className="border-r border-slate-900 pr-4 text-left font-mono">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">LINKS COMPROMISED</span>
                  <span className="text-3xl font-extrabold text-amber-500">{camp.linksClicked} clicks</span>
                  <span className="text-[9px] text-amber-500 font-bold block mt-1">CLICK RATE: {clickRate}%</span>
                </div>

                <div className="border-r border-slate-900 pr-4 text-left font-mono">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">SAFE CREDENTIAL ATTEMPTS</span>
                  <span className="text-3xl font-extrabold text-rose-500">{camp.credentialsSubmitted} entry</span>
                  <span className="text-[9px] text-rose-500 font-bold block mt-1">SIMULATED ONLY - NO REAL SECRETS</span>
                </div>

                <div className="text-left font-mono">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">CORRECTLY REPORTED</span>
                  <span className="text-3xl font-extrabold text-emerald-400">{camp.emailsReported} reports</span>
                  <span className="text-[9px] text-emerald-400 font-bold block mt-1">REPORTING RATE: {reportRate}%</span>
                </div>

              </div>

              {/* Progress bar metrics */}
              <div className="mt-6 font-mono text-[10px] space-y-2">
                <div className="flex justify-between font-bold">
                  <span>VECTOR ENGAGEMENT FLOW</span>
                  <span className="text-primary">RUNNING SIMULATION... POLLING STATS TICKER</span>
                </div>
                <div className="w-full bg-slate-950 border border-slate-900 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-amber-500 to-rose-500 transition-all duration-500"
                    style={{ width: `${Math.max(10, Math.min(100, clickRate + reportRate))}%` }}
                  ></div>
                </div>
              </div>
            </DashboardCard>
          );
        })
      ) : (
        <div className="p-8 rounded-xl border border-dashed border-slate-800 bg-slate-950/20 text-center font-mono text-xs text-slate-500">
          [SYSTEM] NO ACTIVE SIMULATION INSTANCE CURRENTLY RUNNING. INITIATE OR LAUNCH AN UNFINISHED CAMPAIGN TO TEST FIREWALLS.
        </div>
      )}

      <DashboardCard
        title="LIVE THREAT FEED"
        subtitle="Real-time SOC event stream from all active phishing simulations."
        glowColor="rgba(16, 185, 129, 0.18)"
        headerAction={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              onClick={handleFeedToggle}
              className="rounded-full border border-white/15 bg-white/[0.025] px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/78 transition-all hover:border-primary/40 hover:text-primary"
            >
              {isFeedPaused ? (
                <span className="flex items-center gap-1.5"><Play className="h-3.5 w-3.5" /> Resume</span>
              ) : (
                <span className="flex items-center gap-1.5"><Pause className="h-3.5 w-3.5" /> Pause</span>
              )}
            </button>
            <button
              onClick={handleExportRecentLogs}
              className="cyber-btn px-4 py-2 text-[10px] font-mono flex items-center gap-1.5"
            >
              <Download className="h-3.5 w-3.5" /> Export
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className="xl:col-span-4 space-y-4">
            <div className="rounded-3xl border border-primary/20 bg-primary/[0.035] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="cyber-metadata text-primary">Feed Status</div>
                  <h2 className="mt-2 font-outfit text-4xl font-black tracking-tighter text-[#EBEBEB]">
                    {isFeedPaused ? "Snapshot Mode" : "Streaming Live"}
                  </h2>
                </div>
                <Radio className={`h-8 w-8 text-primary ${isFeedPaused ? "" : "animate-pulse"}`} />
              </div>
              <p className="mt-3 text-sm font-bold leading-relaxed text-white/70">
                {isFeedPaused
                  ? "Feed is paused for analyst review. Export will download this frozen recent-log snapshot."
                  : "Feed follows the newest active simulation events. Export downloads the visible recent SOC logs."}
              </p>
              {exportStatus && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-[#050505]/70 px-4 py-3 font-mono text-[11px] font-bold text-primary">
                  {exportStatus}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Critical", value: feedStats.critical, icon: ShieldAlert, tone: "text-rose-300" },
                { label: "Clicks", value: feedStats.clicks, icon: Target, tone: "text-amber-300" },
                { label: "Reports", value: feedStats.reports, icon: CheckCircle, tone: "text-emerald-300" },
                { label: "Cred Attempts", value: feedStats.credentials, icon: Zap, tone: "text-primary" }
              ].map(({ label, value, icon: Icon, tone }) => (
                <div key={label} className="rounded-3xl border border-white/10 bg-[#050505]/70 p-4">
                  <div className="flex items-center justify-between">
                    <Icon className={`h-5 w-5 ${tone}`} />
                    <span className={`font-outfit text-4xl font-black ${tone}`}>{value}</span>
                  </div>
                  <div className="mt-3 cyber-metadata text-white/62">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="xl:col-span-8">
            <div className="rounded-3xl border border-white/10 bg-[#050505]/75 p-3">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-2 pb-3">
                <div className="flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-primary">
                  <Activity className="h-4 w-4" />
                  Recent SOC Logs
                </div>
                <div className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
                  {visibleFeedLogs.length} visible events
                </div>
              </div>

              <div className="max-h-[520px] overflow-y-auto pr-1 space-y-2">
                {visibleFeedLogs.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
                    <Radio className="mx-auto h-8 w-8 text-primary" />
                    <h3 className="mt-4 font-outfit text-3xl font-black tracking-tighter text-[#EBEBEB]">No logs yet</h3>
                    <p className="mt-2 text-sm font-bold leading-relaxed text-white/60">
                      Launch or resume a simulation to generate real-time SOC events.
                    </p>
                  </div>
                ) : (
                  visibleFeedLogs.map((log) => {
                    const tone = getLogTone(log);
                    return (
                      <div key={log.id} className={`rounded-3xl border ${tone.border} p-4 transition-all hover:border-primary/35`}>
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`h-2.5 w-2.5 rounded-full ${tone.dot}`} />
                              <span className={`font-mono text-xs font-black uppercase tracking-[0.16em] ${tone.text}`}>
                                {log.action.replace(/_/g, " ")}
                              </span>
                              <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[9px] font-black uppercase text-white/52">
                                {log.severity}
                              </span>
                            </div>
                            <h3 className="mt-2 truncate font-outfit text-2xl font-black tracking-tighter text-[#EBEBEB]">
                              {log.employeeName}
                            </h3>
                            <p className="mt-1 text-sm font-bold leading-relaxed text-white/68">
                              {log.details}
                            </p>
                          </div>
                          <div className="lg:text-right font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white/42">
                            <div>{new Date(log.timestamp).toLocaleString()}</div>
                            <div className="mt-1 text-white/58">{log.department}</div>
                            <div className="mt-1 max-w-64 truncate text-primary">{log.campaignName}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </DashboardCard>

      {/* Campaigns Database List Card */}
      <DashboardCard title="HISTORICAL SIMULATION CAMPAIGNS" subtitle="Index of launched, completed, and draft campaign payloads.">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 font-bold">
                <th className="py-3 px-4">CAMPAIGN NAME</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">TARGETS</th>
                <th className="py-3 px-4">DELIVERED</th>
                <th className="py-3 px-4">CLICKS</th>
                <th className="py-3 px-4">SAFE ATTEMPTS</th>
                <th className="py-3 px-4">REPORTS</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((camp) => {
                const targetText = camp.targetDepartments.length === departments.length ? "All departments" : camp.targetDepartments.map(d => d.replace(" & Accounting", "").replace(" & IT", "")).join(", ");
                
                let badgeColor = "border-slate-800 bg-slate-900 text-slate-400";
                if (camp.status === "Active") badgeColor = "border-amber-500/30 bg-amber-500/5 text-amber-500 animate-pulse";
                if (camp.status === "Completed") badgeColor = "border-emerald-500/30 bg-emerald-500/5 text-emerald-400";

                return (
                  <tr key={camp.id} className="border-b border-slate-900 hover:bg-slate-900/10">
                    <td className="py-4 px-4 font-bold text-slate-200">{camp.name}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 border rounded text-[9px] font-bold ${badgeColor}`}>
                        {camp.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-400 font-medium">{targetText}</td>
                    <td className="py-4 px-4 text-slate-300">{camp.emailsSent}</td>
                    <td className="py-4 px-4 text-amber-500 font-bold">{camp.linksClicked}</td>
                    <td className="py-4 px-4 text-rose-500 font-bold">{camp.credentialsSubmitted}</td>
                    <td className="py-4 px-4 text-emerald-400 font-bold">{camp.emailsReported}</td>
                    <td className="py-4 px-4 text-right">
                      {camp.status !== "Completed" && (
                        <button
                          onClick={() => launchCampaign(camp.id)}
                          className="px-2.5 py-1 border border-primary/50 text-primary hover:bg-primary hover:text-slate-950 transition-colors rounded text-[10px] font-bold cursor-pointer"
                        >
                          LAUNCH NOW
                        </button>
                      )}
                      {camp.status === "Completed" && (
                        <span className="text-slate-500 text-[10px] flex items-center justify-end gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-400" /> SECURE
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredCampaigns.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 px-4 text-center text-sm font-bold text-white/45">
                    No campaign records match the current search or status filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </DashboardCard>

      {/* Modal - Create Campaign */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 font-sans">
          <div
            className="cyber-card w-full max-w-lg p-6 rounded-xl border border-slate-900 bg-slate-950/90 text-left shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex justify-between items-center border-b border-slate-900 pb-3 mb-4">
              <h3 className="font-outfit text-md font-bold text-slate-100 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                INITIATE PHISHING RUN
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-200 font-mono text-sm font-bold cursor-pointer"
              >
                [X]
              </button>
            </div>

            {validationError && (
              <div className="bg-rose-950/40 border border-rose-900/60 text-rose-400 text-xs p-3 rounded mb-4 font-mono">
                [ERROR] {validationError}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-[9px] font-mono text-slate-400 font-bold uppercase mb-1 tracking-wider">
                  CAMPAIGN RUN IDENTIFIER
                </label>
                <input
                  type="text"
                  placeholder="e.g. Campaign Microsoft SSO Verification"
                  value={campName}
                  onChange={(e) => setCampName(e.target.value)}
                  className="w-full bg-[#04040c] border border-slate-800 text-slate-200 px-3 py-2 rounded text-xs outline-none focus:border-primary/50 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] font-mono text-slate-400 font-bold uppercase mb-1 tracking-wider">
                  PHISHING TARGET VECTOR TEMPLATE
                </label>
                <select
                  value={tplId}
                  onChange={(e) => setTplId(e.target.value)}
                  className="w-full bg-[#04040c] border border-slate-800 text-slate-200 px-3 py-2 rounded text-xs outline-none focus:border-primary/50 font-mono appearance-none"
                >
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                    TARGET DEPARTMENTS
                  </label>
                  <button
                    type="button"
                    onClick={handleSelectAllDepts}
                    className="text-[9px] font-mono text-primary font-bold hover:underline cursor-pointer"
                  >
                    {targetDepts.length === departments.length ? "DESELECT ALL" : "SELECT ALL"}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 bg-[#04040c] border border-slate-900 p-3 rounded h-28 overflow-y-auto">
                  {departments.map(d => (
                    <label key={d.name} className="flex items-center gap-2 text-xs font-mono text-slate-300 select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={targetDepts.includes(d.name)}
                        onChange={() => handleDeptToggle(d.name)}
                        className="accent-primary"
                      />
                      <span>{d.name.replace(" & Accounting", "").replace(" & IT", "")}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-900 pt-4 flex gap-3 justify-end font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-850 hover:bg-slate-900 rounded cursor-pointer font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="cyber-btn px-6 py-2 rounded text-slate-100 flex items-center gap-1.5 cursor-pointer"
                >
                  SAVE DRAFT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
