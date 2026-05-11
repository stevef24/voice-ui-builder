# 00 — Executive Brief

## What we are building

A voice-first generative UI demo that lets someone speak a UI request and watch a dashboard/component appear on screen.

The demo uses four separate responsibilities:

```txt
Realtime Whisper = ears
Command model = intent + structured JSON
json-render = renderer
App runtime = validation, patching, history, safety
```

This split is the most important architecture decision in the project.

## Why this is a strong open-source demo

Most AI UI generation demos fall into one of two traps:

1. They generate raw code, which looks impressive but can become messy, unsafe, and hard to edit.
2. They are just a chat interface with a preview, which feels less like a product and more like a prompt toy.

This project demonstrates something more useful:

> AI can become a controlled UI assembler for a real design system.

The app can be simple, but the capability feels futuristic because the user speaks naturally and the canvas updates.

## What the 1–2 minute demo should show

The demo should show these moments:

1. The user speaks a dashboard request.
2. Live transcript appears immediately.
3. The app converts the final transcript into a valid JSON UI spec.
4. The dashboard renders from a known component catalog.
5. The user speaks follow-up edits.
6. The app patches the existing dashboard instead of regenerating it.
7. The user can view the spec, undo, and export.
8. Optionally, the presenter opens an Excalidraw architecture diagram generated/updated via MCP.

## Product promise

```txt
Speak UI into existence.
Edit it with voice.
Keep the output safe, structured, and design-system consistent.
```

## Technical promise

```txt
Do not trust free-form generation.
Generate structured data.
Validate it.
Render only approved components.
Patch instead of rewrite.
```

## Demo scope

The demo only needs to generate and edit a fake dashboard. It does not need real analytics data, real auth, a billing system, or production-grade export.

Recommended first prompt:

```txt
Create a modern SaaS analytics dashboard with a hero header, four metric cards, a revenue chart placeholder, a recent activity table, and a warning banner.
```

Recommended second prompt:

```txt
Make it dark, premium, with emerald accents, subtle card motion, and highlight the churn metric.
```

Recommended third prompt:

```txt
Add a callout explaining what changed and make the table more compact.
```

## Recommended architecture in one line

```txt
Browser mic -> Realtime Whisper -> final transcript -> structured command endpoint -> JSON spec/patch -> json-render -> preview canvas
```

## Decision summary

| Decision | Recommendation |
|---|---|
| Voice input | Use Realtime Whisper as a must-have input layer |
| Live transport | Use WebRTC from browser through an app server session/token route |
| UI generation | Use a separate structured-output command model |
| Rendering | Use json-render with a predefined catalog/registry |
| Editing | Use JSON Patch for follow-up commands |
| Styling | Use design tokens and constrained props |
| Motion | Use motion presets, not generated animation code |
| Diagrams | Use Excalidraw `.excalidraw` files plus MCP to update/explain |
| Code generation | Keep codegen agents out of the live canvas initially |
| Open-source angle | Publish a capability demo with docs, examples, and extension points |

## One sentence for the README

VoiceCanvas is an open-source demo showing how realtime transcription, structured AI generation, and schema-constrained rendering can turn spoken commands into editable dashboards.
