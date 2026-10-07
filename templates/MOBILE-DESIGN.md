---
# MOBILE-DESIGN.md
# The design source of truth for this app. Written by taste-mobile-app-skill, read by every
# later session and by mobile-app-studio during audits. Tokens live in this front matter so
# tools can read them; the reasoning lives in the prose below. Fields marked (inferred) were
# not confirmed by the user and may be corrected; a re-run refreshes this file and reports
# the delta instead of regenerating it.
#
# Schema 2 adds visual_identity, references, visual_dna and composition. A schema 1 file is
# still valid input: the skill reads it, keeps every decision, infers the new blocks from the
# existing direction and marks them (inferred) until confirmed. See SKILL.md Phase 0.
version: 2
updated: YYYY-MM-DD
stack: expo | flutter | swiftui
platforms:
  ios: first-class
  android: first-class | best-effort | none
  web: none
posture: unified-brand | ios-first | android-first | per-platform-native
dials:
  expression: 4   # reason
  motion: 4       # reason
  density: 4      # reason

# What this app looks like, culturally. Two real-world things joined by ×, never adjectives.
visual_identity:
  territory: <thing from the domain> × <thing that sets the tone>
  emotional_target: "<one phrase: what the user should feel at the core moment>"
  not: <one or two adjacent territories this app refuses>

# References as principles, never as templates (references/reference-extraction.md).
references:
  - source: <App>
    principles:
      - type: hierarchy | composition | typography | imagery | color | surface | navigation | motion | interaction | content-density
        observation: <what is literally on the reference's screen>
        principle: <the rule behind it>
        application: <where it lands in this app>
    do_not_copy: <the recognizable thing from this reference that must not appear here>

# How the tokens are used (references/visual-dna.md §3). One or two observable lines each.
visual_dna:
  composition: <default archetype(s) by screen kind; axis; where anchors sit>
  hierarchy: "<device per level: position, size, weight, color, space>"
  typography: <faces and roles; display moments; numerals; case>
  imagery: <kind, treatment, where, where never>
  color: <count, roles, where the accent may appear, semantic rules>
  surfaces: "<open canvas | grouped lists | cards-to-group; hairlines vs fills; elevation policy>"
  shapes: <radius by role; whether images and controls share a radius>
  iconography: <family, weight, where icons are allowed and where not>
  motion: <what animates, what never does, durations>
  interaction: <direct manipulation, swipe actions, undo, haptic vocabulary>

# Screen composition defaults (references/composition.md). Per-screen values live in the inventory.
# allowed / prohibited are a draft in Phase 4 and are confirmed in Phase 5 after the sameness check.
composition:
  default_archetype: "<hero | editorial | canvas | feed | dashboard | focused-task | list | immersive>"
  allowed: [<archetypes this app uses>]
  prohibited: [<archetypes this app never uses, with the reason in prose>]
  repetition_limits: "<cards per viewport>; <sections sharing one grammar>; <filled buttons per screen>"

colors:
  surface: "#FFFFFF"
  surface-alt: "#F3F2EE"
  text: "#1A1A1A"
  text-muted: "#6B6B6B"
  accent: "#0A7AFF"      # source: <where this color comes from in the subject>
  danger: "#C8452B"
  # dark mode variants are required before build; list them under colors-dark
colors-dark:
  surface: "#121212"
  surface-alt: "#1C1C1E"
  text: "#F2F2F2"
  text-muted: "#9A9A9A"
  accent: "#3B8EFF"
  danger: "#E0604A"
type:
  ui-family: system          # SF / Roboto / platform default unless the direction says otherwise
  display-family: none       # or a named face, and the only places it appears
  scale:                     # at most five even sizes, line heights fixed
    caption: { size: 12, line: 16 }
    body:    { size: 14, line: 20 }
    body-lg: { size: 16, line: 22 }
    heading: { size: 20, line: 26 }
    display: { size: 24, line: 32 }
  dynamic-type: true
spacing: [4, 8, 12, 16, 24, 32, 40, 48]
radius:
  control: 10
  card: 16
  sheet: platform             # iOS system; Material 28
elevation:
  flat: 0
  raised: 1
  overlay: 3
icons:
  family: sf-symbols | material-symbols | phosphor | lucide
  weight: regular
motion:
  durations: { fast: 150, base: 200, slow: 300 }
  reduced-motion: honored
---

# <App name> design direction

## App Read

`APP READ: … platforms: … posture: … inferred: …`

Mood: <three adjectives>, not <one>. Each adjective is translated into observable rules under Visual DNA; the adjectives themselves decide nothing.

## Visual territory

`<territory>`, because <the domain thing> is what the content looks like and <the tone thing> is how the audience meets it. Not <refused territories>, because <reason>. Emotional target: <phrase>, at <the core moment>.

## Reference principles

One paragraph per reference, in sentences: what was observed, the principle, where it applies in this app, and what is deliberately not copied. Where two references pulled in different directions on the same screen, which one won and why.

## Visual DNA

Each line of the `visual_dna` block, expanded to a sentence or two with its reason, so a later session can tell a deliberate choice from an accident.

### Composition
### Hierarchy
### Typography
### Imagery
### Surfaces
### Shapes
### Iconography
### Motion
### Interaction

## Composition system

Default archetype and the archetypes in use, by screen kind. Axis policy (leading everywhere except single-message screens). Repetition limits for this app and the reason for any that differ from the defaults in `composition.md` §4. The first-viewport commitment for each tab root: anchor, task, identity, next action.

## Direction: <name>

**Idea.** One sentence tying the look to the subject or the moment of use.

**Hierarchy.** How the eye moves on a typical screen: what is loud (the one display element), what is quiet (labels, metadata, chrome). Hierarchy is built with position, weight, color and space; the five sizes above are the only sizes.

**Imagery.** Photo / product render / chart / typography, how it is treated (full-bleed, framed, with scrim), and where it appears. What is never used (stock, blobs, emoji).

## Signature

The one dominant visual idea on signature screens, its up to two supporting behaviors, and the screens that carry it. Every other screen has a quieter dominant idea named in the inventory.

## Chrome

Native header, tab bar and transitions, tinted with the accent (EXPRESSION < 8). Or, if 8+, what is custom and how insets, pressed states and reduced motion are handled.

## Copy voice

Tone in one line; CTA verbs; what the app never says.

## Deliberately not doing

Two or three things this direction refuses, including the nearest slop default and the nearest composition default (C-AI code).

## Alternatives considered

<Name A> (territory …): one line on why not. <Name B> (territory …): one line on why not.

## Nav Read

```
NAV READ
platforms:
tabs (n):
routes:
entry points:
sheets:
modals:
full-screen groups:
deep links:
android back:
max taps to any core screen:
```

## Screen inventory

| Screen | Purpose | Archetype | Focal point | Hierarchy | Primary action | Signature | Content strategy | Surface strategy | States (L/E/Err/P) | Keyboard plan | Permissions |
|---|---|---|---|---|---|---|---|---|---|---|---|

Example row: `Home · discover today's recommendations · editorial · hero image, top · image > title > metadata > save · save · oversized title crossing the image edge · image-first, one item per viewport · open canvas, no cards · L skeleton of one item / E first-run prompt / Err cached + retry / P · n/a · none`.

Above eight screens, replace the table with one block per screen in the same field order (`patterns.md` §12). End the inventory with the sameness check result and the confirmed `composition.allowed` / `composition.prohibited` lists.

## Flow decisions

- Onboarding: <zero slides | n screens, each collecting …>, reason.
- Sign-in timing: <after first value moment at …>, reason.
- Permissions: <permission> on <trigger> with pre-prompt <text>, decline path <…>.
- Success moment: <where>, <what happens>, nowhere else.

## Visual QA contract

What Phase 7's visual pass compares against (`visual-qa.md` §7): the archetype, focal point and signature per screen (from the inventory), the repetition limits above, the identity element each tab root relies on, and the first-viewport commitments. Anything the build may not change without updating this file first.

## Rule exceptions

`Breaking <rule> because <goal from the brief>` lines, one per exception. Empty is the expected state.

## Change log

- YYYY-MM-DD: created by taste-mobile-app-skill (schema 2).
