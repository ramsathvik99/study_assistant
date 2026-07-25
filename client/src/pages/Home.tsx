import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileUploadZone } from "../features/fileUpload/FileUploadZone.js";
import { GenerateStudyPlanSchema, GenerateStudyPlanInput } from "../schemas/index.js";
import { useGenerateStudyPlan } from "../hooks/useGenerateStudyPlan.js";
import { StudySession } from "../types/index.js";
import { Button } from "../components/common/Button.js";
import {
  Sparkles, FileUp, AlignLeft, ArrowRight, X,
  BookOpen, Zap, BarChart2, Brain
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Constants ────────────────────────────────────────────────────────────────

interface HomeProps {
  onStartSession: (session: StudySession) => void;
  activeSession: StudySession | null;
}

const QUICK_PROMPTS = [
  "Operating system scheduling algorithms",
  "Database normalization up to 3NF",
  "Machine learning gradient descent",
  "TCP/IP networking fundamentals",
];

const DIFFICULTY_OPTS = ["Easy", "Medium", "Hard"] as const;

const DIFF_STYLE: Record<string, string> = {
  Easy:   "border-jade-500/40 text-jade-400 bg-jade-500/8",
  Medium: "border-amber-500/40 text-amber-400 bg-amber-500/8",
  Hard:   "border-rose-500/40  text-rose-400  bg-rose-500/8",
};

// ─── Component ────────────────────────────────────────────────────────────────

export const Home: React.FC<HomeProps> = ({ onStartSession, activeSession }) => {
  const [mode, setMode] = useState<"text" | "upload">("text");
  const [fileName, setFileName] = useState<string | null>(null);

  const {
    register, handleSubmit, watch, setValue, reset,
    formState: { errors },
  } = useForm<GenerateStudyPlanInput>({
    resolver: zodResolver(GenerateStudyPlanSchema),
    defaultValues: { topic: "", difficulty: "Medium" },
  });

  const topic      = watch("topic");
  const difficulty = watch("difficulty");

  const { mutate: generate, isPending, reset: resetMutation } = useGenerateStudyPlan({
    onSuccess: onStartSession,
  });

  const submit = (data: GenerateStudyPlanInput) => generate(data);

  const clearInput = () => {
    reset();
    setFileName(null);
    resetMutation();
  };

  return (
    <div className="min-h-[calc(100dvh-48px)] flex flex-col">
      {/* ── Hero ambient glow ─────────────────────────────────────────── */}
      <div className="hero-glow" aria-hidden />

      <div className="flex-1 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-14 space-y-10">

        {/* ── Page header ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <span className="badge-amber">
              <Sparkles className="w-3 h-3" /> AI-Powered
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-void-50 leading-[1.05]">
            Turn any topic into<br />
            <span className="text-gradient-amber">a complete study system.</span>
          </h1>
          <p className="text-void-400 text-base max-w-lg leading-relaxed">
            Paste notes, name a subject, or upload a document — Mosaic builds flashcards, quizzes, roadmaps, and mnemonics in seconds.
          </p>
        </motion.div>

        {/* ── Main layout: generator + sidebar ─────────────────────────── */}
        <div className="grid gap-5 lg:grid-cols-[1fr_300px]">

          {/* ── Left: Generator card ───────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.44, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="card-raised overflow-hidden"
          >
            {/* Tab bar */}
            <div className="flex border-b border-[rgba(255,255,255,0.07)]">
              {(["text", "upload"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={[
                    "flex items-center gap-2 px-5 py-3.5 text-[13px] font-medium transition-colors focus-ring",
                    mode === m
                      ? "text-amber-400 border-b-2 border-amber-500 -mb-px bg-amber-500/5"
                      : "text-void-500 hover:text-void-300 border-b-2 border-transparent",
                  ].join(" ")}
                >
                  {m === "text" ? <AlignLeft className="w-3.5 h-3.5" /> : <FileUp className="w-3.5 h-3.5" />}
                  {m === "text" ? "Write / Paste" : "Upload Document"}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              <AnimatePresence mode="wait" initial={false}>
                {mode === "text" ? (
                  <motion.form
                    key="text-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    onSubmit={handleSubmit(submit)}
                    className="space-y-5"
                  >
                    {/* Textarea label row */}
                    <div className="flex items-center justify-between mb-2">
                      <label className="label">
                        {fileName ? `Source — ${fileName}` : "Study material"}
                      </label>
                      {topic && (
                        <button
                          type="button"
                          onClick={clearInput}
                          className="flex items-center gap-1 text-[11px] text-void-500 hover:text-rose-400 transition-colors"
                        >
                          <X className="w-3 h-3" /> Clear
                        </button>
                      )}
                    </div>

                    <textarea
                      {...register("topic")}
                      placeholder="Paste notes, a syllabus, or simply name a subject…"
                      disabled={isPending}
                      rows={7}
                      className={[
                        "input resize-none w-full",
                        errors.topic ? "border-rose-500/60 focus:!border-rose-500 focus:!shadow-[0_0_0_3px_rgba(244,63,94,.15)]" : "",
                      ].join(" ")}
                    />
                    {errors.topic && (
                      <p className="text-xs text-rose-400 -mt-2">{errors.topic.message}</p>
                    )}

                    {/* Bottom controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                      {/* Difficulty */}
                      <div className="flex items-center gap-2">
                        <span className="label mr-1">Depth</span>
                        {DIFFICULTY_OPTS.map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setValue("difficulty", d)}
                            className={[
                              "px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all",
                              difficulty === d
                                ? DIFF_STYLE[d]
                                : "border-[rgba(255,255,255,0.08)] text-void-500 hover:text-void-300 hover:border-[rgba(255,255,255,0.14)]",
                            ].join(" ")}
                          >
                            {d}
                          </button>
                        ))}
                      </div>

                      {/* Submit */}
                      <Button
                        type="submit"
                        variant="amber"
                        size="md"
                        isLoading={isPending}
                        icon={<Sparkles className="w-3.5 h-3.5" />}
                        className="sm:self-end"
                      >
                        {isPending ? "Building plan…" : "Generate study plan"}
                      </Button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="upload-zone"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <FileUploadZone
                      onUploadSuccess={(text, name) => {
                        setValue("topic", text, { shouldValidate: true });
                        setFileName(name);
                        setMode("text");
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── Right sidebar ──────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.44, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4"
          >
            {/* Active session card */}
            <div className={[
              "rounded-xl border p-5 space-y-4",
              activeSession
                ? "bg-amber-500/6 border-amber-500/20"
                : "border-[rgba(255,255,255,0.07)] bg-void-900/60",
            ].join(" ")}>
              <div className="flex items-center justify-between">
                <span className="label">Active session</span>
                {activeSession && (
                  <span className="badge-amber">live</span>
                )}
              </div>

              {activeSession ? (
                <>
                  <div>
                    <p className="text-void-50 font-semibold text-sm leading-snug line-clamp-2">
                      {activeSession.studyPlan.title}
                    </p>
                    <p className="text-void-500 text-xs mt-1 truncate">"{activeSession.topic}"</p>
                  </div>
                  <Button
                    variant="amber"
                    size="sm"
                    iconEnd={<ArrowRight className="w-3.5 h-3.5" />}
                    className="w-full"
                    onClick={() => window.location.assign("/session")}
                  >
                    Open study room
                  </Button>
                </>
              ) : (
                <p className="text-void-500 text-xs">
                  No active session. Generate a plan above to get started.
                </p>
              )}
            </div>

            {/* What you get */}
            <div className="card rounded-xl p-5 space-y-3">
              <p className="label">What you get</p>
              {[
                { icon: Brain,     label: "AI summary",    desc: "Core ideas distilled" },
                { icon: Zap,       label: "Flashcards",    desc: "Spaced recall practice" },
                { icon: BarChart2, label: "Quizzes",       desc: "Timed question sets" },
                { icon: BookOpen,  label: "Roadmap",       desc: "Sequenced learning path" },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-void-800 border border-[rgba(255,255,255,0.07)] flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-void-200 text-[13px] font-medium">{label}</p>
                    <p className="text-void-500 text-[11px]">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick-start prompts */}
            <div className="card rounded-xl p-5 space-y-2">
              <p className="label mb-3">Quick starts</p>
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => {
                    setValue("topic", prompt, { shouldValidate: true });
                    setMode("text");
                  }}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12px] text-void-400 hover:text-void-100 hover:bg-white/5 border border-transparent hover:border-[rgba(255,255,255,0.08)] transition-all group"
                >
                  <ArrowRight className="w-3 h-3 text-amber-500/50 group-hover:text-amber-400 shrink-0 transition-colors" />
                  {prompt}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
