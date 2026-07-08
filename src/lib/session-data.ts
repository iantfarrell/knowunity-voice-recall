// The mocked recall script — SPEC.md §3 "The mocked script (canned content)".
// Subject: Cell Division (GCSE Biology), 5 fixed terms, deterministic every run
// (prototype-rules.md: "keep it deterministic"). No real STT/LLM call is ever
// made — see SPEC.md §7 "Mocked vs. real."

export type FeedbackStatus = "correct" | "partial" | "revealed";

export interface TermAttempt {
  transcript: string;
  highlightedSpans?: string[];
  feedbackStatus: FeedbackStatus;
  feedbackText: string;
  hint?: { level: 1 | 2; text: string };
}

export type TermOutcome =
  | "correct-first-try"
  | "hint-assisted"
  | "revealed"
  | "skipped";

export interface Term {
  id: string;
  /** 0-based position in the session. */
  index: number;
  /** "FIRST TERM" / "SECOND TERM" etc. — the S2 eyebrow label. */
  eyebrow: string;
  name: string;
  instruction: string;
  xpValue: number;
  outcome: TermOutcome;
  attempts: TermAttempt[];
  /** Set only when outcome is "revealed". */
  revealedAnswer?: string;
  /** Set only when outcome is "skipped". */
  skippedNote?: string;
}

const EYEBROWS = ["FIRST TERM", "SECOND TERM", "THIRD TERM", "FOURTH TERM", "FIFTH TERM"];

export const SESSION_SUBJECT = "Cell Division";

export const TERMS: Term[] = [
  {
    id: "mitosis",
    index: 0,
    eyebrow: EYEBROWS[0],
    name: "Mitosis",
    instruction: "Explain this in your own words.",
    xpValue: 30,
    outcome: "correct-first-try",
    attempts: [
      {
        transcript:
          "Mitosis is when a cell divides to make two identical copies of itself, so the body can grow or repair damage.",
        highlightedSpans: ["divides", "two identical copies", "grow or repair"],
        feedbackStatus: "correct",
        feedbackText:
          "Yes! One cell splits into two identical daughter cells — that's mitosis in a nutshell. Nice and clear.",
      },
    ],
  },
  {
    id: "cell-membrane",
    index: 1,
    eyebrow: EYEBROWS[1],
    name: "Cell membrane",
    instruction: "Explain this in your own words.",
    xpValue: 15,
    outcome: "hint-assisted",
    attempts: [
      {
        transcript: "It's the outside part of the cell that holds everything in.",
        highlightedSpans: ["outside part", "holds everything in"],
        feedbackStatus: "partial",
        feedbackText:
          "Right that it's the outer boundary — but it does more than just 'hold things in.'",
        hint: {
          level: 1,
          text: "Think about what actually gets to cross it. The membrane doesn't just contain the cell — it decides what comes and goes.",
        },
      },
      {
        transcript: "Oh — it controls what substances can move in and out of the cell.",
        feedbackStatus: "correct",
        feedbackText:
          "That's it — the cell membrane controls what enters and leaves the cell. Got there with one hint.",
      },
    ],
  },
  {
    id: "meiosis",
    index: 2,
    eyebrow: EYEBROWS[2],
    name: "Meiosis",
    instruction: "Explain this in your own words.",
    xpValue: 0,
    outcome: "revealed",
    attempts: [
      {
        transcript: "Isn't that just cells splitting like mitosis?",
        feedbackStatus: "partial",
        feedbackText: "It is cell division — but the result is different.",
        hint: { level: 1, text: "How many cells come out, and are they identical?" },
      },
      {
        transcript: "It makes four cells instead of two?",
        feedbackStatus: "partial",
        feedbackText: "Good, four cells — you're getting closer.",
        hint: {
          level: 2,
          text: "Why does the body need to make cells like this at all? Think reproduction.",
        },
      },
      {
        transcript: "Something to do with reproduction but I can't remember exactly.",
        feedbackStatus: "revealed",
        feedbackText:
          "Meiosis is cell division that produces four genetically different sex cells (gametes), each with half the normal number of chromosomes — it's how variation gets introduced when organisms reproduce.",
      },
    ],
    revealedAnswer:
      "Meiosis is cell division that produces four genetically different sex cells (gametes), each with half the normal number of chromosomes — it's how variation gets introduced when organisms reproduce.",
  },
  {
    id: "chromosomes",
    index: 3,
    eyebrow: EYEBROWS[3],
    name: "Chromosomes",
    instruction: "Explain this in your own words.",
    xpValue: 30,
    outcome: "correct-first-try",
    attempts: [
      {
        transcript:
          "Chromosomes are the thread-like structures made of DNA that carry our genes.",
        highlightedSpans: ["thread-like structures", "made of DNA", "carry our genes"],
        feedbackStatus: "correct",
        feedbackText:
          "Exactly — tightly coiled DNA carrying your genetic information. Textbook answer.",
      },
    ],
  },
  {
    id: "dna-replication",
    index: 4,
    eyebrow: EYEBROWS[4],
    name: "DNA Replication",
    instruction: "Explain this in your own words.",
    xpValue: 0,
    outcome: "skipped",
    attempts: [],
    skippedNote: "Skipped — you can revisit this in your next session.",
  },
];

export const TOTAL_TERMS = TERMS.length;
export const SESSION_TOTAL_XP = TERMS.reduce((sum, t) => sum + t.xpValue, 0);
