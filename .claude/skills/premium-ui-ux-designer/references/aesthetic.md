# Design Language — Premium Scandinavian Luxury

The default visual system for all deliverables. Override only when the user's
brand demands it, and say so when you do.

## Principles

1. **Restraint.** Remove until it breaks, then add one thing back. No gradients
   for decoration, no drop shadows deeper than the elevation they represent,
   never more than one accent color per view.
2. **Air.** Whitespace is the primary luxury signal. When a layout feels flat,
   the first fix is more space, not more decoration.
3. **Material honesty.** Surfaces look like what they are: flat color, subtle
   borders, real photography. No fake glassmorphism, no skeuomorphic chrome.
4. **Quiet confidence.** The brand whispers. Large type set light, small type
   set precise. Nothing blinks, bounces, or begs.

## Typography

Primary families (in order of preference, all free to embed):

- Display/headings: **"Neue Haas Grotesk"** if licensed, else **Inter** with
  `letter-spacing: -0.02em` on sizes ≥ 32px, or **Fraunces** when a serif
  accent suits the brand (e.g. lifestyle, hospitality).
- Body/UI: **Inter** (400/500/600 only — never 700+ for body UI).
- Numeric/data: **Inter** with `font-feature-settings: "tnum"` for tables.

Type scale (1.250 major third, 16px base):

| Token | Size / line-height | Use |
|---|---|---|
| `display` | 61px / 1.05, weight 300 | Hero statements only |
| `h1` | 49px / 1.1, weight 400 | Page titles |
| `h2` | 39px / 1.15, weight 400 | Section titles |
| `h3` | 31px / 1.2, weight 500 | Card/panel titles |
| `h4` | 25px / 1.3, weight 500 | Sub-heads |
| `body-lg` | 20px / 1.5, weight 400 | Lead paragraphs |
| `body` | 16px / 1.6, weight 400 | Default text |
| `small` | 14px / 1.5, weight 400 | Secondary text |
| `caption` | 12px / 1.4, weight 500, letter-spacing 0.06em, uppercase | Labels, eyebrows |

Rules: max 2 families per product; headings sentence case (never all-caps
except `caption`); line length 45–75 characters; drop display/h1 by one step
below 768px.

## Color

Neutral-first. The palette is 90% neutrals, one accent, and semantic colors
used only for their meaning.

```css
:root {
  /* Neutrals — warm gray, not blue-gray */
  --ink-900: #16150F;   /* primary text */
  --ink-700: #44423A;   /* secondary text */
  --ink-500: #75726A;   /* tertiary text, icons */
  --ink-300: #C9C6BE;   /* borders, dividers */
  --ink-100: #EFEDE8;   /* subtle fills, hover */
  --paper:   #FAF9F6;   /* page background — never pure white */
  --surface: #FFFFFF;   /* cards on paper */

  /* Accent — one only; deep forest default, swap per brand */
  --accent:      #1F3D2B;
  --accent-soft: #E8EEE9;   /* accent tint for fills */

  /* Semantic — reserved for meaning, never decoration */
  --positive: #2E6B4F;
  --caution:  #9A6B1F;
  --critical: #8C2F2F;

  /* Dark mode */
  --dark-bg:      #121210;
  --dark-surface: #1C1B18;
  --dark-ink:     #ECEAE4;
}
```

Rules: accent appears on at most ~5% of any screen (primary action, active
state, one brand moment); text on `--paper` uses `--ink-900/700/500` only;
verify every pairing hits 4.5:1 (all of the above on `--paper`/`--surface` do,
except `--ink-300` which is decorative only).

## Spacing & layout

8px base grid; 4px allowed inside dense components only.

Scale: `4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192`.

- Section padding: 96–128px vertical on desktop, 48–64px mobile.
- Card padding: 24–32px. Never less than 16px.
- Content max-width: 1200px marketing, 1440px app shells; text columns max 680px.
- Grid: 12-col / 24px gutter desktop, 4-col / 16px gutter mobile.
- Radii: `2px` inputs/chips, `4px` buttons, `8px` cards, `16px` modals/sheets.
  Pick one tier per component class and never mix within it.
- Shadows (max two tiers): 
  `--shadow-1: 0 1px 2px rgba(22,21,15,.06);`
  `--shadow-2: 0 8px 24px rgba(22,21,15,.10);`

## Motion

Motion communicates causality and spatial continuity — nothing else.

| Token | Duration | Easing | Use |
|---|---|---|---|
| `swift` | 120ms | `cubic-bezier(0.4, 0, 1, 1)` | Hover, press, toggles |
| `standard` | 240ms | `cubic-bezier(0.2, 0, 0, 1)` | Reveals, panel slides, fades |
| `entrance` | 400ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Page/modal entry, hero reveals |
| `emphasis` | 600ms | `cubic-bezier(0.16, 1, 0.3, 1)` | One-time brand moments only |

Rules: animate `transform` and `opacity` only (never layout properties);
stagger list entrances 30–50ms per item, cap at 6 items; exits run at ~70% of
entrance duration with the accelerating curve; everything must respect
`@media (prefers-reduced-motion: reduce)` — swap to opacity-only ≤ 100ms.

An animation spec is complete when it states: **trigger → property →
from/to → duration → easing → purpose.** If you can't state the purpose,
delete the animation.

## Imagery & iconography

- Photography: natural light, muted grades, negative space for type overlay.
  No stock-photo smiles, no saturated HDR.
- Icons: 1.5px stroke, 24px grid, rounded caps (Lucide or Phosphor Light
  match this). Never mix filled and outlined sets in one view.
- Illustration only if the brand demands warmth; keep it monoline in `--ink-700`.
