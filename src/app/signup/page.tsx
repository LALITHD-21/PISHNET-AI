"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Mail, Database, Building2 } from "lucide-react";
import CyberParticles from "@/components/CyberParticles";

export default function SignupPage() {
  const router = useRouter();
  const [orgName, setOrgName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [domain, setDomain] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName || !adminEmail || !domain) return;
    
    // Simulate successful creation of organization
    setSuccess(true);
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  return (
    <div className="relative min-h-screen bg-[#020205] flex items-center justify-center p-6 overflow-hidden font-sans">
      
      {/* Cyber Particles background */}
      <CyberParticles />
      
      <div className="cyber-grid absolute inset-0 z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-secondary p-[1px] flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.3)] mb-4">
            <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-secondary" />
            </div>
          </div>
          <h2 className="font-outfit text-2xl font-black tracking-widest text-slate-100 text-glow-secondary">
            PHISHNET AI
          </h2>
          <p className="text-xs text-slate-500 font-mono tracking-wider mt-1 uppercase">
            ESTABLISH THREAT GATEWAY NODE
          </p>
        </div>

        <div className="cyber-card p-8 rounded-xl border border-slate-900 bg-slate-950/60 backdrop-blur-md shadow-2xl">
          <h3 className="font-outfit text-lg font-bold text-slate-100 mb-6 text-left flex items-center gap-2">
            <span className="w-1 h-3.5 bg-secondary rounded-full shadow-[0_0_8px_var(--secondary)]"></span>
            REGISTER ORGANIZATION
          </h3>

          {success ? (
            <div className="bg-emerald-950/40 border border-emerald-900/60 text-emerald-400 text-xs p-4 rounded font-mono space-y-2">
              <p>[OK] ORGANIZATION CREATED SUCCESSFULLY</p>
              <p>[SYSTEM] SAVING CONFIGURATIONS...</p>
              <p>[SYSTEM] REDIRECTING TO AUTH GATEWAY...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase mb-1.5 tracking-wider">
                  ORGANIZATION NAME
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Acme Corp"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full bg-[#04040c]/80 border border-slate-800 focus:border-secondary/50 text-slate-200 pl-10 pr-4 py-2.5 rounded text-sm outline-none transition-colors font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase mb-1.5 tracking-wider">
                  PRIMARY COMPLIANCE DOMAIN
                </label>
                <div className="relative">
                  <Database className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="acme.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full bg-[#04040c]/80 border border-slate-800 focus:border-secondary/50 text-slate-200 pl-10 pr-4 py-2.5 rounded text-sm outline-none transition-colors font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase mb-1.5 tracking-wider">
                  ROOT ADMIN EMAIL
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-500" />
                  <input
                    type="email"
                    placeholder="admin@acme.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full bg-[#04040c]/80 border border-slate-800 focus:border-secondary/50 text-slate-200 pl-10 pr-4 py-2.5 rounded text-sm outline-none transition-colors font-mono"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="cyber-btn w-full py-3 rounded text-xs tracking-widest font-mono text-center flex items-center justify-center cursor-pointer border border-secondary shadow-[0_0_15px_rgba(157,78,221,0.08)]"
              >
                INITIALIZE GATEWAY NODE
              </button>
            </form>
          )}
        </div>

        <div className="flex justify-between items-center text-[10px] font-mono text-slate-600 mt-6 px-1">
          <Link href="/login" className="hover:text-secondary">RETURN TO LOGIN MODULE</Link>
          <span>ROOT LEVEL NODE</span>
        </div>
      </motion.div>
    </div>
  );
}
