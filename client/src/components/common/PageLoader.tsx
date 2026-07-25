import React from "react";

export const PageLoader: React.FC = () => (
  <div className="min-h-[70dvh] flex items-center justify-center">
    <div className="flex flex-col items-center gap-5">
      {/* Animated logo mark */}
      <div className="relative w-12 h-12">
        {/* Outer ring */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 48 48"
          fill="none"
        >
          <circle
            cx="24" cy="24" r="20"
            stroke="rgba(245,158,11,0.15)"
            strokeWidth="2"
          />
          <circle
            cx="24" cy="24" r="20"
            stroke="#F59E0B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="30 96"
            className="animate-spin-slow origin-center"
            style={{ transformOrigin: "24px 24px" }}
          />
        </svg>
        {/* Center mark */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse-dot" />
        </div>
      </div>

      {/* Three dots */}
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1 h-1 rounded-full bg-void-500 animate-pulse-dot"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>

      <p className="font-mono text-xs text-void-500 tracking-widest uppercase">
        Loading…
      </p>
    </div>
  </div>
);

export default PageLoader;
