"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { snappy, soft } from "@/lib/motion";

// sprint-context.md: "Push-to-talk recording; cancel available throughout;
// 90s auto-stop."
const AUTO_STOP_SECONDS = 90;

// A decorative waveform envelope (SPEC.md's recall loop is entirely mocked —
// no real audio is captured, so there's no live amplitude to plot). The
// shape still matches the bar pattern in Figma node 62:8876's "Waveform
// Playing" group; each bar's height below is its resting/base height, now
// animated per-bar where it's rendered below so it reads as live recording
// feedback rather than a static snapshot. Originally each of the 15 bars
// pulsed on its own independent phase (per a "live audio input" reference
// gif); that read as busier than motion-guide.md wants for a screen the
// student is meant to be speaking over ("one pulse, not a light show" —
// looping background motion while the student reads/speaks is explicitly
// called out as something NOT to animate). Bars are now grouped into 3
// synced clusters with a shared, narrower swing so the panel reads as a
// single calm "listening" pulse instead of 15 independent ones.
const WAVEFORM_BARS = [2, 8, 14, 4, 16, 14, 10, 10, 10, 14, 10, 16, 10, 4, 2];

// S5's distinguishing content — the recording bottom panel (status row,
// timer, waveform, stop button). Rendered as the `children` of SessionShell,
// which owns the header + term bubble shared with S2 (see SessionShell.tsx).
interface RecordingActiveProps {
  onCancel?: () => void;
  onStop?: () => void;
}

function formatElapsed(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function RecordingActive({
  onCancel,
  onStop,
}: RecordingActiveProps) {
  const prefersReducedMotion = useReducedMotion();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (elapsedSeconds >= AUTO_STOP_SECONDS) onStop?.();
  }, [elapsedSeconds, onStop]);

  return (
    // Figma node 62:8876's bottom panel (data-node-id 62:8917) carries a
    // full 1px border, no rounded corners — matched literally here rather
    // than reusing the bottom-sheet radius convention from other panels.
    // Fades/rises in on arrival (motion-guide.md's "screen-to-screen"
    // recipe) rather than hard-cutting in from TermPrompt's mic tap — this
    // panel used to have no entrance motion of its own at all.
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={soft}
      className="flex shrink-0 flex-col items-center gap-4 border border-border-default px-7 pb-7 pt-6"
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.span
            aria-hidden="true"
            className="h-2 w-2 rounded-full bg-feedback-error"
            animate={prefersReducedMotion ? undefined : { scale: 1.08 }}
            transition={
              prefersReducedMotion
                ? undefined
                : { repeat: Infinity, repeatType: "reverse", duration: 1 }
            }
          />
          <span className="text-sm font-medium text-feedback-error">
            Recording
          </span>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="min-h-11 px-1 text-sm text-text-secondary"
        >
          Cancel
        </button>
      </div>

      <p
        className="text-[32px] tabular-nums text-text-primary"
        aria-live="polite"
        aria-label={`${formatElapsed(elapsedSeconds)} elapsed`}
      >
        {formatElapsed(elapsedSeconds)}
      </p>

      <div className="flex h-14 w-full items-center justify-center gap-1 rounded-2xl bg-background-surface px-6">
        {WAVEFORM_BARS.map((height, i) => {
          // Bar heights come from the fixed WAVEFORM_BARS data above, not a
          // hand-picked visual value — same inline-style exception as the
          // progress bar (see SessionHeader). Bars are grouped into 3 synced
          // clusters (by index mod 3) sharing one duration and a small,
          // group-offset delay, so the panel reads as one calm pulse moving
          // across a few clusters rather than 15 bars each doing their own
          // thing — a narrower scaleY swing too, since this loops the whole
          // time the student is speaking (motion-guide.md: "one pulse, not
          // a light show").
          const group = i % 3;
          const duration = 0.9;
          const delay = group * 0.15;
          return (
            <motion.span
              key={i}
              className="w-0.5 shrink-0 rounded-full bg-accent-brand-bold opacity-50"
              style={{ height }}
              animate={
                prefersReducedMotion ? undefined : { scaleY: [1, 0.6, 1] }
              }
              transition={
                prefersReducedMotion
                  ? undefined
                  : {
                      duration,
                      delay,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut",
                    }
              }
            />
          );
        })}
      </div>

      <motion.button
        type="button"
        aria-label="Stop recording"
        onClick={onStop}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
        transition={snappy}
        className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-feedback-error"
      >
        <span className="h-5 w-5 rounded-md bg-feedback-error" />
      </motion.button>
    </motion.div>
  );
}
