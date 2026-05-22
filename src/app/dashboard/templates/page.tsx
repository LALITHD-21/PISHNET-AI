"use client";

import React, { useState } from "react";
import { Sparkles, Eye, ShieldAlert, Cpu, Check } from "lucide-react";
import { useSim, PhishingTemplate } from "@/context/SimContext";
import DashboardCard from "@/components/DashboardCard";

export default function TemplatesPage() {
  const { templates } = useSim();
  const [selectedTpl, setSelectedTpl] = useState<PhishingTemplate | null>(templates[0] || null);

  // AI Generator state
  const [targetPersona, setTargetPersona] = useState("Finance Department");
  const [scenarioType, setScenarioType] = useState("SSO Password Expiry");
  const [urgency, setUrgency] = useState("High");
  const [generating, setGenerating] = useState(false);
  const [generatorLogs, setGeneratorLogs] = useState<string[]>([]);
  const [generatedTemplate, setGeneratedTemplate] = useState<{
    subject: string;
    sender: string;
    body: string;
  } | null>(null);

  const handleAiGenerate = () => {
    setGenerating(true);
    setGeneratedTemplate(null);
    setGeneratorLogs([]);

    const logSteps = [
      "[NLP] Initializing local Transformer pipeline...",
      `[AI] Profiling security compliance vectors for targeted segment: ${targetPersona}...`,
      `[AI] Modeling emotional triggers for scenario: ${scenarioType} (Urgency: ${urgency})...`,
      "[AI] Formulating subject headlines and domain spoofs...",
      "[AI] Structuring HTML body container with hidden indicators...",
      "[OK] Payload synthesis complete."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < logSteps.length) {
        const nextLog = logSteps[currentStep];
        setGeneratorLogs(prev => [...prev, nextLog]);
        currentStep++;
      } else {
        clearInterval(interval);
        
        // Generate simulated content
        let subject = "";
        let sender = "";
        let body = "";

        if (scenarioType === "SSO Password Expiry") {
          subject = "URGENT: Single Sign-On (SSO) Re-authentication Required";
          sender = "auth-verify@corporate-sso-gateway.org";
          body = `<div style="font-family: Arial, sans-serif; max-width: 550px; padding: 20px; border: 1px solid #ddd;">
            <h3 style="color: #2563eb; margin-top:0;">Single Sign-On Authentication Alert</h3>
            <p>Our security logs indicate your corporate SSO token has expired. You are required to verify your password immediately to prevent active sessions from terminating.</p>
            <div style="margin: 20px 0;"><a href="#" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Credentials</a></div>
            <p style="font-size: 11px; color: #777;">This is a mandatory compliance audit request.</p>
          </div>`;
        } else if (scenarioType === "HR Payroll Scam") {
          subject = "Q3 Payroll Audit: Missing Bank Routing Coordinates";
          sender = "hr-finance-update@internal-payroll.net";
          body = `<div style="font-family: sans-serif; max-width: 550px; padding: 20px; border: 1px solid #fee2e2;">
            <h3 style="color: #dc2626; margin-top:0;">HR Benefits Administration</h3>
            <p>Hello Team, we detected corrupted routing coordinates in your payroll profile. Please verify your banking information immediately to prevent salary payout holds on the 25th.</p>
            <div style="margin: 20px 0;"><a href="#" style="background-color: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Update Bank Details</a></div>
            <p style="font-size: 11px; color: #dc2626; font-weight:bold;">Warning: Salary holds will apply if not updated today.</p>
          </div>`;
        } else {
          subject = "CRITICAL: Urgent zoom invite from Executive Board";
          sender = "zoom-meeting-invite@executive-meetings-router.com";
          body = `<div style="font-family: sans-serif; padding: 15px; border: 1px solid #3b82f6;">
            <p>You have been requested to join a confidential Zoom meeting regarding Q3 reorganizations in 5 minutes.</p>
            <p>Click below to join the authorization lobby instantly:</p>
            <div style="margin: 15px 0;"><a href="#" style="color: #2563eb; font-weight: bold;">Join Board Meeting Lobby</a></div>
            <p>Executive Office Team</p>
          </div>`;
        }

        setGeneratedTemplate({ subject, sender, body });
        setGenerating(false);
      }
    }, 400);
  };

  return (
    <div className="space-y-6">
      
      {/* HUD Header */}
      <div className="flex justify-between items-center border-b border-slate-900 pb-4">
        <div>
          <h1 className="font-outfit text-2xl font-black tracking-wide text-slate-100 uppercase">
            VECTOR TEMPLATES & AI LAB
          </h1>
          <p className="text-xs text-slate-400 font-medium">Configure phishing templates or synthesize bespoke vectors using cognitive NLP modeling.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Templates index list */}
        <div className="lg:col-span-4 space-y-4">
          <DashboardCard title="VECTOR TEMPLATE FILES" subtitle="Index of compiled social engineering blueprints.">
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedTpl(tpl)}
                  className={`w-full text-left p-3.5 rounded-lg border font-mono transition-all flex flex-col justify-between cursor-pointer ${
                    selectedTpl?.id === tpl.id
                      ? "border-primary bg-primary/5 shadow-[0_0_8px_rgba(0,240,255,0.05)]"
                      : "border-slate-900 bg-slate-950/20 hover:border-slate-800 hover:bg-slate-900/10"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-slate-300 truncate max-w-[150px]">{tpl.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                      tpl.difficulty === "Easy" ? "bg-emerald-950 text-emerald-400 border border-emerald-900/40" :
                      tpl.difficulty === "Medium" ? "bg-sky-950 text-sky-400 border border-sky-900/40" :
                      tpl.difficulty === "Hard" ? "bg-amber-950 text-amber-400 border border-amber-900/40" :
                      "bg-rose-950 text-rose-400 border border-rose-900/40"
                    }`}>
                      {tpl.difficulty}
                    </span>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-500 mt-1">
                    <span>{tpl.category}</span>
                    <span className="text-primary hover:underline flex items-center gap-1">
                      VIEW VECTOR <Eye className="w-3 h-3" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </DashboardCard>

          {/* AI Generator Tool */}
          <DashboardCard title="AI BESPOKE SYNTHESIZER" subtitle="Automated NLP phishing template architect.">
            <div className="space-y-4 text-left font-mono text-xs">
              <div>
                <label className="block text-[9px] text-slate-500 font-bold uppercase mb-1">TARGET SEGMENT / ROLE</label>
                <input
                  type="text"
                  value={targetPersona}
                  onChange={(e) => setTargetPersona(e.target.value)}
                  className="w-full bg-[#04040c] border border-slate-900 focus:border-primary/50 text-slate-300 p-2 rounded text-[11px] outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] text-slate-500 font-bold uppercase mb-1">SCENARIO ATTACK ROUTE</label>
                <select
                  value={scenarioType}
                  onChange={(e) => setScenarioType(e.target.value)}
                  className="w-full bg-[#04040c] border border-slate-900 focus:border-primary/50 text-slate-300 p-2 rounded text-[11px] outline-none appearance-none"
                >
                  <option value="SSO Password Expiry">SSO Password Expiry (Harvesting)</option>
                  <option value="HR Payroll Scam">HR payroll adjustment (Urgency)</option>
                  <option value="Board Meeting Zoom">Confidential Board Zoom (Spoof)</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] text-slate-500 font-bold uppercase mb-1">URGENCY COEFFICIENT</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full bg-[#04040c] border border-slate-900 focus:border-primary/50 text-slate-300 p-2 rounded text-[11px] outline-none appearance-none"
                >
                  <option value="Low">Low (Safe check)</option>
                  <option value="Medium">Medium (General)</option>
                  <option value="High">High (Urgent)</option>
                  <option value="Critical">Critical (Instant alarm)</option>
                </select>
              </div>

              <button
                onClick={handleAiGenerate}
                disabled={generating}
                className="cyber-btn w-full py-2.5 rounded text-[10px] tracking-wider font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" /> SYNTHESIZE PAYLOAD
              </button>

              {/* Generator logs console */}
              {(generating || generatorLogs.length > 0) && (
                <div className="bg-[#030308]/90 border border-slate-900 p-3 rounded text-[9px] leading-tight space-y-1 text-slate-400 font-mono h-24 overflow-y-auto">
                  {generatorLogs.filter(Boolean).map((log, index) => (
                    <div key={index} className={log && typeof log === "string" && log.startsWith("[OK]") ? "text-emerald-400" : ""}>
                      {log}
                    </div>
                  ))}
                  {generating && (
                    <div className="text-primary flex items-center gap-1 animate-pulse">
                      <Cpu className="w-3 h-3 animate-spin" />
                      <span>COMPUTING COGNITIVE TRIGGERS...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </DashboardCard>
        </div>

        {/* Selected vector preview details */}
        <div className="lg:col-span-8 space-y-6 text-left">
          
          {/* Main Template Preview */}
          {generatedTemplate ? (
            <DashboardCard
              title={`SYNTHESIZED BESPOKE PAYLOAD (PREVIEW)`}
              subtitle="Result of NLP contextual generation. Use this draft to spin campaigns."
              glowColor="rgba(157,78,221,0.2)"
            >
              <div className="space-y-4 font-mono text-xs">
                <div className="border border-slate-900 rounded p-3 bg-slate-950/80 space-y-1.5">
                  <div className="flex justify-between border-b border-slate-900 pb-1.5">
                    <span className="text-slate-500 font-bold">EMAIL SUBJECT:</span>
                    <span className="text-slate-200 font-bold">{generatedTemplate.subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">SENDER MASK:</span>
                    <span className="text-amber-500">{generatedTemplate.sender}</span>
                  </div>
                </div>

                <div className="border border-slate-900 rounded bg-[#030308]/60 p-4 min-h-[160px] overflow-auto flex items-center justify-center">
                  <div className="w-full bg-white text-slate-950 rounded p-4 font-sans text-sm" dangerouslySetInnerHTML={{ __html: generatedTemplate.body }}></div>
                </div>

                <div className="flex justify-between border-t border-slate-900 pt-3">
                  <span className="text-slate-500 text-[10px] flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-primary" /> COGNITIVE SCORE: 98% SUCCESS ESTIMATED
                  </span>
                  <button
                    onClick={() => {
                      alert("Synthesized template successfully exported to campaign files.");
                      setGeneratedTemplate(null);
                      setGeneratorLogs([]);
                    }}
                    className="px-3.5 py-1.5 bg-primary text-slate-950 rounded text-[10px] font-bold cursor-pointer hover:bg-primary/85 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> EXPORT TO CAMPAIGNS
                  </button>
                </div>
              </div>
            </DashboardCard>
          ) : selectedTpl ? (
            <DashboardCard
              title={`VECTOR INSPECTOR: ${selectedTpl.name}`}
              subtitle={`Difficulty: ${selectedTpl.difficulty} • Type: ${selectedTpl.category}`}
            >
              <div className="space-y-4 font-mono text-xs">
                
                {/* Details */}
                <div className="border border-slate-900 rounded p-3 bg-slate-950/80 space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:justify-between border-b border-slate-900 pb-1.5 gap-1">
                    <span className="text-slate-500 font-bold">EMAIL SUBJECT:</span>
                    <span className="text-slate-200 font-bold">{selectedTpl.subject}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-slate-500 font-bold">SENDER MASS MASK:</span>
                    <span className="text-amber-500">{selectedTpl.sender}</span>
                  </div>
                </div>

                {/* Email Body */}
                <div className="border border-slate-900 rounded bg-[#030308]/60 p-4 min-h-[160px] max-h-72 overflow-y-auto flex items-center justify-center">
                  <div className="w-full bg-white text-slate-950 rounded p-4 font-sans text-sm" dangerouslySetInnerHTML={{ __html: selectedTpl.body.replace("{{SIM_LINK}}", "#") }}></div>
                </div>

                {/* Explanatory Indicators */}
                <div className="border border-slate-900 p-4 rounded bg-slate-950/40 space-y-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <ShieldAlert className="w-4 h-4 text-primary" /> PHISHING TRAINING INDICATORS (CLUES)
                  </span>
                  
                  <div className="space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                    {selectedTpl.indicators.map((ind, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <span className="text-primary font-bold">{i + 1}.</span>
                        <p>{ind}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DashboardCard>
          ) : (
            <div className="p-8 rounded-xl border border-dashed border-slate-800 bg-slate-950/20 text-center font-mono text-xs text-slate-500">
              Select a template from the index files to inspect payload coordinates.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
