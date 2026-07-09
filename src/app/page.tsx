"use client";

import { useState } from "react";
import SessionShell from "@/components/session/SessionShell";
import TermPrompt from "@/components/screens/TermPrompt";
import RecordingActive from "@/components/screens/RecordingActive";
import PlaybackReview from "@/components/screens/PlaybackReview";
import TypeInstead from "@/components/screens/TypeInstead";
import ProcessingAnswer from "@/components/screens/ProcessingAnswer";
import AnswerTranscript from "@/components/screens/AnswerTranscript";
import AnswerFeedback from "@/components/screens/AnswerFeedback";
import RetryPrompt from "@/components/screens/RetryPrompt";
import CorrectFeedback from "@/components/screens/CorrectFeedback";
import EndSummary from "@/components/screens/EndSummary";
import { TERMS, type TermAttempt } from "@/lib/session-data";

type Screen =
  | "termPrompt"
  | "recording"
  | "playbackReview"
  | "typeInstead"
  | "processing"
  | "transcript"
  | "feedbackHint"
  | "secondTranscript"
  | "secondFeedback"
  | "endSummary";

// The retry attempt's own (mocked) transcript — Figma node 68:8055 ("2nd
// transcript"). Hardcoded here for the same reason AnswerFeedback.tsx
// hardcodes its own FEEDBACK_TEXT/HINT_TEXT: term 0's real canned data
// (session-data.ts) models a correct-first-try outcome with only ONE
// attempt, so there's no second-attempt transcript in the mocked script to
// bind to yet — this literally reproduces the named Figma frame's copy
// instead. Reuses AnswerTranscript as-is (same bubble shape, same fade-in),
// just with different (attempt, spans) data and no onComplete — this bubble
// isn't followed by any further auto-advance yet.
const SECOND_ATTEMPT: Pick<TermAttempt, "transcript" | "highlightedSpans"> = {
  transcript:
    "I think the chromosomes get separated into two identical nuclei and the cells get the same set of genetic material.",
  highlightedSpans: [
    "chromosomes get separated into two identical nuclei",
    "cells get the same set of genetic material",
  ],
};

// Entry point for the prototype. S0 (Launcher/Exam Plan stub), the full
// state machine (S1–S13), and screen-to-screen wiring land in later passes
// (see SPEC.md §1). So far this wires S2 (idle) -> S5 (recording) -> S6
// (playback review) -> S7 (processing, Figma node 63:3787) -> S8, the
// feedback stack (SPEC.md §2.8): first the transcript echo (Figma node
// 67:3932), then the graded-feedback + hint bubbles (Figma node 68:3634,
// `screen === "feedbackHint"`) with the mic button back for a retry
// (RetryPrompt) — plus the "type instead" text fallback (Figma node
// 68:6484) reachable from both S2 and S6, seeded on term 1 ("Mitosis") per
// Figma nodes 62:8581, 62:8876, and 63:3538. S3/S4 (the mic-permission
// primer + fake OS dialog) aren't built yet — no frame for them has been
// provided, so mic-press jumps straight to recording. RetryPrompt's mic
// loops back to the same RecordingActive + PlaybackReview components (S5/S6)
// for a second attempt — matching Figma nodes 70:4304 ("2nd attempt
// recording") and 108:7503 ("2nd attempt post record") — except this time
// the earlier transcript+feedback+hint bubbles stay visible above them (see
// the `hasSeenFeedback` flag and `isRetryScreen` below). Per 108:7503 (and
// images/2nd attempt post record.png), the bottomCta itself is unchanged —
// same PlaybackReview component already used for the first attempt's
// post-record screen, not a new one. S8's full attempt-counter/hint-ladder
// progression and S9 ("advance to next term") aren't wired up yet.
//
// SessionShell (header + term bubble) is mounted once here and stays
// mounted across screen changes — only the bottom controls swap between
// TermPrompt, RecordingActive, PlaybackReview, TypeInstead, and RetryPrompt.
// S7 and S8 are the exception: their content sits directly under the term
// bubble in Figma's middleContent column, not in the bottom control area,
// so they're passed as SessionShell's `afterBubble` slot instead of
// `children` (see SessionShell.tsx). This keeps Knowie's bubble — and, once
// shown, the transcript bubble — from unmounting/remounting (and replaying
// its entrance animation) every time the student moves between states;
// AnswerTranscript stays mounted through the rest of S8 rather than being
// swapped out.
export default function Home() {
  const [termIndex] = useState(0);
  const [screen, setScreen] = useState<Screen>("termPrompt");
  // Set once the transcript+feedback+hint bubbles have appeared for this
  // term (i.e. we've reached "feedbackHint") and never reset. Figma nodes
  // 70:4304 ("2nd attempt recording") and 108:7503 ("2nd attempt post
  // record") show that when RetryPrompt's mic is pressed, that same bubble
  // log stays visible in the scrollable region ABOVE the recording/playback
  // panel — retrying doesn't clear Knowie's earlier feedback. Without this
  // flag, "recording" and "playbackReview" are each one shared screen for
  // both the very-first attempt (S5/S6, where no feedback bubbles exist
  // yet) and a retry, so afterBubble needs a way to tell those two cases
  // apart.
  const [hasSeenFeedback, setHasSeenFeedback] = useState(false);
  const term = TERMS[termIndex];
  // True for the four screens that get reused/added for a retry attempt once
  // feedback has already been shown — drives the persisted bubble stack
  // (afterBubble, below), the matching 16px top spacing before whichever of
  // RecordingActive/PlaybackReview is showing (children), and — per Figma
  // node 68:7731 ("Knowie listening 2nd time") and 68:8055 ("2nd
  // transcript") — keeping that same transcript+feedback+hint stack visible
  // above S7's processing row and the retry's own transcript bubble too.
  const isRetryScreen =
    (screen === "recording" ||
      screen === "playbackReview" ||
      screen === "processing" ||
      screen === "secondTranscript" ||
      screen === "secondFeedback") &&
    hasSeenFeedback;
  // Whether the transcript bubble (and everything that follows it) should be
  // in the tree at all for the current screen — reached the first time via
  // "transcript"/"feedbackHint", and via isRetryScreen for every screen that
  // reuses the bubble log afterwards, including a retry's "processing".
  const showBubbleStack =
    screen === "transcript" || screen === "feedbackHint" || isRetryScreen;
  // The retry's own transcript bubble (Figma node 68:8055) needs to stay
  // mounted through "secondFeedback" too — otherwise it would unmount the
  // instant the CORRECT bubble (Figma node 68:7899) appears, which isn't
  // what the named frame shows (both bubbles stack, transcript above
  // feedback).
  const showSecondTranscript =
    screen === "secondTranscript" || screen === "secondFeedback";

  // S10 (Figma node 110:7707, "end summary") replaces SessionShell entirely
  // rather than rendering inside it — unlike every other screen so far, it
  // has no exit/progress/XP header or term bubble (Figma's own frame has
  // just an empty topNavigation strip), so it doesn't share SessionShell's
  // chrome. Reached "for the sake of the prototype" from the retry's "Next
  // question" CTA above (see EndSummary.tsx's own header comment for why
  // its content is hardcoded rather than computed from real session state).
  if (screen === "endSummary") {
    return (
      <div className="app-shell bg-background-page">
        <EndSummary />
      </div>
    );
  }

  return (
    <div className="app-shell bg-background-page">
      <SessionShell
        term={term}
        sessionXp={2}
        onExitRequest={() => console.log("exit requested — S11 not built yet")}
        hideBubbleAvatar={screen === "processing"}
        afterBubble={
          showBubbleStack || screen === "processing" ? (
            <>
              {showBubbleStack && (
                <AnswerTranscript
                  attempt={term.attempts[0]}
                  onComplete={() => {
                    setScreen("feedbackHint");
                    setHasSeenFeedback(true);
                  }}
                />
              )}
              {(screen === "feedbackHint" || isRetryScreen) && <AnswerFeedback />}
              {screen === "processing" && (
                // Same ProcessingAnswer component, same 4s cap and pulsing-text
                // animation, as the first attempt's S7 (Figma node 63:3787) —
                // reused as-is per the user's instruction, just with the
                // isRetryScreen-driven bubble stack above it now that this can
                // also be reached from a retry's Submit (Figma node 68:7731).
                // On a retry (isRetryScreen), the 4s cap hands off to the
                // retry's own transcript bubble (Figma node 68:8055) instead
                // of the first-attempt-only "transcript" screen — and per the
                // user's instruction this handoff is automatic, not triggered
                // by any tap.
                <ProcessingAnswer
                  onComplete={() =>
                    setScreen(isRetryScreen ? "secondTranscript" : "transcript")
                  }
                />
              )}
              {showSecondTranscript && (
                // The retry's own transcript bubble (Figma node 68:8055, "2nd
                // transcript") — same AnswerTranscript component and fade-in
                // as the first attempt's, per the user's instruction to reuse
                // that animation, just seeded with SECOND_ATTEMPT's copy.
                // Now auto-advances to "secondFeedback" after its own 1s
                // timer, matching the first attempt's
                // transcript -> feedback/hint handoff (AnswerTranscript's
                // AUTO_ADVANCE_MS) — per the user's instruction that this new
                // CORRECT bubble (Figma node 68:7899) "follow the same
                // animation and timing pattern" as the earlier partial/hint
                // stack.
                <AnswerTranscript
                  attempt={SECOND_ATTEMPT}
                  onComplete={() => setScreen("secondFeedback")}
                />
              )}
              {screen === "secondFeedback" && (
                // The CORRECT feedback bubble (Figma node 68:7899) that
                // follows the retry's own transcript — same fade-in timing
                // (`soft`) as AnswerFeedback's bubbles, reached automatically
                // once AnswerTranscript's 1s auto-advance fires above.
                <CorrectFeedback />
              )}
            </>
          ) : null
        }
      >
        {screen === "termPrompt" && (
          <TermPrompt
            term={term}
            onMicPress={() => setScreen("recording")}
            onSkip={() => console.log("skip tapped — S9 not built yet")}
            onTypeInstead={() => setScreen("typeInstead")}
          />
        )}

        {screen === "recording" && (
          // pt-4 (16px) only on the retry path (isRetryScreen) — matches
          // RetryPrompt's own pt-4 above the "Tap to try again" label, so the
          // gap from the hint bubble to whatever comes next (that label, or
          // here, RecordingActive's top border stroke) stays the same 16px
          // either way. The very-first recording (S5, no feedback bubbles
          // yet) gets no wrapper padding, leaving that screen exactly as it
          // was — this only affects the reused "2nd attempt" case (Figma
          // node 70:4304).
          <div className={isRetryScreen ? "pt-4" : undefined}>
            <RecordingActive
              onCancel={() =>
                setScreen(hasSeenFeedback ? "feedbackHint" : "termPrompt")
              }
              onStop={() => setScreen("playbackReview")}
            />
          </div>
        )}

        {screen === "playbackReview" && (
          // Same pt-4-on-retry treatment as "recording" above, and for the
          // same reason: this is the exact same PlaybackReview bottomCta
          // used for the first attempt (Figma node 63:3538 / images/initial
          // submit.png) — reused as-is, not rebuilt — for the retry's
          // post-record screen (Figma node 108:7503), just with 16px of
          // space added above it once the bubble log is present.
          <div className={isRetryScreen ? "pt-4" : undefined}>
            <PlaybackReview
              onSubmit={() => setScreen("processing")}
              onRecordAgain={() => setScreen("recording")}
              onTypeInstead={() => setScreen("typeInstead")}
            />
          </div>
        )}

        {screen === "typeInstead" && (
          // Submitting a typed answer joins the same S7 processing screen
          // (Figma node 63:3787) as a recorded one (PlaybackReview's
          // onSubmit, above) — same ProcessingAnswer component, same 4s cap,
          // same hardcoded transcript afterwards, since session-data.ts's
          // mocked script doesn't distinguish how the answer arrived.
          <TypeInstead
            onSubmit={() => setScreen("processing")}
            onUseVoiceInstead={() => setScreen("termPrompt")}
          />
        )}

        {screen === "feedbackHint" && (
          <RetryPrompt
            onMicPress={() => setScreen("recording")}
            onSkip={() => console.log("skip tapped — S9 not built yet")}
            onTypeInstead={() => setScreen("typeInstead")}
          />
        )}

        {screen === "secondFeedback" && (
          // Once the retry lands on the CORRECT bubble (Figma node
          // 68:7899), the bottom control becomes a single primary CTA to
          // move on — S9 ("advance to next term") isn't wired up yet, so
          // this is a stub per the established console.log convention.
          // Classes match PlaybackReview's own "Submit" button exactly, per
          // the user's instruction to reuse that pattern rather than invent
          // a new button style. Outer padding matches RetryPrompt's own
          // wrapper (px-7 pb-7 pt-4) rather than PlaybackReview's bordered
          // panel, since there's no recording-panel content here — just the
          // single primary CTA, sitting at the same rhythm as every other
          // bottomCta.
          <div className="flex w-full shrink-0 flex-col items-center px-7 pb-7 pt-4">
            <button
              type="button"
              onClick={() => setScreen("endSummary")}
              className="flex h-14 w-full items-center justify-center rounded-full bg-interactive-primary text-xl font-bold text-interactive-onprimary shadow-[inset_0_-4px_0_rgba(0,0,0,0.15)]"
            >
              Next question
            </button>
          </div>
        )}
      </SessionShell>
    </div>
  );
}
