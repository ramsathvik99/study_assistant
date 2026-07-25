import React from "react";

// ─── Skeleton primitive ───────────────────────────────────────────────────────

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "", style, ...rest }) => (
  <div
    className={[
      "rounded-lg overflow-hidden relative",
      "bg-void-800",
      className,
    ].join(" ")}
    style={{
      backgroundImage:
        "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.6s linear infinite",
      ...style,
    }}
    {...rest}
  />
);

// ─── Session skeleton ─────────────────────────────────────────────────────────

export const SessionSkeletonLoader: React.FC = () => (
  <div className="space-y-6 max-w-4xl mx-auto px-4 py-8">
    {/* Header */}
    <div className="space-y-3">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-9 w-2/3" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-28 rounded-full" />
      </div>
    </div>

    {/* Tab bar */}
    <div className="flex gap-2">
      {[80, 72, 88, 60, 80, 96].map((w, i) => (
        <Skeleton key={i} className="h-8 rounded-lg" style={{ width: w }} />
      ))}
    </div>

    {/* Content panel */}
    <div className="card p-6 space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[95%]" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-[90%]" />
      <Skeleton className="h-4 w-3/5" />
    </div>

    {/* Two col grid */}
    <div className="grid grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="card p-5 space-y-3">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
      ))}
    </div>
  </div>
);

export default SessionSkeletonLoader;
