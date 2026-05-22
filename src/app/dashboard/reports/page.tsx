"use client";

import React, { useState, useMemo } from "react";
import { FileSpreadsheet, Download, FileText, TrendingUp, Shield, AlertTriangle, CheckCircle, Users, Target, Printer } from "lucide-react";
import { useSim } from "@/context/SimContext";
import DashboardCard from "@/components/DashboardCard";

export default function ReportsPage() {
  const { campaigns, departments, employees, logs, templates } = useSim();
  const [exporting, setExporting] = useState<string | null>(null);

  const aggregated = useMemo(() => {
    const totalSent = campaigns.reduce((a, c) => a + c.emailsSent, 0);
    const totalClicks = campaigns.reduce((a, c) => a + c.linksClicked, 0);
    const totalCompromised = campaigns.reduce((a, c) => a + c.credentialsSubmitted, 0);
    const totalReported = campaigns.reduce((a, c) => a + c.emailsReported, 0);
    const clickRate = totalSent > 0 ? ((totalClicks / totalSent) * 100).toFixed(1) : "0.0";
    const compromiseRate = totalSent > 0 ? ((totalCompromised / totalSent) * 100).toFixed(1) : "0.0";
    const reportRate = totalSent > 0 ? ((totalReported / totalSent) * 100).toFixed(1) : "0.0";
    const resilienceScore = Math.max(5, Math.min(99, Math.round(100 - Number(clickRate) * 0.4 - (totalCompromised / Math.max(1, totalSent)) * 60)));
    return { totalSent, totalClicks, totalCompromised, totalReported, clickRate, compromiseRate, reportRate, resilienceScore };
  }, [campaigns]);

  const topRiskEmployees = useMemo(() => [...employees].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5), [employees]);
  const topRiskDepts = useMemo(() => [...departments].sort((a, b) => b.riskScore - a.riskScore), [departments]);

  const downloadCSV = (type: string) => {
    setExporting(type);
    setTimeout(() => {
      let csvContent = "";
      let filename = "";

      if (type === "campaigns") {
        csvContent = "Campaign Name,Status,Template,Emails Sent,Opened,Clicked,Credentials Submitted,Reported,Click Rate %,Compromise Rate %\n";
        campaigns.forEach((c) => {
          const tpl = templates.find((t) => t.id === c.templateId);
          const clickPct = c.emailsSent > 0 ? ((c.linksClicked / c.emailsSent) * 100).toFixed(1) : "0";
          const compPct = c.emailsSent > 0 ? ((c.credentialsSubmitted / c.emailsSent) * 100).toFixed(1) : "0";
          csvContent += `"${c.name}","${c.status}","${tpl?.name || c.templateId}",${c.emailsSent},${c.emailsOpened},${c.linksClicked},${c.credentialsSubmitted},${c.emailsReported},${clickPct},${compPct}\n`;
        });
        filename = "phishnet_campaigns_report.csv";
      } else if (type === "employees") {
        csvContent = "Employee Name,Email,Department,Risk Score,Failed Simulations,Passed Simulations,Training Completed,Badges\n";
        employees.forEach((e) => {
          csvContent += `"${e.name}","${e.email}","${e.department}",${e.riskScore},${e.failedCount},${e.passedCount},${e.completedTrainingCount},"${e.badges.join(", ")}"\n`;
        });
        filename = "phishnet_employee_risk_report.csv";
      } else if (type === "logs") {
        csvContent = "Timestamp,Campaign,Employee,Email,Department,Action,Severity,Details\n";
        logs.forEach((l) => {
          csvContent += `"${l.timestamp}","${l.campaignName}","${l.employeeName}","${l.employeeEmail}","${l.department}","${l.action}","${l.severity}","${l.details}"\n`;
        });
        filename = "phishnet_threat_logs.csv";
      } else if (type === "departments") {
        csvContent = "Department,Risk Score,Employees,Emails Sent,Opened,Clicked,Credentials Submitted,Reported,Click Rate %\n";
        departments.forEach((d) => {
          const cr = d.emailsSent > 0 ? ((d.linksClicked / d.emailsSent) * 100).toFixed(1) : "0";
          csvContent += `"${d.name}",${d.riskScore},${d.employeeCount},${d.emailsSent},${d.emailsOpened},${d.linksClicked},${d.credentialsSubmitted},${d.emailsReported},${cr}\n`;
        });
        filename = "phishnet_department_analysis.csv";
      }

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExporting(null);
    }, 800);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-900 pb-4">
        <div>
          <h1 className="font-outfit text-2xl font-black tracking-wide text-slate-100 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-primary" /> SECURITY INTELLIGENCE REPORTS
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Export campaign analytics, employee risk profiles, and threat log archives as CSV or PDF.</p>
        </div>
        <button
          onClick={printReport}
          className="flex items-center gap-2 px-4 py-2 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          PRINT REPORT
        </button>
      </div>

      {/* Executive Summary Card */}
      <div className="cyber-card rounded-xl border border-primary/20 bg-gradient-to-br from-slate-950/80 to-slate-950/40 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-outfit text-lg font-bold text-slate-100">EXECUTIVE SECURITY BRIEFING</h2>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Generated: {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
          <div className={`px-4 py-2 rounded-lg border font-mono text-xs font-bold ${
            aggregated.resilienceScore > 70 ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
            : aggregated.resilienceScore > 40 ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
            : "border-rose-500/30 bg-rose-500/10 text-rose-400"
          }`}>
            RESILIENCE: {aggregated.resilienceScore}/100
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Simulations Sent", value: aggregated.totalSent, icon: Target, color: "text-primary" },
            { label: "Click-Through Rate", value: `${aggregated.clickRate}%`, icon: AlertTriangle, color: "text-amber-400" },
            { label: "Credentials Compromised", value: aggregated.totalCompromised, icon: Shield, color: "text-rose-400" },
            { label: "Threats Self-Reported", value: aggregated.totalReported, icon: CheckCircle, color: "text-emerald-400" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
              <Icon className={`w-5 h-5 mx-auto mb-2 ${color}`} />
              <div className={`text-2xl font-black font-outfit ${color}`}>{value}</div>
              <div className="text-[9px] text-slate-500 font-mono font-bold uppercase mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Download exports grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { type: "campaigns", title: "Campaign Analytics Report", desc: `${campaigns.length} campaigns · Click rates, submission rates, and per-campaign breakdown`, icon: Target, rows: campaigns.length, color: "text-primary border-primary/20 bg-primary/5" },
          { type: "employees", title: "Employee Risk Profile Export", desc: `${employees.length} profiles · Risk scores, badge counts, and simulation outcomes`, icon: Users, rows: employees.length, color: "text-secondary border-secondary/20 bg-secondary/5" },
          { type: "logs", title: "Threat Event Log Archive", desc: `${logs.length} events · Full timestamped interaction log stream`, icon: FileText, rows: logs.length, color: "text-amber-400 border-amber-500/20 bg-amber-500/5" },
          { type: "departments", title: "Department Risk Assessment", desc: `${departments.length} departments · Comparative risk scoring and click statistics`, icon: TrendingUp, rows: departments.length, color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" },
        ].map(({ type, title, desc, icon: Icon, rows, color }) => (
          <div key={type} className={`cyber-card rounded-xl border p-6 flex items-center justify-between gap-4 ${color}`}>
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg border flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-200 text-sm">{title}</h3>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{desc}</p>
                <p className="text-[9px] text-slate-600 font-mono mt-1">{rows} rows · CSV format</p>
              </div>
            </div>
            <button
              onClick={() => downloadCSV(type)}
              disabled={exporting === type}
              className="flex-shrink-0 cyber-btn px-4 py-2 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              {exporting === type ? "..." : "CSV"}
            </button>
          </div>
        ))}
      </div>

      {/* Top Risk Employees */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard title="TOP 5 HIGH-RISK EMPLOYEES" subtitle="Ranked by current simulation risk score">
          <div className="space-y-2 font-mono text-xs">
            {topRiskEmployees.map((emp, i) => (
              <div key={emp.id} className="flex items-center gap-3 border-b border-slate-900/60 pb-2">
                <span className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${i === 0 ? "bg-rose-500/20 text-rose-400" : "bg-slate-800 text-slate-400"}`}>
                  #{i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 font-bold truncate">{emp.name}</p>
                  <p className="text-slate-500 text-[10px] truncate">{emp.department}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`font-bold ${emp.riskScore > 70 ? "text-rose-400" : emp.riskScore > 40 ? "text-amber-400" : "text-emerald-400"}`}>
                    {emp.riskScore}/100
                  </span>
                  <p className="text-[9px] text-slate-600">{emp.failedCount} fails</p>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="DEPARTMENT RISK RANKING" subtitle="Organizational unit vulnerability comparison">
          <div className="space-y-3 font-mono text-xs">
            {topRiskDepts.map((dept) => {
              const pct = dept.riskScore;
              return (
                <div key={dept.name} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-300 text-[11px] truncate">{dept.name.replace(" & Accounting", "").replace(" & IT", "")}</span>
                    <span className={`font-bold ${pct > 60 ? "text-rose-400" : pct > 35 ? "text-amber-400" : "text-emerald-400"}`}>{pct}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${pct > 60 ? "bg-rose-500" : pct > 35 ? "bg-amber-500" : "bg-emerald-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </DashboardCard>
      </div>

      {/* Recent log table */}
      <DashboardCard title="THREAT LOG SUMMARY TABLE" subtitle="Most recent 20 interaction events across all campaigns">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 font-bold">
                <th className="py-3 px-4">TIME</th>
                <th className="py-3 px-4">EMPLOYEE</th>
                <th className="py-3 px-4">DEPT</th>
                <th className="py-3 px-4">ACTION</th>
                <th className="py-3 px-4">CAMPAIGN</th>
                <th className="py-3 px-4 text-right">SEVERITY</th>
              </tr>
            </thead>
            <tbody>
              {logs.slice(0, 20).map((log) => (
                <tr key={log.id} className="border-b border-slate-900/60 hover:bg-slate-900/20 transition-colors">
                  <td className="py-3 px-4 text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td className="py-3 px-4 text-slate-200">{log.employeeName}</td>
                  <td className="py-3 px-4 text-slate-400">{log.department.split(" ")[0]}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                      log.action === "REPORTED" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" :
                      log.action === "CREDENTIALS_SUBMITTED" ? "border-rose-500/20 bg-rose-500/10 text-rose-400" :
                      log.action === "CLICKED" ? "border-amber-500/20 bg-amber-500/10 text-amber-400" :
                      "border-slate-700 text-slate-500"
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 truncate max-w-[120px]">{log.campaignName}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`text-[9px] font-bold uppercase ${
                      log.severity === "critical" ? "text-rose-400" :
                      log.severity === "high" ? "text-amber-400" :
                      log.severity === "low" ? "text-emerald-400" :
                      "text-slate-500"
                    }`}>{log.severity}</span>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-600">No log events yet. Launch a campaign to start collecting data.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </div>
  );
}
