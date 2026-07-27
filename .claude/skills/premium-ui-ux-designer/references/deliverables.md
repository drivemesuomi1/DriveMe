# Deliverable Formats

Templates for each stage of the process. Every deliverable ends with
**Assumptions** (what you guessed) and **Open questions** (what only the user
can decide) when either is non-empty.

## 1. Requirements analysis

Produce a one-page design brief:

```markdown
# Design Brief — <product>
**Positioning:** <one sentence: for WHO, it's the ONLY product that WHAT>
**Primary user & JTBD:** <persona> hires this product to <job> so that <outcome>
**Emotional target:** how the product should make the user feel (3 words max)
**Moments of truth:** the 2–3 interactions where trust is won or lost
**Success metric:** the single number design moves
**Constraints:** platform, brand, technical, regulatory
```

## 2. User journeys

One journey per critical path, as a table:

| Stage | User goal | Touchpoint | Emotion (before→after) | Friction risk | Design opportunity |
|---|---|---|---|---|---|

Mark the moments of truth with **bold**. 5–8 stages max; if a journey needs
more, it's two journeys.

## 3. Information architecture

Mermaid `graph TD` for navigation structure; indented tree for content
hierarchy within a screen. Annotate each top-level node with its purpose in
≤ 6 words. Flag any node deeper than 3 levels — it probably shouldn't be.

## 4. Wireframes

Low fidelity, structure only — grayscale, real hierarchy, placeholder-free
copy. Preferred format: single HTML file per flow using only `--ink-*`
neutrals, boxes, and labels. Each region gets a numbered annotation:

```
[1] Hero — value prop in ≤ 9 words, single CTA. Why: first moment of truth.
```

Fast alternative for chat discussion: ASCII block layout.

## 5. High-fidelity concepts

Self-contained HTML files in `design/NN-screen-name.html`:

- Inline `<style>`, fonts via Google Fonts `<link>` (Inter/Fraunces), no JS
  frameworks — vanilla JS only if the concept needs interaction to be judged.
- Use the tokens from aesthetic.md as CSS custom properties, verbatim.
- Real-feeling content: plausible names, prices, dates, and copy in the
  product's voice. Lorem ipsum is grounds for rejection.
- Responsive: must hold at 375 / 768 / 1440 px. Test all three before
  presenting; screenshot at minimum 375 and 1440.
- Include a hidden HTML comment header: screen name, journey stage it serves,
  and the design intent in 2 sentences.

## 6. Animation specs

One table per screen or component:

| # | Trigger | Element | Property (from → to) | Duration | Easing token | Purpose |
|---|---|---|---|---|---|---|

Plus a `prefers-reduced-motion` row stating the fallback. Any row whose
Purpose cell is weak gets deleted, not reworded.

## 7. Design system

Deliver as `design/design-system.html` — a living style guide page showing:

1. Color tokens with contrast ratios printed next to each text/background pair
2. Type scale specimen
3. Spacing scale visualized
4. Components with all states: default / hover / focus / active / disabled /
   error / loading — a component without states is not done
5. Do/don't pairs for the 3 most abusable patterns

Accompany with a `tokens.css` file containing every custom property.

## 8. Design review

When reviewing existing designs (yours or the user's):

```markdown
## Design Review — <subject>
**Verdict:** <one sentence — ship / revise / rethink>

### Ranked findings
1. 🔴 <blocks trust or task completion> — why it fails → the fix
2. 🟡 <erodes quality perception> — why → fix
3. 🔵 <polish> — why → fix

### What's working (keep)
- <name the strong decisions so they survive revision>
```

Run the review-checklist.md before writing the verdict. Findings without a
proposed fix are not findings.
