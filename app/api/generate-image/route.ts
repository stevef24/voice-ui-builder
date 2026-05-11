import { NextResponse } from "next/server";
import { mockImageArtifact, shouldUseMock } from "@/lib/server/mock-responses";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { prompt?: string };
  const prompt = body.prompt?.trim() || "Create a calm dark concierge booking UI direction.";

  if (shouldUseMock()) {
    return NextResponse.json(mockImageArtifact(prompt));
  }

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-2",
      prompt,
      size: "1536x1024",
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Image generation failed" }, { status: response.status });
  }

  const result = (await response.json()) as { data?: Array<{ url?: string; b64_json?: string }> };
  const image = result.data?.[0];

  return NextResponse.json({
    artifact: {
      id: "openai-generated-artifact",
      title: "Generated visual direction",
      description: "Image direction generated from the voice prompt.",
      prompt,
      imageUrl: image?.url ?? (image?.b64_json ? `data:image/png;base64,${image.b64_json}` : null),
    },
    source: "openai",
  });
}
