"use client";

import React, { useMemo, useState } from "react";
import { Bell, Database, KeyRound, LockKeyhole, RefreshCw, Save, Shield, SlidersHorizontal, Webhook } from "lucide-react";
import DashboardCard from "@/components/DashboardCard";
import { useSim } from "@/context/SimContext";

const initialControls = {
  mfaRequired: true,
  rbacLocked: true,
  safeSimulation: true,
  auditStreaming: true,
  adaptiveTraining: true,
  executiveDigest: true,
  webhookDelivery: false,
  strictDomains: true
};

export default function SettingsPage() {
  const { currentUser, logs, resetAllData } = useSim();
  const [controls, setControls] = useState(initialControls);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [retention, setRetention] = useState("365");
  const [riskThreshold, setRiskThreshold] = useState(70);

  const securityScore = useMemo(() => {
    const enabled = Object.values(controls).filter(Boolean).length;
    return Math.round((enabled / Object.keys(controls).length) * 100);
  }, [controls]);

  const toggle = (key: keyof typeof controls) => {
    setControls((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const save = () => {
    setSavedAt(new Date().toLocaleTimeString());
  };

  const auditPreview = logs.slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-4">
        <div>
          <h1 className="font-outfit text-2xl font-black tracking-wide text-slate-100 uppercase flex items-center gap-2">
            <SlidersHorizontal className="w-6 h-6 text-primary" /> Enterprise Settings
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Security controls, governance, retention, and integration readiness for PhishNet AI.</p>
        </div>
        <button onClick={save} className="cyber-btn px-4 py-2 rounded text-xs font-mono font-bold flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Configuration
        </button>
      </div>

      {savedAt && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-xs font-mono text-emerald-400">
          [OK] Settings saved locally at {savedAt}. Production services would persist this through the Express API and audit log.
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <DashboardCard title="SECURITY CONTROL PLANE" subtitle="Toggles simulate enterprise policy enforcement for demo mode.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { key: "mfaRequired", title: "Require MFA", desc: "Force MFA challenge for analyst and manager roles.", icon: KeyRound },
                { key: "rbacLocked", title: "RBAC Enforcement", desc: "Limit modules by Super Admin, SOC Analyst, Manager, and Employee.", icon: LockKeyhole },
                { key: "safeSimulation", title: "Safe Simulation Guardrails", desc: "Prevent real delivery, real credential capture, and unsafe export.", icon: Shield },
                { key: "auditStreaming", title: "Audit Streaming", desc: "Mirror all campaign events into append-only audit records.", icon: Database },
                { key: "adaptiveTraining", title: "Adaptive Training", desc: "Assign courses after clicks, submissions, or ignored warnings.", icon: Bell },
                { key: "executiveDigest", title: "Executive Digest", desc: "Generate weekly posture summaries for leadership.", icon: RefreshCw },
                { key: "webhookDelivery", title: "Webhook Integrations", desc: "Send sanitized event summaries to SIEM/SOAR endpoints.", icon: Webhook },
                { key: "strictDomains", title: "Approved Domain Lock", desc: "Restrict simulations to pre-approved internal domains.", icon: LockKeyhole }
              ].map(({ key, title, desc, icon: Icon }) => {
                const enabled = controls[key as keyof typeof controls];
                return (
                  <button
                    key={key}
                    onClick={() => toggle(key as keyof typeof controls)}
                    className={`rounded-lg border p-4 text-left transition-all ${
                      enabled
                        ? "border-primary/30 bg-primary/5"
                        : "border-slate-900 bg-slate-950/40 hover:border-slate-800"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`w-5 h-5 mt-0.5 ${enabled ? "text-primary" : "text-slate-500"}`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-bold text-slate-200">{title}</p>
                          <span className={`h-5 w-10 rounded-full border p-0.5 transition-colors ${enabled ? "border-primary/40 bg-primary/20" : "border-slate-700 bg-slate-900"}`}>
                            <span className={`block h-3.5 w-3.5 rounded-full transition-transform ${enabled ? "translate-x-5 bg-primary" : "bg-slate-600"}`} />
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </DashboardCard>
        </div>

        <div className="xl:col-span-4 space-y-6">
          <DashboardCard title="SECURITY POSTURE" subtitle="Configuration maturity score.">
            <div className="text-center">
              <div className="mx-auto h-36 w-36 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center shadow-[0_0_28px_rgba(0,240,255,0.1)]">
                <div>
                  <p className="font-outfit text-4xl font-black text-primary">{securityScore}</p>
                  <p className="text-[10px] font-mono text-slate-500">CONTROL SCORE</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-4">Operator: {currentUser?.name || "Analyst"} ({currentUser?.role || "Super Admin"})</p>
            </div>
          </DashboardCard>

          <DashboardCard title="RETENTION POLICY" subtitle="Demo settings for archive and risk rules.">
            <div className="space-y-4 font-mono text-xs">
              <label className="block">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Audit retention days</span>
                <select value={retention} onChange={(event) => setRetention(event.target.value)} className="mt-1 w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 outline-none">
                  <option value="90">90 days</option>
                  <option value="180">180 days</option>
                  <option value="365">365 days</option>
                  <option value="2555">7 years</option>
                </select>
              </label>
              <label className="block">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Critical risk threshold: {riskThreshold}</span>
                <input type="range" min={40} max={95} value={riskThreshold} onChange={(event) => setRiskThreshold(Number(event.target.value))} className="mt-2 w-full accent-primary" />
              </label>
              <button
                onClick={() => {
                  if (confirm("Reset the interactive demo data to its factory state?")) resetAllData();
                }}
                className="w-full rounded border border-amber-500/30 bg-amber-500/5 px-4 py-2 text-amber-400 hover:bg-amber-500/10"
              >
                Reset Demo Dataset
              </button>
            </div>
          </DashboardCard>
        </div>
      </div>

      <DashboardCard title="AUDIT STREAM PREVIEW" subtitle="Recent policy-relevant events. In production this is immutable and queryable.">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500">
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4 text-right">Severity</th>
              </tr>
            </thead>
            <tbody>
              {auditPreview.map((log) => (
                <tr key={log.id} className="border-b border-slate-900/70">
                  <td className="py-3 px-4 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="py-3 px-4 text-slate-200">{log.employeeName}</td>
                  <td className="py-3 px-4 text-slate-400">{log.department}</td>
                  <td className="py-3 px-4 text-primary">{log.action}</td>
                  <td className="py-3 px-4 text-right uppercase text-slate-500">{log.severity}</td>
                </tr>
              ))}
              {auditPreview.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-600">No audit events yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </div>
  );
}
