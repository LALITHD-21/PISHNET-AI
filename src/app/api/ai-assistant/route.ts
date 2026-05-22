import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AssistantContext = {
  campaigns?: unknown[];
  departments?: unknown[];
  employees?: unknown[];
  logs?: unknown[];
  trainingCourses?: unknown[];
  stats?: Record<string, unknown>;
};

type OpenAITextContent = {
  type?: string;
  text?: string;
  value?: string;
};

type OpenAIOutputItem = {
  content?: OpenAITextContent[];
};

type OpenAIResponsePayload = {
  output_text?: string;
  output?: OpenAIOutputItem[];
  error?: {
    message?: string;
  };
};

function safeOpenAIDiagnostic(status: number) {
  if (status === 401 || status === 403) {
    return "OpenAI authentication failed. Check that OPENAI_API_KEY is valid and available to the running server.";
  }

  if (status === 429) {
    return "OpenAI rate limit or quota was reached. Check billing, project limits, or retry later.";
  }

  if (status >= 500) {
    return "OpenAI service returned a temporary server error. Retry shortly.";
  }

  return `OpenAI request failed with status ${status}.`;
}

function localFallback(message: string, context: AssistantContext) {
  const campaigns = Array.isArray(context.campaigns) ? context.campaigns : [];
  const departments = Array.isArray(context.departments) ? context.departments : [];
  const employees = Array.isArray(context.employees) ? context.employees : [];
  const logs = Array.isArray(context.logs) ? context.logs : [];
  const stats = context.stats || {};

  return [
    "### PhishNet AI Local Analysis",
    `I analyzed your request: **${message}**`,
    "",
    `- Campaigns tracked: **${campaigns.length}**`,
    `- Departments monitored: **${departments.length}**`,
    `- Employee risk profiles: **${employees.length}**`,
    `- Recent threat events: **${logs.length}**`,
    `- Click rate: **${stats.clickRate ?? "N/A"}%**`,
    `- Reporting rate: **${stats.reportingRate ?? "N/A"}%**`,
    `- Critical users: **${stats.criticalUsers ?? "N/A"}**`,
    "",
    "**Recommendation**: prioritize the highest-risk department, assign credential-safety training to users with repeated failures, and export a report after the next campaign cycle.",
    "",
    "_OpenAI is not active for this response, so PhishNet used the built-in local analyzer._"
  ].join("\n");
}

function extractResponseText(payload: OpenAIResponsePayload) {
  if (payload.output_text?.trim()) {
    return payload.output_text.trim();
  }

  const parts = payload.output
    ?.flatMap((item) => item.content || [])
    .map((content) => content.text || content.value || "")
    .filter(Boolean);

  return parts?.join("\n").trim() || "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const context: AssistantContext = body.context || {};

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

    if (!apiKey) {
      return NextResponse.json({
        text: localFallback(message, context),
        provider: "local",
        model: "phishnet-local-analyzer",
        openaiEnabled: false
      });
    }

    const systemPrompt = [
      "You are PhishNet AI, a defensive cybersecurity awareness assistant inside an authorized phishing simulation platform.",
      "Use only safe, defensive, training-oriented guidance.",
      "Do not provide instructions for real credential theft, evasion, malware, unauthorized phishing deployment, or bypassing security controls.",
      "Analyze the supplied organization telemetry and answer with concise markdown.",
      "Do not wrap the answer in code fences.",
      "Prioritize: risky departments, vulnerable users, click/report/submission trends, adaptive training, executive reporting, and secure next actions."
    ].join(" ");

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        instructions: systemPrompt,
        input: [
          {
            role: "user",
            content: [
              `Analyst question: ${message}`,
              "",
              "Current PhishNet telemetry JSON:",
              JSON.stringify(context, null, 2)
            ].join("\n")
          }
        ],
        max_output_tokens: 700
      })
    });

    const payload = (await response.json()) as OpenAIResponsePayload;

    if (!response.ok) {
      return NextResponse.json({
        text: [
          "### PhishNet AI Local Fallback",
          "OpenAI could not complete the request, so I used the built-in analyzer.",
          "",
          localFallback(message, context),
          "",
          `Diagnostic: ${safeOpenAIDiagnostic(response.status)}`
        ].join("\n"),
        provider: "local",
        model: "phishnet-local-analyzer",
        openaiEnabled: false
      });
    }

    const text = extractResponseText(payload);

    return NextResponse.json({
      text: text || localFallback(message, context),
      provider: text ? "openai" : "local",
      model: text ? model : "phishnet-local-analyzer",
      openaiEnabled: Boolean(text)
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown assistant error";

    return NextResponse.json({
      text: `### PhishNet AI Error\nThe assistant route failed safely.\n\nDiagnostic: ${message}`,
      provider: "local",
      model: "error-safe-response",
      openaiEnabled: false
    });
  }
}
