"use client";

import { motion, useReducedMotion } from "motion/react";
import { soft } from "@/lib/motion";
import type { Term } from "@/lib/session-data";

interface TermBubbleProps {
  term: Term;
  /** Makes the bubble's own avatar invisible (opacity-0) without removing
   * it from layout. S7 (Figma node 63:3787) already shows an avatar on the
   * "Knowie is listening" row directly below this bubble — two avatars
   * stacked read as a duplicate, so that screen hides this one visually
   * and keeps only the lower one (see SessionShell's `hideBubbleAvatar` /
   * page.tsx). Opacity, not conditional rendering, so the bubble keeps its
   * usual avatar-width offset instead of shifting left. */
  showAvatar?: boolean;
}

// Knowie's chat bubble — term eyebrow/name/instruction + circular avatar.
// Identical across S2 (idle) and S5 (recording) per Figma nodes 62:8581 and
// 62:8876.
export default function TermBubble({ term, showAvatar = true }: TermBubbleProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      key={term.id}
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={soft}
      className="flex items-end gap-2 px-4 pt-6"
    >
      <img
        src="/images/Group%202136139939.png"
        alt=""
        aria-hidden={!showAvatar}
        className={`h-6 w-6 shrink-0 rounded-full ${showAvatar ? "" : "opacity-0"}`}
      />
      <div className="max-w-[270px] rounded-tl-2xl rounded-tr-2xl rounded-bl-md rounded-br-2xl bg-background-surface p-4">
        <p className="text-xs font-semibold tracking-wide text-accent-brand-bold">
          {term.eyebrow}
        </p>
        <p className="mt-1 text-2xl font-bold text-text-primary">{term.name}</p>
        {/* text-base (16px), not text-lg — matches the transcript/feedback/
            hint bubbles' body text elsewhere in this same chat log
            (AnswerTranscript.tsx, AnswerFeedback.tsx, CorrectFeedback.tsx)
            per the user's instruction that all bubble body copy be a
            consistent 16px. */}
        <p className="mt-1 text-base text-text-secondary">{term.instruction}</p>
      </div>
    </motion.div>
  );
}
