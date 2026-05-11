import { mockIntent, mockMotion, mockStructure } from "@/lib/mock-data";

export function shouldUseMock() {
  const mockMode = process.env.VOICE_UI_BUILDER_MOCK_MODE;

  if (mockMode === "true") return true;
  if (mockMode === "false") return false;

  return !process.env.OPENAI_API_KEY;
}

export function mockTranscription() {
  return {
    transcript: mockIntent.transcript,
    source: "mock",
  };
}

export function mockImageArtifact(prompt: string) {
  return {
    artifact: {
      id: "mock-generated-artifact",
      title: "Minimal studio task board",
      description: "A generated light interface direction for a calm Notion-like builder workspace.",
      prompt,
      imageUrl: null,
    },
    source: "mock",
  };
}

export function mockExtractedUI() {
  return {
    structure: mockStructure,
    source: "mock",
  };
}

export function mockGeneratedMotion() {
  return {
    motion: mockMotion,
    source: "mock",
  };
}
