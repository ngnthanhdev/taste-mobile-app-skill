# Taste Mobile App Skill

> A Claude Code skill that decides what a mobile app looks and feels like **before** the first screen is written, then builds the screens so they do not look generated.

Most AI-built mobile UI looks the same because, given a vague brief, the model picks the statistically safest layout: an indigo gradient, five tabs with a center button, every screen a stack of white cards, "Welcome back, John 👋". Adjectives do not fix this. A specific target does: who uses the app and when, what the subject looks like in the physical world, two or three reference principles, and a token file that is locked before any code.

This skill is the **front half** of [mobile-app-studio](https://github.com/ngnthanhdev/mobile-app-studio). It produces the direction, the navigation plan and the screens. mobile-app-studio then runs the app on a device, audits it against the same `MOBILE-DESIGN.md`, and fixes what it finds.

Works with **Expo / React Native, Flutter and SwiftUI**.

## What it does

| # | Phase | Output |
|---|---|---|
| 0 | Sniff the stack and the repo | Detected stack, tokens, components, existing `MOBILE-DESIGN.md` |
| 1 | App Read | One block: app kind, audience and context, vibe, platforms, posture, what was inferred |
| 2 | Brief gate | At most one round of at most three product questions, each with a default. Never aesthetic questions |
| 3 | Dials and directions | Three dials (expression, motion, density, baseline 4/4/4) and two or three direction cards, one of them the honest category standard. The user picks one |
| 4 | Lock | `MOBILE-DESIGN.md` at the project root: tokens as YAML, reasoning as prose |
| 5 | Navigation and flows | Nav Read (tabs, containers, sheets, deep links, back rules) and a screen inventory with four states per screen |
| 6 | Build | Screens from the tokens only, with safe area, sheets, dialogs and keyboard handled per platform |
| 7 | Self-check and hand-off | Grep for slop tells, layout-mechanics checklist with evidence, route-tree diff, then hand off to mobile-app-studio |

## The ideas behind it

- **Infer before you ask, then ask once.** The question round is bounded (one round, three questions, defaults as assertions) so it never becomes an interview loop, and it only asks about the product. Aesthetics are proposed, not asked.
- **Every choice traces to the subject.** Palette from the domain, hero from real content, density from the moment of use.
- **One bold move per screen.** Expressiveness is a budget.
- **Chrome lags content.** Headers, tab bar and transitions stay native until the expression dial reaches 8.
- **Mechanics are not taste.** Safe areas, sheets, dialogs and keyboard follow numbered rules (R-SA, R-BS, R-DL, R-KB) with the exact API per stack.
- **States are part of the design.** Loading, empty, error and populated, every screen.
- **Rules can be broken with a written reason**, and the user's brief always wins over the banlist.
- **Checks are deterministic.** The skill never asks a model whether something "looks good"; it greps, counts and measures, and quotes the output.

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
│   ├── dials.md                  # expression / motion / density, inference, category bias
│   ├── directions.md             # how to write and present two or three direction cards; redesign
│   ├── tells-mobile.md           # the mobile slop catalog with check types and a grep block
│   ├── layout-mechanics.md       # safe area, sheets, dialogs, keyboard rules with IDs and numbers
│   ├── navigation.md             # container decision tree and the Nav Read
│   ├── patterns.md               # onboarding, sign-in, permissions, states, success moment
│   ├── stack-expo.md             # Expo / React Native APIs for every rule
│   ├── stack-flutter.md          # Flutter APIs for every rule
│   └── stack-swiftui.md          # SwiftUI APIs for every rule
└── templates/
    └── MOBILE-DESIGN.md          # the durable design file
```

## Customising

- **House rules**: add rows to `references/tells-mobile.md` (keep numbering stable) and to mobile-app-studio's `common-findings.md` so both skills enforce them.
- **Type scale, radius, spacing**: edit the defaults in `templates/MOBILE-DESIGN.md`; both skills read the project's file at run time.
- **Category bias**: `references/dials.md` §5.

## Credits

Patterns were studied from, and are credited to: [taste-skill](https://github.com/Leonxlnx/taste-skill) (brief inference, dials, pre-flight), [impeccable](https://github.com/pbakaus/impeccable) (bounded question rounds, category-standard option, native references), [draftbit/mobile-taste-skill](https://github.com/draftbit/mobile-taste-skill) (App Read, chrome lags content, tells catalog, Nav Read), [RubenGlez/mobile-design](https://github.com/RubenGlez/mobile-design) (Ask vs Decide, output contract), and [google-labs-code/design.md](https://github.com/google-labs-code/design.md) (the token-plus-prose file shape). Platform rules come from Apple's Human Interface Guidelines, Android developer documentation and the Material 3 sources. Flow evidence from Nielsen Norman Group, Baymard and Apple.

## License

[MIT](LICENSE) © ngnthanhdev
