"use client";

import { useEffect, useRef, useState } from "react";
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
// button (tap to switch back to voice) beside a pill field with a bare
// send-arrow icon embedded in it — no "+" affordance, no keyboard mockup
// image, since the field is a real, functioning input.
//
// A second reference screenshot showed what happens once the student
// starts typing: the field grows into a multi-line chat bubble (so a
// <textarea> replaces the single-line <input>, auto-resizing to fit its
// content instead of scrolling), its corners settle from a full pill into
// a fixed radius, and the send icon gets a filled blue circle behind it
// (bare/inactive-looking while empty, "active" once there's real text) —
// both driven off the same `hasText` check.
interface TypeInsteadProps {
  onSubmit?: (answer: string) => void;
  onUseVoiceInstead?: () => void;
}

export default function TypeInstead({
  onSubmit,
  onUseVoiceInstead,
}: TypeInsteadProps) {
  const [answer, setAnswer] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasText = answer.trim().length > 0;

  // Auto-grow the textarea to fit its content — reset to "auto" first so
  // shrinking (e.g. deleting text) recomputes scrollHeight correctly too,
  // not just growth.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [answer]);

  const handleSubmit = () => {
    const trimmed = answer.trim();
    if (!trimmed) return;
    onSubmit?.(trimmed);
  };

  return (
    <div className="flex items-end gap-2 px-4 pb-4">
      <button
        type="button"
        aria-label="Use voice instead"
        onClick={onUseVoiceInstead}
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border-default bg-background-input"
      >
        <MicIcon className="h-6 w-6 text-text-primary" />
      </button>

      <div
        className={`flex min-h-14 flex-1 items-end gap-2 border border-border-default bg-background-input py-1.5 pl-4 pr-1.5 ${
          hasText ? "rounded-3xl" : "rounded-full"
        }`}
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSubmit();
            }
          }}
          // Reference screenshot's placeholder copy, kept verbatim.
          placeholder="Ask anything..."
          autoFocus
          className="my-auto min-w-0 flex-1 resize-none bg-transparent py-1 text-base font-medium leading-snug text-text-primary placeholder:text-text-disabled focus:outline-none"
        />

        <button
          type="button"
          aria-label="Submit answer"
          onClick={handleSubmit}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
            hasText ? "bg-accent-blue-bold" : ""
          }`}
        >
          {/* Nudged 8px right of the button's visual center per feedback —
              sits closer to the pill's trailing edge than dead-center. */}
          <ArrowUpIcon className="h-5 w-5 translate-x-2 text-text-primary" />
        </button>
      </div>
    </div>
  );
}
