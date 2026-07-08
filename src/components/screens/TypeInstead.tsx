"use client";

import { useState } from "react";
import { MicIcon, PlusIcon } from "@/components/icons";

// The text-fallback screen (Figma node 68:6484), reached via "Type instead"
// from both the term-prompt (S2) and playback-review (S6) screens — the
// second of the "three points" sprint-context.md requires it at. Rendered
// as the `children` of SessionShell, same pattern as every other screen: it
// owns only the bottom input row, not the shared header/term bubble.
//
// Mirrors Figma's "Chat Input" component (node 68:7712): leading "+"
// button, pill-shaped text field, trailing mic icon, still backed by a
// real, functioning <input> (typing/submit both work). Below it, the
// keyboard is rendered as a static image — Figma's actual "Keyboard" mockup
// asset (node 68:7461), supplied directly as images/Keyboard.png — always
// shown while this screen is active, matching the reference frame exactly
// rather than depending on a real device's on-screen keyboard (which
// wouldn't reliably appear in every context this prototype is viewed in).
// The frame's "Skip this term / Type instead" row (node 68:6533) isn't
// reproduced — get_screenshot of the full frame shows it doesn't actually
// render here, a stale reused-component artifact, same class of issue as
// the submit screen's mislabeled "Record again" layer.
interface TypeInsteadProps {
  onSubmit?: (answer: string) => void;
  onUseVoiceInstead?: () => void;
}

export default function TypeInstead({
  onSubmit,
  onUseVoiceInstead,
}: TypeInsteadProps) {
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    const trimmed = answer.trim();
    if (!trimmed) return;
    onSubmit?.(trimmed);
  };

  return (
    <div className="flex w-full flex-col">
      <div className="flex items-start gap-1 px-2 pb-4">
        {/* Figma's leading "+" button (node 68:7714) — a generic chat-
            attachment affordance carried over from the shared Chat Input
            component. It has no defined action in this prototype's mocked
            flow (CLAUDE.md: never build every edge state), so it's
            rendered for layout fidelity only and left inert. */}
        <button
          type="button"
          aria-hidden="true"
          tabIndex={-1}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border-default bg-background-input"
        >
          <PlusIcon className="h-6 w-6 text-text-primary" />
        </button>

        <div className="flex h-14 flex-1 items-center justify-between gap-2 rounded-full border border-border-default bg-background-input px-4">
          <input
            type="text"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleSubmit();
            }}
            // Figma's placeholder text is the shared component's generic
            // "Ask anything..." (a chat-AI affordance) — swapped for copy
            // that matches what this field is actually for here, same kind
            // of content judgment call as other reused-component text
            // found on this frame.
            placeholder="Type your answer..."
            autoFocus
            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-text-primary placeholder:text-text-disabled focus:outline-none"
          />

          <button
            type="button"
            aria-label="Use voice instead"
            onClick={onUseVoiceInstead}
            className="flex h-6 w-6 shrink-0 items-center justify-center"
          >
            <MicIcon className="h-6 w-6 text-text-secondary" />
          </button>
        </div>
      </div>

      {/* Figma's actual "Keyboard" mockup asset (node 68:7461), supplied
          directly as images/Keyboard.png rather than hand-built, same
          real-asset pattern as PlaybackReview's player/waveform images. */}
      <img src="/images/Keyboard.png" alt="" className="w-full" />
    </div>
  );
}
