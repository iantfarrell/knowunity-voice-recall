"use client";

import { motion, useReducedMotion } from "motion/react";
import { gentle, snappy, soft } from "@/lib/motion";

// feedback.md's "[M] Transcript before submit" fix: testers skipped the fake
// audio playback entirely and wanted to see what was actually heard before
// committing to Submit. This screen used to show a mock waveform + play/
// pause button (SPEC.md §2.6's "static waveform snapshot") with no way to
// check the words themselves; it now shows the same read-only STT transcript
// text that later appears in the chat-bubble log (AnswerTranscript.tsx),
// reusing that component's own "YOUR ANSWER" label and
// background-transcript surface so the two reads feel like the same piece
// of UI rather than an invented new style. No highlighted spans here,
// though — those mark words the (mocked) grading step recognized, and
// grading hasn't happened yet at this point in the flow.
interface PlaybackReviewProps {
  transcript: string;
  onSubmit?: () => void;
  onRecordAgain?: () => void;
  onTypeInstead?: () => void;
}

export default function PlaybackReview({
  transcript,
  onSubmit,
  onRecordAgain,
  onTypeInstead,
}: PlaybackReviewProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    // Figma node 63:3538's bottom panel (data-node-id 63:3579) carries the
    // same full 1px border, no rounded corners, as S5's panel. Fades/rises in
    // on arrival (motion-guide.md's "screen-to-screen" recipe) rather than
    // hard-cutting in from RecordingActive's Stop tap — this panel used to
    // have no entrance motion of its own at all.
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={soft}
      className="flex w-full flex-col items-center gap-4 border border-border-default p-7"
    >
      {/* This card is the flow's "say it back" moment — Knowie reading the
          transcript back before the student commits to it. Previously it
          entered as part of the same flat opacity/y fade as the whole panel
          (buttons included), so it read as just more UI landing rather than
          something being presented for review. A short `gentle` spring,
          delayed a beat behind the panel border, gives it its own small
          "here's what we heard, take a look" landing — an invitation to
          check the transcript, not just the next screen cut. */}
      <motion.div
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ ...gentle, delay: prefersReducedMotion ? 0 : 0.08 }}
        className="w-full rounded-2xl bg-background-transcript p-4"
      >
        <p className="text-xs font-semibold tracking-wide text-accent-brand-bold">
          YOUR ANSWER
        </p>
        <p className="mt-1 text-base italic text-text-primary">
          &ldquo;{transcript}&rdquo;
        </p>
      </motion.div>

      <div className="flex w-full flex-col items-center gap-2">
        {/* Committing an answer that can't be edited afterward (SPEC.md's
            "no transcript editing") is the highest-stakes tap in the flow —
            it previously gave zero tactile confirmation, unlike the mic/stop
            buttons. Same whileTap+snappy recipe as those. */}
        <motion.button
          type="button"
          onClick={onSubmit}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
          transition={snappy}
          className="flex h-14 w-full items-center justify-center rounded-full bg-interactive-primary text-xl font-bold text-interactive-onprimary shadow-[inset_0_-4px_0_rgba(0,0,0,0.15)]"
        >
          Submit
        </motion.button>

        {/* "Record again" is the Figma-specified secondary action;
            "Type instead" isn't in this specific frame but is required on
            every recall screen per CLAUDE.md / sprint-context.md's "Type
            instead available at three points: term prompt, audio review,
            result screen" — added here as the de-emphasized option,
            mirroring S2's skip/type-instead pairing. */}
        {/* Same secondary-action press recipe as TermPrompt's Skip/Type
            instead (`snappy`, 0.97 scale). */}
        <div className="flex items-center gap-4">
          <motion.button
            type="button"
            onClick={onRecordAgain}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
            transition={snappy}
            className="min-h-11 px-1 text-sm font-medium text-accent-brand-bold"
          >
            Record again
          </motion.button>
          <motion.button
            type="button"
            onClick={onTypeInstead}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
            transition={snappy}
            className="min-h-11 px-1 text-sm text-text-secondary"
          >
            Type instead
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
