# PhishNet AI - Human Firewall Intelligence Platform

PhishNet AI is a full-stack, enterprise-style cybersecurity awareness platform for safe phishing simulations, human risk scoring, adaptive training, and SOC-level cyber posture monitoring.

The application is designed to look and feel like a premium cybersecurity product: dark SOC dashboard UI, animated threat map, radar scanner, realtime event feed, AI assistant, reports, training portal, simulation lab, and deployment-ready service architecture.

## Important Safety Boundary

PhishNet AI is a controlled awareness-training simulator.

- It does not send real phishing emails.
- It does not collect or store real passwords.
- It does not collect real MFA codes, bank data, gift card codes, or identity documents.
- Fake login pages record only the simulation event, for example `CLICKED` or `CREDENTIALS_SUBMITTED`.
- All phishing examples are for authorized internal security training only.
- In production, all campaigns should be limited to approved company-owned domains and consented users.

## What The App Does

Organizations can use PhishNet AI to:

- Create phishing simulation campaigns.
- Select realistic phishing templates.
- Target departments.
- Launch controlled campaigns.
- Simulate employee email opens, clicks, reports, and credential-submission mistakes.
- Calculate employee and department cyber risk scores.
- Identify risky users and departments.
- Automatically assign training after unsafe behavior.
- Let employees complete quizzes and earn badges.
- Ask an AI cyber assistant for security insights.
- Generate executive reports and export CSV data.
- Monitor everything through a futuristic SOC command center.

## Tech Stack

### Frontend

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide Icons

### Backend Architecture

- Node.js
- Express.js
- Socket.IO
- JWT authentication
- RBAC authorization
- Rate limiting
- Helmet security headers

### AI Layer

- Python FastAPI service
- OpenAI API support
- Local deterministic fallback when no OpenAI key is configured
- Risk scoring endpoint
- Safe phishing-template generation endpoint

### Database

- PostgreSQL
- Prisma schema
- Models for users, departments, campaigns, templates, events, risk scores, training, notifications, and audit logs

### Deployment

- Docker
- Docker Compose
- Vercel-ready frontend
- Railway/Supabase-ready service and database architecture

## Quick Start

Install dependencies and run the frontend demo:

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3001
```

Demo MFA accepts any 6-digit code, such as:

```text
123456
```

## Demo Login Accounts

| Role | Email | Purpose |
| --- | --- | --- |
| Super Admin | `admin@enterprise.com` | Full SOC, campaign, risk, report, and settings access |
| SOC Analyst | `analyst@enterprise.com` | Campaign and threat-intelligence workflow |
| Department Manager | `manager@enterprise.com` | Department-level risk review |
| High-risk Employee | `dvance@enterprise.com` | Employee portal demo with risky behavior |
| Low-risk Employee | `tstark@enterprise.com` | Employee portal demo with strong awareness posture |

## How The Application Works

PhishNet AI has two main experiences:

1. Admin/SOC experience
2. Employee awareness experience

The admin creates and launches campaigns. The employee receives simulated phishing emails in the employee portal. Employee behavior updates the SOC dashboard, risk engine, training system, and reports in real time.

## End-To-End Simulation Flow

1. Admin logs in through `/login`.
2. Admin completes MFA at `/mfa`.
3. Admin opens `/dashboard/campaigns`.
4. Admin creates a campaign by selecting:
   - Campaign name
   - Phishing template
   - Target departments
5. Admin launches the campaign.
6. The app creates simulated delivery logs for employees in the targeted departments.
7. The SOC dashboard starts showing campaign activity.
8. A background simulation ticker creates realistic events every few seconds:
   - Email opened
   - Link clicked
   - Credentials submitted in a safe fake portal
   - Phishing email reported
9. Employee risk scores and department risk scores update.
10. If an employee clicks or submits data, training gets assigned.
11. The employee completes training and quizzes.
12. The employee earns badges and reduces risk.
13. Reports can be exported for leadership.

## Demo Mode

The frontend is fully functional without a live database.

Demo state is stored in:

```text
localStorage
```

This means campaigns, logs, chat history, training progress, and risk scores survive page refreshes during the demo.

The main simulation engine is:

```text
src/context/SimContext.tsx
```

It contains:

- Seeded employees
- Seeded departments
- Seeded phishing templates
- Seeded campaigns
- Seeded logs
- Training courses
- Risk score updates
- Campaign launch logic
- Employee click/report/submit logic
- AI assistant responses
- Realtime simulation ticker

## Application Modules

### 1. Landing Page

Route:

```text
/
```

The landing page presents the product as a premium cybersecurity platform. It includes:

- Animated cyber particles
- Cyber grid background
- Live threat map
- SOC dashboard preview
- Product feature sections
- Call-to-action links for login and employee portal

Main file:

```text
src/app/page.tsx
```

### 2. Authentication System

Routes:

```text
/login
/signup
/forgot-password
/mfa
```

The authentication flow is demo-ready and simulates:

- Login
- Signup
- Password recovery
- MFA verification
- Role selection
- Session persistence through localStorage

Roles:

- Super Admin
- Security Analyst
- Department Manager
- Employee

In demo mode, MFA accepts any 6-digit code.

### 3. SOC Command Center

Route:

```text
/dashboard/soc
```

This is the main security operations dashboard.

It shows:

- Cyber resilience ratio
- Campaign click-through rate
- Credential compromise count
- Reporting rate
- Live threat map
- Realtime cyber radar
- Department posture chart
- Campaign history chart
- Live event ticker

When campaigns are active, widgets update as simulated events are created.

### 4. Campaign Management

Route:

```text
/dashboard/campaigns
```

Admins can:

- Create a phishing campaign
- Select a template
- Select target departments
- Save draft campaigns
- Launch campaigns
- View active campaign performance
- Review historical campaigns

Launching a campaign creates delivery logs for all employees in the selected departments.

### 5. Template Manager And AI Lab

Route:

```text
/dashboard/templates
```

This module contains a library of phishing simulation templates:

- Microsoft 365 login scam
- HR payroll phishing
- Bank verification scam
- Invoice fraud
- QR phishing
- CEO impersonation
- Fake Zoom invite
- Internship scam

It also includes a local AI-style template synthesizer that creates safe demo phishing content with:

- Subject line
- Sender mask
- Email body
- Training indicators
- Simulated cognitive trigger logs

### 6. Human Risk Intelligence

Route:

```text
/dashboard/risk
```

This module tracks employee and department risk.

It analyzes:

- Email opens
- Link clicks
- Simulated credential submissions
- Reports
- Failed simulations
- Passed simulations
- Training completion
- Badges

Risk categories:

- Safe
- Medium Risk
- High Risk
- Critical

The page includes:

- Department risk cards
- Radar chart
- Risk distribution chart
- Sortable employee risk register
- Department filters
- Search

### 7. Analytics Center

Route:

```text
/dashboard/analytics
```

This is the executive analytics layer.

It includes:

- Human firewall index
- Average risk score
- Click-through rate
- Self-report rate
- Campaign performance fabric
- Risk classification mix
- Event velocity by time window
- Department behavior heatmap
- AI-generated executive observations

### 8. Awareness Training

Routes:

```text
/dashboard/training
/portal
```

Admins can view training performance from the dashboard.

Employees complete assigned courses in the employee portal.

Training features:

- Course catalog
- Assigned/locked/completed states
- Lessons
- Quizzes
- Passing score logic
- Badge rewards
- Leaderboard
- Risk reduction after completion

Example courses:

- Introduction to Phishing and Social Engineering
- Credential Harvesting Protection
- Advanced Scams: QR Codes and MFA Fatigue

### 9. AI Cyber Assistant

Route:

```text
/dashboard/ai-coach
```

The AI assistant analyzes current simulation data and answers commands such as:

- `Show risky departments`
- `Analyze phishing trends`
- `Generate phishing report`
- `Predict vulnerable users`
- `Explain phishing indicators`

In demo mode, responses are generated locally from current app state.

The optional FastAPI service can also support AI template generation and risk scoring.

### 10. Advanced Phishing Lab

Route:

```text
/dashboard/lab
```

This module safely demonstrates modern attack patterns:

- MFA fatigue attack
- QR phishing attack
- Deepfake voice phishing
- Malicious attachment sandbox analysis

Each lab is interactive and educational. It explains what the attack would look like and how employees should respond.

### 11. Reports Center

Route:

```text
/dashboard/reports
```

Reports include:

- Executive security briefing
- Campaign analytics
- Employee risk profiles
- Department risk assessment
- Threat event logs
- Top risky employees
- Department risk ranking

Exports:

- CSV downloads
- Browser print support for PDF-style reports

### 12. Employee Portal

Route:

```text
/portal
```

Employees can:

- View simulated phishing emails
- Open a simulation email
- Report the email
- Click the simulated payload
- See safe fake login pages
- Learn which red flags they missed
- Complete assigned training
- Earn badges
- View leaderboard

If the employee reports the message, their risk goes down.

If the employee clicks or submits data in a fake portal, their risk goes up and training gets assigned.

### 13. Safe Fake Login Portals

Route:

```text
/portal/login-simulation
```

These portals simulate realistic phishing landing pages but include safety boundaries.

They show:

- Microsoft-style login flow
- HR payroll form
- Executive directive portal
- Training simulation warning banner
- Post-submission education screen

The education screen explains:

- What attack type occurred
- Which red flags were missed
- What a real attacker could have gained
- Which remediation training was assigned

No actual secrets are stored.

### 14. Settings And Profile

Routes:

```text
/dashboard/settings
/dashboard/profile
```

Settings includes:

- MFA enforcement toggle
- RBAC enforcement toggle
- Safe simulation guardrails
- Audit streaming
- Adaptive training
- Executive digest
- Webhook integration readiness
- Approved-domain lock
- Audit retention settings
- Critical risk threshold

Profile includes:

- Operator identity
- Current role
- MFA status
- RBAC permissions
- Security telemetry
- Employee risk profile when applicable

## Realtime Behavior

Realtime behavior happens in two ways.

### Frontend Demo Realtime

The frontend simulation engine runs a background timer. When a campaign is active, it randomly generates employee behavior based on each employee profile:

- Some employees are more likely to click.
- Some employees are more likely to report.
- Some employees have higher vulnerability factors.

This drives:

- SOC dashboard updates
- Threat map animations
- Radar points
- Event feed updates
- Risk score changes
- Campaign metric changes

### Backend Realtime Architecture

The optional Express backend includes Socket.IO.

It can emit:

- `simulation:event`
- `soc:event`
- Campaign room events

Backend file:

```text
server/src/index.ts
```

## Risk Scoring Logic

Employee risk increases when:

- They click simulated phishing links.
- They submit data into a fake portal.
- They repeatedly fail simulations.

Employee risk decreases when:

- They report phishing emails.
- They complete training.
- They earn awareness badges.

Department risk is recalculated using:

- Click ratio
- Submission ratio
- Report ratio
- Total simulation volume

The optional AI service includes a `/risk-score` endpoint for production-style scoring.

## AI Service

The FastAPI service is located at:

```text
ai-service/main.py
```

It provides:

- `GET /health`
- `POST /risk-score`
- `POST /generate-template`

If `OPENAI_API_KEY` is configured, the service can call OpenAI.

If no key is configured, it still works with deterministic fallback responses.

This makes the project demo-friendly and deployment-friendly.

## Express API

The Express API is located at:

```text
server/src/index.ts
```

It provides:

- `GET /health`
- `POST /auth/login`
- `GET /campaigns`
- `POST /campaigns`
- `POST /campaigns/:id/launch`
- `POST /events`
- `GET /analytics/overview`

Security features:

- JWT signing
- RBAC middleware
- Rate limiting
- Helmet headers
- CORS configuration
- Sanitized event storage
- IP hashing design
- No secret capture

## Database Design

The Prisma schema is located at:

```text
prisma/schema.prisma
```

It includes models for:

- `Organization`
- `User`
- `Department`
- `Campaign`
- `CampaignDepartment`
- `PhishingTemplate`
- `EmailLog`
- `ClickEvent`
- `CredentialAttempt`
- `RiskScore`
- `AnalyticsSnapshot`
- `TrainingModule`
- `UserTraining`
- `Notification`
- `AuditLog`

Credential attempts store only that a simulated submission occurred. They do not store submitted form values.

Generate Prisma client:

```bash
npm run prisma:generate
```

## Deployment With Docker

Copy environment variables:

```bash
cp .env.example .env
```

Start all services:

```bash
docker compose up --build
```

Services:

| Service | URL |
| --- | --- |
| Web frontend | `http://localhost:3001` |
| Express API | `http://localhost:4000/health` |
| FastAPI AI service | `http://localhost:8000/health` |
| PostgreSQL | `localhost:5432` |

## Manual Service Startup

Frontend:

```bash
npm run dev
```

Express API:

```bash
cd server
npm install
npm run dev
```

AI service:

```bash
cd ai-service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

## Project Structure

```text
phishnet-app/
  src/
    app/
      page.tsx
      login/
      signup/
      forgot-password/
      mfa/
      portal/
      dashboard/
        soc/
        campaigns/
        templates/
        risk/
        analytics/
        training/
        ai-coach/
        lab/
        reports/
        profile/
        settings/
    components/
      ChartMount.tsx
      CyberParticles.tsx
      DashboardCard.tsx
      LiveThreatMap.tsx
      RadarScan.tsx
    context/
      SimContext.tsx
  server/
    src/index.ts
  ai-service/
    main.py
  prisma/
    schema.prisma
  docker-compose.yml
  Dockerfile
  README.md
```

## Recommended Judge Demo Script

1. Open the landing page.
2. Show the animated threat map and premium SOC styling.
3. Login as `admin@enterprise.com`.
4. Enter any 6-digit MFA code.
5. Show `/dashboard/soc`.
6. Open `/dashboard/campaigns`.
7. Create a campaign and select all departments.
8. Launch it.
9. Return to the SOC dashboard and show live metrics.
10. Open `/dashboard/analytics`.
11. Ask the AI assistant: `Show risky departments`.
12. Login as `dvance@enterprise.com` with role `Employee`.
13. Open the simulated mailbox.
14. Click the simulated phishing payload.
15. Show the safe fake login page with the training banner.
16. Submit demo input.
17. Show the education screen explaining missed red flags.
18. Complete training in the employee portal.
19. Export a CSV report from `/dashboard/reports`.
20. Show `/dashboard/settings` and explain enterprise readiness.

## Build Verification

Run:

```bash
npm run lint
npm run build
python -m py_compile ai-service\main.py
```

Current verified status:

- Frontend lint passes.
- Production Next.js build passes.
- FastAPI Python file compiles.
- Browser smoke test completed for landing, login, MFA, SOC dashboard, analytics, campaign launch, AI assistant, employee portal, and safe simulation portal.

## Environment Variables

Example file:

```text
.env.example
```

Important variables:

```text
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_AI_URL=http://localhost:8000
API_PORT=4000
CORS_ORIGIN=http://localhost:3001
JWT_SECRET=replace-with-a-strong-random-secret
IP_HASH_SALT=replace-with-a-strong-random-salt
DATABASE_URL=postgresql://phishnet:phishnet@localhost:5432/phishnet
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
```

## Production Notes

Before real deployment:

- Replace demo authentication with a real identity provider.
- Enforce real password hashing and MFA verification.
- Connect Prisma to production PostgreSQL.
- Restrict campaigns to verified internal domains.
- Add tenant isolation tests.
- Add audit-log immutability.
- Add email provider integration only for authorized internal simulation delivery.
- Run security testing for XSS, CSRF, authorization bypass, and rate-limit behavior.
- Add monitoring, alerting, and backups.

## Summary

PhishNet AI is a safe, visually polished, end-to-end cybersecurity awareness platform. It demonstrates how an organization can simulate phishing attacks, analyze human behavior, identify risky departments, assign adaptive training, and report cyber posture through a premium realtime SOC dashboard.

