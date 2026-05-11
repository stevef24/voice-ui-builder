# 07 — Demo Script: 1–2 Minutes

## Demo goal

Show a beautiful dashboard being created and edited by voice while making the architecture feel believable.

## Scene setup

Open the app with:

- empty canvas
- mic button visible
- transcript panel visible
- command timeline visible
- JSON inspector collapsed or on the right
- architecture diagram tab ready if you want to explain after the app demo

## 0:00–0:10 — Intro

Say:

> “This is a voice-first generative UI demo. I’m not asking the model to write random React. I’m asking it to produce validated UI JSON that renders through a component catalog.”

Visual:

- show empty canvas
- show mic button
- show catalog chips: Card, Metric, Grid, Chart, Table, Alert

## 0:10–0:30 — First voice command

Hold mic and say:

> “Create a modern SaaS analytics dashboard with four metric cards, a revenue chart, recent activity, and a warning banner.”

Visual expectation:

- transcript streams live
- final transcript locks in
- timeline shows:

```txt
Heard transcript
Classified command: create_dashboard
Generated JSON spec
Validated against catalog
Rendered dashboard
```

Canvas result:

- dashboard title
- four metric cards
- chart placeholder
- activity table
- warning/insight banner

Narration:

> “Realtime Whisper only handles the ears. Once the final transcript is ready, a separate command model creates the structured UI spec.”

## 0:30–0:50 — Style command

Hold mic and say:

> “Make it dark, premium, with emerald accents and soft glass cards.”

Visual expectation:

- dashboard restyles
- layout remains stable
- timeline shows patch summary, not full regeneration

Narration:

> “This is a patch, not a full rewrite. The existing dashboard keeps its structure, and only theme tokens change.”

## 0:50–1:10 — Targeted edit

Click/select the churn card.

Hold mic and say:

> “Make this card red and add a subtle fade-up motion.”

Visual expectation:

- only churn card changes
- inspector shows selected element ID
- motion preview plays subtly

Narration:

> “Selection context lets voice commands stay natural. ‘This card’ becomes a precise patch to one element.”

## 1:10–1:25 — Layout change

Say:

> “Make the activity table compact and move the chart above it.”

Visual expectation:

- table density changes
- grid rearranges
- timeline shows child-order/layout patch

## 1:25–1:40 — Undo and inspect

Say:

> “Undo the last change.”

Visual expectation:

- layout goes back one revision
- timeline highlights previous revision

Click JSON inspector.

Narration:

> “Because every change is structured, the app can show history, undo safely, and export the spec.”

## 1:40–2:00 — Architecture reveal

Open the Excalidraw diagram.

Say:

> “The architecture is simple: Whisper transcribes, the command model returns JSON, the runtime validates, and json-render displays only approved components.”

Optional line:

> “The diagram itself is versioned as an Excalidraw file, and can be updated through MCP while we build.”

## Demo fallback path

If voice fails, type the commands into the command box. Say:

> “The fallback input uses the same command pipeline. The voice layer is only the input layer.”

If the model is slow, use canned examples from `examples/`.

## Best 3 commands to memorize

```txt
Create a modern SaaS analytics dashboard with four metric cards, a revenue chart, recent activity, and a warning banner.
```

```txt
Make it dark, premium, with emerald accents and soft glass cards.
```

```txt
Make this card red and add a subtle fade-up motion.
```

## What to avoid saying

Avoid:

> “The AI is coding the dashboard live.”

Better:

> “The AI is assembling the dashboard from a controlled component catalog.”

Avoid:

> “This is production ready.”

Better:

> “This is an open-source capability demo showing the architecture.”

## Demo success checklist

- [ ] Transcript appears live
- [ ] Dashboard renders cleanly
- [ ] Follow-up style edit preserves layout
- [ ] Targeted selected-card edit works
- [ ] Undo works
- [ ] Timeline explains what happened
- [ ] Architecture diagram is ready
- [ ] JSON/spec view is available
