import { NextResponse } from "next/server";
import { mockTranscription, shouldUseMock } from "@/lib/server/mock-responses";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (shouldUseMock()) {
    return NextResponse.json(mockTranscription());
  }

  const formData = await request.formData();
  const audio = formData.get("audio");

  if (!(audio instanceof File)) {
    return NextResponse.json({ error: "Missing audio file" }, { status: 400 });
  }

  const openAIForm = new FormData();
  openAIForm.append("file", audio, audio.name || "voice.webm");
  openAIForm.append("model", process.env.OPENAI_TRANSCRIBE_MODEL ?? "gpt-4o-mini-transcribe");
  openAIForm.append("response_format", "json");

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: openAIForm,
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Transcription failed" }, { status: response.status });
  }

  const result = (await response.json()) as { text?: string };
  return NextResponse.json({ transcript: result.text ?? "", source: "openai" });
}
