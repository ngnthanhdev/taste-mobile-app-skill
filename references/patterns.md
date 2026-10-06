# Flow patterns

Taste at the flow level is mostly restraint backed by evidence. Each pattern below has the evidence, the default rule, and the override condition. Rules marked ★ may be broken with a written reason tied to the brief.

## 1. Onboarding ★

**Evidence.** Apple's HIG asks for onboarding that is fast, fun and optional, teaches by doing, and defers non-essential setup. In Nielsen Norman Group's study with 70 participants, people who saw a deck-of-cards tutorial rated the task harder (4.92 vs 5.49 on 7) and were not more successful (91% vs 94%) than people who got none. Three near-identical illustrated slides with dots and Skip is also the most recognizable onboarding tell.

**Default: zero slides.** Land on the real first screen with a usable empty state.

**When onboarding earns a screen**, each screen must do one of: collect a real personalization input that changes the product (goal, level, schedule), demonstrate the core value by letting the user try it, or prime a permission that the app cannot work without. Maximum three screens, each skippable, each visually distinct (vary the balance of image, text and action; do not clone a layout three times). No ratings prompt, no account creation, no marketing copy.

**Override**: when onboarding *is* the product (a guided setup for a device) or when regulation requires disclosures before use. Write the reason.

## 2. Sign-in timing ★

**Evidence.** HIG: "Delay sign-in for as long as possible"; require an account only when core functionality needs it. Baymard reports 19% of shoppers abandoning checkout because they were forced to create an account. Duolingo lets a new user finish the first lesson before registering.

**Default: no sign-in wall before the first value moment.** Show the live reading, the first lesson, the first search result, the first draft. Ask for an account when the user does something that needs it: saving across devices, paying, following someone. Offer Sign in with Apple and Google first, email second; password rules shown inline, not after a failed submit.

**Override**: the data is sensitive from the first screen (banking, health records), or sync is the core feature. Write the reason and keep the wall to one screen with one obvious path.

## 3. Permissions

**Evidence.** HIG: ask at the moment of need, with a sentence of benefit first; ask during onboarding only when the app cannot run without it. Prompts at launch are the ones users deny.

**Rule.** Every permission is tied to one triggering action and one explanation moment before the system prompt. The pre-prompt names the benefit in the user's terms ("to show nearby chargers" not "to access your location"), and a decline path exists that still lets the user continue. Never request two permissions back to back. Record each permission, its trigger and its decline path in the screen inventory.

## 4. Progressive disclosure

**Rule.** One primary action per screen. Advanced options live behind "More", a sheet, or a sub-screen. A form shows the fields needed to finish the common case; the rare case is a disclosure. Settings are grouped by mental model, with destructive actions last and in the destructive color.

## 5. Empty states

**Evidence.** Empty states exist to explain the system state, teach the app, and lead straight to the main task. "An empty screen is an invitation to act."

**Rule.** Every list, feed and dashboard module has an empty state with: one sentence of what belongs here, one primary action that creates or discovers the first item, and optionally a realistic example or sample data. No blank screen, no illustration without an action, no "Nothing here yet" alone. Empty states for *filtered* results differ from empty states for *no data* ("No matches for 'solar' in May" with a clear-filter action).

## 6. Loading

**Evidence.** NN/g: under about one second, show nothing; two to ten seconds, use a skeleton for a whole page or a spinner for a module; over ten seconds, a determinate progress indicator; never a skeleton of empty gray boxes that does not match the real layout. HIG: show something as soon as possible.

**Rule.** Skeletons match the final layout row for row and are replaced by content without a layout jump. Spinners are for modules and buttons (inline, replacing the label, keeping the button's size). Pull-to-refresh is for remote content that changes. A spinner-only full screen is a defect except at cold start, and cold start shows the brand for less than a second.

## 7. Errors

**Evidence.** NN/g's error-message guidelines: visible near the source, in human language, precise about what went wrong, constructive about what to do, never blaming, and preserving the user's input.

**Rule.** Each error states what broke and what to do next, in one or two sentences, next to where it happened. Field errors are field-specific and appear on blur or submit, not on every keystroke. Network errors keep cached data visible and offer Retry. Destructive failures never lose the user's draft. No "Something went wrong" without a next step; no apology spirals.

## 8. Confirmations and undo

**Rule.** Reversible destructive actions (archive, complete, delete one item) get **Undo** in a snackbar or inline for a few seconds, not a dialog [R-DL1]. Irreversible ones (delete account, send money, erase all) get an alert with a verb label and a visible Cancel [R-DL3]. Completing an item animates it out rather than removing it instantly, and the screen afterwards has a next action; a finished list is never a dead end.

## 9. The one success moment

**Evidence.** The peak-end rule: experiences are remembered by their peak and their end. Emil Kowalski: ask what each animation is for; high-frequency actions are not animated.

**Rule.** Design exactly one success moment at the end of the core task (order placed, workout finished, device paired): a short animation (under 600 ms total), one success haptic, copy that names what happened and what is next. Nowhere else. Routine completions get a checkmark and an Undo, not confetti. The success screen always has a next action and a way back.

## 10. Navigation visibility

**Evidence.** Moving primary destinations from a hamburger menu to a tab bar increased engagement in published cases (Facebook, Redbooth). Hidden navigation is unused navigation.

**Rule.** Up to five primary destinations are visible in the tab bar. No hamburger menu as primary navigation on a phone. Secondary destinations live behind Profile or a header affordance. See `navigation.md`.

## 11. Copy voice

**Rule.** Headlines of one to three short lines. CTAs are concrete verbs that name the result ("Save changes", "Pair inverter", "Start lesson"), and the same action keeps the same name across the flow (a "Post" button is followed by "Posted", not "Published successfully!"). No filler verbs (elevate, unlock, supercharge, seamless; in Vietnamese: nâng tầm, bứt phá, trải nghiệm đỉnh cao). No exclamation marks in system copy. No greeting header unless personalization is the product. Real names, real amounts with correct rounding, correct pluralization, locale formatting.

## 12. Screen inventory format

Phase 5 produces one row per screen:

```
| Screen | Purpose | Focal point | Primary action | Signature element | States (L/E/Err/P) | Keyboard plan | Permissions |
```

A screen is ready to build only when every column is filled. "n/a" is allowed for keyboard and permissions; it is not allowed for states.
