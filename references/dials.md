# Dials

Three numbers set after the App Read. Every layout, motion and density decision is gated by them, so they must be explicit and reasoned, never silently left at baseline.

```
DESIGN_EXPRESSION: 4   1 = strictly platform-native, 10 = fully custom branded
MOTION_INTENSITY:  4   1 = native transitions only, 10 = gesture-driven physics everywhere
VISUAL_DENSITY:    4   1 = airy consumer, 10 = pro-tool cockpit
```

**Baseline 4 / 4 / 4.** Mobile baselines sit lower than web because on a phone, following platform convention is a feature: the app is compared directly with Mail, Maps and Settings, not with other websites. Web design skills that start at 8 / 6 / 4 produce "a website in a phone frame".

## 1. Inference from the App Read

| Signal in the App Read | EXPRESSION | MOTION | DENSITY |
|---|---|---|---|
| "iOS-native", "like Apple Notes, Things, Reminders", utility that should disappear | 1 to 3 | 2 to 3 | 3 to 4 |
| "tool", "just works", internal or field app | 3 to 4 | 3 to 4 | 4 to 6 |
| consumer fintech, banking, insurance | 4 to 6 | 3 to 5 | 4 to 6 |
| health, fitness, wellness | 4 to 6 | 4 to 6 | 3 to 4 |
| consumer social, content feed, media | 5 to 7 | 5 to 7 | 4 to 5 |
| commerce, luxury, fashion, beauty | 7 to 9 | 5 to 7 | 2 to 3 |
| "brandy", "playful", "Duolingo-like", kids, education | 7 to 9 | 6 to 8 | 2 to 4 |
| pro tool, trading, analytics, operations, data-heavy | 3 to 5 | 2 to 3 | 7 to 9 |
| companion to a physical product (ring, inverter, car, appliance) | 5 to 7 | 4 to 6 | 3 to 5 |
| redesign, preserve | match existing | match existing + 1 | match existing |
| redesign, overhaul | existing + 2 | existing + 2 | match existing |

Pick a single value inside the band and write the reason in one clause: `EXPRESSION 6 because the brand is the product (a beauty label) but the audience expects native commerce flows.`

## 2. What each EXPRESSION band means in practice

| Band | Chrome (header, tab bar, transitions) | Content components | Type | Icons |
|---|---|---|---|---|
| 1 to 3 platform-native | Native, untouched | Platform components, system pickers, grouped lists | System font, Dynamic Type styles | SF Symbols / Material Symbols |
| 4 to 7 branded-native | **Still native**, tinted with the accent | Custom tokens for color, type, radius; custom content cards and hero | System font for UI, brand face allowed for display moments | One family, custom weight allowed |
| 8 to 10 fully custom | Custom tab bar, custom transitions, brand chrome | Fully custom | Brand fonts throughout | Custom set allowed |

**Chrome lags content** (mandatory): navigation chrome stays native until EXPRESSION is 8 or higher, even when content styling is fully branded. A custom-painted tab bar with wrong safe areas and no pressed state is the single most common failure of "expressive" AI apps. At 8 or above you own every inset, pressed state, accessibility role and reduced-motion path the native chrome was giving you for free, and the layout-mechanics checklist is run against your chrome too.

## 3. MOTION bands

| Band | Allowed | Not allowed |
|---|---|---|
| 1 to 3 | Native push, modal and tab transitions; pressed-state feedback; content fade on tab switch (about 200 ms) | Entrance animations, decorative loops |
| 4 to 6 | Above, plus one choreographed moment per flow (success, hero expand), list item enter/exit (about 250 ms), numeric text transitions, skeleton to content | Animation on every element, parallax for its own sake |
| 7 to 10 | Above, plus gesture-driven sheets and cards, shared-element transitions, physics | Anything that blocks input or runs on the JS thread |

Hard floors at every level: animations run on the UI thread; reduced motion is honored above MOTION 3; UI animations stay between 150 and 300 ms; high-frequency actions (typing, scrolling, tapping list rows) are not animated beyond pressed feedback.

## 4. DENSITY bands

| Band | Row height | Screen padding | Cards | Type |
|---|---|---|---|---|
| 1 to 3 | 64 to 80 pt rows, one idea per viewport | 20 to 24 | Few or none, hero imagery breathes | Display size used generously |
| 4 to 6 | 48 to 64 pt rows | 16 to 20 | Cards only to group, never to decorate | Body 14 to 16, one display per screen |
| 7 to 10 | 40 to 48 pt rows, tables, tabular figures | 12 to 16 | Hairlines and grouped lists instead of cards | Body 14, caption 12, no display |

Touch targets of 44 pt (iOS) / 48 dp (Android) survive DENSITY 10. Font sizes never go below 12.

## 5. Category bias (prefer / avoid)

| App kind | Prefer | Avoid |
|---|---|---|
| Fintech | Tabular figures, monospace or tabular for amounts, trust neutrals with one accent, explicit confirm and success states for money-moving actions, amounts never rounded down | Mascots, gradient balance cards, decimals that jiggle during animation, red as a neutral progress color |
| Health, fitness | One hero metric per screen with unit and comparison, large type, encouraging but plain copy, charts as hero | Stat-triplet headers, red for progress, streak guilt, confetti on every completion |
| Wellness, journaling | Warm neutrals, generous line height, one serif display face is acceptable, quiet chrome | Clinical blue, dense dashboards, notifications pressure |
| Consumer social | Media is the UI, fast feeds, quiet chrome, one accent for the primary action | Cards around every post, engagement badges, avatar rows that mean nothing |
| Commerce, beauty, luxury | Product photography with room, sticky price plus one CTA, honest urgency only, editorial type | Badge confetti, countdown timers, cluttered product cards, three-column grids on a phone |
| Productivity, tools | Density over decoration, keyboard-first flows, instant interactions, grouped lists | Onboarding tours, illustration empty states on every view, celebration modals |
| Travel, places | Full-bleed photography, one place per screen, map as content not decoration | Generic landmark stock, overlapping cards on photos, pills over imagery |
| Physical-product companion | The device rendered as hero, live status as the first thing, color from the device or the physics (sun, water, heat) | Dashboard spam, every sensor a card, abstract blobs |
| Kids, education | Targets 56 pt or larger, high contrast, zero dark patterns, fewer choices per screen | Tiny icon buttons, ad-adjacent layouts, infinite scroll |
| Field, operations | High contrast for sunlight, large targets for gloves, offline-first states, one task per screen | Thin type, low-contrast grays, gesture-only actions |

## 6. The dominant idea and the signature element

Each screen has **one dominant visual idea**, supported by **up to two secondary visual behaviors**; everything else stays quiet and native-feeling (`visual-dna.md` §5). A screen where everything is expressive reads as noise, and an app whose every screen shouts has no voice. The dials bound how loud the dominant idea may be: at EXPRESSION 1 to 3 it is a typographic or content decision inside native components; at 4 to 7 it may be a custom hero, chart or signature component while chrome stays native; at 8 and above it may include the chrome.

The **signature element** is the dominant idea on the signature screens (tab roots and the one success moment, usually). Write the dominant idea per screen in the screen inventory; name the signature where it applies. If you cannot name a dominant idea, the screen has none and that is a defect (tell H7); if you name two, one of them is a supporting behavior or it goes.

## 7. Recording the dials

In `MOBILE-DESIGN.md`:

```yaml
dials:
  expression: 6   # brand is the product; chrome stays native
  motion: 4       # one success moment per flow, otherwise native
  density: 3      # product photography needs room
```
