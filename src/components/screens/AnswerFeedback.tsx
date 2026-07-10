"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { soft } from "@/lib/motion";
import { HintIcon } from "@/components/icons";

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
// Split so the trailing question can be bolded on its own (user instruction)
// — it's the actual prompt the student needs to answer on retry, so it
// should stand out from the lead-in praise/context sentence before it.
const FEEDBACK_LEAD =
  "You’ve got the foundation down. One cell becomes two identical ones.";
const FEEDBACK_QUESTION =
  "What can you add about the genetic content of those new cells?";
const HINT_TEXT =
  "Think about what happens to the chromosomes before the cell splits, and what each new cell ends up with.";

export default function AnswerFeedback() {
  const prefersReducedMotion = useReducedMotion();
  // feedback.md's "[L] Hint ladder" fix: this used to auto-reveal ~220ms
  // after the feedback bubble via a timer — all 3 user-testers just read
  // the hint and parroted it back as their next answer, bypassing the
  // recall mechanic entirely (one was even marked correct doing so). Now
  // hint content only renders once the student explicitly taps "Get a
  // hint" below the feedback bubble — showHint is set by that tap, not a
  // timer. The re-attempt mic CTA (RetryPrompt, rendered independently by
  // page.tsx) is unaffected either way, so it's already on screen before
  // any hint content appears, satisfying feedback.md's "re-attempt CTA
  // must appear before any hint content is visible."
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="flex flex-col">
      <motion.div
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={soft}
        // User instruction: every box in this stack sits exactly 8px
        // (pt-2) below the one before it.
        className="flex items-end gap-2 px-4 pt-2"
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
          <p className="mt-2 text-base text-text-primary">
            {FEEDBACK_LEAD} <span className="font-bold">{FEEDBACK_QUESTION}</span>
          </p>
        </div>
      </motion.div>

      {showHint ? (
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={soft}
          className="px-4 pt-2"
        >
          <div className="rounded-lg border border-feedback-warning/50 bg-feedback-warning/15 p-4">
            <span className="inline-block rounded-lg bg-feedback-warning-chip/20 px-2 py-0.5 text-xs font-semibold tracking-wide text-feedback-warning">
              HINT 1/2
            </span>
            <p className="mt-2 text-base text-feedback-warning">{HINT_TEXT}</p>
          </div>
        </motion.div>
      ) : (
        // The gate itself — user instruction: make this read as coming from
        // Knowie rather than a standalone gate control. Same row shape as
        // every other Knowie bubble here (avatar + items-end, PARTIALLY
        // RIGHT above, CORRECT in CorrectFeedback.tsx): avatar bottom-aligned
        // to its left, same feedback-partial border/bg wash as the box
        // above so the two read as one continuous purple message thread —
        // the avatar+gap prefix is what actually gets this pill's left edge
        // sitting flush with the purple box's left edge above it, not a
        // one-off offset. Still staggered in ~220ms after the feedback
        // bubble (matching the old auto-reveal's timing) so it doesn't feel
        // like it snapped in simultaneously.
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...soft, delay: prefersReducedMotion ? 0 : soft.duration }}
          className="flex items-end gap-2 px-4 pt-2"
        >
          <img
            src="/images/Group%202136139939.png"
            alt=""
            className="h-6 w-6 shrink-0 rounded-full"
          />
          <button
            type="button"
            onClick={() => setShowHint(true)}
            className="inline-flex items-center gap-1.5 rounded-tl-2xl rounded-tr-2xl rounded-bl-md rounded-br-2xl border border-feedback-partial bg-feedback-partial/15 px-4 py-3 text-sm font-semibold text-text-primary"
          >
            <HintIcon className="h-4 w-4 text-feedback-warning" />
            Get a hint
          </button>
        </motion.div>
      )}
    </div>
  );
}
