# Motion Presets

Voice UI Builder uses motion presets instead of model-generated animation code.

The command model can choose a preset, but the registry owns the real easing, duration, and properties. This keeps generated interfaces consistent and prevents unsafe or distracting animation output.

## Preset Rules

These rules are adapted from the local `web-animation-design` guidance:

| Rule | Why |
|---|---|
| Use motion only for state continuity, not decoration. | The workspace should feel calm and practical. |
| Keep product UI motion under 300ms. | Frequent builder interactions should stay fast. |
| Use `ease-out` for entering UI. | New elements should feel immediately responsive. |
| Use `ease-in-out` for on-screen movement. | Existing elements should accelerate and settle naturally. |
| Animate only `opacity` and `transform`. | These avoid layout and paint work. |
| Avoid bounce in workspace presets. | Bounce feels playful and can reduce precision. |
| Pair related elements with the same duration and easing. | Panels and their rows should feel like one unit. |
| Support `prefers-reduced-motion`. | Motion should never be required to understand the UI. |

## MVP Presets

| Preset | Use | Timing |
|---|---|---|
| `none` | Reduced motion, instant state updates | `0ms` |
| `quiet_reveal` | First generated preview appears | `160-220ms` |
| `soft_patch` | A selected block updates after a voice revision | `160-180ms` |
| `drawer_in` | Structure panel or inspector appears | `180-220ms` |

## Command Model Boundary

Allowed:

```json
{
  "motion": {
    "preset": "quiet_reveal"
  }
}
```

Not allowed:

```json
{
  "motion": {
    "css": "animation: bounce 900ms linear infinite"
  }
}
```

The model describes intent. The app applies the preset.

## Implementation Pointer

The current preset registry lives in:

```txt
lib/motion-presets.ts
```
