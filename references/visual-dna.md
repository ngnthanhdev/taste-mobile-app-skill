# Visual DNA

Tokens say which values exist. Visual DNA says how they are used, and what makes this app recognizably itself rather than a correctly tokenized default. It sits between the chosen direction and the build: every screen is checked against it in Visual QA, and it is written into `MOBILE-DESIGN.md` so later sessions and `mobile-app-studio` hold the same identity.

Visual DNA is derived by you from the App Read, the reference principles and the dials. The user is never asked to fill it in; they pick between directions that already carry it.

## 1. Visual territory

A **visual territory** is the cultural place this app's visuals come from, written as two real-world things joined by `×`. It replaces vibe words, which are not design decisions.

| Not a territory | A territory |
|---|---|
| modern, premium, clean, beautiful, minimal | contemporary fashion editorial × private journal |
| professional, trustworthy | technical instrument × laboratory notebook |
| fun, friendly, engaging | children's picture magazine × tactile wooden toy |
| sleek, high-tech | car dashboard at night × paper service manual |
| warm, calm | ceramics studio × a well-set kitchen table |

Rules for a territory:

- Both halves name things that exist in the world and have a look you could photograph. At least one comes from the product's domain (what the warehouse, the clinic, the sea, the inverter actually looks like).
- Derive it from seven inputs, in this order: product category, audience, the content the app shows, the extracted reference principles, existing brand, the emotional target (one phrase: "quiet confidence before a transfer", "momentum at the end of a workout"), and how the product behaves (daily glance vs long sessions, one-handed vs two).
- It determines composition, typography, imagery, surfaces, shape language, interaction and motion. It does not set hex values directly; the palette still comes from the subject (`directions.md` §2).
- It is **not a dial** and gets no number. Dials bound how far the territory may be expressed (chrome lags content, density by context); the territory says in which direction.
- It excludes something. Write `not:` with one or two adjacent territories this app refuses ("not a fintech dashboard, not a wellness app").

Each direction card carries its own territory; two cards with the same territory and different palettes are one direction (tell A5).

## 2. Adjectives become observable rules

**Aesthetic adjectives are not design decisions. Every adjective in the brief, the mood line or a direction card must map to observable visual or interaction rules.** If it cannot, drop the adjective.

Bad: "Make it premium." Good:

```
premium is expressed through:
- one accent, used on fewer than 5% of the viewport
- line height 1.5 or more on body text; 24 pt or more between sections
- photography with room around it, never cropped tight into cards
- display and body differ by weight and size, not by face count
- no decorative surfaces: no gradient fills, no glow, no glass on content
- spacing from the scale only, no "visual" nudges
```

Bad: "Make it playful." Good:

```
playfulness comes from:
- an asymmetric anchor on discovery screens (image or type off-center)
- illustration with a consistent hand, drawn for this product, on at most three screens
- tactile pressed states (scale 0.96, 120 ms) and spring on sheet open
- image crops that vary by content (portrait, square, wide), not one ratio
- short copy with concrete verbs; no exclamation marks
```

Translations for common adjectives, with the slop default each one tends to collapse into:

| Adjective | Observable rules | Collapses into (avoid) |
|---|---|---|
| calm | one thing per viewport, muted text ramp, motion only on state change, no badges | beige + serif (A2) |
| trustworthy | tabular figures, explicit confirm steps, labels always visible, neutral surfaces, semantic color only for money or risk | navy gradient header with a balance card |
| technical | dense lists, monospace or tabular numerals for values, hairlines not cards, units everywhere | dark mode with neon accents |
| warm | photography of real people or materials, rounded controls (not everything), generous line height, copy in second person | cream + terracotta (A2) |
| bold | one oversized display element per screen, high contrast, full-bleed imagery, chrome nearly invisible | gradient + glass + 3D |
| friendly | illustration with one hand, 56 pt targets, one success moment, plain language | emoji icons (B1), mascot on every screen |
| luxurious | few elements, lots of air, one typeface pairing, photography with scrim only where text needs it | gold accents, serif everything, black backgrounds |

## 3. The ten dimensions

Every direction, and the locked `MOBILE-DESIGN.md`, answers these ten. One or two lines each, in observable terms.

| Dimension | The question it answers | Example (journaling app) | It is not |
|---|---|---|---|
| composition | Default archetype, axis, where anchors sit, whitespace policy | editorial on Today, list on Archive; leading axis; one entry per viewport | a list of components |
| hierarchy | How the first three levels are separated | level 1 by size and position, level 2 by weight, level 3 by muted color; never by boxes | "clear hierarchy" |
| typography | Faces and roles, display moments, numerals, case | system UI face; one serif display for entry titles only; sentence case; tabular dates | a font name alone |
| imagery | What kind, treatment, where, where never | user photos full-bleed at the top of an entry with a bottom scrim; none elsewhere | "high-quality images" |
| color | Count, roles, where the accent may appear, semantic rules | paper surface, ink text, one moss accent for the primary action and today's date; danger only on delete | a palette (that is `colors:`) |
| surfaces | Cards vs canvas, hairlines vs fills, elevation policy | open canvas; cards only for the three memory prompts; hairline dividers | "minimal shadows" |
| shapes | Radius by role, whether imagery and controls share a radius, any signature shape | controls 10, sheet platform, images 0 (they bleed); no universal radius | one radius value |
| iconography | Family, weight, size, where icons are allowed | SF Symbols regular; only in chrome and on the four tab items; none in content rows | "consistent icons" |
| motion | What animates and what never does, durations, gesture-driven or not | entry opens with a shared-element photo, 250 ms; nothing else animates beyond pressed states | a MOTION number (that is a dial) |
| interaction | Direct manipulation, swipe actions, undo, haptics vocabulary | swipe to archive with Undo; long-press to pin; one success haptic when an entry is saved | "intuitive" |

## 4. Content earns visual weight

Visual prominence must correspond to product importance.

Do not make something large because it fills space, because it looks premium, because it balances the layout, or because the component library has a large variant.

Make it large because the user needs it, because it is the subject, because it is the current task, or because it carries the primary decision.

The test is per screen: name the largest element and write the product reason for its size in the screen inventory's hierarchy column. "Hero image because discovery is visual" passes. "Hero card because the home needs a hero" fails, and the element shrinks to the size its importance earns.

## 5. One dominant idea, up to two supporting behaviors

Each screen has **one dominant visual idea**, and up to **two supporting visual behaviors** that serve it. Everything else stays quiet and platform-native. This replaces the stricter "one bold move" rule: a dominant idea often needs a supporter to read as intentional rather than as a single decoration.

```
Dominant:    full-bleed photography at the top of the detail screen
Supporting:  oversized title set over the photo's bottom edge
Supporting:  the photo scales slightly on pull-down (MOTION 5+)
Quiet:       everything below the fold is a grouped list with system type
```

The failed version stacks expressive devices with no dominant: gradient + glass + 3D render + parallax + huge type + animated particles. If you cannot say which one is dominant, there is none. If a supporting behavior would still look right with the dominant removed, it is a second dominant; cut it.

The dominant idea is usually the signature element on signature screens and something quieter (a typographic title, a chart, the hero input of a form) elsewhere. An app where every screen's dominant idea is the signature element has no signature (tell I5).

## 6. Recording

```yaml
visual_identity:
  territory: contemporary fashion editorial × private journal
  emotional_target: a quiet place to write at the end of the day
  not: a productivity tracker, a social feed

visual_dna:
  composition: editorial on Today (one entry per viewport, leading axis); list on Archive and Settings; anchors sit top-left, never centered on content screens
  hierarchy: level 1 by size and position, level 2 by weight, level 3 by muted color; no boxes for hierarchy
  typography: system UI face; one serif display for entry titles only; sentence case; tabular figures for dates
  imagery: the user's photo full-bleed at the top of an entry with a bottom scrim; no stock, no illustration
  color: paper surface, ink text, one moss accent on the primary action and today's date; danger only on delete
  surfaces: open canvas; hairline dividers; cards only around the three memory prompts
  shapes: controls 10, sheet platform default, images 0 and bleeding; no universal radius
  iconography: SF Symbols regular, chrome and tab items only; none in content rows
  motion: shared-element photo on entry open, 250 ms; number and date changes animate; nothing else
  interaction: swipe to archive with Undo; long-press to pin; one success haptic on save
```

The prose section `## Visual DNA` in `MOBILE-DESIGN.md` expands each line to a sentence or two with the reason, so that a later session can tell a deliberate choice from an accident.

## 7. Checks

Visual DNA is checked, not admired: tells I1 to I7 in `tells-mobile.md` and VQ5 to VQ7 in `visual-qa.md`. The quickest self-test is I1: change the accent token to another hue in your head. If the app would still be the same app, the identity lives in the accent only, and the DNA has not been applied.
