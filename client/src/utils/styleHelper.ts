/**
 * styleHelper — Utility functions for styling without inline style attributes.
 */

/**
 * Returns a static Tailwind class matching the rounded percentage (to nearest 5%).
 * Because these class names are written out in full, the Tailwind compiler
 * correctly detects and generates them.
 */
export function getPercentWidthClass(percent: number): string {
  const rounded = Math.min(100, Math.max(0, Math.round(percent / 5) * 5));
  switch (rounded) {
    case 0: return "w-0";
    case 5: return "w-[5%]";
    case 10: return "w-[10%]";
    case 15: return "w-[15%]";
    case 20: return "w-[20%]";
    case 25: return "w-[25%]";
    case 30: return "w-[30%]";
    case 35: return "w-[35%]";
    case 40: return "w-[40%]";
    case 45: return "w-[45%]";
    case 50: return "w-[50%]";
    case 55: return "w-[55%]";
    case 60: return "w-[60%]";
    case 65: return "w-[65%]";
    case 70: return "w-[70%]";
    case 75: return "w-[75%]";
    case 80: return "w-[80%]";
    case 85: return "w-[85%]";
    case 90: return "w-[90%]";
    case 95: return "w-[95%]";
    case 100: return "w-full";
    default: return "w-0";
  }
}

/**
 * Returns the CSS class for animation delay for the bouncing dots loader.
 */
export function getBounceDelayClass(index: number): string {
  switch (index) {
    case 0: return "animate-delay-0";
    case 1: return "animate-delay-150";
    case 2: return "animate-delay-300";
    default: return "animate-delay-0";
  }
}
