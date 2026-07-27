import { useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface UseCountUpOptions {
  end: number;
  duration?: number;
  start?: number;
  decimals?: number;
  enabled?: boolean;
}

export const useCountUp = ({
  end,
  duration = 2000,
  start = 0,
  decimals = 0,
  enabled = true,
}: UseCountUpOptions) => {
  const [count, setCount] = useState(start);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [hasAnimated, setHasAnimated] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!enabled || !isInView || hasAnimated) return;

    if (prefersReducedMotion) {
      setCount(end);
      setHasAnimated(true);
      return;
    }

    setHasAnimated(true);
    const startTime = Date.now();
    const difference = end - start;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);

      // Easing function (easeOutExpo)
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      const current = start + difference * easeOut;
      setCount(Number(current.toFixed(decimals)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, start, decimals, isInView, hasAnimated, enabled, prefersReducedMotion]);

  return { count, ref };
};
