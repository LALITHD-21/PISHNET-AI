"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldAlert, AlertTriangle, BookOpen, ArrowRight, Eye, EyeOff, Loader2, CheckCircle, Lock, User, CreditCard, Phone } from "lucide-react";
import { useSim } from "@/context/SimContext";

// Template definitions for indicator education
const TEMPLATE_INDICATORS: Record<string, { indicators: string[]; attackType: string; severity: string }> = {
  tpl_m365: {
    attackType: "Credential Harvesting via Brand Impersonation",
    severity: "CRITICAL",
    indicators: [
      "The sender domain 'microsoft-alert-portal.com' is NOT the official 'microsoft.com' domain.",
      "Urgency manipulation: '2 hours to expire' forces emotional, fast decisions without critical thinking.",
      "Official Microsoft never sends password expiry alerts via external portal links.",
      "The login URL does not begin with accounts.microsoft.com or login.microsoftonline.com.",
    ],
  },
  tpl_payroll: {
    attackType: "Social Engineering — Financial Data Theft",
    severity: "CRITICAL",
    indicators: [
      "Sender 'internal-portal-hr.net' is not your company's official HR domain.",
      "Threat of financial harm ('hold your payroll') is a classic pressure tactic.",
      "Real HR systems update banking info via secure internal intranet portals, never external links.",
      "The red-colored 'Verify' button creates subconscious urgency to click quickly.",
    ],
  },
  tpl_ceo: {
    attackType: "Business Email Compromise (BEC) — Executive Fraud",
    severity: "HIGH",
    indicators: [
      "The sender 'executive-mail-router.com' is impersonating your CEO using a lookalike domain.",
      "CEOs never request gift card purchases via email — it's a classic BEC pattern.",
      "'Highly confidential' language is designed to prevent you from verifying with colleagues.",
      "'Sent from my iPad' adds a sense of mobility and excuses email format irregularities.",
    ],
  },
  tpl_qr: {
    attackType: "QR Code Phishing (Quishing) — MFA Bypass",
    severity: "CRITICAL",
    indicators: [
      "QR codes in emails bypass traditional email security scanners that only check URLs.",
      "The domain '.org' is not a corporate security endpoint domain.",
      "'Account suspension in 5 minutes' is an extreme artificial urgency trigger.",
      "Legitimate MFA re-enrollment always happens through your IT department's internal tools.",
    ],
  },
  tpl_bank: {
    attackType: "Financial Services Impersonation",
    severity: "HIGH",
    indicators: [
      "Corporate card or bank issues should be opened from a known bookmark, not from an email button.",
      "The sender domain is a training lookalike and not an approved finance endpoint.",
      "The deadline creates pressure to bypass expense-team verification.",
      "Legitimate financial workflows should not ask for passwords inside an email-driven form.",
    ],
  },
  tpl_invoice: {
    attackType: "Invoice Fraud and Payment Diversion",
    severity: "HIGH",
    indicators: [
      "Payment-change requests require out-of-band confirmation using a known vendor number.",
      "The sender domain is not the validated vendor domain.",
      "The message attempts to rush a payment batch before review.",
      "Vendor banking changes should require dual approval in finance systems.",
    ],
  },
  tpl_zoom: {
    attackType: "Fake Meeting Invite Credential Capture",
    severity: "MEDIUM",
    indicators: [
      "Unexpected meetings should be verified in the official calendar application.",
      "The sender domain is not the official conferencing or company domain.",
      "Countdown language is used to create urgency.",
      "A meeting link should not demand fresh credentials from an unrelated portal.",
    ],
  },
  tpl_internship: {
    attackType: "Recruiting and Identity Document Scam",
    severity: "MEDIUM",
    indicators: [
      "Recruiting documents should be completed in approved HR onboarding systems.",
      "The generic document-host sender domain is suspicious.",
      "Offer pressure is used to make the recipient submit identity data quickly.",
      "Requests for personal documents require extra verification with HR.",
    ],
  },
  tpl_mfa_fatigue: {
    attackType: "MFA Fatigue and Push Approval Abuse",
    severity: "CRITICAL",
    indicators: [
      "Unexpected MFA prompts can mean someone already has the password.",
      "The email tries to make approving a push request feel normal.",
      "The sender domain is not the official identity-provider domain.",
      "Employees should deny unknown prompts and report them to the SOC.",
    ],
  },
  tpl_docusign_contract: {
    attackType: "Signature Platform Impersonation",
    severity: "HIGH",
    indicators: [
      "The message uses a generic signature-workflow domain.",
      "Contract urgency encourages authentication before verification.",
      "Legal and procurement documents should be opened from approved systems.",
      "Unexpected signature packets require sender confirmation.",
    ],
  },
  tpl_teams_file: {
    attackType: "Collaboration File Share Impersonation",
    severity: "HIGH",
    indicators: [
      "The sender is a Teams/SharePoint lookalike domain.",
      "Sensitive file names are used to trigger curiosity.",
      "File shares should be verified inside the official collaboration app.",
      "Unexpected re-authentication is a warning sign.",
    ],
  },
  tpl_github_oauth: {
    attackType: "Developer OAuth Consent Phishing",
    severity: "CRITICAL",
    indicators: [
      "OAuth consent can grant account or repository access without asking for a password.",
      "The sender domain is not the official code-hosting domain.",
      "Access approvals should be reviewed from organization settings.",
      "Broad app permissions require extra scrutiny.",
    ],
  },
  tpl_vpn_cert: {
    attackType: "Remote Access Certificate Renewal Lure",
    severity: "HIGH",
    indicators: [
      "VPN certificate updates should come from device management tools, not email links.",
      "The email threatens remote-access suspension to create pressure.",
      "The sender domain is not the approved network-access platform.",
      "Employees should contact IT through known support channels.",
    ],
  },
  tpl_tax_w2: {
    attackType: "Tax Document and HR Records Scam",
    severity: "HIGH",
    indicators: [
      "Tax-season lures exploit concern around personal financial documents.",
      "The sender is a generic employee-records service.",
      "Identity confirmation must happen inside official payroll systems.",
      "Requests for tax documents deserve HR verification.",
    ],
  },
  tpl_deepfake_voice: {
    attackType: "Deepfake Voice and Executive Authority Lure",
    severity: "CRITICAL",
    indicators: [
      "Voice lures can imitate executives and create false authority.",
      "The relay domain is not an approved executive communications system.",
      "Urgent requests should be verified through a known callback number.",
      "Sensitive approvals should never rely on one email or voice memo.",
    ],
  },
  tpl_password_manager: {
    attackType: "Password Manager Vault Share Phishing",
    severity: "HIGH",
    indicators: [
      "Security-tool branding can make phishing feel more trustworthy.",
      "Privileged vault item names create curiosity and urgency.",
      "Vault shares should be opened from the official password-manager app.",
      "Unexpected shared credentials should be reported to security.",
    ],
  },
};

function LoginSimulationInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tpl = searchParams.get("tpl") || "tpl_m365";
  const campId = searchParams.get("camp") || "";
  const email = searchParams.get("email") || "";

  const { submitCredentials, templates, campaigns } = useSim();

  const [step, setStep] = useState<"form" | "loading" | "compromised">("form");
  const [emailInput, setEmailInput] = useState(email);
  const [password, setPassword] = useState("");
  const [accountNum, setAccountNum] = useState("");
  const [routingNum, setRoutingNum] = useState("");
  const [bankName, setBankName] = useState("");
  const [giftCode, setGiftCode] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [formStep, setFormStep] = useState<1 | 2>(1);

  const templateMeta = templates.find((t) => t.id === tpl);
  const campaign = campaigns.find((c) => c.id === campId);
  const indicators = TEMPLATE_INDICATORS[tpl] || TEMPLATE_INDICATORS["tpl_m365"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("loading");
    setTimeout(() => {
      if (email && campId) {
        submitCredentials(email, campId);
      }
      setStep("compromised");
    }, 1800);
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStep(2);
  };

  if (step === "loading") {
    return (
      <div className="min-h-screen bg-[#020205] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto" />
          <p className="text-slate-400 font-mono text-sm">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  if (step === "compromised") {
    return <CompromisedScreen indicators={indicators} templateMeta={templateMeta} campaign={campaign} email={email} onReturn={() => router.push("/portal")} />;
  }

  // --- Render correct fake portal based on template ---
  if (
    tpl === "tpl_m365" ||
    tpl === "tpl_qr" ||
    tpl === "tpl_zoom" ||
    tpl === "tpl_mfa_fatigue" ||
    tpl === "tpl_docusign_contract" ||
    tpl === "tpl_teams_file" ||
    tpl === "tpl_github_oauth" ||
    tpl === "tpl_vpn_cert" ||
    tpl === "tpl_password_manager"
  ) {
    return <Microsoft365Form emailInput={emailInput} setEmailInput={setEmailInput} password={password} setPassword={setPassword} showPass={showPass} setShowPass={setShowPass} formStep={formStep} handleNextStep={handleNextStep} handleSubmit={handleSubmit} isQr={tpl === "tpl_qr"} />;
  }

  if (tpl === "tpl_payroll" || tpl === "tpl_bank" || tpl === "tpl_invoice" || tpl === "tpl_internship" || tpl === "tpl_tax_w2") {
    return <PayrollForm bankName={bankName} setBankName={setBankName} accountNum={accountNum} setAccountNum={setAccountNum} routingNum={routingNum} setRoutingNum={setRoutingNum} password={password} setPassword={setPassword} emailInput={emailInput} handleSubmit={handleSubmit} />;
  }

  if (tpl === "tpl_ceo" || tpl === "tpl_deepfake_voice") {
    return <CeoForm giftCode={giftCode} setGiftCode={setGiftCode} emailInput={emailInput} handleSubmit={handleSubmit} />;
  }

  return <Microsoft365Form emailInput={emailInput} setEmailInput={setEmailInput} password={password} setPassword={setPassword} showPass={showPass} setShowPass={setShowPass} formStep={formStep} handleNextStep={handleNextStep} handleSubmit={handleSubmit} isQr={false} />;
}

// ─────────────────────────────────────────────────────
// Microsoft 365 Fake Login Portal
// ─────────────────────────────────────────────────────
function TrainingSimulationBanner() {
  return (
    <div className="fixed left-0 right-0 top-0 z-50 border-b border-amber-300 bg-amber-100 px-4 py-2 text-center text-xs font-bold text-amber-900 shadow-sm">
      CONTROLLED PHISHNET AI TRAINING SIMULATION - do not enter real passwords, bank data, or tokens.
    </div>
  );
}

function Microsoft365Form({ emailInput, setEmailInput, password, setPassword, showPass, setShowPass, formStep, handleNextStep, handleSubmit, isQr }: {
  emailInput: string; setEmailInput: (v: string) => void;
  password: string; setPassword: (v: string) => void;
  showPass: boolean; setShowPass: (v: boolean) => void;
  formStep: 1 | 2; handleNextStep: (e: React.FormEvent) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isQr: boolean;
}) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center font-sans p-4 pt-12">
      <TrainingSimulationBanner />
      <div className="w-full max-w-[440px] border border-gray-300 rounded-sm p-10 shadow-sm">
        {/* MS Logo */}
        <div className="flex items-center gap-1 mb-6">
          <svg width="21" height="21" viewBox="0 0 21 21"><rect x="1" y="1" width="9" height="9" fill="#f25022"/><rect x="11" y="1" width="9" height="9" fill="#7fba00"/><rect x="1" y="11" width="9" height="9" fill="#00a4ef"/><rect x="11" y="11" width="9" height="9" fill="#ffb900"/></svg>
          <span className="text-gray-800 text-xl font-light tracking-tight ml-1">Microsoft</span>
        </div>

        {formStep === 1 ? (
          <form onSubmit={handleNextStep}>
            <h2 className="text-2xl font-light text-gray-900 mb-2">Sign in</h2>
            <p className="text-sm text-gray-600 mb-5">{isQr ? "Authenticate your MFA device" : "to continue to Microsoft 365"}</p>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Email, phone, or Skype"
              required
              className="w-full border-b-2 border-gray-300 focus:border-blue-600 outline-none py-2 text-sm text-gray-900 mb-6 bg-transparent placeholder-gray-400 transition-colors"
            />
            {isQr && (
              <div className="mb-4 p-3 border border-blue-100 bg-blue-50 rounded text-xs text-blue-700">
                🔒 Your authenticator device requires re-verification. Enter your email to proceed to the QR scan step.
              </div>
            )}
            <div className="flex items-center justify-between mt-2">
              <a href="#" className="text-blue-600 text-sm hover:underline">No account? Create one!</a>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2 transition-colors">Next</button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-2 mb-4 bg-gray-50 border border-gray-200 rounded px-3 py-2 w-fit">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">{emailInput[0]?.toUpperCase()}</div>
              <span className="text-sm text-gray-700">{emailInput}</span>
            </div>
            <h2 className="text-2xl font-light text-gray-900 mb-5">Enter password</h2>
            <div className="relative mb-5">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full border-b-2 border-gray-300 focus:border-blue-600 outline-none py-2 text-sm text-gray-900 bg-transparent placeholder-gray-400 transition-colors pr-10"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <a href="#" className="text-blue-600 text-sm hover:underline block mb-6">Forgot password?</a>
            <div className="flex items-center justify-between">
              <a href="#" className="text-blue-600 text-sm hover:underline">Sign-in options</a>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2 transition-colors">Sign in</button>
            </div>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4 text-xs text-gray-500">
          <a href="#" className="hover:underline">Terms of use</a>
          <a href="#" className="hover:underline">Privacy & cookies</a>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// HR Payroll Fake Form
// ─────────────────────────────────────────────────────
function PayrollForm({ bankName, setBankName, accountNum, setAccountNum, routingNum, setRoutingNum, password, setPassword, emailInput, handleSubmit }: {
  bankName: string; setBankName: (v: string) => void;
  accountNum: string; setAccountNum: (v: string) => void;
  routingNum: string; setRoutingNum: (v: string) => void;
  password: string; setPassword: (v: string) => void;
  emailInput: string;
  handleSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans p-4 pt-12">
      <TrainingSimulationBanner />
      <div className="w-full max-w-lg bg-white rounded shadow-md overflow-hidden">
        <div className="bg-red-700 px-8 py-5">
          <h1 className="text-white text-xl font-bold">HR Employee Portal</h1>
          <p className="text-red-200 text-sm mt-0.5">Payroll Direct Deposit Verification</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-sm text-red-800">
            <strong>ACTION REQUIRED:</strong> Your payroll banking details need immediate verification before the end-of-day deadline.
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Employee Email</label>
            <input type="email" value={emailInput} readOnly className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 text-gray-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Bank Name</label>
            <input type="text" value={bankName} onChange={e => setBankName(e.target.value)} placeholder="e.g. Chase, Bank of America" required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-400 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Account Number</label>
              <input type="text" value={accountNum} onChange={e => setAccountNum(e.target.value)} placeholder="••••••••••" required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-400 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Routing Number</label>
              <input type="text" value={routingNum} onChange={e => setRoutingNum(e.target.value)} placeholder="9 digit code" required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-400 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Confirm HR Portal Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your HR Portal password" required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-400 outline-none" />
          </div>
          <button type="submit" className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded text-sm tracking-wide transition-colors mt-2">
            VERIFY BANKING INFORMATION
          </button>
          <p className="text-xs text-gray-400 text-center">256-bit SSL Encrypted · HR Benefits Admin Group © 2026</p>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// CEO Impersonation Fake Directive Portal
// ─────────────────────────────────────────────────────
function CeoForm({ giftCode, setGiftCode, emailInput, handleSubmit }: {
  giftCode: string; setGiftCode: (v: string) => void;
  emailInput: string;
  handleSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center font-sans p-4 pt-12">
      <TrainingSimulationBanner />
      <div className="w-full max-w-md bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-6 border-b border-slate-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">CEO</div>
            <div>
              <p className="text-slate-200 font-bold text-sm">Executive Secure Directive Portal</p>
              <p className="text-slate-400 text-xs">Confidential Communications Channel</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="bg-blue-900/30 border border-blue-500/30 p-4 rounded-lg text-sm text-blue-200">
            <p className="font-bold mb-1">🔒 SECURE DIRECTIVE</p>
            <p className="text-xs text-blue-300">Please submit the digital gift code purchase confirmation as instructed. This communication is classified.</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Your Email</label>
            <input type="email" value={emailInput} readOnly className="w-full border border-slate-600 rounded px-3 py-2 text-sm bg-slate-700/50 text-slate-400" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Gift Card Codes (5x $100 Google Play)</label>
            <textarea value={giftCode} onChange={e => setGiftCode(e.target.value)} placeholder="Enter gift card serial numbers and PINs, one per line..." required rows={4} className="w-full border border-slate-600 rounded px-3 py-2 text-sm bg-slate-700 text-slate-200 focus:border-blue-500 outline-none resize-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Authorization PIN</label>
            <input type="password" placeholder="CEO Directive PIN" required className="w-full border border-slate-600 rounded px-3 py-2 text-sm bg-slate-700 text-slate-200 focus:border-blue-500 outline-none" />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded text-sm tracking-wide transition-colors">
            SUBMIT SECURE DIRECTIVE
          </button>
          <p className="text-xs text-slate-500 text-center">Executive Communications Portal v3.1 · AES-256 Encrypted</p>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Compromised Alert Education Screen
// ─────────────────────────────────────────────────────
function CompromisedScreen({ indicators, templateMeta, campaign, email, onReturn }: {
  indicators: { indicators: string[]; attackType: string; severity: string };
  templateMeta: { name: string; category: string; difficulty: string } | undefined;
  campaign: { name: string } | undefined;
  email: string;
  onReturn: () => void;
}) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#020205] flex items-center justify-center p-4 font-sans">
      {/* Subtle grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(239,68,68,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      <div className={`relative w-full max-w-2xl transition-all duration-700 ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

        {/* Red glowing border card */}
        <div className="rounded-2xl border border-rose-500/40 bg-slate-950/90 backdrop-blur-xl shadow-[0_0_60px_rgba(239,68,68,0.15)] overflow-hidden">

          {/* Alert Header */}
          <div className="bg-gradient-to-r from-rose-950/80 to-slate-950/80 border-b border-rose-500/30 px-8 py-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-rose-500/20 border-2 border-rose-500/50 flex items-center justify-center flex-shrink-0 animate-pulse">
                <ShieldAlert className="w-7 h-7 text-rose-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-bold bg-rose-500 text-white px-2 py-0.5 rounded font-mono tracking-widest">PHISHNET SIM ALERT</span>
                  <span className="text-[9px] font-bold border border-rose-500/40 text-rose-400 px-2 py-0.5 rounded font-mono">{indicators.severity}</span>
                </div>
                <h1 className="text-rose-300 font-bold text-xl leading-tight">⚠ You Failed a Phishing Simulation</h1>
                <p className="text-slate-400 text-sm mt-1">This was a controlled security test. No real credentials were captured.</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">

            {/* Attack Classification */}
            <div className="bg-rose-950/30 border border-rose-500/20 rounded-xl p-5">
              <p className="text-[10px] text-rose-400 font-mono font-bold uppercase tracking-widest mb-2">Attack Vector Classified</p>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                <div>
                  <p className="text-rose-200 font-bold text-sm">{indicators.attackType}</p>
                  {templateMeta && (
                    <p className="text-slate-500 text-xs mt-0.5">{templateMeta.name} · Difficulty: {templateMeta.difficulty}</p>
                  )}
                  <p className="text-slate-600 text-[11px] mt-1">
                    Campaign: {campaign?.name || "Unassigned simulation"} | User: {email || "demo user"}
                  </p>
                </div>
              </div>
            </div>

            {/* Indicators You Missed */}
            <div>
              <p className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3" /> Red Flags You Should Have Detected
              </p>
              <div className="space-y-2">
                {indicators.indicators.map((ind, i) => (
                  <div key={i} className="flex items-start gap-3 bg-amber-950/20 border border-amber-500/10 rounded-lg px-4 py-3">
                    <span className="text-amber-500 font-mono text-[10px] font-bold mt-0.5 flex-shrink-0">#{i + 1}</span>
                    <p className="text-slate-300 text-xs leading-relaxed">{ind}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* What Happens in Real Attack */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
              <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-widest mb-3">In a Real Attack, The Attacker Would Now Have:</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Lock, label: "Your Login Password", color: "text-rose-400" },
                  { icon: User, label: "Corporate Account Access", color: "text-rose-400" },
                  { icon: CreditCard, label: "Financial/Banking Data", color: "text-amber-400" },
                  { icon: Phone, label: "Internal Network Entry Point", color: "text-amber-400" },
                ].map(({ icon: Icon, label, color }, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} />
                    <span className="text-xs text-slate-400">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Training auto-assigned */}
            <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <p className="text-emerald-300 font-bold text-sm">Remediation Training Auto-Assigned</p>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Your security team has automatically enrolled you in <strong className="text-emerald-300">2 mandatory awareness courses</strong>. Completing these will reduce your organizational risk score. Please complete them in the Learning Node.
              </p>
            </div>

            {/* Return CTA */}
            <button
              onClick={onReturn}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/40 hover:border-primary/60 hover:bg-primary/10 text-primary font-bold py-4 rounded-xl transition-all text-sm tracking-wider font-mono group"
            >
              <BookOpen className="w-4 h-4" />
              GO TO TRAINING PORTAL TO REMEDIATE
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginSimulationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#020205] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    }>
      <LoginSimulationInner />
    </Suspense>
  );
}
