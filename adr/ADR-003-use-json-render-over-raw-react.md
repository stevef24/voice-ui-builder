# ADR-003 — Use json-render over raw React generation

## Status

Accepted for MVP demo.

## Context

A live UI canvas should not execute arbitrary model-generated code. The output should be inspectable, reversible, and design-system consistent.

## Decision

Use json-render to render AI-generated JSON from a predefined catalog/registry.

## Consequences

### Benefits

- Safer live rendering.
- Better undo/redo.
- Easier diffing.
- More consistent visuals.
- Open-source contributors can add catalog components deliberately.

### Tradeoffs

- Requires predefined components.
- Less freeform than raw codegen.
- Needs adapter/registry implementation.

## Alternatives considered

- Raw React generation: flexible but unsafe/messy.
- Figma-only generation: useful visually but less connected to production React.
- Static templates only: safe but not generative enough.

## How this affects the demo

The dashboard should visibly be generated from approved building blocks, not random code.
