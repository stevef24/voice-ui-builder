# 05 — Command Model and Patching

## Decision

Use a separate structured-output command model after Realtime Whisper produces a final transcript.

The command model returns one of these modes:

```txt
create
patch
undo
redo
export
clarify
noop
```

## Why not regenerate everything every time

If the user says:

```txt
Make the churn card red.
```

The app should not regenerate the whole dashboard. Regeneration creates layout drift, content drift, and user distrust.

Instead, it should patch the existing spec:

```json
{
  "mode": "patch",
  "operations": [
    {
      "op": "replace",
      "path": "/elements/metric_churn/props/tone",
      "value": "danger"
    }
  ]
}
```

## Create command

Used when no current spec exists or when the user explicitly starts over.

```json
{
  "mode": "create",
  "summary": "Created a SaaS analytics dashboard.",
  "spec": {
    "version": "demo-0.1",
    "root": "dashboard_root",
    "elements": {}
  }
}
```

## Patch command

Used for follow-up edits.

```json
{
  "mode": "patch",
  "summary": "Restyled dashboard to dark premium theme.",
  "targetElementIds": ["dashboard_root"],
  "operations": [
    {
      "op": "replace",
      "path": "/elements/dashboard_root/props/theme",
      "value": "dark"
    },
    {
      "op": "replace",
      "path": "/elements/dashboard_root/props/accent",
      "value": "emerald"
    }
  ]
}
```

## Undo and redo

Undo and redo should be runtime commands, not model commands.

If the final transcript is:

```txt
Undo that.
```

The app should pop the history stack directly. No model call required.

## Clarify command

Use this sparingly.

Good clarify case:

```txt
"Make it red."
```

No element is selected and the app cannot know whether the user means the dashboard, a button, an alert, or a card.

Output:

```json
{
  "mode": "clarify",
  "question": "Do you want the whole dashboard red, or only a specific card?",
  "suggestions": ["Whole dashboard", "Selected card", "Churn card"]
}
```

For the demo, prefer safe defaults over too many clarifications.

## Structured Outputs

The command model should use a JSON schema. Do not parse prose.

Why:

- fewer invalid outputs
- easier validation
- clear failure modes
- easier automated tests

## Command model input

```ts
type UICommandRequest = {
  transcript: string;
  currentSpec: UISpec | null;
  selectedElementId: string | null;
  recentHistory: Array<{
    id: string;
    summary: string;
  }>;
  catalogSummary: CatalogSummary;
};
```

## Command model output

See `schemas/ui-command-response.schema.json`.

## Patch validation checklist

Before applying a patch:

1. Parse command response.
2. Validate command response schema.
3. Validate all operation paths.
4. Ensure all target IDs exist unless adding new elements.
5. Validate component types against catalog.
6. Validate prop values against component schemas.
7. Apply patch to a cloned spec.
8. Validate full resulting spec.
9. Save new revision.
10. Render.

## Repair loop

If validation fails, run a repair prompt once or twice.

```txt
Invalid command output:
{...}

Validation errors:
- /operations/0/path does not exist
- value "crimson-glow" is not allowed for tone

Return a corrected command using the same user intent.
```

If the repair still fails, show a graceful error and do not mutate the canvas.

## Human-readable diff

The app should turn patches into a timeline message:

```txt
Changed dashboard theme from light to dark.
Changed dashboard accent from blue to emerald.
Added fade-up motion to 4 metric cards.
```

This is great for demo narration.

## Motion preset boundary

The model may select a motion preset, but it must not generate arbitrary animation CSS.

Allowed:

```json
{
  "op": "replace",
  "path": "/elements/task_list/props/motion",
  "value": "soft_patch"
}
```

Not allowed:

```json
{
  "op": "add",
  "path": "/elements/task_list/props/className",
  "value": "animate-[bounce_900ms_linear_infinite]"
}
```

Current preset rules live in `docs/motion-presets.md`.

## Selection context

Selection makes voice editing precise.

If `selectedElementId = "metric_churn"` and the user says:

```txt
Make this red and add motion.
```

The model should target `metric_churn`.

If no element is selected, the model can infer a safe target or return clarify.

## Command examples

| Transcript | Expected output |
|---|---|
| "Create a dashboard" | create spec |
| "Make it dark" | patch root theme |
| "Make this red" | patch selected element |
| "Move the chart to the top" | patch layout/children order |
| "Undo" | runtime undo |
| "Export React" | export command |
| "Never mind" | noop |

## Demo shortcut

For a reliable public demo, include canned responses for the three main demo prompts. The app can still use the model during development, but canned fallbacks protect you from live network/model variance.
