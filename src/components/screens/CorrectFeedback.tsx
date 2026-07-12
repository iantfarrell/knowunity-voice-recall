"use client";

import { motion, useReducedMotion } from "motion/react";
import { gentle } from "@/lib/motion";

// Still S8 — the CORRECT feedback bubble that follows a retry's own
// transcript echo (Figma node 68:7899, "correct answer"). Reached once the
// student's second attempt fills in what the first attempt's hint asked for.
// Unlike AnswerFeedback.tsx (whose PARTIALLY RIGHT bubble is followed by a
// second, delayed HINT bubble), Figma node 68:7899 shows only a single new
// bubble here — no internal stagger needed.
//
// Entrance uses `gentle` (motion-guide.md's "Result reveal" recipe — "a
// small spring entrance on the result card"), not the plain `soft` fade
// every neutral chat-log bubble (the transcript echo, Knowie's term prompt)
// uses. This is the actual payoff moment of the whole exchange; previously
// it faded in exactly like the bubble stack around it, so the win never
// visibly landed. RevealedFeedback.tsx uses this same recipe (per the
// guide's "the animation is the same; the content differs" rule) so a miss
// doesn't get a heavier or lighter treatment than a win — only different
// color/copy.
const FEEDBACK_TEXT =
  "Nice! You picked up on the replication of genetic content. That along with your first idea of defining mitosis answers the question fully.";

export default function CorrectFeedback() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={gentle}
      className="flex items-end gap-2 px-4 pt-2"
    >
      <img
        src="/images/Group%202136139939.png"
        alt=""
        className="h-6 w-6 shrink-0 rounded-full"
      />
      {/* max-w-[294px] matches AnswerTranscript.tsx's "YOUR ANSWER" bubble
          (user instruction, see AnswerFeedback.tsx's matching comment) —
          keeps this bubble's right edge aligned with the others instead of
          stretching under the transcript bubble's avatar above it. */}
      <div className="max-w-[294px] rounded-tl-2xl rounded-tr-2xl rounded-bl-md rounded-br-2xl border border-highlight-recognized bg-feedback-correct/15 p-4">
        <span className="inline-block rounded-lg bg-feedback-correct/20 px-2 py-0.5 text-xs font-semibold tracking-wide text-highlight-recognized">
          CORRECT
        </span>
        <p className="mt-2 text-base text-text-primary">{FEEDBACK_TEXT}</p>
      </div>
    </motion.div>
  );
}
