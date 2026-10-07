---
# MOBILE-DESIGN.md
# Design source of truth for the warehouse app (quản lý kho). Written by taste-mobile-app-skill
# 0.2.0; all phases complete, every inventory screen built and checked on a simulator. Fields marked
# (inferred) were accepted by default in the brief gate.
version: 2
updated: 2026-10-07
stack: expo                      # (inferred) accepted by default; empty repo
platforms:
  ios: best-effort
  android: first-class
  web: none
posture: android-first
dials:
  expression: 5   # content is branded (ink bars, label type); chrome stays Material 3
  motion: 3       # pressed feedback, number transitions, nothing decorative
  density: 6      # dense 48 dp lists for staff; 48 dp targets survive gloves

visual_identity:
  territory: shipping label × factory kanban board
  emotional_target: certainty at the moment of confirming a stock movement; readable from three metres in a dim aisle
  not: a consumer delivery app, a fintech dashboard

references:
  - source: Linear
    principles:
      - type: typography
        observation: an issue title is plain text with no box; properties sit under it as small chips
        principle: the object is text, not a field
        application: receipt and transfer headers (supplier, reference number, date as chips under a plain title)
      - type: content-density
        observation: identifiers are set in tabular or monospace figures and align in dense rows
        principle: codes are read as columns, so they need fixed-width numerals
        application: SKU, lot and location codes everywhere
    do_not_copy: the dark theme, the violet accent, the sidebar information architecture
  - source: Shopify POS
    principles:
      - type: hierarchy
        observation: the product line (image, name, SKU) sits above the quantity control; the control is large
        principle: the object is visible before the action
        application: Nhập kho, Xuất kho, Kiểm kê show the SKU label block before the quantity
      - type: interaction
        observation: quantity is a stepper with quick values; the keyboard is a fallback
        principle: the hero input gets the control the context calls for
        application: quantity stepper 56 dp with +10 / +50 / +100 chips on every stock movement
    do_not_copy: the green accent, the cart structure, the checkout flow
  - source: Google Files
    principles:
      - type: surface
        observation: 56 dp list items with a leading glyph, section headers, no cards
        principle: Android list grammar carries lists without containers
        application: SKU list, location list, history
      - type: navigation
        observation: three destinations in a bottom navigation bar
        principle: tabs are sections, not actions
        application: Tổng quan · Kho · Lịch sử
    do_not_copy: file-type colored icons, Google brand colors

visual_dna:
  composition: Dashboard on Tổng quan (one headline count); Focused Task on Nhập, Xuất, Kiểm kê; List on Kho, Lịch sử, Cài đặt; Hero on SKU detail (the label block is the object); Immersive on Quét; leading axis; the anchor is the full-bleed ink bar at the top of tab roots and task screens
  hierarchy: level 1 by ink block and numeral size; level 2 by weight; level 3 by muted color; no rounded boxes for hierarchy
  typography: Roboto for UI; Roboto Mono tabular for quantities and codes; one display size (32) for the quantity being edited and the headline count; uppercase 12 dp labels only inside ink bars
  imagery: the SKU's real barcode drawn large, as on a physical label; no photos, no illustration
  color: white surface, ink text; the primary action is an ink block; one semantic warn (safety yellow) for low stock, one danger for destructive; no other hue
  surfaces: flat white; ink bars as section headers and tags; 1 dp dividers; no shadow, no elevation on content
  shapes: 0 radius on bars, tags and the label block; 999 pill only on quick-value chips; sheet follows Material 3 (28)
  iconography: Material Symbols rounded, weight 400, in the navigation bar, top app bar and leading list glyphs only; none inside the label block
  motion: pressed ripple; the quantity numeral transitions on stepper change (180 ms); nothing else animates
  interaction: stepper with quick chips; long-press on + or − to repeat; swipe a history row to undo within 5 s; one success haptic when a movement is saved; scanner vibrates on a hit

composition:
  default_archetype: focused-task
  allowed: [dashboard, focused-task, list, hero, immersive]   # hero added in Phase 5 for SKU detail
  prohibited: [editorial, feed, canvas]   # no discovery content, no media, nothing to compose freely
  repetition_limits: "0 cards on task and list screens, 1 module on Tổng quan; ink bar is the only repeated section device and appears once per screen; 1 ink-block button per screen"

colors:
  surface: "#FFFFFF"
  surface-alt: "#F2F2F0"
  text: "#111111"          # source: thermal-printed label ink
  text-muted: "#5C5C5C"
  accent: "#111111"        # source: the label ink; the primary action is an ink block, not a tinted button
  warn: "#F5B400"          # source: safety tape on racking; fills and tags only, never text
  danger: "#B3261E"        # Material 3 error
colors-dark:
  surface: "#121212"
  surface-alt: "#1E1E1E"
  text: "#F4F4F2"
  text-muted: "#A3A3A0"
  accent: "#F4F4F2"        # ink inverts to paper; the block stays a block
  warn: "#F5B400"
  danger: "#F2B8B5"
type:
  ui-family: Roboto
  display-family: Roboto Mono        # quantities and codes only; tabular figures on
  scale:
    caption: { size: 12, line: 16 }
    body:    { size: 14, line: 20 }
    body-lg: { size: 16, line: 24 }
    heading: { size: 20, line: 28 }
    display: { size: 32, line: 40 }
  dynamic-type: true
spacing: [4, 8, 12, 16, 24, 32, 40, 48]
radius:
  control: 0               # ink-block buttons, bars, tags, label block
  field: 4                 # Material 3 filled text field top corners
  chip: 999                # quick-value chips and filter chips
  sheet: 28                # Material 3 modal bottom sheet
elevation:
  flat: 0
  raised: 0
  overlay: 3               # sheets and dialogs only
icons:
  family: material-symbols
  weight: 400
motion:
  durations: { fast: 120, base: 180, slow: 250 }
  reduced-motion: honored
---

# Quản lý kho design direction

## App Read

`APP READ: field/operations tool (quản lý kho) for warehouse staff receiving, picking and counting stock on the floor, one-handed, standing, phone camera as scanner, 8-hour shifts; managers check stock and reports on the same app less often. Plain technical language. Leaning Material 3 with a custom accent. platforms: Android first-class · iOS best-effort · web none. posture: Android-first. inferred: stack (Expo), audience split, scanner hardware (camera, no Zebra), references, no existing brand.`

Mood: certain, legible, industrial, not friendly-consumer. Each adjective is translated under Visual DNA; the adjectives decide nothing.

## Visual territory

`shipping label × factory kanban board`, because the label on a carton is what staff read all day and is already optimized for the exact conditions of this app (dim light, distance, speed), and the kanban board is how a floor shows what is left to do without decoration. Not a consumer delivery app (no illustration, no friendly mascot, no greeting) and not a fintech dashboard (no stat triplet, no gradient balance card). Emotional target: certainty at the moment of tapping "Lưu phiếu", readable from three metres.

## Reference principles

**Linear.** A title is plain text and its properties are chips under it; identifiers are set in fixed-width figures so they align in columns. Applied to the header of every receipt and transfer (title plain, supplier and reference as chips) and to every SKU, lot and location code. Not copied: the dark theme, violet, the sidebar IA.

**Shopify POS.** The product line sits above the quantity control and the control is large, with quick values and the keyboard as a fallback. Applied to all three stock movement screens: the SKU label block first, then a 56 dp stepper with +10 / +50 / +100. Not copied: the green accent, the cart.

**Google Files.** Lists are 56 dp Material items with section headers and no cards, under three bottom-navigation destinations. Applied to Kho, Lịch sử and the navigation. Not copied: colored file-type icons.

Where Linear (plain text, chips) and Material 3 (filled text fields) meet on the same form, Linear wins for the title and the object, Material wins for every remaining free-text field (ghi chú, supplier name), so the field language stays recognizably Android (tell B17).

## Visual DNA

### Composition
Tổng quan is a Dashboard with one headline count ("Còn 14 việc hôm nay") in the ink bar, then a half-width low-stock module and a plain list of recent movements. Nhập, Xuất and Kiểm kê are Focused Task: label block, stepper, consequence line, secondary rows, CTA. Kho, Lịch sử and Cài đặt are List. Quét is Immersive. The axis is leading everywhere; only the empty and success states are centered.

### Hierarchy
Level 1 is the ink bar or the display numeral (block and size). Level 2 is Roboto Medium at body-lg. Level 3 is muted color at body or caption. Boxes never separate levels; whitespace and dividers do.

### Typography
Roboto for all UI. Roboto Mono with tabular figures for every quantity and code, so 1.284 and 18 line up in lists and the stepper does not jiggle. One display size, 32, only for the quantity being edited and the headline count. Uppercase 12 dp labels exist only inside ink bars ("NHẬP KHO", "TỒN THẤP"); nowhere else is anything uppercase.

### Imagery
The SKU's real barcode (Code 128 from the actual code) drawn at 40 dp height inside the label block, exactly as on the carton. No photos, no illustration, no empty-state artwork.

### Surfaces
Flat white. Ink bars are the section device: full-bleed, 48 dp, white uppercase label left, count right. Tags are ink or yellow blocks with 0 radius. Dividers 1 dp surface-alt. No shadows; sheets and dialogs are the only overlays.

### Shapes
0 radius on everything that comes from the label world (bars, tags, label block, the primary button). Pill (999) on quick-value chips and filter chips so they read as controls, not labels. Sheets keep Material 3's 28 dp.

### Iconography
Material Symbols Rounded 400, in the navigation bar, the top app bar and as leading glyphs in lists. None inside the label block or the ink bars; those are type only.

### Motion
Ripple on press. The quantity numeral animates on stepper change (180 ms, digits roll). The scanner reticle snaps on a hit. Nothing enters, nothing loops.

### Interaction
Stepper with +10 / +50 / +100 chips; long-press on + or − repeats. Swipe a history row left to undo within 5 s (snackbar). One success haptic on "Lưu phiếu"; one vibration on a successful scan. Destructive actions (hủy phiếu) use a Material dialog with a verb label and Cancel.

## Composition system

Default archetype Focused Task. Allowed: Dashboard, Focused Task, List, Immersive. Prohibited: Editorial, Hero, Feed, Canvas (no discovery content, no media, no free-form authoring). Repetition limits: zero cards on task and list screens and one module on Tổng quan; the ink bar appears once per screen, at the top, and is the only repeated section device; one ink-block button per screen. First viewport commitments for tab roots: Tổng quan anchors on the headline count, task "see what is left", identity the ink bar, next "Nhập kho" button; Kho anchors on the search field and first SKU row, task "find a SKU", identity Roboto Mono codes and yellow low-stock tags, next tap a row; Lịch sử anchors on today's first movement, task "check or undo", identity ink tags per movement type, next swipe to undo.

## Direction: Nhãn đen

**Idea.** The shipping label on the carton: black bars, small white uppercase, big numbers, one yellow warning stripe; the app reads from three metres in a dim aisle.

**Hierarchy.** The eye lands on the ink bar, drops to the display numeral or the first row, then reads muted codes. Labels never compete with values.

**Imagery.** The real barcode, large, inside the label block on movement screens. Nothing else.

## Signature

Dominant idea: the full-bleed ink bar at the top of each tab root and each movement screen, carrying the screen's uppercase label and its one count. Supporting behaviors: the yellow low-stock stripe (a 4 dp left bar on rows and a tag in the label block), and the rolling tabular numeral on the stepper. Signature screens: Tổng quan, Kho, Lịch sử, Nhập, Xuất, Kiểm kê. Quiet screens: SKU detail, Cài đặt, Quét, auth, all sheets.

## Chrome

Material 3 navigation bar (3 destinations), modal bottom sheet 28 dp, filled text fields, dialogs: all native, tinted with ink (selected indicator surface-alt, selected icon ink). The ink bar is the top app bar on tab roots and on the Nhập, Xuất and Kiểm kê modals: it sits inside the top safe area, carries the close or back affordance leading and the screen's actions trailing, and the native header is hidden so no screen has two headers (tell D4). Pushed detail screens keep the native top app bar and have no ink bar. EXPRESSION 5 means the bar is a tinted top app bar, not a repainted one: insets, 48 dp actions and the back gesture stay native.

## Copy voice

Short imperative Vietnamese, present tense, no exclamation marks. CTAs name the result: "Lưu phiếu", "Xác nhận xuất", "Chốt kiểm kê", "Hoàn tác". Consequence lines state the number: "Tồn 18 → 42, vẫn dưới mức tối thiểu 50". The app never says "Chào mừng", "Tuyệt vời", "Oops".

## Deliberately not doing

- The template form (B16): no label-box-label-box; the object, the hero input and the consequence shape the screen.
- Dark background as "industrial" (A4): white surface; ink is the brand, not darkness.
- Identical section grammar (H1, C-AI-01): the ink bar appears once per screen; sections below it differ (module, list, rows).
- A tag on every row (B10): yellow only on rows actually below minimum.

## Alternatives considered

Phiếu kho (warehouse racking × paper goods-received note): the honest Material standard; rejected because its identity lived only in the SKU label block and would fail I1 as soon as the block was simplified. Bảng đếm (conveyor belt × electronic scoreboard): the headline numeral served managers and pushed the staff's real task below the fold; rejected because staff are the first audience.

## Nav Read

```
NAV READ
platforms: Android first-class, iOS best-effort, web none
tabs (3): Tổng quan · Kho · Lịch sử
routes:
  (tabs)/overview              tab root   → present receive, issue (modals); present count, scan (full-screen groups); push settings
  (tabs)/stock                 tab root   → push sku/[code] → present receive, issue preset with the SKU; push location/[id]
  (tabs)/history               tab root   → push movement/[id]
  sku/[code]                   push       (label block, stock by location, movements; presents quick-adjust sheet)
  location/[id]                push       → present count preset with the location
  movement/[id]                push       (a saved receipt, issue or count)
  settings                     push       (from the Tổng quan top app bar)
  receive                      modal      (Material full-screen dialog on Android, page sheet on iOS; no internal push; confirms discard when dirty)
  issue                        modal      (same)
  (count)/location             full-screen group step 1: pick a location
  (count)/[id]                 step 2: count each SKU
  (count)/[id]/review          step 3: confirm differences, then Chốt kiểm kê
  scan                         full-screen group (camera; X closes; a hit opens sku/[code] or fills the open task's SKU)
  (auth)/sign-in               group, gated in the root layout; required at launch (see Flow decisions)
entry points:
  receive ← "Nhập kho" ink-block button (Tổng quan); "Nhập" (sku/[code])
  issue ← "Xuất kho" outlined button (Tổng quan); "Xuất" (sku/[code])
  (count) ← "Kiểm kê" outlined button (Tổng quan); "Kiểm kê vị trí này" (location/[id])
  scan ← barcode icon in the top app bar (Tổng quan, Kho); "Quét" inside receive and issue
  settings ← gear icon in the top app bar (Tổng quan)
  quick-adjust ← "Điều chỉnh" text button (sku/[code])
sheets: movement-filter (Lịch sử: type, date range, 5 controls); quick-adjust (sku/[code]: ± stepper and a reason chip)
modals: receive, issue (dirty state confirms discard; a valid draft is kept on dismiss for 10 minutes)
full-screen groups: (count) three steps, (auth), scan
deep links: /sku/:code, /movement/:id, /location/:id
android back: default pop; receive and issue confirm discard when dirty; (count) confirms abandon once a quantity has been entered; scan closes without prompt
max taps to any core screen: 1 (Nhập, Xuất from Tổng quan); 2 (count a location from Kho)
```

Three tabs, no Settings tab, no Profile tab: a single warehouse account per device. Counting is a group, not a modal, because it has three steps. Sheets never navigate: the filter and the quick adjustment return to their parent.
## Screen inventory

| Screen | Purpose | Archetype | Focal point | Hierarchy | Primary action | Signature | Content strategy | Surface strategy | States (L/E/Err/P) | Keyboard plan | Permissions |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Tổng quan | see what is left today and start a movement | Dashboard | the Tồn thấp headline module (display count, yellow stripe) directly under the ink bar | ink bar count > headline module > action row (Nhập ink, Xuất and Kiểm kê outlined) > recent movements list | Nhập kho | ink bar; yellow stripe on Tồn thấp | number-first | open canvas; one module pair; list below | L bar with placeholder count, 3 skeleton rows / E "Chưa có phiếu nào hôm nay" + Nhập kho / Err cached counts with "Cập nhật lúc 14:02 · Thử lại" / P | n/a | none |
| Kho | find a SKU or a location | List | search field under the bar, then the first row | bar "KHO · 1.284 SKU" > search > filter chips Tồn thấp, Theo vị trí > 56 dp rows: name, mono code, qty right-aligned, 4 dp yellow left bar when below minimum | open a SKU | ink bar; yellow stripes | list-first | grouped list, 1 dp dividers, no cards | L 8 skeleton rows / E filtered "Không có SKU nào dưới mức tối thiểu" + Bỏ lọc; no data "Chưa có SKU" + Nhập danh mục / Err cached list + Thử lại / P | search: default keyboard, return key search, trailing scan icon | none |
| Lịch sử | check or undo recent movements | List | today's first movement row | bar "LỊCH SỬ · hôm nay 23" > day headers > rows: ink type tag NHẬP / XUẤT / KIỂM, SKU, qty mono, time muted | open a movement; swipe left to undo within 5 s | ink bar; ink type tags | list-first | grouped list by day | L skeleton rows / E "Chưa có phiếu nào" + Nhập kho / Err cached + Thử lại / P | n/a | none |
| Chi tiết SKU sku/[code] | see one SKU's stock and act on it | Hero | the label block with barcode, top third | label block (name, mono code, barcode, total qty, yellow tag if low) > stock by location rows > Nhập ink and Xuất outlined > recent movements | Nhập (preset SKU) | quiet; the label block carries identity | object-first | label block on open canvas, then grouped lists | L skeleton label / E (no movements) "Chưa có giao dịch" / Err cached + Thử lại / P | n/a | none |
| Vị trí location/[id] | see what sits on one shelf | List | mono location code as title, first SKU row | title > rows: SKU, qty, last counted muted | Kiểm kê vị trí này | quiet | list-first | grouped list | L / E "Kệ trống" + Nhập vào kệ này / Err / P | n/a | none |
| Nhập kho (modal) | receive a quantity of one SKU | Focused Task | the label block, then the 32 dp quantity | label block > stepper 56 dp with +10 / +50 / +100 and Quét > consequence "Tồn 18 → 42, vẫn dưới tối thiểu 50" > lot and expiry as chips (expiry picks from day chips, no keyboard) > supplier chip > Lần nhập trước row > Lưu phiếu | Lưu phiếu | ink bar NHẬP KHO; rolling numeral | object-first | open canvas; one filled text field for ghi chú | L skeleton label while the SKU loads / E no SKU yet: scan or search prompt, stepper disabled / Err save failed: draft kept, inline message + Thử lại / P | quantity: stepper default, number pad fallback with Done toolbar [R-KB7]; lot: default keyboard, next; ghi chú: default, done; CTA in a keyboard-sticky footer [R-KB1] | camera via Quét |
| Xuất kho (modal) | issue a quantity | Focused Task | same as Nhập | label block > stepper > consequence "Tồn 42 → 30"; over stock shows "Vượt tồn 8" inline on blur and disables the CTA > order reference chip > Lần xuất trước row > Xác nhận xuất | Xác nhận xuất | ink bar XUẤT KHO; rolling numeral | object-first | same as Nhập | same as Nhập; Err over-stock inline | same as Nhập | camera via Quét |
| Kiểm kê · chọn vị trí (count)/location | pick a shelf to count | List | search, then location rows with last-count date | search > rows: mono code, SKU count, "Đếm lần cuối 3 ngày trước" muted | Bắt đầu kiểm kê | quiet | list-first | grouped list | L / E "Chưa có vị trí" + Thêm vị trí / Err / P | search: default keyboard | none |
| Kiểm kê (count)/[id] | count every SKU at a location | Focused Task | the current SKU with its 32 dp stepper | bar "KIỂM KÊ · A-03 · 4/12" > current SKU line (name, mono code) > stepper > "Sổ 18 · Đếm 17 · lệch −1" > remaining SKUs as collapsed rows | Tiếp; Xem lại on the last SKU | ink bar with progress; rolling numeral | object-first | open canvas; list below | L / E "Kệ không có SKU trong sổ" + Thêm SKU / Err offline: counts kept locally, top banner "Sẽ đồng bộ khi có mạng" / P | stepper default; number pad fallback with Done | camera via Quét |
| Kiểm kê · xem lại (count)/[id]/review | confirm the differences | Focused Task | the total difference line | "3 lệch / 12 SKU" > rows of differences only, lệch mono, yellow when negative > Chốt kiểm kê | Chốt kiểm kê | ink bar | number-first | list of differences | L / E "Không lệch" with Chốt enabled / Err save failed + Thử lại / P | n/a | none |
| Chi tiết phiếu movement/[id] | read a saved movement | List | type tag and quantity mono | tag > SKU > qty > meta rows (người, giờ, vị trí, lô) | Hoàn tác (within 24 h, destructive dialog with Cancel); none after | quiet | object-first | grouped list | L / Err / P (no empty state) | n/a | none |
| Quét scan | scan a barcode | Immersive | the reticle | camera > reticle > torch and "Nhập mã" on a scrim in the bottom safe area > Done top-right | automatic on a hit | quiet; vibration on a hit | camera | edge to edge; controls on scrim inside insets | L camera starting / E permission denied: one sentence + Nhập mã thủ công / Err unreadable "Không đọc được, thử lại hoặc nhập mã" / P | manual entry: default keyboard, characters autocapitalize, go | camera on first open, pre-prompt first |
| Cài đặt settings | account, warehouse, printer, sync | List | the first group | groups Tài khoản, Kho, Máy in, Đồng bộ > rows > Đăng xuất last in danger | none | quiet | list-first | grouped list | P (static); Err on the sync row only | n/a | none |
| Đăng nhập (auth)/sign-in | one path into the warehouse account | Focused Task | the company code field | small wordmark > Mã công ty > Email > Mật khẩu > Đăng nhập; password rules inline | Đăng nhập | quiet | text-first | Material filled fields | L spinner replaces the button label / Err per field on submit / P | company code: default, next; email: email keyboard, username autofill, next; password: password autofill, go | none |
| Điều chỉnh nhanh (sheet on SKU) | small correction with a reason | Focused Task | the ± stepper | SKU line in the sheet header > stepper > reason chips Hỏng, Mất, Đếm sai > Lưu | Lưu | quiet | object-first | Material modal sheet, 28 dp, adjustResize | Err inline / P | number pad fallback with Done; sheet rises with the keyboard [R-BS7] | none |

**Sameness check.** Fifteen rows, five archetypes: Dashboard 1, List 6, Hero 1, Focused Task 6, Immersive 1. Focused Task covers six of fifteen, under half. The six List screens share the Material list grammar but differ in anchor (search, day header, mono title, first group) and in what a row carries. The six Focused Task screens differ in hero input (stepper, stepper with progress, difference list, text fields) and in consequence line. Passes screen-archetypes §3.

**Forms (patterns §4b).** Nhập, Xuất, Kiểm kê and Điều chỉnh nhanh each show the object (label block or SKU line), make the quantity the hero with a stepper and quick chips, show the consequence live, and reach the CTA through secondary rows (lot, supplier, last movement) instead of empty space.
## Flow decisions

- Onboarding: zero slides. The first screen after sign-in is Tổng quan with its empty state and the Nhập kho button.
- Sign-in timing: at launch, one screen, one path. Breaking patterns §2 because stock data belongs to a warehouse account and nothing can be shown without it; the wall is one screen with company code, email and password, and no social buttons because accounts are issued by the company.
- Permissions: camera on the first tap of Quét or of the scan icon, with the pre-prompt "Để đọc mã vạch trên thùng hàng, app cần dùng camera." Decline path: Nhập mã thủ công, which focuses the code field. No other permission in v1; no notifications.
- Success moment: on Lưu phiếu, Xác nhận xuất and Chốt kiểm kê: one success haptic, the quantity numeral rolls to the new stock (180 ms), the modal closes, and a snackbar "Đã nhập 24 · Hoàn tác" stays 5 s. Nowhere else; a scan hit gets a vibration only.
- Undo: movements can be undone from the snackbar within 5 s and from Chi tiết phiếu within 24 h through a destructive dialog (Hoàn tác / Hủy). Counts cannot be undone after Chốt kiểm kê; the review step is the confirmation.
- Offline: receive, issue and count keep working on cached SKU data; saved movements queue with a top banner and sync when online. Lịch sử shows queued rows with a muted "Chờ đồng bộ".
## Visual QA contract

Phase 7 compares the build against these commitments; none may change without updating this file first.

- Archetype, focal point and signature per screen: as in the inventory. Signature screens are Tổng quan, Kho, Lịch sử, Nhập, Xuất, Kiểm kê (count step). Every other screen has no ink bar.
- Repetition limits: 0 cards on task and list screens; 1 headline module on Tổng quan (a second, smaller module only when a second source of work exists); the ink bar once per screen; 1 ink-block button per screen; 1 display-size numeral per screen.
- Identity element per tab root: Tổng quan the ink bar with the live count; Kho the mono codes and yellow stripes; Lịch sử the ink type tags.
- First viewport per tab root: Tổng quan anchor = the Tồn thấp headline module under the bar, task = see what is left, identity = ink bar, next = Nhập kho. Kho anchor = search and first row, task = find a SKU, identity = mono codes with yellow stripes, next = tap a row. Lịch sử anchor = today's first row, task = check or undo, identity = ink type tags, next = swipe to undo.
- Domain grounding per screen: the real barcode on SKU detail and the three movement screens; mono SKU and location codes on every list; real quantities with the → consequence on every form.
- Posture proof (B17): Material 3 navigation bar, filled text fields, 28 dp modal sheet, full-screen dialog for Nhập and Xuất on Android, page sheet on iOS.
## Rule exceptions

None.

## Change log

- 2026-10-07: created by taste-mobile-app-skill 0.2.0 in --direction-only mode (schema 2). Direction "Nhãn đen" chosen by the user over "Phiếu kho" and "Bảng đếm".
- 2026-10-07: Phase 6 second run built the remaining eleven screens (Xuất kho, Kiểm kê in three steps, Chi tiết SKU, Vị trí, Chi tiết phiếu, Quét, Cài đặt, Đăng nhập, Điều chỉnh nhanh, Lọc lịch sử) plus the auth gate. Nhập and Xuất share one Focused Task component and differ only in consequence line, secondary fields and CTA, which is what the inventory asked for. Phase 7 on the simulator found and fixed in one round: the iOS number pad had no Done because KeyboardToolbar overlapped the sticky footer (replaced by an InputAccessoryView bar on the keyboard itself); the status bar was invisible on surface-topped screens (the ink bar now sets it and surface screens set it back); the scanner had no top inset as a full-screen modal; the permission button stretched full width; focused fields hid behind the sticky footer (scroll offset raised); "chưa đếm" was set in mono; chốt kiểm kê used dismissAll and skipped the tab root.
- 2026-10-07: Phase 7 visual QA on the simulator: the ink-block button directly under the ink bar competed with it for the anchor on Tổng quan (VQ1, VQ8); the headline module now comes first and the action after it. Inventory row and first-viewport commitment updated. Selected chips are tonal with a 2 dp ink border so the primary action stays the only ink block on a screen.
- 2026-10-07: Phase 6 build decision: the ink bar is the top app bar on tab roots and task modals (native header hidden) to avoid two headers; recorded under Chrome before the build.
- 2026-10-07: Phase 5 added the Nav Read, a 15-screen inventory, flow decisions and the Visual QA contract. composition.allowed gained Hero for SKU detail: the label block with barcode is the object and takes the top third, which is the Hero hierarchy; the Phase 4 prohibition had been written before the inventory existed.
