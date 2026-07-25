import React, { useState } from "react";
import { RoadmapPhase, RoadmapTask } from "../../types/index.js";
import { Reorder, motion, AnimatePresence } from "framer-motion";
import { Map, CheckCircle2, Circle, ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { heightCollapse } from "../../animations/variants.js";

interface RoadmapTimelineProps {
  roadmap: RoadmapPhase[];
  onUpdateRoadmap: (updated: RoadmapPhase[]) => void;
  animationsEnabled?: boolean;
}

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({
  roadmap,
  onUpdateRoadmap,
  animationsEnabled = true,
}) => {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({ 0: true });

  const togglePhase = (idx: number) =>
    setExpanded((p) => ({ ...p, [idx]: !p[idx] }));

  const toggleTask = (phaseIdx: number, taskId: string) => {
    const updated = [...roadmap];
    const ti = updated[phaseIdx].tasks.findIndex((t) => t.id === taskId);
    if (ti >= 0) {
      updated[phaseIdx].tasks[ti] = {
        ...updated[phaseIdx].tasks[ti],
        completed: !updated[phaseIdx].tasks[ti].completed,
      };
      onUpdateRoadmap(updated);
    }
  };

  const reorderTasks = (phaseIdx: number, newTasks: RoadmapTask[]) => {
    const updated = [...roadmap];
    updated[phaseIdx] = { ...updated[phaseIdx], tasks: newTasks };
    onUpdateRoadmap(updated);
  };

  // ── Overall progress ──
  let totalTasks = 0, doneTasks = 0;
  roadmap.forEach((p) => p.tasks.forEach((t) => { totalTasks++; if (t.completed) doneTasks++; }));
  const overallPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-jade-500/12 border border-jade-500/20 flex items-center justify-center">
            <Map className="w-4 h-4 text-jade-400" />
          </div>
          <div>
            <h2 className="font-display font-bold text-void-100 text-base">Study Roadmap</h2>
            <p className="text-[11px] text-void-500 mt-0.5">Check off tasks as you progress. Drag to reorder.</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="font-mono text-sm font-bold text-void-200">{overallPct}%</p>
          <p className="label mt-0.5">{doneTasks}/{totalTasks} done</p>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="h-1.5 rounded-full bg-void-800 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-jade-500"
          initial={{ width: 0 }}
          animate={{ width: `${overallPct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      {/* Phases */}
      <div className="space-y-3">
        {roadmap.map((phase, pIdx) => {
          const phaseTotal = phase.tasks.length;
          const phaseDone  = phase.tasks.filter((t) => t.completed).length;
          const phasePct   = phaseTotal > 0 ? Math.round((phaseDone / phaseTotal) * 100) : 0;
          const isOpen     = !!expanded[pIdx];
          const allDone    = phasePct === 100;

          return (
            <div key={pIdx} className="rounded-xl border border-[rgba(255,255,255,0.07)] overflow-hidden">
              {/* Phase header */}
              <button
                onClick={() => togglePhase(pIdx)}
                className="w-full flex items-center gap-4 px-5 py-4 bg-void-900/80 hover:bg-void-900 transition-colors focus-ring"
              >
                {/* Phase number */}
                <span className={[
                  "w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 border",
                  allDone
                    ? "bg-jade-500/15 border-jade-500/35 text-jade-400"
                    : "bg-void-800 border-[rgba(255,255,255,0.1)] text-void-400",
                ].join(" ")}>
                  {allDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : pIdx + 1}
                </span>

                <div className="flex-1 text-left min-w-0">
                  <p className={`text-[13px] font-semibold leading-snug truncate ${allDone ? "text-void-400 line-through" : "text-void-100"}`}>
                    {phase.phase}
                  </p>
                  <p className="text-[11px] text-void-600 mt-0.5 font-mono">
                    {phaseDone}/{phaseTotal} tasks
                  </p>
                </div>

                {/* Mini progress */}
                <div className="hidden sm:flex items-center gap-2 shrink-0">
                  <div className="w-24 h-1 rounded-full bg-void-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-jade-500 transition-all duration-500"
                      style={{ width: `${phasePct}%` }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-void-500 w-8">{phasePct}%</span>
                </div>

                {isOpen
                  ? <ChevronUp   className="w-4 h-4 text-void-600 shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-void-600 shrink-0" />}
              </button>

              {/* Tasks */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    variants={heightCollapse(animationsEnabled)}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <Reorder.Group
                      axis="y"
                      values={phase.tasks}
                      onReorder={(t) => reorderTasks(pIdx, t)}
                      className="px-4 py-3 space-y-2 bg-void-950/40"
                    >
                      {phase.tasks.map((task) => (
                        <Reorder.Item
                          key={task.id}
                          value={task}
                          dragListener={animationsEnabled}
                          className="flex items-start gap-3 px-4 py-3 rounded-lg border border-[rgba(255,255,255,0.05)] bg-void-900/60 hover:border-[rgba(255,255,255,0.1)] transition-colors"
                        >
                          {/* Drag handle */}
                          {animationsEnabled && (
                            <div className="cursor-grab active:cursor-grabbing text-void-700 hover:text-void-500 pt-0.5 shrink-0">
                              <GripVertical className="w-4 h-4" />
                            </div>
                          )}

                          {/* Checkbox */}
                          <button
                            onClick={() => toggleTask(pIdx, task.id)}
                            className="shrink-0 mt-0.5 focus-ring rounded"
                          >
                            {task.completed
                              ? <CheckCircle2 className="w-5 h-5 text-jade-500" />
                              : <Circle       className="w-5 h-5 text-void-700 hover:text-void-500 transition-colors" />}
                          </button>

                          {/* Text */}
                          <div className="min-w-0">
                            <p className={`text-[13px] font-medium leading-snug ${task.completed ? "line-through text-void-600" : "text-void-200"}`}>
                              {task.task}
                            </p>
                            {task.description && (
                              <p className={`text-[11px] mt-0.5 ${task.completed ? "text-void-700" : "text-void-500"}`}>
                                {task.description}
                              </p>
                            )}
                          </div>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapTimeline;
