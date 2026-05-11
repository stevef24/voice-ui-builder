# ADR-005 — Use JSON Patch for follow-up edits

## Status

Accepted for MVP demo.

## Context

Follow-up edits should preserve layout and user intent. Full regeneration can drift content, component IDs, and layout.

## Decision

Use JSON Patch-style operations for edits after the first generated spec.

## Consequences

### Benefits

- Stable UI edits.
- Precise undo/redo.
- Clear timeline diffs.
- Great for selected-element commands.

### Tradeoffs

- Requires path validation.
- Requires stable element IDs.
- Some layout edits need careful patch construction.

## Alternatives considered

- Full regeneration every time: simple but unstable.
- Custom mutation language: possible, but JSON Patch is familiar and testable.

## How this affects the demo

The “make this red and add motion” moment should patch one selected element, not rebuild the dashboard.
