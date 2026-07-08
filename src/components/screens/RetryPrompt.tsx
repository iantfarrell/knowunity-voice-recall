"use client";

import { motion, useReducedMotion } from "motion/react";
import { snappy } from "@/lib/motion";
import { MicIcon } from "@/components/icons";

interface RetryPromptProps {
  onMicPress?: () => void;
  onSkip?: () => void;
  onTypeInstead?: () => void;
}

// Still S8, SPEC.md §2.8 — the feedback stack's bottom controls (Figma node
// 68:3634's bottomCta), rendered as SessionShell's `children` once the
// feedback + hint bubbles (AnswerFeedback.tsx) show, inviting a second
// attempt at the term.
//
// Structurally the same mic + skip/type-instead row as TermPrompt (S2), but
// the label above the mic is a permanent "Tap to try again" rather than
// TermPrompt's first-visit-only, localStorage-gated "Press and hold to
// answer." hint. Kept as its own component instead of a TermPrompt prop so
// that one-time-hint logic doesn't leak into this always-shown label.
export default function RetryPrompt({
  onMicPress,
  onSkip,
  onTypeInstead,
}: RetryPromptProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex shrink-0 flex-col items-center gap-7 px-7 pb-7 pt-4">
      {/* pt-4 (16px) separates this from whatever bubble is scrolled to the
          bottom of SessionShell's chat log above it (e.g. the hint bubble
          in AnswerFeedback.tsx) — otherwise the two sit flush against each
          other since neither side owns that spacing on its own. */}
      {/* Nested gap-2 (8px) group, separate from the outer gap-7 — the
          "Tap to try again" label sits close to the mic button it labels,
          while the mic-to-skip/type-instead spacing stays at the wider
          rhythm shared with TermPrompt. */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-center text-sm text-text-secondary">Tap to try again</p>

        <motion.button
          type="button"
          aria-label="Hold to record your answer"
          onPointerDown={onMicPress}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
          transition={snappy}
          className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-accent-brand-bold shadow-[inset_0_-4px_0_rgba(0,0,0,0.15)]"
        >
          <MicIcon className="h-8 w-8 text-text-primary" />
        </motion.button>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onSkip}
          className="min-h-11 px-1 text-sm text-text-secondary"
        >
          Skip this term
        </button>
        <button
          type="button"
          onClick={onTypeInstead}
          className="min-h-11 px-1 text-sm font-medium text-accent-brand-bold"
        >
          Type instead
        </button>
      </div>
    </div>
  );
}
