export type PipelinePhase =
  | "idle"
  | "listening"
  | "transcribing"
  | "generating_image"
  | "extracting_ui"
  | "planning_motion"
  | "preview_ready"
  | "revising";

export type ToolStatus = "waiting" | "running" | "complete" | "review" | "failed";

export type ToolCallName =
  | "transcribe_voice"
  | "apply_patch"
  | "generate_ui_schema"
  | "generate_motion_plan";

export type VoiceIntent = {
  transcript: string;
  styleIntent: string;
  productIntent: string;
  constraints: string[];
};

export type GeneratedArtifact = {
  id: string;
  prompt: string;
  imageUrl?: string;
  title: string;
  description: string;
};

export type UIStructure = {
  layout: string;
  components: string[];
  tokens: Array<{ name: string; value: string; color?: string }>;
  copy: string[];
  interactions: string[];
};

export type MotionTrack = {
  name: string;
  durationMs: number;
  delayMs: number;
  easing: string;
};

export type MotionPlan = {
  mode: string;
  tracks: MotionTrack[];
};

export type DemoState = {
  phase: PipelinePhase;
  intent: VoiceIntent;
  artifact: GeneratedArtifact;
  structure: UIStructure;
  motion: MotionPlan;
};

export type TurnResponse = {
  state: DemoState;
  source: "mock" | "openai";
  summary: string;
};

export function isUIStructure(value: unknown): value is UIStructure {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<UIStructure>;
  return (
    typeof candidate.layout === "string" &&
    Array.isArray(candidate.components) &&
    Array.isArray(candidate.tokens) &&
    Array.isArray(candidate.copy) &&
    Array.isArray(candidate.interactions)
  );
}

export function isMotionPlan(value: unknown): value is MotionPlan {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<MotionPlan>;
  return (
    typeof candidate.mode === "string" &&
    Array.isArray(candidate.tracks) &&
    candidate.tracks.every(
      (track) =>
        typeof track.name === "string" &&
        typeof track.durationMs === "number" &&
        typeof track.delayMs === "number" &&
        typeof track.easing === "string",
    )
  );
}

export function isVoiceIntent(value: unknown): value is VoiceIntent {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<VoiceIntent>;
  return (
    typeof candidate.transcript === "string" &&
    typeof candidate.styleIntent === "string" &&
    typeof candidate.productIntent === "string" &&
    Array.isArray(candidate.constraints) &&
    candidate.constraints.every((constraint) => typeof constraint === "string")
  );
}
