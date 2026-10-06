# Screen archetypes

How product intent maps to composition. The archetypes themselves are defined in `composition.md` §2; this file says which one a screen should use, and makes the point that a shared component library does not mean a shared screen template.

## 1. Intent to archetype

First match wins; the second column lists the archetype in order of preference. The failure column is what the same screen becomes when it is assembled from components instead of composed.

| Screen intent | Archetype (preferred first) | Focal point | Typical failure |
|---|---|---|---|
| Home / discovery of content, products, places | Editorial, Hero, Feed | the lead item | greeting + stat row + card list |
| Home / status of a thing (device, account, project) | Hero, Dashboard | the live state or headline number | stat triplet + card list (B8) |
| Home / today's work (tasks, shifts, appointments) | List, Dashboard | the next thing to do | cards per task with badges |
| Detail of one object | Hero | the object (image, render, chart) | object in a card with a stats row |
| Create or edit free-form content | Canvas | the work | form fields in boxes |
| Task with a decision (transfer, booking, receive stock, compose message) | Focused Task | the hero input | the template form (B16) |
| Checkout / confirm | Focused Task, List | the amount or the summary | a list of cards and a floating CTA |
| Search and results | List, Editorial (visual results) | the query, then the first result | result cards with chips |
| Chat, messages | Feed (thread), List (inbox) | the latest message | bubbles in cards |
| Settings, profile, account | List | the first group | icon chip rows with chevrons (B4) |
| Analytics, history, reports | Dashboard, List | the headline comparison | one chart card per metric |
| Camera, scanner, player, map navigation | Immersive | the content | header bar over the viewfinder |
| Onboarding step that collects an input | Focused Task | the input | illustration + headline + dots (E2) |
| Empty, success, error, paywall headline | centered single message (any archetype's empty state) | the one sentence and the one action | illustration without an action |
| Auth | Focused Task | the one sign-in path | logo + two fields + three social buttons of equal weight |

A screen whose intent is not in the table gets the archetype whose **hierarchy** (`composition.md` §2) matches its content hierarchy, and the inventory row says which and why.

## 2. Different goals, different compositions

**Different user goals must not receive the same visual composition because the component library is shared.** A design system provides consistency, not sameness.

Reuse across screens:

- behavior (what a tap, swipe or long-press does);
- accessibility (roles, labels, focus order, Dynamic Type);
- interaction primitives (the stepper, the chip, the row, the sheet);
- platform conventions (header, back, tab bar, list grammar);
- state logic (loading, empty, error, populated, and how each is shown).

Do not reuse automatically:

- screen composition (archetype, axis, anchor position);
- section structure (what follows what);
- visual hierarchy (which level gets size, which gets weight);
- card layout (whether there are cards at all).

A shared component is allowed. A shared screen template is not automatically allowed: it needs the intent table above to say that two screens share an archetype, and even then the content hierarchy is written per screen.

## 3. The sameness check

Lay the screen inventory side by side (or the screenshots in Phase 7) and count distinct archetypes. Expectations:

- An app with six or more screens uses at least three archetypes.
- List is legitimately shared by settings, archive, history and search; it does not count toward sameness.
- No archetype other than List covers more than half the inventory (`composition.md` §4).
- Two screens with the same archetype still differ in anchor, hierarchy order or surface strategy, and the inventory shows where.

Failing the check is tell I6 / H9. The fix is in the inventory, not in the code: re-derive the archetype for the screens that collapsed into the default.

## 4. Worked example

Companion app for a solar inverter (the Nav Read in `navigation.md` §8):

| Screen | Intent | Archetype | Focal point | Hierarchy |
|---|---|---|---|---|
| Home | status of a thing | Hero | live kW figure | number > flow diagram > today's total > alerts |
| History | analytics | Dashboard | this month vs last, one chart | comparison > chart > day list |
| Day detail | analytics drill-down | List | the hourly list | peak hour > list > export |
| System | list of devices | List | first device row | devices > settings |
| Device detail | detail of one object | Hero | cutaway render with status | status > render > grouped settings |
| Pair device | task with steps | Focused Task, then Immersive (camera) | the step's input, then the viewfinder | step title > input > next |
| Alert detail | detail of one object | Focused Task | the alert and its one action | what happened > what to do > action |
| Sign in | auth | Focused Task | Sign in with Apple | one path > email fallback |

Four archetypes across eight screens; List is shared by three; the two Hero screens differ in anchor (a number vs a render) and in surface strategy (flow diagram on open canvas vs grouped settings).

## 5. Platform note

Archetypes do not override posture. A List screen in an iOS-first direction is a grouped inset list with system type; the same List in an Android-first direction is Material list items with a top app bar; in `per-platform-native` it is both. The archetype decides hierarchy and anchor; the posture (`brief-gate.md` §1) decides the component language (tell B17).
