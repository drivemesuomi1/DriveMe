# Design Review Checklist

Run before presenting any hi-fi concept, and when reviewing external designs.
A "no" on any ⛔ item blocks presentation.

## Hierarchy & clarity
- ⛔ The screen's single primary action is unmistakable within 3 seconds
- One `h1`-level element per view; heading levels don't skip
- Squint test: blur your eyes — the visual hierarchy matches the importance
  hierarchy
- Every element can answer "why do you exist?"; anything that can't is removed
- Text hits the reading pattern: value prop ≤ 9 words, sections scannable by
  headings alone

## Aesthetic discipline
- Only tokens from the design language — no ad-hoc hex values, font sizes, or
  spacing values
- Accent color on ≤ ~5% of the screen
- Max 2 type families, weights from the approved set only
- Whitespace: section padding ≥ 96px desktop / 48px mobile; nothing touches
  a container edge
- No pure black (#000) or pure white (#FFF) backgrounds on marketing surfaces

## Accessibility (WCAG 2.2 AA)
- ⛔ Text contrast ≥ 4.5:1 (≥ 3:1 for text ≥ 24px); UI component contrast ≥ 3:1
- ⛔ Touch targets ≥ 44×44px with ≥ 8px spacing between adjacent targets
- ⛔ Visible focus state on every interactive element (never `outline: none`
  without a replacement)
- Color is never the only signal (pair with icon, weight, or label)
- Semantic HTML: real `<button>`, `<nav>`, `<main>`, labeled inputs, alt text
- `prefers-reduced-motion` fallback defined for every animation
- Form errors: specific, inline, announced — not just a red border

## Responsive
- ⛔ Holds at 375px, 768px, 1440px with no horizontal scroll or overlap
- Type steps down at mobile (display/h1 drop one scale step)
- Touch-first affordances on mobile: no hover-only interactions
- Images have explicit aspect ratios (no layout shift)

## Content quality
- ⛔ Zero lorem ipsum; all data plausible for the actual product
- Copy in product voice: confident, concrete, no filler ("simply", "just",
  "seamless")
- Numbers formatted for the locale; tabular figures in tables
- Empty, loading, and error states designed — not just the happy path

## Craft details (the Awwwards tier)
- Optical alignment over mathematical (icons/punctuation hang, perceived
  centers)
- Letter-spacing tightened on large display type (−0.02em)
- Consistent radii tier per component class
- Shadows match a single light source and elevation logic
- Transitions on interactive states (nothing snaps instantly except reduced-motion)
- The screen would look at home in a pitch deck with zero edits
