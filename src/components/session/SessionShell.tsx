"use client";

import { useEffect, useRef, type ReactNode } from "react";
import SessionHeader from "@/components/session/SessionHeader";
import TermBubble from "@/components/session/TermBubble";
import type { Term } from "@/lib/session-data";

interface SessionShellProps {
  term: Term;
  sessionXp: number;
  onExitRequest?: () => void;
  /** Optional content directly below the term bubble, still above the
   * flex-1 spacer — e.g. S7's "Knowie is listening to your answer" row
   * (Figma node 63:3787), which sits in the same middleContent column as
   * the bubble rather than in the bottom control area every other screen
   * uses. Omitted by screens that don't need it. */
  afterBubble?: ReactNode;
  /** Hides the term bubble's own avatar — see TermBubble's `showAvatar`. */
  hideBubbleAvatar?: boolean;
  children: ReactNode;
}

// The persistent chat surface shared by every voice-recall state (S2, S5, ...).
// Header + Knowie's term bubble are mounted HERE, once, at the page level —
// not inside each screen — so they never unmount/remount as the student
// moves between states (e.g. idle -> recording). Only `children` (the
// state-specific bottom controls) swaps. This matters: TermBubble plays a
// slide-up entrance animation on mount, and remounting it on every screen
// change replayed that animation each time, which looked like the term text
// randomly shifting down. Keeping this shell mounted fixes that at the root.
//
// The term bubble + afterBubble stack (S8's growing chat-bubble log — term,
// transcript, feedback, hint) lives in its own `flex-1 overflow-y-auto`
// region rather than flowing directly under the header. Once enough bubbles
// stack up (e.g. term + transcript + feedback + hint), that content plus
// `children`'s bottom CTA no longer fits in the viewport — and .app-shell
// clips overflow, so the bottom CTA (the mic button to try again) was
// getting cut off entirely instead of staying reachable. Scoping the scroll
// to this region keeps the header pinned at top and `children` pinned at
// bottom, always visible, with the bubble stack scrolling internally instead.
//
// Whenever a new bubble is appended, the region auto-scrolls to the bottom
// (chat-log convention) so the newest bubble is what's revealed just above
// the CTA — without this, the scroll position stays wherever it was (the
// top, on first mount), leaving new bubbles hidden below the fold even
// though the region is technically scrollable. A ResizeObserver watches
// both the inner content wrapper AND the `children` (bottom CTA) wrapper —
// not just the former — so this catches every height change generically:
// each bubble's own fade/slide-in animation as it grows the bubble stack,
// but also `children` itself swapping to a taller/shorter control (e.g.
// RetryPrompt -> RecordingActive on a retry attempt), which shrinks the
// available scroll height from the other side without the bubble stack's
// own height changing at all. Missing that second case left a real bug: the
// hint bubble would get cut off the moment a retry's RecordingActive panel
// (taller than RetryPrompt) took over `children`, since scrollTop stayed
// put while scrollHeight shrank out from under it.
export default function SessionShell({
  term,
  sessionXp,
  onExitRequest,
  afterBubble,
  hideBubbleAvatar,
  children,
}: SessionShellProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    const contentEl = contentRef.current;
    const bottomEl = bottomRef.current;
    if (!scrollEl || !contentEl || !bottomEl) return;

    const scrollToBottom = () => {
      scrollEl.scrollTop = scrollEl.scrollHeight;
    };

    scrollToBottom();
    const observer = new ResizeObserver(scrollToBottom);
    observer.observe(contentEl);
    observer.observe(bottomEl);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex h-full flex-col">
      <SessionHeader
        termIndex={term.index}
        sessionXp={sessionXp}
        onExitRequest={onExitRequest}
      />

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div ref={contentRef}>
          <TermBubble term={term} showAvatar={!hideBubbleAvatar} />
          {afterBubble}
        </div>
      </div>

      <div ref={bottomRef} className="shrink-0">
        {children}
      </div>
    </div>
  );
}
