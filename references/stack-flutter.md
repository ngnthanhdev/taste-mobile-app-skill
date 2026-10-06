# Flutter stack reference

The Flutter-specific way to build screens that satisfy the layout rules (R-SA, R-NV, R-TZ, R-BS, R-DL, R-KB). The rules themselves, and the reasons for them, live in the skill's layout and navigation references. Every snippet compiles with `flutter analyze` on Flutter 3.47 stable with go_router 18.0.2. Claims marked "(verified)" were checked with widget tests on that version. On older SDKs, check each API in the installed version.

## 0. Visual implementation contract

Read `MOBILE-DESIGN.md` before choosing component variants, typography, surface treatment, image treatment, animation or navigation chrome. Its `visual_dna`, `composition` and screen inventory decide **what** a screen is; this file decides **how** to implement that on this stack, and `layout-mechanics.md` how it must behave. When a snippet below conflicts with the design file, the design file wins on appearance and this file wins on mechanics. Do not start a screen from the component list in this file.

## 1. Stack sniff

```bash
sed -n '/^environment:/,/^dev_dependencies:/p' pubspec.yaml
grep -nE "go_router|auto_route|riverpod|flutter_bloc|provider:|shadcn_ui|forui|phosphor_flutter|lucide_icons|material_symbols_icons|flex_color_scheme|google_fonts|flutter_animate|cached_network_image|fluttertoast" pubspec.yaml
grep -rlE "ThemeData\(|ThemeExtension<" lib --include=*.dart | head
grep -rnE "useMaterial3|CupertinoApp|MaterialApp(\.router)?\(" lib --include=*.dart | head
ls MOBILE-DESIGN.md docs/MOBILE-DESIGN.md 2>/dev/null
```

- **The existing stack wins.** Never add a second router, state library, UI kit or icon family. State management does not change the design work.
- **SDK floor.** Material 3 is the default from 3.16. Android edge-to-edge is the default from 3.27. On older SDKs, set `useMaterial3: true` explicitly and treat Section 3 as a migration.
- **Router.** With go_router, use Section 4 as written. With auto_route or a hand-rolled Navigator 2, map the same concepts (per-tab stacks, a root-level modal route, a redirect guard) to that API, and verify the names in the installed version.
- **UI kit.** If `shadcn_ui` or `forui` is present, its components and theme replace Material buttons, inputs, sheets and dialogs. The R-rules still apply. Check each kit's sheet and dialog parameters in source before using them.
- **Icons.** Keep one family. `lucide_icons` has not been updated since 2023; the maintained package is `lucide_icons_flutter`.
- **Theme and posture.** Find the theme with the grep above (usually `lib/theme/` or `lib/core/theme/`). A `CupertinoApp` root means an iOS posture throughout, and Material widgets inside it need a `Material` ancestor. If MOBILE-DESIGN.md exists, its tokens and posture override the defaults below.

## 2. Default architecture for new projects

- `MaterialApp.router` with `theme`/`darkTheme` from one `buildTheme(Brightness)` function (Section 8). `useMaterial3` already defaults to true (https://api.flutter.dev/flutter/material/ThemeData/useMaterial3.html).
- `ColorScheme.fromSeed(seedColor:, brightness:)` or an explicit `ColorScheme`. `TextTheme` uses at most five even sizes with explicit line heights.
- go_router with `StatefulShellRoute.indexedStack` for 3 to 5 tabs.
- Motion: implicit `Animated*` widgets first; add `flutter_animate` only for choreographed entrances. Network images: `cached_network_image` with a sized placeholder, so rows do not jump.
- Per-platform-native posture: use the `.adaptive` constructors (`Switch`, `Slider`, `Checkbox`, `Radio`, `CircularProgressIndicator`, `RefreshIndicator`, `AlertDialog`), `showAdaptiveDialog` and `Icons.adaptive`, and branch on `Theme.of(context).platform` (https://docs.flutter.dev/ui/adaptive-responsive/platform-adaptations).
- Apply `SafeArea` only to containers that hold controls, never to the root [R-SA1].

## 3. Safe area and edge-to-edge (R-SA, R-TZ, R-NV)

- **Edge-to-edge is on by default.** Apps targeting Android SDK 15+ draw edge-to-edge from Flutter 3.27. The opt-out works only on Android 15 and "might cause your app to crash" on 16+, so design for edge-to-edge (https://docs.flutter.dev/release/breaking-changes/default-systemuimode-edge-to-edge).
- **Three insets.** `MediaQuery.paddingOf` covers partly hidden areas (notch, bars). `viewInsetsOf` covers fully hidden areas (the keyboard). `viewPaddingOf` is the raw hardware inset. Flutter computes `padding = max(0, viewPadding - viewInsets)`, so `paddingOf(...).bottom` drops to 0 while the keyboard is open (https://api.flutter.dev/flutter/widgets/MediaQueryData-class.html). Prefer the `xxxOf` getters over `MediaQuery.of(context).x`, because they rebuild only when that one field changes.
- **Scaffold consumes insets for you.** It removes the body's top padding when there is an `AppBar`, and the body's bottom padding when `bottomNavigationBar` is set (verified: 0). The body ends above that slot.
- **ListView applies safe-area padding only when it has no padding of its own.** With `padding: null`, it applies the MediaQuery top and bottom padding itself (verified: first item at y=59 on a 59pt inset). With an explicit `padding`, that automatic inset is gone (first item at y=16), so add `MediaQuery.paddingOf(context)` yourself whenever no AppBar or slot absorbs it.
- **`Scaffold.extendBody: true`** is only for translucent bottom bars. The body then gets `padding.bottom` equal to the bar's height plus the inset (verified: 114 = 80 + 34), so lists must pad by `MediaQuery.paddingOf(context).bottom`. Use `extendBodyBehindAppBar: true` to put a hero image behind a transparent AppBar.
- **`NavigationBar`** is 80dp high in M3 and wraps itself in a `SafeArea` (navigation_bar.dart source). Do not add another bottom inset or SafeArea around it.
- **`SafeArea(minimum: ...)`** keeps a floor on each edge, for example 16 when the inset is 0 or the keyboard is open. `maintainBottomViewPadding: true` keeps the hardware inset while the keyboard is up.
- **Status bar icon colour [R-SA3].** An AppBar sets it through `systemOverlayStyle` or `AppBarTheme.systemOverlayStyle`. A screen without an AppBar uses `AnnotatedRegion<SystemUiOverlayStyle>`. `SystemUiOverlayStyle.dark` means dark icons, for light backgrounds. The M3 AppBar already gives scroll-under protection, so do not stack a second scrim.
- **Custom edge swipes [R-SA5].** Read `MediaQuery.systemGestureInsetsOf(context)` and keep drag targets out of that area.

```dart
// Full-bleed hero, inset controls, CTA in the thumb zone [R-SA1, R-TZ1, R-TZ3]
final top = MediaQuery.paddingOf(context).top;
return AnnotatedRegion<SystemUiOverlayStyle>(
  value: SystemUiOverlayStyle.light, // light icons over a dark hero; no AppBar sets it here
  child: Scaffold(
    body: Stack(children: [
      ListView(padding: EdgeInsets.zero, children: [hero, ...content]), // hero bleeds under the status bar
      Positioned(top: top + 8, left: 8, // control inset from the live value [R-NV4]
          child: IconButton.filledTonal(icon: const BackButtonIcon(), onPressed: () => context.pop())),
    ]),
    // The body ends above this slot, so the last row clears the CTA with no magic number.
    // Screens with text inputs must not use this slot for the CTA (Section 7).
    bottomNavigationBar: SafeArea(minimum: const EdgeInsets.fromLTRB(16, 8, 16, 16),
        child: FilledButton(onPressed: onBuy, child: const Text('Add to cart'))),
  ),
);
```

## 4. Navigation containers

The decision tree (tabs vs stack vs modal) lives in navigation.md. This section maps those choices to go_router 18 (https://pub.dev/documentation/go_router/latest/go_router/StatefulShellRoute-class.html).

```dart
final _rootKey = GlobalKey<NavigatorState>();
final router = GoRouter(
  navigatorKey: _rootKey,
  initialLocation: '/home',
  refreshListenable: auth, // a Listenable; re-runs redirect when sign-in state changes
  redirect: (context, state) {
    final atSignIn = state.matchedLocation == '/sign-in';
    if (!auth.isSignedIn) return atSignIn ? null : '/sign-in';
    return atSignIn ? '/home' : null; // null = no redirect
  },
  routes: [
    GoRoute(path: '/sign-in', builder: (context, state) => const SignInScreen()),
    StatefulShellRoute.indexedStack( // one Navigator per tab, state preserved [R-NV2]
      builder: (context, state, shell) => AppShell(shell: shell),
      branches: [
        StatefulShellBranch(routes: [
          GoRoute(path: '/home', builder: (context, state) => const HomeScreen(), routes: [
            GoRoute(path: 'item/:id', builder: (context, state) => ItemScreen(id: state.pathParameters['id']!)),
          ]),
        ]),
        StatefulShellBranch(routes: [GoRoute(path: '/profile', builder: (context, state) => const ProfileScreen())]),
      ],
    ),
    GoRoute(path: '/compose', parentNavigatorKey: _rootKey, // covers the tab bar
        pageBuilder: (context, state) => const MaterialPage(fullscreenDialog: true, child: ComposeScreen())),
  ],
);
// AppShell: Scaffold(body: shell, bottomNavigationBar: NavigationBar(selectedIndex: shell.currentIndex,
//   onDestinationSelected: (i) => shell.goBranch(i, initialLocation: i == shell.currentIndex), ...))
```

- **Pushes.** `context.push('/home/item/42')` pushes a detail inside the current tab and keeps the bar. `context.go` replaces the location; use it for tab and auth jumps. Re-tapping the active tab returns it to its root through `initialLocation: true`.
- **Bar contents.** The bar holds destinations only [R-NV1]. Actions go in the AppBar `actions` or a FAB. Each tab screen owns its own `Scaffold` and `AppBar`.
- **Full-screen dialogs.** `fullscreenDialog: true` makes the AppBar show a close button instead of back [R-NV4]. Use it for create and compose flows and for multi-step forms.
- **Deep links.** Flutter's deep-link handler is on by default. Set up App Links and Universal Links (https://docs.flutter.dev/ui/navigation/deep-linking). A link to a deleted item must show a not-found screen with a close action, via `errorBuilder` or an in-screen empty state.

## 5. Bottom sheet (R-BS)

These defaults were read from bottom_sheet.dart and confirmed with tests. In M3 the sheet has a 28dp top radius, a 640dp max width and a 32x4 drag handle, so do not restate them. With `isScrollControlled: false`, height is capped at 9/16 of the screen. `useSafeArea` defaults to false, and when true it covers top, left and right only. Inside the sheet, `paddingOf(ctx).bottom` is still 34, so the footer must apply the bottom inset itself [R-BS5] (https://api.flutter.dev/flutter/material/showModalBottomSheet.html).

```dart
Future<T?> showAppSheet<T>(BuildContext context, {required ScrollableWidgetBuilder builder}) {
  return showModalBottomSheet<T>(
    context: context,
    isScrollControlled: true, // lifts the 9/16 cap; required for keyboards and detents
    useSafeArea: true,        // keeps the sheet below the status bar
    showDragHandle: true,     // resizable sheets need a grabber [R-BS2]
    builder: (ctx) => Padding(
      padding: EdgeInsets.only(bottom: MediaQuery.viewInsetsOf(ctx).bottom), // keyboard [R-BS7]
      child: DraggableScrollableSheet(
        expand: false, initialChildSize: 0.5, minChildSize: 0.3, maxChildSize: 1.0,
        snap: true, snapSizes: const [0.5], // detents
        builder: builder, // the ScrollController MUST drive the inner list [R-BS6]
      ),
    ),
  );
}
// Body: Column([Expanded(ListView(controller: controller, ...)),
//   SafeArea(top: false, minimum: EdgeInsets.fromLTRB(16, 8, 16, 16), child: FilledButton(...))]) [R-BS5]
```

- **One sheet at a time [R-BS1].** To chain sheets, `await` the first sheet's result, then open the next. Never navigate with a sheet or nest a deep hierarchy in one [R-BS9].
- **Unsaved changes [R-BS3] (verified).** `PopScope(canPop: false)` blocks the back button and a barrier tap, but not drag-to-dismiss. For editor sheets, pass `enableDrag: false` at show time and confirm through `PopScope.onPopInvokedWithResult`. The other route is to keep drag enabled and save the draft when the future resolves to `null`.
- **Non-modal sheets.** `showBottomSheet` (nearest Scaffold, no scrim) returns a `PersistentBottomSheetController`.
- **iOS posture.** For choices about an action, use `showCupertinoModalPopup` with a `CupertinoActionSheet` (at most 4 actions including Cancel, destructive on top [R-DL2]). For a page sheet, use `showCupertinoSheet(scrollableBuilder:)`; `builder` is deprecated after 3.40, so verify in the installed version.

## 6. Dialogs, alerts, snackbars (R-DL)

```dart
Future<bool> confirmDelete(BuildContext context, String name) async {
  final ios = Theme.of(context).platform == TargetPlatform.iOS;
  Widget action(BuildContext ctx, String label, bool value, {bool destructive = false}) => ios
      ? CupertinoDialogAction(isDestructiveAction: destructive, onPressed: () => Navigator.pop(ctx, value), child: Text(label))
      : TextButton(onPressed: () => Navigator.pop(ctx, value), child: Text(label));
  final ok = await showAdaptiveDialog<bool>(context: context, builder: (ctx) => AlertDialog.adaptive(
    title: Text('Delete "$name"?'), content: const Text('This cannot be undone.'),
    actions: [action(ctx, 'Cancel', false), action(ctx, 'Delete', true, destructive: true)], // confirm trailing [R-DL2]
  ));
  return ok ?? false;
}
```

- **Actions.** Use at most two actions, with the confirm action trailing and a 1-2 word verb label [R-DL4]. With three or more choices, use a list bottom sheet on Android or an action sheet on iOS [R-DL5]. `AlertDialog.adaptive` becomes a `CupertinoAlertDialog` on iOS and macOS and ignores Material-only parameters (https://api.flutter.dev/flutter/material/AlertDialog/AlertDialog.adaptive.html).
- **Undo instead of alerts.** A reversible destructive action gets a snackbar with Undo, not an alert [R-DL1]: `ScaffoldMessenger.of(context)..hideCurrentSnackBar()..showSnackBar(SnackBar(content: ..., behavior: SnackBarBehavior.floating, action: SnackBarAction(label: 'Undo', onPressed: undo)))`. Show one at a time [R-DL6].
- **Snackbar defaults (verified).** The M3 default behavior is `fixed`. Duration is 4s. A snackbar with an action persists until the user acts (the `persist` default; verify `persist` in the installed version). Set `persist: false` plus a `duration` to auto-hide. Both behaviors sit above a `NavigationBar`, and `floating` also floats above a bottom FAB.
- **Nested Scaffold trap (verified).** A snackbar called from a tab screen's inner Scaffold renders on the shell Scaffold and covers that inner FAB. Wrap a tab screen that owns a FAB in its own `ScaffoldMessenger`.
- **Full-screen dialogs.** `Dialog.fullscreen(child: ...)` through `showDialog` serves multi-step tasks or forms on small screens, with a close button plus one action in its header.
- **No toasts.** Do not use `fluttertoast` or any toast while the app is in the foreground. On iOS, show inline status instead [R-DL8].

## 7. Keyboard (R-KB)

- **Keyboard avoidance.** `Scaffold.resizeToAvoidBottomInset` defaults to true, so the body shrinks by `viewInsets.bottom` (https://api.flutter.dev/flutter/material/Scaffold/resizeToAvoidBottomInset.html). Never set it to false to silence an overflow stripe; make the body scrollable instead.
- **Sticky CTA (verified).** The `bottomNavigationBar` slot does not rise with the keyboard; it stays at the screen bottom, behind the keyboard (scaffold.dart positions it at `bottom - bottomWidgetsHeight`). This keeps tab bars hidden [R-KB3], but a CTA placed there gets covered. Put a sticky CTA at the end of the body's `Column` inside `SafeArea(minimum:)`. With the keyboard open it sits 16 above it, and with the keyboard closed it clears the home indicator [R-KB2]. The same holds inside a tab shell.
- **Scroll to focus.** `TextField.scrollPadding` defaults to `EdgeInsets.all(20)` around the focused field [R-KB1]. Raise the bottom value when a sticky CTA covers it.
- **Dismissal [R-KB4].** Use `keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag`. On mobile, a touch outside does not unfocus a field by default (https://api.flutter.dev/flutter/widgets/EditableText/onTapOutside.html), so set `onTapOutside`.
- **Field types and autofill [R-KB5, R-KB6].** Set `keyboardType` per field, `autofillHints` inside an `AutofillGroup`, and `textInputAction`. `next` moves focus without extra code (verified), and the last field gets `done` plus `onSubmitted`. Wrap multi-column forms in `FocusTraversalGroup` to control the order. For non-English free text, set `autocorrect: false` and `enableSuggestions: false` on capture fields.
- **Numeric keyboards [R-KB7].** The iOS number pad has no return key, so `TextInputAction.done` cannot close it. Provide the sticky CTA or a Done control.

```dart
void unfocus(PointerDownEvent _) => FocusManager.instance.primaryFocus?.unfocus();
return Scaffold(
  appBar: AppBar(title: const Text('Create account')),
  body: Column(children: [
    Expanded(child: AutofillGroup(child: ListView(
      keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
      padding: const EdgeInsets.all(16),
      children: [
        TextField(autofocus: true, keyboardType: TextInputType.emailAddress, autocorrect: false,
            autofillHints: const [AutofillHints.email], textInputAction: TextInputAction.next,
            onTapOutside: unfocus, decoration: const InputDecoration(labelText: 'Email')),
        const SizedBox(height: 16),
        TextField(obscureText: true, autofillHints: const [AutofillHints.newPassword],
            textInputAction: TextInputAction.done, onSubmitted: (_) => submit(),
            onTapOutside: unfocus, decoration: const InputDecoration(labelText: 'Password')),
      ],
    ))),
    SafeArea(top: false, minimum: const EdgeInsets.fromLTRB(16, 8, 16, 16), // body, not bottomNavigationBar
        child: SizedBox(width: double.infinity, child: FilledButton(onPressed: submit, child: const Text('Continue')))),
  ]),
);
```

## 8. Visual tokens in code

`ThemeData` is the single source. Screens read `Theme.of(context).colorScheme`, `textTheme` and `extension<AppTokens>()`, never `Color(0xFF...)` or `fontSize:` literals. Map every one of the 15 `TextTheme` slots onto five sizes, so AppBar titles and button labels follow the scale too.

```dart
@immutable
class AppTokens extends ThemeExtension<AppTokens> { // spacing and radius by role
  const AppTokens({this.gap = 8, this.pad = 16, this.radiusControl = 12, this.radiusCard = 16});
  final double gap, pad, radiusControl, radiusCard;
  @override
  AppTokens copyWith({double? gap, double? pad, double? radiusControl, double? radiusCard}) => AppTokens(gap: gap ?? this.gap,
      pad: pad ?? this.pad, radiusControl: radiusControl ?? this.radiusControl, radiusCard: radiusCard ?? this.radiusCard);
  @override
  AppTokens lerp(covariant AppTokens? other, double t) => other ?? this; // discrete tokens
}
ThemeData buildTheme(Brightness b) {
  const xl = TextStyle(fontSize: 24, height: 32 / 24, fontWeight: FontWeight.w600);
  const lg = TextStyle(fontSize: 18, height: 24 / 18, fontWeight: FontWeight.w600);
  const md = TextStyle(fontSize: 16, height: 24 / 16), sm = TextStyle(fontSize: 14, height: 20 / 14);
  const xs = TextStyle(fontSize: 12, height: 16 / 12, fontWeight: FontWeight.w500);
  const t = AppTokens();
  return ThemeData(
    colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF2F6BFF), brightness: b),
    textTheme: const TextTheme(displayLarge: xl, displayMedium: xl, displaySmall: xl, headlineLarge: xl,
        headlineMedium: xl, headlineSmall: xl, titleLarge: lg, titleMedium: md, titleSmall: sm,
        bodyLarge: md, bodyMedium: sm, bodySmall: xs, labelLarge: sm, labelMedium: xs, labelSmall: xs),
    extensions: const [t],
    cardTheme: CardThemeData(elevation: 0, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(t.radiusCard))),
    filledButtonTheme: FilledButtonThemeData(style: FilledButton.styleFrom(minimumSize: const Size(64, 48),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(t.radiusControl)))),
  );
}
```

- **Text scaling.** Respect `MediaQuery.textScalerOf`. Never clamp `minScaleFactor` below 1.0 or use `TextScaler.noScaling` on content. Avoid a `maxScaleFactor` clamp; if one fixed-size element truly needs it, clamp only that element. `textScaleFactor` is deprecated in favour of `textScaler`. Layouts must reflow at 200%.
- **Component themes.** Use `CardThemeData`, `FilledButtonThemeData`, `InputDecorationTheme` and the like; older SDKs take `CardTheme`. Do not pass `shape:` per screen.
- **Elevation and status colours.** M3 separates surfaces with tonal `surfaceContainer*` roles rather than shadows. Keep elevation to the component defaults plus at most one raised level. Give each semantic status one colour app-wide, stored in `AppTokens` or the `ColorScheme`.
- **Touch feedback and icons.** Make tappable custom surfaces `InkWell` inside `Material`, or Material buttons, so they get ripple and focus, with hit areas of at least 48x48dp. Use one icon family (Material Symbols, Phosphor or Lucide) and no emoji in UI strings.

## 9. Motion and feedback

- **Durations and curves.** Keep durations between 150 and 300ms; M3 tokens `Durations.short4` (200ms) and `Durations.medium2` (300ms) exist. Use `Curves.easeOutCubic` or `Easing.emphasizedDecelerate` for entrances and `Curves.easeInOutCubicEmphasized` for moves. Reach for `AnimatedContainer`, `AnimatedOpacity`, `AnimatedSize` and `AnimatedSwitcher` before explicit controllers.
- **Content swaps.** For segments and number changes, use `AnimatedSwitcher(duration: Durations.short4, child: KeyedSubtree(key: ValueKey(index), child: ...))`. For a cross-fade between shell tabs, use `StatefulShellRoute(navigatorContainerBuilder: ...)`. Do not wrap the `StatefulNavigationShell` in an `AnimatedSwitcher`, which breaks the preserved branch state.
- **List to detail.** Wrap the shared element in `Hero(tag: 'item-$id')`. The tag must be unique within a route.
- **Reduced motion.** `MediaQuery.disableAnimationsOf(context)` is true when the platform asks for reduced animation; then use `Duration.zero` or a plain fade. `accessibleNavigationOf` is true under TalkBack or VoiceOver; skip auto-advancing carousels then.
- **Haptics.** Use `HapticFeedback.selectionClick()` for pickers and segments, `lightImpact()` for toggles, and one `mediumImpact()` on success. `successNotification()` is newer, so verify it in the installed version. Never fire haptics on plain navigation.
- **Page transitions.** `PageTransitionsTheme` already uses the platform's native transition (Zoom on Android, Cupertino on iOS). Override it only when the posture asks for it, for example `PredictiveBackPageTransitionsBuilder` (Android U+, falls back elsewhere). Predictive back itself needs `android:enableOnBackInvokedCallback="true"` in AndroidManifest.xml (https://docs.flutter.dev/platform-integration/android/predictive-back).

## 10. Stack-specific grep checks

Run these from the project root before handing off. Each hit needs a fix or a one-line justification in the handoff.

```bash
D="--include=*.dart"
echo "== inline colors outside theme";        grep -rnE "Color\(0x|Color\.from(ARGB|RGBO)" lib $D | grep -v "lib/theme/"
echo "== magic inset literals [R-SA1,R-TZ3]";  grep -rnE "(top|bottom): *(20|24|34|4[0-9]|5[0-9]|6[0-9])(\.0)?[,)]" lib $D
echo "== SafeArea wrapping Scaffold [R-SA1]";  grep -rn -A2 "SafeArea(" lib $D | grep "Scaffold("
echo "== fontSize outside theme (target 0)";   grep -rnE "fontSize: *[0-9.]+" lib $D | grep -v "lib/theme/"
echo "== distinct font sizes (target <= 5)";   grep -rhoE "fontSize: *[0-9.]+" lib $D | grep -oE "[0-9.]+" | sort -n | uniq -c
echo "== dialogs, review [R-DL1,R-DL5]";       grep -rnE "show(Adaptive|Cupertino)?Dialog[<(]" lib $D
echo "== toasts [R-DL8]";                      grep -rnE "fluttertoast|showToast" lib pubspec.yaml
echo "== unbounded lists in SingleChildScrollView (use ListView.builder)"
for f in $(grep -rlE "SingleChildScrollView" lib $D); do grep -nHE "\.map\(|for \(final|List\.generate" "$f"; done
echo "== text scale clamps / legacy API";      grep -rnE "textScaleFactor|TextScaler\.(noScaling|linear)|(min|max)ScaleFactor" lib $D
echo "== keyboard avoidance off [R-KB1]";      grep -rnE "resizeToAvoidBottomInset: *false" lib $D
echo "== emoji in source (use icons)"
find lib -name "*.dart" -exec perl -CSD -ne 'print "$ARGV:$.: $_" if /[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]/; close ARGV if eof' {} +
```

If the theme lives elsewhere, change `lib/theme/` to match. Then run `flutter analyze`. Before calling a screen done, check it on a small phone with the keyboard open, at 200% text and in landscape.
