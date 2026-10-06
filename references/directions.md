# Directions

A direction is a complete, nameable answer to "what does this app look and feel like, and why". Proposing two or three of them, in parallel, before building anything is how designers avoid the first idea that comes to mind, and the first idea an LLM has is the statistical default. Parallel prototyping produces better and more diverse results than sequential refinement; use it.

## 1. How many, and which

- **Two or three directions.** Never one (no choice), never four or more (the user is not a jury).
- **One direction is always the category standard**: the honest, native-feeling version a good in-house team would ship. It is the safe exit and often the right answer.
- The others differ on the **idea**, not on the palette alone. Two directions that share the same layout and differ by hue are one direction.
- All directions respect the App Read, the quiet constraints and the hard floors. A direction that needs EXPRESSION 9 for a banking app is out of band; do not propose it.

## 2. Where ideas come from

Pull from the subject, in this order, and write down the source:

1. **The domain's physical world**: what things in this domain look like (sea water, bank notes, serum, solar panels, a climbing rope, a page of a notebook). Palette, texture and imagery come from here.
2. **The audience's moment of use**: on a roof in sunlight, in bed at night, at a checkout counter, in a gym. Contrast, density and type size come from here.
3. **The reference principles** extracted in the brief gate: one principle per reference app, applied, not copied.
4. **The platform's own vocabulary**: large titles, grouped lists, sheets, materials on iOS; tonal surfaces, FAB, navigation bar on Android. The category standard leans entirely on this.

Never pull from "what premium apps look like" in the abstract. That path ends in a dark background with one neon accent, or a cream background with a serif and terracotta. Both are now defaults.

## 3. The direction card

Each direction is written as a card, in the user's language, in this exact shape:

```
### <Name, two or three words>
Idea: <one sentence tying the look to the subject or the moment of use>
Dials: EXPRESSION n · MOTION n · DENSITY n
Palette: <role: name #hex> × 4 to 6   (surface, surface-alt, text, text-muted, accent, one semantic if needed)
Type: <UI face and role> · <display face and where it appears, or "none">
Hierarchy: <how the eye is led on a typical screen; what is loud, what is quiet>
Signature element: <the one bold move, and on which screens>
Imagery: <photo / 3D / illustration / chart / none, and how it is treated>
Deliberately not doing: <two or three things this direction refuses>
Best for: <which part of the App Read this serves best>
Risk: <the one way this direction goes wrong>
```

Example, for a solar-inverter companion app:

> ### Noon Light
> Idea: the palette is the roof at noon: white-hot surface, a single warm amber for live production, charcoal text; the live energy flow is the hero of the home screen.
> Dials: EXPRESSION 6 · MOTION 5 · DENSITY 4
> Palette: surface #FAF9F6 · surface-alt #EFECE6 · text #1C1B18 · text-muted #6E6B64 · accent #E8A317 · alert #C8452B
> Type: system UI font for all controls · display numerals in a tabular grotesk for kWh figures only
> Hierarchy: one live number first, the flow diagram second, everything else grouped lists
> Signature element: the animated energy-flow diagram on Home; nowhere else
> Imagery: a rendered cutaway of the installed system on the device-detail screen; no stock photos
> Deliberately not doing: dashboards of cards, green-means-good gradients, dark mode as default
> Best for: homeowners checking production once a day; installers get the same screens with DENSITY 6 lists
> Risk: amber on white fails contrast for small text, so amber is for fills and numerals only, never body text

## 4. Pre-flight for each card

Before presenting, check every card against `tells-mobile.md` §A and these questions. Fix or drop the card if any answer is no.

- Does the palette come from the subject, with a named source? Is there exactly one accent?
- Is there one display size, and is hierarchy built with weight and color rather than more sizes?
- Is the signature element one thing, named, on named screens?
- Does the direction keep native chrome unless EXPRESSION is 8 or more?
- Can every screen in the likely inventory be built in this direction without inventing new tokens?
- Does it survive dark mode and large text, or is the plan for them written?
- Is "deliberately not doing" specific (not "clutter") and does it include the nearest slop default?
- Is this direction different in idea from the other cards, not only in hue?

## 5. Presenting and choosing

Present the cards in one message, category standard first or last but labeled as such, and end with one line: which card you would choose and why, in one sentence. Then let the user pick. This is a choice between finished options, not a questionnaire. Do not ask follow-up questions about colors or fonts. If the user mixes cards ("palette of A with the hero of B"), merge and re-run the pre-flight once.

In `--autonomous` mode, choose the card that best serves the App Read's audience and context, state the reason, and continue.

## 6. Redesign

With `--redesign`, Phase 0 also inventories what exists: screens, tokens in use (count distinct font sizes, radii, colors), components and their duplicates, the navigation structure, and what users already rely on (labels, positions, gestures). Then the cards become:

- **Preserve**: keep the structure and the palette; fix hierarchy, spacing scale, type scale, states, and platform mechanics. Dials match existing.
- **Evolve**: keep the navigation and the core components users know; replace the palette or the type system, add the signature element, remove slop defaults. Dials existing + 1.
- **Overhaul**: new direction built from the subject, navigation may change if the Nav Read shows the IA is wrong. Dials existing + 2, never above band.

What never changes silently in a redesign: navigation labels users know, the position of the primary action on core screens, form field order and names, destructive-action confirmations, legal and pricing copy. If a card changes any of those, it says so.

## 7. Recording the choice

The chosen card goes into `MOBILE-DESIGN.md` nearly verbatim: the YAML tokens from the palette and type lines, the prose sections from idea, hierarchy, imagery and "deliberately not doing". The rejected cards are listed by name in one line under `## Alternatives considered` so a later session does not re-propose them.
