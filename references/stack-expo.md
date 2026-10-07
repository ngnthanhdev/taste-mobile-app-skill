# Stack: Expo / React Native

How to build screens in Expo / React Native. Rule IDs such as [R-SA1] and [R-BS5] come from the layout mechanics rules; this file maps them to code. APIs here change between releases. Where a claim has a URL, check the installed version and that page before relying on it. Claims marked (verified) were checked on Expo SDK 57 with Expo Router 57.0.25 in Expo Go on an iOS 26 simulator on 2026-10-07.

## 0. Visual implementation contract

Read `MOBILE-DESIGN.md` before choosing component variants, typography, surface treatment, image treatment, animation or navigation chrome. Its `visual_dna`, `composition` and screen inventory decide **what** a screen is; this file decides **how** to implement that on this stack, and `layout-mechanics.md` how it must behave. When a snippet below conflicts with the design file, the design file wins on appearance and this file wins on mechanics. Do not start a screen from the component list in this file.

## 1. Stack sniff (existing project)

Read these before writing a screen. The existing stack always wins over the defaults in section 2. Never add a second library for something the project already handles.

| Read | Decide |
|---|---|
| `package.json` | `expo` SDK, `react-native`, `expo-router` vs a bare `@react-navigation/*` setup (from Expo Router 57 the navigators are vendored inside `expo-router`, so `@react-navigation/*` in dependencies means an older router or a non-router project), Reanimated major, and whether keyboard-controller, `@gorhom/bottom-sheet`, FlashList, `expo-image`, `expo-haptics` are present |
| `app.json` / `app.config.(js\|ts)` | `scheme` (deep links), `experiments.typedRoutes`, `android.softwareKeyboardLayoutMode`, `userInterfaceStyle`, plugins |
| `app/_layout.tsx` | Expo Router is in use. If there is no `app/`, find the `NavigationContainer` and navigator files |
| Styling, tokens | `nativewind` + `tailwind.config.*`, `tamagui.config.*`, a `react-native-paper` theme, or `StyleSheet` + a theme module. Tokens live in `theme.ts`, `tokens.ts`, `constants/Colors.ts` or Tailwind `theme.extend` |
| Icons | Which single family is imported (`expo-symbols`, `@expo/vector-icons/<Set>`, `lucide-react-native`, `phosphor-react-native`). Keep using it and never mix families |
| `MOBILE-DESIGN.md` | The design contract: tokens, posture, past decisions. Read it first and follow it |
| `expo-dev-client`, `eas.json` | Whether a dev build exists. If the project runs only in Expo Go, native-module defaults need a dev build. Ask before switching |

## 2. Default architecture (new projects)

- Expo + TypeScript + Expo Router (`app/` directory, file-based routes). Expo SDK 55+ always runs the New Architecture: https://docs.expo.dev/guides/new-architecture/
- `react-native-safe-area-context`. It is installed with Expo Router, which also provides `SafeAreaProvider`: https://docs.expo.dev/develop/user-interface/safe-areas/
- `react-native-keyboard-controller`. It needs Reanimated. It is included in Expo Go on SDK 57 (verified: `KeyboardProvider`, `KeyboardAwareScrollView`, `KeyboardStickyView` and `KeyboardToolbar` all ran in Expo Go); on older SDKs or with other native modules a development build is still required: https://docs.expo.dev/guides/keyboard-handling/
- `@gorhom/bottom-sheet` (v5) on Reanimated + Gesture Handler: https://gorhom.dev/react-native-bottom-sheet/. Reanimated 4.x runs only on the New Architecture and needs `react-native-worklets`: https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/
- `expo-image` (`placeholder`, plus `recyclingKey` in list cells), `@shopify/flash-list` for any unbounded list (`ScrollView` only for short fixed content), `expo-haptics`.
- One icon family: `expo-symbols` (SF Symbols on iOS, Material Symbols on Android, still beta) for an iOS-native look. Otherwise one `@expo/vector-icons` set, Lucide RN or Phosphor RN. Use one size and one stroke weight across the app, and never use emoji as icons.

```bash
npx expo install react-native-safe-area-context react-native-keyboard-controller @gorhom/bottom-sheet \
  react-native-reanimated react-native-worklets react-native-gesture-handler \
  expo-image @shopify/flash-list expo-haptics expo-symbols expo-dev-client
npx expo run:ios   # or an EAS development build when a native module is not in Expo Go
```

Install recovery (verified on npm 11): `npx expo install` writes the matching versions to `package.json` but its own npm step can fail with `EALLOWSCRIPTS` or `ERESOLVE`. Then run `npm install --no-audit --no-fund --legacy-peer-deps` yourself and check `npm ls --depth=0` for `UNMET`. If Metro fails with `Cannot find module 'babel-preset-expo'`, add it as a devDependency the same way. Reanimated 4 needs `react-native-worklets/plugin` in `babel.config.js`:

```js
module.exports = (api) => { api.cache(true); return { presets: ['babel-preset-expo'], plugins: ['react-native-worklets/plugin'] }; };
```

`npx expo install` picks versions that match the installed SDK. Do not hand-pin versions you have not checked. Set up the providers once in the root layout:

```tsx
// app/_layout.tsx
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <BottomSheetModalProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="compose" options={{ presentation: 'modal' }} />
          </Stack>
        </BottomSheetModalProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
```

## 3. Safe area [R-SA1..R-SA5, R-TZ1..R-TZ3, R-NV2]

- Read insets with `useSafeAreaInsets()`. Never write `paddingTop: 44/47/50`: the iPhone top inset ranges from 47 to 68pt and Android OEMs differ [R-SA1].
- Never import `SafeAreaView` from `react-native`. It is deprecated and iOS-only (https://reactnative.dev/docs/safeareaview). If you want the component, use the one from `react-native-safe-area-context` with explicit `edges`.
- Apply insets to the containers that hold controls (header row, sticky CTA, floating banner), never to the root. Backgrounds, hero images and scrolling lists extend under the system bars [R-SA1]. On iOS 26, do not paint a solid fill under the tab bar or toolbar [R-SA2]. Android apps targeting SDK 35+ are edge-to-edge [R-SA3][R-SA4].
- A visible navigator header already includes the top inset. Do not add `insets.top` again. Inside a `modal` or `formSheet` page on iOS the sheet already starts below the status bar, yet `useSafeAreaInsets()` still reports the full top inset there (verified), so a custom bar in a modal must skip the inset on iOS and keep it on Android, where the modal covers the status bar: `paddingTop: Platform.OS === 'ios' ? 0 : insets.top`.
- Give a sticky CTA `paddingBottom: Math.max(insets.bottom, 16)` and keep it in the bottom half of the screen [R-TZ1][R-TZ2][R-TZ3]. Tap targets are at least 44pt on iOS and 48dp on Android. Extend small icon buttons with `hitSlop`.
- Tab screens: derive every bottom offset (last list row, FAB, floating banner) from one number. With the default JS `Tabs`, content ends above the bar (verified), so add only your own gap; adding the bar height too pushes a snackbar a full bar height above the bar. When the bar overlays content (`tabBarStyle: { position: 'absolute' }` with blur), use `useBottomTabBarHeight() + gap`, imported from `expo-router/tabs` on Expo Router 57+ (`@react-navigation/bottom-tabs` is not installed there). That hook already includes the bottom inset (verify in the installed version): https://reactnavigation.org/docs/bottom-tab-navigator/. NativeTabs adjust content insets automatically: https://docs.expo.dev/router/advanced/native-tabs/
- The tab bar must never ride up on the keyboard. Use `tabBarHideOnKeyboard: true`, or set `"softwareKeyboardLayoutMode": "pan"` under `android` in app.json [R-KB3].

```tsx
export function Screen({ header, children, footer }: ScreenProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>{/* the background extends edge to edge */}
      <View style={{ paddingTop: insets.top, paddingHorizontal: 16 }}>{header}</View>
      <View style={{ flex: 1 }}>{children}</View>
      {footer ? (
        <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: Math.max(insets.bottom, 16) }}>{footer}</View>
      ) : null}
    </View>
  );
}
```

## 4. Navigation containers (Expo mapping)

The skill's navigation reference decides the structure. This section maps that structure to Expo Router.

```text
app/_layout.tsx               root Stack: (tabs), (auth), (onboarding) groups, modals
app/(auth)/_layout.tsx        Stack: sign-in, sign-up      (group, adds no URL segment)
app/(tabs)/_layout.tsx        Tabs: 3-5 destinations
app/(tabs)/home/_layout.tsx   per-tab Stack, so each tab keeps its own history
app/(tabs)/home/[id].tsx      detail, opened by deep link too
app/compose.tsx               presentation: 'modal', registered on the root Stack so it covers the tab bar
app/+not-found.tsx            explains what happened and offers a way out, never a blank screen
```

- Tabs only navigate; actions go in a toolbar or header [R-NV1]. Never hide or disable a tab [R-NV2]. Hide helper routes with `href: null`. The header has one primary action on the trailing side [R-NV3]. Back and close use standard symbols, never the words "Back" or "Close" [R-NV4].
- `presentation` values: `card`, `modal`, `transparentModal`, `containedModal`, `fullScreenModal`, `formSheet`. Configure `formSheet` with `sheetAllowedDetents` (fractions or `'fitToContents'`), `sheetInitialDetentIndex`, `sheetGrabberVisible` (iOS), `sheetCornerRadius`. Android allows at most 3 detents, with no native header or nested stack inside: https://docs.expo.dev/router/advanced/modals/
- Gate auth by redirecting between groups with `<Redirect href=...>` or the project's existing guard. The NativeTabs import path depends on the SDK version (`unstable-native-tabs` before SDK 58), and Android allows at most 5 native tabs.
- **Expo Router 57 vendors React Navigation.** Do not add `@react-navigation/*` packages; import from the router's entry points instead (verified): `useBottomTabBarHeight` from `expo-router/tabs`, `usePreventRemove` and the theming helpers from `expo-router/react-navigation`, `useNavigation`, `useFocusEffect` and `useRouter` from `expo-router`. The `router` object has no `dispatch`; the confirm-discard pattern for a dirty modal uses the navigation object:

```tsx
const navigation = useNavigation();
usePreventRemove(dirty && !saving, ({ data }: { data: { action: Parameters<typeof navigation.dispatch>[0] } }) => {
  Alert.alert('Discard this draft?', 'Unsaved changes will be lost.', [
    { text: 'Keep editing', style: 'cancel' },
    { text: 'Discard', style: 'destructive', onPress: () => navigation.dispatch(data.action) },
  ]);
});
```
- Typed routes: set `experiments.typedRoutes: true` (beta, off by default except in the quick-start template): https://docs.expo.dev/router/reference/typed-routes/
- Deep links: set `scheme`, and every file becomes a URL. A link to a deleted item lands on a screen that explains it and offers close. Rewrite incoming links in `+native-intent`.

## 5. Bottom sheet [R-BS1..R-BS9]

- One sheet at a time [R-BS1]. `BottomSheetModal` opens with `ref.current?.present()`. Its `stackBehavior` defaults to `'switch'`; never use `'push'`. Never use a sheet for navigation [R-BS9].
- The scrim is **null by default**. Always pass `backdropComponent` with `BottomSheetBackdrop`. `enablePanDownToClose` defaults to `false`, so set it [R-BS3]. When a draft has changed, save it on dismiss if it is valid, or confirm before closing.
- Keep the default handle (the grabber) on any resizable sheet [R-BS2]. `enableDynamicSizing` defaults to `true`, which sizes the sheet to its content. For forms, set fixed `snapPoints` with `enableDynamicSizing={false}`. Compose and authoring content uses only a large snap point [R-BS8].
- Long content goes in `BottomSheetScrollView` or `BottomSheetFlatList` [R-BS6]. A sticky CTA goes in `footerComponent` with `BottomSheetFooter` and `bottomInset={insets.bottom}`, never `position: 'absolute', bottom: 20` [R-BS5].
- Inputs: `BottomSheetTextInput`, `keyboardBehavior="interactive"`, `keyboardBlurBehavior="restore"`, `android_keyboardInputMode="adjustResize"` (the default is `adjustPan`) [R-BS7]. Props: https://gorhom.dev/react-native-bottom-sheet/props
- When the sheet is its own route and needs no custom footer, Expo Router `presentation: 'formSheet'` gives a native sheet with the system radius and grabber on iOS.

```tsx
export function EditSheet({ sheetRef, onSave }: { sheetRef: RefObject<BottomSheetModal | null>; onSave: () => void }) {
  const insets = useSafeAreaInsets();
  const renderBackdrop = useCallback(
    (p: BottomSheetBackdropProps) => <BottomSheetBackdrop {...p} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />, []);
  const renderFooter = useCallback((p: BottomSheetFooterProps) => (
    <BottomSheetFooter {...p} bottomInset={insets.bottom}>
      <View style={{ paddingHorizontal: 16, paddingTop: 8 }}><PrimaryButton label="Save" onPress={onSave} /></View>
    </BottomSheetFooter>), [insets.bottom, onSave]);
  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={['90%']}
      enableDynamicSizing={false}
      enablePanDownToClose
      topInset={insets.top}
      backdropComponent={renderBackdrop}
      footerComponent={renderFooter}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backgroundStyle={{ backgroundColor: colors.surface, borderRadius: radius.sheet }}
    >
      <BottomSheetScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: CTA_HEIGHT + insets.bottom + 16 }}>
        <BottomSheetTextInput placeholder="Title" returnKeyType="done" style={inputStyle} />
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
```

## 6. Dialogs, alerts, toasts [R-DL1..R-DL8]

- Use `Alert.alert` only for errors that need action and for destructive confirms that cannot be undone [R-DL1]. Use at most 3 buttons (Android's limit, https://reactnative.dev/docs/alert). A `'destructive'` button always comes with a `'cancel'` button, and Cancel is never the default [R-DL3]. Labels are 1-2 word verbs, not "OK" or "Yes/No" [R-DL4]. Never use an alert just for "Saved!" or when the app opens.
- A choice related to an action the user just took: on iOS, `ActionSheetIOS.showActionSheetWithOptions` (max 4 options including Cancel, destructive on top). On Android, or for three or more options, use a gorhom sheet list [R-DL2][R-DL5].
- iOS has no system toast [R-DL8]. Give feedback with an inline status, or with one app-level floating banner that sits above the tab bar (offset from the measured bar height), does not block taps, and shows one message at a time from a queue. It hides itself after 4-10s if it has no action, and stays until handled if it has one (Undo, Retry) [R-DL6]. Never insert a banner into the layout, because the content below jumps when it leaves.

```tsx
Alert.alert('Delete project?', 'Its 12 tasks will be removed. This cannot be undone.', [
  { text: 'Cancel', style: 'cancel' },
  { text: 'Delete', style: 'destructive', onPress: deleteProject },
]);
```

## 7. Keyboard [R-KB1..R-KB8]

- Wrap the app in `KeyboardProvider` once (section 2). Forms use `KeyboardAwareScrollView` with `bottomOffset` and `keyboardShouldPersistTaps="handled"` (it accepts all ScrollView props) [R-KB1][R-KB4]: https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/components/keyboard-aware-scroll-view. Keep `KeyboardAvoidingView` for prototypes only.
- A sticky CTA goes in `KeyboardStickyView` with `offset={{ closed, opened }}` [R-KB2]. `<KeyboardToolbar />` adds Prev/Next/Done with no configuration. Customizing it uses compound children (`KeyboardToolbar.Done` and others) in recent versions, so verify against the installed one. A numeric pad has no return key on iOS, so it always needs Done [R-KB7].
- Use `keyboardDismissMode`: `'interactive'` is iOS-only and Android behaves like `'on-drag'` [R-KB4].
- `TextInput` props [R-KB5][R-KB6]: `keyboardType`/`inputMode`, `textContentType` (iOS) + `autoComplete` for autofill and OTP, `returnKeyType` (`next` for middle fields, `done`/`go`/`search`/`send` for the last), and `submitBehavior="submit"` on middle fields so the keyboard stays open (`blurOnSubmit` is deprecated): https://reactnative.dev/docs/textinput
- For free text that is not English, set `autoCorrect={false}` and `spellCheck={false}`. Read quick-entry text from `e.nativeEvent.text` on submit, not from lagging state. Focus the first field when the form opens.

```tsx
export function SignUpForm({ onSubmit }: { onSubmit: () => void }) {
  const insets = useSafeAreaInsets();
  const passwordRef = useRef<TextInput>(null);
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAwareScrollView
        bottomOffset={CTA_HEIGHT + 16}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: CTA_HEIGHT + insets.bottom + 16 }}>
        <TextInput autoFocus keyboardType="email-address" textContentType="emailAddress" autoComplete="email"
          autoCapitalize="none" autoCorrect={false} returnKeyType="next" submitBehavior="submit"
          onSubmitEditing={() => passwordRef.current?.focus()} />
        <TextInput ref={passwordRef} secureTextEntry textContentType="newPassword" autoComplete="new-password"
          returnKeyType="next" submitBehavior="submit" />
        <TextInput keyboardType="number-pad" textContentType="oneTimeCode" autoComplete="one-time-code" />
      </KeyboardAwareScrollView>
      <KeyboardStickyView offset={{ closed: 0, opened: insets.bottom }}>{/* confirm the opened offset on a device */}
        <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: Math.max(insets.bottom, 16) }}>
          <PrimaryButton label="Create account" onPress={onSubmit} />
        </View>
      </KeyboardStickyView>
      <KeyboardToolbar />
    </View>
  );
}
```

## 8. Visual tokens in code

- Tokens live in one theme module (`src/theme/tokens.ts`) or in the Tailwind `theme.extend` for NativeWind. Screen files contain **no inline hex or rgba**. They reference semantic names (`colors.surface`, `colors.danger`), and each state has one colour across the app.
- Use at most five even type sizes. Keep `allowFontScaling` on (the default). Where chrome would break, cap it with `maxFontSizeMultiplier`; never disable it.
- Radius tokens are set by role. The sheet radius is 28 for Android/M3-style gorhom sheets. On iOS, prefer the native `formSheet`, which draws the system radius.
- Elevation: `shadow*` props do nothing on Android, so every elevation token pairs them with `elevation`.

```ts
export const type = {
  caption: { fontSize: 12, lineHeight: 16 },
  body: { fontSize: 14, lineHeight: 20 },
  bodyLarge: { fontSize: 16, lineHeight: 22 },
  title: { fontSize: 20, lineHeight: 26, fontWeight: '600' },
  display: { fontSize: 24, lineHeight: 32, fontWeight: '700' },
} as const;
export const radius = { control: 12, card: 16, sheet: 28 } as const; // control/card: choose once per project
export const elevation = {
  card: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
} as const;
```

## 9. Motion and feedback

- Animate on the UI thread with Reanimated. Legacy `Animated` with `useNativeDriver: false` on transform or opacity is a hard fail, and so is `useState` driven by `onScroll`. Navigation transitions belong to the navigator; do not re-implement them.
- Every touchable gives press feedback: a scale of about 0.97 or an opacity change, plus `android_ripple` on Android. UI animations last 150-300ms. Prefer springs for interactive release.
- Respect `useReducedMotion()`. It returns the setting as it was at app start: https://docs.swmansion.com/react-native-reanimated/docs/device/useReducedMotion/. With reduced motion on, decorative motion becomes instant and gestures still work.
- Entering animations must never replay in recycled FlashList cells. Limit them to first mount and the first ~6 indexes.
- `expo-haptics` vocabulary: `selectionAsync()` for picker and segment changes, `impactAsync(ImpactFeedbackStyle.Light)` for toggles, and `notificationAsync(NotificationFeedbackType.Success)` once per completed core task. Never use haptics on plain navigation or scrolling. iOS drops haptics in Low Power Mode, so a haptic never carries meaning alone: https://docs.expo.dev/versions/latest/sdk/haptics/

```tsx
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export function PressableScale({ onPress, children, accessibilityLabel }: PressableScaleProps) {
  const scale = useSharedValue(1);
  const reduceMotion = useReducedMotion();
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <AnimatedPressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={onPress}
      onPressIn={() => { if (!reduceMotion) scale.value = withTiming(0.97, { duration: 120 }); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      android_ripple={{ color: colors.ripple, foreground: true }} style={style}>
      {children}
    </AnimatedPressable>
  );
}
```

## 10. Stack-specific grep checks

Run these in bash from the project root before handing off. Every hit needs a fix or a one-line justification.

```bash
SRC=(app src components)                       # adjust to the project's source dirs
INC=(--include='*.ts' --include='*.tsx' --include='*.js' --include='*.jsx')
g() { grep -rnE "${INC[@]}" "$@" "${SRC[@]}" 2>/dev/null; }
# Core SafeAreaView (deprecated): files using SafeAreaView without safe-area-context [R-SA1]
grep -rlE "${INC[@]}" '\bSafeAreaView\b' "${SRC[@]}" 2>/dev/null | xargs grep -L 'react-native-safe-area-context'
# Magic status-bar paddings [R-SA1]
g '(paddingTop|marginTop|top):[[:space:]]*(20|24|44|47|48|50|54|59|62|68)\b|StatusBar\.currentHeight'
# Inline colours outside the theme
g '#[0-9a-fA-F]{3,8}\b|rgba?\(' | grep -vE '/(theme|tokens)/|tailwind\.config'
g 'useNativeDriver:[[:space:]]*false'         # JS-thread animation
g 'Alert\.alert\(' | wc -l                    # alert count: review each against [R-DL1]
# Expo Router 57+: navigators are vendored; direct @react-navigation imports mean a missing package or a stale pattern
g "from '@react-navigation/"
# ScrollView wrapping .map: use FlashList for unbounded data
grep -rlE "${INC[@]}" '<ScrollView' "${SRC[@]}" 2>/dev/null | xargs grep -HnE '\.map\('
g '<LinearGradient' | wc -l                   # more than one or two per screen is decoration, not hierarchy
# Emoji in source: use the icon family
find "${SRC[@]}" -name '*.tsx' -print0 2>/dev/null | xargs -0 perl -CSD -ne 'print "$ARGV:$.: $_" if /[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]/; close ARGV if eof'
# Absolute elements pinned with a literal bottom: derive from insets / tab bar height [R-BS5][R-TZ3]
g -A4 "position:[[:space:]]*['\"]absolute" | grep -E 'bottom:[[:space:]]*[0-9]+'
```
