"use client";

import React, { useState, useMemo } from "react";
import { Users, ChevronDown, ChevronUp, Search, Filter } from "lucide-react";
import { useSim } from "@/context/SimContext";
import DashboardCard from "@/components/DashboardCard";
import ChartMount from "@/components/ChartMount";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

export default function RiskPage() {
  const { departments, employees } = useSim();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"riskScore" | "failedCount" | "name">("riskScore");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selectedDept, setSelectedDept] = useState<string>("all");

  const filteredEmployees = useMemo(() => {
    let result = [...employees];
    if (searchQuery) result = result.filter((e) => e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.email.toLowerCase().includes(searchQuery.toLowerCase()));
    if (selectedDept !== "all") result = result.filter((e) => e.department === selectedDept);
    result.sort((a, b) => {
      let av = 0, bv = 0;
      if (sortBy === "riskScore") { av = a.riskScore; bv = b.riskScore; }
      else if (sortBy === "failedCount") { av = a.failedCount; bv = b.failedCount; }
      else { av = a.name.charCodeAt(0); bv = b.name.charCodeAt(0); }
      return sortDir === "desc" ? bv - av : av - bv;
    });
    return result;
  }, [employees, searchQuery, sortBy, sortDir, selectedDept]);

  const toggleSort = (key: typeof sortBy) => {
    if (sortBy === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(key); setSortDir("desc"); }
  };

  // Radar chart data per department
  const radarData = departments.map((d) => ({
    dept: d.name.replace(" & Accounting", "").replace(" & IT", ""),
    "Risk Score": d.riskScore,
    "Click Rate": d.emailsSent > 0 ? Math.round((d.linksClicked / d.emailsSent) * 100) : 0,
    "Report Rate": d.emailsSent > 0 ? Math.round((d.emailsReported / d.emailsSent) * 100) : 20,
  }));

  // Risk distribution pie chart
  const riskBuckets = useMemo(() => {
    const low = employees.filter((e) => e.riskScore <= 30).length;
    const mid = employees.filter((e) => e.riskScore > 30 && e.riskScore <= 60).length;
    const high = employees.filter((e) => e.riskScore > 60).length;
    return [
      { name: "Low Risk (0-30)", value: low, color: "#10b981" },
      { name: "Medium Risk (31-60)", value: mid, color: "#f59e0b" },
      { name: "High Risk (61+)", value: high, color: "#ef4444" },
    ];
  }, [employees]);

  const getRiskColor = (score: number) =>
    score > 70 ? "text-rose-400" : score > 40 ? "text-amber-400" : "text-emerald-400";

  const getRiskBadge = (score: number) =>
    score > 70 ? "border-rose-500/20 bg-rose-500/5 text-rose-400" :
    score > 40 ? "border-amber-500/20 bg-amber-500/5 text-amber-400" :
    "border-emerald-500/20 bg-emerald-500/5 text-emerald-400";

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-900 pb-4">
        <h1 className="font-outfit text-2xl font-black tracking-wide text-slate-100 flex items-center gap-2">
          <Users className="w-6 h-6 text-primary" /> HUMAN RISK INTELLIGENCE
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-0.5">AI-powered behavioral risk scoring, department threat profiling, and predictive vulnerability analysis.</p>
      </div>

      {/* Department cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {departments.map((dept) => {
          const clickRate = dept.emailsSent > 0 ? Math.round((dept.linksClicked / dept.emailsSent) * 100) : 0;
          return (
            <div
              key={dept.name}
              onClick={() => setSelectedDept(selectedDept === dept.name ? "all" : dept.name)}
              className={`cyber-card rounded-xl p-4 border cursor-pointer transition-all ${
                selectedDept === dept.name ? "border-primary/40 bg-primary/5" : "border-slate-900 hover:border-slate-700"
              }`}
            >
              <div className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-wider mb-2 truncate">
                {dept.name.replace(" & Accounting", "").replace(" & IT", "")}
              </div>
              <div className={`text-2xl font-black font-outfit ${getRiskColor(dept.riskScore)}`}>{dept.riskScore}</div>
              <div className="text-[9px] text-slate-600 font-mono">risk score</div>
              <div className="mt-2 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${dept.riskScore > 70 ? "bg-rose-500" : dept.riskScore > 40 ? "bg-amber-500" : "bg-emerald-500"}`}
                  style={{ width: `${dept.riskScore}%` }}
                />
              </div>
              <div className="mt-2 text-[9px] text-slate-500 font-mono">
                <span className="text-amber-400 font-bold">{clickRate}%</span> click rate
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <DashboardCard title="DEPARTMENT VULNERABILITY RADAR" subtitle="Comparative risk, click rate, and reporting behavior by unit">
            <ChartMount className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(0,240,255,0.1)" />
                  <PolarAngleAxis dataKey="dept" tick={{ fill: "#64748b", fontSize: 10, fontFamily: "monospace" }} />
                  <Radar name="Risk Score" dataKey="Risk Score" stroke="#ef4444" fill="rgba(239,68,68,0.1)" strokeWidth={2} />
                  <Radar name="Click Rate" dataKey="Click Rate" stroke="#f59e0b" fill="rgba(245,158,11,0.05)" strokeWidth={1.5} />
                  <Radar name="Report Rate" dataKey="Report Rate" stroke="#10b981" fill="rgba(16,185,129,0.05)" strokeWidth={1.5} />
                  <Tooltip contentStyle={{ backgroundColor: "#060610", borderColor: "rgba(0,240,255,0.2)", color: "#fff", fontSize: "11px", fontFamily: "monospace" }} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartMount>
          </DashboardCard>
        </div>

        <div className="lg:col-span-5">
          <DashboardCard title="RISK DISTRIBUTION" subtitle="Employee population segmented by vulnerability level">
            <div className="h-72 w-full flex flex-col items-center">
              <ChartMount className="h-[200px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskBuckets} cx="50%" cy="50%" innerRadius={60} outerRadius={85} dataKey="value" strokeWidth={0}>
                    {riskBuckets.map((entry, index) => (
                      <Cell key={index} fill={entry.color} fillOpacity={0.8} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#060610", borderColor: "rgba(0,240,255,0.2)", color: "#fff", fontSize: "11px", fontFamily: "monospace" }} />
                </PieChart>
              </ResponsiveContainer>
              </ChartMount>
              <div className="flex flex-col gap-2 mt-2 font-mono text-xs">
                {riskBuckets.map((b) => (
                  <div key={b.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: b.color }} />
                    <span className="text-slate-400">{b.name}:</span>
                    <span className="text-slate-200 font-bold">{b.value} employees</span>
                  </div>
                ))}
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>

      {/* Employee Table */}
      <DashboardCard title="EMPLOYEE RISK REGISTER" subtitle={`${filteredEmployees.length} employees · sortable · filterable · real-time scores`}>
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2 flex-1 min-w-[180px]">
            <Search className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="flex-1 bg-slate-900/60 border border-slate-800 focus:border-primary/40 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none font-mono placeholder-slate-600"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-slate-900/60 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-2 font-mono outline-none cursor-pointer"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 font-bold">
                <th className="py-3 px-4">EMPLOYEE</th>
                <th className="py-3 px-4">DEPT</th>
                <th className="py-3 px-4 cursor-pointer hover:text-slate-200 transition-colors" onClick={() => toggleSort("riskScore")}>
                  <div className="flex items-center gap-1">RISK SCORE {sortBy === "riskScore" && (sortDir === "desc" ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}</div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-slate-200 transition-colors" onClick={() => toggleSort("failedCount")}>
                  <div className="flex items-center gap-1">FAILS {sortBy === "failedCount" && (sortDir === "desc" ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}</div>
                </th>
                <th className="py-3 px-4 text-center">PASSES</th>
                <th className="py-3 px-4 text-center">TRAINING</th>
                <th className="py-3 px-4">BADGES</th>
                <th className="py-3 px-4 text-right">RISK LEVEL</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="border-b border-slate-900/60 hover:bg-slate-900/20 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                        emp.riskScore > 70 ? "bg-rose-500/20 text-rose-400 border border-rose-500/20" :
                        emp.riskScore > 40 ? "bg-amber-500/20 text-amber-400 border border-amber-500/20" :
                        "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                      }`}>{emp.name[0]}</div>
                      <div>
                        <div className="text-slate-200 font-bold">{emp.name}</div>
                        <div className="text-slate-500 text-[10px]">{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">{emp.department.replace(" & Accounting", "").replace(" & IT", "")}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden flex-shrink-0">
                        <div className={`h-full rounded-full ${emp.riskScore > 70 ? "bg-rose-500" : emp.riskScore > 40 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${emp.riskScore}%` }} />
                      </div>
                      <span className={`font-bold ${getRiskColor(emp.riskScore)}`}>{emp.riskScore}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`font-bold ${emp.failedCount > 2 ? "text-rose-400" : emp.failedCount > 0 ? "text-amber-400" : "text-slate-400"}`}>{emp.failedCount}</span>
                  </td>
                  <td className="py-3.5 px-4 text-center text-emerald-400 font-bold">{emp.passedCount}</td>
                  <td className="py-3.5 px-4 text-center text-slate-400">{emp.completedTrainingCount} modules</td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {emp.badges.map((b) => (
                        <span key={b} className="text-[8px] font-bold bg-accent/10 border border-accent/20 text-accent px-1.5 py-0.5 rounded">
                          {b}
                        </span>
                      ))}
                      {emp.badges.length === 0 && <span className="text-slate-700 text-[10px]">—</span>}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`text-[9px] font-bold border px-2 py-0.5 rounded ${getRiskBadge(emp.riskScore)}`}>
                      {emp.riskScore > 70 ? "HIGH" : emp.riskScore > 40 ? "MED" : "LOW"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </div>
  );
}
