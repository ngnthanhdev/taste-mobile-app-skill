# Taste Mobile App Skill

> A Claude Code skill that decides what a mobile app looks and feels like **before** the first screen is written, then builds the screens so they do not look generated.

Most AI-built mobile UI looks the same because, given a vague brief, the model picks the statistically safest layout: an indigo gradient, five tabs with a center button, every screen a stack of white cards, "Welcome back, John 👋". Banning that produces a second failure: correct tokens, native mechanics, no slop, and still no identity, because every screen was assembled from the same components in the same order. Adjectives fix neither. A specific target does: who uses the app and when, what the subject looks like in the physical world, principles extracted from two or three references, a visual territory, a composition system, and a design file that is locked before any code.

This skill is the **front half** of [mobile-app-studio](https://github.com/ngnthanhdev/mobile-app-studio). It produces the direction, the navigation plan and the screens. mobile-app-studio then runs the app on a device, audits it against the same `MOBILE-DESIGN.md`, and fixes what it finds.

Works with **Expo / React Native, Flutter and SwiftUI**.

## What it does

| # | Phase | Output |
|---|---|---|
| 0 | Sniff the stack and the repo | Detected stack, tokens, components, existing `MOBILE-DESIGN.md` |
| 1 | App Read | One block: app kind, audience and context, vibe, platforms, posture, what was inferred |
| 2 | Brief gate | At most one round of at most three product questions, each with a default. Never aesthetic questions |
| 3 | Dials, references, territory, directions | Three dials (expression, motion, density, baseline 4/4/4); references extracted into principles; a visual territory per candidate; two or three direction cards carrying visual DNA and composition, one of them the honest category standard. The user picks one |
| 4 | Design lock | `MOBILE-DESIGN.md` (schema 2) at the project root: tokens, identity, references, visual DNA and composition as YAML, reasoning as prose. Incomplete DNA or composition blocks the build |
| 5 | Navigation, archetypes and flows | Nav Read (tabs, containers, sheets, deep links, back rules) and a screen inventory with archetype, focal point, hierarchy, surface strategy and four states per screen |
| 6 | Build | Content before components: archetype, focal point, hierarchy, DNA, tokens, then platform components, with safe area, sheets, dialogs and keyboard handled per platform |
| 7 | Two QA passes and hand-off | Mechanical QA (grep for slop tells, layout-mechanics checklist with evidence, route-tree diff) then Visual QA (ten observable questions, first viewport test); fix once; hand off to mobile-app-studio |

## The ideas behind it

- **Infer before you ask, then ask once.** The question round is bounded (one round, three questions, defaults as assertions) so it never becomes an interview loop, and it only asks about the product. Aesthetics are proposed, not asked.
- **Every choice traces to the subject.** Palette from the domain, hero from real content, density from the moment of use.
- **References become principles, not copies.** Each reference is extracted into observable principles with an application and a non-copy boundary.
- **Aesthetic adjectives are not design decisions.** "Premium" and "playful" become observable rules or are dropped. A visual territory (two real-world things joined by ×) replaces vibe words.
- **Content before components.** Task, hierarchy, anchor, composition, interaction, then components. Reuse behavior, not composition.
- **Content earns visual weight.** Nothing is large because it fills space.
- **One dominant visual idea per screen, up to two supporting behaviors.** Expressiveness is a budget.
- **Screens are composed, not assembled.** Eight composition archetypes mapped from screen intent; repetition limits; composition anti-patterns (C-AI codes) as review criteria.
- **Chrome lags content.** Headers, tab bar and transitions stay native until the expression dial reaches 8.
- **Mechanics are not taste.** Safe areas, sheets, dialogs and keyboard follow numbered rules (R-SA, R-BS, R-DL, R-KB) with the exact API per stack.
- **States are part of the design.** Loading, empty, error and populated, every screen.
- **Rules can be broken with a written reason**, and the user's brief always wins over the banlist.
- **Checks are deterministic.** The skill never asks a model whether something "looks good"; it greps, counts and measures, and quotes the output. Visual QA asks ten observable questions against the commitments in `MOBILE-DESIGN.md`, not for a taste score.

## Install

```bash
git clone https://github.com/ngnthanhdev/taste-mobile-app-skill.git ~/.claude/skills/taste-mobile-app-skill
```

For one project only:

```bash
git clone https://github.com/ngnthanhdev/taste-mobile-app-skill.git .claude/skills/taste-mobile-app-skill
```

Restart Claude Code or start a new session.

## Usage

```text
/taste-mobile-app-skill a habit tracker for busy people, iOS and Android
/taste-mobile-app-skill design the onboarding and home for this repo
/taste-mobile-app-skill --direction-only give me a visual direction for this app
/taste-mobile-app-skill --redesign make this look less generated
/taste-mobile-app-skill --autonomous --stack flutter a companion app for a solar inverter
```

| Flag | Effect |
|---|---|
| `--direction-only` | Stop after `MOBILE-DESIGN.md` |
| `--autonomous` | Skip the question round, print assumptions, mark inferred fields |
| `--redesign` | Inventory the existing app first; propose preserve / evolve / overhaul |
| `--stack expo\|flutter\|swiftui` | Force the stack on an empty or ambiguous repo |

Typical pairing:

```text
/taste-mobile-app-skill <brief>        # direction, nav, screens
/mobile-app-studio                      # device audit and fixes against MOBILE-DESIGN.md
```

## Repository layout

```text
taste-mobile-app-skill/
├── SKILL.md                      # the phases and ground rules
├── README.md
├── LICENSE
├── references/
│   ├── brief-gate.md             # App Read, the three questions, Ask vs Decide, autonomous mode
│   ├── reference-extraction.md   # reference → observation → principle → application → non-copy boundary
│   ├── dials.md                  # expression / motion / density, inference, category bias, dominant idea
│   ├── visual-dna.md             # visual territory, adjectives to observable rules, ten DNA dimensions
│   ├── directions.md             # how to write and present two or three direction cards; redesign diagnosis
│   ├── composition.md            # composition variables, eight archetypes, C-AI anti-patterns, first viewport test
│   ├── screen-archetypes.md      # screen intent to archetype; reuse behavior, not composition
│   ├── tells-mobile.md           # the mobile slop catalog (A to I) with check types and a grep block
│   ├── layout-mechanics.md       # safe area, sheets, dialogs, keyboard rules with IDs and numbers
│   ├── navigation.md             # container decision tree and the Nav Read
│   ├── patterns.md               # onboarding, sign-in, permissions, states, success moment, forms as tasks
│   ├── visual-qa.md              # the ten visual QA questions, first viewport test, fix once
│   ├── stack-expo.md             # visual implementation contract + Expo / React Native APIs for every rule
│   ├── stack-flutter.md          # visual implementation contract + Flutter APIs for every rule
│   └── stack-swiftui.md          # visual implementation contract + SwiftUI APIs for every rule
├── templates/
│   └── MOBILE-DESIGN.md          # the durable design file, schema 2
└── examples/
    └── warehouse/                # a full run: MOBILE-DESIGN.md, Expo source, simulator screenshots
```

## Example

[`examples/warehouse`](examples/warehouse) is one complete run on an empty repo: a warehouse app, Expo, Android-first, direction "Nhãn đen" (shipping label × factory kanban board). It shows the locked `MOBILE-DESIGN.md` with its 15-screen inventory and change log, the screens that Phase 6 built, and what the two Phase 7 passes found and fixed.

## Customising

- **House rules**: add rows to `references/tells-mobile.md` (keep numbering stable) and to mobile-app-studio's `common-findings.md` so both skills enforce them. Composition rules go in `references/composition.md` §3 as new C-AI codes.
- **Existing projects**: a schema 1 `MOBILE-DESIGN.md` is still read. The skill keeps every decision, infers the schema 2 blocks (identity, references, visual DNA, composition), marks them `(inferred)`, and upgrades the version only once they are confirmed.
- **Type scale, radius, spacing**: edit the defaults in `templates/MOBILE-DESIGN.md`; both skills read the project's file at run time.
- **Category bias**: `references/dials.md` §5.

## Credits

Patterns were studied from, and are credited to: [taste-skill](https://github.com/Leonxlnx/taste-skill) (brief inference, dials, pre-flight), [impeccable](https://github.com/pbakaus/impeccable) (bounded question rounds, category-standard option, native references), [draftbit/mobile-taste-skill](https://github.com/draftbit/mobile-taste-skill) (App Read, chrome lags content, tells catalog, Nav Read), [RubenGlez/mobile-design](https://github.com/RubenGlez/mobile-design) (Ask vs Decide, output contract), and [google-labs-code/design.md](https://github.com/google-labs-code/design.md) (the token-plus-prose file shape). Platform rules come from Apple's Human Interface Guidelines, Android developer documentation and the Material 3 sources. Flow evidence from Nielsen Norman Group, Baymard and Apple.

## Changelog

**0.2.1** (2026-10-07)

Updated: `stack-expo.md` for Expo Router 57 (vendored React Navigation import paths, `useBottomTabBarHeight` from `expo-router/tabs`, `usePreventRemove` from `expo-router/react-navigation`, confirm-discard via `useNavigation().dispatch`), keyboard-controller runs in Expo Go on SDK 57, modal top inset per platform, tab scene bottom offsets, npm 11 install recovery and the Reanimated 4 Babel plugin. Verified on a simulator during the warehouse-app test run.

**0.2.0** (2026-10-06)

Added: reference extraction, visual territory, visual DNA, composition system with eight archetypes and C-AI anti-patterns, screen archetypes, visual QA with the first viewport test, tells groups H (composition) and I (identity), MOBILE-DESIGN schema 2 with migration from schema 1.
Updated: brief gate (references as principles), directions (territory, DNA lines, pipeline, redesign diagnosis), screen inventory columns, build order (content before components), QA as two passes with a single fix round, dials §6 (one dominant idea, up to two supporting behaviors), stack files (visual implementation contract).
Preserved: navigation, platform mechanics, stack-specific implementation rules, deterministic checks, the ask/decide philosophy and the one bounded question round.

**0.1.0** (2026-10-06)

First release: brief gate, dials, directions, tokens, navigation, layout mechanics, patterns, tells A to G, stack references for Expo, Flutter and SwiftUI.

## License

[MIT](LICENSE) © ngnthanhdev
