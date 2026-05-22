"use client";

import React, { useMemo, useState } from "react";
import { Award, BadgeCheck, Building2, CheckCircle, KeyRound, LockKeyhole, Mail, Save, Shield, UserCircle } from "lucide-react";
import DashboardCard from "@/components/DashboardCard";
import { useSim } from "@/context/SimContext";

const permissionsByRole: Record<string, string[]> = {
  "Super Admin": ["Launch campaigns", "Manage templates", "View all risk data", "Export reports", "Configure settings"],
  "Security Analyst": ["Launch campaigns", "Analyze risk", "Use AI assistant", "Export reports"],
  "Department Manager": ["View department risk", "Track training", "Read reports"],
  Employee: ["Read assigned training", "Report simulations", "Earn badges"]
};

export default function ProfilePage() {
  const { currentUser, employees, campaigns, logs } = useSim();
  const [displayName, setDisplayName] = useState(currentUser?.name || "");
  const [saved, setSaved] = useState(false);

  const employeeProfile = useMemo(() => {
    if (!currentUser) return null;
    return employees.find((employee) => employee.email.toLowerCase() === currentUser.email.toLowerCase()) || null;
  }, [currentUser, employees]);

  const operatorStats = useMemo(() => {
    const activeCampaigns = campaigns.filter((campaign) => campaign.status === "Active").length;
    const criticalEvents = logs.filter((log) => log.severity === "critical").length;
    const reports = logs.filter((log) => log.action === "REPORTED").length;
    return { activeCampaigns, criticalEvents, reports };
  }, [campaigns, logs]);

  const role = currentUser?.role || "Super Admin";
  const permissions = permissionsByRole[role] || permissionsByRole["Super Admin"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-4">
        <div>
          <h1 className="font-outfit text-2xl font-black tracking-wide text-slate-100 uppercase flex items-center gap-2">
            <UserCircle className="w-6 h-6 text-primary" /> Operator Profile
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Session identity, MFA posture, role permissions, and user-specific security telemetry.</p>
        </div>
        <button
          onClick={() => setSaved(true)}
          className="cyber-btn px-4 py-2 rounded text-xs font-mono font-bold flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save Profile
        </button>
      </div>

      {saved && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-xs font-mono text-emerald-400">
          [OK] Profile preferences saved for the current demo session.
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4">
          <div className="cyber-card rounded-xl border border-primary/20 bg-slate-950/60 p-6 text-center">
            <div className="mx-auto h-24 w-24 rounded-full border border-primary/30 bg-gradient-to-tr from-primary/20 to-secondary/20 flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.12)]">
              <span className="font-outfit text-3xl font-black text-primary">{(displayName || currentUser?.email || "PN").slice(0, 2).toUpperCase()}</span>
            </div>
            <h2 className="font-outfit text-xl font-bold text-slate-100 mt-4">{displayName || currentUser?.name || "Analyst Stark"}</h2>
            <p className="text-xs font-mono text-slate-500 mt-1">{currentUser?.email || "admin@enterprise.com"}</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded border border-primary/20 bg-primary/5 px-3 py-1.5 text-[10px] font-mono font-bold text-primary">
              <BadgeCheck className="w-3.5 h-3.5" /> {role}
            </div>
          </div>
        </div>

        <div className="xl:col-span-8">
          <DashboardCard title="IDENTITY AND SESSION DETAILS" subtitle="Demo profile fields with enterprise security annotations.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <label className="block">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Display name</span>
                <input
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  className="mt-1 w-full rounded border border-slate-800 bg-slate-950 px-3 py-2.5 text-slate-200 outline-none focus:border-primary/50"
                  placeholder="Analyst Stark"
                />
              </label>
              <label className="block">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Email</span>
                <div className="mt-1 flex items-center gap-2 rounded border border-slate-800 bg-slate-950 px-3 py-2.5 text-slate-300">
                  <Mail className="w-4 h-4 text-slate-500" />
                  {currentUser?.email || "admin@enterprise.com"}
                </div>
              </label>
              <label className="block">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Department</span>
                <div className="mt-1 flex items-center gap-2 rounded border border-slate-800 bg-slate-950 px-3 py-2.5 text-slate-300">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  {employeeProfile?.department || currentUser?.department || "Security Operations"}
                </div>
              </label>
              <label className="block">
                <span className="text-[10px] text-slate-500 font-bold uppercase">MFA status</span>
                <div className="mt-1 flex items-center gap-2 rounded border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5 text-emerald-400">
                  <KeyRound className="w-4 h-4" />
                  Enabled and required
                </div>
              </label>
            </div>
          </DashboardCard>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7">
          <DashboardCard title="ROLE PERMISSION MATRIX" subtitle="Current RBAC claims resolved for this session.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {permissions.map((permission) => (
                <div key={permission} className="rounded-lg border border-slate-900 bg-slate-950/50 p-4 flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                  <span className="text-xs text-slate-300 font-mono">{permission}</span>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

        <div className="xl:col-span-5">
          <DashboardCard title="SECURITY TELEMETRY" subtitle="Current profile and operator activity summary.">
            <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-3 font-mono text-xs">
              <div className="rounded-lg border border-slate-900 bg-slate-950/50 p-4">
                <Shield className="w-5 h-5 text-primary mb-2" />
                <p className="text-slate-500">Active Campaigns</p>
                <p className="font-outfit text-2xl font-black text-primary">{operatorStats.activeCampaigns}</p>
              </div>
              <div className="rounded-lg border border-slate-900 bg-slate-950/50 p-4">
                <LockKeyhole className="w-5 h-5 text-rose-400 mb-2" />
                <p className="text-slate-500">Critical Events</p>
                <p className="font-outfit text-2xl font-black text-rose-400">{operatorStats.criticalEvents}</p>
              </div>
              <div className="rounded-lg border border-slate-900 bg-slate-950/50 p-4">
                <Award className="w-5 h-5 text-accent mb-2" />
                <p className="text-slate-500">Reports Filed</p>
                <p className="font-outfit text-2xl font-black text-accent">{operatorStats.reports}</p>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>

      {employeeProfile && (
        <DashboardCard title="EMPLOYEE HUMAN RISK PROFILE" subtitle="Shown because the current user maps to an employee record.">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
            <div className="rounded-lg border border-slate-900 bg-slate-950/50 p-4">
              <p className="text-slate-500">Risk Score</p>
              <p className="font-outfit text-3xl font-black text-amber-400">{employeeProfile.riskScore}</p>
            </div>
            <div className="rounded-lg border border-slate-900 bg-slate-950/50 p-4">
              <p className="text-slate-500">Failed Simulations</p>
              <p className="font-outfit text-3xl font-black text-rose-400">{employeeProfile.failedCount}</p>
            </div>
            <div className="rounded-lg border border-slate-900 bg-slate-950/50 p-4">
              <p className="text-slate-500">Reports / Passes</p>
              <p className="font-outfit text-3xl font-black text-accent">{employeeProfile.passedCount}</p>
            </div>
            <div className="rounded-lg border border-slate-900 bg-slate-950/50 p-4">
              <p className="text-slate-500">Badges</p>
              <p className="font-outfit text-3xl font-black text-primary">{employeeProfile.badges.length}</p>
            </div>
          </div>
        </DashboardCard>
      )}
    </div>
  );
}
