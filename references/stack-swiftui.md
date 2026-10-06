# Stack: SwiftUI (iOS 17+ baseline)

Everything stack-specific for building screens in SwiftUI. Rule IDs ([R-SA], [R-NV], [R-TZ], [R-BS], [R-DL], [R-KB]) come from the skill's layout rules; this file says how to satisfy them in code. Link shorthand: `doc:` = `https://developer.apple.com/documentation/`, `hig:` = `https://developer.apple.com/design/human-interface-guidelines/`. Versions below are the iOS "introduced" values from Apple's docs (checked 2026-10-06). Gate anything above the project's deployment target with `if #available(iOS NN, *)`.

## 1. Stack sniff (existing stack wins)

```bash
ls -d *.xcodeproj *.xcworkspace Package.swift Project.swift project.yml 2>/dev/null   # Xcode, SPM, Tuist, XcodeGen
grep -rhoE "IPHONEOS_DEPLOYMENT_TARGET = [0-9.]+" --include=project.pbxproj . | sort -u; grep -n "platforms" Package.swift 2>/dev/null
grep -rlE "@main|UIHostingController|UIViewControllerRepresentable|UIApplicationDelegate" --include=*.swift . | head   # SwiftUI vs UIKit host
grep -rnE "extension (Color|ShapeStyle|Font|CGFloat)\b|enum (Spacing|Radius|Tokens?)\b" --include=*.swift . | head  # existing tokens
find . -maxdepth 6 -path "*.xcassets/*" -name "*.colorset" | head -20                                           # asset catalog colors
grep -rlE "import ComposableArchitecture|@Observable|ObservableObject|@Reducer" --include=*.swift . | head      # TCA / Observation / MVVM
grep -rhoE "systemName: \"[a-z0-9.]+\"" --include=*.swift . | sort | uniq -c | sort -rn | head                   # SF Symbols in use
ls MOBILE-DESIGN.md docs/MOBILE-DESIGN.md 2>/dev/null
```

- Reuse what exists: token files, asset colors, state architecture (TCA stays TCA, `ObservableObject` stays unless the target is 17+ and a migration is in scope), router pattern, icon family. MOBILE-DESIGN.md decisions override defaults below.
- Deployment target below 17 removes `@Observable`, `ContentUnavailableView`, `.sensoryFeedback`, `.safeAreaPadding`, `.symbolEffect`; below 16.4 removes `.presentationBackgroundInteraction`, `.presentationContentInteraction`, `.presentationCornerRadius`. Use the older equivalent; do not raise the target silently.
- UIKit host with SwiftUI islands: keep navigation in UIKit, build screens in SwiftUI inside `UIHostingController`; do not create a second navigation system.

## 2. Default architecture (new projects only)

- SwiftUI app lifecycle (`@main struct App: App { WindowGroup { RootView() } }`), no SceneDelegate unless a capability needs it.
- `NavigationStack(path:)` per tab, driven by a typed `[Route]` array (`enum Route: Hashable`). Use type-erased `NavigationPath` only when one stack must hold unrelated types (iOS 16, `doc:swiftui/navigationpath`).
- `TabView(selection:)` for 3-5 top-level sections. iOS 18+: `Tab("Home", systemImage: "house", value: .home) { ... }` and `Tab(role: .search)` (`doc:swiftui/tab`). On an iOS 17 target use `.tabItem { Label(...) }.tag(...)`; it is marked deprecated in the iOS 27.2 SDK, so branch at the root with `if #available(iOS 18, *)` when both are needed.
- State: `@Observable` models (Observation, iOS 17), owned with `@State`, passed with `.environment(model)` / `@Environment(Model.self)`, bound with `@Bindable`.
- Color: asset catalog color sets with Any, Dark and High Contrast variants; Xcode-generated symbols (`Color(.brandAccent)`, `ColorResource` iOS 17) or one `Color` extension. One accent (`AccentColor` asset or `.tint` at the root).
- Type: system font through `Font.TextStyle` (Dynamic Type); a brand face only for display moments via `.custom(_:size:relativeTo:)`.
- Icons: SF Symbols only. Data hero: Swift Charts (iOS 16). Sheets: `.sheet` + detents. No third-party UI kit by default.

## 3. Safe area, bars, thumb zone [R-SA1][R-SA2][R-TZ1-3][R-NV1-4]

```swift
ScrollView {
    LazyVStack(spacing: Spacing.m) { rows }.padding(.horizontal, Spacing.l)  // content stays inside the safe area
}
.background(Color.appBackground.ignoresSafeArea())        // only the fill bleeds [R-SA1]
.safeAreaInset(edge: .bottom) {                            // sticky CTA above the home indicator [R-TZ1][R-TZ3]
    Button(action: next) { Text("Continue").frame(maxWidth: .infinity) }
        .buttonStyle(.borderedProminent).controlSize(.large)
        .padding(.horizontal, Spacing.l).padding(.bottom, Spacing.s)
}
.navigationTitle("Orders")                                 // short title, under 15 characters
.navigationBarTitleDisplayMode(.large)                     // root screens large, pushed details .inline
.toolbar { ToolbarItem(placement: .primaryAction) { Button("Add", systemImage: "plus", action: add) } }
```

- SwiftUI lays out inside the safe area by default (`doc:swiftui/view/ignoressafearea(_:edges:)`). Never add top padding for the status bar or Dynamic Island; insets vary 47-68pt by model.
- `.ignoresSafeArea()` with no arguments ignores every region and edge: apply it only to background fills, images and gradients. Be explicit elsewhere, e.g. a hero image `.ignoresSafeArea(.container, edges: .top)`. `.ignoresSafeArea(.keyboard)` belongs on a background, never on a container holding inputs.
- Sticky bottom content: `.safeAreaInset(edge: .bottom)` (iOS 15) also insets the scroll content so the last row clears it. iOS 26: prefer `.safeAreaBar(edge: .bottom)`, which additionally extends the scroll edge effect under the bar (`doc:swiftui/view/safeareabar(edge:alignment:spacing:content:)`).
- Extra scroll margins: `.safeAreaPadding` or `.contentMargins` (both iOS 17), not padding hacks. Read `GeometryProxy.safeAreaInsets` only for custom overlays that must compute positions; never size layout from `UIScreen.main.bounds` (deprecated in iOS 26).
- Toolbars: one primary action, trailing (`.primaryAction` / `.confirmationAction`), at most three groups [R-NV3]; standard Back/Close symbols, never the words "Back" or "Close" [R-NV4]. iOS 26: separate groups with `ToolbarSpacer` (`doc:swiftui/toolbarspacer`).
- Tab bar holds sections, never actions; never hide or disable tabs [R-NV1][R-NV2]. iOS 26 options: `.tabBarMinimizeBehavior(.onScrollDown)`, `.tabViewBottomAccessory { }` for a persistent mini player.
- iOS 26 Liquid Glass [R-SA2]: no solid `.toolbarBackground(Color, for:)` under bars. The scroll edge effect is automatic; tune it with `.scrollEdgeEffectStyle(.soft | .hard, for:)` (iOS 26, `doc:swiftui/view/scrolledgeeffectstyle(_:for:)`). On iOS 17-18 keep the system bar material; force `.toolbarBackground(.visible, for: .navigationBar)` only when content clashes. Per `hig:toolbars`, reduce custom bar backgrounds and tinted bar items.
- Targets: every custom tappable is at least 44x44pt (`hig:accessibility`): `Image(systemName:).frame(minWidth: 44, minHeight: 44).contentShape(.rect)` plus `.accessibilityLabel`. iOS 26 wraps default bordered buttons in glass capsules; re-check row heights and use `.buttonStyle(.plain)` where a bare icon is intended.
- Edge-swipe back stays alive: no `DragGesture`, horizontal pager or drawer starting at the leading edge of a pushed screen. Frequent actions never live only in the top-left corner [R-TZ2].

## 4. Navigation containers [R-NV][R-BS9]

The skill's navigation.md owns the decision tree; this is the SwiftUI shape.

```swift
@Observable final class Router {
    var tab: AppTab = .home
    var homePath: [Route] = []
    var ordersPath: [Route] = []
    func handle(_ url: URL) {                        // cold start and warm links share one path
        guard let route = Route(url: url) else { return }   // untrusted input: unknown links do nothing
        switch route {
        case .order:    tab = .orders; ordersPath = [route]  // Back lands on the Orders list
        case .settings: tab = .home;   homePath = [route]
        }
    }
}
struct RootView: View {                              // iOS 18 Tab API
    @State private var router = Router()
    var body: some View {
        TabView(selection: $router.tab) {
            Tab("Home", systemImage: "house", value: AppTab.home) {
                NavigationStack(path: $router.homePath) {
                    HomeScreen().navigationDestination(for: Route.self) { RouteView(route: $0) }
                }
            }
            Tab("Orders", systemImage: "shippingbox", value: AppTab.orders) {
                NavigationStack(path: $router.ordersPath) {
                    OrdersScreen().navigationDestination(for: Route.self) { RouteView(route: $0) }
                }
            }
        }
        .onOpenURL { router.handle($0) }
        .environment(router)
    }
}
```

- One `NavigationStack` per tab, inside the tab, never wrapping the `TabView`. Register `navigationDestination` on the stack root, not inside lazy rows.
- Modals: `.sheet(item:)` for a self-contained task; `.fullScreenCover` for camera, media, onboarding or multi-step editing. Sheets never replace navigation between sections [R-BS9].
- `.navigationBarBackButtonHidden(true)` only with an explicit replacement (a standard back/close control) and a reason; hiding it also loses the swipe-back gesture in practice, so verify on device.
- Deep link to a deleted or missing item: push a "not found" screen that explains and offers Back, never a blank view. Present a sheet from a link only after the tab and path are set.

## 5. Sheets [R-BS1-9]

```swift
.sheet(item: $editing) { item in
    NavigationStack {                                            // title + toolbar inside the sheet
        EditItemForm(draft: $draft)
            .navigationTitle("Edit Item").navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {    // Cancel leading [R-BS4]
                    Button("Cancel") { if draft.isDirty { confirmDiscard = true } else { editing = nil } }
                }
                ToolbarItem(placement: .confirmationAction) {    // Done trailing
                    Button("Done") { save(); editing = nil }.disabled(!draft.isValid)
                }
            }
            .confirmationDialog("Discard your changes?", isPresented: $confirmDiscard, titleVisibility: .visible) {
                Button("Discard Changes", role: .destructive) { editing = nil }
                Button("Keep Editing", role: .cancel) {}
            }
    }
    .presentationDetents([.large])                               // compose/edit content: large only [R-BS8]
    .interactiveDismissDisabled(draft.isDirty)                   // [R-BS3]
}
.sheet(isPresented: $showFilters) {                              // resizable, non-modal companion
    FiltersView()
        .presentationDetents([.medium, .large])                  // iOS 16
        .presentationDragIndicator(.visible)                     // resizable needs a grabber [R-BS2]
        .presentationBackgroundInteraction(.enabled(upThrough: .medium))  // iOS 16.4
        .presentationContentInteraction(.scrolls)                // iOS 16.4: scroll before resize
}
```

- Detents: `.medium`, `.large`, `.fraction(0.4)`, `.height(320)` (iOS 16, `doc:swiftui/view/presentationdetents(_:)`). `.medium` only for progressive disclosure content (`hig:sheets`).
- Swipe to dismiss stays on for clean sheets. SwiftUI has no "attempted dismiss" callback, so with unsaved changes either block the swipe (`.interactiveDismissDisabled`, iOS 15) and confirm on Cancel as above, or save on dismiss when the draft is valid. Confirm-on-swipe needs UIKit's `presentationControllerDidAttemptToDismiss(_:)`.
- One sheet at a time [R-BS1]: open the next one from the first sheet's `onDismiss`, never stacked. Never show Cancel, Done and Back together [R-BS4].
- Long content uses `List`/`ScrollView` inside the sheet [R-BS6]; a sheet CTA goes in the toolbar or `.safeAreaInset(edge: .bottom)` [R-BS5], never an offset overlay.
- Inputs in a sheet: the system avoids the keyboard; a sheet with fields at `.medium` also offers `.large` [R-BS7].
- No status-bar inset inside page sheets: they already start below the status bar.
- Leave corner radius and background to the system. `.presentationCornerRadius` (iOS 16.4) at most once app-wide. On iOS 26 partial-height sheets get a Liquid Glass background; a custom `.presentationBackground` replaces it (verify in installed SDK). iPad: `.presentationSizing(.form)` or `.page` (iOS 18).

## 6. Alerts, action sheets, feedback [R-DL1-4][R-DL8]

```swift
.alert("Delete “Summer Cardigan”?", isPresented: $askDelete) {
    Button("Delete", role: .destructive, action: delete)
    Button("Cancel", role: .cancel) {}
} message: { Text("Its 12 rows and 4 photos are removed from all your devices.") }
.confirmationDialog("Discard this draft?", isPresented: $askDiscard, titleVisibility: .visible) {
    Button("Discard Draft", role: .destructive, action: discard)
    Button("Save Draft", action: saveDraft)
    Button("Keep Editing", role: .cancel) {}
}
```

- Alerts: up to 3 buttons (`hig:alerts`); with no actions the system adds "OK", and there is no default Cancel, so add `role: .cancel` whenever a destructive button exists [R-DL3]. Labels are verbs, never "OK/Yes/No" unless purely informational [R-DL4]. Only `Text` labels render (`doc:swiftui/view/alert(_:ispresented:actions:message:)`).
- HIG: when the user deliberately chose the action (tapped Empty Trash), the confirming button need not be destructive-styled; use `role: .destructive` when the consequence exceeds what they picked [R-DL3].
- `.confirmationDialog` (iOS 16) for choices about an intentional action: max 4 buttons including Cancel (`hig:action-sheets`). The system orders buttons by role (destructive first, Cancel separated) and renders a popover in regular width, so do not hand-order or restyle.
- Reversible destructive actions get no alert: act, then offer Undo inline [R-DL1]. No alert at launch, no "Success!" alert: show the new state in place plus one success haptic.
- iOS has no toast [R-DL8]. Use inline status rows, `ContentUnavailableView` (iOS 17, `.search` variant for empty search) for empty/error states with a retry action, and, only when needed, a non-blocking banner in `.overlay(alignment: .top)` inside the safe area that floats over content instead of pushing layout.

## 7. Keyboard [R-KB1-7]

```swift
ScrollView {
    VStack(spacing: Spacing.m) {
        TextField("Email", text: $email)
            .keyboardType(.emailAddress).textContentType(.emailAddress)          // [R-KB5]
            .textInputAutocapitalization(.never).autocorrectionDisabled()
            .submitLabel(.next).focused($focus, equals: .email)                 // [R-KB6]
            .onSubmit { focus = .password }
        SecureField("Password", text: $password)
            .textContentType(.newPassword)
            .submitLabel(.next).focused($focus, equals: .password)
            .onSubmit { focus = .budget }
        TextField("Monthly budget", text: $budget)
            .keyboardType(.decimalPad).focused($focus, equals: .budget)          // no return key
    }
    .padding(Spacing.l)
}
.scrollDismissesKeyboard(.interactively)                                        // iOS 16 [R-KB4]
.safeAreaInset(edge: .bottom) {                                                 // rides above the keyboard [R-KB2]
    Button(action: submit) { Text("Create Account").frame(maxWidth: .infinity) }
        .buttonStyle(.borderedProminent).controlSize(.large).disabled(!canSubmit)
        .padding(.horizontal, Spacing.l).padding(.bottom, Spacing.s)
}
.toolbar {
    ToolbarItemGroup(placement: .keyboard) { Spacer(); Button("Done") { focus = nil } }  // [R-KB7]
}
.background(Color.appBackground.ignoresSafeArea())                              // only the fill ignores the keyboard
.onAppear { focus = .email }                                                    // first field focused
```

- The keyboard is a safe-area region, so `ScrollView` and `Form` move the focused field above it automatically [R-KB1]. Do not add keyboard-height padding or observe keyboard notifications for layout.
- `@FocusState` (iOS 15) chains fields: `.submitLabel(.next)` mid-form, `.done`/`.go`/`.search`/`.send` on the last field, with `.onSubmit` moving focus or submitting.
- Keyboards: `.numberPad` (OTP, PIN), `.decimalPad` (money), `.emailAddress`, `.phonePad`, `.URL`. Content types: `.username`, `.password`, `.newPassword`, `.oneTimeCode`, `.telephoneNumber`, `.postalCode`, `.emailAddress`.
- `.autocorrectionDisabled()` + `.textInputAutocapitalization(.never)` for emails, usernames, codes, and free text in non-English content.
- Number and decimal pads have no return key: always give a keyboard-toolbar Done or a sticky CTA. On iOS 26 the keyboard toolbar adopts Liquid Glass automatically. If the keyboard toolbar does not appear, ensure the screen sits inside a `NavigationStack` and verify on device.
- The tab bar stays under the keyboard by default; never lift it [R-KB3]. A disabled CTA states what is missing in a hint line.

## 8. Visual tokens in code

```swift
// DesignTokens.swift: the only file allowed to hold literal values
extension Font {
    static let appDisplay = Font.custom("BrandSerif-Bold", size: 34, relativeTo: .largeTitle)  // display moments only
    static let appTitle = Font.system(.title2, weight: .semibold)   // 22pt default
    static let appBody = Font.body                                   // 17pt
    static let appSecondary = Font.subheadline                       // 15pt
    static let appCaption = Font.caption                             // 12pt
}
enum Spacing { static let xs: CGFloat = 4; static let s: CGFloat = 8; static let m: CGFloat = 12; static let l: CGFloat = 16; static let xl: CGFloat = 24 }
enum Radius { static let control: CGFloat = 12; static let card: CGFloat = 16 }   // by role, not by screen
```

- Colors come from the asset catalog (generated `Color(.name)`) or one `Color` extension; never `Color(red:green:blue:)`, `UIColor(red:...)` or hex inside views. Prefer semantic styles first: `.primary`, `.secondary`, `.tint`, `Color(.systemBackground)`, `Color(.secondarySystemBackground)`, `Color(.separator)`. Each semantic state (done, overdue, in progress) has one color app-wide.
- One accent: set `.tint(.brandAccent)` once at the root or use the `AccentColor` asset; do not tint decoration.
- Five sizes max, all mapped to text styles so Dynamic Type works. Never `.font(.system(size:))` for text; custom faces always pass `relativeTo:`. Test at the largest accessibility size: rows wrap, nothing truncates mid-word.
- `@ScaledMetric(relativeTo: .body) var iconSize: CGFloat = 24` for icon frames and spacing that must grow with text (iOS 14).
- Materials (`.regularMaterial`, iOS 15) only on navigation and control layers, never on content cards. On iOS 26 do not hand-roll glass; `.glassEffect` (iOS 26) only for custom floating controls, and `ConcentricRectangle` (iOS 26) for shapes nested in glass containers.
- SF Symbols: one rendering mode app-wide (set `.symbolRenderingMode(.hierarchical)` or `.monochrome` at the root); symbol weight follows the adjacent text's font, so do not mix `.fontWeight` per icon. No emoji as icons.
- Verify light, dark and Increase Contrast (`@Environment(\.colorSchemeContrast)`); every color set has all three variants.

## 9. Motion and feedback

- State changes from taps: `withAnimation(.snappy(duration: 0.25)) { ... }`; layout shifts `.smooth`; `.bouncy` only for playful success moments. UI motion stays 150-300ms.
- Scoped implicit animation always passes a value: `.animation(.smooth(duration: 0.25), value: expanded)`.
- Insert/remove: `.transition(.asymmetric(insertion: .move(edge: .top).combined(with: .opacity), removal: .opacity))`; new list rows fade and move up, removed rows fade while siblings animate.
- Hero within one hierarchy: `matchedGeometryEffect(id:in:)`. Push or sheet hero: iOS 18 `.navigationTransition(.zoom(sourceID:in:))` with `.matchedTransitionSource(id:in:)`.
- Changing numbers: `.contentTransition(.numericText(value:))` (iOS 17) inside `withAnimation`.
- Haptics: `.sensoryFeedback(.selection | .impact | .success, trigger:)` (iOS 17). `.success` once per completed core task; `.selection` for pickers and toggles; nothing on plain navigation or every tap.
- `@Environment(\.accessibilityReduceMotion)`: swap moves, zooms and bounces for opacity.
- `.symbolEffect(.bounce, value:)` (iOS 17) only to confirm a change; `.phaseAnimator` (iOS 17) sparingly, never looping behind content.
- Sequencing: `withAnimation(_:completionCriteria:_:completion:)` (iOS 17), not `DispatchQueue.main.asyncAfter` timers.

## 10. Stack-specific grep checks (run before handoff)

```bash
SRC="${SRC:-.}"; S() { grep -rnE --include='*.swift' "$@" "$SRC"; }
echo "## literal colors outside the token file";      S '(Color|UIColor)\((red|hue|white|displayP3):' | grep -v DesignTokens
echo "## fixed font sizes (need a text style or relativeTo:)"; S '\.system\(size:|\.custom\(' | grep -v 'relativeTo:'
echo "## bare ignoresSafeArea() not on a fill";        S '\.ignoresSafeArea\(\)' | grep -vE '(Color|Gradient|Image|Rectangle|Material|background)[^)]*\)?\.ignoresSafeArea'
echo "## status-bar padding hacks";                    S '\.padding\(\.(top|vertical), *[2-6][0-9](\.0)?\)'
echo "## UIScreen.main layout (deprecated iOS 26)";    S 'UIScreen\.main'
echo "## asyncAfter used as an animation timer";       S 'asyncAfter'
echo "## solid bar backgrounds [R-SA2]";               S '\.toolbarBackground\(' | grep -vE '\((\.visible|\.hidden|\.automatic)'
echo "## emoji in Text/Label/Button/Tab titles"
find "$SRC" -name '*.swift' -not -path '*/.build/*' -print0 | xargs -0 perl -CSD -ne 'print "$ARGV:$.: $_" if /(Text|Label|Button|Tab)\("[^"]*[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]/; close ARGV if eof'
echo "## presentationCornerRadius uses (expect 0 or 1)"; S 'presentationCornerRadius\(' | wc -l
echo "## hidden back buttons (each needs a replacement)"; S 'navigationBarBackButtonHidden\((true)?\)'
echo "## alerts with 3+ buttons (max 3; consider confirmationDialog)"
find "$SRC" -name '*.swift' -not -path '*/.build/*' -print0 | xargs -0 perl -0777 -ne 'while (/\.alert\(([^\n]*\n(?:(?!\s*\}\s*(message:|\n\s*\.)).*\n){0,12})/g) { my $b=$1; my $n=()=$b=~/Button\(/g; print "$ARGV: alert with $n buttons: ".(split /\n/,$b)[0]."\n" if $n>=3 }'
```

Every hit is fixed or justified in the handoff. Acceptable exceptions: `.font(.system(size: scaledValue))` driven by `@ScaledMetric` for an icon, and `asyncAfter` that schedules non-visual work.
