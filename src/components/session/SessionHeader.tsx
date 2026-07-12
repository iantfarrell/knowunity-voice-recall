"use client";

import { motion, useReducedMotion } from "motion/react";
import { snappy } from "@/lib/motion";
import { BoltIcon, CloseIcon } from "@/components/icons";
import { TOTAL_TERMS } from "@/lib/session-data";

interface SessionHeaderProps {
  termIndex: number;
  sessionXp: number;
  onExitRequest?: () => void;
}

// Shared top row — close icon, per-term progress bar, live XP counter.
// Identical across S2 (idle) and S5 (recording) per Figma nodes 62:8581 and
// 62:8876; extracted here so both screens stay pixel-identical by construction.
export default function SessionHeader({
  termIndex,
  sessionXp,
  onExitRequest,
}: SessionHeaderProps) {
  const prefersReducedMotion = useReducedMotion();
  // Progress reflects position within the session, counting the current term
  // as started (matches the ~partial fill shown on term 1 in both frames).
  const progressFraction = (termIndex + 1) / (TOTAL_TERMS + 1);

  return (
    <div className="flex h-14 shrink-0 items-center gap-1 px-3 pb-2">
      {/* The one-tap exit for the whole session — highest-stakes control in
          the header, but previously had only a CSS hover tint, no tap
          feedback at all. Same weight as the mic (`snappy`, 0.94 scale). */}
      <motion.button
        type="button"
        aria-label="Exit voice recall session"
        onClick={onExitRequest}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
        transition={snappy}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-text-primary transition-colors hover:bg-background-surface"
      >
        <CloseIcon className="h-6 w-6" />
      </motion.button>

      <div
        className="h-2 min-w-px flex-1 overflow-hidden rounded-full bg-background-surface"
        role="progressbar"
        aria-valuenow={termIndex + 1}
        aria-valuemin={1}
        aria-valuemax={TOTAL_TERMS}
        aria-label={`Term ${termIndex + 1} of ${TOTAL_TERMS}`}
      >
        {/* Width is a runtime-computed fraction, not a static design value —
            the one inline style exception, since Tailwind can't express it
            as a class (CLAUDE.md "never style with raw hex or inline
            styles" targets hand-picked visual values, not this). */}
        <div
          className="h-full rounded-full bg-accent-brand-bold"
          style={{ width: `${progressFraction * 100}%` }}
        />
      </div>

      <div className="flex h-9 shrink-0 items-center gap-1 px-1">
        <BoltIcon className="h-[22px] w-[18px] text-accent-blue-onsubtle" />
        <span
          className="text-lg font-semibold text-accent-blue-onsubtle"
          aria-live="polite"
        >
          {sessionXp}
        </span>
      </div>
    </div>
  );
}
