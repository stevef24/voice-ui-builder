# 04 — json-render UI Runtime

## Decision

Use json-render as the schema-constrained UI runtime.

The model should generate JSON specs. The app should render those specs through a known component registry.

```txt
Model does not generate live React.
Model generates JSON.
json-render renders approved components.
```

## Why json-render fits this project

json-render is built around a helpful separation:

```txt
Catalog = available UI vocabulary
Registry = actual platform implementation
Spec = generated JSON UI
Renderer = turns spec into UI
```

That matches the exact demo goal: AI should assemble interfaces from predefined components, not invent arbitrary code.

## What "predefined components" means

You do need predefined components.

But you do not need to predefine every final UI pattern.

Do not predefine:

```txt
SaaSDashboard
PricingDashboard
AnalyticsDashboard
DarkDashboard
DashboardWithChurnWarning
```

Define reusable building blocks:

```txt
Section
Stack
Grid
Card
MetricCard
Heading
Text
Badge
Button
ChartPlaceholder
Table
Alert
Divider
```

The AI composes those into many possible screens.

## MVP component catalog

Start small:

| Component | Purpose |
|---|---|
| `DashboardShell` | Root dashboard wrapper with theme/background props |
| `Section` | Horizontal page section |
| `Grid` | Responsive grid layout |
| `Stack` | Vertical/horizontal spacing |
| `Card` | Generic surface |
| `MetricCard` | KPI card with label/value/trend |
| `ChartPlaceholder` | Fake chart for demo |
| `Table` | Recent activity / customer list |
| `Alert` | Warning or callout |
| `Heading` | Section titles |
| `Text` | Body text |
| `Badge` | Small status markers |
| `Button` | Actions |

## Props should be constrained

Bad:

```json
{
  "className": "bg-[#0f172a] p-[31px] shadow-[0_0_48px_rgba(16,185,129,.7)]"
}
```

Good:

```json
{
  "theme": "dark",
  "surface": "glass",
  "accent": "emerald",
  "shadow": "soft",
  "radius": "2xl"
}
```

## Suggested token enums

```ts
type Theme = "light" | "dark" | "system";
type Accent = "blue" | "emerald" | "purple" | "rose" | "amber" | "neutral";
type Tone = "neutral" | "brand" | "success" | "warning" | "danger" | "muted";
type Surface = "flat" | "solid" | "soft" | "glass" | "outline";
type Radius = "none" | "sm" | "md" | "lg" | "xl" | "2xl";
type Shadow = "none" | "soft" | "medium" | "strong";
type Motion = "none" | "quiet_reveal" | "soft_patch" | "drawer_in";
```

Motion is a preset enum, not a free-form CSS field. See `docs/motion-presets.md`.

## Spec shape

Use a normalized spec shape internally. An adapter can convert to the exact json-render spec format if the library schema changes.

```json
{
  "version": "demo-0.1",
  "root": "dashboard_root",
  "elements": {
    "dashboard_root": {
      "type": "DashboardShell",
      "props": {
        "theme": "dark",
        "accent": "emerald"
      },
      "children": ["hero", "metrics_grid", "main_grid"]
    }
  }
}
```

## Rendering responsibility

The registry should own actual UI implementation:

```ts
const registry = defineRegistry(catalog, {
  components: {
    MetricCard: ({ props }) => (
      <MetricCard
        label={props.label}
        value={props.value}
        tone={props.tone}
        motion={props.motion}
      />
    ),
  },
});
```

The model chooses `tone: "danger"`. The registry decides what danger looks like.

## Streaming vs batch generation

json-render supports streaming-style generative UI. For the first demo, use a structured command response and then render.

Why:

- easier schema validation
- easier patching
- easier tests
- easier to explain
- fewer moving parts during live demo

Future version:

- stream JSONL patches into the canvas as the model responds
- progressively reveal components
- show a live build animation

## Design rule

The live canvas should not be where new arbitrary capabilities are invented.

New capabilities should be added by expanding the catalog and registry.

That is the open-source contribution model:

```txt
Add a component -> add catalog definition -> add registry implementation -> add examples -> add tests
```
