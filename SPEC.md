# SPEC.md — Voice Recall Prototype: Build Spec

This is the authoritative build plan for the voice-recall flow. It does not repeat
what's already settled elsewhere — read those first:
- `sprint-context.md` — the product flow, committed UX decisions, constraints/non-goals.
- `design.md` — every color/type/spacing/radius token, plus real screen composition
  notes from Figma (`Example Screens` and `Full flow - Mod 4`).
- `prototype-rules.md` — how to make it feel like a native app (safe areas, touch
  targets, accessibility baseline).
- `motion-guide.md` — the four transition presets and per-moment animation recipes.

This doc exists to resolve everything those files leave open: which exact screens
get built, what's mocked vs. real, the literal canned script, and how screens
connect. Follow it directly — no further design decisions should be needed to start
building.

**One explicit deviation from CLAUDE.md/prototype-rules.md, approved in the spec
interview:** those docs say "hardcode 2–3 example terms." This build uses the
**5-term set from your own Figma flow** instead (Cell Division: Mitosis, Cell
membrane, Meiosis, Chromosomes, DNA Replication), because it's the only set that
demonstrates every result state (correct-first-try, hint-assisted, revealed,
skipped) in one run-through, and it matches screens you've already designed. Do not
"fix" this back down to 2–3 terms.

---

## 1. Screen inventory & state machine

One full-screen session, one component tree, internal state — not separate routes
(see §9). The states below are the complete set to build.

```
S0  Launcher (stub)
     │ tap "Voice recall" row
     ▼
S1  Soft-gate primer sheet          [first run only]
     │ tap primary CTA / skip
     ▼
S2  Term prompt (idle)              ← loop target for each term
     │ tap mic (first ever tap only) ──► S3 Mic-permission sheet ──► S4 Fake OS dialog ──┐
     │ tap mic (already granted) ─────────────────────────────────────────────────────┤
     ▼                                                                                  │
S5  Recording active  ◄─────────────────────────────────────────────────────────────────┘
     │ stop (normal)              │ stop (<1.2s = empty)         │ tap Cancel
     ▼                            ▼                               ▼
S6  Playback review          S2 Term prompt (idle, inline "didn't  (discard, back to S2)
     │ Submit    │ Record again    catch that" note, no attempt used)
     ▼           └──────────────► S5
S7  Processing ("Knowie is listening")
     │ normal path                        │ debug trigger (long-press mascot)
     ▼                                     ▼
S8  Feedback stack (appends to this term's bubble log — see §2.7)   S8e Network-error bubble
     │                                                                   │ Try again → S5
     │                                                                   │ Type instead → S2's
     ├─ CORRECT → "Next question" CTA ──────────────► S9                    text fallback
     ├─ PARTIALLY RIGHT + HINT → recording panel reappears ──► S5 (next attempt)
     └─ 3rd attempt still wrong → REVEALED bubble → "Next question" CTA ──► S9
     also reachable from S2: "Skip this term" link ──────────────────────► S9 (skipped, +0 XP)
     ▼
S9  Advance to next term ──► S2 (progress header increments) ── repeats until 5 terms done
     ▼
S10 Session summary
     ├─ "Redo these N in voice recall" ──► S12 Retry-missed mini-session (loops S2→S9 over
     │                                       only the missed/skipped terms)
     ├─ "Add to spaced review" ──► S13 toast/snackbar ──► S0 Launcher
     └─ "Continue to next plan step" ──► S0 Launcher

Back button, available from S2/S5/S6/S7/S8:
     ▼
S11 Exit-confirmation dialog
     ├─ Confirm ──► S0 Launcher (session state discarded, XP resets to 0 — never deposited)
     └─ Cancel ──► return to whichever screen triggered it
```

Text-fallback ("Type instead") entry points are folded into S2, S6, and the retry
point inside S8 — see §4, not modelled as separate top-level states.

---

## 2. Screen-by-screen spec

### 2.1 S0 — Launcher (stub)
Purpose: minimal stand-in for the Exam Plan, just enough to launch the flow.
Composition: one list row styled per design.md §"List / row layout" (24px radius,
16px padding, icon slot + title), reading something like "Voice recall · Cell
Division." Tapping it opens S1 (or S2 directly if the soft-gate primer has already
been dismissed once — see §6). Nothing else on this screen; do not build any other
Exam Plan content.

### 2.2 S1 — Soft-gate primer (first run only)
Bottom sheet, per design.md §"Bottom sheet" component exactly: drag handle, header
row (title/subtitle), centered mascot (`/images/mascotSlot.png`) + headline/
subtitle, stacked full-width buttons at the bottom (primary "Let's go", secondary/
text "Skip"). Skippable in one tap. Never shown again after first dismissal
(persisted, §6).

### 2.3 S2 — Term prompt (idle)
Repeats once per term. Confirmed against the real Figma frame (node `62:8581`):
- Top row: leading **close (X) icon**, top-left — triggers S11 exit-confirmation.
  Not previously listed; add it. Then the thin progress bar (fill =
  `accent/brand/bold`, track = `border/default`) filling the rest of the row, then
  the running XP counter (lightning icon + number, e.g. "⚡2") top-right — the
  **live in-session tally**, not the deposited total (deposits only happen at S10).
- Below that: the term info is **a Knowie chat bubble**, not bare centered text —
  a rounded card (`background/surface` fill, `radius-600`-scale corners) containing
  the eyebrow label ("FIRST TERM" / "SECOND TERM" etc., Headline XXS Bold, violet),
  the term name (Headline XL, e.g. "Mitosis"), and the instruction line ("Explain
  this in your own words.", Headline XS Regular) stacked left-aligned inside it.
  Knowie's small circular avatar (`/images/Group 2136139939.png`) sits at the
  bottom-left corner of the bubble, slightly overlapping its edge — same avatar
  asset flagged as available-but-unused in §10, now confirmed required here.
- Large gap of empty space below the bubble, then a large circular mic button,
  roughly in the lower third of the screen (not screen-bottom-anchored).
- Two text links below the mic: **"Skip this term"** (`text/secondary`) and
  **"Type instead"** (`accent/brand/bold`-colored link).
- **First term, first visit only:** a small contextual hint near the mic, shown
  once, then never again (persisted, §6).

Can't-speak fallback: "Type instead" opens an inline text input (reuse the `Chat
Input` component from design.md — same pill shape, `background/input` fill, mic
icon swapped for a send/submit affordance) in place of the mic. Submitting routes
into the same judging logic as a voice attempt (§4).

### 2.4 S3/S4 — Mic permission (first tap only)
S3: bottom sheet identical in structure to S1 (drag handle, mascot —
`/images/mascotSlot.png` — headline/subtitle, stacked buttons — "Allow microphone
access" / "Not now").
S4: a **fully fake** dialog styled to match the native iOS "Allow microphone
access?" system prompt (title, message, "Don't Allow" / "Allow" buttons). No real
`getUserMedia()` call is ever made — both buttons just advance the mocked flow to
S5. Shown once; persisted (§6).

### 2.5 S5 — Recording active
Tap-to-start / tap-to-stop (not press-and-hold — chosen for easier click-through
demoing). On tap: large mic button switches to an unmistakable active state (per
motion-guide.md's recording recipe — looping scale pulse 1↔1.08, `repeat: Infinity`),
a live timer counts up, and a mocked waveform animates. Cancel is available
throughout (returns to S2, discards the in-progress attempt). If not manually
stopped, auto-stop fires at **~8s** (compressed from the spec's 90s safety cap —
fine for a demo since the point is to show the affordance exists, not to make
testers wait 90 real seconds). Stopping under **1.2s** counts as an empty/near-
silent recording (§5).

### 2.6 S6 — Playback review
Student reviews before committing. Composition: static waveform snapshot of the
"recording," a play/scrub control, "Submit" (primary) and "Record again"
(secondary) buttons. Tapping play runs a **fake playback animation** — a scrubbing
progress indicator across the waveform for the recorded duration, no real audio.
"Type instead" is also reachable here (discards the audio, opens the same text
input as S2's fallback).

### 2.7 S7 — Processing
"Knowie is listening" state per motion-guide.md's processing recipe (three dots or
gentle shimmer, ~1–1.5s simulated delay — never presented as a real network call).
**Debug affordance:** long-press (~1s) on the mascot during this state routes to
S8e (network-error bubble) instead of the normal scripted result — see §5. This is
a hidden trigger for demoing the error state on demand; it is not part of the main
click-through path and needs no visible UI of its own.

### 2.8 S8 — Feedback stack (chat-bubble log)
This is the core mechanic. Each term has its own append-only vertical stack of
bubbles — new content is added below the last, nothing is replaced or swapped out
(confirmed structural finding from your Figma flow). Bubble types:

| Bubble | Appears when | Composition |
|---|---|---|
| Transcript-echo | After every attempt | Student's canned "transcript" text, Body S Regular, with recognized-correct keyword spans highlighted in green. |
| Graded badge | After every attempt | Small pill, Headline XXS Bold: **"PARTIALLY RIGHT"** (`highlight/border` violet) or **"CORRECT"** (`feedback/success/bold` green), followed by Knowie's synthesis feedback text calling out what was right. |
| Hint badge | Only on a partial answer, attempts 1–2 | **"HINT 1"** / **"HINT 2"** pill (`pro/bold` amber/gold — closest existing token; do not invent a new hex), followed by the hint text. Recording panel (S5) re-appears directly below for the next attempt. |
| Reveal badge (new) | 3rd attempt still not correct | **"ANSWER REVEALED"** pill in a deliberately **neutral/desaturated** treatment — `background/surface` fill, `border/default` outline, `text/secondary` label (no saturated color, unlike the other badges) — followed by the correct-answer explanation. Ends with the same "Next question" CTA as Correct. |
| Network-error badge (S8e) | Debug-triggered from S7 only | **"COULDN'T REACH KNOWIE"** pill (`feedback/error/bold`), short apology text, and two inline actions: "Try again" (→ S5, same attempt) and "Type instead" (→ text fallback, same attempt). No attempt consumed, no XP change. |

Correct always ends the term with a **"Next question"** primary pill CTA (→ S9).
Skip is available as a text link at S2 and again after any hint bubble in S8 — it
ends the term immediately as "Skipped," 0 XP, no further attempts.

### 2.9 S9 — Advance to next term
No dedicated screen — just increments the progress header and eyebrow label (S2)
and resets the attempt counter for the new term. After the 5th term, routes to S10.

### 2.10 S10 — Session summary
Composition per design.md's summary notes: mascot hero (`/images/mascot big
eyes.png` — the more alert/celebratory pose, reserved for this one payoff moment),
a large "+N XP" deposit
line (this is the one moment XP actually deposits — sprint-context.md's "XP never
deposits mid-session" rule), a headline + ratio subtitle framed as a next step
("3 of 5 terms nailed — 2 left to strengthen"), a filter chip row (Correct /
Partially / Revealed / Skipped) over the per-term result list (status icon + name +
sublabel + XP delta), a "terms to strengthen" chip row naming the specific missed
terms, and the three exit actions from §1.

### 2.11 S11 — Exit confirmation
Simple dialog, not a silent exit (sprint-context.md requirement): "Leave this
session? Your progress won't be saved." Confirm / Cancel. Confirming discards all
session state (bubble log, attempt counts, in-session XP tally) and returns to S0.

### 2.12 S12 — Retry-missed mini-session
Re-enters the S2→S9 loop, but scoped only to the terms marked Revealed or Skipped
in the just-finished session (Meiosis + DNA Replication, in the default script).
Ends at a fresh S10 summary for just those terms.

### 2.13 S13 — "Added to spaced review" confirmation
A snackbar/toast (reuse the snackbar component referenced in design.md), auto-
dismissing, then returns to S0. No backend call — purely a UI confirmation.

---

## 3. The mocked script (canned content)

Subject: **Cell Division** (GCSE Biology), 5 terms, in this fixed order. This is
the literal, deterministic content to hardcode — same result every run, per
prototype-rules.md's "keep it deterministic" rule.

### Term 1 — Mitosis · Correct, first try · **+30 XP**
- Transcript: *"Mitosis is when a cell divides to make two identical copies of
  itself, so the body can grow or repair damage."*
- Highlighted spans: "divides," "two identical copies," "grow or repair."
- Feedback: **CORRECT** — *"Yes! One cell splits into two identical daughter
  cells — that's mitosis in a nutshell. Nice and clear."*

### Term 2 — Cell membrane · Partial → Hint 1 → Correct · **+15 XP**
- Attempt 1: *"It's the outside part of the cell that holds everything in."*
  - Highlighted spans: "outside part," "holds everything in."
  - Feedback: **PARTIALLY RIGHT** — *"Right that it's the outer boundary — but it
    does more than just 'hold things in.'"*
  - **HINT 1**: *"Think about what actually gets to cross it. The membrane
    doesn't just contain the cell — it decides what comes and goes."*
- Attempt 2: *"Oh — it controls what substances can move in and out of the
  cell."*
  - Feedback: **CORRECT** — *"That's it — the cell membrane controls what enters
    and leaves the cell. Got there with one hint."*

### Term 3 — Meiosis · Wrong ×3 → Revealed · **+0 XP**
- Attempt 1: *"Isn't that just cells splitting like mitosis?"*
  - Feedback: **PARTIALLY RIGHT** — *"It is cell division — but the result is
    different."*
  - **HINT 1**: *"How many cells come out, and are they identical?"*
- Attempt 2: *"It makes four cells instead of two?"*
  - Feedback: **PARTIALLY RIGHT** — *"Good, four cells — you're getting closer."*
  - **HINT 2**: *"Why does the body need to make cells like this at all? Think
    reproduction."*
- Attempt 3: *"Something to do with reproduction but I can't remember exactly."*
  - Still insufficient → attempts exhausted.
  - **ANSWER REVEALED**: *"Meiosis is cell division that produces four
    genetically different sex cells (gametes), each with half the normal number
    of chromosomes — it's how variation gets introduced when organisms
    reproduce."*

### Term 4 — Chromosomes · Correct, first try · **+30 XP**
- Transcript: *"Chromosomes are the thread-like structures made of DNA that
  carry our genes."*
- Highlighted spans: "thread-like structures," "made of DNA," "carry our genes."
- Feedback: **CORRECT** — *"Exactly — tightly coiled DNA carrying your genetic
  information. Textbook answer."*

### Term 5 — DNA Replication · Skipped · **+0 XP**
- Student taps "Skip this term" instead of recording. Inline system note: *"Skipped
  — you can revisit this in your next session."* No transcript, no judging call.

**Session summary totals:** +75 XP session tally shown live, but the deposit
number and per-term breakdown at S10 should read **3 of 5 terms nailed, 2 left to
strengthen** (Mitosis, Cell membrane, Chromosomes = nailed/hint-assisted counted as
progress; Meiosis + DNA Replication = the two to strengthen), matching the exact
row-level detail from your Figma summary screen (Mitosis +30, Cell membrane +15,
Meiosis 0, Chromosomes +30, DNA Replication 0 → **+75 XP total**, not +100 — use the
real per-term sum, not the placeholder "+100 XP" you showed me as a Figma example).

---

## 4. Text fallback ("Type instead") — behavior

Available at exactly three points, per sprint-context.md: **term prompt (S2)**,
**audio review (S6)**, and **the retry point inside the feedback stack (S8, after
any hint)**. All three converge on the same input surface (the `Chat Input`
component from design.md) and the same judging logic below — there is no separate
"typed" branch of the flow.

**Grading logic (mocked, no real judge):** check the typed text for the current
term's canned key phrase(s) (e.g. "divide," "identical," "grow or repair" for
Mitosis). If a match is found, treat it as the scripted **Correct** (or the
appropriate partial/hint step) exactly as the voice path would at that attempt
number. If empty or no match, fall into the same partial/hint ladder as a vague
spoken answer would. This is simple substring/keyword matching — not real NLP —
but it means typing the "right" words actually produces the right result, which
sells the fallback as functional rather than a dead end (prototype-rules.md:
"never leave the fallback as a dead end").

---

## 5. Edge states (built, manually triggerable)

Both are real states in the machine, demoable on demand, since there's no real STT/
network to organically trigger them:

- **Empty recording.** Manually stopping a recording (S5) in under ~1.2s is treated
  as near-silent. Skip S6/S7/S8 entirely — bounce straight back to S2 with an inline
  prompt ("Didn't catch that — try again when you're ready"). No attempt consumed,
  no LLM/processing call simulated.
- **Network/LLM error.** Triggered only by long-pressing the mascot during S7
  (Processing) — see §2.7. Produces the S8e error bubble (§2.8). No attempt
  consumed, no XP change. "Try again" re-opens S5 for the same attempt; "Type
  instead" opens the text fallback for the same attempt.

---

## 6. First-run vs. returning (persistence)

Two boolean flags, persisted in `localStorage` so the "never shown again" behavior
survives page reloads:
- `hasSeenSoftGatePrimer` — gates S1. Set on first dismissal (skip or CTA).
- `hasGrantedMicPermission` — gates S3/S4. Set after the first Allow/Don't Allow tap
  at S4 (either answer counts as "asked," so it's not asked again).
- First-term contextual hint bubble (§2.3) uses its own flag,
  `hasSeenMicHint`, same persistence pattern.

A returning visit (either flag true) skips straight to S2 from S0, per
prototype-rules.md's "first run vs. returning" rule.

---

## 7. Mocked vs. real — explicit

| Element | Status |
|---|---|
| Speech-to-text / transcript | **Mocked.** Fixed canned strings per term/attempt (§3). No audio is ever captured or sent anywhere. |
| Audio recording | **Mocked.** No `getUserMedia()`/microphone access. Timer + fake waveform only. |
| Mic permission (S3/S4) | **Mocked.** No real OS permission API involved; S4 is a styled fake dialog. |
| Audio playback (S6) | **Mocked.** Fake scrub/progress animation, no real audio file. |
| LLM judging | **Mocked.** Deterministic script (§3) plus keyword matching for typed input (§4). No API call. |
| Processing delay (S7) | **Mocked.** A fixed ~1–1.5s timeout, not a real request. |
| Network/LLM error (S8e) | **Mocked, manually triggered.** Not a real failure — a debug-accessible state. |
| XP counter / deposit | **Mocked.** In-memory + localStorage only for session flags; no XP ledger or backend. |
| "Add to spaced review" (S13) | **Mocked.** UI confirmation only, no backend record created. |
| Session summary content | **Real logic, mocked data.** The 3/5-terms-nailed math is computed from the actual scripted outcomes in §3, not hardcoded as a string. |

---

## 8. Explicitly out of scope

Everything sprint-context.md's Constraints/Non-goals section already lists (no TTS,
no transcript editing, no per-term exit choice, no audio storage/transmission, no
cross-session term memory, no social/sharing/leaderboard features, hard 5-term
session cap, no Exam Plan build) — confirmed as-is, nothing additional cut. Do not
build: a real Exam Plan, login/auth, settings, tablet/landscape layouts, or any
error states beyond the one network/LLM-error state specified in §5.

---

## 9. Architecture & motion notes

- **Structure:** one full-screen `VoiceRecallSession` component (Next.js + Tailwind,
  `"use client"`). Internal state machine (e.g. `useReducer`) holds: `step` (which
  of S0–S13 is active), `currentTermIndex`, `attemptsForCurrentTerm`, `bubbleLog`
  (array, keyed per term), `sessionXpTally`, `missedTerms` (for S12). No separate
  Next.js routes per screen — screen changes are internal state transitions.
- **Transitions:** use the four presets from motion-guide.md as-is (`gentle`,
  `snappy`, `sheet`, `soft`) — don't invent new easing curves. Bottom sheets (S1,
  S3) use `sheet`. Bubbles appending to the stack (S8) use the "Knowie's reply
  appearing" recipe (fade + slight rise, `gentle`). Mic press uses `snappy` +
  `whileTap={{ scale: 0.94 }}`. Recording pulse uses the looping-scale recipe.
  Summary (S10) staggers its rows in per the end-of-session recipe.
- **New badge-color mapping** (not previously in design.md — first used here):
  CORRECT → `feedback/success/bold`; PARTIALLY RIGHT → `highlight/border`; HINT →
  `pro/bold`; ANSWER REVEALED → neutral (`background/surface` + `border/default` +
  `text/secondary`, deliberately desaturated); network error → `feedback/error/bold`.
  These reuse existing tokens only — no new hex values.
- **Accessibility baseline** (prototype-rules.md): every badge/result state must be
  distinguishable by label/icon/shape, not color alone; recording state needs a
  visible shape/label change beyond the pulse; touch targets ≥44×44px (extend hit
  area invisibly if the mic or skip/fallback links look smaller); visible focus
  states on every interactive element; safe-area insets on every full-screen view.

---

## 10. Image assets — only source of mascot/avatar imagery

Only four image files exist, in `/images`. Reference them exactly as
`/images/[filename]` — no placeholder images, no external URLs, no invented paths.
If a screen seems to need an image not listed here, it doesn't exist yet: flag it,
don't fake a path or pull one from the internet.

| File | What it is | Use for |
|---|---|---|
| `/images/mascotSlot.png` | Full-body standby Knowie, transparent background, calm neutral eyes | The default large-scale mascot appearance: S1 primer sheet, S3 permission sheet. |
| `/images/mascot big eyes.png` | Full-body Knowie with wider, more alert eyes, transparent background | Reserved for the one payoff moment — the S10 session-summary hero — as the only available variant with a different expression from standby. |
| `/images/Avatars.png` | Same standby pose, pre-cropped smaller | Available for small inline avatar-scale mascot use if a screen calls for it (not currently required by §2). |
| `/images/Group 2136139939.png` | Standby Knowie face inside a circular grey-background chip | Available for circular avatar-icon use (e.g. a nav-style icon slot) if one is ever needed — not currently required by §2. |

**Real gap — don't paper over it.** design.md documents 14+ named Figma expression
states (confused, approving, laughing, thinking, sad, determined, etc.) as
swappable eye/brow overlays on Knowie's body, but none of those are exported as
image files — only the two full-body poses above exist. **Do not invent,
approximate, or generate art for the missing expressions.** Every mascot
appearance in this build uses one of the four files above; the partial/hint/
revealed/error distinctions in §2.8 are already carried entirely by badge color,
label, and copy (§9), not by swapping mascot art — so this gap doesn't block
anything already specified. If more expression art gets exported later, it's a
drop-in swap, not a rework.

**Filename note:** `mascot big eyes.png` contains spaces — reference it exactly as
written (`/images/mascot big eyes.png`); a literal string in an `<Image src>` or
CSS `url()` handles the space fine without renaming or re-encoding the file.

---

## 11. Verification checklist

- [ ] S0 launcher opens the flow; nothing else of the Exam Plan is built.
- [ ] First run shows soft-gate primer (S1) → mic-permission sheet (S3) → fake OS
      dialog (S4) on the first mic tap only; a page reload after dismissal skips
      straight to S2 (localStorage flags working).
- [ ] Term prompt (S2) shows progress bar, eyebrow label, live XP counter, term
      headline, instruction line, mic button, "Skip this term," and "Type instead."
- [ ] First term's contextual mic hint shows once, never again.
- [ ] Recording (S5): tap starts it, visible active/pulsing state, live timer,
      Cancel works, manual stop works, ~8s auto-stop fires if untouched, sub-1.2s
      stop routes to the empty-recording bounce-back (no attempt consumed).
- [ ] Playback review (S6): fake play/scrub animation runs, Submit and Record
      again both work, Type instead reachable here too.
- [ ] Processing (S7) shows the "Knowie is listening" state for ~1–1.5s; long-press
      on the mascot triggers the network-error bubble (S8e) instead.
- [ ] Feedback stack (S8) accumulates bubbles per attempt (transcript echo → graded
      badge → hint if partial) without replacing prior bubbles; recording panel
      reappears below the hint for the next attempt.
- [ ] All 5 scripted terms produce the exact outcomes in §3: Mitosis correct/+30,
      Cell membrane hint-then-correct/+15, Meiosis revealed after 3 attempts/+0,
      Chromosomes correct/+30, DNA Replication skipped/+0.
- [ ] Reveal bubble (Meiosis) renders in the neutral/desaturated treatment, not a
      hint-amber or error-red treatment.
- [ ] Typing the correct keyword(s) into "Type instead" at any of its three entry
      points produces the same result the voice path would at that attempt.
- [ ] Back button mid-session (any of S2/S5/S6/S7/S8) shows the exit-confirmation
      dialog; confirming returns to S0 with XP reset to zero.
- [ ] Session summary (S10) shows the real computed "3 of 5 terms nailed — 2 left
      to strengthen," per-term list with correct icons/sublabels/XP deltas, and all
      three exit actions.
- [ ] "Redo these 2 in voice recall" (S12) re-runs the loop scoped to Meiosis + DNA
      Replication only, ending in its own summary.
- [ ] "Add to spaced review" shows a toast then returns to S0; "Continue to next
      plan step" returns to S0 directly.
- [ ] No real audio capture, STT, LLM/network call, or TTS anywhere in the build.
- [ ] Every screen matches design.md tokens (colors/type/spacing/radius) — no raw
      hex, no invented values, no inline styles.
- [ ] Every mascot image referenced is one of the four real files in `/images`
      (§10) — no placeholder images, no external URLs, no invented paths, no
      generated art for expression states that don't exist as files.
- [ ] Motion uses only the four shared presets from motion-guide.md; nothing
      animates `width`/`height`/`top`/`left`; `useReducedMotion()` is respected.
- [ ] Touch targets ≥44×44px; visible focus states; all result states readable
      without relying on color alone; safe-area insets respected on every screen.
- [ ] Builds clean and deploys to Vercel; mobile-only 390px, dark mode only.
