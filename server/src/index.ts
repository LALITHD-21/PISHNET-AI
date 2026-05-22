import "dotenv/config";
import crypto from "node:crypto";
import http from "node:http";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { Server } from "socket.io";
import { z } from "zod";

type Role = "SUPER_ADMIN" | "SOC_ANALYST" | "DEPARTMENT_MANAGER" | "EMPLOYEE";
type CampaignStatus = "DRAFT" | "ACTIVE" | "COMPLETED";
type SimAction = "DELIVERED" | "OPENED" | "CLICKED" | "CREDENTIALS_SUBMITTED" | "REPORTED";

interface AuthUser {
  sub: string;
  email: string;
  role: Role;
  organizationId: string;
}

interface Campaign {
  id: string;
  organizationId: string;
  name: string;
  status: CampaignStatus;
  templateId: string;
  targetDepartments: string[];
  emailsSent: number;
  emailsOpened: number;
  linksClicked: number;
  credentialsSubmitted: number;
  emailsReported: number;
  createdAt: string;
}

interface SimEvent {
  id: string;
  campaignId: string;
  campaignName: string;
  employeeEmail: string;
  department: string;
  action: SimAction;
  severity: "info" | "low" | "medium" | "high" | "critical";
  createdAt: string;
}

const app = express();
const server = http.createServer(app);
const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:3001";
const jwtSecret = process.env.JWT_SECRET || "phishnet-dev-secret-change-me";

const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    credentials: true
  }
});

const campaigns = new Map<string, Campaign>();
const events: SimEvent[] = [];

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json({ limit: "128kb" }));
app.use(rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: true, legacyHeaders: false }));

function sign(user: AuthUser) {
  return jwt.sign(user, jwtSecret, { expiresIn: "8h", audience: "phishnet-api", issuer: "phishnet-ai" });
}

function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    res.status(401).json({ error: "Missing bearer token" });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret, { audience: "phishnet-api", issuer: "phishnet-ai" }) as AuthUser;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: "Insufficient role permissions" });
      return;
    }
    next();
  };
}

function hashIp(req: Request) {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  return crypto.createHash("sha256").update(`${process.env.IP_HASH_SALT || "dev"}:${ip}`).digest("hex");
}

function emitEvent(event: SimEvent) {
  events.unshift(event);
  io.to(event.campaignId).emit("simulation:event", event);
  io.emit("soc:event", event);
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

const loginSchema = z.object({
  email: z.string().email(),
  role: z.enum(["SUPER_ADMIN", "SOC_ANALYST", "DEPARTMENT_MANAGER", "EMPLOYEE"]).default("SUPER_ADMIN"),
  organizationId: z.string().default("demo-org")
});

const campaignSchema = z.object({
  name: z.string().min(3).max(120),
  templateId: z.string().min(3),
  targetDepartments: z.array(z.string().min(2)).min(1)
});

const eventSchema = z.object({
  campaignId: z.string(),
  employeeEmail: z.string().email(),
  department: z.string().min(2),
  action: z.enum(["OPENED", "CLICKED", "CREDENTIALS_SUBMITTED", "REPORTED"])
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "phishnet-api", realtime: true, safeSimulation: true });
});

app.post("/auth/login", (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const user: AuthUser = {
    sub: crypto.randomUUID(),
    email: parsed.data.email,
    role: parsed.data.role,
    organizationId: parsed.data.organizationId
  };

  res.json({
    accessToken: sign(user),
    user,
    mfaRequired: true,
    note: "Demo login. Production should validate password hash, MFA, device posture, and IdP claims."
  });
});

app.get("/campaigns", authenticate, (req, res) => {
  const list = Array.from(campaigns.values()).filter((campaign) => campaign.organizationId === req.user?.organizationId);
  res.json({ campaigns: list });
});

app.post("/campaigns", authenticate, requireRole("SUPER_ADMIN", "SOC_ANALYST"), (req, res) => {
  const parsed = campaignSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const campaign: Campaign = {
    id: crypto.randomUUID(),
    organizationId: req.user!.organizationId,
    status: "DRAFT",
    emailsSent: 0,
    emailsOpened: 0,
    linksClicked: 0,
    credentialsSubmitted: 0,
    emailsReported: 0,
    createdAt: new Date().toISOString(),
    ...parsed.data
  };
  campaigns.set(campaign.id, campaign);
  res.status(201).json({ campaign });
});

app.post("/campaigns/:id/launch", authenticate, requireRole("SUPER_ADMIN", "SOC_ANALYST"), (req, res) => {
  const campaign = campaigns.get(req.params.id);
  if (!campaign || campaign.organizationId !== req.user!.organizationId) {
    res.status(404).json({ error: "Campaign not found" });
    return;
  }

  campaign.status = "ACTIVE";
  campaign.emailsSent = Math.max(1, campaign.targetDepartments.length * 8);
  campaigns.set(campaign.id, campaign);

  campaign.targetDepartments.forEach((department) => {
    emitEvent({
      id: crypto.randomUUID(),
      campaignId: campaign.id,
      campaignName: campaign.name,
      employeeEmail: `sample.${department.toLowerCase().replace(/\W+/g, ".")}@enterprise.example`,
      department,
      action: "DELIVERED",
      severity: "info",
      createdAt: new Date().toISOString()
    });
  });

  res.json({ campaign, safeDelivery: "No external email was sent. This API emits sanitized simulation events only." });
});

app.post("/events", authenticate, (req, res) => {
  const parsed = eventSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const campaign = campaigns.get(parsed.data.campaignId);
  if (!campaign || campaign.organizationId !== req.user!.organizationId) {
    res.status(404).json({ error: "Campaign not found" });
    return;
  }

  if (parsed.data.action === "OPENED") campaign.emailsOpened += 1;
  if (parsed.data.action === "CLICKED") campaign.linksClicked += 1;
  if (parsed.data.action === "CREDENTIALS_SUBMITTED") campaign.credentialsSubmitted += 1;
  if (parsed.data.action === "REPORTED") campaign.emailsReported += 1;

  const event: SimEvent = {
    id: crypto.randomUUID(),
    campaignId: campaign.id,
    campaignName: campaign.name,
    employeeEmail: parsed.data.employeeEmail,
    department: parsed.data.department,
    action: parsed.data.action,
    severity: parsed.data.action === "CREDENTIALS_SUBMITTED" ? "critical" : parsed.data.action === "CLICKED" ? "high" : "low",
    createdAt: new Date().toISOString()
  };

  // Store only the fact of a simulated event. Never store submitted form values.
  void hashIp(req);
  emitEvent(event);
  res.status(201).json({ event, secretStorage: "disabled" });
});

app.get("/analytics/overview", authenticate, (req, res) => {
  const orgCampaigns = Array.from(campaigns.values()).filter((campaign) => campaign.organizationId === req.user!.organizationId);
  const totals = orgCampaigns.reduce((acc, campaign) => ({
    sent: acc.sent + campaign.emailsSent,
    opened: acc.opened + campaign.emailsOpened,
    clicked: acc.clicked + campaign.linksClicked,
    submitted: acc.submitted + campaign.credentialsSubmitted,
    reported: acc.reported + campaign.emailsReported
  }), { sent: 0, opened: 0, clicked: 0, submitted: 0, reported: 0 });

  const clickRate = totals.sent ? Math.round((totals.clicked / totals.sent) * 100) : 0;
  const reportRate = totals.sent ? Math.round((totals.reported / totals.sent) * 100) : 0;
  const resilience = Math.max(0, Math.min(100, 100 - Math.round(clickRate * 0.45 + (totals.submitted / Math.max(1, totals.sent)) * 80 - reportRate * 0.25)));

  res.json({ totals, clickRate, reportRate, resilience, eventCount: events.length });
});

io.on("connection", (socket) => {
  socket.emit("soc:hello", { safeSimulation: true, connectedAt: new Date().toISOString() });
  socket.on("campaign:join", (campaignId: string) => socket.join(campaignId));
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  res.status(500).json({ error: "Internal server error" });
});

const port = Number(process.env.API_PORT || 4000);
server.listen(port, () => {
  console.log(`PhishNet API listening on http://localhost:${port}`);
});
