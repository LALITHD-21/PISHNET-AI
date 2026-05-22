"use client";

import React, { useState, useRef } from "react";
import { Wifi, Mic, QrCode, ShieldAlert, Zap, Play, Square, AlertTriangle, CheckCircle, RotateCcw } from "lucide-react";

// ─── MFA Fatigue Simulator ──────────────────────────────────────────────────
function MfaFatigue() {
  const [phase, setPhase] = useState<"idle" | "spamming" | "approved" | "denied">("idle");
  const [pushCount, setPushCount] = useState(0);
  const [notifications, setNotifications] = useState<{ id: number; x: number; y: number }[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAttack = () => {
    setPhase("spamming");
    setPushCount(0);
    setNotifications([]);
    let count = 0;

    intervalRef.current = setInterval(() => {
      count++;
      setPushCount(count);
      setNotifications((prev) => [
        ...prev.slice(-6),
        {
          id: Date.now(),
          x: 15 + Math.random() * 70,
          y: 10 + Math.random() * 80,
        },
      ]);
      if (count >= 12) {
        clearInterval(intervalRef.current!);
      }
    }, 700);
  };

  const handleApprove = () => {
    clearInterval(intervalRef.current!);
    setPhase("approved");
    setNotifications([]);
  };

  const handleDeny = () => {
    clearInterval(intervalRef.current!);
    setPhase("denied");
    setNotifications([]);
  };

  const reset = () => {
    clearInterval(intervalRef.current!);
    setPhase("idle");
    setPushCount(0);
    setNotifications([]);
  };

  return (
    <div className="space-y-4">
      <div className="relative bg-slate-900 rounded-xl border border-slate-800 overflow-hidden" style={{ height: 300 }}>
        {/* Phone mockup */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-40 bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl" style={{ height: 260 }}>
            <div className="bg-slate-700 h-6 flex items-center justify-center">
              <div className="w-12 h-1.5 bg-slate-500 rounded-full" />
            </div>
            <div className="p-3 space-y-2 h-full bg-gradient-to-b from-blue-950 to-slate-900">
              <p className="text-[8px] text-slate-400 text-center font-mono">AUTHENTICATOR APP</p>
              <div className="w-full h-px bg-slate-700" />
              {phase === "spamming" && (
                <div className="text-center py-4 space-y-2">
                  <div className="text-[9px] text-amber-400 font-bold animate-pulse font-mono">SIGN-IN REQUEST</div>
                  <div className="text-[8px] text-slate-400">New York, USA · Chrome</div>
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  </div>
                  <button onClick={handleApprove} className="w-full bg-emerald-600 text-white text-[8px] font-bold py-1.5 rounded cursor-pointer">
                    APPROVE
                  </button>
                  <button onClick={handleDeny} className="w-full bg-slate-700 text-slate-300 text-[8px] font-bold py-1.5 rounded cursor-pointer">
                    DENY
                  </button>
                </div>
              )}
              {phase === "approved" && (
                <div className="text-center py-6 space-y-2">
                  <CheckCircle className="w-8 h-8 text-rose-500 mx-auto animate-pulse" />
                  <div className="text-[8px] text-rose-400 font-bold font-mono">ACCESS GRANTED</div>
                  <div className="text-[7px] text-slate-500">Attacker is now inside</div>
                </div>
              )}
              {phase === "denied" && (
                <div className="text-center py-6 space-y-2">
                  <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
                  <div className="text-[8px] text-emerald-400 font-bold font-mono">THREAT DENIED</div>
                  <div className="text-[7px] text-slate-500">Good job! Attack blocked.</div>
                </div>
              )}
              {phase === "idle" && (
                <div className="text-center py-8">
                  <div className="text-[8px] text-slate-600 font-mono">Awaiting push...</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Floating notification bombs */}
        {notifications.map((n) => (
          <div
            key={n.id}
            className="absolute pointer-events-none animate-ping"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
          >
            <div className="w-6 h-6 rounded-full bg-amber-500/30 border border-amber-500/60 flex items-center justify-center">
              <span className="text-[8px] font-bold text-amber-400">!</span>
            </div>
          </div>
        ))}

        {pushCount > 0 && phase === "spamming" && (
          <div className="absolute top-3 left-3 bg-rose-950/80 border border-rose-500/30 rounded px-2 py-1 font-mono text-[9px] text-rose-400 font-bold">
            PUSH #{pushCount} SENT
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {phase === "idle" ? (
          <button onClick={startAttack} className="cyber-btn px-4 py-2 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer">
            <Zap className="w-3.5 h-3.5" /> LAUNCH MFA FATIGUE ATTACK
          </button>
        ) : (
          <button onClick={reset} className="px-4 py-2 rounded text-xs font-bold border border-slate-700 text-slate-400 hover:border-slate-500 flex items-center gap-1.5 cursor-pointer">
            <RotateCcw className="w-3.5 h-3.5" /> RESET SIMULATION
          </button>
        )}
      </div>
      <p className="text-[10px] text-slate-600 font-mono">
        {phase === "spamming" && "⚠ Attack active: Attacker spamming authenticator pushes hoping you click Approve out of frustration!"}
        {phase === "approved" && "🚨 CRITICAL: You approved an unsolicited MFA request! Attacker now has full account access."}
        {phase === "denied" && "✅ Excellent! You correctly identified and blocked an unsolicited MFA push notification."}
        {phase === "idle" && "Simulates an MFA Fatigue (push-spamming) attack on your authenticator app."}
      </p>
    </div>
  );
}

// ─── QR Code Phishing Generator ──────────────────────────────────────────────
function QrPhishLab() {
  const [target, setTarget] = useState("https://enterprise-sso-verify.com/auth/reset");
  const [generated, setGenerated] = useState(false);
  const [scanned, setScanned] = useState(false);

  const qrPatternStyle = {
    width: 180,
    height: 180,
    background: `
      radial-gradient(circle at 10% 10%, #000 20%, transparent 20%),
      radial-gradient(circle at 90% 10%, #000 20%, transparent 20%),
      radial-gradient(circle at 10% 90%, #000 20%, transparent 20%),
      repeating-linear-gradient(0deg, transparent, transparent 6px, #000 6px, #000 7px),
      repeating-linear-gradient(90deg, transparent, transparent 6px, #000 6px, #000 7px)
    `,
    backgroundColor: "#fff",
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-2">Phishing Payload URL</label>
        <input
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="w-full bg-slate-900/60 border border-slate-800 focus:border-primary/50 rounded-lg px-4 py-2.5 text-xs text-slate-200 outline-none font-mono"
        />
      </div>

      <button
        onClick={() => { setGenerated(true); setScanned(false); }}
        className="cyber-btn px-4 py-2 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer"
      >
        <QrCode className="w-3.5 h-3.5" /> GENERATE QUISHING PAYLOAD
      </button>

      {generated && (
        <div className="bg-white rounded-xl p-6 flex flex-col items-center gap-4 border border-slate-200">
          {/* Fake QR */}
          <div
            className="rounded border border-slate-200 p-2 cursor-pointer"
            style={qrPatternStyle}
            onClick={() => setScanned(true)}
            title="Click to simulate scan"
          />
          <p className="text-[10px] text-gray-500 font-mono text-center">Scan QR to verify identity · Click to simulate scan</p>
          <div className="bg-red-50 border border-red-200 rounded px-3 py-2 text-[10px] text-red-600 font-bold text-center max-w-xs">
            ⚠ QUISHING ALERT: This QR links to a phishing domain that bypasses email URL scanners
          </div>
        </div>
      )}

      {scanned && (
        <div className="bg-rose-950/30 border border-rose-500/20 rounded-xl p-4 font-mono text-xs space-y-2">
          <p className="text-rose-400 font-bold">🚨 SCAN INTERCEPTED — ATTACK SUCCESSFUL</p>
          <p className="text-slate-400">Victim scanned QR code and was redirected to:</p>
          <p className="text-amber-400 font-bold break-all">{target}</p>
          <p className="text-slate-500">In a real attack, this would be a credential harvesting page or malware dropper. Standard email security tools do NOT scan QR code payloads.</p>
        </div>
      )}
    </div>
  );
}

// ─── Deepfake Voice Simulator ─────────────────────────────────────────────────
function DeepfakeVoiceLab() {
  const [cloning, setCloning] = useState(false);
  const [cloned, setCloned] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [waveProgress, setWaveProgress] = useState(0);

  const startClone = () => {
    setCloning(true);
    setCloned(false);
    let progress = 0;
    const t = setInterval(() => {
      progress += 8;
      setWaveProgress(progress);
      if (progress >= 100) {
        clearInterval(t);
        setCloning(false);
        setCloned(true);
      }
    }, 200);
  };

  const handlePlay = () => {
    if (!cloned) return;
    setPlaying(true);
    setTimeout(() => setPlaying(false), 5000);
  };

  const audioWaveBars = Array.from({ length: 40 }, (_, i) => ({
    height: playing ? 20 + Math.random() * 60 : cloned ? 5 + (i % 7) * 8 : 4,
  }));

  return (
    <div className="space-y-5">
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-3">VOICE SAMPLE SOURCE (CEO AUDIO)</p>
        <div className="flex items-center gap-3 p-3 bg-slate-800/60 rounded-lg border border-slate-700">
          <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
            <Mic className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-200 font-bold">CEO_Conference_Call_Recording.mp3</p>
            <p className="text-[10px] text-slate-500">Duration: 4:32 · Sample rate: 44.1kHz · Stereo</p>
          </div>
          <span className="text-[9px] border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded font-mono">SOURCE READY</span>
        </div>
      </div>

      {!cloned ? (
        <button
          onClick={startClone}
          disabled={cloning}
          className="cyber-btn px-4 py-2.5 rounded text-xs font-bold flex items-center gap-2 cursor-pointer disabled:opacity-60"
        >
          <Mic className="w-3.5 h-3.5" />
          {cloning ? "NEURAL VOICE SYNTHESIS RUNNING..." : "SYNTHESIZE AI VOICE CLONE"}
        </button>
      ) : null}

      {cloning && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
          <p className="text-[10px] font-mono text-primary font-bold animate-pulse">EXTRACTING VOCAL SIGNATURE PATTERNS...</p>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-200"
              style={{ width: `${waveProgress}%` }}
            />
          </div>
          <p className="text-[9px] text-slate-500 font-mono">{waveProgress}% · Analyzing pitch, cadence, intonation, and breathing patterns...</p>
        </div>
      )}

      {cloned && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-mono text-emerald-400 font-bold">✓ VOICE CLONE SYNTHESIZED SUCCESSFULLY</p>
              <p className="text-[9px] text-slate-500 font-mono">Accuracy: 97.3% · Indistinguishable from source speaker</p>
            </div>
          </div>

          <div className="bg-slate-950/80 rounded-lg p-4 border border-slate-700">
            <p className="text-[10px] text-slate-500 font-mono mb-2">GENERATED SCRIPT (VISHING ATTACK):</p>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              &quot;Hi, this is [CEO Name] calling from my mobile. I&apos;m currently in transit and need you to urgently wire $48,000 to a vendor account. Do not go through the normal approval process — this is time-sensitive and confidential. I&apos;ll explain when I&apos;m back.&quot;
            </p>
          </div>

          {/* Waveform visualizer */}
          <div className="flex items-end gap-0.5 h-16 bg-slate-950/60 rounded-lg p-3">
            {audioWaveBars.map((bar, i) => (
              <div
                key={i}
                className={`flex-1 rounded-sm transition-all ${playing ? "bg-primary" : "bg-slate-700"}`}
                style={{ height: playing ? `${20 + Math.sin(i * 0.5 + Date.now() * 0.001) * 40 + 40}%` : "20%" }}
              />
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handlePlay}
              disabled={playing}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 border border-primary/30 hover:border-primary/50 text-primary rounded font-mono text-xs font-bold cursor-pointer disabled:opacity-50 transition-all"
            >
              {playing ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              {playing ? "PLAYING CLONE..." : "PLAY DEEPFAKE AUDIO"}
            </button>
            <button
              onClick={() => { setCloned(false); setWaveProgress(0); }}
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-700 text-slate-400 rounded font-mono text-xs cursor-pointer hover:border-slate-500"
            >
              <RotateCcw className="w-3.5 h-3.5" /> RESET
            </button>
          </div>

          <div className="bg-rose-950/20 border border-rose-500/10 rounded-lg p-3 font-mono text-[10px] text-rose-400">
            ⚠ In a real attack: This audio is phone-called to a finance employee. The request bypasses email logging, and the emotional authority of a CEO voice causes 74% of victims to comply without verification.
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Email Attachment Analyzer ────────────────────────────────────────────────
function AttachmentLab() {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<null | { threats: string[]; safe: string[]; verdict: string }>(null);
  const [filename, setFilename] = useState("Q3_Bonus_Details.pdf.exe");

  const analyze = () => {
    setAnalyzing(true);
    setResults(null);
    setTimeout(() => {
      setAnalyzing(false);
      setResults({
        threats: [
          "Double extension detected: .pdf.exe — disguises executable as PDF",
          "Embedded macro with AUTOEXEC command found in document structure",
          "File connects to C2 server: 192.168.x.x / malware-c2.ru at execution",
          "UAC bypass code identified in PE header sections",
        ],
        safe: [
          "File size within normal range (420 KB)",
          "Sender domain passed SPF check (spoofed at DNS level)",
        ],
        verdict: "MALWARE DETECTED",
      });
    }, 2200);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-2">Suspicious Attachment Filename</label>
        <input
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          className="w-full bg-slate-900/60 border border-slate-800 focus:border-primary/50 rounded-lg px-4 py-2.5 text-xs text-slate-200 outline-none font-mono"
        />
      </div>

      <button
        onClick={analyze}
        disabled={analyzing}
        className="cyber-btn px-4 py-2 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
      >
        <ShieldAlert className="w-3.5 h-3.5" />
        {analyzing ? "RUNNING SANDBOX ANALYSIS..." : "ANALYZE ATTACHMENT"}
      </button>

      {analyzing && (
        <div className="space-y-2 font-mono text-[10px] text-slate-400">
          {["Detonating in isolated sandbox...", "Scanning PE headers...", "Checking network callbacks...", "Analyzing embedded macros..."].map((t, i) => (
            <div key={i} className="flex items-center gap-2 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}>
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              {t}
            </div>
          ))}
        </div>
      )}

      {results && (
        <div className="space-y-3">
          <div className={`px-4 py-3 rounded-xl border font-mono text-xs font-bold ${results.verdict === "MALWARE DETECTED" ? "bg-rose-950/30 border-rose-500/30 text-rose-400" : "bg-emerald-950/30 border-emerald-500/30 text-emerald-400"}`}>
            🔍 SANDBOX VERDICT: {results.verdict}
          </div>
          <div className="space-y-2">
            {results.threats.map((t, i) => (
              <div key={i} className="flex items-start gap-2 text-[11px] text-slate-300 bg-rose-950/10 border border-rose-500/10 rounded px-3 py-2">
                <span className="text-rose-400 font-bold mt-0.5">✗</span> {t}
              </div>
            ))}
            {results.safe.map((t, i) => (
              <div key={i} className="flex items-start gap-2 text-[11px] text-slate-400 bg-slate-900/40 border border-slate-800 rounded px-3 py-2">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span> {t}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Lab Page ─────────────────────────────────────────────────────────────
const LAB_TABS = [
  { id: "mfa", label: "MFA Fatigue Attack", icon: Wifi },
  { id: "qr", label: "QR Quishing Lab", icon: QrCode },
  { id: "voice", label: "Deepfake Voice AI", icon: Mic },
  { id: "attachment", label: "Attachment Sandbox", icon: ShieldAlert },
];

export default function LabPage() {
  const [activeTab, setActiveTab] = useState("mfa");

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-900 pb-4">
        <h1 className="font-outfit text-2xl font-black tracking-wide text-slate-100 flex items-center gap-2">
          <Zap className="w-6 h-6 text-amber-400" /> ADVANCED PHISHING SIMULATION LAB
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-0.5">Interactive attack simulators: MFA Fatigue, QR Quishing, Deepfake Voice AI, and Malware Sandbox analysis.</p>
      </div>

      {/* Tab navigation */}
      <div className="flex flex-wrap gap-2">
        {LAB_TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
              activeTab === id
                ? "bg-primary/10 border border-primary/30 text-primary"
                : "border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      <div className="cyber-card rounded-xl border border-slate-900 bg-slate-950/60 p-6">
        {activeTab === "mfa" && (
          <div>
            <div className="mb-5">
              <h2 className="font-outfit text-base font-bold text-slate-100">MFA Push Notification Fatigue Attack</h2>
              <p className="text-xs text-slate-500 font-mono mt-1">Demonstrates how attackers spam authenticator push notifications until a fatigued user clicks Approve.</p>
            </div>
            <MfaFatigue />
          </div>
        )}
        {activeTab === "qr" && (
          <div>
            <div className="mb-5">
              <h2 className="font-outfit text-base font-bold text-slate-100">QR Code Phishing (Quishing) Generator</h2>
              <p className="text-xs text-slate-500 font-mono mt-1">Generates a simulated QR phishing payload that bypasses email URL scanners — a rapidly growing attack vector.</p>
            </div>
            <QrPhishLab />
          </div>
        )}
        {activeTab === "voice" && (
          <div>
            <div className="mb-5">
              <h2 className="font-outfit text-base font-bold text-slate-100">AI Deepfake Voice Cloning Simulator</h2>
              <p className="text-xs text-slate-500 font-mono mt-1">Simulates how attackers synthesize executive voices using AI to conduct vishing (voice phishing) attacks.</p>
            </div>
            <DeepfakeVoiceLab />
          </div>
        )}
        {activeTab === "attachment" && (
          <div>
            <div className="mb-5">
              <h2 className="font-outfit text-base font-bold text-slate-100">Malicious Attachment Sandbox Analyzer</h2>
              <p className="text-xs text-slate-500 font-mono mt-1">Detonates and analyzes suspicious email attachments to identify malware, macros, and C2 connections.</p>
            </div>
            <AttachmentLab />
          </div>
        )}
      </div>
    </div>
  );
}
