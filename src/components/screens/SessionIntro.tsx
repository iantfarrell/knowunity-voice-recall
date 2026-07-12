"use client";

import { motion, useReducedMotion } from "motion/react";
import { gentle, snappy, soft } from "@/lib/motion";
import { MicIcon, ScheduleIcon, HintIcon } from "@/components/icons";

// The new first screen of the prototype, reached before S2 (TermPrompt) —
// no Figma node covers this yet, so it's built directly from a user-supplied
// reference screenshot rather than a named frame (same convention
// TypeInstead.tsx uses for its own screenshot-sourced layout). Renders
// outside SessionShell entirely, same as EndSummary: like that screen, this
// one has no exit/progress/XP header or term bubble to share, just its own
// full-bleed content.
//
// Same staggerChildren entrance recipe as EndSummary's own "earned moment"
// landing (motion-guide.md) — reused here rather than invented fresh, so the
// very first and very last screens in the flow read as the same family of
// motion instead of one looking more considered than the other. Mascot gets
// the same treatment as EndSummary's XP figure: a `gentle` spring scale-in,
// a touch more weight than the plain fade/rise every other stagger item
// uses, since it's the one illustration on the page.
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: soft },
};
const mascotItem = {
  hidden: { opacity: 0, y: 8, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: gentle },
};

const INFO_CHIPS = [
  { label: "Voice or text", Icon: MicIcon },
  { label: "~5 min", Icon: ScheduleIcon },
  { label: "Hints if stuck", Icon: HintIcon },
];

interface SessionIntroProps {
  onStart?: () => void;
  onSkip?: () => void;
}

export default function SessionIntro({ onStart, onSkip }: SessionIntroProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      variants={container}
      initial={prefersReducedMotion ? "show" : "hidden"}
      animate="show"
      className="flex h-full flex-col"
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-7 text-center">
        <motion.img
          variants={mascotItem}
          src="/images/mascot%20big%20eyes.png"
          alt=""
          className="h-[120px] w-[120px] object-contain"
        />

        <motion.div variants={item} className="flex flex-col gap-2">
          <p className="text-3xl font-extrabold text-text-primary">
            Say it, don&rsquo;t just think it.
          </p>
          <p className="text-base text-text-secondary">
            Explain exam terms out loud. Knowie tells you what you got right
            and nudges you on the rest.
          </p>
        </motion.div>

        <motion.div
          variants={item}
          className="flex flex-wrap items-center justify-center gap-2 pt-2"
        >
          {INFO_CHIPS.map(({ label, Icon }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-border-default bg-background-surface px-3 py-1.5 text-sm text-text-secondary"
            >
              <Icon className="h-4 w-4" />
              {label}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="flex shrink-0 flex-col gap-2 px-4 py-6">
        {/* Same primary-CTA recipe as every other "commit" button in the
            flow (Submit, Next question): `snappy` + 0.96 scale. */}
        <motion.button
          variants={item}
          type="button"
          onClick={onStart}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
          transition={snappy}
          className="flex h-14 w-full items-center justify-center rounded-full bg-interactive-primary text-xl font-bold text-interactive-onprimary shadow-[inset_0_-4px_0_rgba(0,0,0,0.15)]"
        >
          Let&rsquo;s start
        </motion.button>

        {/* Secondary text-link weight, same as Skip/Type instead elsewhere
            (`snappy`, 0.97 scale) — no other destination is built for this
            yet, so it's a stub per the established console.log convention. */}
        <motion.button
          variants={item}
          type="button"
          onClick={onSkip}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
          transition={snappy}
          className="min-h-11 px-1 text-center text-sm text-text-secondary"
        >
          Skip for now
        </motion.button>
      </div>
    </motion.div>
  );
}
