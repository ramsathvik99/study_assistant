import React, { useState } from "react";
import { Check, ChevronDown, Map } from "lucide-react";
import { RoadmapPhase } from "../../types/index";
import { Card } from "../common/Card";
import { EmptyState } from "../animations/EmptyState";

interface RoadmapTimelineProps {
  roadmap: RoadmapPhase[];
  onUpdate: (roadmap: RoadmapPhase[]) => void;
}

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({ roadmap, onUpdate }) => {
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set([0]));

  // Empty state check
  if (!roadmap || roadmap.length === 0) {
    return (
      <EmptyState
        type="session"
        title="No roadmap available"
        description="No learning roadmap is available for this study plan. Try generating a new plan with a simpler topic."
      />
    );
  }

  const togglePhase = (index: number) => {
    const newExpanded = new Set(expandedPhases);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedPhases(newExpanded);
  };

  const toggleTask = (phaseIndex: number, taskId: string) => {
    const updated = roadmap.map((phase, pIdx) => {
      if (pIdx !== phaseIndex) return phase;
      return {
        ...phase,
        tasks: phase.tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        ),
      };
    });
    onUpdate(updated);
  };

  const getPhaseProgress = (phase: RoadmapPhase) => {
    const completed = phase.tasks.filter((t) => t.completed).length;
    return Math.round((completed / phase.tasks.length) * 100);
  };

  const getTotalProgress = () => {
    const totalTasks = roadmap.reduce((sum, phase) => sum + phase.tasks.length, 0);
    const completedTasks = roadmap.reduce(
      (sum, phase) => sum + phase.tasks.filter((t) => t.completed).length,
      0
    );
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const totalProgress = getTotalProgress();

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card variant="elevated" padding="lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
              <Map className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Learning Roadmap
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {roadmap.length} phases • {roadmap.reduce((sum, p) => sum + p.tasks.length, 0)} tasks
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalProgress}%</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Complete
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            style={{ width: `${totalProgress}%` }}
            className="h-full bg-primary-600 rounded-full transition-all duration-500"
          />
        </div>
      </Card>

      {/* Timeline */}
      <div className="space-y-4">
        {roadmap.map((phase, phaseIndex) => {
          const isExpanded = expandedPhases.has(phaseIndex);
          const progress = getPhaseProgress(phase);
          const completedTasks = phase.tasks.filter((t) => t.completed).length;

          return (
            <Card key={phaseIndex} variant="elevated" padding="none" className="overflow-hidden">
              {/* Phase Header */}
              <button
                onClick={() => togglePhase(phaseIndex)}
                className="w-full p-4 flex items-start gap-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                {/* Phase Number Badge */}
                <div className="relative z-10 shrink-0">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                      progress === 100
                        ? "bg-green-500 text-white"
                        : "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                    }`}
                  >
                    {progress === 100 ? <Check className="w-5 h-5" /> : phaseIndex + 1}
                  </div>
                </div>

                {/* Phase Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                      {phase.phase}
                    </h3>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  <div className="flex items-center gap-4 text-sm mb-3">
                    <span className="font-medium text-slate-600 dark:text-slate-400">
                      {completedTasks} / {phase.tasks.length} tasks
                    </span>
                    <div className="h-4 w-px bg-slate-300 dark:bg-slate-600" />
                    <span
                      className={`font-medium ${
                        progress === 100 ? "text-green-600 dark:text-green-400" : "text-primary-600 dark:text-primary-400"
                      }`}
                    >
                      {progress}% complete
                    </span>
                  </div>

                  {/* Mini Progress Bar */}
                  <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${progress}%` }}
                      className={`h-full rounded-full transition-all duration-300 ${
                        progress === 100 ? "bg-green-500" : "bg-primary-600"
                      }`}
                    />
                  </div>
                </div>
              </button>

              {/* Tasks List */}
              {isExpanded && (
                <div className="border-t border-slate-200 dark:border-slate-700 p-4 space-y-2">
                  {phase.tasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => toggleTask(phaseIndex, task.id)}
                      className={`w-full p-3 rounded-lg border text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                        task.completed
                          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Checkbox */}
                        <div
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                            task.completed
                              ? "bg-green-500 border-green-500"
                              : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                          }`}
                        >
                          {task.completed && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>

                        {/* Task Content */}
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`text-sm font-medium ${
                              task.completed
                                ? "text-slate-400 dark:text-slate-500 line-through"
                                : "text-slate-900 dark:text-white"
                            }`}
                          >
                            {task.task}
                          </h4>
                          {task.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{task.description}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
