"use client";

import React, { useMemo, useState } from "react";
import { Sparkles, Eye, ShieldAlert, Cpu, Check, Link2, Copy, ExternalLink, Layers, Radar, Activity } from "lucide-react";
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
    landingPageUrl: string;
    indicators: string[];
  } | null>(null);

  const templateStats = useMemo(() => {
    const categories = new Set(templates.map((template) => template.category)).size;
    const expertVectors = templates.filter((template) => template.difficulty === "Expert").length;
    const highFidelity = templates.filter((template) => template.difficulty === "Hard" || template.difficulty === "Expert").length;

    return {
      total: templates.length,
      categories,
      expertVectors,
      highFidelity
    };
  }, [templates]);

  const getSimulationLink = (template: PhishingTemplate) => `${template.landingPageUrl}&mode=lab-preview`;

  const getVectorProfile = (template: PhishingTemplate) => {
    const categoryMap: Record<PhishingTemplate["category"], string> = {
      "Credential Harvesting": "SSO re-authentication lure",
      "Social Engineering": "authority and urgency manipulation",
      "Malware": "attachment trust evaluation",
      "QR Code": "mobile scan behavior test",
      "MFA Fatigue": "push approval resilience test",
      "Deepfake": "executive voice verification drill"
    };

    const difficultyMap: Record<PhishingTemplate["difficulty"], string> = {
      Easy: "baseline recognition",
      Medium: "department-ready scenario",
      Hard: "executive-grade simulation",
      Expert: "advanced SOC red-team drill"
    };

    return [
      { label: "Attack Route", value: categoryMap[template.category] },
      { label: "Audience Pressure", value: difficultyMap[template.difficulty] },
      { label: "Landing Portal", value: template.landingPageUrl.split("?")[0] },
      { label: "Training Trigger", value: "adaptive awareness assignment" }
    ];
  };

  const copySimulationLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      alert("Safe simulation link copied to clipboard.");
    } catch {
      alert(`Safe simulation link: ${link}`);
    }
  };

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
        let landingPageUrl = "/portal/login-simulation?tpl=tpl_m365";
        let indicators = [
          "Unexpected authentication request generated outside the official app.",
          "Sender domain does not match the trusted corporate system.",
          "Urgency language pushes the employee to skip verification."
        ];

        if (scenarioType === "SSO Password Expiry") {
          subject = "URGENT: Single Sign-On (SSO) Re-authentication Required";
          sender = "auth-verify@corporate-sso-gateway.org";
          landingPageUrl = "/portal/login-simulation?tpl=tpl_m365";
          body = `<div style="font-family: Arial, sans-serif; max-width: 550px; padding: 20px; border: 1px solid #ddd;">
            <h3 style="color: #2563eb; margin-top:0;">Single Sign-On Authentication Alert</h3>
            <p>Our security logs indicate your corporate SSO token has expired. You are required to verify your password immediately to prevent active sessions from terminating.</p>
            <div style="margin: 20px 0;"><a href="${landingPageUrl}" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Credentials</a></div>
            <p style="font-size: 11px; color: #777;">This is a mandatory compliance audit request.</p>
          </div>`;
        } else if (scenarioType === "HR Payroll Scam") {
          subject = "Q3 Payroll Audit: Missing Bank Routing Coordinates";
          sender = "hr-finance-update@internal-payroll.net";
          landingPageUrl = "/portal/login-simulation?tpl=tpl_payroll";
          indicators = [
            "Financial-pressure language threatens a salary hold.",
            "Sender domain is not the official HR or payroll system.",
            "Banking changes require trusted payroll portal verification."
          ];
          body = `<div style="font-family: sans-serif; max-width: 550px; padding: 20px; border: 1px solid #fee2e2;">
            <h3 style="color: #dc2626; margin-top:0;">HR Benefits Administration</h3>
            <p>Hello Team, we detected corrupted routing coordinates in your payroll profile. Please verify your banking information immediately to prevent salary payout holds on the 25th.</p>
            <div style="margin: 20px 0;"><a href="${landingPageUrl}" style="background-color: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Update Bank Details</a></div>
            <p style="font-size: 11px; color: #dc2626; font-weight:bold;">Warning: Salary holds will apply if not updated today.</p>
          </div>`;
        } else if (scenarioType === "MFA Fatigue Push") {
          subject = "Unusual sign-in blocked: confirm MFA activity";
          sender = "identity-defense@secure-access-review.example";
          landingPageUrl = "/portal/login-simulation?tpl=tpl_mfa_fatigue";
          indicators = [
            "Unexpected MFA activity can indicate password compromise.",
            "The email tries to normalize approving a push prompt.",
            "Employees should report unknown MFA requests instead of approving them."
          ];
          body = `<div style="font-family: Arial, sans-serif; max-width: 550px; padding: 20px; border: 1px solid #bae6fd;">
            <h3 style="color: #0369a1; margin-top:0;">Identity Protection Center</h3>
            <p>We blocked a suspicious sign-in attempt from a new device. Review MFA activity now to prevent repeated authenticator prompts.</p>
            <div style="margin: 20px 0;"><a href="${landingPageUrl}" style="background-color: #0369a1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Review MFA Activity</a></div>
            <p style="font-size: 11px; color: #777;">Controlled training simulation: deny unknown MFA requests.</p>
          </div>`;
        } else if (scenarioType === "Cloud File Share") {
          subject = "A secure file was shared with you in Teams";
          sender = "sharepoint-notify@teams-file-gateway.example";
          landingPageUrl = "/portal/login-simulation?tpl=tpl_teams_file";
          indicators = [
            "Sensitive file names increase curiosity.",
            "The sender domain is a collaboration-suite lookalike.",
            "File access should be verified in Teams or SharePoint directly."
          ];
          body = `<div style="font-family: Segoe UI, Arial, sans-serif; max-width: 550px; padding: 20px; border: 1px solid #c7d2fe;">
            <h3 style="color: #4f46e5; margin-top:0;">Microsoft Teams File Share</h3>
            <p>Finance Operations shared a confidential workbook with you: <strong>FY27_Headcount_Adjustments.xlsx</strong>.</p>
            <div style="margin: 20px 0;"><a href="${landingPageUrl}" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Open Shared File</a></div>
            <p style="font-size: 11px; color: #777;">Training sample: verify file shares in the official collaboration app.</p>
          </div>`;
        } else if (scenarioType === "Developer OAuth Review") {
          subject = "GitHub security review: OAuth app requires approval";
          sender = "security-review@github-access-audit.example";
          landingPageUrl = "/portal/login-simulation?tpl=tpl_github_oauth";
          indicators = [
            "OAuth consent can grant broad access without password entry.",
            "The sender domain is not the official code-hosting domain.",
            "Developer access changes must be reviewed in organization settings."
          ];
          body = `<div style="font-family: Arial, sans-serif; max-width: 550px; padding: 20px; border: 1px solid #d1d5db;">
            <h3 style="color: #111827; margin-top:0;">Repository Access Review</h3>
            <p>An OAuth app named <strong>Build Insight Connector</strong> requested repository access. Review the request before it is auto-denied.</p>
            <div style="margin: 20px 0;"><a href="${landingPageUrl}" style="background-color: #111827; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Review OAuth Request</a></div>
            <p style="font-size: 11px; color: #777;">Training sample: approve OAuth apps only inside official org settings.</p>
          </div>`;
        } else {
          subject = "CRITICAL: Urgent zoom invite from Executive Board";
          sender = "zoom-meeting-invite@executive-meetings-router.com";
          landingPageUrl = "/portal/login-simulation?tpl=tpl_zoom";
          indicators = [
            "Countdown language creates urgency.",
            "Meeting invites should be verified from the official calendar.",
            "Fresh credential prompts from unknown meeting links are suspicious."
          ];
          body = `<div style="font-family: sans-serif; padding: 15px; border: 1px solid #3b82f6;">
            <p>You have been requested to join a confidential Zoom meeting regarding Q3 reorganizations in 5 minutes.</p>
            <p>Click below to join the authorization lobby instantly:</p>
            <div style="margin: 15px 0;"><a href="${landingPageUrl}" style="color: #2563eb; font-weight: bold;">Join Board Meeting Lobby</a></div>
            <p>Executive Office Team</p>
          </div>`;
        }

        setGeneratedTemplate({ subject, sender, body, landingPageUrl, indicators });
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Simulation Vectors", value: templateStats.total, icon: Layers, color: "text-primary" },
          { label: "Attack Categories", value: templateStats.categories, icon: Radar, color: "text-accent" },
          { label: "Expert Drills", value: templateStats.expertVectors, icon: ShieldAlert, color: "text-rose-400" },
          { label: "High Fidelity", value: `${templateStats.highFidelity}/${templateStats.total}`, icon: Activity, color: "text-emerald-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="cyber-card rounded-lg border border-slate-900 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">{label}</span>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div className={`mt-2 font-outfit text-2xl font-black ${color}`}>{value}</div>
          </div>
        ))}
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
                  <div className="mt-2 flex items-center gap-1.5 text-[8px] text-slate-600">
                    <Link2 className="w-3 h-3 text-primary/70" />
                    <span className="truncate">{getSimulationLink(tpl)}</span>
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
                  <option value="MFA Fatigue Push">MFA fatigue push storm (Identity)</option>
                  <option value="Cloud File Share">Teams/SharePoint file share (Curiosity)</option>
                  <option value="Developer OAuth Review">Developer OAuth review (Access)</option>
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
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t border-slate-900 pt-2">
                    <span className="text-slate-500 font-bold">SAFE SIMULATION LINK:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-primary text-[10px] break-all">{generatedTemplate.landingPageUrl}&mode=lab-preview</code>
                      <button
                        onClick={() => copySimulationLink(`${generatedTemplate.landingPageUrl}&mode=lab-preview`)}
                        className="p-1.5 rounded border border-slate-800 text-slate-400 hover:text-primary hover:border-primary/40 transition-colors"
                        title="Copy safe simulation link"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-900 rounded bg-[#030308]/60 p-4 min-h-[160px] overflow-auto flex items-center justify-center">
                  <div className="w-full bg-white text-slate-950 rounded p-4 font-sans text-sm" dangerouslySetInnerHTML={{ __html: generatedTemplate.body }}></div>
                </div>

                <div className="border border-slate-900 p-4 rounded bg-slate-950/40 space-y-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <ShieldAlert className="w-4 h-4 text-primary" /> AI-GENERATED TRAINING CLUES
                  </span>
                  <div className="space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                    {generatedTemplate.indicators.map((indicator, index) => (
                      <div key={indicator} className="flex gap-2 items-start">
                        <span className="text-primary font-bold">{index + 1}.</span>
                        <p>{indicator}</p>
                      </div>
                    ))}
                  </div>
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
              subtitle={`Difficulty: ${selectedTpl.difficulty} | Type: ${selectedTpl.category}`}
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
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t border-slate-900 pt-2">
                    <span className="text-slate-500 font-bold">SAFE SIMULATION LINK:</span>
                    <div className="flex flex-wrap items-center gap-2">
                      <code className="text-primary text-[10px] break-all">{getSimulationLink(selectedTpl)}</code>
                      <button
                        onClick={() => copySimulationLink(getSimulationLink(selectedTpl))}
                        className="p-1.5 rounded border border-slate-800 text-slate-400 hover:text-primary hover:border-primary/40 transition-colors"
                        title="Copy safe simulation link"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <a
                        href={getSimulationLink(selectedTpl)}
                        className="p-1.5 rounded border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-400/40 transition-colors"
                        title="Open safe simulation portal"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {getVectorProfile(selectedTpl).map((item) => (
                    <div key={item.label} className="rounded-lg border border-slate-900 bg-slate-950/50 p-3">
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{item.label}</p>
                      <p className="mt-1 text-[11px] text-slate-200 font-bold capitalize">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Email Body */}
                <div className="border border-slate-900 rounded bg-[#030308]/60 p-4 min-h-[160px] max-h-72 overflow-y-auto flex items-center justify-center">
                  <div className="w-full bg-white text-slate-950 rounded p-4 font-sans text-sm" dangerouslySetInnerHTML={{ __html: selectedTpl.body.replace("{{SIM_LINK}}", getSimulationLink(selectedTpl)) }}></div>
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
