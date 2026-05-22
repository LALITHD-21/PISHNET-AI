import os
from typing import Literal

from dotenv import load_dotenv
from fastapi import FastAPI
from openai import OpenAI
from pydantic import BaseModel, Field

load_dotenv()

app = FastAPI(
    title="PhishNet AI Risk and Content Service",
    version="0.1.0",
    description="Safe AI assistance for authorized phishing-simulation training."
)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY")) if os.getenv("OPENAI_API_KEY") else None


class RiskRequest(BaseModel):
    opens: int = 0
    clicks: int = 0
    credential_submissions: int = 0
    reports: int = 0
    failed_count: int = 0
    completed_training: int = 0


class RiskResponse(BaseModel):
    score: int
    category: Literal["SAFE", "MEDIUM", "HIGH", "CRITICAL"]
    reasons: list[str]
    recommendation: str


class TemplateRequest(BaseModel):
    audience: str = Field(min_length=2, max_length=80)
    scenario: str = Field(min_length=2, max_length=80)
    difficulty: Literal["Easy", "Medium", "Hard", "Expert"] = "Medium"


class TemplateResponse(BaseModel):
    subject: str
    sender: str
    body: str
    indicators: list[str]
    safety_note: str


def category(score: int) -> str:
    if score >= 85:
        return "CRITICAL"
    if score >= 65:
        return "HIGH"
    if score >= 35:
        return "MEDIUM"
    return "SAFE"


@app.get("/health")
def health():
    return {"ok": True, "service": "phishnet-ai", "openai_enabled": client is not None}


@app.post("/risk-score", response_model=RiskResponse)
def score_risk(payload: RiskRequest):
    score = 12
    score += min(24, payload.opens * 2)
    score += min(30, payload.clicks * 8)
    score += min(36, payload.credential_submissions * 18)
    score += min(20, payload.failed_count * 4)
    score -= min(28, payload.reports * 7)
    score -= min(24, payload.completed_training * 8)
    score = max(0, min(100, score))

    reasons: list[str] = []
    if payload.clicks:
        reasons.append("Clicked simulation links, increasing susceptibility score.")
    if payload.credential_submissions:
        reasons.append("Submitted data in a simulated portal; assign remediation immediately.")
    if payload.reports:
        reasons.append("Filed phishing reports, reducing risk.")
    if payload.completed_training:
        reasons.append("Completed training modules, improving resilience.")
    if not reasons:
        reasons.append("Insufficient interaction history; keep monitoring.")

    cat = category(score)
    recommendation = {
        "SAFE": "Maintain quarterly simulations and reward reporting behavior.",
        "MEDIUM": "Assign targeted micro-learning and retest within 30 days.",
        "HIGH": "Enroll in credential-safety training and monitor next campaign closely.",
        "CRITICAL": "Escalate to manager, require immediate training, and validate MFA posture."
    }[cat]

    return RiskResponse(score=score, category=cat, reasons=reasons, recommendation=recommendation)


@app.post("/generate-template", response_model=TemplateResponse)
def generate_template(payload: TemplateRequest):
    safety_note = (
        "Authorized training simulation only. Use approved domains, do not send externally, "
        "and never collect real passwords, tokens, banking details, or identity documents."
    )

    if client:
        prompt = (
            "Create a safe phishing-awareness simulation email for internal training. "
            "Use a placeholder simulation link only, include realistic but non-deployable wording, "
            "and include indicators defenders should notice.\n"
            f"Audience: {payload.audience}\nScenario: {payload.scenario}\nDifficulty: {payload.difficulty}"
        )
        response = client.responses.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4.1-mini"),
            input=prompt,
            max_output_tokens=650,
        )
        body = response.output_text.strip()
        return TemplateResponse(
            subject=f"Training simulation: {payload.scenario}",
            sender="simulation@phishnet.training.invalid",
            body=body,
            indicators=[
                "Verify sender domain against approved corporate systems.",
                "Inspect urgency and authority pressure before acting.",
                "Navigate from trusted bookmarks instead of email buttons."
            ],
            safety_note=safety_note,
        )

    subject = f"Training simulation: {payload.scenario} review required"
    body = (
        f"Hello {payload.audience},\n\n"
        f"This controlled awareness exercise simulates a {payload.scenario} request. "
        "The call to action uses a placeholder {{SIM_LINK}} and is not suitable for real delivery. "
        "Employees should pause, inspect the sender, verify the request in approved systems, and report suspicious messages.\n\n"
        "Simulation CTA: {{SIM_LINK}}\n"
    )
    return TemplateResponse(
        subject=subject,
        sender="simulation@phishnet.training.invalid",
        body=body,
        indicators=[
            "Sender uses a training-only invalid domain.",
            "The message asks for fast action around a sensitive workflow.",
            "The link is a placeholder and should be replaced only by the safe simulation router."
        ],
        safety_note=safety_note,
    )
