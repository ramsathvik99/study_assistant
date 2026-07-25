import { Variants, Transition } from "framer-motion";

// ─── Spring presets ───────────────────────────────────────────────────────────

const snappy: Transition  = { type: "spring", stiffness: 420, damping: 32 };
const smooth: Transition  = { type: "spring", stiffness: 260, damping: 28 };
const ease:   Transition  = { duration: 0.28, ease: [0.22, 1, 0.36, 1] };
const fast:   Transition  = { duration: 0.16, ease: [0.22, 1, 0.36, 1] };

// ─── Visibility guards ────────────────────────────────────────────────────────
// Every variant accepts an `enabled` flag so the user's "disable animations"
// preference always works without rewriting every callsite.

export const fadeIn = (enabled = true): Variants => ({
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: enabled ? ease  : { duration: 0 } },
  exit:    { opacity: 0, transition: enabled ? fast  : { duration: 0 } },
});

export const fadeUp = (enabled = true): Variants => ({
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: enabled ? { ...ease, duration: 0.36 } : { duration: 0 } },
  exit:    { opacity: 0, y: -8, transition: enabled ? fast : { duration: 0 } },
});

/** @alias fadeUp — kept for backward compat */
export const fadeInUp = fadeUp;

export const fadeDown = (enabled = true): Variants => ({
  hidden:  { opacity: 0, y: -14 },
  visible: { opacity: 1, y: 0, transition: enabled ? ease : { duration: 0 } },
  exit:    { opacity: 0, y: -14, transition: enabled ? fast : { duration: 0 } },
});

export const scaleIn = (enabled = true): Variants => ({
  hidden:  { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: enabled ? snappy : { duration: 0 } },
  exit:    { opacity: 0, scale: 0.96, transition: enabled ? fast  : { duration: 0 } },
});

/** @alias scaleIn — kept for backward compat */
export const scaleUp = scaleIn;

export const slideRight = (enabled = true): Variants => ({
  hidden:  { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: enabled ? smooth : { duration: 0 } },
  exit:    { opacity: 0, x: -20, transition: enabled ? fast  : { duration: 0 } },
});

export const slideLeft = (enabled = true): Variants => ({
  hidden:  { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: enabled ? smooth : { duration: 0 } },
  exit:    { opacity: 0, x: 20, transition: enabled ? fast  : { duration: 0 } },
});

/**
 * Unified slideIn — accepts direction string for backward compatibility.
 */
export const slideIn = (
  direction: "left" | "right" | "up" | "down" = "up",
  enabled = true
): Variants => {
  const x = direction === "left" ? -24 : direction === "right" ? 24 : 0;
  const y = direction === "up"   ? 20  : direction === "down"  ? -20 : 0;
  return {
    hidden:  { opacity: 0, x, y },
    visible: { opacity: 1, x: 0, y: 0, transition: enabled ? smooth : { duration: 0 } },
    exit:    { opacity: 0, x: x * 0.5, y: y * 0.5, transition: enabled ? fast : { duration: 0 } },
  };
};

export const staggerContainer = (enabled = true): Variants => ({
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: enabled ? 0.07 : 0,
      delayChildren:   enabled ? 0.05 : 0,
    },
  },
});

// ─── Hover helpers (used inline with whileHover / whileTap) ───────────────────

export const hoverLift = (enabled = true) =>
  enabled ? { y: -3, transition: { duration: 0.18 } } : {};

/** @alias hoverLift */
export const hoverScale = hoverLift;

export const tapScale = (enabled = true) =>
  enabled ? { scale: 0.97, transition: { duration: 0.1 } } : {};

// ─── Flip card variant ────────────────────────────────────────────────────────
export const flipCard = (flipped: boolean, enabled = true) => ({
  rotateY: flipped ? 180 : 0,
  transition: enabled
    ? { type: "spring", stiffness: 120, damping: 22 }
    : { duration: 0 },
});

// ─── Height collapse (accordions, expandable sections) ───────────────────────
export const heightCollapse = (enabled = true): Variants => ({
  hidden:  { height: 0, opacity: 0, overflow: "hidden" },
  visible: {
    height: "auto",
    opacity: 1,
    overflow: "hidden",
    transition: enabled ? { duration: 0.28, ease: [0.22, 1, 0.36, 1] } : { duration: 0 },
  },
  exit: {
    height: 0,
    opacity: 0,
    overflow: "hidden",
    transition: enabled ? { duration: 0.2, ease: [0.22, 1, 0.36, 1] } : { duration: 0 },
  },
});
