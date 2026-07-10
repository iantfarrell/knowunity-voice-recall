"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { soft } from "@/lib/motion";

// Still S8, SPEC.md §2.8 ("Feedback stack") — the graded-feedback badge +
// hint content, all inside ONE bubble (Figma node 68:3634, "first hint").
// Follows the transcript bubble (AnswerTranscript.tsx) in the same
// afterBubble stack (design.md §"Transcript & feedback — chat-bubble log").
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
  // hint" inside the bubble — showHint is set by that tap, not a timer.
  // The re-attempt mic CTA (RetryPrompt, rendered independently by
  // page.tsx) is unaffected either way, so it's already on screen before
  // any hint content appears, satisfying feedback.md's "re-attempt CTA
  // must appear before any hint content is visible."
  const [showHint, setShowHint] = useState(false);

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={soft}
      className="flex items-end gap-2 px-4 pt-2"
    >
      <img
        src="/images/Group%202136139939.png"
        alt=""
        className="h-6 w-6 shrink-0 rounded-full"
      />
      {/* User instruction (with a reference screenshot of the target look):
          one continuous purple bubble holds the badge, feedback text, the
          "Get a hint" gate, and — once tapped — the hint text itself. No
          separate bubble, no separate amber box/badge for the hint; it's
          all one Knowie message that grows in place. */}
      {/* max-w-[294px] matches AnswerTranscript.tsx's "YOUR ANSWER" bubble
          exactly (user instruction) — at 326px this box (avatar+gap on the
          LEFT) stretched all the way to the right padding edge, extending
          32px further right than the transcript bubble above it (whose
          avatar+gap sits on the RIGHT instead) and visually sitting under
          that bubble's avatar. Matching widths keeps every bubble's right
          edge aligned in one column. */}
      <div className="max-w-[294px] rounded-tl-2xl rounded-tr-2xl rounded-bl-md rounded-br-2xl border border-feedback-partial bg-feedback-partial/15 p-4">
        <span className="inline-block rounded-lg bg-feedback-warning-chip/20 px-2 py-0.5 text-xs font-semibold tracking-wide text-feedback-warning">
          PARTIALLY RIGHT
        </span>
        <p className="mt-2 text-base text-text-primary">
          {FEEDBACK_LEAD} <span className="font-bold">{FEEDBACK_QUESTION}</span>
        </p>
        <button
          type="button"
          onClick={() => setShowHint(true)}
          disabled={showHint}
          className="mt-3 inline-flex items-center rounded-full border border-feedback-partial px-4 py-2 text-sm font-semibold text-text-primary"
        >
          {showHint ? "Hint reveal" : "Get a hint"}
        </button>
        {showHint && (
          <p className="mt-3 text-base text-text-primary">{HINT_TEXT}</p>
        )}
      </div>
    </motion.div>
  );
}
