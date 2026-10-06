# Visual QA

The second self-check pass in Phase 7, after the mechanical pass and before the final report. It does not ask "does this look good"; no model is trusted to judge taste from a screenshot. It asks ten observable questions per screen, compares the answers with what `MOBILE-DESIGN.md` committed to, and quotes evidence (a screenshot region, a file:line, or a count). Then everything found is fixed once, and the pass is not repeated.

## 1. Where it runs

```
BUILD
 ↓
Mechanical QA   types · routes vs Nav Read · safe areas · keyboard · sheets · dialogs
                · states · the S-type grep block in tells-mobile.md and the stack file
 ↓
Visual QA       VQ1 to VQ10 · first viewport test · tells H and I (V and C types)
 ↓
Fix once        hard fails and identity fails fixed; the rest noted
 ↓
Final report
```

Visual QA runs against screenshots when a simulator or device is available, and against the code plus the inventory when it is not. In the second case, say so in the report and mark the V-type answers as "from code".

## 2. The ten questions

Answer each per screen, in one line, with evidence. The fail condition is binary.

| # | Question | How to answer | Fails when | Tells |
|---|---|---|---|---|
| VQ1 | **Focal point.** What is the first visual anchor? | Name one element and its viewport position | you name two, or none, or it differs from the inventory's focal point | H7, H8, C-AI-12, C-AI-13 |
| VQ2 | **Hierarchy.** Can the first three levels be identified, and by which device? | List level 1, 2, 3 with the device for each (position, size, weight, color, space) | two levels share a device and size only separates them; or labels are as strong as values | B12, C-AI-10 |
| VQ3 | **Composition.** Which archetype is this, and does the screen follow it? | Name the archetype from the inventory; check its hierarchy order and anti-patterns in `composition.md` §2 | the archetype in code differs from the inventory, or an archetype anti-pattern is present | H1, H3, C-AI-03 |
| VQ4 | **Repetition.** How many equivalent containers and repeated section grammars? | Count cards per viewport and sections sharing a grammar | over the limits in `composition.md` §4 | H1, H2, H3, B3 |
| VQ5 | **Identity.** What makes this screen specific to this product? | Name one element and the DNA dimension it expresses | nothing can be named, or only the accent color | I1, I3 |
| VQ6 | **Domain grounding.** Which visual element comes from the actual domain? | Name it: the object, the photo, the chart, the unit, the real copy | nothing from the domain is visible | I2, A6 |
| VQ7 | **Signature.** Is the declared signature visible where the inventory says, and absent where it does not? | Compare with the Signature column | missing on a signature screen, or present on a non-signature screen | I4, I5 |
| VQ8 | **Competition.** Are several elements fighting for primary attention? | Count display-size or full-bleed elements | more than one dominant, or more than two supporting | H8, C-AI-13 |
| VQ9 | **CTA weight.** Does the primary action's visual weight match its importance? | Name the primary action and compare with the number of filled buttons and its position | more than one filled button, or a filled CTA on a screen with no decision, or the decision is not in the thumb zone | H10, C-AI-06 |
| VQ10 | **Genericity.** Could this screen be dropped into another app unchanged? | Replace the app name and accent in your head and answer honestly | yes | I1, I6, H9 |

## 3. The first viewport test

For every tab root and every signature screen (other screens optional), at the initial viewport with no scroll:

```
FIRST VIEWPORT: <screen>
anchor:    <element, position>
task:      <what the user is here to do>
identity:  <the one thing that could only be this app>
next:      <the next action and where it is>
verdict:   pass | flag (<which line failed>)
```

Flag when any line is empty, when the purpose needs a scroll to become clear without a written product reason, or when the viewport is `header, subtitle, card, card, card` or `greeting, stat row, card list`.

## 4. Evidence format

One block per screen in the self-check output:

```
VISUAL QA: Home (Hero)
VQ1 focal: live kW figure, top third (home.tsx:41)            pass
VQ2 levels: 1 number (size+position) · 2 flow diagram (position) · 3 today total (weight)   pass
VQ3 archetype: Hero as inventoried; no stats row               pass
VQ4 repetition: 0 cards, 1 section grammar                     pass
VQ5 identity: flow diagram in amber from the roof-at-noon palette   pass
VQ6 domain: kW and kWh with comparison to yesterday            pass
VQ7 signature: flow diagram present (signature screen)         pass
VQ8 competition: 1 dominant (number), 1 supporting (diagram)   pass
VQ9 CTA: no filled button; the screen has no decision          pass
VQ10 generic: no                                               pass
FIRST VIEWPORT: anchor kW figure · task check production · identity flow diagram · next tap an alert   pass
```

Counts and file:line references are quoted, never summarized as "looks fine".

## 5. Fix once

Triage every fail into one of two bins and act on it in a single pass:

- **Fix now:** VQ1 (no or wrong anchor), VQ3 (wrong archetype or an anti-pattern), VQ4 (over the repetition limit), VQ7 (signature missing or overused), VQ9 (CTA weight wrong), VQ10 (yes), a flagged first viewport on a tab root. These change what the screen is; a hand-off with them open is not finished.
- **Note for the audit:** VQ2 device choices, VQ5 and VQ6 when the element exists but is weak, non-root first viewport flags. List them in the delivery note for `mobile-app-studio`.

After the fixes, re-run only the questions that failed, quote the new evidence, and stop. No second polish loop.

## 6. What Visual QA is not

- Not a score. No screen gets a number out of ten.
- Not a VLM judgement. "Does this look professional" is never asked of a model or of a screenshot.
- Not a redesign. If more than half the inventory fails VQ3 or VQ10, the problem is in `MOBILE-DESIGN.md` (composition defaults or DNA) and the fix is there, reported as such, not screen by screen.
- Not a loop. One pass, one fix round, one report.

## 7. The Visual QA contract

`MOBILE-DESIGN.md` carries a `## Visual QA contract` section written in Phase 4 and 5: the per-screen archetype, focal point and signature from the inventory, the app's repetition limits, and the identity element the app relies on. Visual QA compares against that contract rather than against taste, which is what makes it checkable by a later session and by `mobile-app-studio`.
