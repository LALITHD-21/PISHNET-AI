"use client";

import React, { useState } from "react";
import { Plus, Target, CheckCircle } from "lucide-react";
import { useSim } from "@/context/SimContext";
import DashboardCard from "@/components/DashboardCard";

export default function CampaignsPage() {
  const { campaigns, templates, departments, createCampaign, launchCampaign } = useSim();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [campName, setCampName] = useState("");
  const [tplId, setTplId] = useState(templates[0]?.id || "");
  const [targetDepts, setTargetDepts] = useState<string[]>([]);
  const [validationError, setValidationError] = useState("");

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
