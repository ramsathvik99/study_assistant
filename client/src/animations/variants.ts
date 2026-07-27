import { Variants } from "framer-motion";

export const fadeIn = (enabled = true): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: enabled ? 0.3 : 0 },
  },
  exit: {
    opacity: 0,
    transition: { duration: enabled ? 0.2 : 0 },
  },
});

export const fadeInUp = (enabled = true): Variants => ({
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 15, duration: enabled ? 0.4 : 0 },
  },
  exit: {
    opacity: 0,
    y: -15,
    transition: { duration: enabled ? 0.2 : 0 },
  },
});

export const scaleUp = (enabled = true): Variants => ({
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 150, damping: 18, duration: enabled ? 0.3 : 0 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: enabled ? 0.2 : 0 },
  },
});

export const staggerContainer = (enabled = true): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: enabled ? 0.08 : 0,
      delayChildren: enabled ? 0.05 : 0,
    },
  },
});

export const slideIn = (direction: "left" | "right" | "up" | "down", enabled = true): Variants => {
  const xOffset = direction === "left" ? -50 : direction === "right" ? 50 : 0;
  const yOffset = direction === "up" ? 50 : direction === "down" ? -50 : 0;

  return {
    hidden: { opacity: 0, x: xOffset, y: yOffset },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15, duration: enabled ? 0.4 : 0 },
    },
    exit: {
      opacity: 0,
      x: xOffset,
      y: yOffset,
      transition: { duration: enabled ? 0.2 : 0 },
    },
  };
};

export const hoverScale = (enabled = true) => {
  if (!enabled) return {};
  return {
    scale: 1.02,
    y: -4,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    transition: { type: "spring", stiffness: 300, damping: 20 },
  };
};
