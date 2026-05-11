# Demo Narration Prompt / Script

Use this script when recording or presenting.

## Opening

```txt
This is a voice-first generative UI demo. I describe the interface, Realtime Whisper transcribes me live, then a separate command model returns structured UI JSON. The app validates that JSON and renders it through json-render using components we define.
```

## First command

```txt
Create a modern SaaS analytics dashboard with four metric cards, a revenue chart, recent activity, and a warning banner.
```

Narrate:

```txt
The transcript appears first. Nothing changes from partial text. Once the final transcript lands, it becomes a command.
```

## After dashboard appears

```txt
This dashboard is not raw generated React. It is a validated JSON spec rendered through a component registry.
```

## Style command

```txt
Make it dark, premium, with emerald accents and soft glass cards.
```

Narrate:

```txt
This is a patch. The structure remains stable; only design tokens change.
```

## Selected card command

```txt
Make this card red and add a subtle fade-up motion.
```

Narrate:

```txt
Because the churn card is selected, “this card” resolves to one element ID. The model returns a patch against that ID.
```

## Architecture reveal

```txt
The architecture is deliberately split: Whisper is the ears, the command model is the brain, validation is the guardrail, and json-render is the renderer.
```

## Closing

```txt
The future this points to is not just prompt-to-code. It is speech-to-structured-UI-operation, with design-system control and reversible edits.
```
