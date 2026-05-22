"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Role = "Super Admin" | "Security Analyst" | "Department Manager" | "Employee";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
  mfaEnabled: boolean;
  mfaSecret?: string;
}

export interface Department {
  name: string;
  riskScore: number; // 0 - 100
  employeeCount: number;
  emailsSent: number;
  emailsOpened: number;
  linksClicked: number;
  credentialsSubmitted: number;
  emailsReported: number;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  riskScore: number;
  vulnerabilityFactor: number; // 0 to 1 multiplier for clicks
  clickProbability: number; // 0 to 1
  reportingProbability: number; // 0 to 1
  failedCount: number;
  passedCount: number;
  completedTrainingCount: number;
  badges: string[];
}

export interface PhishingTemplate {
  id: string;
  name: string;
  subject: string;
  category: "Credential Harvesting" | "Social Engineering" | "Malware" | "QR Code" | "MFA Fatigue" | "Deepfake";
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  sender: string;
  body: string;
  indicators: string[]; // phishing indicators explained
  landingPageUrl: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: "Draft" | "Active" | "Completed";
  templateId: string;
  targetDepartments: string[];
  emailsSent: number;
  emailsOpened: number;
  linksClicked: number;
  credentialsSubmitted: number;
  emailsReported: number;
  createdAt: string;
  scheduledAt?: string;
}

export interface SimLog {
  id: string;
  timestamp: string;
  campaignName: string;
  employeeName: string;
  employeeEmail: string;
  department: string;
  action: "DELIVERED" | "OPENED" | "CLICKED" | "CREDENTIALS_SUBMITTED" | "REPORTED";
  details: string;
  severity: "info" | "low" | "medium" | "high" | "critical";
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface TrainingCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  lessons: string[];
  quizzes: QuizQuestion[];
  badgeGiven: string;
  status: "Locked" | "Assigned" | "In Progress" | "Completed";
  progress: number; // 0 - 100
}

interface SimContextType {
  currentUser: User | null;
  departments: Department[];
  employees: Employee[];
  templates: PhishingTemplate[];
  campaigns: Campaign[];
  logs: SimLog[];
  chatMessages: ChatMessage[];
  trainingCourses: TrainingCourse[];
  activeCampaignId: string | null;
  loginUser: (email: string, role: Role, name?: string, department?: string) => boolean;
  logoutUser: () => void;
  verifyMfa: (code: string) => boolean;
  createCampaign: (name: string, templateId: string, targetDepartments: string[]) => void;
  launchCampaign: (id: string) => void;
  reportPhish: (employeeEmail: string, campaignId: string) => void;
  clickPhishLink: (employeeEmail: string, campaignId: string) => void;
  submitCredentials: (employeeEmail: string, campaignId: string) => void;
  completeTrainingCourse: (courseId: string, score: number) => void;
  sendChatMessage: (text: string) => void;
  runPrototypeDemo: () => void;
  clearLogs: () => void;
  resetAllData: () => void;
}

const SimContext = createContext<SimContextType | undefined>(undefined);

const PRE_SEEDED_TEMPLATES: PhishingTemplate[] = [
  {
    id: "tpl_m365",
    name: "Microsoft 365 Account Expiration Alert",
    subject: "Urgent: Your Microsoft 365 password expires in 2 hours",
    category: "Credential Harvesting",
    difficulty: "Medium",
    sender: "admin-security@microsoft-alert-portal.com",
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e0e0e0;">
        <img src="https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" alt="Microsoft" style="width: 110px; margin-bottom: 20px;" />
        <h2 style="color: #2563eb; font-size: 20px; margin-top: 0;">Security Verification Required</h2>
        <p>Dear Active User,</p>
        <p>Your organizational Microsoft 365 password is scheduled to expire in exactly <strong>2 hours</strong>. To prevent account lockouts and loss of access to Microsoft Teams, Outlook, and OneDrive, you must verify your current credentials immediately.</p>
        <div style="margin: 25px 0;">
          <a href="{{SIM_LINK}}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Keep Current Password</a>
        </div>
        <p style="font-size: 12px; color: #666;">This is a system-generated message. Please do not reply to this email. Microsoft Security Corp, One Microsoft Way, Redmond, WA.</p>
      </div>
    `,
    indicators: [
      "Check the sender domain: 'microsoft-alert-portal.com' is not official 'microsoft.com'.",
      "Urgency trigger: 'expires in 2 hours' forces hasty actions without thinking.",
      "The button URL does not match an official Microsoft authorization path."
    ],
    landingPageUrl: "/portal/login-simulation?tpl=tpl_m365"
  },
  {
    id: "tpl_payroll",
    name: "HR Payroll Direct Deposit Change",
    subject: "ACTION REQUIRED: Q3 Payroll Bank Details Audit",
    category: "Social Engineering",
    difficulty: "Hard",
    sender: "hr-benefits@internal-portal-hr.net",
    body: `
      <div style="font-family: Helvetica, Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eaeaea;">
        <h2 style="color: #dc2626; font-size: 18px; margin-top: 0; border-bottom: 2px solid #dc2626; padding-bottom: 8px;">HR payroll notification</h2>
        <p>Hi Team,</p>
        <p>We are executing our Q3 payroll direct deposit compliance audit. Some account information fields for our direct bank deposits were corrupted during a database sync.</p>
        <p>To avoid delay in receiving your upcoming salary disbursement on the 25th, please click below to confirm or update your banking details instantly.</p>
        <p style="font-weight: bold; color: #dc2626;">Failure to update by end-of-day today will hold your payroll payout until the next cycle.</p>
        <div style="margin: 20px 0;">
          <a href="{{SIM_LINK}}" style="background-color: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 3px; font-weight: bold;">Verify Banking Information</a>
        </div>
        <p>Best Regards,</p>
        <p><strong>PhishNet HR & Benefits Admin Group</strong></p>
      </div>
    `,
    indicators: [
      "Check sender domain: 'internal-portal-hr.net' instead of the official company name.",
      "Threat of financial impact: 'hold your payroll payout' is a high-pressure manipulation.",
      "The URL links to a web dashboard hosting a banking form outside the corporate intranet."
    ],
    landingPageUrl: "/portal/login-simulation?tpl=tpl_payroll"
  },
  {
    id: "tpl_ceo",
    name: "CEO Executive Impersonation Request",
    subject: "Quick question - Are you at your desk?",
    category: "Social Engineering",
    difficulty: "Hard",
    sender: "ceo.office@executive-mail-router.com",
    body: `
      <div style="font-family: sans-serif; padding: 15px; font-size: 14px; color: #333;">
        <p>Are you around? I'm currently in a client pitch and can't take calls. I need you to handle a quick task for me. I need to send 5 Google Play digital gift codes worth $100 each to a prospective partner as an incentive.</p>
        <p>Can you buy them online now and email the codes directly to me? I will have Finance wire the reimbursement to you today. Please get this done ASAP, it is highly confidential.</p>
        <div style="margin: 15px 0;">
          <a href="{{SIM_LINK}}" style="color: #2563eb; font-weight: bold; text-decoration: underline;">CEO Urgent Directive Portal</a>
        </div>
        <p>Thanks,</p>
        <p>Sent from my iPad</p>
      </div>
    `,
    indicators: [
      "Sender email 'executive-mail-router.com' is spoofing the CEO's name.",
      "Unusual request: CEOs will rarely ask employees to buy retail gift cards on personal funds.",
      "Urgency & confidentiality: 'ASAP' and 'highly confidential' prevent verifying with others."
    ],
    landingPageUrl: "/portal/login-simulation?tpl=tpl_ceo"
  },
  {
    id: "tpl_qr",
    name: "QR Code MFA Authentication Reset",
    subject: "Critical Security Update: Update Authenticator Device",
    category: "QR Code",
    difficulty: "Expert",
    sender: "no-reply@security-auth-check.org",
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 550px; border: 2px solid #3b82f6; padding: 25px; border-radius: 8px;">
        <h3 style="color: #1e3a8a; margin-top:0;">Multi-Factor Authentication (MFA) Audit</h3>
        <p>Our records show your primary smartphone device registered for employee MFA authorization has not been audited this quarter.</p>
        <p>Please open your mobile camera or authenticator application and scan the dynamic QR code below to verify security keys and register your device for continuous access.</p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="{{SIM_LINK}}" style="display:inline-block; border: 1px solid #ccc; padding: 15px; background: #fafafa; text-decoration:none; color:black;">
            <div style="width: 150px; height: 150px; background: linear-gradient(45deg, #111 25%, transparent 25%), linear-gradient(-45deg, #111 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #111 75%), linear-gradient(-45deg, transparent 75%, #111 75%); background-size: 20px 20px; background-position: 0 0, 0 10px, 10px -10px, -10px 0; margin: 0 auto 10px auto;"></div>
            <span style="font-size:12px; color:#555; font-weight:bold;">[Scan QR to Authenticate]</span>
          </a>
        </div>
        <p style="font-size: 12px; color: #ff0000; font-weight: bold;">Note: You must scan this QR code within 5 minutes to prevent account suspension.</p>
      </div>
    `,
    indicators: [
      "QR phishing (quishing) bypasses standard email security filters that screen URLs.",
      "The sender domain is '.org' instead of corporate systems.",
      "High urgency text warns of 'account suspension' if not scanned in 5 minutes."
    ],
    landingPageUrl: "/portal/login-simulation?tpl=tpl_qr"
  },
  {
    id: "tpl_bank",
    name: "Bank Verification Security Notice",
    subject: "Security hold: verify corporate card access",
    category: "Credential Harvesting",
    difficulty: "Medium",
    sender: "alerts@card-services-verification.example",
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 580px; padding: 22px; border: 1px solid #e5e7eb;">
        <h2 style="color:#0f172a; margin-top:0;">Corporate Card Security Center</h2>
        <p>A temporary hold has been placed on your corporate card profile because recent travel transactions require verification.</p>
        <p>Please confirm your profile before 5 PM to prevent purchase declines on active business expenses.</p>
        <div style="margin: 22px 0;">
          <a href="{{SIM_LINK}}" style="background:#0f766e;color:white;padding:12px 18px;border-radius:4px;text-decoration:none;font-weight:bold;">Verify Card Profile</a>
        </div>
        <p style="font-size:12px;color:#6b7280;">Training simulation sample. Real finance teams should route card issues through the approved expense portal.</p>
      </div>
    `,
    indicators: [
      "The sender domain is not the organization's approved bank or expense-management domain.",
      "The message pressures the employee with a purchase-decline deadline.",
      "Banking and card workflows should be verified from bookmarked portals, not email buttons."
    ],
    landingPageUrl: "/portal/login-simulation?tpl=tpl_bank"
  },
  {
    id: "tpl_invoice",
    name: "Invoice Fraud Payment Change",
    subject: "Updated remittance instructions for overdue invoice",
    category: "Social Engineering",
    difficulty: "Hard",
    sender: "billing-team@vendor-remit-update.example",
    body: `
      <div style="font-family: Helvetica, Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #d1d5db;">
        <h2 style="color:#111827;margin-top:0;">Vendor Billing Desk</h2>
        <p>We noticed invoice PN-44781 is still queued with outdated remittance coordinates after our banking migration.</p>
        <p>Please use the secure document below to confirm the new account information before today's payment batch closes.</p>
        <div style="margin: 20px 0;">
          <a href="{{SIM_LINK}}" style="background:#111827;color:white;padding:11px 18px;border-radius:4px;text-decoration:none;font-weight:bold;">Open Updated Invoice</a>
        </div>
        <p style="font-size:12px;color:#6b7280;">Always validate payment changes using a known vendor phone number and dual approval.</p>
      </div>
    `,
    indicators: [
      "Payment-change requests require out-of-band vendor verification.",
      "The domain uses a generic remittance update host rather than the known vendor domain.",
      "The email tries to bypass normal approval by referencing today's payment batch."
    ],
    landingPageUrl: "/portal/login-simulation?tpl=tpl_invoice"
  },
  {
    id: "tpl_zoom",
    name: "Fake Zoom Executive Invite",
    subject: "Confidential Zoom: board review starts in 5 minutes",
    category: "Social Engineering",
    difficulty: "Medium",
    sender: "calendar@executive-zoom-routing.example",
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 580px; padding: 20px; border: 1px solid #bfdbfe;">
        <h2 style="color:#2563eb;margin-top:0;">Video Meeting Lobby</h2>
        <p>You have been added to a confidential executive review call. The lobby is already open and attendance is mandatory.</p>
        <p>Join through the authorization link below and re-enter SSO credentials if prompted.</p>
        <div style="margin: 20px 0;">
          <a href="{{SIM_LINK}}" style="background:#2563eb;color:white;padding:11px 18px;border-radius:4px;text-decoration:none;font-weight:bold;">Join Secure Lobby</a>
        </div>
        <p style="font-size:12px;color:#6b7280;">Training sample: verify unexpected meetings in the official calendar application.</p>
      </div>
    `,
    indicators: [
      "Unexpected meetings should be verified in the official calendar, not through email-only links.",
      "The sender domain is not the official conferencing or corporate domain.",
      "Short countdowns create urgency and reduce verification behavior."
    ],
    landingPageUrl: "/portal/login-simulation?tpl=tpl_zoom"
  },
  {
    id: "tpl_internship",
    name: "Internship Recruiting Scam",
    subject: "Final internship paperwork required today",
    category: "Social Engineering",
    difficulty: "Easy",
    sender: "campus-hiring@talent-docs.example",
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 580px; padding: 20px; border: 1px solid #e5e7eb;">
        <h2 style="color:#7c3aed;margin-top:0;">Campus Hiring Team</h2>
        <p>Congratulations. Your internship paperwork is pending final confirmation.</p>
        <p>Please upload identification details and sign the attached onboarding packet today to keep your offer active.</p>
        <div style="margin: 20px 0;">
          <a href="{{SIM_LINK}}" style="background:#7c3aed;color:white;padding:11px 18px;border-radius:4px;text-decoration:none;font-weight:bold;">Complete Offer Packet</a>
        </div>
        <p style="font-size:12px;color:#6b7280;">Training sample: recruiting communications should come from the official HR system.</p>
      </div>
    `,
    indicators: [
      "Recruiting scams often target urgency and excitement around job offers.",
      "The sender domain is a generic document host rather than the official HR platform.",
      "Requests for identity documents should be handled only in approved onboarding systems."
    ],
    landingPageUrl: "/portal/login-simulation?tpl=tpl_internship"
  }
];

const PRE_SEEDED_DEPARTMENTS: Department[] = [
  { name: "Human Resources", riskScore: 68, employeeCount: 3, emailsSent: 15, emailsOpened: 12, linksClicked: 8, credentialsSubmitted: 5, emailsReported: 2 },
  { name: "Finance & Accounting", riskScore: 74, employeeCount: 3, emailsSent: 20, emailsOpened: 18, linksClicked: 12, credentialsSubmitted: 9, emailsReported: 1 },
  { name: "Engineering & IT", riskScore: 24, employeeCount: 4, emailsSent: 25, emailsOpened: 10, linksClicked: 3, credentialsSubmitted: 1, emailsReported: 16 },
  { name: "Sales & Marketing", riskScore: 55, employeeCount: 3, emailsSent: 18, emailsOpened: 15, linksClicked: 9, credentialsSubmitted: 4, emailsReported: 3 },
  { name: "Operations", riskScore: 42, employeeCount: 3, emailsSent: 14, emailsOpened: 11, linksClicked: 5, credentialsSubmitted: 2, emailsReported: 4 }
];

const PRE_SEEDED_EMPLOYEES: Employee[] = [
  { id: "emp1", name: "Sarah Connor", email: "sconnor@enterprise.com", department: "Human Resources", riskScore: 65, vulnerabilityFactor: 0.7, clickProbability: 0.6, reportingProbability: 0.2, failedCount: 3, passedCount: 1, completedTrainingCount: 0, badges: [] },
  { id: "emp2", name: "John Connor", email: "jconnor@enterprise.com", department: "Engineering & IT", riskScore: 18, vulnerabilityFactor: 0.1, clickProbability: 0.15, reportingProbability: 0.8, failedCount: 0, passedCount: 5, completedTrainingCount: 2, badges: ["Human Firewall", "Zero Click Hero"] },
  { id: "emp3", name: "Marcus Wright", email: "mwright@enterprise.com", department: "Operations", riskScore: 40, vulnerabilityFactor: 0.4, clickProbability: 0.4, reportingProbability: 0.4, failedCount: 1, passedCount: 2, completedTrainingCount: 1, badges: ["Phish Detector"] },
  { id: "emp4", name: "David Vance", email: "dvance@enterprise.com", department: "Finance & Accounting", riskScore: 82, vulnerabilityFactor: 0.85, clickProbability: 0.8, reportingProbability: 0.1, failedCount: 5, passedCount: 0, completedTrainingCount: 0, badges: [] },
  { id: "emp5", name: "Peter Parker", email: "pparker@enterprise.com", department: "Sales & Marketing", riskScore: 50, vulnerabilityFactor: 0.5, clickProbability: 0.5, reportingProbability: 0.3, failedCount: 2, passedCount: 2, completedTrainingCount: 1, badges: ["Phish Detector"] },
  { id: "emp6", name: "Gwen Stacy", email: "gstacy@enterprise.com", department: "Engineering & IT", riskScore: 30, vulnerabilityFactor: 0.25, clickProbability: 0.3, reportingProbability: 0.7, failedCount: 1, passedCount: 4, completedTrainingCount: 2, badges: ["Zero Click Hero"] },
  { id: "emp7", name: "Tony Stark", email: "tstark@enterprise.com", department: "Engineering & IT", riskScore: 12, vulnerabilityFactor: 0.05, clickProbability: 0.05, reportingProbability: 0.9, failedCount: 0, passedCount: 6, completedTrainingCount: 3, badges: ["Human Firewall", "Zero Click Hero", "Sec Master"] },
  { id: "emp8", name: "Bruce Banner", email: "bbanner@enterprise.com", department: "Engineering & IT", riskScore: 35, vulnerabilityFactor: 0.3, clickProbability: 0.3, reportingProbability: 0.6, failedCount: 1, passedCount: 3, completedTrainingCount: 1, badges: ["Phish Detector"] },
  { id: "emp9", name: "Selina Kyle", email: "skyle@enterprise.com", department: "Sales & Marketing", riskScore: 60, vulnerabilityFactor: 0.6, clickProbability: 0.6, reportingProbability: 0.25, failedCount: 3, passedCount: 1, completedTrainingCount: 0, badges: [] },
  { id: "emp10", name: "Bruce Wayne", email: "bwayne@enterprise.com", department: "Finance & Accounting", riskScore: 68, vulnerabilityFactor: 0.75, clickProbability: 0.7, reportingProbability: 0.15, failedCount: 4, passedCount: 1, completedTrainingCount: 0, badges: [] },
  { id: "emp11", name: "Clark Kent", email: "ckent@enterprise.com", department: "Human Resources", riskScore: 72, vulnerabilityFactor: 0.8, clickProbability: 0.75, reportingProbability: 0.15, failedCount: 4, passedCount: 1, completedTrainingCount: 0, badges: [] },
  { id: "emp12", name: "Diana Prince", email: "dprince@enterprise.com", department: "Operations", riskScore: 44, vulnerabilityFactor: 0.45, clickProbability: 0.45, reportingProbability: 0.45, failedCount: 1, passedCount: 2, completedTrainingCount: 1, badges: ["Phish Detector"] },
  { id: "emp13", name: "Lois Lane", email: "llane@enterprise.com", department: "Human Resources", riskScore: 62, vulnerabilityFactor: 0.65, clickProbability: 0.6, reportingProbability: 0.3, failedCount: 2, passedCount: 2, completedTrainingCount: 1, badges: [] },
  { id: "emp14", name: "Barry Allen", email: "ballen@enterprise.com", department: "Sales & Marketing", riskScore: 56, vulnerabilityFactor: 0.58, clickProbability: 0.55, reportingProbability: 0.35, failedCount: 2, passedCount: 1, completedTrainingCount: 0, badges: [] },
  { id: "emp15", name: "Arthur Curry", email: "acurry@enterprise.com", department: "Operations", riskScore: 42, vulnerabilityFactor: 0.4, clickProbability: 0.45, reportingProbability: 0.38, failedCount: 1, passedCount: 1, completedTrainingCount: 0, badges: [] },
  { id: "emp16", name: "Harvey Dent", email: "hdent@enterprise.com", department: "Finance & Accounting", riskScore: 72, vulnerabilityFactor: 0.75, clickProbability: 0.7, reportingProbability: 0.2, failedCount: 3, passedCount: 1, completedTrainingCount: 0, badges: [] }
];

const PRE_SEEDED_CAMPAIGNS: Campaign[] = [
  { id: "camp_1", name: "PhishNet Alpha Shield", status: "Completed", templateId: "tpl_m365", targetDepartments: ["Engineering & IT", "Finance & Accounting"], emailsSent: 45, emailsOpened: 28, linksClicked: 15, credentialsSubmitted: 10, emailsReported: 17, createdAt: "2026-05-10T08:00:00Z" },
  { id: "camp_2", name: "Q3 HR Payroll Verification", status: "Completed", templateId: "tpl_payroll", targetDepartments: ["Human Resources", "Sales & Marketing"], emailsSent: 33, emailsOpened: 27, linksClicked: 17, credentialsSubmitted: 9, emailsReported: 5, createdAt: "2026-05-15T09:30:00Z" }
];

const PRE_SEEDED_LOGS: SimLog[] = [
  { id: "log1", timestamp: "2026-05-10T08:02:11Z", campaignName: "PhishNet Alpha Shield", employeeName: "David Vance", employeeEmail: "dvance@enterprise.com", department: "Finance & Accounting", action: "DELIVERED", details: "Phishing simulation email sent to dvance@enterprise.com", severity: "info" },
  { id: "log2", timestamp: "2026-05-10T08:05:43Z", campaignName: "PhishNet Alpha Shield", employeeName: "David Vance", employeeEmail: "dvance@enterprise.com", department: "Finance & Accounting", action: "OPENED", details: "Phishing email opened by Finance employee", severity: "low" },
  { id: "log3", timestamp: "2026-05-10T08:06:12Z", campaignName: "PhishNet Alpha Shield", employeeName: "David Vance", employeeEmail: "dvance@enterprise.com", department: "Finance & Accounting", action: "CLICKED", details: "Target clicked expiration link in Microsoft 365 fake notification", severity: "high" },
  { id: "log4", timestamp: "2026-05-10T08:07:05Z", campaignName: "PhishNet Alpha Shield", employeeName: "David Vance", employeeEmail: "dvance@enterprise.com", department: "Finance & Accounting", action: "CREDENTIALS_SUBMITTED", details: "EXPLOIT: Employee submitted active login credentials in fake portal", severity: "critical" },
  { id: "log5", timestamp: "2026-05-10T08:15:30Z", campaignName: "PhishNet Alpha Shield", employeeName: "John Connor", employeeEmail: "jconnor@enterprise.com", department: "Engineering & IT", action: "REPORTED", details: "Employee correctly identified and reported the email as a phish", severity: "low" },
  { id: "log6", timestamp: "2026-05-15T09:40:22Z", campaignName: "Q3 HR Payroll Verification", employeeName: "Sarah Connor", employeeEmail: "sconnor@enterprise.com", department: "Human Resources", action: "CLICKED", details: "HR employee clicked payroll update button", severity: "high" }
];

const PRE_SEEDED_COURSES: TrainingCourse[] = [
  {
    id: "course_phish_basics",
    title: "Introduction to Phishing & Social Engineering",
    description: "Learn the core techniques scammers use to manipulate emotions and compromise credentials.",
    category: "Phishing Basics",
    duration: "10 mins",
    difficulty: "Beginner",
    lessons: [
      "What is social engineering?",
      "The common indicators of phishing (Urgency, Spoofed Domains, Bad links)",
      "How to inspect headers and verify sender legitimacy"
    ],
    quizzes: [
      {
        id: "q1_1",
        question: "What is the primary indicator of a phishing email?",
        options: [
          "A greeting using your full name.",
          "An urgent call to action threatening immediate negative consequences.",
          "Perfect spelling and grammar.",
          "An attachment in PDF format."
        ],
        correctAnswerIndex: 1,
        explanation: "Scammers often create false urgency (e.g., 'your account will be suspended in 2 hours') to panic victims into reacting without checking details."
      },
      {
        id: "q1_2",
        question: "If an email sender claims to be 'billing@paypal-support-billing.com', is it safe?",
        options: [
          "Yes, because it contains the word 'paypal'.",
          "Yes, if it has a padlock security icon.",
          "No, because the domain is 'paypal-support-billing.com' instead of 'paypal.com'.",
          "Yes, if the link begins with https."
        ],
        correctAnswerIndex: 2,
        explanation: "Always check the domain directly before the final TLD (e.g., .com). 'paypal-support-billing.com' is a separate domain registered by an attacker, not PayPal."
      }
    ],
    badgeGiven: "Phish Detector",
    status: "Assigned",
    progress: 0
  },
  {
    id: "course_credential_safety",
    title: "Credential Harvesting Protection",
    description: "How fake login portals steal your keys, and how to verify legitimate authentication nodes.",
    category: "Security Best Practices",
    duration: "15 mins",
    difficulty: "Intermediate",
    lessons: [
      "The anatomy of a credential harvesting attack",
      "Why Single Sign-On (SSO) portals are targeted",
      "Using password managers to detect fake domains"
    ],
    quizzes: [
      {
        id: "q2_1",
        question: "How does a password manager help prevent phishing?",
        options: [
          "It blocks the phishing email from reaching your inbox.",
          "It automatically encrypts the hacker's portal.",
          "It will not autofill your credentials on a spoofed or incorrect domain name.",
          "It alerts the IT department automatically."
        ],
        correctAnswerIndex: 2,
        explanation: "Password managers lock autofill details to the exact domain name. If you visit a fake 'micros0ft.com' portal, the password manager will refuse to autofill, instantly warning you of fraud."
      }
    ],
    badgeGiven: "MFA Defender",
    status: "Locked",
    progress: 0
  },
  {
    id: "course_advanced_scams",
    title: "Advanced Scams: QR Codes & MFA Fatigue",
    description: "Defeating the next generation of attacks: Quishing, MFA push fatigue spam, and deepfake voice requests.",
    category: "Advanced Threats",
    duration: "20 mins",
    difficulty: "Advanced",
    lessons: [
      "QR code phishing (Quishing) bypass mechanisms",
      "MFA fatigue: How attackers spam approve requests to break in",
      "AI Deepfake Voice cloning in executive impersonation"
    ],
    quizzes: [
      {
        id: "q3_1",
        question: "What is MFA Fatigue (MFA Spamming)?",
        options: [
          "When you forget your Multi-Factor authenticator PIN.",
          "An attacker continuously spamming push notifications to your phone, hoping you hit 'Approve' to stop the noise.",
          "Your phone running out of battery due to authentication calls.",
          "A server crashing from too many verification requests."
        ],
        correctAnswerIndex: 1,
        explanation: "In MFA Fatigue, hackers obtain passwords then spam push requests. Victims often accept out of frustration or distraction. Never approve an unsolicited request!"
      }
    ],
    badgeGiven: "Human Firewall",
    status: "Locked",
    progress: 0
  }
];

export const SimProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [departments, setDepartments] = useState<Department[]>(PRE_SEEDED_DEPARTMENTS);
  const [employees, setEmployees] = useState<Employee[]>(PRE_SEEDED_EMPLOYEES);
  const [templates, setTemplates] = useState<PhishingTemplate[]>(PRE_SEEDED_TEMPLATES);
  const [campaigns, setCampaigns] = useState<Campaign[]>(PRE_SEEDED_CAMPAIGNS);
  const [logs, setLogs] = useState<SimLog[]>(PRE_SEEDED_LOGS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [trainingCourses, setTrainingCourses] = useState<TrainingCourse[]>(PRE_SEEDED_COURSES);
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);

  // Initialize from LocalStorage if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("phishnet_current_user");
      const storedDepts = localStorage.getItem("phishnet_depts");
      const storedEmps = localStorage.getItem("phishnet_employees");
      const storedCamps = localStorage.getItem("phishnet_campaigns");
      const storedLogs = localStorage.getItem("phishnet_logs");
      const storedChat = localStorage.getItem("phishnet_chat");
      const storedCourses = localStorage.getItem("phishnet_courses");
      const storedActiveCamp = localStorage.getItem("phishnet_active_campaign_id");

      if (storedUser) setCurrentUser(JSON.parse(storedUser));
      if (storedDepts) setDepartments(JSON.parse(storedDepts));
      if (storedEmps) setEmployees(JSON.parse(storedEmps));
      if (storedCamps) setCampaigns(JSON.parse(storedCamps));
      if (storedLogs) setLogs(JSON.parse(storedLogs));
      if (storedChat) setChatMessages(JSON.parse(storedChat));
      if (storedCourses) setTrainingCourses(JSON.parse(storedCourses));
      if (storedActiveCamp) setActiveCampaignId(storedActiveCamp);
    }
  }, []);

  // Save changes to LocalStorage
  const saveState = (
    user: User | null,
    depts: Department[],
    emps: Employee[],
    camps: Campaign[],
    lgList: SimLog[],
    chat: ChatMessage[],
    courses: TrainingCourse[],
    activeCampId: string | null
  ) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("phishnet_current_user", JSON.stringify(user));
      localStorage.setItem("phishnet_depts", JSON.stringify(depts));
      localStorage.setItem("phishnet_employees", JSON.stringify(emps));
      localStorage.setItem("phishnet_campaigns", JSON.stringify(camps));
      localStorage.setItem("phishnet_logs", JSON.stringify(lgList));
      localStorage.setItem("phishnet_chat", JSON.stringify(chat));
      localStorage.setItem("phishnet_courses", JSON.stringify(courses));
      if (activeCampId) {
        localStorage.setItem("phishnet_active_campaign_id", activeCampId);
      } else {
        localStorage.removeItem("phishnet_active_campaign_id");
      }
    }
  };

  // Helper trigger to save state
  const triggerSave = (
    updatedUser = currentUser,
    updatedDepts = departments,
    updatedEmps = employees,
    updatedCamps = campaigns,
    updatedLogs = logs,
    updatedChat = chatMessages,
    updatedCourses = trainingCourses,
    updatedActiveCamp = activeCampaignId
  ) => {
    saveState(updatedUser, updatedDepts, updatedEmps, updatedCamps, updatedLogs, updatedChat, updatedCourses, updatedActiveCamp);
  };

  // 1. Auth Actions
  const loginUser = (email: string, role: Role, name?: string, department?: string): boolean => {
    let user: User;
    if (role === "Employee") {
      const emp = employees.find(e => e.email.toLowerCase() === email.toLowerCase());
      user = {
        id: emp?.id || "emp_user",
        name: emp?.name || name || "Employee User",
        email: email,
        role: role,
        department: emp?.department || department || "Operations",
        mfaEnabled: true
      };
    } else {
      user = {
        id: "admin_user",
        name: name || "Analyst Stark",
        email: email,
        role: role,
        mfaEnabled: true,
        mfaSecret: "PHISHNETSECRET123"
      };
    }
    setCurrentUser(user);
    triggerSave(user);
    return true;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("phishnet_current_user");
    }
  };

  const verifyMfa = (code: string): boolean => {
    // Standard mock verification code
    return code === "123456" || code === "654321" || code.length === 6;
  };

  // 2. Campaign Engine Actions
  const createCampaign = (name: string, templateId: string, targetDepartments: string[]) => {
    const newCamp: Campaign = {
      id: "camp_" + Date.now(),
      name,
      status: "Draft",
      templateId,
      targetDepartments,
      emailsSent: 0,
      emailsOpened: 0,
      linksClicked: 0,
      credentialsSubmitted: 0,
      emailsReported: 0,
      createdAt: new Date().toISOString()
    };
    const updatedCamps = [newCamp, ...campaigns];
    setCampaigns(updatedCamps);
    triggerSave(currentUser, departments, employees, updatedCamps);
  };

  const launchCampaign = (id: string) => {
    const activeCamp = campaigns.find(c => c.id === id);
    if (!activeCamp) return;

    // Set other campaigns status as Completed or Draft. This campaign becomes Active.
    const updatedCamps = campaigns.map(c => {
      if (c.id === id) return { ...c, status: "Active" as const };
      if (c.status === "Active") return { ...c, status: "Completed" as const };
      return c;
    });

    // Send emails to all targeted employees
    const targetDepts = activeCamp.targetDepartments;
    const targetEmployees = employees.filter(e => targetDepts.includes(e.department));

    const newLogs: SimLog[] = [];
    const updatedEmployees = employees.map(emp => {
      if (targetDepts.includes(emp.department)) {
        newLogs.push({
          id: "log_" + Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          campaignName: activeCamp.name,
          employeeName: emp.name,
          employeeEmail: emp.email,
          department: emp.department,
          action: "DELIVERED",
          details: `Campaign payload email delivered to ${emp.email}`,
          severity: "info"
        });
        return { ...emp, passedCount: emp.passedCount + 0 };
      }
      return emp;
    });

    // Update campaign metrics
    const updatedCampsWithSent = updatedCamps.map(c => {
      if (c.id === id) {
        return {
          ...c,
          emailsSent: targetEmployees.length,
          emailsOpened: 0,
          linksClicked: 0,
          credentialsSubmitted: 0,
          emailsReported: 0
        };
      }
      return c;
    });

    // Update Departments stats
    const updatedDepts = departments.map(d => {
      if (targetDepts.includes(d.name)) {
        const count = targetEmployees.filter(e => e.department === d.name).length;
        return {
          ...d,
          emailsSent: d.emailsSent + count
        };
      }
      return d;
    });

    const finalLogs = [...newLogs, ...logs];
    setCampaigns(updatedCampsWithSent);
    setEmployees(updatedEmployees);
    setLogs(finalLogs);
    setActiveCampaignId(id);
    setDepartments(updatedDepts);

    triggerSave(currentUser, updatedDepts, updatedEmployees, updatedCampsWithSent, finalLogs, chatMessages, trainingCourses, id);
  };

  // 3. User actions in simulation mailbox / portal
  const reportPhish = (employeeEmail: string, campaignId: string) => {
    const camp = campaigns.find(c => c.id === campaignId);
    const emp = employees.find(e => e.email.toLowerCase() === employeeEmail.toLowerCase());
    if (!camp || !emp) return;

    // Check if user already reported or compromised to avoid duplicate logs
    const alreadyActioned = logs.some(l => l.employeeEmail === employeeEmail && l.campaignName === camp.name && l.action === "REPORTED");
    if (alreadyActioned) return;

    // Create log
    const newLog: SimLog = {
      id: "log_" + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      campaignName: camp.name,
      employeeName: emp.name,
      employeeEmail: emp.email,
      department: emp.department,
      action: "REPORTED",
      details: `SUCCESS: Employee reported suspected phishing email. Threat neutralized.`,
      severity: "low"
    };

    // Update Employee scores: successful report lowers risk score
    const updatedEmployees = employees.map(e => {
      if (e.email.toLowerCase() === employeeEmail.toLowerCase()) {
        const newScore = Math.max(0, e.riskScore - 15);
        const newPassed = e.passedCount + 1;
        const badges = [...e.badges];
        if (newPassed >= 5 && !badges.includes("Human Firewall")) {
          badges.push("Human Firewall");
        }
        if (!badges.includes("Phish Detector")) {
          badges.push("Phish Detector");
        }
        return {
          ...e,
          riskScore: newScore,
          passedCount: newPassed,
          badges
        };
      }
      return e;
    });

    // Update campaign metrics
    const updatedCamps = campaigns.map(c => {
      if (c.id === campaignId) {
        return { ...c, emailsReported: c.emailsReported + 1 };
      }
      return c;
    });

    // Update Departments stats
    const updatedDepts = departments.map(d => {
      if (d.name === emp.department) {
        const dLogs = [...newLog ? [newLog] : [], ...logs].filter(l => l.department === d.name);
        const clicks = dLogs.filter(l => l.action === "CLICKED").length;
        const reports = dLogs.filter(l => l.action === "REPORTED").length;
        const sents = dLogs.filter(l => l.action === "DELIVERED").length;
        // Recalculate Department Risk Score: higher clicks/submits increase risk, reports decrease
        const clickRatio = sents > 0 ? clicks / sents : 0.5;
        const reportRatio = sents > 0 ? reports / sents : 0.2;
        const rawScore = Math.round((clickRatio * 80) + (20 - reportRatio * 30));
        const newRisk = Math.min(100, Math.max(5, rawScore));

        return {
          ...d,
          emailsReported: d.emailsReported + 1,
          riskScore: newRisk
        };
      }
      return d;
    });

    const finalLogs = [newLog, ...logs];
    setEmployees(updatedEmployees);
    setCampaigns(updatedCamps);
    setLogs(finalLogs);
    setDepartments(updatedDepts);

    triggerSave(currentUser, updatedDepts, updatedEmployees, updatedCamps, finalLogs);
  };

  const clickPhishLink = (employeeEmail: string, campaignId: string) => {
    const camp = campaigns.find(c => c.id === campaignId);
    const emp = employees.find(e => e.email.toLowerCase() === employeeEmail.toLowerCase());
    if (!camp || !emp) return;

    // Check if clicked
    const alreadyClicked = logs.some(l => l.employeeEmail === employeeEmail && l.campaignName === camp.name && l.action === "CLICKED");
    if (alreadyClicked) return;

    const newLog: SimLog = {
      id: "log_" + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      campaignName: camp.name,
      employeeName: emp.name,
      employeeEmail: emp.email,
      department: emp.department,
      action: "CLICKED",
      details: `WARNING: Employee clicked on simulation link in ${camp.name}`,
      severity: "high"
    };

    // Update Employee: Click increases risk score
    const updatedEmployees = employees.map(e => {
      if (e.email.toLowerCase() === employeeEmail.toLowerCase()) {
        const newScore = Math.min(100, e.riskScore + 20);
        return {
          ...e,
          riskScore: newScore,
          failedCount: e.failedCount + 1
        };
      }
      return e;
    });

    // Update campaign metrics
    const updatedCamps = campaigns.map(c => {
      if (c.id === campaignId) {
        return {
          ...c,
          emailsOpened: Math.min(c.emailsSent, c.emailsOpened + 1),
          linksClicked: c.linksClicked + 1
        };
      }
      return c;
    });

    // Update Departments stats
    const updatedDepts = departments.map(d => {
      if (d.name === emp.department) {
        const clicks = d.linksClicked + 1;
        const sents = d.emailsSent;
        const reports = d.emailsReported;
        const clickRatio = sents > 0 ? clicks / sents : 0.5;
        const reportRatio = sents > 0 ? reports / sents : 0.2;
        const newRisk = Math.min(100, Math.round((clickRatio * 85) + (20 - reportRatio * 35)));

        return {
          ...d,
          emailsOpened: Math.min(d.emailsSent, d.emailsOpened + 1),
          linksClicked: clicks,
          riskScore: newRisk
        };
      }
      return d;
    });

    const finalLogs = [newLog, ...logs];
    setEmployees(updatedEmployees);
    setCampaigns(updatedCamps);
    setLogs(finalLogs);
    setDepartments(updatedDepts);

    triggerSave(currentUser, updatedDepts, updatedEmployees, updatedCamps, finalLogs);
  };

  const submitCredentials = (employeeEmail: string, campaignId: string) => {
    const camp = campaigns.find(c => c.id === campaignId);
    const emp = employees.find(e => e.email.toLowerCase() === employeeEmail.toLowerCase());
    if (!camp || !emp) return;

    // Check if already submitted
    const alreadySubmitted = logs.some(l => l.employeeEmail === employeeEmail && l.campaignName === camp.name && l.action === "CREDENTIALS_SUBMITTED");
    if (alreadySubmitted) return;

    const newLog: SimLog = {
      id: "log_" + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      campaignName: camp.name,
      employeeName: emp.name,
      employeeEmail: emp.email,
      department: emp.department,
      action: "CREDENTIALS_SUBMITTED",
      details: `EXPLOIT ALERT: Employee entered organization credentials on simulated landing page`,
      severity: "critical"
    };

    // Update Employee: Submission boosts risk score to high/critical, locks courses
    const updatedEmployees = employees.map(e => {
      if (e.email.toLowerCase() === employeeEmail.toLowerCase()) {
        const newScore = Math.min(100, e.riskScore + 40);
        return {
          ...e,
          riskScore: newScore
        };
      }
      return e;
    });

    // Update courses: Automatically assign phishing basics if they fail
    const updatedCourses = trainingCourses.map(c => {
      if (c.id === "course_phish_basics" && c.status === "Locked") {
        return { ...c, status: "Assigned" as const };
      }
      if (c.id === "course_credential_safety" && c.status === "Locked") {
        return { ...c, status: "Assigned" as const };
      }
      return c;
    });

    // Update campaign metrics
    const updatedCamps = campaigns.map(c => {
      if (c.id === campaignId) {
        return { ...c, credentialsSubmitted: c.credentialsSubmitted + 1 };
      }
      return c;
    });

    // Update Departments stats
    const updatedDepts = departments.map(d => {
      if (d.name === emp.department) {
        const submits = d.credentialsSubmitted + 1;
        const clicks = d.linksClicked;
        const sents = d.emailsSent;
        const clickRatio = sents > 0 ? clicks / sents : 0.5;
        const submitRatio = sents > 0 ? submits / sents : 0.3;
        const newRisk = Math.min(100, Math.round((clickRatio * 40) + (submitRatio * 60) + 10));

        return {
          ...d,
          credentialsSubmitted: submits,
          riskScore: newRisk
        };
      }
      return d;
    });

    const finalLogs = [newLog, ...logs];
    setEmployees(updatedEmployees);
    setCampaigns(updatedCamps);
    setLogs(finalLogs);
    setDepartments(updatedDepts);
    setTrainingCourses(updatedCourses);

    triggerSave(currentUser, updatedDepts, updatedEmployees, updatedCamps, finalLogs, chatMessages, updatedCourses);
  };

  // 4. Learning actions
  const completeTrainingCourse = (courseId: string) => {
    const updatedCourses = trainingCourses.map(course => {
      if (course.id === courseId) {
        return {
          ...course,
          status: "Completed" as const,
          progress: 100
        };
      }
      return course;
    });

    // Find course details to unlock next or grant badge
    const course = trainingCourses.find(c => c.id === courseId);
    if (!course) return;

    // Update employee records
    const updatedEmployees = employees.map(e => {
      if (currentUser && e.email.toLowerCase() === currentUser.email.toLowerCase()) {
        const currentBadges = [...e.badges];
        if (course.badgeGiven && !currentBadges.includes(course.badgeGiven)) {
          currentBadges.push(course.badgeGiven);
        }
        return {
          ...e,
          completedTrainingCount: e.completedTrainingCount + 1,
          riskScore: Math.max(0, e.riskScore - 20),
          badges: currentBadges
        };
      }
      return e;
    });

    // Unlock next course (e.g. course_phish_basics completes -> unlocks course_credential_safety)
    const finalCourses = updatedCourses.map(c => {
      if (courseId === "course_phish_basics" && c.id === "course_credential_safety" && c.status === "Locked") {
        return { ...c, status: "Assigned" as const };
      }
      if (courseId === "course_credential_safety" && c.id === "course_advanced_scams" && c.status === "Locked") {
        return { ...c, status: "Assigned" as const };
      }
      return c;
    });

    setTrainingCourses(finalCourses);
    setEmployees(updatedEmployees);
    triggerSave(currentUser, departments, updatedEmployees, campaigns, logs, chatMessages, finalCourses);
  };

  // 5. Chat Bot message processing
  const sendChatMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: "msg_" + Date.now(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedChat = [...chatMessages, newMsg];
    setChatMessages(updatedChat);

    // AI logic response builder
    setTimeout(() => {
      let aiText = "I am PhishNet's Human Firewall Intelligence AI. I can analyze employee vulnerabilities and security metrics. Try checking risky departments or campaign summaries.";
      const query = text.toLowerCase();

      if (query.includes("risky departments") || query.includes("show risky departments") || query.includes("department")) {
        const sorted = [...departments].sort((a, b) => b.riskScore - a.riskScore);
        aiText = `Based on current campaign logs, the highest threat vectors belong to: \n\n` +
          sorted.map((d, i) => `${i + 1}. **${d.name}** (Risk Score: ${d.riskScore}/100) — click rate: ${d.emailsSent > 0 ? Math.round((d.linksClicked / d.emailsSent) * 100) : 0}%.`).join("\n") +
          `\n\n**Recommendation**: Deploy adaptive credentials harvesting training to **${sorted[0].name}** immediately.`;
      } else if (query.includes("phishing report") || query.includes("campaign")) {
        const active = campaigns.find(c => c.status === "Active");
        aiText = `### PhishNet AI Security Campaign Summary\n` +
          `- **Total Campaigns**: ${campaigns.length}\n` +
          `- **Active Campaign**: ${active ? active.name : "None"}\n\n` +
          `**Aggregated Metrics Across Campaigns**:\n` +
          `- Total Deliveries: ${campaigns.reduce((acc, c) => acc + c.emailsSent, 0)}\n` +
          `- Total Clicks: ${campaigns.reduce((acc, c) => acc + c.linksClicked, 0)}\n` +
          `- Total Credentials Compromised: ${campaigns.reduce((acc, c) => acc + c.credentialsSubmitted, 0)}\n` +
          `- Total Phish Reported: ${campaigns.reduce((acc, c) => acc + c.emailsReported, 0)}\n\n` +
          `**Resilience Indicator**: The overall organization reporting rate is **${Math.round((campaigns.reduce((acc, c) => acc + c.emailsReported, 0) / Math.max(1, campaigns.reduce((acc, c) => acc + c.emailsSent, 0))) * 100)}%**. We need to push this to 70% to build a solid human firewall.`;
      } else if (query.includes("explain phishing indicators") || query.includes("indicator") || query.includes("explain")) {
        aiText = `Phishing attacks rely on social triggers: \n` +
          `1. **Urgency**: Hackers force fast decisions (e.g. 'Expires in 2 hours').\n` +
          `2. **Authority SPOOF**: impersonating CEOs or IT Admins.\n` +
          `3. **Mismatched Domains**: Clicking 'microsoft.com' but sending you to 'microsoft-alert-portal.com'.\n` +
          `4. **Misleading Call to Actions**: 'Scan QR code' or 'Open attachments' disguised as HR payroll forms.`;
      } else if (query.includes("vulnerable users") || query.includes("predict")) {
        const sortedEmps = [...employees].sort((a, b) => b.riskScore - a.riskScore);
        aiText = `### Vulnerability AI Risk Prediction:\n` +
          `The machine learning models identify these users as highly susceptible to social engineering:\n\n` +
          sortedEmps.slice(0, 3).map((e) => `- **${e.name}** (${e.department}): Risk Score **${e.riskScore}** (Failed simulations: ${e.failedCount}).`).join("\n") +
          `\n\n*Action*: Enable mandatory micro-training assignments for these high-risk candidates.`;
      } else if (query.includes("hello") || query.includes("hi") || query.includes("help")) {
        aiText = `Hello! I am your PhishNet AI Cyber Assistant. Ask me to:\n` +
          `- *"Show risky departments"* to map company vulnerabilities.\n` +
          `- *"Generate phishing report"* to review metrics.\n` +
          `- *"Predict vulnerable users"* to identify high-risk employees.\n` +
          `- *"Explain phishing indicators"* for training insights.`;
      }

      const aiMsg: ChatMessage = {
        id: "msg_ai_" + Date.now(),
        sender: "ai",
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const finalChat = [...updatedChat, aiMsg];
      setChatMessages(finalChat);
      triggerSave(currentUser, departments, employees, campaigns, logs, finalChat);
    }, 800);
  };

  // 6. Maintenance actions
  const runPrototypeDemo = () => {
    const demoCampaignId = "camp_problem_demo";
    const demoCampaignName = "Judge Demo - Enterprise Human Firewall Drill";
    const now = Date.now();
    const targetDepartments = PRE_SEEDED_DEPARTMENTS.map((dept) => dept.name);
    const targetEmployees = PRE_SEEDED_EMPLOYEES.filter((employee) => targetDepartments.includes(employee.department));

    const eventPlan: Array<{
      employeeEmail: string;
      action: SimLog["action"];
      details: string;
      severity: SimLog["severity"];
    }> = [
      { employeeEmail: "dvance@enterprise.com", action: "OPENED", details: "Finance user opened Microsoft 365 verification simulation.", severity: "low" },
      { employeeEmail: "dvance@enterprise.com", action: "CLICKED", details: "Finance user clicked the simulated SSO verification link.", severity: "high" },
      { employeeEmail: "dvance@enterprise.com", action: "CREDENTIALS_SUBMITTED", details: "SAFE SIMULATION: Finance user entered demo credentials on the training portal.", severity: "critical" },
      { employeeEmail: "sconnor@enterprise.com", action: "OPENED", details: "HR user opened payroll change simulation.", severity: "low" },
      { employeeEmail: "sconnor@enterprise.com", action: "CLICKED", details: "HR user clicked payroll verification call-to-action.", severity: "high" },
      { employeeEmail: "sconnor@enterprise.com", action: "CREDENTIALS_SUBMITTED", details: "SAFE SIMULATION: HR user submitted demo form data.", severity: "critical" },
      { employeeEmail: "bwayne@enterprise.com", action: "OPENED", details: "Finance manager opened vendor remittance simulation.", severity: "low" },
      { employeeEmail: "bwayne@enterprise.com", action: "CLICKED", details: "Finance manager clicked payment-change document link.", severity: "high" },
      { employeeEmail: "bwayne@enterprise.com", action: "CREDENTIALS_SUBMITTED", details: "SAFE SIMULATION: Payment-change portal captured only demo telemetry.", severity: "critical" },
      { employeeEmail: "ckent@enterprise.com", action: "OPENED", details: "HR employee opened fake executive request.", severity: "low" },
      { employeeEmail: "ckent@enterprise.com", action: "CLICKED", details: "HR employee clicked suspicious executive communication.", severity: "high" },
      { employeeEmail: "skyle@enterprise.com", action: "OPENED", details: "Sales user opened fake Zoom invite.", severity: "low" },
      { employeeEmail: "skyle@enterprise.com", action: "CLICKED", details: "Sales user clicked fake meeting lobby link.", severity: "high" },
      { employeeEmail: "jconnor@enterprise.com", action: "REPORTED", details: "Engineering user reported the suspicious SSO email.", severity: "low" },
      { employeeEmail: "tstark@enterprise.com", action: "REPORTED", details: "Engineering user reported MFA fatigue simulation before clicking.", severity: "low" },
      { employeeEmail: "gstacy@enterprise.com", action: "REPORTED", details: "Engineering user reported QR phishing simulation from the mailbox.", severity: "low" },
      { employeeEmail: "dprince@enterprise.com", action: "OPENED", details: "Operations user opened the simulated invoice message but did not click.", severity: "low" }
    ];

    const deliveryLogs: SimLog[] = targetEmployees.map((employee, index) => ({
      id: `log_demo_delivered_${employee.id}_${now}`,
      timestamp: new Date(now + index * 1000).toISOString(),
      campaignName: demoCampaignName,
      employeeName: employee.name,
      employeeEmail: employee.email,
      department: employee.department,
      action: "DELIVERED",
      details: `Judge demo payload delivered safely to ${employee.email}`,
      severity: "info"
    }));

    const actionLogs: SimLog[] = eventPlan.map((event, index) => {
      const employee = PRE_SEEDED_EMPLOYEES.find((candidate) => candidate.email === event.employeeEmail);

      return {
        id: `log_demo_action_${index}_${now}`,
        timestamp: new Date(now + (targetEmployees.length + index + 1) * 1000).toISOString(),
        campaignName: demoCampaignName,
        employeeName: employee?.name || "Unknown Employee",
        employeeEmail: event.employeeEmail,
        department: employee?.department || "Unknown",
        action: event.action,
        details: event.details,
        severity: event.severity
      };
    });

    const compromisedEmails = new Set(["dvance@enterprise.com", "sconnor@enterprise.com", "bwayne@enterprise.com"]);
    const clickedOnlyEmails = new Set(["ckent@enterprise.com", "skyle@enterprise.com"]);
    const reporterEmails = new Set(["jconnor@enterprise.com", "tstark@enterprise.com", "gstacy@enterprise.com"]);

    const updatedEmployees = PRE_SEEDED_EMPLOYEES.map((employee) => {
      if (compromisedEmails.has(employee.email)) {
        return {
          ...employee,
          riskScore: Math.min(100, Math.max(employee.riskScore + 18, 90)),
          failedCount: employee.failedCount + 2
        };
      }

      if (clickedOnlyEmails.has(employee.email)) {
        return {
          ...employee,
          riskScore: Math.min(100, employee.riskScore + 20),
          failedCount: employee.failedCount + 1
        };
      }

      if (reporterEmails.has(employee.email)) {
        const badges = Array.from(new Set([...employee.badges, "Phish Detector", "Human Firewall"]));

        return {
          ...employee,
          riskScore: Math.max(5, employee.riskScore - 15),
          passedCount: employee.passedCount + 1,
          badges
        };
      }

      return employee;
    });

    const updatedDepartments = PRE_SEEDED_DEPARTMENTS.map((department) => {
      const deptEmployees = targetEmployees.filter((employee) => employee.department === department.name);
      const deptEvents = eventPlan.filter((event) => {
        const employee = PRE_SEEDED_EMPLOYEES.find((candidate) => candidate.email === event.employeeEmail);
        return employee?.department === department.name;
      });

      const emailsSent = department.emailsSent + deptEmployees.length;
      const emailsOpened = department.emailsOpened + deptEvents.filter((event) => event.action === "OPENED").length;
      const linksClicked = department.linksClicked + deptEvents.filter((event) => event.action === "CLICKED").length;
      const credentialsSubmitted = department.credentialsSubmitted + deptEvents.filter((event) => event.action === "CREDENTIALS_SUBMITTED").length;
      const emailsReported = department.emailsReported + deptEvents.filter((event) => event.action === "REPORTED").length;
      const clickRatio = linksClicked / Math.max(1, emailsSent);
      const submitRatio = credentialsSubmitted / Math.max(1, emailsSent);
      const reportRatio = emailsReported / Math.max(1, emailsSent);
      const riskScore = Math.max(8, Math.min(100, Math.round(25 + clickRatio * 60 + submitRatio * 90 - reportRatio * 35)));

      return {
        ...department,
        emailsSent,
        emailsOpened,
        linksClicked,
        credentialsSubmitted,
        emailsReported,
        riskScore
      };
    });

    const demoCampaign: Campaign = {
      id: demoCampaignId,
      name: demoCampaignName,
      status: "Active",
      templateId: "tpl_qr",
      targetDepartments,
      emailsSent: targetEmployees.length,
      emailsOpened: eventPlan.filter((event) => event.action === "OPENED").length,
      linksClicked: eventPlan.filter((event) => event.action === "CLICKED").length,
      credentialsSubmitted: eventPlan.filter((event) => event.action === "CREDENTIALS_SUBMITTED").length,
      emailsReported: eventPlan.filter((event) => event.action === "REPORTED").length,
      createdAt: new Date(now).toISOString()
    };

    const updatedCampaigns: Campaign[] = [
      demoCampaign,
      ...PRE_SEEDED_CAMPAIGNS.map((campaign) => ({ ...campaign, status: "Completed" as const }))
    ];

    const demoLogs = [...deliveryLogs, ...actionLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const updatedLogs = [...demoLogs, ...PRE_SEEDED_LOGS];

    const updatedCourses = PRE_SEEDED_COURSES.map((course) => {
      if (course.id === "course_phish_basics" || course.id === "course_credential_safety" || course.id === "course_advanced_scams") {
        return { ...course, status: "Assigned" as const, progress: Math.max(course.progress, 35) };
      }

      return course;
    });

    const updatedChat: ChatMessage[] = [
      {
        id: `msg_demo_ai_${now}`,
        sender: "ai",
        text: "### Executive Demo Brief\nThe judge demo is live. PhishNet AI launched a safe enterprise-wide simulation, captured employee behavior, elevated three users into critical risk, rewarded three reporters, and assigned adaptive training automatically.\n\n**Recommended next step**: open Risk Intelligence, Awareness, AI Cyber Assistant, and Reports to show the full loop.",
        timestamp: new Date(now).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ];

    setDepartments(updatedDepartments);
    setEmployees(updatedEmployees);
    setCampaigns(updatedCampaigns);
    setLogs(updatedLogs);
    setTrainingCourses(updatedCourses);
    setChatMessages(updatedChat);
    setActiveCampaignId(demoCampaignId);

    triggerSave(currentUser, updatedDepartments, updatedEmployees, updatedCampaigns, updatedLogs, updatedChat, updatedCourses, demoCampaignId);
  };

  const clearLogs = () => {
    setLogs([]);
    triggerSave(currentUser, departments, employees, campaigns, []);
  };

  const resetAllData = () => {
    setCurrentUser(null);
    setDepartments(PRE_SEEDED_DEPARTMENTS);
    setEmployees(PRE_SEEDED_EMPLOYEES);
    setTemplates(PRE_SEEDED_TEMPLATES);
    setCampaigns(PRE_SEEDED_CAMPAIGNS);
    setLogs(PRE_SEEDED_LOGS);
    setChatMessages([]);
    setTrainingCourses(PRE_SEEDED_COURSES);
    setActiveCampaignId(null);

    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  };

  // Active Background Simulation Ticker Loop
  // Generates randomized user interaction logs every 15 seconds if a campaign is Active!
  useEffect(() => {
    const timer = setInterval(() => {
      // Find active campaign
      const activeCamp = campaigns.find(c => c.status === "Active");
      if (!activeCamp) return;

      // Filter employees targeted by this campaign
      const targetedEmps = employees.filter(e => activeCamp.targetDepartments.includes(e.department));
      if (targetedEmps.length === 0) return;

      // Select a random targeted employee
      const randomEmp = targetedEmps[Math.floor(Math.random() * targetedEmps.length)];

      // Generate a random roll to decide what action they take
      const roll = Math.random();

      // Determine action based on employee parameters
      let action: "OPENED" | "CLICKED" | "CREDENTIALS_SUBMITTED" | "REPORTED" | null = null;
      let details = "";
      let severity: SimLog["severity"] = "info";

      // Check if they already failed/reported in logs to prevent infinite loop of the same actions
      const empLogs = logs.filter(l => l.employeeEmail === randomEmp.email && l.campaignName === activeCamp.name);
      const isCompromised = empLogs.some(l => l.action === "CREDENTIALS_SUBMITTED");
      const isClicked = empLogs.some(l => l.action === "CLICKED");
      const isOpened = empLogs.some(l => l.action === "OPENED");
      const isReported = empLogs.some(l => l.action === "REPORTED");

      if (isReported || isCompromised) {
        // Employee has already concluded their actions for this campaign, do nothing
        return;
      }

      if (!isOpened) {
        // Roll for open
        action = "OPENED";
        details = `Simulated campaign email opened by ${randomEmp.name} (${randomEmp.department})`;
        severity = "low";
      } else if (!isClicked) {
        // Roll for click
        if (roll < randomEmp.clickProbability) {
          action = "CLICKED";
          details = `WARNING: ${randomEmp.name} clicked simulation link in email`;
          severity = "high";
        } else if (roll > (1 - randomEmp.reportingProbability)) {
          action = "REPORTED";
          details = `SUCCESS: ${randomEmp.name} correctly flagged and reported the suspicious mail`;
          severity = "low";
        }
      } else if (!isCompromised) {
        // Roll for credential submit
        // If they click, they have a high chance of submitting credentials unless they are tech-savvy
        if (roll < (randomEmp.vulnerabilityFactor * 0.9)) {
          action = "CREDENTIALS_SUBMITTED";
          details = `EXPLOIT: ${randomEmp.name} submitted organization login details in verification form`;
          severity = "critical";
        }
      }

      if (!action) return;

      // Apply updates to state
      const newLog: SimLog = {
        id: "log_sim_" + Date.now(),
        timestamp: new Date().toISOString(),
        campaignName: activeCamp.name,
        employeeName: randomEmp.name,
        employeeEmail: randomEmp.email,
        department: randomEmp.department,
        action,
        details,
        severity
      };

      // Create new list of logs
      const updatedLogs = [newLog, ...logs];

      // Update Employee risk factor based on action
      const updatedEmployees = employees.map(e => {
        if (e.id === randomEmp.id) {
          let scoreDiff = 0;
          let passedInc = 0;
          let failedInc = 0;
          if (action === "REPORTED") {
            scoreDiff = -15;
            passedInc = 1;
          }
          if (action === "CLICKED") {
            scoreDiff = 20;
            failedInc = 1;
          }
          if (action === "CREDENTIALS_SUBMITTED") {
            scoreDiff = 40;
          }

          const newScore = Math.max(5, Math.min(100, e.riskScore + scoreDiff));
          return {
            ...e,
            riskScore: newScore,
            passedCount: e.passedCount + passedInc,
            failedCount: e.failedCount + failedInc
          };
        }
        return e;
      });

      // Update campaigns stats
      const updatedCamps = campaigns.map(c => {
        if (c.id === activeCamp.id) {
          return {
            ...c,
            emailsOpened: action === "OPENED" ? c.emailsOpened + 1 : c.emailsOpened,
            linksClicked: action === "CLICKED" ? c.linksClicked + 1 : c.linksClicked,
            credentialsSubmitted: action === "CREDENTIALS_SUBMITTED" ? c.credentialsSubmitted + 1 : c.credentialsSubmitted,
            emailsReported: action === "REPORTED" ? c.emailsReported + 1 : c.emailsReported
          };
        }
        return c;
      });

      // Update Departments stats
      const updatedDepts = departments.map(d => {
        if (d.name === randomEmp.department) {
          let op = 0, cl = 0, sub = 0, rep = 0;
          if (action === "OPENED") op = 1;
          if (action === "CLICKED") cl = 1;
          if (action === "CREDENTIALS_SUBMITTED") sub = 1;
          if (action === "REPORTED") rep = 1;

          const clicks = d.linksClicked + cl;
          const submits = d.credentialsSubmitted + sub;
          const sents = d.emailsSent;
          const clickRatio = sents > 0 ? clicks / sents : 0.5;
          const submitRatio = sents > 0 ? submits / sents : 0.3;
          const newRisk = Math.min(100, Math.round((clickRatio * 40) + (submitRatio * 60) + 10));

          return {
            ...d,
            emailsOpened: d.emailsOpened + op,
            linksClicked: clicks,
            credentialsSubmitted: submits,
            emailsReported: d.emailsReported + rep,
            riskScore: newRisk
          };
        }
        return d;
      });

      // If credentials submitted, auto assign training
      let updatedCourses = trainingCourses;
      if (action === "CREDENTIALS_SUBMITTED") {
        updatedCourses = trainingCourses.map(course => {
          if (course.id === "course_phish_basics" && course.status === "Locked") {
            return { ...course, status: "Assigned" as const };
          }
          return course;
        });
      }

      setLogs(updatedLogs);
      setEmployees(updatedEmployees);
      setCampaigns(updatedCamps);
      setDepartments(updatedDepts);
      setTrainingCourses(updatedCourses);

      triggerSave(currentUser, updatedDepts, updatedEmployees, updatedCamps, updatedLogs, chatMessages, updatedCourses);
    }, 9000); // simulation runs logs ticker updates every 9s

    return () => clearInterval(timer);
  // triggerSave is intentionally read from the latest render through the simulation tick closure.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaigns, employees, logs, departments, trainingCourses, chatMessages, currentUser]);

  return (
    <SimContext.Provider
      value={{
        currentUser,
        departments,
        employees,
        templates,
        campaigns,
        logs,
        chatMessages,
        trainingCourses,
        activeCampaignId,
        loginUser,
        logoutUser,
        verifyMfa,
        createCampaign,
        launchCampaign,
        reportPhish,
        clickPhishLink,
        submitCredentials,
        completeTrainingCourse,
        sendChatMessage,
        runPrototypeDemo,
        clearLogs,
        resetAllData
      }}
    >
      {children}
    </SimContext.Provider>
  );
};

export const useSim = () => {
  const context = useContext(SimContext);
  if (context === undefined) {
    throw new Error("useSim must be used within a SimProvider");
  }
  return context;
};
