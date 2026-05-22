"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, KeyRound, Mail, ShieldCheck } from "lucide-react";
import CyberParticles from "@/components/CyberParticles";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"request" | "verify" | "done">("request");

  const requestReset = (event: React.FormEvent) => {
    event.preventDefault();
    setStep("verify");
  };

  const verifyReset = (event: React.FormEvent) => {
    event.preventDefault();
    if (code.length === 6 && password.length >= 8) {
      setStep("done");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#020205] flex items-center justify-center p-6 overflow-hidden font-sans text-slate-100">
      <CyberParticles />
      <div className="cyber-grid absolute inset-0 z-0" />
      <div className="absolute inset-x-0 top-1/4 mx-auto h-72 w-72 rounded-full bg-primary/5 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative z-10 w-full max-w-md"
      >
        <Link href="/login" className="mb-6 inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-primary">
          <ArrowLeft className="w-4 h-4" /> Return to login gateway
        </Link>

        <div className="cyber-card rounded-xl border border-slate-900 bg-slate-950/70 p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl border border-primary/20 bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-outfit text-xl font-black tracking-wide">Password Recovery</h1>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Secure demo reset workflow</p>
            </div>
          </div>

          {step === "request" && (
            <form onSubmit={requestReset} className="space-y-5">
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter your enterprise email. PhishNet AI will simulate sending a one-time recovery code through your approved identity provider.
              </p>
              <label className="block">
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">Email address</span>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded border border-slate-800 bg-[#04040c]/80 py-2.5 pl-10 pr-3 text-sm text-slate-200 outline-none focus:border-primary/50 font-mono"
                    placeholder="admin@enterprise.com"
                    required
                  />
                </div>
              </label>
              <button className="cyber-btn w-full rounded py-3 text-xs font-mono font-bold">Send Recovery Code</button>
            </form>
          )}

          {step === "verify" && (
            <form onSubmit={verifyReset} className="space-y-5">
              <div className="rounded border border-primary/20 bg-primary/5 p-3 text-xs font-mono text-primary">
                [DEMO] Recovery code sent. Use any 6-digit code to continue.
              </div>
              <label className="block">
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">One-time code</span>
                <div className="relative mt-1">
                  <KeyRound className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    value={code}
                    maxLength={6}
                    onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                    className="w-full rounded border border-slate-800 bg-[#04040c]/80 py-2.5 pl-10 pr-3 text-sm text-slate-200 outline-none focus:border-primary/50 font-mono tracking-widest"
                    placeholder="123456"
                    required
                  />
                </div>
              </label>
              <label className="block">
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">New password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-1 w-full rounded border border-slate-800 bg-[#04040c]/80 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-primary/50 font-mono"
                  placeholder="Minimum 8 characters"
                  minLength={8}
                  required
                />
              </label>
              <button className="cyber-btn w-full rounded py-3 text-xs font-mono font-bold">Rotate Password</button>
            </form>
          )}

          {step === "done" && (
            <div className="space-y-5 text-center">
              <CheckCircle className="mx-auto w-14 h-14 text-emerald-400" />
              <div>
                <h2 className="font-outfit text-lg font-bold text-emerald-400">Password rotated</h2>
                <p className="mt-2 text-xs text-slate-400">Your demo account is ready. Production mode would invalidate old sessions and write an audit event.</p>
              </div>
              <Link href="/login" className="cyber-btn inline-flex w-full justify-center rounded py-3 text-xs font-mono font-bold">
                Return to Login
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
