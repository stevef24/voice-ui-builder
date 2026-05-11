import type { MotionPlan } from "./contracts";

export type MotionPresetName = "none" | "quietReveal" | "softPatch" | "drawerIn";

export type MotionPresetRule = {
  rule: string;
  reason: string;
};

export const motionPresetRules: MotionPresetRule[] = [
  {
    rule: "Use motion only for state continuity, not decoration.",
    reason: "The builder should feel like a product workspace, not a promo page.",
  },
  {
    rule: "Keep product UI motion under 300ms.",
    reason: "Frequent builder interactions should stay fast and calm.",
  },
  {
    rule: "Use ease-out for entering UI and ease-in-out for on-screen movement.",
    reason: "Entering elements should feel responsive; existing elements should move naturally.",
  },
  {
    rule: "Animate only opacity and transform.",
    reason: "These properties avoid layout and paint work.",
  },
  {
    rule: "Avoid bounce in workspace presets.",
    reason: "Bounce reads playful and distracts from precision.",
  },
  {
    rule: "Pair related elements with the same duration and easing.",
    reason: "Panels, overlays, and timeline rows should feel like one unit.",
  },
  {
    rule: "Disable preset motion when the user prefers reduced motion.",
    reason: "Motion should never be required to understand the interface.",
  },
];

export const motionPresets: Record<MotionPresetName, MotionPlan> = {
  none: {
    mode: "none",
    tracks: [],
  },
  quietReveal: {
    mode: "quiet_reveal",
    tracks: [
      { name: "Transcript settles", durationMs: 180, delayMs: 0, easing: "cubic-bezier(0.215, 0.61, 0.355, 1)" },
      { name: "Preview appears", durationMs: 220, delayMs: 60, easing: "cubic-bezier(0.215, 0.61, 0.355, 1)" },
      { name: "Structure updates", durationMs: 180, delayMs: 90, easing: "cubic-bezier(0.455, 0.03, 0.515, 0.955)" },
      { name: "Motion settles", durationMs: 160, delayMs: 120, easing: "cubic-bezier(0.215, 0.61, 0.355, 1)" },
    ],
  },
  softPatch: {
    mode: "soft_patch",
    tracks: [
      { name: "Selected block updates", durationMs: 180, delayMs: 0, easing: "cubic-bezier(0.455, 0.03, 0.515, 0.955)" },
      { name: "Diff row appears", durationMs: 160, delayMs: 50, easing: "cubic-bezier(0.215, 0.61, 0.355, 1)" },
    ],
  },
  drawerIn: {
    mode: "drawer_in",
    tracks: [
      { name: "Panel enters", durationMs: 220, delayMs: 0, easing: "cubic-bezier(0.215, 0.61, 0.355, 1)" },
      { name: "Rows resolve", durationMs: 180, delayMs: 60, easing: "cubic-bezier(0.215, 0.61, 0.355, 1)" },
    ],
  },
};
