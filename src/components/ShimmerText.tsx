"use client";

import { motion, useReducedMotion } from "motion/react";

interface ShimmerTextProps {
  children: React.ReactNode;
  className?: string;
}

// Left-to-right shimmer sweep for an in-progress line of text — a dim
// text-secondary base with a text-primary band sweeping through it, via an
// animated background-position on a background-clip:text gradient. Built
// for ProcessingAnswer's "Knowie is thinking" (user instruction, referencing
// the same effect used elsewhere for "reading console…"-style status text),
// reused wherever else a short mocked wait needs the same treatment rather
// than a second, differently-built loading state — e.g. PlaybackReview's
// "Transcribing…" line.
//
// Still driven by Motion, not a hand-rolled @keyframes rule; background-
// position isn't a transform/opacity property (motion-guide.md's usual
// rule), but there's no transform-only way to sweep a highlight through
// clipped text, and it's a paint cost on one small text node, not a layout
// one, so it doesn't carry the jank risk that rule is guarding against.
// Reduced motion drops the gradient/clip entirely and shows plain, fully
// legible text instead of a static two-tone snapshot.
export default function ShimmerText({ children, className = "" }: ShimmerTextProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.span
      className={
        prefersReducedMotion
          ? `text-text-primary ${className}`
          : `bg-clip-text text-transparent ${className}`
      }
      style={
        prefersReducedMotion
          ? undefined
          : {
              backgroundImage:
                "linear-gradient(90deg, var(--color-text-secondary) 30%, var(--color-text-primary) 50%, var(--color-text-secondary) 70%)",
              backgroundSize: "200% 100%",
            }
      }
      animate={
        prefersReducedMotion
          ? undefined
          : { backgroundPositionX: ["150%", "-150%"] }
      }
      transition={
        prefersReducedMotion
          ? undefined
          : { duration: 1.4, repeat: Infinity, ease: "linear" }
      }
    >
      {children}
    </motion.span>
  );
}
