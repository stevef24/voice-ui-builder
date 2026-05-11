# 15 — Contributor Guide

## Project philosophy

This project is about constrained generative UI.

Contributors should preserve this principle:

```txt
AI output is data, not trusted code.
```

## Good contributions

- new catalog component with schema and registry implementation
- better visual design tokens
- better motion presets
- validation improvements
- patch/history improvements
- demo examples
- Excalidraw diagrams
- tests
- docs explaining tradeoffs

## Contributions to be careful with

- arbitrary `className` generation
- raw HTML rendering
- unvalidated AI output
- always-on microphone behavior
- huge component catalogs
- unreviewed codegen into live runtime

## Adding a component

Checklist:

1. Add component props schema to catalog.
2. Add React registry implementation.
3. Add example spec.
4. Add voice command example.
5. Add validation test.
6. Add visual story/screenshot if possible.
7. Update docs if it changes architecture.

## Adding a voice command category

Checklist:

1. Add category to command prompt.
2. Add schema branch if needed.
3. Add examples.
4. Add tests.
5. Add demo timeline labels.

## Adding an MCP diagram change

Checklist:

1. Open or update the `.excalidraw` file.
2. Keep labels readable.
3. Keep architecture layers clear.
4. Commit the `.excalidraw` file.
5. Update the Mermaid version if the architecture changed.

## Pull request structure

A good PR includes:

- problem statement
- architecture impact
- screenshots or diagram if visual
- tests
- example command/spec
- notes on tradeoffs

## Code style

Prefer:

- small files
- explicit schemas
- narrow types
- clear names
- functional helpers for validation/patching
- comments at architecture boundaries

Avoid:

- hidden side effects
- broad `any` types
- model outputs passed directly to renderer
- duplicating token values across components

## Testing expectations

At minimum:

- schema validates sample specs
- patch operations apply correctly
- invalid props are rejected
- selected-element commands target selected element
- undo returns to previous spec

## Maintainer note

It is okay to say no to features that make the first demo less clear.

A small coherent project is better than a broad fragile one.
