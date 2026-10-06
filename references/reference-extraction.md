# Reference extraction

A reference app is evidence about what works for an audience, never a template. "Like Airbnb" is not a design instruction; it is a pointer to two or three observable decisions that the Airbnb team made and that may or may not transfer to this product. This file turns reference names into principles that can be applied, checked, and refused.

References enter through the brief gate (question 3, screenshots the user pastes, apps named in the README or memory) or are chosen by you when the user gives none. Either way they go through the same pipeline before they influence a direction.

## 1. The pipeline

```
Reference  →  Observation  →  Principle  →  Application  →  Non-copy boundary
(a name)      (what is          (the rule      (where it      (the thing from this
               literally          behind the     lands in       reference that must
               on screen)         observation)   this app)      not appear here)
```

Each step is written down. A reference that stops at the name ("Pinterest for discovery") has not been extracted and may not be used in a direction card.

## 2. Principle categories

Observe in these ten categories. Two to four principles per reference is the useful range; one is a weak reference, five or more means you are describing the whole app, which is copying.

| # | Category | What to observe | Example principle |
|---|---|---|---|
| 1 | Hierarchy | What the eye hits first, second, third; how levels are separated (size, weight, color, space) | "One number dominates; everything else is caption-sized" (Apple Health summary) |
| 2 | Composition | Axis, alignment, symmetry, where the anchor sits, how much of the viewport one item takes | "Asymmetric two-column discovery with uneven item heights" (Pinterest) |
| 3 | Typography | Faces, how many sizes, where display type appears, tabular figures, case | "Title in plain text with no container; properties as small chips below it" (Things) |
| 4 | Imagery | Photo, render, chart, illustration; crop, ratio, bleed, scrim, how much of the screen | "Photography carries the product; chrome is reduced to almost nothing over it" (Airbnb listing) |
| 5 | Color | Count, roles, where the accent is allowed, how semantic color is used | "Neutral surfaces; the only saturated color is money in or out" (Revolut) |
| 6 | Surface | Cards vs open canvas, hairlines vs fills, elevation, grouping devices | "Grouped inset lists, no cards; sections separated by space and a header" (iOS Settings) |
| 7 | Navigation | Tab count, where creation lives, how depth is shown, modal vs push habits | "Three tabs; the primary create action is a header button, not a center tab" (Apple Notes) |
| 8 | Motion | What animates, what never does, durations, gesture-driven vs triggered | "Only the number animates; layout never moves" (Apple Weather) |
| 9 | Interaction | Direct manipulation, swipe actions, long-press, inline editing, undo pattern | "Complete by swipe with an Undo snackbar, no dialog" (Todoist) |
| 10 | Content density | Items per viewport, row height, how much metadata per item | "One listing per viewport on Explore; dense lists only in Trips" (Airbnb) |

## 3. The record

Each reference produces one record in `MOBILE-DESIGN.md` under `references:`:

```yaml
references:
  - source: Airbnb
    principles:
      - type: imagery
        observation: photography fills the card; title and price sit under it in plain text
        principle: imagery carries product meaning, chrome stays out of its way
        application: listing discovery and detail; photo is the first viewport anchor
      - type: content-density
        observation: one listing per viewport on Explore
        principle: discovery is slow and visual, management is dense
        application: Explore shows one place per viewport; Trips is a 56 pt list
    do_not_copy: the card structure (image, title, rating, price in that order), the Explore search pill
  - source: Things
    principles:
      - type: typography
        observation: a task title has no box; properties are small chips below it
        principle: the object is text, not a field
        application: create and edit screens; title as plain text, properties as chips
    do_not_copy: the paper-white palette and the checkbox shape
```

The short form for a direction card is one line per reference: `Airbnb → imagery carries product meaning (discovery screens)`.

## 4. Rules

- **A reference name is never an instruction by itself.** "Make it like Linear" produces an extraction, not a palette.
- **Every principle is observable.** It names something you could point at in a screenshot of the reference. "Feels premium" is not an observation; "one accent color, generous line height, no card borders" is.
- **Every principle states its application** in this product, by screen or by component. A principle with no landing place is dropped.
- **Every reference lists at least one `do_not_copy`.** It is usually the most recognizable thing about that app: its card structure, its signature color, its mascot, its exact onboarding sequence, its icon style.
- **Two references that pull in opposite directions** (Pinterest's asymmetric discovery and iOS Settings' grouped lists) can both be used when they apply to different screens. When they apply to the same screen, pick one and write why under `## Reference principles`.
- **References shape the territory, composition and behavior, not the palette alone.** If after extraction the only thing a reference changed is a hex value, the extraction failed (tell I7).
- **Category standards count as references.** The platform's own first-party app for this kind of screen (Settings, Mail, Photos, Files, Google Tasks, Material 3 samples) is always a legitimate reference and is the default when the user gives none.

## 5. What counts as copying

Prohibited, with or without attribution:

- the exact layout of a screen, or the exact arrangement of components in a section;
- the exact color values or a palette that differs only in lightness;
- the exact illustration style, mascot or icon set;
- the exact interaction sequence of a flow (onboarding, checkout, pairing) step for step;
- the exact screen structure of the reference's home or detail screen;
- a component that is recognizably that app's (Instagram's story ring, Tinder's card stack, Duolingo's owl).

Permitted: the principle behind any of those, applied to this product's content and stated in the record.

## 6. When the user gives no references

Do not ask a second time. Pick two yourself in the brief-gate defaults ("I will take <principle> from <App A> and <principle> from <App B> unless you have others in mind"): one category leader for the product kind, and the platform's first-party app for the dominant screen type. Mark both `(inferred)` in `MOBILE-DESIGN.md`.

## 7. Where the output lands

- `MOBILE-DESIGN.md` → `references:` YAML and the `## Reference principles` prose (one paragraph per reference, in sentences, including any conflicts resolved).
- Direction cards → the `Reference principles:` line (`directions.md` §3).
- Visual territory (`visual-dna.md` §1) → the extracted principles are one of its seven inputs.
- Visual QA → VQ5 and tell I7 check that the principles are visible in the built screens.
