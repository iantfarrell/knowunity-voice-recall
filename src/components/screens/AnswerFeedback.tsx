"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { soft } from "@/lib/motion";

// Still S8, SPEC.md §2.8 ("Feedback stack") — the graded-feedback badge
// bubble + hint badge bubble (Figma node 68:3634, "first hint"). Follows the
// transcript bubble (AnswerTranscript.tsx) in the same afterBubble stack
// (design.md §"Transcript & feedback — chat-bubble log").
//
// This frame's copy ("PARTIALLY RIGHT" + a hint) is Figma's illustrative
// partial-answer example for Mitosis. It's hardcoded here rather than read
// from session-data.ts because term 0's real canned outcome is
// "correct-first-try" (a single correct attempt, no hint) — there's no
// partial/hint data for Mitosis to bind to. Wiring this bubble to react to
// a term's actual outcome/hint fields is future work, not requested yet;
// for now this literally reproduces the named Figma frame.
const FEEDBACK_TEXT =
  "You’ve got the foundation down. One cell becomes two identical ones. What can you add about the genetic content of those new cells?";
const HINT_TEXT =
  "Think about what happens to the chromosomes before the cell splits, and what each new cell ends up with.";

export default function AnswerFeedback() {
  const prefersReducedMotion = useReducedMotion();
  const [showHint, setShowHint] = useState(false);

  // User instruction: the hint bubble fades in "right after" the feedback
  // bubble's own fade-in finishes. Timed off `soft`'s duration (220ms)
  // rather than motion's onAnimationComplete callback, since that callback
  // doesn't reliably fire when prefers-reduced-motion skips the animation.
  useEffect(() => {
    const delay = prefersReducedMotion ? 0 : soft.duration * 1000;
    const id = window.setTimeout(() => setShowHint(true), delay);
    return () => window.clearTimeout(id);
  }, [prefersReducedMotion]);

  return (
    <div className="flex flex-col">
      <motion.div
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={soft}
        className="flex items-end gap-2 px-4 pt-3"
      >
        <img
          src="/images/Group%202136139939.png"
          alt=""
          className="h-6 w-6 shrink-0 rounded-full"
        />
        <div className="max-w-[326px] rounded-tl-2xl rounded-tr-2xl rounded-bl-md rounded-br-2xl border border-feedback-partial bg-feedback-partial/15 p-4">
          <span className="inline-block rounded-lg bg-feedback-warning-chip/20 px-2 py-0.5 text-xs font-semibold tracking-wide text-feedback-warning">
            PARTIALLY RIGHT
          </span>
          <p className="mt-2 text-base text-text-primary">{FEEDBACK_TEXT}</p>
        </div>
      </motion.div>

      {showHint && (
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={soft}
          className="px-4 pt-3"
        >
          <div className="rounded-lg border border-feedback-warning/50 bg-feedback-warning/15 p-4">
            <span className="inline-block rounded-lg bg-feedback-warning-chip/20 px-2 py-0.5 text-xs font-semibold tracking-wide text-feedback-warning">
              HINT 1/2
            </span>
            <p className="mt-2 text-base text-feedback-warning">{HINT_TEXT}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
