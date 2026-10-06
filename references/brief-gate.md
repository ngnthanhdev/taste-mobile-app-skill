# Brief gate

The brief gate exists to get one thing: a design read that is specific enough that the model cannot fall back to the statistical default. It is **not** an interview. Most of the read comes from the repo and the brief. The user is asked only when a wrong guess would change the build, and at most once.

## 1. The App Read

Read these signals, in this order, before writing the block:

1. **App kind**: consumer social, utility or tool, fitness or health, fintech, commerce, content or media, productivity, kids, field or operations tool, companion to a physical product.
2. **Audience and context of use**: who, when, how often, one hand or two, standing or sitting, gloves, sunlight, in a hurry. Context picks density and target sizes, not taste.
3. **Vibe words the user used**: "clean", "playful", "premium", "native", "like Airbnb", "dense", "calm", "brandy". Quote them back.
4. **Reference apps or screenshots** the user gave. On mobile, real apps are the design language the way reference sites are on the web. A reference is used only after it has gone through `reference-extraction.md`: observation, principle, application in this app, and the one thing that must not be copied. Two to four principles per reference; the name alone is never an instruction.
5. **Platforms**, and which one is first-class.
6. **Existing brand assets**: logo, palette, type, photography, an existing design system. For a redesign these are starting material.
7. **Quiet constraints** that override aesthetics: accessibility-first audience, kids, regulated domains (finance, health), offline-heavy use, enterprise distribution.

Then write:

```
APP READ: <app kind> for <audience, context of use>, <vibe> language, leaning <stack / design language>.
platforms: iOS first-class · Android first-class · web none
posture: unified-brand | iOS-first | Android-first | per-platform-native
inferred: <list the fields you guessed, or "none">
```

Examples:

- `APP READ: habit tracker for busy professionals checking in once a day with one hand, calm minimal language, leaning Expo + native chrome. platforms: iOS + Android first-class. posture: unified-brand. inferred: audience, posture.`
- `APP READ: companion app for a solar inverter, used by homeowners on the couch and by installers on a roof in sunlight, technical-but-friendly language, leaning Flutter + Material 3 with a custom accent. platforms: Android first-class, iOS first-class. posture: unified-brand. inferred: none.`
- `APP READ: journaling app for people who want a quiet, private place to write at night, warm editorial language, leaning SwiftUI + system fonts with one serif display face. platforms: iOS only. posture: iOS-first. inferred: none.`

**Posture** is a commitment. `per-platform-native` means components diverge (SF Symbols vs Material Symbols, iOS switch vs Material switch). `unified-brand` means one content look everywhere with native navigation chrome underneath. `iOS-first` or `Android-first` means the other platform gets the same screens with platform components swapped.

## 2. The one question round

Ask **only if** a field is `inferred` **and** guessing wrong would change what you build. Otherwise declare the read and continue.

Rules that keep this from becoming a loop:

- **One round.** All questions go in one message. A second round is allowed only for a blocker you cannot build around (platform unknown on an empty repo, Expo managed vs bare when native modules are involved, an existing brand you were not shown).
- **Three questions maximum.** Fewer is better. If you have four, the fourth is a decision you make yourself.
- **Every question carries a default** written as an assertion. The user accepts by saying "ok" or corrects one word. Never present a menu of styles.
- **Only product questions.** Never ask about colors, fonts, radii, "minimal or bold", "light or dark". Those are your proposals in Phase 3, and the user picks between finished directions.
- **Never re-ask** anything recorded in `MOBILE-DESIGN.md`, the repo, README, docs or memory.

The three questions, in priority order, with default templates:

| # | Question | Default template |
|---|---|---|
| 1 | Who uses it, when, and how (one hand, in a hurry, outdoors)? | "I am assuming <audience>, used <frequency> for <duration>, mostly one-handed. Correct me if not." |
| 2 | Mood in three adjectives plus one "not": | "I am reading the mood as <a, b, c>, and not <d>. Change any word." |
| 3 | Two or three apps you admire for this, and what you like about each? | "I will take <principle> from <App A> and <principle> from <App B> unless you have others in mind." The answer is a reference list; Phase 3 extracts it. Never ask the user which principle to take. |

Platform, brand assets and workflow (Expo managed vs bare) are asked **instead of** one of these only when they are unknown and blocking.

Example message (Vietnamese user):

> Trước khi đề xuất hướng thiết kế, mình chốt 3 điều, bạn chỉ cần "ok" hoặc sửa:
> 1. Người dùng là người đi làm, mở app 1 lần mỗi tối trong khoảng 1 phút, dùng một tay.
> 2. Mood: ấm, chắc chắn, tối giản, và không phải dễ thương.
> 3. Mình lấy typography của Things và nhịp onboarding của Duolingo làm tham chiếu.

## 3. Ask vs Decide

| Ask (if unknown and it changes the build) | Decide yourself and state it |
|---|---|
| Target platform on an empty repo | Everything already in the repo: tokens, components, navigation library, icon set, animation library |
| Audience and context of use | Dial values, palette, type roles, radius system, spacing scale |
| (never) which territory, DNA or composition the user wants | Visual territory, the ten DNA dimensions, archetype per screen, repetition limits, which reference principle wins a conflict |
| Existing brand to preserve, or free to propose | Which native component to use for each pattern |
| Expo managed vs bare when native modules are needed | Tab count and navigation containers |
| Offline, security or regulatory requirement that shapes flows | Onboarding length, sign-in timing, permission timing (follow `patterns.md`) |
| Whether a legacy screen must be preserved pixel-for-pixel in a redesign | Which states each screen needs |

## 4. Autonomous mode

With `--autonomous`, or when the user does not answer within the conversation turn, do not wait. Write an **Assumptions** block at the top of your reply, using the same three defaults, then continue. In `MOBILE-DESIGN.md` mark each assumed field with `(inferred)`. The user can correct any line later and the re-run will refresh the file and report the delta.

## 5. What the gate must produce

Before Phase 3 you have: the App Read with no field that blocks the build, the mood as three adjectives and one negation, two or three named references (extracted in Phase 3 into the `references:` records), the first-class platform, and the posture. If any of those is missing after the round, fill it with the default and move on. The mood adjectives decide nothing by themselves; Phase 3 translates each into observable rules (`visual-dna.md` §2).
