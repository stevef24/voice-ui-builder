# ADR-002 — Separate transcription from UI command generation

## Status

Accepted for MVP demo.

## Context

Realtime transcription and UI generation are different jobs. Transcription needs low-latency audio handling. UI generation needs schema adherence, current UI context, catalog awareness, and patch discipline.

## Decision

After Realtime Whisper returns a final transcript, send that transcript to a separate structured-output command model.

## Consequences

### Benefits

- Clear separation of concerns.
- Easier validation.
- Better cost control.
- Easier to replace either layer later.

### Tradeoffs

- Two model/API steps instead of one.
- Need to manage handoff from transcript to command.

## Alternatives considered

- Use one full realtime voice model for everything: more complex, more expensive, harder to constrain.
- Use Realtime Whisper to directly generate JSON: not the right capability split.

## How this affects the demo

The demo narration can say: “Whisper is the ears; the command model is the brain.”
