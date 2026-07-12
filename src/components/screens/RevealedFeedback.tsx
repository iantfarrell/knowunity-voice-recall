"use client";

import { motion, useReducedMotion } from "motion/react";
import { gentle } from "@/lib/motion";

// Still S8 — the REVEALED feedback bubble for the "missed, hint ladder
// exhausted" outcome (sprint-context.md's "Partial / wrong: hint ladder —
// max 3 attempts, then Knowie reveals answer"). session-data.ts already
// scripts this outcome in full (the Meiosis term: two partial attempts,
// hints at levels 1 and 2, then a 3rd attempt whose feedbackStatus is
// "revealed"), but no bubble existed to render it — this reuses that
// term's real revealedAnswer text rather than inventing new illustrative
// copy, since there's no Figma frame for this specific state to match
// literally the way AnswerFeedback/CorrectFeedback do.
//
// User instruction: a miss must stay gentle, never punishing. So this
// deliberately does NOT reuse feedback-error/red tokens anywhere — same
// blue/neutral treatment as EndSummary's own "revealed" row (eye icon,
// accent-blue-bold circle), and the same bubble chrome + `gentle` entrance
// as CorrectFeedback/AnswerFeedback (motion-guide.md's "Result reveal":
// "the animation is the same; the content differs" — a miss shouldn't get
// a different, heavier motion treatment than a win, only different color
// and copy). Framing is "here's the answer," not "wrong."
const REVEALED_LEAD =
  "You got some of the way there — four cells, and it’s tied to reproduction.";
const REVEALED_ANSWER =
  "Meiosis is cell division that produces four genetically different sex cells (gametes), each with half the normal number of chromosomes — it’s how variation gets introduced when organisms reproduce.";

export default function RevealedFeedback() {
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
      <div className="max-w-[294px] rounded-tl-2xl rounded-tr-2xl rounded-bl-md rounded-br-2xl border border-accent-blue-bold bg-accent-blue-bold/15 p-4">
        <span className="inline-block rounded-lg bg-accent-blue-bold/20 px-2 py-0.5 text-xs font-semibold tracking-wide text-accent-blue-onsubtle">
          HERE’S THE ANSWER
        </span>
        <p className="mt-2 text-base text-text-primary">{REVEALED_LEAD}</p>
        <p className="mt-3 text-base text-text-primary">{REVEALED_ANSWER}</p>
      </div>
    </motion.div>
  );
}
