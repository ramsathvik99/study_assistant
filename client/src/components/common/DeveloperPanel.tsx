import React, { useState } from "react";
import {
  Code, Clock, CheckCircle2, XCircle, Cpu, Copy,
  AlertTriangle, Zap, Database, FileText, Layers,
  ChevronDown, ChevronUp, HardDrive, Timer, Play
} from "lucide-react";
import { StudyPlan } from "../../types/index.js";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DebugMetadata {
  responseTime?: number;
  requestTime?: number;
  timestamp?: number;
  model?: string;
  tokenUsage?: { promptTokens?: number; completionTokens?: number; totalTokens?: number; };
  validationStatus?: "valid" | "invalid" | "pending";
  validationError?: string;
  validationTime?: number;
  jsonParseTime?: number;
  payloadSize?: number;
  warnings?: string[];
}

interface DeveloperPanelProps {
  rawJson: string;
  metadata?: DebugMetadata;
  studyPlan?: StudyPlan;
  animationsEnabled?: boolean;
}

type SectionId = "request" | "validation" | "raw" | "schema" | "performance" | "warnings";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = {
  ts: (t?: number) => t ? new Date(t).toLocaleString() : "—",
  bytes: (b?: number) => {
    if (!b) return "—";
    if (b < 1024) return `${b} B`;
    if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
    return `${(b / 1048576).toFixed(2)} MB`;
  },
  json: (s: string) => {
    try { return JSON.stringify(JSON.parse(s), null, 2); } catch { return s; }
  },
};

// ─── Syntax highlight ─────────────────────────────────────────────────────────

const highlight = (json: string) =>
  json
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(
      /("(\\u[\dA-Fa-f]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      (m) => {
        let cls = "text-violet-400"; // number
        if (/^"/.test(m))   cls = /:$/.test(m) ? "text-amber-300" : "text-jade-400"; // key : string
        if (/true|false/.test(m)) cls = "text-amber-400";
        if (/null/.test(m)) cls = "text-void-500";
        return `<span class="${cls}">${m}</span>`;
      }
    );

// ─── Collapsible section wrapper ──────────────────────────────────────────────

const Section: React.FC<{
  id: SectionId; open: Set<SectionId>; onToggle: (id: SectionId) => void;
  icon: React.ReactNode; title: string; badge?: React.ReactNode; children: React.ReactNode;
}> = ({ id, open, onToggle, icon, title, badge, children }) => {
  const isOpen = open.has(id);
  return (
    <div className="border-t border-[rgba(255,255,255,0.06)]">
      <button
        onClick={() => onToggle(id)}
        className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-void-900/60 transition-colors focus-ring"
      >
        <span className="text-void-500 shrink-0">{icon}</span>
        <span className="text-[12px] font-semibold text-void-300 tracking-wide flex-1 text-left">{title}</span>
        {badge}
        {isOpen
          ? <ChevronUp   className="w-3.5 h-3.5 text-void-600 shrink-0" />
          : <ChevronDown className="w-3.5 h-3.5 text-void-600 shrink-0" />}
      </button>
      {isOpen && (
        <div className="px-5 pb-5">{children}</div>
      )}
    </div>
  );
};

// ─── Metric cell ─────────────────────────────────────────────────────────────

const MetricCell: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({
  icon, label, value,
}) => (
  <div className="rounded-lg border border-[rgba(255,255,255,0.07)] bg-void-950/60 p-3 space-y-1.5">
    <div className="flex items-center gap-1.5 text-void-600">
      {icon}
      <span className="label">{label}</span>
    </div>
    <p className="font-mono text-[12px] font-semibold text-void-200 truncate">{value}</p>
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

export const DeveloperPanel: React.FC<DeveloperPanelProps> = ({
  rawJson,
  metadata = {},
  studyPlan,
}) => {
  const [panelOpen, setPanelOpen] = useState(false);
  const [sections,  setSections]  = useState<Set<SectionId>>(new Set(["request", "validation"]));
  const [copied,    setCopied]    = useState(false);

  const toggleSection = (id: SectionId) => {
    setSections((p) => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(rawJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  };

  const validIcon = metadata.validationStatus === "valid"
    ? <CheckCircle2 className="w-3.5 h-3.5 text-jade-500" />
    : metadata.validationStatus === "invalid"
    ? <XCircle className="w-3.5 h-3.5 text-rose-500" />
    : <Clock className="w-3.5 h-3.5 text-amber-500" />;

  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-void-950/80 overflow-hidden">
      {/* Panel header toggle */}
      <button
        onClick={() => setPanelOpen((p) => !p)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-void-900/50 transition-colors focus-ring"
      >
        <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
          <Code className="w-3.5 h-3.5 text-violet-400" />
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-void-200">AI Response Inspector</span>
            {validIcon}
            <span className="label text-void-600">
              ({metadata.validationStatus ?? "—"})
            </span>
          </div>
          <p className="text-[11px] text-void-600 mt-0.5">
            {panelOpen ? "Click to collapse" : "Click to expand debug data"}
          </p>
        </div>
        {panelOpen
          ? <ChevronUp   className="w-4 h-4 text-void-600 shrink-0" />
          : <ChevronDown className="w-4 h-4 text-void-600 shrink-0" />}
      </button>

      {panelOpen && (
        <>
          {/* ── Request info ─────────────────────────────────────────── */}
          <Section id="request" open={sections} onToggle={toggleSection}
            icon={<Play className="w-3.5 h-3.5" />} title="Request Info">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              <MetricCell icon={<Cpu    className="w-3 h-3" />} label="Model"         value={metadata.model ?? "—"} />
              <MetricCell icon={<Clock  className="w-3 h-3" />} label="Request time"  value={fmt.ts(metadata.requestTime)} />
              <MetricCell icon={<Timer  className="w-3 h-3" />} label="Response time" value={metadata.responseTime ? `${metadata.responseTime.toFixed(2)}s` : "—"} />
              <MetricCell icon={<Clock  className="w-3 h-3" />} label="Timestamp"     value={fmt.ts(metadata.timestamp)} />
              {metadata.tokenUsage && (
                <>
                  <MetricCell icon={<Database className="w-3 h-3" />} label="Prompt tokens"     value={`${metadata.tokenUsage.promptTokens ?? "—"}`} />
                  <MetricCell icon={<Database className="w-3 h-3" />} label="Completion tokens" value={`${metadata.tokenUsage.completionTokens ?? "—"}`} />
                  <MetricCell icon={<Database className="w-3 h-3" />} label="Total tokens"      value={`${metadata.tokenUsage.totalTokens ?? "—"}`} />
                </>
              )}
            </div>
          </Section>

          {/* ── Validation ───────────────────────────────────────────── */}
          <Section id="validation" open={sections} onToggle={toggleSection}
            icon={validIcon} title="Validation">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[12px]">
                <CheckCircle2 className="w-4 h-4 text-jade-500 shrink-0" />
                <span className="text-void-300">JSON parsed successfully</span>
              </div>
              <div className="flex items-center gap-2 text-[12px]">
                <CheckCircle2 className="w-4 h-4 text-jade-500 shrink-0" />
                <span className="text-void-300">Schema validation passed</span>
              </div>
              {metadata.validationError && (
                <div className="flex items-center gap-2 text-[12px]">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="text-rose-400">{metadata.validationError}</span>
                </div>
              )}
            </div>
          </Section>

          {/* ── Raw JSON ─────────────────────────────────────────────── */}
          <Section id="raw" open={sections} onToggle={toggleSection}
            icon={<Code className="w-3.5 h-3.5" />} title="Raw JSON"
            badge={
              <button
                onClick={(e) => { e.stopPropagation(); copyJson(); }}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] text-void-500 hover:text-void-200 hover:bg-white/5 transition-colors"
                title="Copy JSON"
              >
                <Copy className="w-3 h-3" />
                {copied ? "Copied!" : "Copy"}
              </button>
            }
          >
            <div className="rounded-xl overflow-hidden border border-[rgba(255,255,255,0.07)] bg-void-950">
              <div className="flex items-center justify-between px-4 py-2 bg-void-900/80 border-b border-[rgba(255,255,255,0.06)]">
                <span className="font-mono text-[10px] text-void-500">response.json</span>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <div className="flex">
                  {/* Line numbers */}
                  <div className="select-none text-right py-4 px-3 min-w-[40px] bg-void-950/60 border-r border-[rgba(255,255,255,0.05)]">
                    {fmt.json(rawJson).split("\n").map((_, i) => (
                      <div key={i} className="font-mono text-[10px] text-void-700 leading-5">{i + 1}</div>
                    ))}
                  </div>
                  <pre className="flex-1 px-4 py-4 font-mono text-[11px] overflow-x-auto leading-5 whitespace-pre">
                    <code dangerouslySetInnerHTML={{ __html: highlight(fmt.json(rawJson)) }} />
                  </pre>
                </div>
              </div>
            </div>
          </Section>

          {/* ── Schema view ──────────────────────────────────────────── */}
          {studyPlan && (
            <Section id="schema" open={sections} onToggle={toggleSection}
              icon={<Layers className="w-3.5 h-3.5" />} title="Schema View">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(
                  [
                    ["title",        studyPlan.title],
                    ["difficulty",   studyPlan.difficulty],
                    ["estimatedTime",studyPlan.estimatedStudyTime],
                    ["keyConcepts",  `${studyPlan.keyConcepts.length} items`],
                    ["flashcards",   `${studyPlan.flashcards.length} items`],
                    ["quiz",         `${studyPlan.quiz.length} items`],
                    ["roadmap",      `${studyPlan.roadmap.length} phases`],
                    ["revisionTips", `${studyPlan.revisionTips.length} items`],
                    ["mnemonics",    `${studyPlan.mnemonics.length} items`],
                  ] as [string, string][]
                ).map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-[rgba(255,255,255,0.07)] bg-void-950/60 p-2.5">
                    <p className="font-mono text-[10px] text-void-600 truncate">{k}</p>
                    <p className="font-mono text-[11px] text-jade-400 truncate mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* ── Performance ──────────────────────────────────────────── */}
          <Section id="performance" open={sections} onToggle={toggleSection}
            icon={<Zap className="w-3.5 h-3.5" />} title="Performance">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              <MetricCell icon={<Timer    className="w-3 h-3" />} label="Response time"  value={metadata.responseTime  ? `${metadata.responseTime.toFixed(2)}s`  : "—"} />
              <MetricCell icon={<HardDrive className="w-3 h-3" />} label="Payload size" value={fmt.bytes(metadata.payloadSize)} />
              <MetricCell icon={<Zap      className="w-3 h-3" />} label="Validation"    value={metadata.validationTime ? `${metadata.validationTime.toFixed(3)}s` : "—"} />
              <MetricCell icon={<Database className="w-3 h-3" />} label="JSON parse"    value={metadata.jsonParseTime  ? `${metadata.jsonParseTime.toFixed(3)}s`  : "—"} />
            </div>
          </Section>

          {/* ── Warnings ─────────────────────────────────────────────── */}
          {metadata.warnings && metadata.warnings.length > 0 && (
            <Section id="warnings" open={sections} onToggle={toggleSection}
              icon={<AlertTriangle className="w-3.5 h-3.5" />} title="Warnings"
              badge={
                <span className="badge-amber text-[10px]">{metadata.warnings.length}</span>
              }
            >
              <div className="space-y-2">
                {metadata.warnings.map((w, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-500/6 border border-amber-500/20">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-[12px] text-amber-200">{w}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </>
      )}
    </div>
  );
};

export default DeveloperPanel;
