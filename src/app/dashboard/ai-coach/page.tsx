"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bot, Send, Zap, AlertTriangle, Sparkles, ChevronRight } from "lucide-react";
import { useSim } from "@/context/SimContext";

const QUICK_PROMPTS = [
  { label: "Threat Overview", prompt: "Generate a full threat overview report" },
  { label: "Risky Departments", prompt: "Show risky departments" },
  { label: "Predict Vulnerable Users", prompt: "predict vulnerable users" },
  { label: "Phishing Indicators", prompt: "explain phishing indicators" },
  { label: "Campaign Summary", prompt: "Generate phishing report" },
  { label: "Security Score", prompt: "analyze security posture" },
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

  // Watch for AI response
  useEffect(() => {
    const last = chatMessages[chatMessages.length - 1];
    if (last?.sender === "user") {
      setIsTyping(true);
      const t = setTimeout(() => setIsTyping(false), 900);
      return () => clearTimeout(t);
    }
  }, [chatMessages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendChatMessage(input.trim());
    setInput("");
  };

  const handleQuickPrompt = (prompt: string) => {
    sendChatMessage(prompt);
  };

  // Live stats panel
  const totalSent = campaigns.reduce((a, c) => a + c.emailsSent, 0);
  const totalClicks = campaigns.reduce((a, c) => a + c.linksClicked, 0);
  const totalCompromised = campaigns.reduce((a, c) => a + c.credentialsSubmitted, 0);
  const totalReported = campaigns.reduce((a, c) => a + c.emailsReported, 0);
  const clickRate = totalSent > 0 ? Math.round((totalClicks / totalSent) * 100) : 0;
  const topRiskDept = [...departments].sort((a, b) => b.riskScore - a.riskScore)[0];
  const recentLogs = logs.slice(0, 5);

  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary">$1</strong>')
      .replace(/### (.*?)(\n|$)/g, '<div class="text-xs font-bold text-accent uppercase tracking-wider mt-3 mb-1">$1</div>')
      .replace(/## (.*?)(\n|$)/g, '<div class="text-sm font-bold text-slate-100 mt-3 mb-1">$1</div>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-900 pb-4">
        <div>
          <h1 className="font-outfit text-2xl font-black tracking-wide text-slate-100 flex items-center gap-2">
            <Bot className="w-6 h-6 text-primary" /> AI CYBER INTELLIGENCE ASSISTANT
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">PhishNet AI analyzes live campaign data and generates security insights in real-time.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 border border-emerald-500/30 bg-emerald-500/5 rounded font-mono text-[10px] text-emerald-400 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          AI ENGINE ONLINE
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel: Stats + Quick Actions */}
        <div className="lg:col-span-4 space-y-4">

          {/* Live Context Panel */}
          <div className="cyber-card rounded-xl border border-slate-900 bg-slate-950/60 p-5">
            <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-primary" /> AI CONTEXT SNAPSHOT
            </p>
            <div className="space-y-3 font-mono text-xs">
              {[
                { label: "Click-Through Rate", value: `${clickRate}%`, color: clickRate > 40 ? "text-rose-400" : "text-amber-400" },
                { label: "Compromised Users", value: totalCompromised, color: "text-rose-500" },
                { label: "Phish Reports Filed", value: totalReported, color: "text-emerald-400" },
                { label: "Highest Risk Dept", value: topRiskDept?.name.replace(" & Accounting", "").replace(" & IT", "") || "—", color: "text-amber-500" },
                { label: "Active Employees", value: employees.length, color: "text-primary" },
                { label: "Total Campaigns", value: campaigns.length, color: "text-slate-300" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between border-b border-slate-900/60 pb-2">
                  <span className="text-slate-500">{label}</span>
                  <span className={`font-bold ${color}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="cyber-card rounded-xl border border-slate-900 bg-slate-950/60 p-5">
            <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-accent" /> QUICK INTELLIGENCE QUERIES
            </p>
            <div className="space-y-2">
              {QUICK_PROMPTS.map((qp) => (
                <button
                  key={qp.label}
                  onClick={() => handleQuickPrompt(qp.prompt)}
                  className="w-full text-left px-3 py-2.5 border border-slate-800 hover:border-primary/40 hover:bg-primary/5 rounded-lg font-mono text-xs text-slate-400 hover:text-primary transition-all flex items-center justify-between group cursor-pointer"
                >
                  <span>{qp.label}</span>
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>

          {/* Recent Events */}
          <div className="cyber-card rounded-xl border border-slate-900 bg-slate-950/60 p-5">
            <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3 text-amber-400" /> RECENT THREAT EVENTS
            </p>
            <div className="space-y-2">
              {recentLogs.length === 0 ? (
                <p className="text-xs text-slate-600 font-mono">No events. Launch a campaign first.</p>
              ) : recentLogs.map((log) => (
                <div key={log.id} className="text-xs font-mono border-b border-slate-900/50 pb-1.5">
                  <span className={`font-bold ${log.action === "REPORTED" ? "text-emerald-400" : log.action === "CREDENTIALS_SUBMITTED" ? "text-rose-400" : log.action === "CLICKED" ? "text-amber-400" : "text-slate-400"}`}>
                    [{log.action}]
                  </span>
                  <span className="text-slate-400 ml-1">{log.employeeName}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Chat Console */}
        <div className="lg:col-span-8">
          <div className="cyber-card rounded-xl border border-slate-900 bg-slate-950/60 flex flex-col" style={{ height: "70vh" }}>
            {/* Chat Header */}
            <div className="border-b border-slate-900 px-5 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary/30 to-secondary/30 border border-primary/30 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">PhishNet AI Cyber Coach</p>
                <p className="text-[10px] text-emerald-400 font-mono">● Online · Context-aware · Security Intelligence v3.1</p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 font-mono text-xs">
              {chatMessages.length === 0 && (
                <div className="text-center space-y-4 py-10">
                  <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                    <Bot className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-slate-300 font-bold">Hello, Security Analyst.</p>
                  <p className="text-slate-500 text-xs max-w-sm mx-auto">I am your PhishNet AI Cyber Coach. Ask me to analyze campaign vulnerabilities, predict high-risk employees, or generate training recommendations.</p>
                  <p className="text-slate-600 text-[10px]">Try a quick query from the sidebar →</p>
                </div>
              )}

              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.sender === "ai" && (
                    <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-xl px-4 py-3 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-primary/10 border border-primary/20 text-slate-200 text-right"
                      : "bg-slate-900/60 border border-slate-800 text-slate-300"
                  }`}>
                    {msg.sender === "ai" ? (
                      <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }} />
                    ) : (
                      <p>{msg.text}</p>
                    )}
                    <span className="text-[9px] text-slate-600 block mt-1">{msg.timestamp}</span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mr-2 flex-shrink-0">
                    <Bot className="w-3 h-3 text-primary" />
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3">
                    <div className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-slate-900 p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask PhishNet AI about threats, risk predictions, or training recommendations..."
                  className="flex-1 bg-slate-900/60 border border-slate-800 focus:border-primary/50 rounded-lg px-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 outline-none transition-colors font-mono"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="cyber-btn px-4 py-2.5 rounded-lg flex items-center gap-2 font-mono text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  SEND
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
