import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { BookOpen, Lightbulb, GraduationCap, Brain, Bookmark, FileText, Pencil, Notebook } from "lucide-react";

interface FloatingItemProps {
  Icon: React.ComponentType<{ className?: string }>;
  initialX: number;
  initialY: number;
  delay: number;
  duration: number;
  parallaxStrength?: number;
}

const FloatingItem: React.FC<FloatingItemProps> = ({
  Icon,
  initialX,
  initialY,
  delay,
  duration,
  parallaxStrength = 20,
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const moveX = (e.clientX - centerX) / centerX;
      const moveY = (e.clientY - centerY) / centerY;

      mouseX.set(moveX * parallaxStrength);
      mouseY.set(moveY * parallaxStrength);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, parallaxStrength]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0.15, 0.25, 0.15],
        scale: [1, 1.1, 1],
        x: [0, 10, 0],
        y: [0, -10, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        position: "absolute",
        left: `${initialX}%`,
        top: `${initialY}%`,
        x,
        y,
      }}
      className="pointer-events-none"
    >
      <Icon className="w-12 h-12 md:w-16 md:h-16 text-primary-300" />
    </motion.div>
  );
};

export const FloatingIllustrations: React.FC = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  if (prefersReducedMotion) return null;

  const illustrations = [
    { Icon: BookOpen, x: 10, y: 15, delay: 0, duration: 8, parallax: 15 },
    { Icon: Lightbulb, x: 85, y: 20, delay: 0.5, duration: 9, parallax: 25 },
    { Icon: GraduationCap, x: 15, y: 70, delay: 1, duration: 10, parallax: 20 },
    { Icon: Brain, x: 80, y: 75, delay: 1.5, duration: 7, parallax: 18 },
    { Icon: Bookmark, x: 5, y: 45, delay: 2, duration: 11, parallax: 22 },
    { Icon: FileText, x: 90, y: 50, delay: 2.5, duration: 8.5, parallax: 16 },
    { Icon: Pencil, x: 20, y: 35, delay: 3, duration: 9.5, parallax: 24 },
    { Icon: Notebook, x: 75, y: 35, delay: 3.5, duration: 10.5, parallax: 19 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
      {illustrations.map((item, index) => (
        <FloatingItem
          key={index}
          Icon={item.Icon}
          initialX={item.x}
          initialY={item.y}
          delay={item.delay}
          duration={item.duration}
          parallaxStrength={item.parallax}
        />
      ))}
    </div>
  );
};
