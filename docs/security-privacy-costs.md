# 12 — Security, Privacy, and Costs

## Main security principle

Never expose a normal OpenAI API key in the browser.

The app server should create/broker the Realtime transcription session or mint a short-lived client credential. The browser should only receive what it needs for the current voice session.

## Voice privacy

Because this is a voice-first app, be explicit:

- show when the mic is recording
- use push-to-talk by default
- provide text fallback
- do not silently start listening
- do not store audio by default
- store transcripts only if needed for history

## Data stored in demo

For MVP, store:

- final transcript
- generated command response
- patch operations
- UI spec revisions
- timestamped timeline events

Avoid storing:

- raw audio
- full user identity data
- external API secrets
- model debug payloads with unnecessary metadata

## Prompt injection and unsafe commands

The user can say anything. The model output must still be constrained.

Guardrails:

- structured output schema
- catalog validation
- prop enum validation
- no raw JS
- no arbitrary CSS
- no remote script URLs
- no unsafe HTML injection
- no renderer execution of unknown components

## Cost controls

Realtime transcription costs scale with audio usage. Command generation costs scale with prompt/context size and model choice.

Demo cost controls:

- push-to-talk instead of always-on
- do not send partial transcripts to command model
- keep catalog summary compact
- avoid sending full history every time
- use recent revision summaries instead
- use cheaper command model where quality is enough
- cache/canned responses for public demo prompts

## Latency controls

Potential latency points:

- WebRTC setup
- speech finalization
- command model call
- validation/repair
- rendering

Mitigations:

- keep session warm after first mic click
- show transcript immediately
- show progress timeline
- avoid repair unless needed
- use small catalog
- keep generated spec modest
- use local state for rendering

## Validation failures

If the command model returns invalid output:

1. Do not render it.
2. Show a small “repairing command” state.
3. Run repair prompt once.
4. Validate again.
5. If still invalid, show error and keep current UI.

The canvas should never mutate from invalid output.

## Open-source safety posture

The README should include:

- “This is a demo, not production-ready.”
- “Do not expose API keys in client code.”
- “Use push-to-talk by default.”
- “Validate all AI-generated specs before rendering.”
- “Generated specs are data, not trusted code.”

## Rate limiting

Add simple limits even for demo:

- max voice command duration
- max commands per minute
- max generated elements
- max repair attempts
- max spec size
- max table rows

## Suggested limits

```ts
const LIMITS = {
  maxVoiceSeconds: 20,
  maxElements: 80,
  maxPatchOps: 30,
  maxRepairAttempts: 2,
  maxTableRows: 10,
  maxTranscriptChars: 1000,
};
```

## Security invariant

```txt
AI output is untrusted until validated.
```

This should be repeated in docs, tests, and comments.
