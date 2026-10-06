# Directions

A direction is a complete, nameable answer to "what does this app look and feel like, and why". Proposing two or three of them, in parallel, before building anything is how designers avoid the first idea that comes to mind, and the first idea an LLM has is the statistical default. Parallel prototyping produces better and more diverse results than sequential refinement; use it.

## 1. How many, and which

- **Two or three directions.** Never one (no choice), never four or more (the user is not a jury).
- **One direction is always the category standard**: the honest, native-feeling version a good in-house team would ship. It is the safe exit and often the right answer.
- The others differ on the **idea and the territory**, not on the palette alone. Two directions that share the same composition and differ by hue are one direction (tell A5).
- All directions respect the App Read, the quiet constraints and the hard floors. A direction that needs EXPRESSION 9 for a banking app is out of band; do not propose it.

## 2. The pipeline inside Phase 3

```
Dials → Reference extraction → Visual territories → 2 or 3 cards → Visual DNA per card
→ Composition per card → Pre-flight → Present → Pick
```

The user sees only the cards and makes one choice. Everything before the cards is your work and is written into `MOBILE-DESIGN.md` for the chosen one.

Where ideas come from, in this order, with the source written down:

1. **The domain's physical world**: what things in this domain look like (sea water, bank notes, serum, solar panels, a climbing rope, a page of a notebook). Palette, texture and imagery come from here, and so does the first half of the territory.
2. **The audience's moment of use**: on a roof in sunlight, in bed at night, at a checkout counter, in a gym. Contrast, density and type size come from here; often the second half of the territory.
3. **The reference principles** extracted per `reference-extraction.md`: one to four observable principles per reference, applied, not copied.
4. **The platform's own vocabulary**: large titles, grouped lists, sheets, materials on iOS; tonal surfaces, FAB, navigation bar on Android. The category standard leans entirely on this.

Never pull from "what premium apps look like" in the abstract. That path ends in a dark background with one neon accent, or a cream background with a serif and terracotta. Both are now defaults.

## 3. The direction card

Each direction is written as a card, in the user's language, in this exact shape. The lines from Visual territory to Interaction language are the card's Visual DNA in short form (`visual-dna.md` §3); they are what makes two cards visually different rather than differently colored.

```
### <Name, two or three words>
Idea: <one sentence tying the look to the subject or the moment of use>
Visual territory: <real thing from the domain> × <real thing that sets the tone>; not <refused territory>
Reference principles: <App A → principle (screens)> · <App B → principle (screens)>
Dials: EXPRESSION n · MOTION n · DENSITY n
Composition: <default archetype by screen kind; axis; anchor position; whitespace; what repeats and what never does>
Hierarchy: <device per level; what is loud, what is quiet>
Typography: <UI face and role> · <display face and the only places it appears, or "none">
Palette: <role: name #hex> × 4 to 6   (surface, surface-alt, text, text-muted, accent, one semantic if needed)
Imagery: <photo / 3D / illustration / chart / none; treatment; where; where never>
Surface language: <open canvas | grouped lists | cards-to-group; hairlines vs fills; elevation policy>
Shape language: <radius by role; what shares a radius and what does not>
Interaction language: <direct manipulation, swipe actions, undo, haptics, what never animates>
Signature: <the dominant visual idea on signature screens, up to two supporting behaviors, and which screens>
Deliberately not doing: <two or three things this direction refuses, including the nearest slop default and the nearest C-AI composition default>
Best for: <which part of the App Read this serves best>
Risk: <the one way this direction goes wrong>
```

Example, for a solar-inverter companion app:

> ### Noon Light
> Idea: the palette is the roof at noon: white-hot surface, a single warm amber for live production, charcoal text; the live energy flow is the hero of the home screen.
> Visual territory: rooftop at noon × utility meter; not a fintech dashboard
> Reference principles: Apple Weather → only the number animates, layout never moves (Home) · iOS Settings → grouped lists, no cards (System, Device)
> Dials: EXPRESSION 6 · MOTION 5 · DENSITY 4
> Composition: Hero on Home and Device, Dashboard on History, List elsewhere; leading axis; anchor in the top third; generous whitespace on Home, regular elsewhere; nothing repeats as cards
> Hierarchy: one live number by size and position, the flow diagram by position, everything else muted grouped lists
> Typography: system UI font for all controls · tabular grotesk numerals for kWh figures only
> Palette: surface #FAF9F6 · surface-alt #EFECE6 · text #1C1B18 · text-muted #6E6B64 · accent #E8A317 · alert #C8452B
> Imagery: a rendered cutaway of the installed system on Device; no stock photos, no illustration
> Surface language: open canvas on Home; grouped inset lists elsewhere; hairlines, no shadows
> Shape language: controls 10; the render has no container; no card radius exists
> Interaction language: pull-down refresh on Home; swipe to dismiss alerts with Undo; one success haptic on pairing
> Signature: the animated energy-flow diagram on Home, supported by the amber live numeral; nowhere else
> Deliberately not doing: dashboards of cards (C-AI-02), green-means-good gradients, dark mode as default
> Best for: homeowners checking production once a day; installers get the same screens with DENSITY 6 lists
> Risk: amber on white fails contrast for small text, so amber is for fills and numerals only, never body text

## 4. Pre-flight for each card

Before presenting, check every card against `tells-mobile.md` §A and these questions. Fix or drop the card if any answer is no.

- Does the palette come from the subject, with a named source? Is there exactly one accent?
- Is the territory two real things, at least one from the domain, with a `not`? Would it still be true if the accent changed hue (tell I1)?
- Has every reference been extracted (observation, principle, application, non-copy)? Does at least one principle change composition or behavior, not only color (tell I7)?
- Is there one display size, and is hierarchy built with position, weight and color rather than more sizes?
- Is the signature one dominant idea with at most two supporting behaviors, on named screens, and absent from the rest?
- Do the default archetypes differ by screen intent (`screen-archetypes.md` §1)? Is any archetype other than List covering more than half the likely inventory?
- Does the direction keep native chrome unless EXPRESSION is 8 or more?
- Does the posture's component language actually appear in the plan? Android-first at EXPRESSION 1 to 4 means Material filled or outlined fields, pill buttons, 56 dp list items and a top app bar; iOS-first means grouped lists, system sheets and large titles. Name the three components that prove it (tell B17).
- For every form screen in the likely inventory: what object is visible, which input is the hero and with which control, and what consequence is shown live? (`patterns.md` §4b)
- Can every screen in the likely inventory be built in this direction without inventing new tokens?
- Does it survive dark mode and large text, or is the plan for them written?
- Is "deliberately not doing" specific (not "clutter") and does it include the nearest slop default and the nearest C-AI code?
- Is this direction different in territory and composition from the other cards, not only in hue?

## 5. Presenting and choosing

Present the cards in one message, category standard first or last but labeled as such, and end with one line: which card you would choose and why, in one sentence. Then let the user pick. This is a choice between finished options, not a questionnaire. Do not ask follow-up questions about colors, fonts, territory or composition. If the user mixes cards ("palette of A with the hero of B"), merge and re-run the pre-flight once.

In `--autonomous` mode, choose the card that best serves the App Read's audience and context, state the reason, and continue.

## 6. Redesign

With `--redesign`, Phase 0 also inventories what exists: screens, tokens in use (count distinct font sizes, radii, colors), components and their duplicates, the navigation structure, and what users already rely on (labels, positions, gestures). Before any card is written, produce the diagnosis with evidence (counts, screenshots or file:line), not commentary:

```
CURRENT VISUAL DIAGNOSIS
Hierarchy:        strong | weak        <evidence: levels separated by …, or labels as strong as values on n screens>
Composition:      strong | weak | repetitive   <evidence: n of m screens share one archetype; n cards per viewport on Home>
Identity:         strong | weak        <evidence: what survives an accent swap; domain elements present on n screens>
Typography:       strong | weak        <evidence: n distinct sizes; display moments; system-default interchangeable?>
Surface language: strong | generic     <evidence: cards vs canvas; shadow + border + tint counts>
Imagery:          strong | weak        <evidence: source, treatment, stock or placeholder count>
Motion:           appropriate | excessive | weak   <evidence: durations, entrance animations, JS-thread>
```

Then the cards become:

- **Preserve**: keep the structure and the palette; fix hierarchy, spacing scale, type scale, states, and platform mechanics. Dials match existing. Chosen when the diagnosis is mostly strong and the failures are mechanical.
- **Evolve**: keep the navigation and the core components users know; replace the palette or the type system, add the signature element, fix the composition of the screens the diagnosis flagged, remove slop defaults. Dials existing + 1. Chosen when identity or composition is weak but the IA holds.
- **Overhaul**: new direction built from the subject, navigation may change if the Nav Read shows the IA is wrong. Dials existing + 2, never above band. Chosen when composition is repetitive and identity is weak together.

What never changes silently in a redesign: navigation labels users know, the position of the primary action on core screens, form field order and names, destructive-action confirmations, legal and pricing copy. If a card changes any of those, it says so.

## 7. Recording the choice

The chosen card goes into `MOBILE-DESIGN.md` nearly verbatim: the YAML tokens from the palette and type lines, `visual_identity` from the territory line, `references` from the reference principles (expanded to the full records), `visual_dna` from the composition, hierarchy, typography, imagery, surface, shape and interaction lines, `composition` from the composition line, and the prose sections from idea, signature, "deliberately not doing". The rejected cards are listed by name and territory in one line under `## Alternatives considered` so a later session does not re-propose them.
