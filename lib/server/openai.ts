export type OpenAIJsonSchema = {
  name: string;
  schema: Record<string, unknown>;
};

export function getTextModel() {
  return process.env.OPENAI_TEXT_MODEL ?? "gpt-4o-mini";
}

export function readResponseText(response: unknown) {
  if (!response || typeof response !== "object") return "";
  const candidate = response as { output_text?: unknown; output?: unknown };

  if (typeof candidate.output_text === "string") {
    return candidate.output_text;
  }

  if (!Array.isArray(candidate.output)) return "";

  return candidate.output
    .flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const content = (item as { content?: unknown }).content;
      return Array.isArray(content) ? content : [];
    })
    .map((content) => {
      if (!content || typeof content !== "object") return "";
      const value = content as { text?: unknown; refusal?: unknown };
      if (typeof value.text === "string") return value.text;
      if (typeof value.refusal === "string") return value.refusal;
      return "";
    })
    .join("");
}

export function safeJson(value: unknown) {
  if (typeof value !== "string") return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export async function createStructuredResponse({
  input,
  schema,
}: {
  input: string;
  schema: OpenAIJsonSchema;
}) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required for OpenAI provider mode.");
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: getTextModel(),
      text: {
        format: {
          type: "json_schema",
          name: schema.name,
          strict: true,
          schema: schema.schema,
        },
      },
      input,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(errorText || `OpenAI request failed with status ${response.status}`);
  }

  const result = await response.json();
  return safeJson(readResponseText(result));
}
