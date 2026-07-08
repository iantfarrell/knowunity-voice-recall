// Small hand-coded interface glyphs (close, mic, XP bolt). These are generic,
// unambiguous UI icons — not mascot/brand illustrations — so they're built as
// inline SVG rather than pulled from /public/images, keeping the design's
// only image assets to the 4 real mascot/avatar files (see SPEC.md §10).

export function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MicIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <path
        d="M6.5 11.25V12a5.5 5.5 0 0 0 11 0v-.75M12 19.5v-2.25"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />
    </svg>
  );
}

export function PauseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect x="6.5" y="5.5" width="3.5" height="13" rx="1" fill="currentColor" />
      <rect x="14" y="5.5" width="3.5" height="13" rx="1" fill="currentColor" />
    </svg>
  );
}

// The four session-summary per-term status glyphs (Figma node 110:7707) —
// checkmark (nailed/hinted rows), eye (revealed), minus (skipped). Each is
// rendered inside its own colored circle by the caller (EndSummary.tsx),
// so these are just the bare glyphs, matching this file's existing
// currentColor convention.
export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M5 13l4.5 4.5L19 8"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={1.8} />
    </svg>
  );
}

export function MinusIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M5 12h14"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

// The "Remind me tomorrow" CTA's leading glyph (Figma node 110:7707,
// "schedule" icon) — a plain clock face, matching this file's existing
// stroke-based convention.
export function ScheduleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={1.8} />
      <path
        d="M12 7v5.5l3.5 2"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Matches the Figma-exported XP bolt exactly (node 63:3550): a solid
// currentColor bolt with a second, inset bolt-shaped cutout punched through
// it (filled with the page background token) to create the outlined look —
// not a stroke. See Figma asset 0d88114e-4dd5-4ac5-97f6-de430d68ebe8.
export function BoltIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 17.9338 22"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4.76562 22C3.82994 22 2.94682 21.4981 2.45269 20.6864C1.95857 19.8748 1.91651 18.8816 2.34756 18.0165C3.13606 16.4146 3.75635 15.1757 4.22945 14.2146C3.77737 14.2146 3.27273 14.2146 2.70501 14.2146C1.55906 14.2146 0.560296 13.5097 0.171303 12.4204C-0.228203 11.3311 0.0871968 10.135 0.949289 9.38738C3.23068 7.41165 8.69761 3.03301 11.757 0.587379C12.2406 0.202913 12.8188 0 13.4181 0C14.3958 0 15.3 0.54466 15.7836 1.40971C16.2567 2.26408 16.2357 3.33204 15.731 4.17573L13.8702 7.28349H15.2264C16.3618 7.28349 17.3606 7.98835 17.7601 9.06699C18.1596 10.1456 17.8547 11.3417 17.0031 12.1L6.54238 21.3165C6.04825 21.7544 5.41745 21.9893 4.77614 21.9893L4.76562 22Z"
        fill="currentColor"
      />
      <path
        d="M4.755 20.4194C4.51319 20.4194 4.26087 20.334 4.05061 20.1738C3.60905 19.8321 3.48289 19.234 3.73521 18.7321C5.34375 15.4855 6.24789 13.6486 6.8051 12.6127C5.96403 12.6447 4.67089 12.6447 2.69439 12.6447C2.21078 12.6447 1.79024 12.3457 1.62203 11.8864C1.45382 11.4272 1.57998 10.9146 1.95846 10.5942C4.21882 8.63984 9.67523 4.27188 12.7241 1.83693C13.1657 1.4845 13.7649 1.50586 14.1854 1.87965C14.606 2.26411 14.7006 2.87285 14.4062 3.36411L11.105 8.87479H15.2368C15.7204 8.87479 16.1409 9.17382 16.3091 9.63304C16.4774 10.0923 16.3512 10.5942 15.9832 10.9253L5.52247 20.1418C5.30169 20.334 5.03886 20.4301 4.77603 20.4301L4.755 20.4194ZM8.24542 12.4097C8.03516 12.8262 7.25717 14.3748 5.00732 18.9243L14.995 10.1243H10.9368C10.5268 10.1243 10.1378 9.90003 9.93807 9.52625C9.73831 9.16314 9.74883 8.7146 9.95909 8.35149L13.1026 3.1078C10.0537 5.53207 5.05989 9.54761 2.84158 11.4486C6.02711 11.3952 7.41487 11.3738 7.65668 11.3631C7.74078 11.3311 7.81438 11.3418 7.909 11.3631C8.18234 11.4272 8.3821 11.6835 8.3821 11.9719C8.3821 12.1748 8.3821 12.3136 8.23491 12.4097H8.24542Z"
        fill="var(--color-background-page)"
      />
    </svg>
  );
}
