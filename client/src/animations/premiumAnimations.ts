/**
 * Premium SaaS Animation Variants
 * Inspired by Linear, Vercel, Notion, Framer, Arc Browser, and Apple
 * Smooth, elegant, purposeful animations for professional applications
 */

export const premiumAnimations = {
  // PAGE ENTRANCE ANIMATIONS
  pageEnter: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5, ease: "easeOut" },
  },

  // STAGGERED CONTAINER
  containerStagger: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
        duration: 0.3,
      },
    },
  },

  // STAGGERED ITEM
  staggerItem: {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" },
  },

  // CARD ANIMATIONS
  cardEnter: {
    initial: { opacity: 0, y: 12, scale: 0.96 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.4, ease: "easeOut" },
  },

  cardHover: {
    scale: 1.02,
    transition: { duration: 0.2, ease: "easeOut" },
  },

  cardHoverShadow: {
    boxShadow:
      "0 20px 40px 0 rgba(0, 0, 0, 0.12), 0 0 40px 0 rgba(59, 130, 246, 0.08)",
    transition: { duration: 0.3, ease: "easeOut" },
  },

  // BUTTON ANIMATIONS
  buttonHover: {
    scale: 1.02,
    transition: { duration: 0.2, ease: "easeOut" },
  },

  buttonTap: {
    scale: 0.96,
    transition: { duration: 0.1 },
  },

  // ICON ANIMATIONS
  iconFloat: {
    animate: { y: -2 },
    transition: { duration: 0.3, ease: "easeOut" },
  },

  iconSpinSlow: {
    animate: { rotate: 360 },
    transition: { duration: 3, ease: "linear", repeat: Infinity },
  },

  // PROGRESS BAR ANIMATIONS
  progressFill: {
    initial: { width: 0 },
    animate: { width: "100%" },
    transition: { duration: 1.5, ease: "easeOut" },
  },

  progressPulse: {
    animate: {
      opacity: [1, 0.7, 1],
    },
    transition: { duration: 2, ease: "easeInOut", repeat: Infinity },
  },

  // SKELETON LOADING
  skeletonShimmer: {
    initial: { backgroundPosition: "200% 0" },
    animate: { backgroundPosition: "-200% 0" },
    transition: { duration: 2, ease: "linear", repeat: Infinity },
  },

  // BADGE/CHIP ANIMATIONS
  badgePulse: {
    animate: {
      scale: [1, 1.05, 1],
    },
    transition: { duration: 2, ease: "easeInOut", repeat: Infinity },
  },

  // MODAL/OVERLAY ANIMATIONS
  modalBackdropEnter: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },

  modalContentEnter: {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
    transition: { duration: 0.4, ease: "easeOut" },
  },

  // LIST ITEM ANIMATIONS
  listItemEnter: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.3, ease: "easeOut" },
  },

  // SLIDE ANIMATIONS
  slideUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 30 },
    transition: { duration: 0.4, ease: "easeOut" },
  },

  slideDown: {
    initial: { opacity: 0, y: -30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
    transition: { duration: 0.4, ease: "easeOut" },
  },

  slideLeft: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
    transition: { duration: 0.4, ease: "easeOut" },
  },

  // SCALE ANIMATIONS
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, ease: "easeOut" },
  },

  // FADE ANIMATIONS
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },

  // GLOW ANIMATION FOR GLASS EFFECT
  glassGlow: {
    initial: { boxShadow: "0 0 0 0 rgba(59, 130, 246, 0)" },
    animate: { boxShadow: "0 0 0 0 rgba(59, 130, 246, 0.1)" },
    transition: { duration: 0.6, ease: "easeOut" },
  },

  // CHART/GRAPH ANIMATIONS
  chartBarEnter: {
    initial: { opacity: 0, scaleY: 0, originY: "100%" },
    animate: { opacity: 1, scaleY: 1 },
    transition: { duration: 0.6, ease: "easeOut" },
  },

  // NUMBER COUNTER ANIMATION
  numberCounter: {
    transition: { duration: 1.5, ease: "easeOut" },
  },

  // BOUNCE ANIMATION
  bounce: {
    animate: { y: [0, -8, 0] },
    transition: { duration: 0.6, ease: "easeInOut" },
  },

  // SHIMMER LOADING STATE
  shimmer: {
    initial: { backgroundPosition: "200% 0" },
    animate: { backgroundPosition: "-200% 0" },
    transition: { duration: 1.5, ease: "linear", repeat: Infinity },
  },

  // ROTATE ANIMATION
  rotate: {
    animate: { rotate: 360 },
    transition: { duration: 20, ease: "linear", repeat: Infinity },
  },

  // GENTLE FLOAT
  float: {
    animate: { y: [0, -4, 0] },
    transition: { duration: 3, ease: "easeInOut", repeat: Infinity },
  },

  // PULSE ANIMATION
  pulse: {
    animate: { opacity: [1, 0.6, 1] },
    transition: { duration: 2, ease: "easeInOut", repeat: Infinity },
  },

  // EXPAND ANIMATION
  expandCollapse: {
    initial: { height: 0, opacity: 0 },
    animate: { height: "auto", opacity: 1 },
    exit: { height: 0, opacity: 0 },
    transition: { duration: 0.3, ease: "easeOut" },
  },

  // TAB SWITCH
  tabSwitch: {
    initial: { opacity: 0, x: 10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
    transition: { duration: 0.25, ease: "easeOut" },
  },

  // TOOLTIP ANIMATION
  tooltipEnter: {
    initial: { opacity: 0, scale: 0.9, y: 5 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 5 },
    transition: { duration: 0.2, ease: "easeOut" },
  },

  // DRAG ANIMATION
  dragHover: {
    scale: 1.02,
    boxShadow: "0 12px 24px 0 rgba(59, 130, 246, 0.15)",
    transition: { duration: 0.2 },
  },

  // SUCCESS CHECKMARK
  successCheckmark: {
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { duration: 0.5, ease: "easeOut" },
  },

  // UPLOAD ANIMATION
  uploadFile: {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.4, ease: "easeOut" },
  },

  // SLIDE IN FROM SIDE
  slideInFromRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
    transition: { duration: 0.4, ease: "easeOut" },
  },

  slideInFromLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
    transition: { duration: 0.4, ease: "easeOut" },
  },

  // FLIP ANIMATION
  flip: {
    animate: { rotateY: 360 },
    transition: { duration: 0.8, ease: "easeInOut" },
  },

  // ELASTIC BOUNCE
  elasticBounce: {
    animate: { scale: [1, 1.1, 0.95, 1.05, 1] },
    transition: { duration: 0.6, ease: "easeInOut" },
  },

  // GRADIENT SHIFT
  gradientShift: {
    animate: { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] },
    transition: { duration: 3, ease: "linear", repeat: Infinity },
  },

  // MICRO INTERACTION HOVER
  microHover: {
    scale: 1.01,
    transition: { duration: 0.2, ease: "easeOut" },
  },

  // STAGGER DELAY PRESETS
  delayShort: { delay: 0.1 },
  delayMedium: { delay: 0.2 },
  delayLong: { delay: 0.3 },
};

/**
 * Stagger delay helper
 * For animating lists of items with increasing delay
 */
export const getStaggerDelay = (index: number, baseDelay = 0.05) => ({
  delay: index * baseDelay,
});

/**
 * Combine animation variants
 * Useful for complex animations with multiple properties
 */
export const combineAnimations = (...animations: any[]) => {
  return animations.reduce((acc, animation) => ({ ...acc, ...animation }), {});
};
