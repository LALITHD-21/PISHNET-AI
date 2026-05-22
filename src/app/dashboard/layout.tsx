"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Send, FileCode, Users, GraduationCap, Bot, Bomb, FileSpreadsheet, Settings, LogOut, RefreshCw, BarChart3, UserCircle } from "lucide-react";
import { useSim } from "@/context/SimContext";
import PhishNetLogo from "@/components/PhishNetLogo";

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
      className={`cyber-link flex items-center gap-3.5 px-4 py-3 rounded-full text-xs font-semibold tracking-[0.2em] font-mono transition-all uppercase ${
        active
          ? "bg-white/[0.03] text-primary border border-primary/25 shadow-[0_0_18px_rgba(16,185,129,0.10)]"
          : "text-white/45 hover:text-[#EBEBEB] hover:bg-white/[0.025] border border-transparent"
      }`}
    >
      <span className={active ? "text-primary" : "text-white/30"}>{icon}</span>
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
    <div className="flex h-screen bg-[#050505] text-[#EBEBEB] overflow-hidden font-sans relative">
      {/* CRT Scanline Overlay */}
      <div className="scanline"></div>

      {/* Cyber Grid overlay */}
      <div className="cyber-grid absolute inset-0 z-0"></div>
      <div className="cyber-ambient-glow -left-32 top-24 z-0 opacity-80"></div>
      <div className="cyber-ambient-glow bottom-8 right-12 z-0 opacity-45 [animation-delay:-3s]"></div>

      {/* Sidebar Navigation */}
      <aside className="hidden lg:flex w-72 border-r border-white/10 bg-black/80 backdrop-blur-md flex-col justify-between z-10 relative">
        <div>
          {/* Logo Brand */}
          <div className="p-6 border-b border-white/10">
            <PhishNetLogo compact markClassName="h-10 w-10" wordmarkClassName="min-w-0" />
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
        <div className="p-4 border-t border-white/10 space-y-2">
          {/* Reset button */}
          <button
            onClick={handleReset}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-full text-xs font-semibold tracking-[0.2em] font-mono text-white/45 hover:text-primary hover:bg-white/[0.025] border border-transparent transition-all uppercase cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            RESET FACTORY DATA
          </button>
          
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-full text-xs font-semibold tracking-[0.2em] font-mono text-white/45 hover:text-rose-300 hover:bg-white/[0.025] border border-transparent transition-all uppercase cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            EXIT GATEWAY
          </button>
        </div>
      </aside>

      {/* Main Console window */}
      <div className="flex-1 flex flex-col overflow-hidden z-10 relative">
        {/* Header Console */}
        <header className="h-16 border-b border-white/10 bg-black/80 backdrop-blur-md px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <PhishNetLogo showWordmark={false} markClassName="h-8 w-8" className="lg:hidden xl:inline-flex" />
            <h2 className="font-space-grotesk text-[10px] font-bold uppercase tracking-[0.2em] text-[#EBEBEB] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--primary)]"></span>
              PHISHNET MONITORING GRID
            </h2>
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-white/[0.02] border border-white/10 rounded-full font-mono text-[9px] text-white/40 font-bold uppercase tracking-[0.2em]">
              <span>NODE: EAST-US-GATEWAY</span>
            </div>
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-white/[0.02] border border-primary/20 rounded-full font-mono text-[9px] text-primary font-bold uppercase tracking-[0.2em]">
              <span>SCANNER: ACTIVE</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-left">
            <div className="font-mono text-xs">
              <span className="text-[9px] text-white/35 block leading-none uppercase font-bold text-right tracking-[0.2em]">OPERATOR ROLE</span>
              <span className="text-white/75 font-bold">{currentUser?.name || "Analyst Stark"} ({currentUser?.role || "Super Admin"})</span>
            </div>
            
            {/* Quick avatar badge */}
            <div className="w-9 h-9 rounded-full bg-white/[0.03] flex items-center justify-center border border-primary/20 shadow-[0_0_24px_rgba(16,185,129,0.10)]">
              <span className="font-mono text-xs text-primary font-bold">
                {(currentUser?.name || "AS").substring(0, 2).toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        <div className="lg:hidden border-b border-white/10 bg-black/80 backdrop-blur-md px-3 py-2 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-[10px] font-bold font-mono uppercase tracking-[0.2em] border ${
                  pathname === link.href
                    ? "border-primary/30 bg-white/[0.03] text-primary"
                    : "border-white/10 text-white/45 bg-white/[0.02]"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#050505] p-6 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
