"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Mail, UserCheck } from "lucide-react";
import { useSim, Role } from "@/context/SimContext";
import CyberParticles from "@/components/CyberParticles";

export default function LoginPage() {
  const router = useRouter();
  const { loginUser } = useSim();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("Super Admin");
  const [name, setName] = useState("");
  const [dept, setDept] = useState("Engineering & IT");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email address is required.");
      return;
    }
    
    // Login user in Context
    const success = loginUser(email, role, name || undefined, role === "Employee" || role === "Department Manager" ? dept : undefined);
    
    if (success) {
      // Redirect to MFA
      router.push("/mfa");
    } else {
      setError("Invalid login credentials.");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#020205] flex items-center justify-center p-6 overflow-hidden font-sans">
      
      {/* Cyber Particles background */}
      <CyberParticles />
      
      {/* Cyber Background grid */}
      <div className="cyber-grid absolute inset-0 z-0"></div>
      
      {/* Glowing Neon Lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-secondary p-[1px] flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.3)] mb-4">
            <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h2 className="font-outfit text-2xl font-black tracking-widest text-slate-100 text-glow-primary">
            PHISHNET AI
          </h2>
          <p className="text-xs text-slate-500 font-mono tracking-wider mt-1 uppercase">
            SECURE ANALYST AUTHENTICATION NODE
          </p>
        </div>

        {/* Login Form Card */}
        <div className="cyber-card p-8 rounded-xl border border-slate-900 bg-slate-950/60 backdrop-blur-md shadow-2xl">
          <h3 className="font-outfit text-lg font-bold text-slate-100 mb-6 text-left flex items-center gap-2">
            <span className="w-1 h-3.5 bg-primary rounded-full shadow-[0_0_8px_var(--primary)]"></span>
            LOGIN TO TERMINAL
          </h3>

          {error && (
            <div className="bg-red-950/40 border border-red-900/60 text-red-400 text-xs p-3 rounded mb-4 font-mono">
              [ERROR] {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            <div>
              <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase mb-1.5 tracking-wider">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="email"
                  placeholder="name@enterprise.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#04040c]/80 border border-slate-800 focus:border-primary/50 text-slate-200 pl-10 pr-4 py-2.5 rounded text-sm outline-none transition-colors font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase mb-1.5 tracking-wider">
                FULL NAME (OPTIONAL)
              </label>
              <div className="relative">
                <UserCheck className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Analyst Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#04040c]/80 border border-slate-800 focus:border-primary/50 text-slate-200 pl-10 pr-4 py-2.5 rounded text-sm outline-none transition-colors font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase mb-1.5 tracking-wider">
                AUTHENTICATION ROLE
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full bg-[#04040c]/80 border border-slate-800 focus:border-primary/50 text-slate-200 px-3 py-2.5 rounded text-sm outline-none transition-colors font-mono appearance-none"
              >
                <option value="Super Admin">Super Admin (SOC Console)</option>
                <option value="Security Analyst">Security Analyst (Threat Intel)</option>
                <option value="Department Manager">Department Manager (Risk Audits)</option>
                <option value="Employee">Employee (Awareness Learning & Mailbox)</option>
              </select>
            </div>

            {(role === "Employee" || role === "Department Manager") && (
              <div>
                <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase mb-1.5 tracking-wider">
                  DEPARTMENT SECTOR
                </label>
                <select
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  className="w-full bg-[#04040c]/80 border border-slate-800 focus:border-primary/50 text-slate-200 px-3 py-2.5 rounded text-sm outline-none transition-colors font-mono appearance-none"
                >
                  <option value="Engineering & IT">Engineering & IT</option>
                  <option value="Finance & Accounting">Finance & Accounting</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Sales & Marketing">Sales & Marketing</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="cyber-btn w-full py-3 rounded text-xs tracking-widest font-mono text-center flex items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.08)]"
            >
              REQUEST ACCESS CODE
            </button>
          </form>
        </div>

        {/* Footer help guidelines */}
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-600 mt-6 px-1">
          <Link href="/signup" className="hover:text-primary">REGISTER NEW GATEWAY</Link>
          <Link href="/forgot-password" className="hover:text-primary">RECOVER ACCESS</Link>
          <span>DEMO MODE ACTIVE</span>
        </div>
      </motion.div>
    </div>
  );
}
