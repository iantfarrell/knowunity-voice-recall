// Reusable Motion transition presets — motion-guide.md "Transition presets
// (reuse these, don't invent new ones)". Defined once, referenced everywhere.

export const gentle = { type: "spring", stiffness: 260, damping: 30 } as const; // most UI
export const snappy = { type: "spring", stiffness: 400, damping: 28 } as const; // taps, toggles
export const sheet = { type: "spring", stiffness: 300, damping: 34 } as const; // bottom sheets
export const soft = { duration: 0.22, ease: [0.22, 1, 0.36, 1] } as const; // fades, simple moves
