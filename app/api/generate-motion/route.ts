import { NextResponse } from "next/server";
import { isMotionPlan } from "@/lib/contracts";
import { mockGeneratedMotion, shouldUseMock } from "@/lib/server/mock-responses";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { structure?: unknown };

  if (shouldUseMock()) {
    return NextResponse.json(mockGeneratedMotion());
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
      text: {
        format: {
          type: "json_schema",
          name: "motion_plan",
          schema: {
            type: "object",
            additionalProperties: false,
            required: ["mode", "tracks"],
            properties: {
              mode: { type: "string" },
              tracks: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  required: ["name", "durationMs", "delayMs", "easing"],
                  properties: {
                    name: { type: "string" },
                    durationMs: { type: "number" },
                    delayMs: { type: "number" },
                    easing: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
      input: `Create a calm product motion plan for this generated UI structure: ${JSON.stringify(body.structure ?? {})}`,
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Motion generation failed" }, { status: response.status });
  }

  const result = (await response.json()) as { output_text?: string };
  const parsed = safeJson(result.output_text);

  if (!isMotionPlan(parsed)) {
    return NextResponse.json({ error: "Invalid motion plan" }, { status: 422 });
  }

  return NextResponse.json({ motion: parsed, source: "openai" });
}

function safeJson(value: unknown) {
  if (typeof value !== "string") return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
