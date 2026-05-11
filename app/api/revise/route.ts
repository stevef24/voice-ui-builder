import { NextResponse } from "next/server";
import { mockIntent } from "@/lib/mock-data";
import { shouldUseMock } from "@/lib/server/mock-responses";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { revision?: string; transcript?: string };
  const revision = body.revision?.trim() || "make it more premium and slower";

  if (shouldUseMock()) {
    return NextResponse.json({
      intent: {
        ...mockIntent,
        transcript: `${body.transcript ?? mockIntent.transcript} Revision: ${revision}.`,
        styleIntent: "more premium, slower, quieter motion",
      },
      affectedLayers: ["ui_schema", "motion_plan"],
      source: "mock",
    });
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_REASONING_MODEL ?? "gpt-5.5",
      reasoning: { effort: "low" },
      input: `Revise this UI generation intent without touching code yet. Current transcript: ${body.transcript ?? ""}. Requested revision: ${revision}. Return a concise JSON object with updated transcript, styleIntent, and affectedLayers.`,
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Revision failed" }, { status: response.status });
  }

  const result = await response.json();
  return NextResponse.json({ result, source: "openai" });
}
