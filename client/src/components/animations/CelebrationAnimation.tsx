import React, { useEffect } from "react";
import confetti from "canvas-confetti";

interface CelebrationAnimationProps {
  trigger: boolean;
  type?: "success" | "achievement" | "completion";
}

export const CelebrationAnimation: React.FC<CelebrationAnimationProps> = ({
  trigger,
  type = "success",
}) => {
  useEffect(() => {
    if (!trigger) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    if (type === "success") {
      // Gentle burst from bottom
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#0072FF", "#FF6B6B", "#14B8A6"],
        ticks: 200,
        gravity: 0.8,
        scalar: 0.8,
      });

      setTimeout(() => {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.8, x: 0.3 },
          colors: ["#0072FF", "#FF6B6B", "#14B8A6"],
          ticks: 150,
          gravity: 0.8,
          scalar: 0.7,
        });
      }, 200);

      setTimeout(() => {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.8, x: 0.7 },
          colors: ["#0072FF", "#FF6B6B", "#14B8A6"],
          ticks: 150,
          gravity: 0.8,
          scalar: 0.7,
        });
      }, 400);
    } else if (type === "achievement") {
      // Star burst
      const defaults = {
        spread: 360,
        ticks: 100,
        gravity: 0,
        decay: 0.94,
        startVelocity: 20,
        colors: ["#0072FF", "#FF6B6B", "#14B8A6", "#F59E0B"],
      };

      confetti({
        ...defaults,
        particleCount: 30,
        scalar: 1.2,
        shapes: ["star"],
      });

      confetti({
        ...defaults,
        particleCount: 20,
        scalar: 0.75,
        shapes: ["circle"],
      });
    } else if (type === "completion") {
      // Fireworks effect
      const duration = 2000;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: ["#0072FF", "#FF6B6B", "#14B8A6"],
        });

        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: ["#0072FF", "#FF6B6B", "#14B8A6"],
        });
      }, 250);
    }
  }, [trigger, type]);

  return null;
};
