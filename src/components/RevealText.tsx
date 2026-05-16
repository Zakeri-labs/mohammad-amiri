import { motion } from "motion/react";
import type { ReactNode } from "react";

interface RevealTextProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
}

export function RevealText({ children, delay = 0, className, as = "div" }: RevealTextProps) {
  const MotionTag = motion[as];
  return (
    <div className="overflow-hidden">
      <MotionTag
        className={className}
        initial={{ y: "110%", opacity: 0 }}
        whileInView={{ y: "0%", opacity: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </MotionTag>
    </div>
  );
}