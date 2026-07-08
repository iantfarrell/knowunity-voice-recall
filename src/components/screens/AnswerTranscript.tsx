"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { soft } from "@/lib/motion";
import type { TermAttempt } from "@/lib/session-data";

// User instruction for this screen: once the transcript bubble has shown,
// auto-advance to the feedback/hint screen (Figma node 68:3634) after 1s —
// just long enough to read the echoed transcript before Knowie responds.
const AUTO_ADVANCE_MS = 1000;

interface AnswerTranscriptProps {
  // Narrowed to just the two fields this component actually renders (rather
  // than the full TermAttempt) so it can also render a second attempt's
  // transcript (see page.tsx's SECOND_ATTEMPT, Figma node 68:8055 — "2nd
  // transcript") without having to fabricate unused feedbackStatus/
  // feedbackText values just to satisfy the type.
  attempt: Pick<TermAttempt, "transcript" | "highlightedSpans">;
  /** Fires once, ~1s after mount — advances to the feedback + hint bubbles.
   * Omit when this transcript isn't followed by an auto-advance (e.g. a
   * second attempt's transcript, which just needs to fade in and stay). */
  onComplete?: () => void;
}

// Splits `text` on every occurrence of any string in `spans` (in the order
// they appear), returning an array of { text, highlighted } chunks. Spans are
// matched literally against the mocked transcript, so this stays simple —
// no fuzzy matching needed since both strings come from the same fixture
// (session-data.ts).
function splitHighlighted(text: string, spans: string[] | undefined) {
  if (!spans || spans.length === 0) return [{ text, highlighted: false }];

  const pattern = spans
    .map((span) => span.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  const parts = text.split(new RegExp(`(${pattern})`, "g"));

  return parts
    .filter((part) => part.length > 0)
    .map((part) => ({ text: part, highlighted: spans.includes(part) }));
}

// S8 (SPEC.md §2.8, "Feedback stack") — the transcript-echo bubble (Figma
// node 67:3932). Reached automatically when S7 (ProcessingAnswer) finishes
// its 4s cap. Per design.md §"Transcript & feedback — chat-bubble log, not
// screen replacement", this is the FIRST of several bubbles that stack
// here — the graded-feedback badge bubble and hint badge bubble (Figma node
// 68:3634, AnswerFeedback.tsx) follow after this component's own 1s
// auto-advance timer.
//
// Shows the student's own (mocked) words, so its bubble shape mirrors
// Knowie's — small corner on the bottom-RIGHT instead of bottom-LEFT — and
// it has no avatar, unlike TermBubble. Rendered via SessionShell's
// `afterBubble` slot (same slot S7 uses) since Figma places it in the same
// middleContent column as the term bubble, not the bottom control area.
export default function AnswerTranscript({ attempt, onComplete }: AnswerTranscriptProps) {
  const prefersReducedMotion = useReducedMotion();
  const chunks = splitHighlighted(attempt.transcript, attempt.highlightedSpans);

  // This component stays mounted well past its own 1s window — it keeps
  // rendering through "feedbackHint" and into a retry attempt's "recording"
  // screen (see page.tsx's hasSeenFeedback) — while page.tsx passes a fresh
  // inline `onComplete` on every one of ITS re-renders. Depending on
  // `onComplete` directly re-armed this effect (a brand-new setTimeout) on
  // every such re-render, so ~1s after ANY later re-render — e.g. pressing
  // the retry mic, which flips `screen` to "recording" — it fired again and
  // yanked the screen straight back to "feedbackHint". A ref holds the
  // latest callback so the timer itself is scheduled exactly once, on
  // mount, and never gets re-armed by later prop churn.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const id = window.setTimeout(() => onCompleteRef.current?.(), AUTO_ADVANCE_MS);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={soft}
      className="flex justify-start py-3 pl-16 pr-4"
    >
      <div className="max-w-[294px] rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-md bg-background-transcript p-4">
        <p className="text-xs font-semibold tracking-wide text-accent-brand-bold">
          TRANSCRIPT
        </p>
        {/* text-base (16px), not text-lg — matches the feedback/hint bubble
            body text (AnswerFeedback.tsx, CorrectFeedback.tsx) per the
            user's instruction that all bubble body copy in this stack be a
            consistent 16px. */}
        <p className="mt-1 text-base italic text-text-primary">
          &ldquo;
          {chunks.map((chunk, i) =>
            chunk.highlighted ? (
              <span key={i} className="font-semibold text-highlight-recognized">
                {chunk.text}
              </span>
            ) : (
              <span key={i}>{chunk.text}</span>
            ),
          )}
          &rdquo;
        </p>
      </div>
    </motion.div>
  );
}
