import { NextResponse } from "next/server";
import { isUIStructure } from "@/lib/contracts";
import { mockExtractedUI, shouldUseMock } from "@/lib/server/mock-responses";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { prompt?: string; imageUrl?: string };

  if (shouldUseMock()) {
    return NextResponse.json(mockExtractedUI());
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
          name: "ui_structure",
          schema: {
            type: "object",
            additionalProperties: false,
            required: ["layout", "components", "tokens", "copy", "interactions"],
            properties: {
              layout: { type: "string" },
              components: { type: "array", items: { type: "string" } },
              tokens: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  required: ["name", "value"],
                  properties: {
                    name: { type: "string" },
                    value: { type: "string" },
                    color: { type: "string" },
                  },
                },
              },
              copy: { type: "array", items: { type: "string" } },
              interactions: { type: "array", items: { type: "string" } },
            },
          },
        },
      },
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Extract a renderable UI structure from this product direction. Prompt: ${body.prompt ?? ""}. Image: ${body.imageUrl ?? "not provided"}`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "UI extraction failed" }, { status: response.status });
  }

  const result = (await response.json()) as { output_text?: string };
  const parsed = safeJson(result.output_text);

  if (!isUIStructure(parsed)) {
    return NextResponse.json({ error: "Invalid UI structure" }, { status: 422 });
  }

  return NextResponse.json({ structure: parsed, source: "openai" });
}

function safeJson(value: unknown) {
  if (typeof value !== "string") return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
