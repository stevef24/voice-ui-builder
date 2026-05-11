# Voice To Motion UI Design System

## Overview

Voice To Motion UI is a dark, minimal product demo for a future creative AI pipeline: voice prompt -> image direction -> UI structure -> animated preview. The interface should feel closer to an OpenAI creation surface than a dense dashboard: centered, quiet, conversational, and focused on one artifact at a time.

The product is not a marketing page, CRM dashboard, or decorative concept board. It is a serious AI workbench where tool use is visible but understated. The main screen centers the spoken intent and generated artifact, with supporting state shown as a subtle activity trace, compact motion timeline, and optional structure drawer.

The signature moment is watching a plain spoken idea become an image, then a structured interface, then motion. The UI should look calm enough for a founder/operator to understand and technical enough for builders to trust.

## Colors

### Foundation
- **Canvas Black** (`{colors.canvas}`): `#050607` - full app background.
- **Canvas Raised** (`{colors.canvas-raised}`): `#090B0D` - elevated app zones.
- **Surface** (`{colors.surface}`): `#0E1114` - artifact card and drawers.
- **Surface Soft** (`{colors.surface-soft}`): `#14181D` - controls and nested regions.
- **Surface Strong** (`{colors.surface-strong}`): `#1A2027` - active selected state.

### Borders
- **Hairline** (`{colors.hairline}`): `rgba(255, 255, 255, 0.08)` - default 1px borders.
- **Hairline Soft** (`{colors.hairline-soft}`): `rgba(255, 255, 255, 0.05)` - quiet dividers.
- **Hairline Strong** (`{colors.hairline-strong}`): `rgba(255, 255, 255, 0.14)` - active borders.

### Text
- **Ink** (`{colors.ink}`): `#F4F7FA` - primary text.
- **Ink Soft** (`{colors.ink-soft}`): `#C7CDD4` - secondary text.
- **Ink Muted** (`{colors.ink-muted}`): `#8B949E` - tertiary text and placeholders.
- **Ink Faint** (`{colors.ink-faint}`): `#5F6974` - disabled text, ticks, minor metadata.

### Accent
- **Accent Blue** (`{colors.accent-blue}`): `#7AB7FF` - selected artifact, primary action.
- **Accent Cyan** (`{colors.accent-cyan}`): `#61D8F5` - realtime voice and transcription.
- **Accent Green** (`{colors.accent-green}`): `#65D990` - complete and validated states.
- **Accent Amber** (`{colors.accent-amber}`): `#E7BE61` - queued, pending review.
- **Accent Red** (`{colors.accent-red}`): `#F07474` - failed validation.
- **Motion Violet** (`{colors.motion-violet}`): `#A9A3FF` - timeline keyframes only.

## Typography

### Font Family
Use `Inter`, `ui-sans-serif`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Helvetica Neue`, `Arial`, sans-serif. Use a system mono stack for tools, JSON, and timestamps.

### Type Scale

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---:|---:|---:|---:|---|
| `{typography.display}` | 34px | 560 | 1.12 | 0 | Main prompt/artifact heading |
| `{typography.heading-1}` | 24px | 560 | 1.20 | 0 | Drawer or major region title |
| `{typography.heading-2}` | 18px | 560 | 1.30 | 0 | Section title |
| `{typography.heading-3}` | 15px | 560 | 1.35 | 0 | Card title |
| `{typography.body}` | 14px | 400 | 1.50 | 0 | Primary UI copy |
| `{typography.body-medium}` | 14px | 520 | 1.50 | 0 | Buttons, active labels |
| `{typography.small}` | 12px | 400 | 1.45 | 0 | Metadata and helper text |
| `{typography.micro}` | 11px | 520 | 1.35 | 0.02em | Status chips, timestamps |
| `{typography.mono}` | 12px | 450 | 1.50 | 0 | Tool names, schema snippets |

### Principles
- Typography should be compact, calm, and readable.
- Do not use oversized dashboard headings.
- Do not scale type with viewport width.
- Use mono text only when the content is actually code, schema, or tool-related.

## Layout

### App Shell
- Full-window app on `{colors.canvas}`.
- Center content in a max-width shell around 1180px.
- Main vertical flow:
  - top header
  - centered voice prompt surface
  - central generated artifact
  - subtle activity trace
  - compact motion timeline
- A structure drawer appears as a right-side sheet on desktop and a bottom sheet/tab panel on mobile.

### Spacing
- Base unit: 4px.
- Use 12px and 16px as the main rhythm.
- Keep more negative space around the central artifact than around supporting controls.
- Avoid dense permanent rails unless a drawer is open.

### Container Model
- One main artifact card owns the screen.
- Supporting panels should feel like drawers, traces, and strips.
- Do not use card grids or marketing section bands.

## Elevation

| Level | Treatment | Use |
|---|---|---|
| 0 | No shadow, hairline border | Default controls |
| 1 | `0 1px 2px rgba(0,0,0,0.24)` | Buttons, small rows |
| 2 | `0 18px 60px rgba(0,0,0,0.32)` | Main artifact card |
| 3 | `0 24px 80px rgba(0,0,0,0.42)` | Structure drawer |

Most depth should come from contrast, border, and spacing rather than heavy shadows.

## Shapes

| Token | Value | Use |
|---|---:|---|
| `{rounded.xs}` | 4px | Ticks, tiny chips |
| `{rounded.sm}` | 6px | Tool rows |
| `{rounded.md}` | 8px | Buttons, inputs |
| `{rounded.lg}` | 10px | Strips, nested panels |
| `{rounded.xl}` | 12px | Artifact card and drawer |
| `{rounded.full}` | 9999px | Status dots and tiny progress pills only |

Buttons are quiet rectangles, not pill CTAs. Full pill shapes are reserved for tiny status and progress indicators.

## Components

### `voice-prompt`
- Centered, conversational input surface.
- Contains microphone control, waveform, transcript, and one primary action.
- Transcript should feel like a generated message, not a form field.

### `artifact-card`
- Central generated visual/UI artifact.
- Uses `{colors.surface}` background, `1px` hairline border, 12px radius, and restrained level-2 shadow.
- Contains generated visual direction and live rendered UI preview.

### `activity-trace`
- A horizontal or stacked list of compact state rows.
- Default labels: `voice captured`, `image generated`, `UI mapped`, `motion planned`.
- Tool names may appear in mono as secondary metadata.

### `tool-call-row`
- 32-40px tall.
- Left status dot/check, middle label, right short result.
- Tool calls: `transcribe_voice`, `generate_image`, `analyze_image`, `extract_components`, `generate_ui_schema`, `generate_motion_plan`.

### `structure-drawer`
- Optional detail drawer, not always visually dominant.
- Contains component tree, token grid, schema snippet, and export actions.
- Should open from the right on desktop and become a bottom panel on mobile.

### `motion-timeline`
- Compact bottom strip.
- Contains play control, four short tracks, keyframes, and export buttons.
- Should prove animation without turning the app into a video editor.

### Buttons
- `button-primary`: blue background, dark text, 36-40px height, 8px radius.
- `button-secondary`: dark surface, light text, hairline border, 36-40px height.
- `button-ghost`: transparent, muted text, 32-36px height.
- `icon-button`: 32-36px square, hairline border, 8px radius.

## Signature Screens

### Idle
Centered voice prompt asks for an interface idea. Artifact card is empty and quiet. Trace rows are muted.

### Generating Image
Voice transcript locks. `generate_image` runs. Main artifact card reveals the image direction.

### Mapping UI
`analyze_image`, `extract_components`, and `generate_ui_schema` populate the structure drawer. Artifact card transitions from generated image to live UI structure.

### Motion Preview
Timeline activates. `generate_motion_plan` completes. Preview animates the generated UI and exposes export actions.

### Revision
User speaks a change such as "make it more premium and slower." The app updates intent and regenerates the smallest affected layer.

## Do's And Don'ts

### Do
- Keep one calm central artifact as the hero of the product screen.
- Make the pipeline legible without looking like debug software.
- Show tool use as elegant activity, not raw logs.
- Keep the structure drawer optional and secondary.
- Use blue/cyan/green accents for state only.
- Keep text concise and code-native.
- Make the demo easy to understand in a 60-90 second recording.

### Don't
- Do not copy Notion's pastel palette, yellow banners, sticky notes, or illustrated hero style.
- Do not use decorative blobs, bokeh, mesh wires, gradient orbs, or purple background washes.
- Do not create a landing page.
- Do not use pill-shaped primary buttons.
- Do not make the default view a dense admin dashboard.
- Do not put JSON or schema dumps in the center of the experience.
- Do not hide the tool calls entirely.

## Responsive Behavior

| Name | Width | Behavior |
|---|---:|---|
| Mobile | < 640px | Single-column flow; drawer becomes bottom panel |
| Tablet | 640-1023px | Centered flow with drawer below artifact |
| Desktop | 1024-1439px | Centered artifact with optional right drawer |
| Wide | >= 1440px | Same layout with more breathing room |

Controls must keep a 40px touch target on mobile. The artifact should maintain a stable aspect ratio and never overflow.

## Image Generation Prompting Rules

When generating concept images:
- Ask for one dark-mode 16:9 product screen.
- Center the voice prompt and generated artifact.
- Use an activity trace instead of permanent heavy rails.
- Show the structure drawer only as an optional side sheet.
- Include a compact bottom motion timeline.
- Keep labels legible and sparse.
- Use no logos, no external brand marks, and no decorative background art.
- Make the screen look like a shippable AI product, not a concept poster.

## Animation Rules

Motion should clarify sequence:
- Voice waveform animates while listening.
- Artifact card fades/slides in after image generation.
- Activity trace rows progress from waiting -> running -> complete.
- Structure drawer rows populate top to bottom.
- Timeline keyframes appear after motion planning.
- Generated UI preview animates with calm 300-600ms transitions.
- UI chrome uses 150-240ms transitions.
- Respect `prefers-reduced-motion`.
