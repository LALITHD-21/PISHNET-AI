"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Shield, LayoutDashboard, Send, FileCode, Users, GraduationCap, Bot, Bomb, FileSpreadsheet, Settings, LogOut, RefreshCw, BarChart3, UserCircle } from "lucide-react";
import { useSim } from "@/context/SimContext";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

function SidebarLink({ href, icon, label, active }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3.5 px-4 py-3 rounded-lg text-xs font-semibold tracking-wider font-mono transition-all uppercase ${
        active
          ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_12px_rgba(0,240,255,0.08)]"
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-transparent"
      }`}
    >
      <span className={active ? "text-primary" : "text-slate-500"}>{icon}</span>
      {label}
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logoutUser, resetAllData } = useSim();

  // Safeguard route authentication
  useEffect(() => {
    const stored = localStorage.getItem("phishnet_current_user");
    if (!stored && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  const handleLogout = () => {
    logoutUser();
    router.push("/login");
  };

  const handleReset = () => {
    if (confirm("Reset simulation logs, campaigns, and risk scores to defaults?")) {
      resetAllData();
      router.refresh();
      window.location.href = "/dashboard/soc";
    }
  };

  const sidebarLinks = [
    { href: "/dashboard/soc", icon: <LayoutDashboard className="w-4 h-4" />, label: "SOC Dashboard" },
    { href: "/dashboard/campaigns", icon: <Send className="w-4 h-4" />, label: "Campaigns" },
    { href: "/dashboard/templates", icon: <FileCode className="w-4 h-4" />, label: "Templates" },
    { href: "/dashboard/risk", icon: <Users className="w-4 h-4" />, label: "Risk Intelligence" },
    { href: "/dashboard/analytics", icon: <BarChart3 className="w-4 h-4" />, label: "Analytics Center" },
    { href: "/dashboard/training", icon: <GraduationCap className="w-4 h-4" />, label: "Awareness" },
    { href: "/dashboard/ai-coach", icon: <Bot className="w-4 h-4" />, label: "AI Cyber Assistant" },
    { href: "/dashboard/lab", icon: <Bomb className="w-4 h-4" />, label: "Simulation Lab" },
    { href: "/dashboard/reports", icon: <FileSpreadsheet className="w-4 h-4" />, label: "Reports" },
    { href: "/dashboard/profile", icon: <UserCircle className="w-4 h-4" />, label: "Profile" },
    { href: "/dashboard/settings", icon: <Settings className="w-4 h-4" />, label: "Settings" }
  ];

  return (
    <div className="flex h-screen bg-[#020205] text-slate-100 overflow-hidden font-sans relative">
      {/* CRT Scanline Overlay */}
      <div className="scanline"></div>

      {/* Cyber Grid overlay */}
      <div className="cyber-grid absolute inset-0 z-0"></div>

      {/* Sidebar Navigation */}
      <aside className="hidden lg:flex w-64 border-r border-slate-900 bg-slate-950/80 backdrop-blur-md flex-col justify-between z-10 relative">
        <div>
          {/* Logo Brand */}
          <div className="p-6 border-b border-slate-900/60 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary p-[1px] flex items-center justify-center shadow-[0_0_12px_rgba(0,240,255,0.25)]">
              <div className="w-full h-full bg-slate-950 rounded-lg flex items-center justify-center">
                <Shield className="w-4.5 h-4.5 text-primary" />
              </div>
            </div>
            <span className="font-outfit text-md font-extrabold tracking-widest bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent text-glow-primary">
              PHISHNET AI
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {sidebarLinks.map((link) => (
              <SidebarLink
                key={link.href}
                href={link.href}
                icon={link.icon}
                label={link.label}
                active={pathname === link.href}
              />
            ))}
          </nav>
        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-slate-900/60 space-y-2">
          {/* Reset button */}
          <button
            onClick={handleReset}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider font-mono text-amber-500 hover:text-amber-400 hover:bg-amber-500/5 border border-transparent transition-all uppercase cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            RESET FACTORY DATA
          </button>
          
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider font-mono text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 border border-transparent transition-all uppercase cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            EXIT GATEWAY
          </button>
        </div>
      </aside>

      {/* Main Console window */}
      <div className="flex-1 flex flex-col overflow-hidden z-10 relative">
        {/* Header Console */}
        <header className="h-16 border-b border-slate-900 bg-slate-950/65 backdrop-blur-md px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="font-outfit text-sm font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2 text-glow-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--primary)]"></span>
              PHISHNET MONITORING GRID
            </h2>
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-900/60 border border-slate-800 rounded font-mono text-[9px] text-slate-400 font-bold uppercase tracking-wider">
              <span>NODE: EAST-US-GATEWAY</span>
            </div>
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-slate-900/60 border border-slate-800 rounded font-mono text-[9px] text-emerald-400 font-bold uppercase tracking-wider">
              <span>SCANNER: ACTIVE</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-left">
            <div className="font-mono text-xs">
              <span className="text-[9px] text-slate-500 block leading-none uppercase font-bold text-right">OPERATOR ROLE</span>
              <span className="text-slate-300 font-bold">{currentUser?.name || "Analyst Stark"} ({currentUser?.role || "Super Admin"})</span>
            </div>
            
            {/* Quick avatar badge */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary/30 to-secondary/30 flex items-center justify-center border border-primary/20">
              <span className="font-mono text-xs text-primary font-bold">
                {(currentUser?.name || "AS").substring(0, 2).toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        <div className="lg:hidden border-b border-slate-900 bg-slate-950/70 backdrop-blur-md px-3 py-2 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-bold font-mono uppercase tracking-wider border ${
                  pathname === link.href
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-slate-800 text-slate-400 bg-slate-950/40"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#020205] p-6 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
