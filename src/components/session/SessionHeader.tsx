"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { snappy, soft } from "@/lib/motion";
import { BoltIcon, CloseIcon } from "@/components/icons";
import { TOTAL_TERMS } from "@/lib/session-data";

// How long the XP number ticks up over once it changes — same duration and
// rAF-tick approach as EndSummary's own "+N XP" count-up, reused here for
// consistency rather than a second, differently-timed animation technique.
const XP_COUNT_MS = 500;

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

  // sessionXp was a static prop with nothing that ever changed it until
  // page.tsx started actually incrementing it on a completed term — this
  // ticks the displayed number up to match instead of letting it hard-swap,
  // same rAF-tick technique as EndSummary's "+N XP" line. Reduced motion (or
  // the very first render) jumps straight to the real value; only a later
  // change to `sessionXp` animates.
  const [xpDisplay, setXpDisplay] = useState(sessionXp);
  const prevXpRef = useRef(sessionXp);

  useEffect(() => {
    const from = prevXpRef.current;
    const to = sessionXp;
    prevXpRef.current = to;
    if (from === to) return;
    // Reduced motion still routes through the same rAF callback rather than
    // calling setState directly in the effect body — a duration of 0 just
    // resolves to the end value on the very next frame instead of ticking,
    // so it's still an instant jump, just an async one (react-hooks/
    // set-state-in-effect flags a *synchronous* setState in an effect).
    const duration = prefersReducedMotion ? 0 : XP_COUNT_MS;
    const start = performance.now();
    function tick(now: number) {
      const progress = duration === 0 ? 1 : Math.min((now - start) / duration, 1);
      setXpDisplay(Math.round(from + (to - from) * progress));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [sessionXp, prefersReducedMotion]);

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
        {/* Full-width, scaled via `scaleX` rather than an animated `width` —
            motion-guide.md's "animate only transform and opacity" rule
            (width/height changes are what cause jank). Was a bare
            width-percentage `<div>` with no transition at all before, so
            once a real multi-term session advances termIndex, the fill
            would have jumped instantly instead of animating like everything
            else in this app does. `initial={false}` so it doesn't replay a
            fill-from-empty animation on first mount, only on later changes. */}
        <motion.div
          className="h-full origin-left rounded-full bg-accent-brand-bold"
          style={{ width: "100%" }}
          initial={false}
          animate={{ scaleX: progressFraction }}
          transition={prefersReducedMotion ? { duration: 0 } : soft}
        />
      </div>

      <div className="flex h-9 shrink-0 items-center gap-1 px-1">
        <BoltIcon className="h-[22px] w-[18px] text-accent-blue-onsubtle" />
        <span
          className="text-lg font-semibold text-accent-blue-onsubtle"
          aria-live="polite"
        >
          {xpDisplay}
        </span>
      </div>
    </div>
  );
}
