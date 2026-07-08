"use client";

import { useEffect, useState } from "react";

// The recorded duration shown on the mocked player — matches Figma's static
// "0:05" label (SPEC.md §2.6: "static waveform snapshot," no real audio).
const RECORDING_DURATION_SECONDS = 5;

// S6's distinguishing content — the playback-review bottom panel (mock
// player, Submit / Record again / Type instead). Rendered as the `children`
// of SessionShell, which owns the header + term bubble shared with S2/S5.
interface PlaybackReviewProps {
  onSubmit?: () => void;
  onRecordAgain?: () => void;
  onTypeInstead?: () => void;
}

export default function PlaybackReview({
  onSubmit,
  onRecordAgain,
  onTypeInstead,
}: PlaybackReviewProps) {
  // SPEC.md §2.6: "Tapping play runs a fake playback animation — a
  // scrubbing progress indicator across the waveform for the recorded
  // duration, no real audio." Mocked here as a timed play/pause toggle.
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const id = window.setTimeout(
      () => setIsPlaying(false),
      RECORDING_DURATION_SECONDS * 1000,
    );
    return () => window.clearTimeout(id);
  }, [isPlaying]);

  return (
    // Figma node 63:3538's bottom panel (data-node-id 63:3579) carries the
    // same full 1px border, no rounded corners, as S5's panel.
    <div className="flex w-full flex-col items-center gap-4 border border-border-default p-7">
      <div className="flex w-full items-center gap-2 rounded-3xl bg-background-page py-2 pl-2 pr-3">
        <button
          type="button"
          aria-label={isPlaying ? "Pause playback" : "Play back your answer"}
          onClick={() => setIsPlaying((current) => !current)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        >
          {/* Figma's actual "Player Play"/"Player Pause" button assets
              (node 63:3746 and its pause counterpart), not hand-coded
              icons — supplied directly as images/Player Play.png and
              images/Player Pause.png rather than reconstructed from
              tokens, so the button's circle color/shape always match the
              source asset exactly in both states. */}
          <img
            src={
              isPlaying
                ? "/images/Player%20Pause.png"
                : "/images/Player%20Play.png"
            }
            alt=""
            className="h-8 w-8 rounded-full"
          />
        </button>

        <div className="flex min-w-0 flex-1 items-center justify-center overflow-hidden">
          {/* Figma's actual waveform snapshot asset (node 63:3538's
              "Player" waveform group), supplied directly as
              images/waveform.png rather than reconstructed from
              hand-picked bar heights. Centered in the gap between the
              play/pause button and the duration label. Rendered at its
              real 172x32 design size — the source file is a 2x export
              (344x64) for crisp retina rendering. */}
          <img
            src="/images/waveform.png"
            alt=""
            className="h-8 w-[172px] shrink-0"
          />
        </div>

        <span className="shrink-0 text-sm tabular-nums text-text-secondary">
          0:{RECORDING_DURATION_SECONDS.toString().padStart(2, "0")}
        </span>
      </div>

      <div className="flex w-full flex-col items-center gap-2">
        <button
          type="button"
          onClick={onSubmit}
          className="flex h-14 w-full items-center justify-center rounded-full bg-interactive-primary text-xl font-bold text-interactive-onprimary shadow-[inset_0_-4px_0_rgba(0,0,0,0.15)]"
        >
          Submit
        </button>

        {/* "Record again" is the Figma-specified secondary action;
            "Type instead" isn't in this specific frame but is required on
            every recall screen per CLAUDE.md / sprint-context.md's "Type
            instead available at three points: term prompt, audio review,
            result screen" — added here as the de-emphasized option,
            mirroring S2's skip/type-instead pairing. */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onRecordAgain}
            className="min-h-11 px-1 text-sm font-medium text-accent-brand-bold"
          >
            Record again
          </button>
          <button
            type="button"
            onClick={onTypeInstead}
            className="min-h-11 px-1 text-sm text-text-secondary"
          >
            Type instead
          </button>
        </div>
      </div>
    </div>
  );
}
