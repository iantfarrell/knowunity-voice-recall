"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { soft } from "@/lib/motion";
import ShimmerText from "@/components/ShimmerText";

// User instruction for this screen: shimmer the text for a max of 2s, then
// advance automatically — the (mocked) STT/LLM judging step never actually
// takes this long, but the cap keeps the student from ever feeling stuck
// waiting on a fake process. A touch above motion-guide.md's own "thinking"
// recipe recommendation (~1-1.5s), per explicit user instruction — this
// step is 100% mocked, so there's no real work happening that needs the
// extra time, but 2s reads as a more deliberate, considered pause than 1.5s
// did.
const MAX_PROCESSING_MS = 2000;

// S7 — "Knowie is thinking" (Figma node 63:3787, "Knowie listening to
// answer" — copy changed per user instruction from the frame's original
// "Knowie is listening to your answer" since this screen runs *after*
// Submit, once the (mocked) transcript is already in hand; "thinking" reads
// as judging the answer rather than still capturing audio). Reached after
// Submit on S6 (PlaybackReview). This
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
    // Fades/rises in on mount, same as every sibling bubble in the log
    // (TermBubble, AnswerTranscript, AnswerFeedback, CorrectFeedback) — this
    // row previously popped in with no entrance motion of its own, an
    // inconsistency once every other row in the stack fades in.
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={soft}
      className="flex items-center gap-2 px-4 pt-2"
    >
      <img
        src="/images/Group%202136139939.png"
        alt=""
        className="h-6 w-6 shrink-0 rounded-full"
      />
      {/* User instruction: a left-to-right shimmer sweep across the text
          (the same "reading console…" style highlight-in-motion used
          elsewhere), not a fade — see ShimmerText for how/why. */}
      <ShimmerText className="text-sm italic">Knowie is thinking</ShimmerText>
    </motion.div>
  );
}
