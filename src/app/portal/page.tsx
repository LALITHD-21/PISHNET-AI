"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Award, ShieldAlert, GraduationCap, CheckCircle, Trophy, Play } from "lucide-react";
import { useSim, PhishingTemplate, TrainingCourse } from "@/context/SimContext";
import DashboardCard from "@/components/DashboardCard";
import CyberParticles from "@/components/CyberParticles";

export default function EmployeePortal() {
  const router = useRouter();
  const {
    currentUser,
    campaigns,
    templates,
    employees,
    trainingCourses,
    logs,
    reportPhish,
    clickPhishLink,
    completeTrainingCourse,
    logoutUser
  } = useSim();

  const [activeTab, setActiveTab] = useState<"mailbox" | "learning" | "badges" | "leaderboard">("mailbox");
  
  // Quiz states
  const [selectedCourse, setSelectedCourse] = useState<TrainingCourse | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Identify current employee profile
  const employeeProfile = useMemo(() => {
    if (!currentUser) return null;
    return employees.find(e => e.email.toLowerCase() === currentUser.email.toLowerCase()) || null;
  }, [employees, currentUser]);

  // Fetch simulation emails for the inbox
  const inboxMails = useMemo(() => {
    if (!employeeProfile) return [];
    
    // Find active campaigns targeting this employee's department
    const activeCamps = campaigns.filter(c => c.status === "Active" && c.targetDepartments.includes(employeeProfile.department));
    const mailsList: { campaignId: string; template: PhishingTemplate; status: "UNREAD" | "READ" | "CLICKED" | "REPORTED" | "COMPROMISED" }[] = [];

    // Map active campaign templates
    activeCamps.forEach(c => {
      const tpl = templates.find(t => t.id === c.templateId);
      if (!tpl) return;

      // Determine current status by inspecting logs
      const empLogs = logs.filter(l => l.employeeEmail.toLowerCase() === employeeProfile.email.toLowerCase() && l.campaignName === c.name);
      
      let status: typeof mailsList[number]["status"] = "UNREAD";
      if (empLogs.some(l => l.action === "REPORTED")) status = "REPORTED";
      else if (empLogs.some(l => l.action === "CREDENTIALS_SUBMITTED")) status = "COMPROMISED";
      else if (empLogs.some(l => l.action === "CLICKED")) status = "CLICKED";
      else if (empLogs.some(l => l.action === "OPENED")) status = "READ";

      mailsList.push({
        campaignId: c.id,
        template: tpl,
        status
      });
    });

    return mailsList;
  }, [employeeProfile, campaigns, templates, logs]);

  const [selectedMail, setSelectedMail] = useState<typeof inboxMails[number] | null>(null);

  // Handle email click action
  const handleMailLinkClick = (mail: typeof inboxMails[number]) => {
    if (!employeeProfile) return;
    clickPhishLink(employeeProfile.email, mail.campaignId);
    
    // Redirect to login simulation
    router.push(`/portal/login-simulation?tpl=${mail.template.id}&camp=${mail.campaignId}&email=${encodeURIComponent(employeeProfile.email)}`);
  };

  // Handle reporting email as phish
  const handleReportPhish = (mail: typeof inboxMails[number]) => {
    if (!employeeProfile) return;
    reportPhish(employeeProfile.email, mail.campaignId);
    
    setSelectedMail(prev => prev ? { ...prev, status: "REPORTED" } : null);
    
    // Update selected mail references inside the mailbox view
    alert("SUCCESS: Phishing simulation reported! Security threat neutralized. 15 points deducted from your Cyber Risk Score.");
  };

  // Launch course quiz
  const handleStartQuiz = (course: TrainingCourse) => {
    setSelectedCourse(course);
    setQuizAnswers(new Array(course.quizzes.length).fill(-1));
    setQuizCompleted(false);
    setQuizScore(0);
  };

  const handleSelectQuizAnswer = (qIndex: number, optionIndex: number) => {
    const updated = [...quizAnswers];
    updated[qIndex] = optionIndex;
    setQuizAnswers(updated);
  };

  const handleSubmitQuiz = () => {
    if (!selectedCourse) return;
    
    let correctCount = 0;
    selectedCourse.quizzes.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctAnswerIndex) correctCount++;
    });

    const score = Math.round((correctCount / selectedCourse.quizzes.length) * 100);
    setQuizScore(score);
    setQuizCompleted(true);

    if (score >= 70) {
      completeTrainingCourse(selectedCourse.id, score);
    }
  };

  const handleLogout = () => {
    logoutUser();
    router.push("/login");
  };

  return (
    <div className="relative min-h-screen bg-[#020205] text-slate-100 font-sans">
      
      {/* Cyber Particles background */}
      <CyberParticles />
      
      {/* Cyber Grid background */}
      <div className="cyber-grid absolute inset-0 z-0"></div>
      
      {/* Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Portal Header */}
      <header className="relative z-10 border-b border-slate-900 bg-slate-950/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-accent" />
            <span className="font-outfit text-md font-extrabold tracking-widest text-slate-100 uppercase text-glow-accent">
              EMPLOYEE SECURITY PORTAL
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            {employeeProfile && (
              <div className="text-right">
                <span className="text-[9px] text-slate-500 block leading-none font-bold">MY RISK RATING</span>
                <span className={`font-bold ${
                  employeeProfile.riskScore > 60 ? "text-rose-500" :
                  employeeProfile.riskScore > 35 ? "text-amber-500" :
                  "text-emerald-400"
                }`}>
                  {employeeProfile.riskScore} / 100 ({employeeProfile.riskScore > 50 ? "High Risk" : "Resilient"})
                </span>
              </div>
            )}
            
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 border border-slate-800 hover:border-rose-500/50 hover:bg-rose-500/5 text-slate-400 hover:text-rose-400 rounded transition-all cursor-pointer"
            >
              LOG OUT
            </button>
          </div>
        </div>
      </header>

      {/* Main Console */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-900 mb-6 font-mono text-xs">
          <button
            onClick={() => { setActiveTab("mailbox"); setSelectedMail(null); }}
            className={`px-6 py-3 border-b-2 font-bold tracking-wider cursor-pointer transition-all ${
              activeTab === "mailbox" ? "border-primary text-primary bg-primary/5" : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            SIMULATED MAILBOX ({inboxMails.filter(m => m.status === "UNREAD").length})
          </button>
          <button
            onClick={() => { setActiveTab("learning"); setSelectedCourse(null); }}
            className={`px-6 py-3 border-b-2 font-bold tracking-wider cursor-pointer transition-all ${
              activeTab === "learning" ? "border-primary text-primary bg-primary/5" : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            LEARNING NODE ({trainingCourses.filter(c => c.status === "Assigned").length})
          </button>
          <button
            onClick={() => setActiveTab("badges")}
            className={`px-6 py-3 border-b-2 font-bold tracking-wider cursor-pointer transition-all ${
              activeTab === "badges" ? "border-primary text-primary bg-primary/5" : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            MY BADGES ({employeeProfile?.badges.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`px-6 py-3 border-b-2 font-bold tracking-wider cursor-pointer transition-all ${
              activeTab === "leaderboard" ? "border-primary text-primary bg-primary/5" : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            FIREWALL SCOREBOARD
          </button>
        </div>

        {/* Tab contents */}
        {activeTab === "mailbox" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
            
            {/* Inbox Mails panel */}
            <div className="lg:col-span-4">
              <DashboardCard title="MY INCOMING TRANSMISSIONS" subtitle="Contains active threat logs sent for testing.">
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 font-mono text-xs">
                  {inboxMails.length === 0 ? (
                    <div className="text-slate-500 py-12 text-center">
                      [NO SIMULATIONS DISPATCHED]
                    </div>
                  ) : (
                    inboxMails.map((mail) => {
                      const isUnread = mail.status === "UNREAD";
                      return (
                        <button
                          key={mail.campaignId}
                          onClick={() => setSelectedMail(mail)}
                          className={`w-full text-left p-3.5 border rounded-lg transition-all flex flex-col justify-between cursor-pointer ${
                            selectedMail?.campaignId === mail.campaignId
                              ? "border-primary bg-primary/5 shadow-[0_0_8px_rgba(0,240,255,0.05)]"
                              : isUnread ? "border-slate-800 bg-slate-900/40" : "border-slate-950 bg-slate-950/20 hover:border-slate-900"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`font-bold ${isUnread ? "text-slate-200" : "text-slate-400"}`}>
                              {mail.template.sender.split("@")[0]}
                            </span>
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${
                              mail.status === "REPORTED" ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" :
                              mail.status === "COMPROMISED" ? "border-rose-500/20 bg-rose-500/5 text-rose-400" :
                              isUnread ? "border-primary/20 bg-primary/5 text-primary animate-pulse" : "border-slate-800 text-slate-500"
                            }`}>
                              {mail.status}
                            </span>
                          </div>
                          <p className={`text-[11px] truncate ${isUnread ? "text-slate-200 font-bold" : "text-slate-400 font-medium"}`}>
                            {mail.template.subject}
                          </p>
                        </button>
                      );
                    })
                  )}
                </div>
              </DashboardCard>
            </div>

            {/* Email Client detail view */}
            <div className="lg:col-span-8">
              {selectedMail ? (
                <div className="cyber-card rounded-xl p-6 border border-slate-900 bg-slate-950/60 font-mono text-xs flex flex-col min-h-[400px] justify-between">
                  <div className="space-y-4">
                    {/* Header info */}
                    <div className="border border-slate-900 rounded p-4 bg-slate-950/90 space-y-1.5 text-left">
                      <div className="flex justify-between border-b border-slate-900 pb-1.5">
                        <span className="text-slate-500 font-bold">FROM SENDER:</span>
                        <span className="text-amber-500">{selectedMail.template.sender}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-bold">SUBJECT LINE:</span>
                        <span className="text-slate-200 font-bold">{selectedMail.template.subject}</span>
                      </div>
                    </div>

                    {/* Email body iframe-like simulation */}
                    <div className="border border-slate-900 rounded bg-[#030308]/60 p-4 min-h-[220px] max-h-72 overflow-y-auto flex items-center justify-center">
                      <div className="w-full bg-white text-slate-950 rounded p-4 font-sans text-sm">
                        {/* Custom inject helper link */}
                        <div dangerouslySetInnerHTML={{ 
                          __html: selectedMail.template.body.replace(/href="\{\{SIM_LINK\}\}"/g, `href="#" onclick="window.dispatchEvent(new CustomEvent('click-sim-link'))"`) 
                        }}></div>
                        
                        {/* Inline custom trigger click if html is raw href */}
                        <script dangerouslySetInnerHTML={{
                          __html: `window.addEventListener('click-sim-link', () => { window.parent.postMessage('click-link', '*'); })`
                        }}></script>
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="border-t border-slate-900 pt-4 flex flex-wrap gap-4 justify-between items-center mt-4">
                    {selectedMail.status === "REPORTED" ? (
                      <span className="text-emerald-400 font-bold text-[10px] flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-400" /> THREAT SUCCESSFULLY REPORTED & NEUTRALIZED
                      </span>
                    ) : selectedMail.status === "COMPROMISED" ? (
                      <span className="text-rose-500 font-bold text-[10px] flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" /> CRITICAL ERROR: SENSITIVE CREDENTIALS HARVESTED
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => handleMailLinkClick(selectedMail)}
                          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded font-bold text-[10px] tracking-wider cursor-pointer flex items-center gap-1.5"
                        >
                          <Play className="w-3.5 h-3.5 fill-slate-950" /> ENGAGE PAYLOAD (CLICK LINK)
                        </button>

                        <button
                          onClick={() => handleReportPhish(selectedMail)}
                          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded font-bold text-[10px] tracking-wider cursor-pointer flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-4 h-4" /> REPORT PHISHING EMAIL
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-xl border border-dashed border-slate-800 bg-slate-950/20 text-center font-mono text-xs text-slate-500 min-h-[400px] flex items-center justify-center">
                  Select an email transmission file from the mailbox registry folder.
                </div>
              )}
            </div>

          </div>
        )}

        {activeTab === "learning" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
            
            {/* Courses listing */}
            <div className="lg:col-span-5">
              <DashboardCard title="MY COMPLIANCE CURRICULUM" subtitle="Courses assigned to satisfy security guidelines.">
                <div className="space-y-3 font-mono text-xs">
                  {trainingCourses.map((c) => {
                    let badgeColor = "border-slate-800 text-slate-500 bg-slate-900/10";
                    if (c.status === "Assigned") badgeColor = "border-amber-500/30 bg-amber-500/5 text-amber-500 animate-pulse";
                    if (c.status === "Completed") badgeColor = "border-emerald-500/30 bg-emerald-500/5 text-emerald-400";

                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          if (c.status === "Locked") {
                            alert("This course is locked. Complete assigned beginner modules to unlock intermediate and advanced paths.");
                            return;
                          }
                          setSelectedCourse(c);
                          setQuizCompleted(false);
                        }}
                        className={`w-full text-left p-4 border rounded-lg transition-all flex flex-col justify-between cursor-pointer ${
                          selectedCourse?.id === c.id
                            ? "border-primary bg-primary/5"
                            : c.status === "Locked" ? "border-slate-950 bg-slate-950/10 opacity-50" : "border-slate-900 bg-slate-950/20 hover:border-slate-850"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-bold text-slate-200 truncate max-w-[200px]">{c.title}</h4>
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${badgeColor}`}>
                            {c.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate mt-1">{c.description}</p>
                      </button>
                    );
                  })}
                </div>
              </DashboardCard>
            </div>

            {/* Course details & Quiz slide */}
            <div className="lg:col-span-7">
              {selectedCourse ? (
                <div className="cyber-card rounded-xl p-6 border border-slate-900 bg-slate-950/60 font-mono text-xs flex flex-col min-h-[400px] justify-between text-left">
                  
                  {/* Title and details */}
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-slate-900 pb-2.5">
                      <h3 className="font-outfit text-sm font-bold text-slate-200 uppercase">{selectedCourse.title}</h3>
                      <span className="text-[9px] text-slate-500 font-bold">REWARD BADGE: {selectedCourse.badgeGiven.toUpperCase()}</span>
                    </div>

                    {!quizCompleted && selectedCourse.status !== "Completed" ? (
                      // Display Course slides / Lessons
                      <div className="space-y-4">
                        <span className="text-[10px] text-primary font-bold block uppercase tracking-wider">AWARENESS LESSON TOPICS</span>
                        
                        <div className="space-y-2 bg-[#030308]/60 p-4 border border-slate-900 rounded-lg max-h-56 overflow-y-auto">
                          {selectedCourse.lessons.map((lsn, i) => (
                            <div key={i} className="flex gap-2 items-start text-slate-350 leading-relaxed text-[11px]">
                              <span className="text-primary font-bold">{i + 1}.</span>
                              <p>{lsn}</p>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => handleStartQuiz(selectedCourse)}
                          className="cyber-btn py-2 px-6 rounded text-[10px] tracking-wider font-extrabold flex items-center gap-1.5 cursor-pointer mt-4"
                        >
                          <Play className="w-3.5 h-3.5 fill-slate-950" /> RUN COMPLIANCE QUIZ
                        </button>
                      </div>
                    ) : quizCompleted ? (
                      // Quiz scoring card results
                      <div className="space-y-4 text-center py-6">
                        {quizScore >= 70 ? (
                          <>
                            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                            <h3 className="font-outfit text-md font-bold text-emerald-400">QUIZ PASSED SUCCESSFULLY</h3>
                            <p className="text-[11px] text-slate-300 max-w-sm mx-auto leading-relaxed">
                              You scored <strong>{quizScore}%</strong>. You have unlocked the <strong>{selectedCourse.badgeGiven}</strong> badge. Your Cyber Risk score has been mitigated.
                            </p>
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto animate-pulse" />
                            <h3 className="font-outfit text-md font-bold text-rose-500">COMPLIANCE TEST FAILED</h3>
                            <p className="text-[11px] text-slate-300 max-w-sm mx-auto leading-relaxed">
                              You scored <strong>{quizScore}%</strong>. A minimum score of 70% is required to clear this warning audit. Please review the slides and re-attempt.
                            </p>
                            <button
                              onClick={() => handleStartQuiz(selectedCourse)}
                              className="px-4 py-2 border border-rose-500/50 text-rose-500 hover:bg-rose-500/10 rounded font-bold text-[10px] cursor-pointer inline-block mt-4"
                            >
                              RE-ATTEMPT QUIZ
                            </button>
                          </>
                        )}
                      </div>
                    ) : selectedCourse.status === "Completed" ? (
                      // Already passed course
                      <div className="space-y-4 text-center py-10">
                        <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                        <h3 className="font-outfit text-md font-bold text-emerald-400">MODULE PREVIOUSLY ACQUIRED</h3>
                        <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed">
                          You cleared this course. Badge <strong>{selectedCourse.badgeGiven}</strong> has been pinned to your organizational profile.
                        </p>
                      </div>
                    ) : (
                      // Quiz questions prompt loop
                      <div className="space-y-4 text-left">
                        {selectedCourse.quizzes.map((q, qIdx) => (
                          <div key={q.id} className="space-y-2 border-b border-slate-900 pb-4">
                            <span className="text-slate-400 font-bold block">Q0{qIdx + 1}: {q.question}</span>
                            
                            <div className="space-y-1.5 font-sans">
                              {q.options.map((opt, oIdx) => {
                                const selected = quizAnswers[qIdx] === oIdx;
                                return (
                                  <label
                                    key={oIdx}
                                    className={`flex items-center gap-2.5 px-3 py-2 rounded border cursor-pointer text-xs transition-colors select-none ${
                                      selected 
                                        ? "border-primary bg-primary/5 text-primary" 
                                        : "border-slate-900 bg-[#030308]/60 text-slate-350 hover:border-slate-800"
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name={`question_${qIdx}`}
                                      checked={selected}
                                      onChange={() => handleSelectQuizAnswer(qIdx, oIdx)}
                                      className="accent-primary hidden"
                                    />
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700 inline-block shrink-0"></span>
                                    <span>{opt}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        ))}

                        <button
                          onClick={handleSubmitQuiz}
                          disabled={quizAnswers.includes(-1)}
                          className="cyber-btn py-2 px-6 rounded text-[10px] tracking-wider font-extrabold flex items-center gap-1.5 cursor-pointer mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          SUBMIT QUIZ TRANSCRIPT
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                <div className="p-8 rounded-xl border border-dashed border-slate-800 bg-slate-950/20 text-center font-mono text-xs text-slate-500 min-h-[400px] flex items-center justify-center">
                  Select a training course module from the compliance files portfolio.
                </div>
              )}
            </div>

          </div>
        )}

        {activeTab === "badges" && (
          <div className="cyber-card rounded-xl p-8 border border-slate-900 bg-slate-950/40 text-left">
            <h3 className="font-outfit text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              PINNED SECURITY BADGES
            </h3>
            
            {employeeProfile && employeeProfile.badges.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-xs text-center">
                {employeeProfile.badges.map((bg) => (
                  <div key={bg} className="border border-slate-900 bg-slate-950/80 rounded-xl p-6 flex flex-col items-center gap-3 shadow-lg">
                    <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/25 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,208,0.1)]">
                      <Trophy className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-200 block uppercase">{bg}</span>
                      <span className="text-[9px] text-slate-500 font-bold block mt-1">VERIFIED SHIELD</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-500 text-center py-12 font-mono text-xs">
                No badges earned. Complete micro-training quizzes in the learning center node to unlock certifications.
              </div>
            )}
          </div>
        )}

        {activeTab === "leaderboard" && (
          <DashboardCard title="ORGANIZATIONAL HUMAN FIREWALL SCOREBOARD" subtitle="Ranks employees by reported threat logs & completed training.">
            <div className="overflow-x-auto w-full text-left">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 font-bold">
                    <th className="py-3 px-4">RANK</th>
                    <th className="py-3 px-4">EMPLOYEE NAME</th>
                    <th className="py-3 px-4">SECTOR</th>
                    <th className="py-3 px-4 text-center">COURSES CLEARED</th>
                    <th className="py-3 px-4 text-center">PASSED SIMULATIONS</th>
                    <th className="py-3 px-4 text-right">CYBER RATING</th>
                  </tr>
                </thead>
                <tbody>
                  {[...employees]
                    .sort((a, b) => {
                      if (b.completedTrainingCount !== a.completedTrainingCount) {
                        return b.completedTrainingCount - a.completedTrainingCount;
                      }
                      return b.passedCount - a.passedCount;
                    })
                    .map((emp, index) => {
                      const isMe = currentUser && emp.email.toLowerCase() === currentUser.email.toLowerCase();
                      
                      return (
                        <tr key={emp.id} className={`border-b border-slate-900 hover:bg-slate-900/10 ${isMe ? "bg-primary/5 font-bold" : ""}`}>
                          <td className="py-4 px-4 font-bold text-slate-500">
                            {isMe ? <span className="text-primary font-bold">YOU</span> : `#${index + 1}`}
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-slate-200 flex items-center gap-1.5">
                              {emp.name}
                              {isMe && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>}
                            </div>
                            <div className="text-[10px] text-slate-500 font-medium">{emp.email}</div>
                          </td>
                          <td className="py-4 px-4 text-slate-400 font-medium">{emp.department.replace(" & Accounting", "").replace(" & IT", "")}</td>
                          <td className="py-4 px-4 text-center text-slate-350">{emp.completedTrainingCount} modules</td>
                          <td className="py-4 px-4 text-center text-emerald-400 font-bold">{emp.passedCount} reports</td>
                          <td className="py-4 px-4 text-right font-outfit font-bold text-sm text-slate-300">{emp.riskScore}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        )}

      </main>
    </div>
  );
}
