# 02 — Reference Architecture

## Architecture overview

```txt
┌──────────────────────────────────────────────────────────────────┐
│ Browser / Next.js App                                             │
│                                                                  │
│  Mic Button ─ Transcript Strip ─ Canvas ─ JSON Inspector ─ Timeline│
└───────────────────────────────┬──────────────────────────────────┘
                                │ WebRTC audio
                                ▼
┌──────────────────────────────────────────────────────────────────┐
│ Realtime Transcription Session                                   │
│                                                                  │
│  gpt-realtime-whisper                                             │
│  - partial transcript events                                      │
│  - final transcript event                                         │
└───────────────────────────────┬──────────────────────────────────┘
                                │ final transcript only
                                ▼
┌──────────────────────────────────────────────────────────────────┐
│ App Server                                                        │
│                                                                  │
│  /api/realtime/session                                            │
│  /api/ui/command                                                  │
│  /api/projects                                                    │
│  /api/export                                                      │
└───────────────────────────────┬──────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────┐
│ UI Command Model                                                  │
│                                                                  │
│  Input: transcript + current spec + selection + catalog summary   │
│  Output: create spec OR JSON patch                                │
│  Constraint: Structured Outputs / schema                          │
└───────────────────────────────┬──────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────┐
│ Runtime Guardrail Layer                                           │
│                                                                  │
│  Validate -> repair if needed -> apply patch -> normalize -> save  │
└───────────────────────────────┬──────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────┐
│ json-render Runtime                                               │
│                                                                  │
│  Catalog: allowed components/actions/validators                   │
│  Registry: actual React implementations                           │
│  Renderer: renders the spec safely                                │
└──────────────────────────────────────────────────────────────────┘
```

## Major components

### 1. Browser UI

Recommended frontend:

- Next.js
- React
- TypeScript
- Tailwind
- shadcn/ui-inspired components
- Framer Motion for motion presets
- Zustand or lightweight React state for local canvas state

Core UI panels:

```txt
Left/top: voice command bar
Center: live canvas
Right: spec inspector
Bottom/right: command timeline
```

### 2. Realtime transcription layer

Responsibility:

- connect browser mic to Realtime transcription
- show partial transcript
- detect final transcript
- send only the final transcript to `/api/ui/command`

Important boundary:

```txt
Partial transcripts are for display.
Final transcripts are for execution.
```

### 3. UI command endpoint

`/api/ui/command` receives:

```json
{
  "transcript": "Make it dark, premium, with emerald accents",
  "currentSpec": {},
  "selectedElementId": "dashboard_root",
  "modeHint": "patch",
  "catalogSummary": {}
}
```

It returns:

```json
{
  "mode": "patch",
  "reason": "User asked to restyle the existing dashboard.",
  "operations": []
}
```

or:

```json
{
  "mode": "create",
  "reason": "No current dashboard exists.",
  "spec": {}
}
```

### 4. UI command model

This model is not the Realtime Whisper model.

It should be a text/reasoning model capable of reliable structured output. It receives the transcript and the UI state, then returns a strict object.

Why separate it:

- Realtime Whisper is optimized for live transcription.
- UI generation needs structure, validation, patching, and design-system reasoning.
- Keeping these separate improves reliability and cost control.

### 5. Runtime guardrail layer

This is your app logic. It should not be skipped.

Responsibilities:

- validate model output against schema
- validate component types against catalog
- validate props against enums/tokens
- block arbitrary CSS and unsafe URLs
- apply JSON Patch
- normalize spec
- produce a diff for the timeline
- save history

### 6. json-render layer

This layer renders approved components.

Conceptually:

```txt
Catalog = what the AI is allowed to use
Registry = how those components render in React
Spec = the generated UI tree/data
```

The model composes from the catalog. The registry decides the actual UI.

### 7. Project/history storage

For the demo, local state is enough.

For a more complete open-source version:

- Postgres/Supabase for projects and versions
- object storage for exports/screenshots
- event log for command history
- optional Redis/queue for longer export jobs

### 8. Excalidraw/MCP documentation layer

This is not core app runtime. It is a companion workflow for:

- generating architecture diagrams
- explaining the system visually
- keeping diagrams version-controlled
- letting an AI agent update `.excalidraw` files during development

## Request lifecycle

### Create lifecycle

```txt
1. User holds mic.
2. Browser streams audio.
3. Realtime Whisper emits partial transcripts.
4. User releases mic.
5. Final transcript is displayed.
6. Browser POSTs transcript to /api/ui/command.
7. Server calls command model with create schema.
8. Server validates generated spec.
9. Canvas renders with json-render.
10. Timeline logs command -> generated spec -> rendered result.
```

### Edit lifecycle

```txt
1. User selects an element or leaves root selected.
2. User says: "Make this red and add motion."
3. Realtime Whisper returns final transcript.
4. Browser sends transcript + currentSpec + selectedElementId.
5. Command model returns JSON Patch operations.
6. Runtime validates patch paths and values.
7. Runtime applies patch.
8. Canvas updates.
9. Timeline shows a human-readable diff.
```

## Recommended runtime state

```ts
type DemoState = {
  projectId: string;
  currentSpec: UISpec;
  selectedElementId?: string;
  transcript: {
    partial: string;
    final?: string;
  };
  history: VersionEntry[];
  timeline: TimelineEvent[];
  isListening: boolean;
  isGenerating: boolean;
  errors: RuntimeError[];
};
```

## Key invariant

The renderer should only receive a validated spec.

```txt
model output -> validate -> repair/retry -> validate -> render
```

Never:

```txt
model output -> render
```

## Where future capabilities fit

```txt
Voice agent:
  Add spoken assistant responses after the basic command loop works.

Code export:
  Add a React exporter from the validated spec.

Codegen agents:
  Use only for developer-reviewed component creation, not live canvas editing.

Real data:
  Add data connectors after the dashboard spec format is stable.

Collaboration:
  Add CRDT/project sync after version history works locally.
```
