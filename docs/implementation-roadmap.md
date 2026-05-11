# 10 — Implementation Roadmap

## Phase 0 — Repo skeleton and docs

Goal: make the open-source project understandable before adding complexity.

Tasks:

- [ ] Create Next.js + TypeScript app.
- [ ] Add README with demo promise.
- [ ] Add architecture docs and ADRs.
- [ ] Add `/docs`, `/examples`, `/schemas`, `/diagrams`.
- [ ] Add `.excalidraw` architecture diagrams.
- [ ] Add MIT or Apache-2.0 license.

Success:

- A contributor can understand the project in under 10 minutes.

## Phase 1 — Static renderer

Goal: render a hard-coded dashboard spec.

Tasks:

- [ ] Install json-render packages.
- [ ] Define initial catalog.
- [ ] Define React registry components.
- [ ] Create seed dashboard spec.
- [ ] Render seed spec on canvas.
- [ ] Build JSON inspector.

Success:

- A beautiful static dashboard renders from JSON.

## Phase 2 — Typed command generation

Goal: generate and patch UI from typed prompts.

Tasks:

- [ ] Add `/api/ui/command`.
- [ ] Add Structured Outputs schema.
- [ ] Pass catalog summary into the model.
- [ ] Implement create command.
- [ ] Implement patch command.
- [ ] Implement validation and one-pass repair.
- [ ] Add command timeline.

Success:

- User can type “create dashboard,” then “make it dark,” and the canvas updates.

## Phase 3 — Realtime Whisper voice input

Goal: make voice mandatory and magical.

Tasks:

- [ ] Add mic button.
- [ ] Add Realtime session/token endpoint.
- [ ] Connect browser mic via WebRTC.
- [ ] Show partial transcript.
- [ ] Submit final transcript to `/api/ui/command`.
- [ ] Add text fallback.

Success:

- User can hold mic, speak, release, and see UI update.

## Phase 4 — Patch discipline and history

Goal: make edits feel controlled.

Tasks:

- [ ] Implement JSON Patch apply/rollback.
- [ ] Add selected element context.
- [ ] Add undo/redo.
- [ ] Add human-readable diff summary.
- [ ] Add revision timeline.

Success:

- “Make this red” patches only selected card.
- Undo works.

## Phase 5 — Demo polish

Goal: make the 1–2 minute video feel premium.

Tasks:

- [ ] Improve visual design.
- [ ] Add skeleton/transition states.
- [ ] Add motion presets.
- [ ] Add canned fallback responses.
- [ ] Add export JSON button.
- [ ] Add architecture diagram page.
- [ ] Rehearse demo script.

Success:

- The demo works reliably enough to record in one take.

## Phase 6 — Open-source polish

Goal: make it useful beyond the video.

Tasks:

- [ ] Add contribution guide.
- [ ] Add issue templates.
- [ ] Add component contribution checklist.
- [ ] Add tests for schemas and patching.
- [ ] Add example commands/specs.
- [ ] Add `npm run demo:seed`.
- [ ] Add deployment instructions.

Success:

- Another developer can clone, run, and extend the project.

## Phase 7 — Future capability lanes

Only after the demo is stable:

- [ ] React export.
- [ ] Figma/Excalidraw export.
- [ ] Design-system import.
- [ ] Real chart data binding.
- [ ] Multi-screen flows.
- [ ] Voice agent clarification.
- [ ] Agent-assisted component creation.

## MVP cut line

The MVP is complete when this sequence works:

```txt
Voice prompt -> transcript -> create dashboard -> voice edit -> JSON patch -> render -> undo
```

Do not add more features until that loop is solid.
