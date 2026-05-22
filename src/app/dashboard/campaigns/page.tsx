"use client";

import React, { useMemo, useState } from "react";
import { Activity, CheckCircle, Download, Pause, Play, Plus, Radio, ShieldAlert, Target, Zap } from "lucide-react";
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

  const escapeCsv = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;

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

    const csv = [header, ...rows]
      .map((row) => row.map((cell) => escapeCsv(cell)).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    a.href = url;
    a.download = `phishnet_recent_threat_logs_${stamp}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportStatus(`Exported ${exportLogs.length} recent SOC event logs.`);
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

  return (
    <div className="space-y-6">
      
      {/* HUD Header */}
      <div className="flex justify-between items-center border-b border-slate-900 pb-4">
        <div>
          <h1 className="font-outfit text-2xl font-black tracking-wide text-slate-100 uppercase">
            SIMULATION CAMPAIGNS
          </h1>
          <p className="text-xs text-slate-400 font-medium">Coordinate, schedule, and deploy controlled mock phishing vector packages.</p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="cyber-btn px-4 py-2 rounded text-xs tracking-wider font-mono flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.15)]"
        >
          <Plus className="w-4 h-4" /> INITIATE CAMPAIGN
        </button>
      </div>

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
              subtitle={`Payload: ${tpl?.name || "Credential Harvester"} • Targets: ${camp.targetDepartments.join(", ")}`}
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
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">CREDENTIALS HARVESTED</span>
                  <span className="text-3xl font-extrabold text-rose-500">{camp.credentialsSubmitted} entry</span>
                  <span className="text-[9px] text-rose-500 font-bold block mt-1">EXPLOITED USER COUNTER</span>
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
                <th className="py-3 px-4">HARVESTS</th>
                <th className="py-3 px-4">REPORTS</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((camp) => {
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
