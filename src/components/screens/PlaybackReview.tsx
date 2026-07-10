"use client";

// feedback.md's "[M] Transcript before submit" fix: testers skipped the fake
// audio playback entirely and wanted to see what was actually heard before
// committing to Submit. This screen used to show a mock waveform + play/
// pause button (SPEC.md §2.6's "static waveform snapshot") with no way to
// check the words themselves; it now shows the same read-only STT transcript
// text that later appears in the chat-bubble log (AnswerTranscript.tsx),
// reusing that component's own "YOUR ANSWER" label and
// background-transcript surface so the two reads feel like the same piece
// of UI rather than an invented new style. No highlighted spans here,
// though — those mark words the (mocked) grading step recognized, and
// grading hasn't happened yet at this point in the flow.
interface PlaybackReviewProps {
  transcript: string;
  onSubmit?: () => void;
  onRecordAgain?: () => void;
  onTypeInstead?: () => void;
}

export default function PlaybackReview({
  transcript,
  onSubmit,
  onRecordAgain,
  onTypeInstead,
}: PlaybackReviewProps) {
  return (
    // Figma node 63:3538's bottom panel (data-node-id 63:3579) carries the
    // same full 1px border, no rounded corners, as S5's panel.
    <div className="flex w-full flex-col items-center gap-4 border border-border-default p-7">
      <div className="w-full rounded-2xl bg-background-transcript p-4">
        <p className="text-xs font-semibold tracking-wide text-accent-brand-bold">
          YOUR ANSWER
        </p>
        <p className="mt-1 text-base italic text-text-primary">
          &ldquo;{transcript}&rdquo;
        </p>
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
