# Voice UI Builder

Voice UI Builder is a minimal open-source demo for turning a spoken interface idea into a validated JSON UI spec, a rendered preview, and a small motion plan.

The first version is intentionally mock-first. It is designed to be reliable for a short demo recording before any realtime or image-generation cost is introduced.

## Demo Flow

```txt
voice prompt
  -> transcript
  -> command model
  -> validated JSON render spec
  -> preview
  -> JSON patch revisions
  -> motion plan
```

The goal is not raw React generation. The goal is a constrained builder loop where the model can only create or patch approved component structures.

## Quickstart

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3000`.

The app runs without an API key in deterministic mock mode.

## Scripts

```bash
pnpm dev
pnpm type-check
pnpm build
pnpm check
```

## OpenAI Testing

To test with OpenAI, add only this required value:

```env
OPENAI_API_KEY=
```

If `OPENAI_API_KEY` is present, the Run button uses `/api/turn` in OpenAI mode automatically.
If no key is present, the same route falls back to mock mode.

Keep `OPENAI_API_KEY` server-only. Do not expose it through `NEXT_PUBLIC_` variables.

Optional overrides:

```env
OPENAI_TEXT_MODEL=gpt-4o-mini
OPENAI_TRANSCRIBE_MODEL=gpt-4o-mini-transcribe
OPENAI_IMAGE_MODEL=gpt-image-2
VOICE_UI_BUILDER_MOCK_MODE=true
```

## Useful Docs

- [Executive brief](docs/executive-brief.md)
- [Reference architecture](docs/reference-architecture.md)
- [JSON render runtime](docs/json-render-runtime.md)
- [Command model and patching](docs/command-model-and-patching.md)
- [Motion presets](docs/motion-presets.md)
- [Demo script](docs/demo-script.md)
- [Implementation roadmap](docs/implementation-roadmap.md)
- [Security, privacy, and costs](docs/security-privacy-costs.md)
- [Contributor guide](docs/contributor-guide.md)

## Architecture Decisions

- [Separate transcription from command generation](adr/ADR-002-separate-transcription-from-command-generation.md)
- [Use JSON render over raw React](adr/ADR-003-use-json-render-over-raw-react.md)
- [Use JSON Patch for edits](adr/ADR-005-use-json-patch-for-edits.md)

## License

MIT
