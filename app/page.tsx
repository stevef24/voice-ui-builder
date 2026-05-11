"use client";

import { useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  Download,
  FileJson,
  Moon,
  Mic,
  Pause,
  Play,
  RefreshCcw,
  Square,
  Sun,
} from "lucide-react";
import type { DemoState, PipelinePhase, ToolCallName, ToolStatus, TurnResponse } from "@/lib/contracts";
import { defaultTranscript, mockDemoState, phaseToolStatus, toolOrder } from "@/lib/mock-data";

const pipeline: PipelinePhase[] = [
  "transcribing",
  "extracting_ui",
  "planning_motion",
  "preview_ready",
];

const primaryTrace: Array<{ label: string; tool: ToolCallName }> = [
  { label: "Transcript", tool: "transcribe_voice" },
  { label: "Schema", tool: "generate_ui_schema" },
  { label: "Patch", tool: "apply_patch" },
  { label: "Motion", tool: "generate_motion_plan" },
];

export default function Home() {
  const [demo, setDemo] = useState<DemoState>(mockDemoState);
  const [phase, setPhase] = useState<PipelinePhase>("preview_ready");
  const [prompt, setPrompt] = useState(defaultTranscript);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [source, setSource] = useState<"mock" | "openai">("mock");
  const [summary, setSummary] = useState("Ready to run with mock data, or add an API key for OpenAI mode.");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const statuses = useMemo(() => phaseToolStatus[phase] ?? phaseToolStatus.preview_ready, [phase]);

  async function runPipeline(transcript = prompt) {
    try {
      setSummary("Generating a validated UI spec...");
      for (const nextPhase of pipeline.slice(0, -1)) {
        setPhase(nextPhase);
        await wait(220);
      }

      const response = await fetch("/api/turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });
      const result = (await response.json()) as Partial<TurnResponse> & { error?: string };

      if (!response.ok || !result.state) {
        throw new Error(result.error ?? "Could not generate the UI turn.");
      }

      setDemo(result.state);
      setSource(result.source ?? "mock");
      setSummary(result.summary ?? "Generated a UI spec.");
      setPhase("preview_ready");
    } catch (error) {
      setPhase("idle");
      setSummary(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia) {
      await runPipeline();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
        setPhase("transcribing");
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const transcript = await transcribeAudio(blob);
        await runPipeline(transcript);
      };

      recorder.start();
      setIsRecording(true);
      setPhase("listening");
    } catch {
      await runPipeline();
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
  }

  async function transcribeAudio(audio: Blob) {
    const form = new FormData();
    form.append("audio", audio, "voice.webm");

    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: form,
      });
      const result = (await response.json()) as { transcript?: string };
      if (result.transcript) {
        setPrompt(result.transcript);
        return result.transcript;
      }
    } catch {
      setPrompt(defaultTranscript);
    }
    return defaultTranscript;
  }

  function revise() {
    setPhase("revising");
    setPrompt("Make it calmer. Keep the page white, reduce the borders, and slow the confirmation motion.");
  }

  return (
    <main className="workspace" data-theme={theme}>
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" />
          <span>Voice UI Builder</span>
        </div>
        <button
          className="theme-button"
          onClick={() => setTheme((value) => (value === "light" ? "dark" : "light"))}
          type="button"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
          {theme === "light" ? "Dark" : "Light"}
        </button>
      </header>

      <section className="document-shell" aria-label="Voice UI Builder demo">
        <div className="document-header">
          <h1>Speak an interface into existence</h1>
          <p>
            Voice becomes a transcript, a validated JSON render spec, and a tiny motion plan.
          </p>
        </div>

        <section className="composer" aria-label="Voice prompt">
          <textarea
            aria-label="Voice prompt transcript"
            className="prompt-input"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
          />
          <div className="composer-bar">
            <button
              aria-label={isRecording ? "Stop recording" : "Start recording"}
              className="icon-button"
              onClick={isRecording ? stopRecording : startRecording}
              type="button"
            >
              {isRecording ? <Pause size={15} /> : <Mic size={15} />}
            </button>
            <Waveform active={isRecording || phase === "transcribing"} />
            <button className="text-button" onClick={revise} type="button">
              <RefreshCcw size={14} />
              Revise
            </button>
            <button className="primary-button" onClick={() => runPipeline()} type="button">
              Run
            </button>
          </div>
        </section>

        <div className="run-status">
          <span>{source}</span>
          <p>{summary}</p>
        </div>

        <PipelineTrace statuses={statuses} />

        <section className="builder-grid" aria-label="Generated UI preview and structure">
          <PreviewCard demo={demo} phase={phase} />
          <StructurePanel demo={demo} statuses={statuses} />
        </section>

        <MotionStrip demo={demo} isPlaying={isPlaying} onToggle={() => setIsPlaying((value) => !value)} />
      </section>
    </main>
  );
}

function Waveform({ active }: { active: boolean }) {
  return (
    <div className={`waveform ${active ? "active" : ""}`} aria-hidden="true">
      {Array.from({ length: 18 }, (_, index) => (
        <span key={index} />
      ))}
    </div>
  );
}

function PipelineTrace({ statuses }: { statuses: Record<ToolCallName, ToolStatus> }) {
  return (
    <div className="trace" aria-label="Pipeline trace">
      {primaryTrace.map((item) => (
        <div className="trace-item" key={item.tool}>
          <span className={`status-dot ${statuses[item.tool]}`} />
          <span>{item.label}</span>
          <code>{item.tool}</code>
        </div>
      ))}
    </div>
  );
}

function PreviewCard({ demo, phase }: { demo: DemoState; phase: PipelinePhase }) {
  const copy = demo.structure.copy;
  const components = demo.structure.components;

  return (
    <article className="preview-card">
      <div className="section-heading">
        <div>
          <p>Preview</p>
          <h2>Rendered from JSON</h2>
        </div>
        <span className="phase-label">{phase.replaceAll("_", " ")}</span>
      </div>

      <div className="rendered-document">
        <div className="rendered-header">
          <div>
            <span className="muted-label">Generated page</span>
            <h3>{demo.artifact.title}</h3>
          </div>
          <button className="small-button" type="button">
            {copy[3] ?? "Export"}
          </button>
        </div>

        <div className="task-list">
          <TaskRow status="complete" title={copy[0] ?? "Capture voice request"} meta="transcribe_voice" />
          <TaskRow status="complete" title={components[2] ?? "Create layout structure"} meta="generate_ui_schema" />
          <TaskRow status={phase === "preview_ready" ? "complete" : "running"} title={copy[2] ?? "Apply motion plan"} meta="motion_ready" />
        </div>

        <div className="approval-note">
          <Check size={16} />
          <span>Ready for human review before export.</span>
        </div>
      </div>
    </article>
  );
}

function TaskRow({ status, title, meta }: { status: "complete" | "running"; title: string; meta: string }) {
  return (
    <div className="task-row">
      <span className={`checkbox ${status}`}>
        {status === "complete" ? <Check size={12} /> : null}
      </span>
      <span>{title}</span>
      <code>{meta}</code>
    </div>
  );
}

function StructurePanel({
  demo,
  statuses,
}: {
  demo: DemoState;
  statuses: Record<ToolCallName, ToolStatus>;
}) {
  return (
    <aside className="structure-panel" aria-label="Structure panel">
      <div className="section-heading">
        <div>
          <p>Structure</p>
          <h2>Spec outline</h2>
        </div>
        <FileJson size={16} />
      </div>

      <div className="outline">
        {demo.structure.components.slice(0, 6).map((component, index) => (
          <div className="outline-row" key={component} style={{ paddingLeft: 10 + index * 5 }}>
            {component}
          </div>
        ))}
      </div>

      <div className="token-list">
        {demo.structure.tokens.slice(0, 4).map((token) => (
          <div className="token" key={token.name}>
            {token.color ? <span className="swatch" style={{ background: token.color }} /> : <span className="swatch empty" />}
            <span>{token.name}</span>
            <code>{token.value}</code>
          </div>
        ))}
      </div>

      <div className="tool-list">
        {toolOrder.map((tool) => (
          <div className="tool-row" key={tool}>
            <span className={`status-dot ${statuses[tool]}`} />
            <code>{tool}</code>
            <span>{statuses[tool]}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

function MotionStrip({
  demo,
  isPlaying,
  onToggle,
}: {
  demo: DemoState;
  isPlaying: boolean;
  onToggle: () => void;
}) {
  return (
    <section className="motion-strip" aria-label="Motion plan">
      <button className="icon-button" onClick={onToggle} type="button" aria-label={isPlaying ? "Pause preview" : "Play preview"}>
        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
      </button>
      <div className="motion-title">
        <span>Motion</span>
        <strong>{demo.motion.mode}</strong>
      </div>
      <div className="tracks">
        {demo.motion.tracks.map((track, index) => (
          <span className="track" key={track.name}>
            <span style={{ width: `${44 + index * 10}%` }} />
          </span>
        ))}
      </div>
      <button className="text-button" type="button">
        <Download size={14} />
        Export
      </button>
      <button className="text-button" type="button">
        <Square size={13} />
        Stop
      </button>
      <button className="text-button" type="button">
        <ChevronDown size={14} />
        JSON render
      </button>
    </section>
  );
}

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
