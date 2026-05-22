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
    <div className="mx-auto max-w-7xl space-y-8">
      
      {/* Cyber Serif Hero */}
      <div className="cyber-card rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-10 overflow-hidden">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="cyber-metadata mb-5 flex items-center gap-3 text-white/45">
              <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_16px_rgba(16,185,129,0.75)] animate-pulse" />
              Cognitive NLP Simulation Lab
            </div>
            <h1 className="font-outfit max-w-4xl text-6xl font-light leading-[0.9] tracking-tighter text-[#EBEBEB] md:text-7xl xl:text-[92px]">
              Vector Templates <span className="italic text-primary">&</span> AI Lab
            </h1>
            <p className="mt-6 max-w-2xl text-base font-light leading-7 text-white/50">
              Configure controlled phishing templates, inspect simulation-safe links, and synthesize bespoke awareness vectors with enterprise-grade defensive guardrails.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#vector-library" className="cyber-btn px-6 py-3 text-[10px]">
                Explore Library
              </a>
              <a href="#ai-synthesizer" className="rounded-full border border-white/15 px-6 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 transition-all hover:border-primary/40 hover:text-primary">
                Synthesize Vector
              </a>
            </div>
          </div>

          <div className="relative min-h-[320px]">
            <div className="absolute inset-6 rounded-3xl border border-primary/15 bg-primary/[0.03] blur-2xl" />
            <div className="cyber-card absolute right-0 top-0 w-[88%] rounded-3xl p-5">
              <div className="cyber-metadata mb-5 text-primary">Live Blueprint Stack</div>
              <div className="space-y-3">
                {templates.slice(0, 4).map((template, index) => (
                  <div key={template.id} className="rounded-3xl border border-white/10 bg-white/[0.025] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate font-outfit text-lg font-medium tracking-tighter text-white/90">{template.name}</span>
                      <span className="rounded-full border border-primary/20 px-2.5 py-1 font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-primary">V{index + 1}</span>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/5">
                      <div className="h-full rounded-full bg-primary/70" style={{ width: `${42 + index * 14}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="cyber-card absolute bottom-2 left-0 w-[58%] rounded-3xl p-5">
              <div className="cyber-metadata text-white/40">Safe Link Registry</div>
              <div className="mt-4 font-outfit text-4xl font-light tracking-tighter text-primary">{templateStats.total}</div>
              <p className="mt-1 text-xs text-white/40">compiled awareness blueprints</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Simulation Vectors", value: templateStats.total, icon: Layers, color: "text-primary" },
          { label: "Attack Categories", value: templateStats.categories, icon: Radar, color: "text-accent" },
          { label: "Expert Drills", value: templateStats.expertVectors, icon: ShieldAlert, color: "text-rose-400" },
          { label: "High Fidelity", value: `${templateStats.highFidelity}/${templateStats.total}`, icon: Activity, color: "text-emerald-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="cyber-card rounded-3xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-center justify-between">
              <span className="cyber-metadata text-white/35">{label}</span>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div className={`mt-3 font-outfit text-4xl font-light tracking-tighter ${color}`}>{value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Templates index list */}
        <div className="lg:col-span-4 space-y-4">
          <div id="vector-library">
          <DashboardCard title="VECTOR TEMPLATE FILES" subtitle="Index of compiled social engineering blueprints.">
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedTpl(tpl)}
                  className={`w-full text-left p-4 rounded-3xl border font-mono transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between cursor-pointer ${
                    selectedTpl?.id === tpl.id
                      ? "border-primary/35 bg-white/[0.035] shadow-[0_0_22px_rgba(16,185,129,0.08)]"
                      : "border-white/10 bg-white/[0.015] hover:border-primary/25 hover:bg-white/[0.025]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-outfit text-base font-medium tracking-tighter text-white/85 truncate max-w-[190px]">{tpl.name}</span>
                    <span className={`px-2.5 py-1 rounded-full text-[8px] font-bold tracking-[0.18em] ${
                      tpl.difficulty === "Easy" ? "bg-white/[0.02] text-emerald-300 border border-emerald-400/25" :
                      tpl.difficulty === "Medium" ? "bg-white/[0.02] text-white/55 border border-white/10" :
                      tpl.difficulty === "Hard" ? "bg-white/[0.02] text-amber-300 border border-amber-300/25" :
                      "bg-white/[0.02] text-rose-300 border border-rose-300/25"
                    }`}>
                      {tpl.difficulty}
                    </span>
                  </div>
                  <div className="flex justify-between cyber-metadata text-white/35 mt-1">
                    <span>{tpl.category}</span>
                    <span className="cyber-link text-primary flex items-center gap-1">
                      VIEW VECTOR <Eye className="w-3 h-3" />
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-[8px] text-white/25">
                    <Link2 className="w-3 h-3 text-primary/70" />
                    <span className="truncate">{getSimulationLink(tpl)}</span>
                  </div>
                </button>
              ))}
            </div>
          </DashboardCard>
          </div>

          {/* AI Generator Tool */}
          <div id="ai-synthesizer">
          <DashboardCard title="AI BESPOKE SYNTHESIZER" subtitle="Automated NLP phishing template architect.">
            <div className="space-y-4 text-left font-mono text-xs">
              <div>
                <label className="cyber-metadata block text-white/35 mb-2">TARGET SEGMENT / ROLE</label>
                <input
                  type="text"
                  value={targetPersona}
                  onChange={(e) => setTargetPersona(e.target.value)}
                  className="w-full rounded-full bg-white/[0.02] border border-white/10 focus:border-primary/45 text-white/75 px-4 py-3 text-[11px] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="cyber-metadata block text-white/35 mb-2">SCENARIO ATTACK ROUTE</label>
                <select
                  value={scenarioType}
                  onChange={(e) => setScenarioType(e.target.value)}
                  className="w-full rounded-full bg-[#050505] border border-white/10 focus:border-primary/45 text-white/75 px-4 py-3 text-[11px] outline-none appearance-none transition-colors"
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
                <label className="cyber-metadata block text-white/35 mb-2">URGENCY COEFFICIENT</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full rounded-full bg-[#050505] border border-white/10 focus:border-primary/45 text-white/75 px-4 py-3 text-[11px] outline-none appearance-none transition-colors"
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
                className="cyber-btn w-full py-3 text-[10px] tracking-[0.2em] font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" /> SYNTHESIZE PAYLOAD
              </button>

              {/* Generator logs console */}
              {(generating || generatorLogs.length > 0) && (
                <div className="bg-white/[0.02] border border-white/10 p-4 rounded-3xl text-[9px] leading-tight space-y-1 text-white/45 font-mono h-28 overflow-y-auto">
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
        </div>

        {/* Selected vector preview details */}
        <div className="lg:col-span-8 space-y-6 text-left">
          
          {/* Main Template Preview */}
          {generatedTemplate ? (
            <DashboardCard
              title={`SYNTHESIZED BESPOKE PAYLOAD (PREVIEW)`}
              subtitle="Result of NLP contextual generation. Use this draft to spin campaigns."
              glowColor="rgba(16,185,129,0.14)"
            >
              <div className="space-y-4 font-mono text-xs">
                <div className="border border-white/10 rounded-3xl p-4 bg-white/[0.02] space-y-3">
                  <div className="flex justify-between border-b border-white/10 pb-2 gap-4">
                    <span className="cyber-metadata text-white/35">EMAIL SUBJECT:</span>
                    <span className="text-white/85 font-bold text-right">{generatedTemplate.subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="cyber-metadata text-white/35">SENDER MASK:</span>
                    <span className="text-amber-500">{generatedTemplate.sender}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t border-white/10 pt-3">
                    <span className="cyber-metadata text-white/35">SAFE SIMULATION LINK:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-primary text-[10px] break-all">{generatedTemplate.landingPageUrl}&mode=lab-preview</code>
                      <button
                        onClick={() => copySimulationLink(`${generatedTemplate.landingPageUrl}&mode=lab-preview`)}
                        className="p-2 rounded-full border border-white/10 text-white/45 hover:text-primary hover:border-primary/40 transition-colors"
                        title="Copy safe simulation link"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border border-white/10 rounded-3xl bg-white/[0.015] p-4 min-h-[160px] overflow-auto flex items-center justify-center">
                  <div className="w-full bg-white text-slate-950 rounded-3xl p-5 font-sans text-sm" dangerouslySetInnerHTML={{ __html: generatedTemplate.body }}></div>
                </div>

                <div className="border border-white/10 p-4 rounded-3xl bg-white/[0.02] space-y-2">
                  <span className="cyber-metadata text-white/45 flex items-center gap-1">
                    <ShieldAlert className="w-4 h-4 text-primary" /> AI-GENERATED TRAINING CLUES
                  </span>
                  <div className="space-y-2 text-white/60 text-[11px] leading-relaxed">
                    {generatedTemplate.indicators.map((indicator, index) => (
                      <div key={indicator} className="flex gap-2 items-start">
                        <span className="text-primary font-bold">{index + 1}.</span>
                        <p>{indicator}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap justify-between gap-3 border-t border-white/10 pt-4">
                  <span className="text-white/35 text-[10px] flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-primary" /> COGNITIVE SCORE: 98% SUCCESS ESTIMATED
                  </span>
                  <button
                    onClick={() => {
                      alert("Synthesized template successfully exported to campaign files.");
                      setGeneratedTemplate(null);
                      setGeneratorLogs([]);
                    }}
                    className="cyber-btn px-4 py-2 text-[10px] font-bold cursor-pointer flex items-center gap-1"
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
                <div className="border border-white/10 rounded-3xl p-4 bg-white/[0.02] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between border-b border-white/10 pb-2 gap-2">
                    <span className="cyber-metadata text-white/35">EMAIL SUBJECT:</span>
                    <span className="text-white/85 font-bold">{selectedTpl.subject}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="cyber-metadata text-white/35">SENDER MASS MASK:</span>
                    <span className="text-amber-500">{selectedTpl.sender}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t border-white/10 pt-3">
                    <span className="cyber-metadata text-white/35">SAFE SIMULATION LINK:</span>
                    <div className="flex flex-wrap items-center gap-2">
                      <code className="text-primary text-[10px] break-all">{getSimulationLink(selectedTpl)}</code>
                      <button
                        onClick={() => copySimulationLink(getSimulationLink(selectedTpl))}
                        className="p-2 rounded-full border border-white/10 text-white/45 hover:text-primary hover:border-primary/40 transition-colors"
                        title="Copy safe simulation link"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <a
                        href={getSimulationLink(selectedTpl)}
                        className="p-2 rounded-full border border-white/10 text-white/45 hover:text-emerald-400 hover:border-emerald-400/40 transition-colors"
                        title="Open safe simulation portal"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {getVectorProfile(selectedTpl).map((item) => (
                    <div key={item.label} className="rounded-3xl border border-white/10 bg-white/[0.02] p-4">
                      <p className="cyber-metadata text-white/35">{item.label}</p>
                      <p className="mt-2 text-[12px] text-white/75 font-bold capitalize">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Email Body */}
                <div className="border border-white/10 rounded-3xl bg-white/[0.015] p-4 min-h-[160px] max-h-72 overflow-y-auto flex items-center justify-center">
                  <div className="w-full bg-white text-slate-950 rounded-3xl p-5 font-sans text-sm" dangerouslySetInnerHTML={{ __html: selectedTpl.body.replace("{{SIM_LINK}}", getSimulationLink(selectedTpl)) }}></div>
                </div>

                {/* Explanatory Indicators */}
                <div className="border border-white/10 p-4 rounded-3xl bg-white/[0.02] space-y-2">
                  <span className="cyber-metadata text-white/45 flex items-center gap-1">
                    <ShieldAlert className="w-4 h-4 text-primary" /> PHISHING TRAINING INDICATORS (CLUES)
                  </span>
                  
                  <div className="space-y-2 text-white/60 text-[11px] leading-relaxed">
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
            <div className="p-8 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] text-center font-mono text-xs text-white/35">
              Select a template from the index files to inspect payload coordinates.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
