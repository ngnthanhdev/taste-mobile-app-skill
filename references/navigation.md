# Navigation

Navigation is information architecture, designed before screens and written down as a **Nav Read** that the code is later diffed against. Getting it wrong produces the second most recognizable AI tell after the indigo gradient: five tabs plus a center button regardless of what the app does, a Settings tab, a Logout tab, sheets used as navigation, and modals inside modals.

## 1. The Nav Read

```
NAV READ
platforms: <targets, each tiered: first-class | best-effort | none>
tabs (<n>): <Label> · <Label> · …            (or "no tabs: <pattern and reason>")
routes:
  <route>            <container>  → <what it pushes or presents>
  …
entry points: <routes reached from header buttons, inline affordances, FAB>: route ← affordance (screen)
sheets: <named sheets and which screens present them, or "none">
modals: <named modals, presentation style, dirty-state behavior>
full-screen groups: <auth, onboarding, player, camera, checkout …>
deep links: <public routes>
android back: default pop | <declared exceptions, e.g. compose confirms discard>
max taps to any core screen: <n>
```

Every line is a commitment the self-check diffs against the code. If the app has no tabs (a single-flow utility such as a camera-first scanner), say so and name the pattern (stack only, or full-screen plus sheets).

## 2. Container decision tree

Evaluate in order; first match wins.

1. **Tab root.** A top-level destination the user returns to repeatedly, a peer of the other destinations, with its own navigation state.
   - 3 to 5 tabs. Two destinations means no tab bar: use one stack with header affordances. Six candidates means the IA is wrong: merge or demote. Tabs hold **sections, never actions** [R-NV1].
   - Each tab owns a stack. Switching tabs preserves each stack. Tapping the active tab scrolls to top or pops to root.
   - Tabs are never hidden or disabled [R-NV2]. No Settings tab, no Logout tab, no Profile tab in a single-user app.
2. **Push.** Drill-down with a clear parent: list to detail, detail to sub-detail, settings to sub-setting. The screen answers "more about what I was just looking at". Native header with back; title is the thing, not the app. Push chains deeper than three usually signal a missing modal or tab.
3. **Modal.** A self-contained task that creates or edits something and returns: compose, add item, edit profile, a cross-tab action. iOS page sheet by default; full-screen only for immersive tasks. A modal may contain at most **one** internal push. Two or more means it is a flow and gets its own route group. Dirty-state modals confirm discard on dismiss, or save on dismiss when the draft is valid (the way Notes does), and declare which under `android back`.
4. **Bottom sheet.** The parent must stay visible; a lightweight choice, preview or action menu; less than one screen of content; **no internal navigation** [R-BS9]. The moment a sheet needs a back stack, a search field with results, or a second step, it should have been a modal. A screen presenting more than two distinct sheets is hiding IA in sheets. One sheet at a time [R-BS1].
5. **Full-screen group.** Immersive or blocking: camera, media viewer, player, paywall, onboarding, auth, multi-step checkout. Its own stack, no tab bar, an explicit close affordance (X or Done; swipe alone is not an affordance), and a declared discard rule.

Filters are the usual gray zone: a handful of toggles is a sheet; a filter UI with its own search, steps or more than about six controls is a modal.

## 3. Entry points and the primary action

- Each tab root has at most one primary creation action. Put it in the header (iOS) or as a FAB (Android, only when creating is the dominant task of that screen). A FAB must not cover list content or collide with the tab bar; reserve bottom padding for it.
- "+" buttons preset the new item from the context the user is looking at (selected day, active filter).
- Settings live behind Profile or a header gear, never as a tab.
- The core job-to-be-done screen is reachable in **two taps or fewer** from a tab root.

## 4. Auth and onboarding placement

- Auth and onboarding are **route groups** gated in the group layout (redirect when a session exists), never conditional renders that swap screens inside a component.
- Sign-in is delayed as long as the product allows (see `patterns.md` §2). The default Nav Read puts `(auth)` after the first value moment, not before Home.
- Onboarding is a group only when it collects real inputs; otherwise there is no onboarding group at all.

## 5. Deep links and cold start

Every public detail screen is a parameterized route. A cold-start deep link must land with a sane back stack (the parent tab root), never on an orphan screen. A link to a deleted item lands on an explained "not found" with a way out, not a blank screen.

## 6. Platform back behavior

- iOS: the left-edge swipe back stays alive on every pushed screen; never override it with a custom gesture.
- Android: hardware and gesture back equals header back everywhere. The only declared overrides are discard confirmations on dirty modals and leaving a full-screen group (player, checkout), and each is listed in the Nav Read.

## 7. Mechanical checks (Phase 7)

- [ ] Tab count 3 to 5, or a declared no-tab pattern; labels one word; tabs always visible
- [ ] No Settings, Logout or Profile tab without a product reason; no FAB without one dominant create action
- [ ] Every core screen reachable in two taps or fewer from a tab root
- [ ] No nested tab bars; no screen with two headers
- [ ] Every modal has an explicit close affordance and at most one internal push
- [ ] Sheets have no internal navigation; at most two distinct sheets per screen; never two sheets open at once
- [ ] Auth and onboarding are route groups gated in the layout
- [ ] Every detail screen is deep-linkable with a sane cold-start back stack
- [ ] Android back exceptions in code match the Nav Read exactly
- [ ] Route tree in code matches the Nav Read (diff them and quote the diff)

## 8. Worked example

Companion app for a solar inverter, homeowners first, installers second:

```
NAV READ
platforms: iOS first-class, Android first-class, web none
tabs (3): Home · History · System
routes:
  (tabs)/home          tab root  → push alert/[id]
  (tabs)/history       tab root  → push day/[date]
  (tabs)/system        tab root  → push device/[id] → push device/[id]/settings
  alert/[id]           push
  device/[id]          push (bar stays)
  pair-device          full-screen group (camera + 3 steps, X confirms abandon)
  (auth)/sign-in       group, gated in layout, reached after first live reading is shown
entry points: pair-device ← "Add device" header button (System); support ← header "?" (Home)
sheets: range-picker (History), export-options (History)
modals: edit-tariff (page sheet, saves on dismiss when valid)
deep links: /device/:id, /day/:date, /alert/:id
android back: default pop; pair-device confirms abandon; edit-tariff saves on dismiss
max taps to any core screen: 2
```

Three tabs, not five: there is no social layer and no profile. Installers get the same tree with denser lists. Pairing is a full-screen group because it owns the camera and has three steps.
