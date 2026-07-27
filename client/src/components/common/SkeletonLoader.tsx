import React from "react";
import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "title" | "avatar" | "card" | "button";
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "text",
  count = 1,
}) => {
  const variantStyles = {
    text: "h-4 w-full rounded-lg",
    title: "h-8 w-3/4 rounded-lg",
    avatar: "h-12 w-12 rounded-full",
    card: "h-48 w-full rounded-2xl",
    button: "h-10 w-32 rounded-xl",
  };

  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <>
      {items.map((index) => (
        <motion.div
          key={index}
          className={`bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 bg-[length:200%_100%] animate-shimmer ${variantStyles[variant]} ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.05 }}
        />
      ))}
    </>
  );
};

export const SkeletonLoader: React.FC<{ type?: "card" | "list" | "grid" }> = ({ type = "list" }) => {
  if (type === "card") {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton variant="title" />
          <Skeleton variant="text" count={3} className="space-y-2" />
        </div>
        <Skeleton variant="card" />
      </div>
    );
  }

  if (type === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} variant="card" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton variant="avatar" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="w-3/4" />
            <Skeleton variant="text" className="w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};
