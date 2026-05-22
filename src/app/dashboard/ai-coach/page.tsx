"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Bot,
  Brain,
  ChevronRight,
  Download,
  Gauge,
  Radio,
  Send,
  ShieldCheck,
  Target,
  Users,
  Zap
} from "lucide-react";
import { useSim } from "@/context/SimContext";

const QUICK_PROMPTS = [
  { label: "Threat Overview", prompt: "Generate a full threat overview report", hint: "Executive risk summary" },
  { label: "Risky Departments", prompt: "Show risky departments", hint: "Rank business units" },
  { label: "Predict Vulnerable Users", prompt: "predict vulnerable users", hint: "AI behavior forecast" },
  { label: "Phishing Indicators", prompt: "explain phishing indicators", hint: "Awareness coaching" },
  { label: "Campaign Summary", prompt: "Generate phishing report", hint: "Simulation analysis" },
  { label: "Security Score", prompt: "analyze security posture", hint: "Human firewall rating" }
];

export default function AiCoachPage() {
  const { sendChatMessage, chatMessages, campaigns, employees, departments, logs } = useSim();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    const last = chatMessages[chatMessages.length - 1];
    setIsTyping(last?.sender === "user");
  }, [chatMessages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendChatMessage(input.trim());
    setInput("");
  };

  const handleQuickPrompt = (prompt: string) => {
    sendChatMessage(prompt);
  };

  const totalSent = campaigns.reduce((a, c) => a + c.emailsSent, 0);
  const totalClicks = campaigns.reduce((a, c) => a + c.linksClicked, 0);
  const totalCredentialAttempts = campaigns.reduce((a, c) => a + c.credentialsSubmitted, 0);
  const totalReported = campaigns.reduce((a, c) => a + c.emailsReported, 0);
  const activeCampaigns = campaigns.filter((campaign) => campaign.status === "Active").length;
  const clickRate = totalSent > 0 ? Math.round((totalClicks / totalSent) * 100) : 0;
  const reportRate = totalSent > 0 ? Math.round((totalReported / totalSent) * 100) : 0;
  const defenseScore = Math.max(0, Math.min(100, Math.round(100 - clickRate + reportRate * 0.4 - totalCredentialAttempts * 0.75)));
  const topRiskDept = [...departments].sort((a, b) => b.riskScore - a.riskScore)[0];
  const highRiskUsers = [...employees].sort((a, b) => b.riskScore - a.riskScore).slice(0, 3);
  const recentLogs = logs.slice(0, 6);

  const contextCards = useMemo(() => ([
    { label: "Click Rate", value: `${clickRate}%`, sub: `${totalClicks} risky clicks`, icon: Target, tone: clickRate > 40 ? "text-rose-300" : "text-amber-300" },
    { label: "Safe Attempts", value: totalCredentialAttempts, sub: "simulated only", icon: AlertTriangle, tone: "text-rose-300" },
    { label: "Reports Filed", value: totalReported, sub: `${reportRate}% report rate`, icon: ShieldCheck, tone: "text-emerald-300" },
    { label: "AI Defense", value: `${defenseScore}%`, sub: "human firewall score", icon: Gauge, tone: "text-primary" }
  ]), [clickRate, defenseScore, reportRate, totalClicks, totalCredentialAttempts, totalReported]);

  const intelligenceSummary = useMemo(() => {
    const departmentName = topRiskDept?.name.replace(" & Accounting", "").replace(" & IT", "") || "No department";
    if (clickRate >= 40 || totalCredentialAttempts > 10) {
      return {
        label: "Elevated Exposure",
        tone: "text-rose-300",
        detail: `${departmentName} needs immediate adaptive training. Prioritize link inspection, credential defense, and reporting drills.`
      };
    }

    if (reportRate >= 60 && defenseScore >= 75) {
      return {
        label: "Strong Resilience",
        tone: "text-emerald-300",
        detail: "Reporting behavior is healthy. Keep simulations rotating across QR, MFA fatigue, payroll, and executive impersonation templates."
      };
    }

    return {
      label: "Training Opportunity",
      tone: "text-amber-300",
      detail: `${departmentName} is the current focus area. Coach users with short awareness modules after each risky interaction.`
    };
  }, [clickRate, defenseScore, reportRate, topRiskDept, totalCredentialAttempts]);

  const handleExportBrief = () => {
    const transcript = chatMessages.length
      ? chatMessages.map((message) => `[${message.timestamp}] ${message.sender.toUpperCase()}: ${message.text}`).join("\n\n")
      : "No chat transcript yet. Use a quick intelligence query to generate AI output.";

    const brief = [
      "PHISHNET AI - CYBER ASSISTANT INTELLIGENCE BRIEF",
      `Generated: ${new Date().toLocaleString()}`,
      "",
      "LIVE CONTEXT",
      `Active Campaigns: ${activeCampaigns}`,
      `Employees Monitored: ${employees.length}`,
      `Click Rate: ${clickRate}%`,
      `Safe Credential Attempts: ${totalCredentialAttempts}`,
      `Reports Filed: ${totalReported}`,
      `AI Defense Score: ${defenseScore}%`,
      `Highest Risk Department: ${topRiskDept?.name || "None"}`,
      "",
      "AI RECOMMENDATION",
      `${intelligenceSummary.label}: ${intelligenceSummary.detail}`,
      "",
      "TRANSCRIPT",
      transcript
    ].join("\n");

    const blob = new Blob([brief], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `phishnet_ai_brief_${new Date().toISOString().replace(/[:.]/g, "-")}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const escapeHtml = (text: string) =>
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const normalizeAssistantText = (text: string) =>
    text
      .replace(/Total Credential Submissions \(Compromised\)/gi, "Safe Credential Attempts")
      .replace(/Credential Submissions \(Compromised\)/gi, "Safe Credential Attempts")
      .replace(/compromised users/gi, "safe credential attempts")
      .replace(/\(Compromised\)/gi, "(Simulated)");

  const renderMarkdown = (text: string) => {
    return escapeHtml(normalizeAssistantText(text))
      .replace(/^### (.*)$/gm, '<div class="mt-4 mb-2 font-outfit text-2xl font-black tracking-tighter text-primary">$1</div>')
      .replace(/^## (.*)$/gm, '<div class="mt-4 mb-2 font-outfit text-3xl font-black tracking-tighter text-slate-100">$1</div>')
      .replace(/^# (.*)$/gm, '<div class="mt-4 mb-3 font-outfit text-4xl font-black tracking-tighter text-slate-100">$1</div>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary">$1</strong>')
      .replace(/^- (.*)$/gm, '<div class="my-2 flex gap-2 rounded-2xl border border-white/10 bg-[#050505]/45 px-3 py-2"><span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"></span><span>$1</span></div>')
      .replace(/^\|(.+)\|$/gm, '<div class="my-1 overflow-x-auto whitespace-pre rounded-xl border border-white/10 bg-[#050505]/60 px-3 py-2 text-xs text-white/62">|$1|</div>')
      .replace(/\n/g, "<br/>");
  };

  return (
    <div className="soc-showcase space-y-7">
      <section className="cyber-card relative overflow-hidden rounded-3xl border border-white/10 bg-[#050505] p-6 md:p-8">
        <div className="absolute inset-0 cyber-grid opacity-35 pointer-events-none" />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />
        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-4 py-2 cyber-metadata text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              AI Command Center / Human Firewall Coach
            </div>
            <h1 className="mt-5 font-outfit text-5xl font-black leading-[0.92] tracking-tighter text-[#EBEBEB] md:text-7xl xl:text-8xl">
              AI Cyber Intelligence <span className="italic text-primary">Assistant</span>
            </h1>
            <p className="mt-5 max-w-4xl text-lg font-bold leading-relaxed text-white/72 md:text-xl">
              Ask PhishNet AI to analyze live campaigns, identify risky departments, predict vulnerable users, and generate adaptive awareness recommendations in seconds.
            </p>
          </div>

          <div className="grid min-w-full grid-cols-2 gap-3 sm:min-w-[420px]">
            <div className="rounded-3xl border border-primary/25 bg-primary/[0.045] p-4">
              <div className="flex items-center gap-2 cyber-metadata text-primary">
                <Radio className="h-4 w-4 animate-pulse" />
                AI Engine
              </div>
              <div className="mt-3 font-outfit text-3xl font-black tracking-tighter text-primary">Online</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-4">
              <div className="cyber-metadata text-white/50">Active Campaigns</div>
              <div className="mt-3 font-outfit text-3xl font-black tracking-tighter text-[#EBEBEB]">{activeCampaigns}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12 xl:items-start">
        <aside className="space-y-5 xl:col-span-4">
          <div className="cyber-card rounded-3xl border border-primary/20 bg-primary/[0.025] p-5 md:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="cyber-metadata text-primary">AI Context Snapshot</p>
                <h2 className="mt-2 font-outfit text-4xl font-black tracking-tighter text-[#EBEBEB]">Live Risk Signals</h2>
              </div>
              <Brain className="h-9 w-9 text-primary" />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              {contextCards.map(({ label, value, sub, icon: Icon, tone }) => (
                <div key={label} className="rounded-3xl border border-white/10 bg-[#050505]/70 p-4">
                  <div className="flex items-center justify-between">
                    <span className="cyber-metadata text-white/55">{label}</span>
                    <Icon className={`h-5 w-5 ${tone}`} />
                  </div>
                  <div className={`mt-3 font-outfit text-4xl font-black tracking-tighter ${tone}`}>{value}</div>
                  <div className="mt-1 text-sm font-bold text-white/54">{sub}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-3xl border border-white/10 bg-[#050505]/75 p-4">
              <div className="cyber-metadata text-white/45">AI Recommendation State</div>
              <h3 className={`mt-2 font-outfit text-3xl font-black tracking-tighter ${intelligenceSummary.tone}`}>
                {intelligenceSummary.label}
              </h3>
              <p className="mt-2 text-sm font-bold leading-relaxed text-white/66">{intelligenceSummary.detail}</p>
            </div>
          </div>

          <div className="cyber-card rounded-3xl border border-white/10 bg-white/[0.02] p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="cyber-metadata text-primary">Quick Intelligence Queries</p>
                <h2 className="mt-2 font-outfit text-3xl font-black tracking-tighter text-[#EBEBEB]">One-Click AI Actions</h2>
              </div>
              <Zap className="h-7 w-7 text-primary" />
            </div>
            <div className="space-y-3">
              {QUICK_PROMPTS.map((quickPrompt) => (
                <button
                  key={quickPrompt.label}
                  onClick={() => handleQuickPrompt(quickPrompt.prompt)}
                  className="group flex min-h-16 w-full items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#050505]/75 px-4 py-3 text-left transition-all hover:border-primary/40 hover:bg-primary/[0.055] cursor-pointer"
                >
                  <span>
                    <span className="block font-outfit text-xl font-black tracking-tighter text-[#EBEBEB] group-hover:text-primary">
                      {quickPrompt.label}
                    </span>
                    <span className="mt-1 block text-sm font-bold text-white/45">{quickPrompt.hint}</span>
                  </span>
                  <ChevronRight className="h-5 w-5 shrink-0 text-white/25 transition-all group-hover:translate-x-1 group-hover:text-primary" />
                </button>
              ))}
            </div>
          </div>

          <div className="cyber-card rounded-3xl border border-white/10 bg-white/[0.02] p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="cyber-metadata text-primary">Recent Threat Events</p>
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-3">
              {recentLogs.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-white/10 bg-[#050505]/70 p-4 text-sm font-bold text-white/45">
                  No events yet. Launch a campaign first.
                </p>
              ) : recentLogs.map((log) => (
                <div key={log.id} className="rounded-2xl border border-white/10 bg-[#050505]/70 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className={`font-mono text-[10px] font-black uppercase tracking-[0.16em] ${
                      log.action === "REPORTED"
                        ? "text-emerald-300"
                        : log.action === "CREDENTIALS_SUBMITTED"
                          ? "text-rose-300"
                          : log.action === "CLICKED"
                            ? "text-amber-300"
                            : "text-white/55"
                    }`}>
                      {log.action.replace(/_/g, " ")}
                    </span>
                    <span className="font-mono text-[9px] font-bold text-white/35">{log.department}</span>
                  </div>
                  <div className="mt-2 font-outfit text-xl font-black tracking-tighter text-[#EBEBEB]">{log.employeeName}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="xl:col-span-8">
          <div className="cyber-card flex h-[72vh] min-h-[680px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#050505]/82">
            <div className="border-b border-white/10 px-5 py-5 md:px-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 shadow-[0_0_30px_rgba(16,185,129,0.12)]">
                    <Bot className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-outfit text-3xl font-black tracking-tighter text-[#EBEBEB] md:text-4xl">
                      PhishNet AI Cyber Coach
                    </h2>
                    <p className="mt-1 font-mono text-[11px] font-black uppercase tracking-[0.16em] text-emerald-300">
                      Online | Context-aware | Security Intelligence v3.1
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {["NLP Generator", "Risk Scoring", "Training Router"].map((model) => (
                    <span key={model} className="rounded-full border border-primary/20 bg-primary/[0.045] px-3 py-1.5 font-mono text-[9px] font-black uppercase tracking-[0.16em] text-primary">
                      {model}
                    </span>
                  ))}
                  <button
                    onClick={handleExportBrief}
                    className="rounded-full border border-white/15 bg-white/[0.025] px-3 py-1.5 font-mono text-[9px] font-black uppercase tracking-[0.16em] text-white/72 transition-all hover:border-primary/35 hover:text-primary"
                  >
                    <Download className="mr-1.5 inline h-3.5 w-3.5" />
                    Export Brief
                  </button>
                </div>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto p-5 font-mono text-sm md:p-6">
              {chatMessages.length === 0 && (
                <div className="flex min-h-full items-center justify-center py-12 text-center">
                  <div className="max-w-2xl">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-primary/25 bg-primary/10 shadow-[0_0_42px_rgba(16,185,129,0.13)]">
                      <Bot className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="mt-6 font-outfit text-4xl font-black tracking-tighter text-[#EBEBEB]">
                      Hello, Security Analyst.
                    </h3>
                    <p className="mx-auto mt-4 max-w-xl text-lg font-bold leading-relaxed text-white/58">
                      Ask me to analyze campaign vulnerabilities, predict high-risk employees, explain phishing indicators, or generate adaptive training recommendations.
                    </p>
                    <p className="mt-5 font-mono text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                      Start with a quick query from the left panel.
                    </p>
                  </div>
                </div>
              )}

              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  {message.sender === "ai" && (
                    <div className="mr-3 mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[88%] rounded-3xl px-5 py-4 text-base font-bold leading-7 md:text-[15px] ${
                    message.sender === "user"
                      ? "border border-primary/25 bg-primary/[0.085] text-right text-[#EBEBEB]"
                      : "border border-white/10 bg-white/[0.035] text-white/74"
                  }`}>
                    {message.sender === "ai" ? (
                      <div dangerouslySetInnerHTML={{ __html: renderMarkdown(message.text) }} />
                    ) : (
                      <p>{message.text}</p>
                    )}
                    <span className="mt-2 block font-mono text-[10px] font-black uppercase tracking-[0.14em] text-white/35">
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="mr-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/[0.035] px-5 py-4">
                    <div className="flex h-5 items-center gap-1.5">
                      {[0, 1, 2].map((index) => (
                        <div key={index} className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: `${index * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-white/10 p-4 md:p-5">
              <div className="flex flex-col gap-3 md:flex-row">
                <input
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && handleSend()}
                  placeholder="Ask PhishNet AI about threats, risk predictions, or training recommendations..."
                  className="min-h-14 flex-1 rounded-2xl border border-white/10 bg-white/[0.035] px-5 text-base font-bold text-[#EBEBEB] outline-none transition-colors placeholder:text-white/32 focus:border-primary/45"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="cyber-btn min-h-14 rounded-2xl px-6 font-mono text-[11px] font-black disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                >
                  <Send className="mr-2 inline h-4 w-4" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {highRiskUsers.map((employee, index) => (
          <div key={employee.id} className="cyber-card rounded-3xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-center justify-between">
              <span className="cyber-metadata text-white/50">Predicted Vulnerable User #{index + 1}</span>
              <Users className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mt-4 font-outfit text-3xl font-black tracking-tighter text-[#EBEBEB]">{employee.name}</h3>
            <p className="mt-1 text-sm font-bold text-white/54">{employee.department}</p>
            <div className="mt-4 flex items-end justify-between">
              <span className="font-outfit text-5xl font-black tracking-tighter text-rose-300">{employee.riskScore}</span>
              <span className="rounded-full border border-rose-400/25 bg-rose-400/[0.055] px-3 py-1 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-rose-300">
                High Risk
              </span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
