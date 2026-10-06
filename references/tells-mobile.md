# Mobile AI tells

The signatures of generated mobile UI. Each tell is a binary ban with an override path, a reason (so it can be retired when the reason stops holding), and a check type: **S** static grep on code or tokens, **V** measured on a screenshot, **C** checklist where the agent must quote evidence (file:line or screen region).

Tells are grouped: §A is run against the **direction cards** in Phase 3; §B to §G against the **built screens** in Phase 7. Numbering is stable; append, do not renumber.

Two cautions. First, banlists expire: a Refactoring UI tip from 2018 (the colored accent border on a card) is now one of the clearest AI tells, and the reaction to "no Inter, no purple" has produced a second wave (cream background, serif display, terracotta accent; near-black background with one neon accent). Review this file quarterly against fresh generated output. Second, the user's explicit brief beats every tell here. If they ask for indigo, give them indigo and note it.

## A. Direction-level tells (check the cards)

| # | Tell | Why it reads as generated | Check | Instead |
|---|---|---|---|---|
| A1 | Indigo / violet accent (`#6366F1` `#7C3AED` `#8B5CF6` family, hue 230 to 290) with no brand reason | Tailwind UI's default button color spread through training data | S hue range on accent token | Accent from the subject, with a named source |
| A2 | Second-wave slop: cream `#F4F1EA`-ish surface + serif display + terracotta; or near-black + one acid accent; or italic serif as "editorial" | The model's reaction to banning A1, now equally default | S palette compare | Same as A1. If the subject genuinely is warm paper (a journal), say so |
| A3 | Palette with two or more accents competing, or brand color on three or more surface types | No single thing is primary | S count accent usage sites | One accent for the primary action and selected state |
| A4 | "Premium" via darkness, glow, glass or gradient rather than via hierarchy and restraint | Decoration standing in for decisions | C name the hierarchy device | Hierarchy by size, weight, color and space |
| A5 | Direction cards that differ only by hue | One idea, not three | C compare the Idea lines | Different ideas tied to different aspects of the subject |
| A6 | Generic imagery plan: "abstract shapes", "gradient blobs", "illustrations" without a subject | Nothing in the domain was looked at | C | Photo, product render, chart or typography from the domain |

## B. Visual tells (built screens)

| # | Tell | Why | Check | Instead |
|---|---|---|---|---|
| B1 | Emoji as icons in tabs, buttons, empty states | Inconsistent stroke and size, reads as a mock | S emoji regex over UI strings | One icon family, one weight |
| B2 | More than one `LinearGradient` per app, or any gradient not encoding data or state | Decoration | S count | Flat surfaces; gradient only on charts or progress |
| B3 | The card-stack screen: gray background, every group a white rounded shadowed card | Containers used as decoration | S more than three card wrappers on a non-feed screen | Whitespace, hairlines, grouped lists |
| B4 | The icon chip row: every list row leads with a 40 pt tinted rounded square holding a colored icon | The most recognizable RN slop signature | V | Naked icon at fixed width, or none; tinted chips only for categorical color |
| B5 | Shadow without Android elevation, or elevation 8 floating everything; shadow + border + tint on the same surface | Depth with no meaning | S shadow props without elevation | Elevation tokens; one depth device per surface |
| B6 | Inline grays (`#666` `#888` `#999`) mixed per screen | No token ramp | S inline hex in screen files, expect zero | Token ramp |
| B7 | One radius (16 to 24) on everything including inputs; more than 80% of nodes share one value | Radius not tied to role | S count distinct `borderRadius` and distribution | Two or three radius tokens by role: control, card, sheet |
| B8 | Stat-triplet header: home opens with three equal stat cards | Numbers without a question | V | One hero metric with unit and comparison, or none |
| B9 | Blur or glass on content cards and list items | HIG keeps materials for the navigation and control layer | S material on content nodes | Material only on bars and sheets |
| B10 | Badge confetti: status pills and "NEW" on every row | Pills stop meaning state | V more than one pill per row | Pills carry real state, at most one per row |
| B11 | More than five font sizes, odd sizes (13, 15, 17 on RN), anything under 12 | Type scale drift | S count `fontSize` literals | Five even sizes with line heights (12/16, 14/20, 16/22, 20/26, 24/32), hierarchy by weight and color |
| B12 | Flat hierarchy: heading and body near the same weight and color; labels as strong as values | The eye has no first stop | V/C | Labels in muted color or lighter weight; one display element per screen |
| B13 | Everything centered on data and list screens | Scanning breaks, parent-child relations vanish | S `justifyContent: 'center'` on data screens | Leading alignment; centering only for single-message screens |
| B14 | Even spacing everywhere (one gap value) | Groups cannot be told apart | S fewer than three distinct gap values | At least three levels: inside group < between groups < between sections |
| B15 | Pastel-initials avatars everywhere | Placeholder look | V | Real images with blurhash, or one deliberate avatar style |
| B16 | The template form: label, box, label, box, identical rounded fields, then a full-width accent button floating in empty space | The screen shows fields, not the task. Nothing from the domain is visible, no consequence of the input is shown, and the input control is the default text box regardless of what is being entered | V/C count identical field boxes; is the object being acted on visible; is there a live consequence line | See `patterns.md` §4b: the object on screen, the primary input as the hero with the control the context calls for (stepper, chips, picker, amount pad), the consequence shown live, no void between content and CTA |
| B17 | Posture mismatch: Android-first or Material direction drawn with iOS rounded boxes and 8 px buttons, or iOS-first drawn with Material filled fields and a FAB | The direction says one platform language and the screen speaks another | C compare components against the posture in MOBILE-DESIGN.md | At EXPRESSION 1 to 4 the platform's components must be recognizable: Material filled or outlined text fields, pill buttons, 56 dp list items, top app bar; iOS grouped lists, system sheets, large titles |

## C. Structural tells

| # | Tell | Why | Check | Instead |
|---|---|---|---|---|
| C1 | Magic insets: `paddingTop: 50`, `bottom: 30`, status-bar height constants | Breaks on the next device [R-SA1] | S grep magic numbers | Insets from the safe-area API |
| C2 | Whole screen wrapped in a SafeAreaView; white bands at top and bottom | Background should bleed [R-SA1] | V/S | Inset the control containers only |
| C3 | Sticky CTA under the home indicator or gesture bar | [R-TZ3] | V | Footer slot plus bottom inset |
| C4 | Last list item hidden behind the tab bar or CTA | Missing content padding | V | Bottom padding = bar height + inset |
| C5 | Hand-rolled modal: absolutely positioned View + backdrop + state | Loses focus trap, back handling and a11y | S | Router modal or sheet library |
| C6 | Modal inside modal; two sheets open at once | [R-BS1] | C | Close one before opening the next |
| C7 | Sheet without grabber, or grabber on a sheet that cannot resize; sheet without scrim; sheet that cannot be swiped down | [R-BS2] [R-BS3] | S/V | Sheet library defaults set deliberately |
| C8 | Dialog with three or more peer buttons, "Yes / No / Maybe", or an "OK"-only "Success!" alert | [R-DL1] [R-DL5] | S count dialog buttons, grep alert calls | Snackbar with Undo; action sheet or sheet list for choices |
| C9 | Destructive button in red with no Cancel, or Cancel as the default | [R-DL3] | C | Destructive plus Cancel; default is the safe action |
| C10 | Input or CTA covered by the keyboard; tab bar pushed above the keyboard on Android; numeric pad with no Done | [R-KB1] [R-KB2] [R-KB3] [R-KB7] | V with keyboard open | Keyboard-aware scroll, sticky view, toolbar |
| C11 | Form inputs missing keyboard type, content type or autofill hints; placeholder used as the only label | Autofill and OTP break, labels vanish on focus [R-KB5] | S every email/phone/name/password input | Typed inputs with persistent labels |
| C12 | `ScrollView` wrapping `.map()` over unbounded data | Performance and memory | S | Virtualized list; bounded static maps are fine |
| C13 | Fixed pixel widths (`width: 350`) | Breaks on small devices | S | Flex |
| C14 | Bare 24 pt icon as a tap target | [R-TT1] | S/V | 44 pt / 48 dp with hit slop |
| C15 | Chevron on rows that do not push, or on rows with a switch | Chevron means "pushes a screen" | S chevron count equals pushing-row count | Chevron only on navigating rows |

## D. Navigational tells

| # | Tell | Why | Check | Instead |
|---|---|---|---|---|
| D1 | Five tabs plus a center button regardless of the app (Home / Search / + / Alerts / Profile) | Template IA | S tab count and labels vs Nav Read | Tabs from real top-level destinations, 3 to 5 |
| D2 | Settings tab, Logout tab, Profile tab in a single-user app | Not destinations | S | Behind Profile or a header gear |
| D3 | Manual "< Back" text in content duplicating the header back | Web habit | S | Native header back; custom only in full-screen media |
| D4 | Nested tab bars, double headers | Two owners of chrome | V | One header owner per screen |
| D5 | Onboarding or auth as conditional renders instead of route groups | Breaks back, deep links and state | S | Route groups gated in the layout |
| D6 | Sheets used to navigate; a sheet with its own back stack | [R-BS9] | C | Modal or push |
| D7 | Hamburger as primary navigation on a phone | Hidden navigation is unused | S | Tab bar |

## E. Copy tells

| # | Tell | Why | Check | Instead |
|---|---|---|---|---|
| E1 | "Welcome back, John! 👋" header | Personalization theater | S regex | Content-first home; greeting only if personalization is the product |
| E2 | Three identical onboarding slides: illustration + headline + dots + Skip | See `patterns.md` §1 | S count screens in the onboarding group and compare layouts | Zero slides, or screens that each collect an input |
| E3 | Placeholder data: John Doe, Jane Smith, Acme, NovaCore, lorem, `10,000+ users`, `99.9%`, `$1,234.56` | The "Jane Doe effect" | S regex | Realistic, locale-appropriate names and messy numbers |
| E4 | Filler verbs: elevate, unlock, supercharge, seamless, next-gen, empower, transform; Vietnamese: nâng tầm, bứt phá, đỉnh cao, trải nghiệm tuyệt vời | Says nothing | S regex | Concrete verbs naming the result |
| E5 | Exclamation marks in system copy; "Oops!"; apology spirals | Tone drift | S regex `!` in UI strings | Plain statements with a next step |
| E6 | Template chrome: ALL-CAPS eyebrow above every heading, `A · B · C` separators, `→` at the end of every button, `01 / 02 / 03` numbering on unordered content | Decoration posing as structure | S regex | Structure only when it encodes something |
| E7 | Em dashes and en dashes in UI strings | Typographic tell of generated copy | S grep `—` `–` | Comma, period, or restructure |
| E8 | Zero or empty values shown as data (`$0.00 /ea`, `0 min`), wrong pluralization (`1 entries`), rounded-down money (`5,450,000` as `5.4M`) | Formatting without thought | S/C | Hide or placeholder; pluralize; keep enough digits |

## F. Motion and interaction tells

| # | Tell | Why | Check | Instead |
|---|---|---|---|---|
| F1 | JS-thread animation (`useNativeDriver: false`, state updates on scroll) | Drops frames on real devices | S hard fail | UI-thread animation library |
| F2 | Default opacity flash on every tap, or no pressed feedback at all | Cheap feel | S/V | Scale or tint feedback; ripple on Android |
| F3 | Spinner-only loading for content | See `patterns.md` §6 | V | Skeleton matching layout |
| F4 | Decorative entrance animation on every element; replaying in recycled list cells | Noise, and a performance bug | S entering animations in list cells | Motion only where it explains a change |
| F5 | Haptic on every tap | Numbs the user | S haptic calls on navigation handlers | Vocabulary: selection for pickers, light for toggles, one success per core task |
| F6 | Infinite loops (pulse, shimmer, floating blobs) not tied to an in-progress state | Distraction | S `repeat` / `infinite` | Loops only for genuinely ongoing processes |
| F7 | UI animations over 300 ms; animations that block input | Feels slow | S durations | 150 to 300 ms, interruptible |
| F8 | Reduced motion ignored above MOTION 3 | Accessibility | S check for the reduce-motion flag | Honor it |

## G. Behavioral tells

| # | Tell | Why | Check | Instead |
|---|---|---|---|---|
| G1 | A setting that renders and toggles but is persisted nowhere and read by nothing | The row was generated, not the feature | S each settings state has a second reference outside the settings screen | Every setting traces to a read site or is removed |
| G2 | Missing states: no empty, error, offline or refresh on feeds | Concept, not product | C state inventory per screen | All four states implemented |
| G3 | Destructive residue: "delete account" clears the store but leaves notifications, cached images, keychain tokens | Side effects not enumerated | S teardown covers every subsystem initialized | Enumerate and clear |
| G4 | Completion with no undo and no next action; a finished list that is a dead end | See `patterns.md` §8 | C | Undo, then a next action |
| G5 | Permission prompt at launch | Denied prompts | S permission calls in root layout | Prompt at the moment of need with a pre-prompt |

## Grep

Run from the project root, adapt paths to the stack (the stack file has the stack-specific block). Every hit is triaged and quoted in the self-check; hard fails (F1, C1 with a literal status-bar constant, E7) are fixed before hand-off.

```bash
# E7 em/en dashes in UI strings
grep -rn "—\|–" app/ components/ lib/ src/ 2>/dev/null
# B1 emoji in UI code
grep -rnP '[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]' app/ components/ lib/ src/ 2>/dev/null
# A1 indigo family and B2 gradient count
grep -rniE "#(6366F1|7C3AED|8B5CF6|4F46E5|A78BFA)" app/ components/ lib/ src/ 2>/dev/null
grep -rn "LinearGradient" app/ components/ lib/ src/ 2>/dev/null | wc -l
# B6 inline hex outside token files
grep -rnE '#[0-9a-fA-F]{6}\b' app/ components/ lib/ src/ 2>/dev/null | grep -viE "theme|token|colors"
# B11 distinct font sizes (adapt the property name per stack)
grep -rhoE "fontSize: ?[0-9]+" app/ components/ lib/ src/ 2>/dev/null | sort | uniq -c | sort -rn
# C1 magic insets
grep -rnE "paddingTop: ?[4-6][0-9]\b|bottom: ?[2-4][0-9]\b" app/ components/ lib/ src/ 2>/dev/null
# E1, E3, E4 copy tells
grep -rniE "welcome back|john doe|jane doe|acme|lorem|10,000\+|elevate|unlock your|supercharge|seamless|next-gen|nâng tầm|bứt phá|đỉnh cao" app/ components/ lib/ src/ 2>/dev/null
# E6 template chrome
grep -rnE "→\"|·.*·|\b0[1-9] ?/ ?0[1-9]\b" app/ components/ lib/ src/ 2>/dev/null
# G5 permissions at launch (adapt API names)
grep -rniE "request.*permission|requestPermission" app/_layout.* lib/main.* 2>/dev/null
```

## Growing this catalog

New tells come from observation: generate an app, spot a recurring signature, add it as a numbered row with a reason, a check and an alternative. Retire a tell when its reason no longer holds. Keep numbers stable because `MOBILE-DESIGN.md` and audit reports cite them.
