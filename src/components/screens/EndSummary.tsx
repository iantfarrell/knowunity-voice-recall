"use client";

import { MicIcon, CheckIcon, EyeIcon, MinusIcon, ScheduleIcon } from "@/components/icons";

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
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center gap-2 px-4 pb-4 pt-8">
          <img
            src="/images/mascot%20big%20eyes.png"
            alt=""
            className="h-[120px] w-[120px] object-contain"
          />

          <p className="text-[44px] font-black leading-[48px] tracking-[-0.44px] text-feedback-warning">
            +100 XP
          </p>

          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-2xl font-bold text-text-primary">
              Great job on Cell Division
            </p>
            <p className="text-base text-text-secondary">
              3 of 5 terms nailed - 2 left to strengthen
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1 pt-2">
            <span className="inline-flex h-6 items-center rounded-full border border-highlight-recognized bg-feedback-correct/15 px-2 text-[9px] font-medium tracking-wide text-feedback-correct">
              3 nailed
            </span>
            <span className="inline-flex h-6 items-center rounded-full border border-feedback-warning bg-feedback-warning-chip/15 px-2 text-[9px] font-medium tracking-wide text-feedback-warning">
              1 with hints
            </span>
            <NeutralChip>1 revealed</NeutralChip>
            <NeutralChip>1 skipped</NeutralChip>
          </div>
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
              <div
                key={term.name}
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
              </div>
            );
          })}
        </div>

        <SectionDivider label={`${STRENGTHEN_TERMS.length} TERMS TO STRENGTHEN`} />

        <div className="flex flex-wrap items-center gap-1 px-4 pb-4">
          {STRENGTHEN_TERMS.map((name) => (
            <NeutralChip key={name}>
              <span className="mr-1 inline-block h-1 w-1 rounded-full bg-feedback-error" />
              {name}
            </NeutralChip>
          ))}
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-2 px-4 py-6">
        <button
          type="button"
          onClick={() =>
            console.log("repeat missed questions tapped — S9 not built yet")
          }
          className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-interactive-primary text-xl font-bold text-interactive-onprimary shadow-[inset_0_-4px_0_rgba(0,0,0,0.15)]"
        >
          <MicIcon className="h-6 w-6" />
          Repeat missed questions
        </button>
        <button
          type="button"
          onClick={() => console.log("remind me tomorrow tapped — S9 not built yet")}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-background-surface text-xl font-bold text-text-primary shadow-[inset_0_-4px_0_rgba(0,0,0,0.15)]"
        >
          <ScheduleIcon className="h-6 w-6" />
          Remind me tomorrow
        </button>
      </div>
    </div>
  );
}
