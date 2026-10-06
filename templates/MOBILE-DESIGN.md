---
# MOBILE-DESIGN.md
# The design source of truth for this app. Written by taste-mobile-app-skill, read by every
# later session and by mobile-app-studio during audits. Tokens live in this front matter so
# tools can read them; the reasoning lives in the prose below. Fields marked (inferred) were
# not confirmed by the user and may be corrected; a re-run refreshes this file and reports
# the delta instead of regenerating it.
version: 1
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

Mood: <three adjectives>, not <one>. Reference principles: <principle from App A>, <principle from App B>.

## Direction: <name>

**Idea.** One sentence tying the look to the subject or the moment of use.

**Hierarchy.** How the eye moves on a typical screen: what is loud (the one display element), what is quiet (labels, metadata, chrome). Hierarchy is built with weight and color; the five sizes above are the only sizes.

**Imagery.** Photo / product render / chart / typography, how it is treated (full-bleed, framed, with scrim), and where it appears. What is never used (stock, blobs, emoji).

**Signature element.** The one bold move, and the screens that carry it. Every other screen stays quiet.

**Chrome.** Native header, tab bar and transitions, tinted with the accent (EXPRESSION < 8). Or, if 8+, what is custom and how insets, pressed states and reduced motion are handled.

**Copy voice.** Tone in one line; CTA verbs; what the app never says.

**Deliberately not doing.** Two or three things this direction refuses, including the nearest slop default.

## Alternatives considered

<Name A>: one line on why not. <Name B>: one line on why not.

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

| Screen | Purpose | Focal point | Primary action | Signature element | States (L/E/Err/P) | Keyboard plan | Permissions |
|---|---|---|---|---|---|---|---|

## Flow decisions

- Onboarding: <zero slides | n screens, each collecting …>, reason.
- Sign-in timing: <after first value moment at …>, reason.
- Permissions: <permission> on <trigger> with pre-prompt <text>, decline path <…>.
- Success moment: <where>, <what happens>, nowhere else.

## Rule exceptions

`Breaking <rule> because <goal from the brief>` lines, one per exception. Empty is the expected state.

## Change log

- YYYY-MM-DD: created by taste-mobile-app-skill.
