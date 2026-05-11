import { mockIntent, mockMotion, mockStructure } from "@/lib/mock-data";

export function shouldUseMock() {
  return process.env.VOICE_TO_MOTION_MOCK_MODE !== "false" || !process.env.OPENAI_API_KEY;
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
      title: "Premium concierge booking flow",
      description: "A generated dark interface direction for a calm concierge booking experience.",
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
