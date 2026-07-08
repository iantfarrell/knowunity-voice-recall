"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";

// User instruction for this screen: pulse the text for a max of 4s, then
// advance automatically — the (mocked) STT/LLM judging step never actually
// takes this long, but the cap keeps the student from ever feeling stuck
// waiting on a fake process.
const MAX_PROCESSING_MS = 4000;

// S7 — "Knowie is listening to your answer" (Figma node 63:3787, "Knowie
// listening to answer"). Reached after Submit on S6 (PlaybackReview). This
// row sits directly under the term bubble in Figma's middleContent column,
// not in the bottom control area like S2/S6/S9 — so SessionShell renders it
// via the `afterBubble` slot rather than as normal screen `children` (see
// SessionShell.tsx / page.tsx). There's no bottom content on this screen
// (Figma's bottomCta for this frame is empty).
interface ProcessingAnswerProps {
  onComplete?: () => void;
}

export default function ProcessingAnswer({ onComplete }: ProcessingAnswerProps) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const id = window.setTimeout(() => onComplete?.(), MAX_PROCESSING_MS);
    return () => window.clearTimeout(id);
  }, [onComplete]);

  return (
    <div className="flex items-center gap-2 px-4 pt-2">
      <img
        src="/images/Group%202136139939.png"
        alt=""
        className="h-6 w-6 shrink-0 rounded-full"
      />
      {/* motion-guide.md's looping-pulse recipe (recording dot: opacity/scale,
          `repeat: Infinity, repeatType: "reverse"`), applied to the text
          itself per this screen's explicit spec — a calm fade, not a light
          show, so it reads as "still working" rather than an error state. */}
      <motion.p
        animate={prefersReducedMotion ? undefined : { opacity: [1, 0.35, 1] }}
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
        }
        className="text-sm italic text-text-primary"
      >
        Knowie is listening to your answer
      </motion.p>
    </div>
  );
}
