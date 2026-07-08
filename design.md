design.md — Knowunity brand tokens & UI patterns

Source: Figma file "Untitled", file key `4CzAQPPzgUG7zMkTC9aviE`. Three pages inform this doc:
- "🎨 Mascot & components" (node `0:1`) — the token/component library. Colors, type styles, spacing, radius, and mascot specs below are extracted directly from this page's variables and text styles via the Figma MCP — nothing is invented.
- "Example Screens" (node `1:5584`) — Knowunity's own shipped screens, used as reference for how the design system composes into real product UI (home/dashboard, chat/quiz, onboarding).
- "Full flow - Mod 4" (node `61:5085`) — the actual in-progress voice-recall flow this prototype is based on. This is the primary source for Section 4's recall-flow composition notes.

Anything none of these define is called out in **Gaps**, not guessed.

Mode: the file has one mode — dark. `background/page` (#090c18) is the base canvas everywhere sampled; there is no light-mode variable set to compare against.

Typeface: **Inter Variable only.** Greed VF appears in the component-library page but is a custom/inaccessible font for this prototype — every text role below (including ones the library originally set in Greed VF) renders in Inter Variable, keeping the same sizes/weights/line-heights that are actually used on screen.

---

## 1. Color tokens

### Backgrounds
| Token | Hex | Used for |
|---|---|---|
| `background/page` | `#090c18` | App canvas / root background (near-black navy). Sits behind everything. |
| `background/surface` | `#22242f` | Raised surfaces on top of the page: bottom-sheet body, list-item rows, secondary buttons. The one-step-up-from-page dark layer. |
| `background/floating` | `#3d3d3d99` (60% alpha) | Floating/overlay chrome, e.g. the bottom-sheet drag handle. |
| `background/stacking` | `#ffffff1a` (10% white) | Thin translucent layer for stacking content above a surface (e.g. a scrim tint on `surface`). |
| `background/input` | `#ffffff1a` (10% white) | Fill for text-input fields (matches the chat/text-entry field). |
| `background/inverse` | `#f4f2ff` | Inverse (light) background, used where content flips to a light card on a dark screen — e.g. the "selected" list-item state and snackbars. |

### Text
| Token | Hex | Used for |
|---|---|---|
| `text/primary` | `#f4f2ff` | Default body/heading text on dark surfaces (off-white, not pure white). |
| `text/secondary` | `#f5f3ffad` (~68% alpha) | Subtitles, captions, de-emphasized copy under a primary line. |
| `text/disabled` | `#ffffff66` (40% alpha) | Disabled label text. |
| `text/inverse` | `#090c18` | Text placed on light/inverse backgrounds (e.g. label on a primary pill button). |

### Borders / dividers
| Token | Hex | Used for |
|---|---|---|
| `border/default` | `#ffffff1a` (10% white) | Standard hairline border/divider on dark surfaces. |
| `border/subtle` | `#ffffff1a` (10% white) | Same value as `border/default` in this file — see Gaps, likely two names for one value or one is unused. |
| `highlight/border` | `#9d85ff` | Accent border for a highlighted/focused element (light violet, brighter than brand purple). |

### Brand & accent
| Token | Hex | Used for |
|---|---|---|
| `accent/brand/bold` | `#9178e6` | Core brand purple. Identical value to `Homie/Inkwell` — this is Knowie's body color reused as the brand accent. |
| `accent/coral/bold` | `#fb7e5b` | Secondary brand accent (warm coral), also doubles as the error/alert hue in the snackbar. |
| `accent/blue/bold` | `#5fa0fc` | Tertiary accent blue. |
| `accent/blue/onBold` | `#06173b` | Text/icon color to place on top of `accent/blue/bold`. |
| `pro/bold` | `#f5b53d` | "Pro"/premium accent (gold) — seen on the active state of "pro"-colored chips. Implies a premium tier exists in the product. |
| `pro/onBold` | `#2a1d04` | Text/icon color to place on top of `pro/bold`. |
| `Homie/Inkwell` | `#9178e6` | Knowie mascot body fill. |
| `Homie/Eyes` | `#0a0a0a` | Knowie mascot eye fill (near-black). |

### Interactive (buttons/controls)
| Token | Hex | Used for |
|---|---|---|
| `interactive/primary` | `#f4f2ff` | Primary button fill — an off-white pill, not the brand purple. |
| `interactive/onPrimary` | `#090c18` | Label/icon color on top of a primary button. |
| `interactive/secondary` | `#ffffff1a` (10% white) | Secondary button fill — a subtle translucent dark pill. |
| `interactive/onSecondary` | `#f4f2ff` | Label/icon color on top of a secondary button. |
| `interactive/pressed` | `#ffffff1a` (10% white) | Pressed-state overlay (same value as `interactive/secondary`). |
| `interactive/disabled` | `#ffffff1a` (10% white) | Disabled control fill. |

### Feedback / states
| Token | Hex | Used for |
|---|---|---|
| `feedback/info` | `#2e89f9` | Info snackbar icon/badge. |
| `feedback/success/bold` | `#00c386` | Success snackbar icon/badge. |
| `feedback/success/onBold` | `#0a1f18` | Text/icon on top of success-bold. |
| `feedback/error` | `#ff6b6b` | Error state color. |
| `feedback/error/bold` | `#ff6b6b` | Same value as `feedback/error` — see Gaps. |
| `feedback/error/onBold` | `#2a0808` | Text/icon on top of error-bold. |

---

## 2. Type scale

**Single family: Inter Variable.** The component-library page defines two families (`Greed VF` for display/headline/button/caption styles, `Inter Variable` for a narrower set of list/body/caption styles), but Greed VF is a custom font that isn't accessible for this build. Per your call, every row below renders in **Inter Variable** — sizes, weights, and line-heights are unchanged from what's actually used on real screens; only the font-family swaps. Rows originally set in Greed VF are marked so you know which ones need the family override; rows already in Inter Variable need no change.

| Style token | Size | Weight | Line height | Letter spacing | Originally | Used for |
|---|---|---|---|---|---|---|
| Display M | 76 | 900 (Black) | 76 | -1 | Greed VF | Largest display numeral/headline (defined; not observed rendered on an inspected screen). |
| Headline XL | 44 | 900 (Black) | 44 | -1 | Greed VF | Big center headlines: bottom-sheet primer headline, term-prompt headline (e.g. "Cell membrane"), session-summary headline. |
| Headline S | 21 | 900 (Black) | 24 | 0 | Greed VF | Button labels on L-size pill buttons. |
| Headline XXS Bold | 15 | 600 (SemiBold) | 16 | 1 | Greed VF | Eyebrow/label text above a headline (e.g. "SECOND TERM") and status badges (e.g. "PARTIALLY RIGHT", "HINT 1", "CORRECT"). |
| Headline XS Regular | 18 | 400 (Regular) | 20 | 1 | Greed VF | Subtitle directly under a big headline (bottom-sheet, term-prompt instruction line "Explain this in your own words."). |
| Headline XS | 17 | 600 (SemiBold) | 100% | 0 | Inter Variable | List-item titles (e.g. "Maths"), home-screen greeting line ("Evening study session, Harry?"). |
| Body M Bold | 18 | 600 (SemiBold) | 24 | 1 | Greed VF | App-bar title rows (bottom sheet). |
| Body M Bold | 17 | 600 (SemiBold) | 100% | 0 | Inter Variable | General bold body text. |
| Body S Bold | 15 | 600 (SemiBold) | 20 | 1 | Greed VF | Emphasized body copy. |
| Body S Regular | 15 | 400 (Regular) | 20 | 1 | Greed VF | Default body copy, transcript-echo bubble text. |
| Body S Bold | 14 | 600 (SemiBold) | 100% | 0 | Inter Variable | Small bold body text (session-summary per-term sublabels, e.g. "Got it with 1 hint"). |
| Caption M Regular | 12 | 400 (Regular) | 16 | 1 | Greed VF | App-bar subtitles, general captions. |
| Caption M Bold | 12 | 600 (SemiBold) | 16 | 1 | Greed VF | Emphasized captions. |
| Caption M | 11 | 400 (Regular) | 100% | 0 | Inter Variable | Smallest general caption. |
| Caption S Bold | 9 | 600 (SemiBold) | 12 | 1 | Greed VF | Smallest bold label (chip/badge-scale text, XP deltas like "+30"). |
| Caption S Regular | 9 | 400 (Regular) | 12 | 1 | Greed VF | Smallest regular label. |

Line-height note: the file's Inter Variable styles are all defined as "100%" (line-height = font size, not a fixed px value) — a real property of those tokens, not a placeholder. The Greed VF-originated rows keep their fixed px line-heights carried over as-is.

---

## 3. Spacing tokens (px)

| Token | Value | Used for |
|---|---|---|
| `space-0` | 0 | No gap. |
| `space-050` | 2 | Micro gap (e.g. between a list-item title and a secondary line). |
| `space-100` | 4 | Tight gap (e.g. bottom-sheet handle offset, text-block internal gap). |
| `space-150` | 6 | Small gap. |
| `space-200` | 8 | Compact gap (e.g. between stacked buttons in a button group). |
| `space-300` | 12 | Standard inline gap (e.g. between a leading icon and label in a list item). |
| `space-400` | 16 | Standard container padding (bottom-sheet section padding, list-item row padding). |
| `space-600` | 24 | Large gap/padding (e.g. gap between mascot and text block in the bottom sheet). |

**Gap:** there is no `space-500` (20px) token in the file — the scale jumps from 16 to 24. If you need an in-between value, it isn't defined here; don't invent a "20" token without checking with design.

## 3a. Radius tokens (px)

| Token | Value | Used for |
|---|---|---|
| `radius-200` | 8 | Small elements (e.g. the color-swatch icon slot in a list item). |
| `radius-400` | 16 | Medium containers (defined; not observed on an inspected instance). |
| `radius-600` | 24 | Standard card/row radius — list items and similar surface blocks. |
| `radius-800` | 32 | Large container radius (defined; not observed on an inspected instance). |
| `radius-900` | 36 | Largest radius — top corners of the full-screen bottom sheet. |
| `radius-full` | 9999 | Pills — every button, chip, and circular icon button. |

**Gap:** nothing smaller than 8px is defined (no radius-100/4px token), so there's no "barely rounded" option in this system — everything is either 8px+ or a full pill.

## 3b. Icon & illustration sizes (px)

| Token | Value | Used for |
|---|---|---|
| `icon-small` | 12 | Smallest icon slot. |
| `icon-medium` | 16 | Small-medium icon slot. |
| `Icon/250` | 20 | Medium icon slot. |
| `icon-large` | 24 | Standard icon slot (nav icons, chevrons, list-item leading icons). |
| `Icon/400` | 32 | Large icon slot. |
| `Illustration/400` | 32 | Smallest mascot/illustration size. |
| `Illustration/500` | 40 | Mascot-as-icon size (matches the icon slot size inside a list item). |
| `Illustration/800` (XL) | 64 | Small mascot size. |
| `Illustration/1500` (2XL) | 120 | Bottom-sheet mascot size. |
| `Illustration/2500` (3XL) | 200 | Larger mascot size. |
| `Illustration/4000` (4XL) | 320 | Largest mascot size, near full-width on a 390px screen. |

## 3c. Stroke

| Token | Value | Used for |
|---|---|---|
| `stroke-border` | 1 | Default border/divider thickness. |
| `stroke-focus-ring` | 2 | Focus-ring thickness. |

---

## 4. How the UI is actually composed

This section now draws on three sources: the component-library page (shape/spacing rules), Knowunity's own shipped screens ("Example Screens", node `1:5584` — how the design system looks in a real, finished product), and your in-progress voice-recall flow ("Full flow - Mod 4", node `61:5085` — the actual screens this prototype should match). The recall-flow notes are the primary reference for this build.

### Shape language
Nothing in the file has a small/sharp corner. The radius scale is bimodal: containers use 8–36px rounding (list rows at 24px, sheets at 36px on the top corners only), and every tappable control (buttons, chips, snackbar badges, circular icon buttons) is a full pill (`radius-full`). There is no "slightly rounded rectangle" button anywhere — buttons don't come in a boxy variant.

Filled interactive elements (primary/secondary buttons, list-item rows) all carry the same inset shadow: `inset 0 -4px 0 rgba(0,0,0,0.15)`. This reads as a soft bottom bevel/emboss — a consistent tactile detail worth reproducing on any new pill-shaped control rather than a flat fill.

### List / row layout
The `listItem` component (400px wide, matching the mobile frame) is a `radius-600` (24px) pill-cornered row with 16px padding on all sides. Inside, a horizontal flex row holds up to four optional leading elements in a fixed 40×40 slot each, with a 12px gap between them:
- an icon slot (e.g. a subject glyph like a graduation cap),
- an illustration slot (e.g. a small mascot/decorative icon),
- a flat color swatch (a `radius-200` 8px square in a feedback/accent color — reads as a subject-color tag),
- an emoji slot (large emoji glyph, 44px).

Not all four appear in every row — the component is built so any subset can be shown. After the leading slots, the title sits in a single 17px Inter SemiBold line (`text/primary`). Trailing content is right-aligned and optional: a checkmark circle when the row is in a selected state (row background flips to the light `background/inverse` pill), a chevron when the row navigates somewhere, or nothing for a static row.

### Navigation / app bar
The app bar is edge-to-edge, transparent, and overlays content rather than sitting in an opaque bar — it's built with a top-to-transparent gradient of `background/surface` fading out, so content can scroll underneath it. Standard height is 48px per icon-button slot. Variants combine a leading back-arrow (left-aligned) with zero, one, or two trailing elements: a kebab (⋮) menu icon, a text button ("Skip"), a share icon, or a combination. There's no persistent title in the plain app-bar variant — titles only appear in the bottom-sheet's own app-bar variant, which is a distinct component (see below).

### Bottom sheet (the core recall-flow container)
This is the most fully-specified real screen pattern in the file, and it's a strong match for the "full-screen takeover" flow: rounded only at the top (`radius-900`, 36px), `background/surface` fill, structured top-to-bottom as three fixed regions:
1. **Header row** — a small centered drag-handle bar (32×4px, `background/floating`) sits above a row with an optional leading close (X) button, a centered title+subtitle text block (18px Greed bold title / 12px Greed regular secondary subtitle), and an optional trailing icon button — all at 48px tap-target height.
2. **Middle section** — center-aligned, 24px gap between a mascot slot (120px, "2XL" size) and a text block (44px bold headline + 18px regular subtitle, 4px gap between them, both center-aligned, 16px horizontal padding).
3. **Bottom section** — 16px padding, a vertical button group with 8px gap between stacked full-width pill buttons (used here for two answer-progress buttons, but the same slot pattern is what your primary/secondary CTA pair should use).

### Mascot (Knowie) usage
Knowie is a single blob/ghost-shaped body (`Homie/Inkwell` purple, no visible mouth) with the entire emotional range expressed through a swappable eyes/brow overlay layer on top of a fixed body shape — confirmed 14+ named expression states (standby, confused, approving, overIt, laughing, angry, amazed, dazed, excited, giggling, questioning, thinking, sad, determined), plus two placeholder slots marked "TBD." This structurally matches "Knowie replies in text only" — there's no mouth to animate for speech, so reactions are eyes-only, which is consistent with never adding lip-sync or TTS.

Mascot rendering is standardized into one `mascotSlot` component with fixed size steps (64 / 120 / 200 / 320px — XL/2XL/3XL/4XL) plus two smaller icon-scale sizes (32/40px) for when Knowie appears inline (e.g. as a leading icon in a list row rather than as a hero illustration). Always use one of these six sizes rather than an arbitrary scale — the mascot art is built to those exact crops.

### Text input / can't-speak fallback
A `Chat Input` component exists: a full-width pill (`background/input` fill) with a leading circular "+" icon button, placeholder text "Ask anything...", and a trailing mic icon. Confirmed in real use on Knowunity's home and chat screens (see below), always pinned to the bottom safe area. This is the closest existing pattern to reuse for the "can't-speak" text fallback — same pill-input shape, swap the mic affordance for a keyboard-entry state, keep the leading "+"/attach slot hidden if not needed.

### Knowunity reference screens (node `1:5584`) — how the system looks finished

**Home / dashboard.** Top row: leading hamburger menu icon, trailing status cluster right-aligned — a gold "PRO Upgrade" pill, an XP counter (lightning-bolt icon + number), a streak counter (flame icon + number), and a history/clock icon. This status cluster is persistent chrome, reused (with the hamburger swapped for a back-arrow) on the chat/quiz screen. Below it, a centered hero: mascot illustration (2XL/3XL size) + a bold greeting headline ("Evening study session, Harry?"). Under the hero, a horizontally-scrollable row of pill chips with leading icons (Scan / Flashcards / Quiz / Summarize) — quick actions, not navigation. The `Chat Input` pill sits pinned above a 5-icon bottom tab bar (share/export, search, compass/explore, trophy, mascot/profile).

**Chat / quiz interface.** Back-arrow + the same status cluster (PRO pill, XP, a close icon) as a top bar. Directly under it, the same quick-action chip row as the home screen. Center: a single mascot avatar (no card/frame around it). Bottom: the `Chat Input` pill, now showing live-typed text and the native OS keyboard docked underneath it — confirms the input pill is a real, functioning text-entry surface, not just a decorative placeholder.

**Onboarding / permission screens** (e.g. "Find your classmates"). Minimal top bar — just a leading back-arrow, no status cluster (this happens pre-login/pre-setup). Hero art here is not the full mascot body but a decorative cluster of three overlapping circles, each showing just Knowie's eyes/brow pair in a different accent color (orange, purple, pink) — a lighter-weight way to use the mascot's expression system when the full body isn't needed. Below that: a bold center-aligned headline, then a left-aligned list of feature bullets each with a leading emoji glyph (not an icon-slot component — plain emoji). Near the bottom, a small lock icon + caption line builds trust before a permission ask ("We'll use your location only once"), followed by a full-width primary pill CTA pinned to the bottom safe area. This is a direct structural match for this prototype's mic-permission primer screen.

### Voice-recall flow (node `61:5085`) — primary reference for this build

This is a full-screen takeover (not a bottom sheet in the final flow) that walks through: **primer → recording idle → mic-permission ask → recording active → playback review → processing → transcript & feedback loop → session summary.**

1. **Primer.** Full-screen intro framing the recall task before any recording starts.
2. **Recording idle.** Mic entry point shown with a first-time contextual hint bubble (shown once, not on repeat visits).
3. **Mic permission.** A bottom sheet (matching the library's bottom-sheet component exactly — drag handle, centered mascot, headline/subtitle, stacked pill buttons) asks for mic access before falling through to the **native OS permission dialog**.
4. **Recording active.** Large circular mic button as the primary control, with a live timer, a waveform visualization, and Cancel/Stop affordances.
5. **Playback review.** After stopping, the student can review before committing: "Submit" or "Record again" — no auto-submit.
6. **Processing.** A short "Knowie is listening" state bridges recording and feedback (mocked delay, not a real STT call per CLAUDE.md).
7. **Transcript & feedback — chat-bubble log, not screen replacement.** This is the key structural finding: each attempt appends a new bubble to a growing vertical stack rather than replacing the previous screen. The stack for one term looks like:
   - a **transcript-echo bubble** (student's words, with recognized-correct keyword spans highlighted in green),
   - a **graded-feedback badge bubble** — a small pill label in Headline XXS Bold reading "PARTIALLY RIGHT" (violet/purple) or "CORRECT" (green), followed by Knowie's synthesis feedback text calling out what was right,
   - on a partial answer, a **hint badge bubble** — an amber "HINT 1" / "HINT 2" pill plus the hint text,
   - the **recording panel re-appears below the hint** for the next attempt (up to the 3-attempt hint-ladder cap from sprint-context.md), producing a second transcript bubble, and so on,
   - the loop ends on a **CORRECT bubble** with a "Next question" primary CTA button.
   This confirms the "partial credit + hint" mechanic from CLAUDE.md is built as an accumulating conversational log the student can scroll back through, not a sequence of discrete pass/fail screens.
8. **Per-term progress header.** Each term prompt screen carries a thin progress bar at the very top plus a small "SECOND TERM" (etc.) eyebrow label and a running XP counter (lightning icon + number) — this counter visibly increments during the session but, per CLAUDE.md's "XP only deposits at summary" rule, is a live in-session tally, not the final deposited total. Below the progress header: the term name as a Headline XL, the instruction line "Explain this in your own words." (Headline XS Regular), a large circular mic button centered lower on the screen, and two text-link fallbacks beneath it — "Skip this term" and "Type instead" (the can't-speak fallback, always one tap away, exactly as CLAUDE.md requires).
9. **Session summary.** Mascot hero, a large "+100 XP" deposit line (Display-scale, gold), a headline ("Great job on Cell Division") and subtitle stating the score as a ratio with a next-step framing ("3 of 5 terms nailed — 2 left to strengthen"), a filter chip row (Correct / Partially / Revealed / Skipped) over a per-term result list (status icon + term name + sublabel like "Got it with 1 hint" + right-aligned XP delta), a "terms to strengthen" chip row naming the specific missed terms, and two CTAs: a primary pill "Redo these 2 in voice recall" (mic icon leading) and a secondary text button "Remind me tomorrow" (clock icon). This is the concrete pattern satisfying CLAUDE.md's "summary must point to a next step, not just a score."

### Spacing rhythm
Reading the bottom sheet and list item together, the rhythm is: 16px is the standard outer/container padding; 12px is the standard gap between a leading icon and its label; 8px separates stacked same-purpose controls (buttons in a group); 24px separates distinct content blocks (mascot from text, or one section from the next); 4px separates a heading from its immediate sub-line. There is no 20px step (see Gap above), so don't split the difference between 16 and 24 — pick one.

---

## 5. Gaps — don't guess past these

1. **Resolved — typeface.** Inter Variable only, per your decision; see Section 2 for the merged scale.
2. **Resolved — real screens.** Section 4 now reflects Knowunity's shipped "Example Screens" (`1:5584`) and your in-progress "Full flow - Mod 4" (`61:5085`) rather than being extrapolated from the component library alone.
3. **Gradient tokens unresolved.** `Gradient/BG Top` and `Gradient/BG Top Modal` are defined as gradient variables, but the API only returned an empty value (a bare comma) for both — likely a multi-stop gradient paint the variable-extraction tool can't flatten to a single value. These need manual inspection in Figma before use.
4. **Duplicate-looking tokens with identical values** — pick one canonical name rather than using both:
   - `border/default` and `border/subtle` are both `#ffffff1a`.
   - `feedback/error` and `feedback/error/bold` are both `#ff6b6b`.
   - `highlight/border` and `highlight/indicator` are both `#9d85ff`.
5. **Likely legacy/orphaned tokens** spotted alongside the current set, not included in the tables above because they don't fit the active naming scheme and only appear once each: `UPDATED — Black 01` (`#090c18`, same value as `background/page`), `Border/Neutral/Inverse` (`#e5e5e5`, unused elsewhere), `Core/BG/Secondary Transparent` and `Core/Grayscale/Dividers` (an older `background/border` naming pattern that overlaps the current one). Worth a cleanup pass in the Figma file itself, but not something to build against.
6. **Native-OS keyboard reference, not product tokens.** Variables like `Labels - Vibrant/Primary`, `Fills - Vibrant/Primary`, `Miscellaneous/Keyboards/*`, `Accents/Blue (#0091ff)`, and a `Body/Regular` style set in "SF Pro" all come from a native iOS keyboard mockup used as a reference component — excluded from the token tables above since they describe the OS keyboard, not your app's design system.
7. **No 20px spacing step and no sub-8px radius** — see sections 3 and 3a. If a design calls for either, that's a new value, not something already in the system.
