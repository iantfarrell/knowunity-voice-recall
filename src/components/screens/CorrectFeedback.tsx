"use client";

import { motion, useReducedMotion } from "motion/react";
import { soft } from "@/lib/motion";

// Still S8 — the CORRECT feedback bubble that follows a retry's own
// transcript echo (Figma node 68:7899, "correct answer"). Reached once the
// student's second attempt fills in what the first attempt's hint asked for.
// Unlike AnswerFeedback.tsx (whose PARTIALLY RIGHT bubble is followed by a
// second, delayed HINT bubble), Figma node 68:7899 shows only a single new
// bubble here — no internal stagger needed.
const FEEDBACK_TEXT =
  "Nice! You picked up on the replication of genetic content. That along with your first idea of defining mitosis answers the question fully.";

export default function CorrectFeedback() {
  const prefersReducedMotion = useReducedMotion();

  return (
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
      <div className="max-w-[326px] rounded-tl-2xl rounded-tr-2xl rounded-bl-md rounded-br-2xl border border-highlight-recognized bg-feedback-correct/15 p-4">
        <span className="inline-block rounded-lg bg-feedback-correct/20 px-2 py-0.5 text-xs font-semibold tracking-wide text-highlight-recognized">
          CORRECT
        </span>
        <p className="mt-2 text-base text-text-primary">{FEEDBACK_TEXT}</p>
      </div>
    </motion.div>
  );
}
