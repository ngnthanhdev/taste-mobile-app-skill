# Layout mechanics

Platform mechanics are not taste. They apply in every direction at every dial value. Each rule has an ID that the stack files map to concrete APIs, and that the self-check cites. Numbers come from Apple HIG, Android developer docs, AOSP dimens and Compose Material 3 sources; the full source list is in the research report `plans/reports/researcher-261006-2204-mobile-layout-mechanics.md`.

## 1. Safe area

Reference values, **for checking only, never for hard-coding**:

| Device or system | Top | Bottom |
|---|---|---|
| iPhone with notch (13, 14) | 47 pt | 34 pt |
| iPhone with Dynamic Island (14 Pro, 15, 16) | 59 pt | 34 pt |
| iPhone 16 Pro, 17 family | 62 pt | 34 pt |
| iPhone Air | 68 pt | 34 pt |
| Android status bar (AOSP default, OEMs vary) | 24 dp | |
| Android 3-button navigation | | 48 dp |
| Android gesture navigation | | 24 dp visible, 32 dp gesture zone |

Rules:

- **R-SA1. Insets on control containers, not the root.** The root view and backgrounds bleed edge to edge; the header, the content column and the footer read insets from the platform API. Wrapping the whole screen in a safe-area view produces white bands and is a defect.
- **R-SA2. What may extend under system bars: backgrounds, full-bleed imagery, scrolling content.** What may not: controls, text, inputs, the last item of a list at rest. iOS 26 (Liquid Glass): no solid fill under toolbars or tab bars; use the scroll edge effect.
- **R-SA3. Android is edge-to-edge.** Mandatory at target SDK 35, no opt-out from SDK 36; Flutter defaults to edge-to-edge too. Status bar over scrolling content needs translucency or one protection layer, never two (Material top app bars already provide one).
- **R-SA4. Gesture navigation stays transparent.** Add a scrim only for the 3-button bar when a bottom bar hides.
- **R-SA5. Use gesture insets only when you own a gesture** (carousel edge, sheet drag, game). Everything else uses the safe-drawing insets.
- **R-NV1. Tab bar holds sections, never actions.** No "+ Create" tab. Actions go to the header or a FAB.
- **R-NV2. Tabs are never hidden or disabled**, except when covered by a modal.
- **R-NV3. One primary action per toolbar**, trailing; at most three item groups.
- **R-NV4. Back and Close use the platform affordance**, not the words "Back" or "Close" in content.
- **R-TZ1. Primary CTA in the lower half**, sticky when the screen has a linear job, above both the home indicator and the Android gesture zone.
- **R-TZ2. The top corner opposite the thumb is the hardest to reach.** Never the only place for a frequent action.
- **R-TZ3. Sticky bottom elements add the bottom inset**: `max(inset.bottom, 16)`, never `bottom: 20`.
- **R-TT1. Tap targets 44 x 44 pt on iOS (28 pt absolute minimum), 48 x 48 dp on Android**, with room between adjacent targets (about 12 pt with bezels, 24 pt without).

## 2. Bottom sheets

Choose the container first:

| Situation | Use |
|---|---|
| Short task with its own content, then back to the parent | Sheet (iOS) or modal bottom sheet (Material) |
| Supplementary content while the parent stays interactive | Non-modal sheet (iOS background interaction, Material standard sheet) |
| Composing or a long form | Sheet at the large detent only, or a full-screen modal |
| Serious error or irreversible confirmation | Alert or dialog |
| Choosing between options tied to an action just taken | Action sheet (iOS), bottom sheet list (Android) |
| Navigating between areas of the app | Never a sheet. Tabs or push |

Rules:

- **R-BS1. One sheet at a time.** No modal inside a modal. An alert is the only thing that may appear over a sheet, and never two alerts at once.
- **R-BS2. A resizable sheet has a grabber.** A fixed sheet does not pretend to have one.
- **R-BS3. Swipe down dismisses.** Dirty content either saves on dismiss when valid, or asks via an action sheet. Set swipe-to-close explicitly in libraries that default it off.
- **R-BS4. iOS sheet toolbar: Cancel leading, Done trailing.** Done always pairs with Cancel or Back; never all three.
- **R-BS5. Sticky CTA inside a sheet uses the sheet's footer slot and adds the bottom inset.** Never an absolutely positioned button.
- **R-BS6. Long content uses the sheet library's scroll view**, so scrolling and dragging do not fight. On iOS, scrolling expands the sheet to the next detent.
- **R-BS7. Keyboard inside a sheet is planned**: the sheet grows or the input scrolls into view; on Android the input mode is resize, not pan; Flutter pads by the view insets; SwiftUI sheets avoid the keyboard by default but a medium detent with an input also offers large.
- **R-BS8. Medium detent only for progressive disclosure** (share sheet, quick options). Composing is large only.
- **R-BS9. A sheet is not navigation** and never grows a back stack.
- Material specs: drag handle 32 x 4 dp, top corners 28 dp, max width 640 dp. iOS: system sheet, do not set corner radius by hand.

## 3. Dialogs, alerts, toasts

| Component | Blocks? | When | Max buttons |
|---|---|---|---|
| iOS alert | Yes | Error needing a decision, irreversible destructive confirm, purchase confirm | 3 |
| iOS action sheet | Yes | Options tied to an action the user just took | 4 including Cancel |
| Material dialog | Yes | Urgent information, required decision | 2 |
| Material full-screen dialog | Yes | Multi-step task on a small screen | Close plus one action |
| Snackbar | No | Brief feedback with Undo or Retry | 1 action, one at a time |
| Android toast | No | Only when the app is not in the foreground | 0 |
| Inline banner | No | Network loss, long-running state | |

Rules:

- **R-DL1. No alert to merely inform**, none at launch, none for reversible destructive actions. "Success!" with OK is a defect; use inline feedback or a snackbar with Undo.
- **R-DL2. Button placement**: iOS default action trailing (or top when stacked), Cancel leading or bottom; action sheet destructive on top, Cancel separate at the bottom. Material: actions trailing, confirm outermost, dismiss to its left.
- **R-DL3. Destructive style only for actions the user did not set out to do.** Destructive always ships with Cancel. Cancel is never the default.
- **R-DL4. Labels are one or two-word verbs** ("Delete", "Save draft"), not OK or Yes / No. Alert title two lines maximum.
- **R-DL5. Three or more choices on Android do not go in a dialog.** Use a bottom sheet list or a full-screen dialog.
- **R-DL6. Snackbar**: one at a time, queued; auto-dismiss in 4 to 10 s without an action; persists with an action; anchored above the FAB and the bottom bar; never inserted into the layout (no layout shift).
- **R-DL7. Material dialog**: width 280 to 560 dp, corners 28 dp, 8 dp between buttons. iOS alerts and action sheets are system components, never custom drawn.
- **R-DL8. iOS has no system toast.** Use inline status or a non-blocking HUD inside the safe area. Do not imitate Android toasts on iOS.

## 4. Keyboard

- **R-KB1. The focused input is always above the keyboard.** Multi-field forms live in a keyboard-aware scroll view that scrolls the focused field into view.
- **R-KB2. The sticky CTA rides up with the keyboard** and returns to the inset when it closes. It is never hidden and never floats mid-screen with the keyboard closed.
- **R-KB3. The tab bar is never pushed above the keyboard.** Hide it on keyboard, or use pan mode on Android.
- **R-KB4. Dismiss on tap outside and on scroll.** iOS supports interactive dismiss. Buttons inside a scroll view must receive the first tap (persist taps as handled).
- **R-KB5. Keyboard type matches the data** (number pad, decimal, email, phone, URL) and content type or autofill hints are set (username, password, new password, one-time code, phone, postal code) so autofill and OTP work.
- **R-KB6. Return key**: next for middle fields, done / go / search / send for the last one. Next never dismisses the keyboard.
- **R-KB7. Numeric keyboards on iOS have no return key.** Provide Done in an accessory toolbar or a sticky CTA. Accessory toolbars only carry controls relevant to the task.
- **R-KB8. Android needs resize mode** for IME insets with edge-to-edge.
- **R-KB9. Non-English free-text fields turn off autocorrect and spell check** (Vietnamese typed without diacritics gets "corrected" into other words), and the submit handler reads the text from the event, not from state that lags a keystroke.
- **R-KB10. The first field of a form is focused on open.**

## 5. Checklist (Phase 7, quote evidence per screen)

| # | Check | Rule |
|---|---|---|
| 1 | No literal status-bar or home-indicator constant; insets from the API | R-SA1 |
| 2 | Background bleeds; controls and text inside insets; last list item clears the bar | R-SA1, R-SA2, C4 |
| 3 | Sticky CTA = footer slot + max(inset, 16) | R-TZ3, R-BS5 |
| 4 | Tap targets 44 / 48 with hit slop on icon buttons | R-TT1 |
| 5 | Tab bar: sections only, never hidden, 3 to 5 | R-NV1, R-NV2 |
| 6 | One sheet at a time; grabber iff resizable; swipe to close; scrim present | R-BS1, R-BS2, R-BS3 |
| 7 | Long sheet content uses the library scroll view; keyboard plan inside sheets | R-BS6, R-BS7 |
| 8 | No informational alerts; destructive + Cancel; ≤ 3 buttons iOS, ≤ 2 Material; ≥ 3 choices use a sheet | R-DL1, R-DL3, R-DL5 |
| 9 | Snackbar anchored above bars, one at a time, no layout shift; no toast on iOS | R-DL6, R-DL8 |
| 10 | With the keyboard open: focused input visible, CTA above keyboard, tab bar not lifted | R-KB1, R-KB2, R-KB3 |
| 11 | Every input has keyboard type, content type or autofill, return key; numeric pad has Done | R-KB5, R-KB6, R-KB7 |
| 12 | Autocorrect off on non-English free text; first field focused on open | R-KB9, R-KB10 |
| 13 | Android edge-to-edge handled; one status-bar protection layer | R-SA3 |

Evidence format in the self-check: `R-KB2 ✓ app/(tabs)/add.tsx:48 KeyboardStickyView` or `R-BS5 ✗ components/FilterSheet.tsx:71 position absolute, fixed`.
