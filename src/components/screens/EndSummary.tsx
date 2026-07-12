"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { gentle, snappy, soft } from "@/lib/motion";
import { MicIcon, CheckIcon, EyeIcon, MinusIcon, ScheduleIcon } from "@/components/icons";

// motion-guide.md's "end-of-session summary" recipe: stagger the lines in
// (staggerChildren: 0.06) as "a subtle, earned moment, not confetti" —
// previously every element here (mascot, XP, headline, chips, all 5 term
// rows, both CTAs) rendered instantly, all at once, with zero motion
// anywhere in this file. SectionDividers are deliberately left out of the
// stagger (decorative rules, not content the student needs to register) per
// motion-guide's "one thing moving at a time" restraint.
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: soft },
};
// The "+100 XP" line is the actual deposit — the one payoff sprint-context.md
// calls a retention mechanic ("XP deposits only at summary") — so it gets a
// touch more weight than a plain list line: a `gentle` spring scale-in
// instead of the flat opacity/y every other stagger item uses. Kept subtle
// on purpose (no bounce beyond what `gentle`'s spring already gives, no
// particles) per the guide's own "not confetti" instruction.
const xpItem = {
  hidden: { opacity: 0, y: 8, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: gentle },
};
const XP_TOTAL = 100;
// How long the number ticks up once its stagger slot fires — short enough to
// stay "subtle, earned," not a slot-machine spin.
const XP_COUNT_MS = 500;

// S10 — session summary (Figma node 110:7707, "end summary"). Reached "for
// the sake of the prototype" from the retry's "Next question" CTA
// (page.tsx) — SPEC.md's real per-term math (S9's "advance to next term"
// loop, §2.10's "computed from the actual scripted outcomes" requirement)
// isn't wired up yet, and session-data.ts only scripts term 0 (Mitosis).
// So, same as AnswerFeedback.tsx/CorrectFeedback.tsx's hardcoded canned
// copy, this literally reproduces the named Figma frame's content — a
// 5-term recap unrelated to the single live term this prototype actually
// plays through — rather than computing anything from real session state.
interface TermResult {
  name: string;
  sublabel: string;
  xpDelta: number;
  status: "nailed" | "hinted" | "revealed" | "skipped";
}

const TERM_RESULTS: TermResult[] = [
  { name: "Mitosis", sublabel: "Got it first try", xpDelta: 30, status: "nailed" },
  { name: "Cell membrane", sublabel: "Got it with 1 hint", xpDelta: 15, status: "hinted" },
  { name: "Meiosis", sublabel: "Revealed after 3 attempts", xpDelta: 0, status: "revealed" },
  { name: "Chromosomes", sublabel: "Got it first try", xpDelta: 30, status: "nailed" },
  { name: "DNA Replication", sublabel: "Skipped", xpDelta: 0, status: "skipped" },
];

const STRENGTHEN_TERMS = ["Meiosis", "DNA Replication"];

// Per-status icon-circle styling — colors approximate the frame's baked
// icon+circle image exports (Figma nodes 110:7748/7756/7764/7780) using
// this app's existing token palette rather than importing new raster
// assets, per icons.tsx's convention of hand-coding generic UI glyphs.
const STATUS_STYLES: Record<
  TermResult["status"],
  { circleClass: string; iconClass: string; Icon: typeof CheckIcon }
> = {
  nailed: {
    circleClass: "bg-feedback-correct/20",
    iconClass: "text-highlight-recognized",
    Icon: CheckIcon,
  },
  hinted: {
    circleClass: "bg-feedback-warning-chip/20",
    iconClass: "text-feedback-warning",
    Icon: CheckIcon,
  },
  revealed: {
    circleClass: "bg-accent-blue-bold/20",
    iconClass: "text-accent-blue-onsubtle",
    Icon: EyeIcon,
  },
  skipped: {
    circleClass: "bg-background-surface",
    iconClass: "text-text-secondary",
    Icon: MinusIcon,
  },
};

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex w-full items-center gap-2 px-4 py-2">
      <span className="shrink-0 text-xs tracking-wide text-text-tertiary">
        {label}
      </span>
      <div className="h-px flex-1 bg-border-default" />
    </div>
  );
}

function NeutralChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-6 items-center rounded-full border border-border-neutral bg-background-transcript px-2 text-[9px] font-medium tracking-wide text-text-primary">
      {children}
    </span>
  );
}

export default function EndSummary() {
  const prefersReducedMotion = useReducedMotion();
  // Starts at the final value under reduced motion (no tick), 0 otherwise —
  // ticked up to XP_TOTAL once the "+100 XP" line's own entrance spring
  // finishes (see onAnimationComplete below), not on mount, so the count-up
  // reads as following the line landing rather than racing ahead of it.
  const [xpDisplay, setXpDisplay] = useState(prefersReducedMotion ? XP_TOTAL : 0);

  function startXpCountUp() {
    if (prefersReducedMotion) return;
    const start = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - start) / XP_COUNT_MS, 1);
      setXpDisplay(Math.round(progress * XP_TOTAL));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  return (
    <motion.div
      variants={container}
      initial={prefersReducedMotion ? "show" : "hidden"}
      animate="show"
      className="flex h-full flex-col"
    >
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center gap-2 px-4 pb-4 pt-8">
          <motion.img
            variants={item}
            src="/images/mascot%20big%20eyes.png"
            alt=""
            className="h-[120px] w-[120px] object-contain"
          />

          <motion.p
            variants={xpItem}
            onAnimationComplete={(definition) => {
              if (definition === "show") startXpCountUp();
            }}
            className="text-[44px] font-black leading-[48px] tracking-[-0.44px] text-feedback-warning"
          >
            +{xpDisplay} XP
          </motion.p>

          <motion.div
            variants={item}
            className="flex flex-col items-center gap-1 text-center"
          >
            <p className="text-2xl font-bold text-text-primary">
              Great job on Cell Division
            </p>
            <p className="text-base text-text-secondary">
              3 of 5 terms nailed - 2 left to strengthen
            </p>
          </motion.div>

          <motion.div
            variants={item}
            className="flex flex-wrap items-center justify-center gap-1 pt-2"
          >
            <span className="inline-flex h-6 items-center rounded-full border border-highlight-recognized bg-feedback-correct/15 px-2 text-[9px] font-medium tracking-wide text-feedback-correct">
              3 nailed
            </span>
            <span className="inline-flex h-6 items-center rounded-full border border-feedback-warning bg-feedback-warning-chip/15 px-2 text-[9px] font-medium tracking-wide text-feedback-warning">
              1 with hints
            </span>
            <NeutralChip>1 revealed</NeutralChip>
            <NeutralChip>1 skipped</NeutralChip>
          </motion.div>
        </div>

        <SectionDivider label="THIS SESSION" />

        <div className="flex flex-col">
          {TERM_RESULTS.map((term) => {
            const { circleClass, iconClass, Icon } = STATUS_STYLES[term.status];
            const xpClass =
              term.status === "nailed"
                ? "text-feedback-xp-positive"
                : term.status === "hinted"
                  ? "text-feedback-warning"
                  : "text-text-tertiary";

            return (
              <motion.div
                key={term.name}
                variants={item}
                className="flex items-center justify-between px-4 py-2"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${circleClass}`}
                  >
                    <Icon className={`h-4 w-4 ${iconClass}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {term.name}
                    </p>
                    <p className="text-sm text-text-tertiary">{term.sublabel}</p>
                  </div>
                </div>
                <p className={`text-sm font-medium ${xpClass}`}>
                  {term.xpDelta > 0 ? `+${term.xpDelta}` : term.xpDelta}
                </p>
              </motion.div>
            );
          })}
        </div>

        <SectionDivider label={`${STRENGTHEN_TERMS.length} TERMS TO STRENGTHEN`} />

        <motion.div
          variants={item}
          className="flex flex-wrap items-center gap-1 px-4 pb-4"
        >
          {STRENGTHEN_TERMS.map((name) => (
            <NeutralChip key={name}>
              <span className="mr-1 inline-block h-1 w-1 rounded-full bg-feedback-error" />
              {name}
            </NeutralChip>
          ))}
        </motion.div>
      </div>

      <div className="flex shrink-0 flex-col gap-2 px-4 py-6">
        <motion.button
          variants={item}
          type="button"
          onClick={() =>
            console.log("repeat missed questions tapped — S9 not built yet")
          }
          whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
          // `snappy`, not `soft` — motion-guide.md's "feedback should feel
          // instant" rule (the entrance stagger above this still uses
          // `item`'s own `soft`, via that variant's explicit transition;
          // this prop only governs the whileTap spring).
          transition={snappy}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-interactive-primary text-xl font-bold text-interactive-onprimary shadow-[inset_0_-4px_0_rgba(0,0,0,0.15)]"
        >
          <MicIcon className="h-6 w-6" />
          Repeat missed questions
        </motion.button>
        <motion.button
          variants={item}
          type="button"
          onClick={() => console.log("remind me tomorrow tapped — S9 not built yet")}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
          transition={snappy}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-background-surface text-xl font-bold text-text-primary shadow-[inset_0_-4px_0_rgba(0,0,0,0.15)]"
        >
          <ScheduleIcon className="h-6 w-6" />
          Remind me tomorrow
        </motion.button>
      </div>
    </motion.div>
  );
}
