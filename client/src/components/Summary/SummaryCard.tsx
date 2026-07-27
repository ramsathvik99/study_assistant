import React from "react";
import { FileText, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card } from "../common/Card";

interface SummaryCardProps {
  summary: string;
  title: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ summary, title }) => {
  return (
    <Card variant="elevated" padding="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
              Study Overview
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Your comprehensive learning summary
            </p>
          </div>
        </div>

        {/* Summary Content - Markdown Rendered */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="prose dark:prose-invert prose-sm max-w-none
            prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
            prose-h1:text-2xl prose-h1:mt-6 prose-h1:mb-4
            prose-h2:text-xl prose-h2:mt-5 prose-h2:mb-3
            prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-2
            prose-h4:text-base prose-h4:mt-3 prose-h4:mb-2
            prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-4
            prose-ul:list-disc prose-ul:list-inside prose-ul:text-slate-700 dark:prose-ul:text-slate-300 prose-ul:mb-4 prose-ul:space-y-2
            prose-ol:list-decimal prose-ol:list-inside prose-ol:text-slate-700 dark:prose-ol:text-slate-300 prose-ol:mb-4 prose-ol:space-y-2
            prose-li:text-slate-700 dark:prose-li:text-slate-300
            prose-strong:font-bold prose-strong:text-slate-900 dark:prose-strong:text-white
            prose-em:italic prose-em:text-slate-700 dark:prose-em:text-slate-300
            prose-code:bg-slate-200 dark:prose-code:bg-slate-700 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
            prose-pre:bg-slate-900 dark:prose-pre:bg-slate-950 prose-pre:text-slate-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:mb-4
            prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-600 dark:prose-blockquote:text-slate-400
            prose-hr:border-slate-300 dark:prose-hr:border-slate-600 prose-hr:my-6
            prose-table:border-collapse prose-table:w-full
            prose-td:border prose-td:border-slate-300 dark:prose-td:border-slate-600 prose-td:px-3 prose-td:py-2 prose-td:text-slate-700 dark:prose-td:text-slate-300
            prose-th:border prose-th:border-slate-300 dark:prose-th:border-slate-600 prose-th:px-3 prose-th:py-2 prose-th:bg-slate-100 dark:prose-th:bg-slate-700 prose-th:font-bold prose-th:text-slate-900 dark:prose-th:text-white
            prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-a:underline prose-a:hover:text-primary-700 dark:prose-a:hover:text-primary-300
          ">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {summary}
            </ReactMarkdown>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          {[
            { label: "Format", value: "AI Generated", icon: Sparkles },
            { label: "Type", value: "Study Guide", icon: FileText },
            { label: "Reading Time", value: `~${Math.ceil(summary.split(" ").length / 200)} min`, icon: FileText },
            { label: "Words", value: summary.split(" ").length.toLocaleString(), icon: FileText },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  </div>
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{stat.value}</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
