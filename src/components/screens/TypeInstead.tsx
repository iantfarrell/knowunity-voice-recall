"use client";

import { useState } from "react";
import { ArrowUpIcon, MicIcon } from "@/components/icons";

// The text-fallback screen, reached via "Type instead" from both the
// term-prompt (S2) and playback-review (S6) screens — the second of the
// "three points" sprint-context.md requires it at. Rendered as the
// `children` of SessionShell, same pattern as every other screen: it owns
// only the bottom input row, not the shared header/term bubble.
//
// Originally matched Figma's "Chat Input" component (node 68:6484), with a
// leading "+" button, trailing in-pill mic icon, and a static
// images/Keyboard.png mockup below. Replaced with a simpler chat-style bar
// per a user-supplied reference screenshot: a standalone circular mic
// button (tap to switch back to voice) beside a pill text field with a
// bare send-arrow icon (no button background) embedded in it — no "+"
// affordance, no keyboard mockup image, since the field is a real,
// functioning <input>.
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
    <div className="flex items-center gap-2 px-4 pb-4">
      <button
        type="button"
        aria-label="Use voice instead"
        onClick={onUseVoiceInstead}
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border-default bg-background-input"
      >
        <MicIcon className="h-6 w-6 text-text-primary" />
      </button>

      <div className="flex h-14 flex-1 items-center justify-between gap-2 rounded-full border border-border-default bg-background-input py-1.5 pl-4 pr-1.5">
        <input
          type="text"
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleSubmit();
          }}
          // Reference screenshot's placeholder copy, kept verbatim.
          placeholder="Ask anything..."
          autoFocus
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-text-primary placeholder:text-text-disabled focus:outline-none"
        />

        <button
          type="button"
          aria-label="Submit answer"
          onClick={handleSubmit}
          className="flex h-11 w-11 shrink-0 items-center justify-center"
        >
          {/* Nudged 8px right of the button's visual center per feedback —
              sits closer to the pill's trailing edge than dead-center. */}
          <ArrowUpIcon className="h-5 w-5 translate-x-2 text-text-primary" />
        </button>
      </div>
    </div>
  );
}
