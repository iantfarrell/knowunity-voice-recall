"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { snappy, soft } from "@/lib/motion";
import { MicIcon } from "@/components/icons";
import type { Term } from "@/lib/session-data";

const MIC_HINT_KEY = "hasSeenMicHint";

// S2's distinguishing content — the idle bottom controls (mic hint, mic
// button, skip/type-instead). Rendered as the `children` of SessionShell,
// which owns the header + term bubble shared with S5 (see SessionShell.tsx).
interface TermPromptProps {
  term: Term;
  onMicPress?: () => void;
  onSkip?: () => void;
  onTypeInstead?: () => void;
}

export default function TermPrompt({
  term,
  onMicPress,
  onSkip,
  onTypeInstead,
}: TermPromptProps) {
  const prefersReducedMotion = useReducedMotion();
  const [showMicHint, setShowMicHint] = useState(false);

  // First-term, first-visit-only contextual hint (SPEC.md §2.3 / §6).
  useEffect(() => {
    if (term.index !== 0) return;
    const hasSeen = window.localStorage.getItem(MIC_HINT_KEY);
    if (!hasSeen) setShowMicHint(true);
  }, [term.index]);

  const dismissMicHint = () => {
    if (!showMicHint) return;
    window.localStorage.setItem(MIC_HINT_KEY, "true");
    setShowMicHint(false);
  };

  const handleMicPress = () => {
    dismissMicHint();
    onMicPress?.();
  };

  return (
    <div className="flex shrink-0 flex-col items-center gap-7 px-7 pb-7">
      {showMicHint && (
        <motion.p
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={soft}
          className="text-center text-sm text-text-secondary"
        >
          Tap to answer.
        </motion.p>
      )}

      <motion.button
        type="button"
        aria-label="Hold to record your answer"
        onPointerDown={handleMicPress}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
        transition={snappy}
        className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-accent-brand-bold shadow-[inset_0_-4px_0_rgba(0,0,0,0.15)]"
      >
        <MicIcon className="h-8 w-8 text-text-primary" />
      </motion.button>

      {/* Secondary text-link actions previously had zero tactile feedback —
          only the mic did. Same `snappy` recipe as the mic (motion-guide.md's
          "feedback should feel instant" rule), but a lighter 0.97 scale to
          match their smaller visual weight instead of the mic's 0.94. */}
      <div className="flex items-center gap-4">
        <motion.button
          type="button"
          onClick={onSkip}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
          transition={snappy}
          className="min-h-11 px-1 text-sm text-text-secondary"
        >
          Skip this term
        </motion.button>
        <motion.button
          type="button"
          onClick={onTypeInstead}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
          transition={snappy}
          className="min-h-11 px-1 text-sm font-medium text-accent-brand-bold"
        >
          Type instead
        </motion.button>
      </div>
    </div>
  );
}
