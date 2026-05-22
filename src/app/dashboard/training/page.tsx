"use client";

import React, { useMemo } from "react";
import { GraduationCap, BookOpen, Clock, Award, Star, CheckCircle, Lock } from "lucide-react";
import { useSim } from "@/context/SimContext";
import DashboardCard from "@/components/DashboardCard";

export default function TrainingPage() {
  const { trainingCourses, employees } = useSim();

  // Aggregate completion status
  const stats = useMemo(() => {
    const totalAssigned = employees.length;
    const completed = employees.reduce((acc, e) => acc + e.completedTrainingCount, 0);
    const badgeRosterCount = employees.reduce((acc, e) => acc + e.badges.length, 0);
    
    // Average progress index
    const progress = Math.min(100, Math.round((completed / Math.max(1, totalAssigned * 2)) * 100));

    return {
      completed,
      badgeRosterCount,
      progress
    };
  }, [employees]);

  return (
    <div className="space-y-6">
      
      {/* HUD Header */}
      <div className="flex justify-between items-center border-b border-slate-900 pb-4">
        <div>
          <h1 className="font-outfit text-2xl font-black tracking-wide text-slate-100 uppercase">
            AWARENESS COMPLIANCE HUB
          </h1>
          <p className="text-xs text-slate-400 font-medium">Configure adaptive curriculum blocks, examine certifications, and audit reporting capabilities.</p>
        </div>
      </div>

      {/* Global Learning KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="cyber-card p-5 rounded-xl bg-slate-950/40 border border-slate-900/60 font-mono text-left relative overflow-hidden">
          <div className="absolute right-3 top-3 opacity-15"><GraduationCap className="w-10 h-10 text-primary" /></div>
          <span className="text-[10px] text-slate-500 block font-bold tracking-wider">COMPLIANCE COMPLETION AVG</span>
          <span className="text-3xl font-extrabold font-outfit text-primary block my-1">{stats.progress}% completion</span>
          <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold mt-2">
            <span>TRAINING INDEX: STABLE</span>
            <span className="text-primary font-bold">OK</span>
          </div>
        </div>

        <div className="cyber-card p-5 rounded-xl bg-slate-950/40 border border-slate-900/60 font-mono text-left relative overflow-hidden">
          <div className="absolute right-3 top-3 opacity-15"><BookOpen className="w-10 h-10 text-secondary" /></div>
          <span className="text-[10px] text-slate-500 block font-bold tracking-wider">COMPLETED COURSE MODULES</span>
          <span className="text-3xl font-extrabold font-outfit text-secondary block my-1">{stats.completed} modules</span>
          <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold mt-2">
            <span>COURSES IN CATALOG: {trainingCourses.length}</span>
            <span className="text-secondary font-bold">AUDITED</span>
          </div>
        </div>

        <div className="cyber-card p-5 rounded-xl bg-slate-950/40 border border-slate-900/60 font-mono text-left relative overflow-hidden">
          <div className="absolute right-3 top-3 opacity-15"><Award className="w-10 h-10 text-accent" /></div>
          <span className="text-[10px] text-slate-500 block font-bold tracking-wider">SECURITY BADGES DISTRIBUTED</span>
          <span className="text-3xl font-extrabold font-outfit text-accent block my-1">{stats.badgeRosterCount} badges</span>
          <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold mt-2">
            <span>HUMAN FIREWALL STATUS</span>
            <span className="text-accent font-bold">ROBUST</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        
        {/* Core Courses List */}
        <div className="lg:col-span-8">
          <DashboardCard title="MICRO-LEARNING COURSE PORTFOLIO" subtitle="Adaptive security lessons triggered by employee simulation failures.">
            <div className="space-y-4">
              {trainingCourses.map((course) => {
                let statusColor = "border-slate-800 text-slate-500 bg-slate-900/10";
                if (course.status === "Assigned") statusColor = "border-amber-500/30 bg-amber-500/5 text-amber-500";
                if (course.status === "Completed") statusColor = "border-emerald-500/30 bg-emerald-500/5 text-emerald-400";
                
                return (
                  <div key={course.id} className="border border-slate-900 rounded-lg p-5 bg-slate-950/40 hover:border-slate-800/80 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex items-center gap-2">
                        <h3 className="font-outfit text-sm font-bold text-slate-200">{course.title}</h3>
                        <span className={`px-2 py-0.5 border rounded text-[8px] font-mono font-bold tracking-wider uppercase ${statusColor}`}>
                          {course.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{course.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-[9px] font-mono text-slate-500 pt-1.5">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-primary" /> {course.duration}</span>
                        <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-secondary" /> {course.difficulty}</span>
                        <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-accent" /> BADGE: {course.badgeGiven.toUpperCase()}</span>
                      </div>
                    </div>

                    <div className="text-right w-full sm:w-auto">
                      {course.status === "Completed" ? (
                        <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-xs font-bold sm:justify-end">
                          <CheckCircle className="w-4 h-4 text-emerald-400" /> PASSED
                        </div>
                      ) : course.status === "Assigned" ? (
                        <div className="text-xs font-mono text-amber-500 font-bold bg-amber-500/5 border border-amber-500/20 px-3 py-1.5 rounded uppercase">
                          Enrolled
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-slate-500 font-mono text-xs font-bold uppercase border border-slate-900 bg-slate-950 px-3 py-1.5 rounded">
                          <Lock className="w-3.5 h-3.5 text-slate-600" /> Locked
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </DashboardCard>
        </div>

        {/* Training Leaderboard */}
        <div className="lg:col-span-4">
          <DashboardCard title="HUMAN COMPLIANCE RANKINGS" subtitle="Leaderboard based on badges earned & reported phish.">
            <div className="space-y-4 font-mono text-xs">
              {[...employees]
                .sort((a, b) => {
                  if (b.completedTrainingCount !== a.completedTrainingCount) {
                    return b.completedTrainingCount - a.completedTrainingCount;
                  }
                  return b.passedCount - a.passedCount;
                })
                .slice(0, 5)
                .map((emp, index) => {
                  return (
                    <div key={emp.id} className="flex justify-between items-center border-b border-slate-900 pb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                          index === 0 ? "bg-amber-500 text-slate-950" :
                          index === 1 ? "bg-slate-400 text-slate-950" :
                          "bg-slate-900 text-slate-400"
                        }`}>
                          {index + 1}
                        </span>
                        <div>
                          <div className="font-bold text-slate-200">{emp.name}</div>
                          <div className="text-[9px] text-slate-500 font-medium">{emp.department.replace(" & Accounting", "").replace(" & IT", "")}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-300">{emp.completedTrainingCount} courses</div>
                        <div className="text-[9px] text-slate-500">Reports: {emp.passedCount}</div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </DashboardCard>
        </div>

      </div>

    </div>
  );
}
