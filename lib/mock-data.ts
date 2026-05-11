import type { DemoState, MotionPlan, ToolCallName, ToolStatus, UIStructure, VoiceIntent } from "./contracts";
import { motionPresets } from "./motion-presets";

export const defaultTranscript =
  "Create a minimal task board for a small studio. Keep it light, calm, and Notion-like. Generate the JSON render spec and add a simple motion plan.";

export const mockIntent: VoiceIntent = {
  transcript: defaultTranscript,
  styleIntent: "minimal, light, Notion-like, restrained",
  productIntent: "studio task board",
  constraints: ["quiet typography", "validated JSON render", "calm motion", "human approval before export"],
};

export const mockStructure: UIStructure = {
  layout: "document_workspace_with_preview_and_structure_panel",
  components: ["Workspace", "VoiceComposer", "JsonRenderPreview", "TaskList", "ApprovalNote", "StructurePanel", "MotionStrip"],
  tokens: [
    { name: "page", value: "#F7F7F5", color: "#F7F7F5" },
    { name: "paper", value: "#FFFFFF", color: "#FFFFFF" },
    { name: "line", value: "#E8E6E1", color: "#E8E6E1" },
    { name: "ink", value: "#111111", color: "#111111" },
    { name: "radius", value: "6-8px" },
    { name: "motion", value: "quiet_reveal" },
  ],
  copy: ["Studio booking board", "Add task", "Ready for review", "Export"],
  interactions: ["voice revision", "task selection", "approval note", "motion preview"],
};

export const mockMotion: MotionPlan = {
  ...motionPresets.quietReveal,
};

export const mockDemoState: DemoState = {
  phase: "preview_ready",
  intent: mockIntent,
  artifact: {
    id: "artifact-concierge-01",
    prompt: mockIntent.transcript,
    title: "Minimal studio task board",
    description: "Generated direction: a Notion-like page with validated JSON render state and a quiet confirmation moment.",
  },
  structure: mockStructure,
  motion: mockMotion,
};

export const toolOrder: ToolCallName[] = [
  "transcribe_voice",
  "generate_image",
  "analyze_image",
  "extract_components",
  "generate_ui_schema",
  "generate_motion_plan",
];

export const phaseToolStatus: Record<string, Record<ToolCallName, ToolStatus>> = {
  idle: {
    transcribe_voice: "waiting",
    generate_image: "waiting",
    analyze_image: "waiting",
    extract_components: "waiting",
    generate_ui_schema: "waiting",
    generate_motion_plan: "waiting",
  },
  listening: {
    transcribe_voice: "running",
    generate_image: "waiting",
    analyze_image: "waiting",
    extract_components: "waiting",
    generate_ui_schema: "waiting",
    generate_motion_plan: "waiting",
  },
  transcribing: {
    transcribe_voice: "running",
    generate_image: "waiting",
    analyze_image: "waiting",
    extract_components: "waiting",
    generate_ui_schema: "waiting",
    generate_motion_plan: "waiting",
  },
  generating_image: {
    transcribe_voice: "complete",
    generate_image: "running",
    analyze_image: "waiting",
    extract_components: "waiting",
    generate_ui_schema: "waiting",
    generate_motion_plan: "waiting",
  },
  extracting_ui: {
    transcribe_voice: "complete",
    generate_image: "complete",
    analyze_image: "running",
    extract_components: "running",
    generate_ui_schema: "running",
    generate_motion_plan: "waiting",
  },
  planning_motion: {
    transcribe_voice: "complete",
    generate_image: "complete",
    analyze_image: "complete",
    extract_components: "complete",
    generate_ui_schema: "complete",
    generate_motion_plan: "running",
  },
  preview_ready: {
    transcribe_voice: "complete",
    generate_image: "complete",
    analyze_image: "complete",
    extract_components: "complete",
    generate_ui_schema: "complete",
    generate_motion_plan: "complete",
  },
  revising: {
    transcribe_voice: "complete",
    generate_image: "review",
    analyze_image: "review",
    extract_components: "complete",
    generate_ui_schema: "running",
    generate_motion_plan: "waiting",
  },
};
