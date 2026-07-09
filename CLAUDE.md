# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current state

The Next.js app is scaffolded and running (see Commands below). Built so far:
S2 — Term prompt (idle), the first screen, matching Figma node `62:8581`. The
rest of the flow in SPEC.md §1 (S0, S1, S3–S13) is not built yet.

## Before writing any code

Read [sprint-context.md](sprint-context.md) in full. It is the source of truth for this feature and defines:

- The core flow (bottom sheet → permission primer → push-to-talk recording → STT → LLM judging → hint ladder → session summary)
- Committed UX decisions (full-screen takeover, chat-style bubbles, text-only Knowie, no TTS)
- Hard constraints / non-goals (no transcript editing, no audio storage, 3-attempt hint ladder, 3–5 term session cap, XP only deposits at summary)

Treat the constraints and non-goals sections as hard requirements, not suggestions — several of them (e.g. no TTS, no per-term exit choices, XP never deposits mid-session) are deliberate product decisions that are easy to accidentally "fix" if implemented without reading the spec first.

When implementation starts, update this file with real build/test/lint commands and architecture notes.

# CLAUDE.md — Knowunity voice recall prototype

## Project
- Building: a clickable prototype of a voice active-recall step in Knowunity's
  Exam Plan. A student explains a key term out loud; the character "Knowie"
  replies in TEXT.
- For: students (~14–20) revising on their phone.
- My committed concept: a full screen voice recall session that works with partially right answers, if a student gets some of the question right Knowie will call out what was correct while giving a hint on what else is needed to fully answer the question
- Platform: mobile only, 390px wide. Dark mode only.

## This is a test prototype, not a working AI   (read this first)
- MOCK the recall intelligence: 2–3 fixed example terms with a canned
  "transcript" and a canned result/hint. The mic just advances the mocked flow.
- Never build real speech-to-text, real audio capture, or call any model/API.
- Knowie replies in TEXT only. Never add text-to-speech or audio output.

## Stack & tools
- Next.js + Tailwind (deploys to Vercel). Animations: the Motion library
  (motion/react); see motion-guide.md. Type: Inter Variable.
- Style only from the tokens in design.md. Never invent hex.

## Commands
- Stack: Next.js 16 (App Router, TypeScript, Turbopack) + Tailwind CSS v4 + Motion.
- Node: this machine's system Node was ancient (v4, from 2015) and unusable —
  nvm is now installed with Node v24.18.0 as default. The Bash tool does not
  auto-load nvm per invocation, so any command needing node/npm/npx must be
  prefixed with:
  `export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh";`
- Install: `npm install`
- Dev (local preview): `npm run dev` — serves at http://localhost:3000
- Build: `npm run build`
- Typecheck: `npx tsc --noEmit`
- Lint: `npm run lint`

## Architecture notes
- Single-page app, no per-screen routes — `src/app/page.tsx` renders one
  screen component at a time (see SPEC.md §9 for the intended state-machine
  shape; only S2 is wired up so far).
- `src/components/screens/` — one component per flow screen (e.g.
  `TermPrompt.tsx` = S2).
- `src/components/icons.tsx` — hand-coded inline SVGs for generic UI glyphs
  (close, mic, XP bolt). Mascot/avatar imagery only ever comes from
  `public/images/` (see SPEC.md §10) — never add new image files without
  checking they actually exist there.
- `src/lib/session-data.ts` — the mocked 5-term script (SPEC.md §3), the only
  "intelligence" in this prototype. No real STT/LLM call exists anywhere.
- `src/lib/motion.ts` — the four shared Motion transition presets from
  motion-guide.md (`gentle`, `snappy`, `sheet`, `soft`). Reuse these; don't
  invent new easing/spring values.
- `src/app/globals.css` — all design tokens (`design.md`) as Tailwind v4
  `@theme` CSS variables (`background-page`, `text-primary`,
  `accent-brand-bold`, etc.) plus the `.app-shell` safe-area wrapper.

## Always
- Build the states MY committed flow needs (from Module 3). At minimum the core
  loop reads clearly: idle → recording → processing → result.
- Keep the can't-speak text fallback reachable in one tap on every recall screen.
- Make the summary point to a next step (repeat missed terms, re-test later),
  not just a score.
- Reuse a pattern from the design system before inventing one.
- Before building a screen, look at the matching screen in reference/ and match its layout and feel; treat those images as the sample UI for how Knowunity looks.

## Never
- Never style with raw hex or inline styles.
- Never build the whole app or every edge state. Build my core flow well.
- Never change screens or styles I didn't ask you to touch. Fix only what I name.

## Where things live (point, don't paste)
- sprint-context.md · design.md · SPEC.md · prototype-rules.md · motion-guide.md
- reference/ : screenshots of real Knowunity screens (sample UI to match)
- public/images : mascot, avatars
- feedback.md (lives outside this repo, at
  `/Users/ianfarrell/Documents/Claude/Projects/Knowunity/feedback.md`) : my
  prioritized fix-list from user testing. Read it before making fixes.
  Change only what it lists — and treat anything it marks as working as
  off-limits; don't touch it.

## Definition of done
- Matches my Figma frames. Uses tokens from design.md + Inter Variable; dark mode.
- Core voice loop is tappable and legible; can't-speak fallback works;
  summary points to a next step. Builds clean and deploys to Vercel.

## Good to know
- [a recurring thing Claude got wrong before — add as you go]