import { NextResponse } from "next/server";
import type { DemoState, MotionPlan, UIStructure, VoiceIntent } from "@/lib/contracts";
import { isMotionPlan, isUIStructure, isVoiceIntent } from "@/lib/contracts";
import { mockDemoState } from "@/lib/mock-data";
import { createStructuredResponse } from "@/lib/server/openai";
import { shouldUseMock } from "@/lib/server/mock-responses";

const turnSchema = {
  name: "voice_ui_builder_turn",
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["summary", "intent", "structure", "motion"],
    properties: {
      summary: { type: "string" },
      intent: {
        type: "object",
        additionalProperties: false,
        required: ["transcript", "styleIntent", "productIntent", "constraints"],
        properties: {
          transcript: { type: "string" },
          styleIntent: { type: "string" },
          productIntent: { type: "string" },
          constraints: { type: "array", items: { type: "string" } },
        },
      },
      structure: {
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
              required: ["name", "value", "color"],
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
      motion: {
        type: "object",
        additionalProperties: false,
        required: ["mode", "tracks"],
        properties: {
          mode: { type: "string", enum: ["none", "quiet_reveal", "soft_patch", "drawer_in"] },
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
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { transcript?: string };
  const transcript = body.transcript?.trim() || mockDemoState.intent.transcript;

  if (shouldUseMock()) {
    return NextResponse.json({
      state: buildState(transcript, mockDemoState.intent, mockDemoState.structure, mockDemoState.motion),
      source: "mock",
      summary: "Generated a mock JSON render spec and motion plan.",
    });
  }

  try {
    const parsed = await createStructuredResponse({
      schema: turnSchema,
      input: `You are generating a minimal Notion-style desktop UI builder demo.

Return JSON only through the provided schema.
Do not generate React code, CSS classes, or arbitrary animation CSS.
Use restrained light/dark compatible design tokens and motion presets only.

User transcript:
${transcript}`,
    });

    if (!isTurnPayload(parsed)) {
      return NextResponse.json({ error: "Model returned an invalid turn payload." }, { status: 422 });
    }

    const structure = normalizeStructure(parsed.structure);
    if (!structure) {
      return NextResponse.json({ error: "Model returned an invalid UI structure." }, { status: 422 });
    }

    return NextResponse.json({
      state: buildState(transcript, parsed.intent, structure, parsed.motion),
      source: "openai",
      summary: parsed.summary,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Turn generation failed." },
      { status: 500 },
    );
  }
}

function isTurnPayload(value: unknown): value is {
  summary: string;
  intent: VoiceIntent;
  structure: UIStructure;
  motion: MotionPlan;
} {
  if (!value || typeof value !== "object") return false;
  const candidate = value as {
    summary?: unknown;
    intent?: unknown;
    structure?: unknown;
    motion?: unknown;
  };

  return (
    typeof candidate.summary === "string" &&
    isVoiceIntent(candidate.intent) &&
    isUIStructure(normalizeStructure(candidate.structure)) &&
    isMotionPlan(candidate.motion)
  );
}

function normalizeStructure(value: unknown): UIStructure | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<UIStructure>;
  if (!Array.isArray(candidate.tokens)) return null;

  return {
    layout: candidate.layout ?? "",
    components: candidate.components ?? [],
    copy: candidate.copy ?? [],
    interactions: candidate.interactions ?? [],
    tokens: candidate.tokens.map((token) => ({
      name: token.name,
      value: token.value,
      color: token.color || undefined,
    })),
  };
}

function buildState(
  transcript: string,
  intent: VoiceIntent,
  structure: UIStructure,
  motion: MotionPlan,
): DemoState {
  return {
    ...mockDemoState,
    phase: "preview_ready",
    intent: {
      ...intent,
      transcript,
    },
    artifact: {
      ...mockDemoState.artifact,
      id: "turn-generated-artifact",
      prompt: transcript,
      title: structure.copy[0] ?? "Generated interface",
      description: `Rendered from ${structure.components.length} structured components.`,
    },
    structure,
    motion,
  };
}
