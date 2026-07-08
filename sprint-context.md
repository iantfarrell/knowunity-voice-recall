# sprint-context.md
## Knowunity — Voice Recall Prototype

---

## What this is

Knowunity: exam-prep app for A-level / GCSE students.  
Voice recall: student explains a term out loud; Knowie (AI mascot) responds in text with feedback and hints.  
Problem: students default to passive re-reading; this forces active retrieval with lower friction than typing.

---

## Committed concept

Full-screen takeover — student leaves the Exam Plan for the duration of the session; returns on exit or summary.  
Chat-style interface: Knowie anchored at bottom, term and transcript appear as chat bubbles above.  
Knowie is text-only. No TTS, no audio output from Knowie.

> "Say it out loud — Knowie tells you what you got right."

---

## Core flow

1. Exam Plan → tap Voice recall row → bottom sheet slides up over plan
2. First-time only: soft gate primer inside sheet; skippable in one tap; never shown again
3. First mic tap: in-context permission primer → OS dialog (first-time only)
4. Term prompt: Knowie shows term; student taps mic
5. Push-to-talk recording; cancel available throughout; 90s auto-stop
6. Audio review: student listens back; submit or re-record
7. Processing: Knowie thinking state, <4s target
8. Result: STT transcript shown with correct parts highlighted + Knowie text response
9. Partial / wrong: hint ladder — max 3 attempts, then Knowie reveals answer
10. Correct: short Knowie affirmation, auto-advance to next term (no student choice here)
11. Session summary: per-term breakdown (unaided / hint-assisted / revealed / skipped); XP deposits here
12. Three summary exits: retry missed terms now · add to spaced review · continue to next plan step

---

## Key design decisions

- Full-screen takeover throughout — student leaves the plan context for the session; no plan visible behind
- Chat-style layout: term shown as Knowie message bubble, student's transcript shown as their reply bubble post-processing
- Active recording fills the screen; mic button prominent at bottom center; waveform feedback while recording
- Audio playback at review step, not STT text preview — student checks their delivery; transcript surfaces post-processing as part of result
- Push-to-talk, not auto-endpointing — student explicitly controls start and stop
- LLM-as-judge with generous tuning, max 3 attempts per term — near-correct answers pass; student not penalised for phrasing
- Partially correct and completely wrong use the same UX branch — one result component, copy differs between the two states
- XP counter visible in sheet header during session; deposits only at summary — retention mechanic; zero XP if session abandoned before summary
- "Type instead" available at three specific points: term prompt, audio review, result screen — converges at same LLM judge, same hint ladder
- Auto-advance after correct result, no per-term exit choice — session momentum preserved; all exits live at summary only
- Empty recording detected before submit — near-empty STT transcript returns to idle mic with prompt; no LLM call, no attempt consumed
- Network / LLM error: show retry + type instead; do not increment attempt count

---

## Text fallback

"Type instead" at term prompt, audio review, and result screen. Input converges at the LLM judge. Same 3-attempt hint ladder and same session summary apply.

---

## Constraints / non-goals

- No TTS — Knowie never produces audio
- No transcript editing — student cannot correct what STT heard before submission
- No per-term exit decisions — session summary is the only choice point between terms
- No audio stored or transmitted beyond STT processing
- No per-term memory across sessions (V1)
- No social, sharing, or leaderboard features
- Session cap: 3–5 terms per session, hard cap at 5
- Skip always available: at term prompt and after any partial result; no penalty
- Back button from term prompt mid-session: confirmation dialog, not silent exit
- XP never deposits mid-session — zero deposited on abandon before summary screen
- Don't build the Exam Plan — only the voice recall full-screen flow that launches from it
