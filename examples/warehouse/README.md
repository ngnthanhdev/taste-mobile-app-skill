# Example: warehouse app (quản lý kho)

The output of one full run of `taste-mobile-app-skill` 0.2 on an empty repo, brief "app quản lý kho", stack Expo, posture Android-first. Everything here was produced by the skill's phases in order and then checked on a simulator; nothing was hand-designed outside the process.

## What is here

| Path | Phase | Content |
|---|---|---|
| `app/MOBILE-DESIGN.md` | 4, 5, 7 | The locked direction **Nhãn đen** (shipping label × factory kanban board): schema 2 front matter, visual DNA, composition system, Nav Read, a 15-screen inventory, flow decisions, the Visual QA contract, and a change log that records what Phases 5 and 7 changed and why |
| `app/` | 6 | Expo SDK 57 + Expo Router 57 source: tokens, in-memory stores, components and all fifteen inventory screens |
| `screens/` | 7 | Simulator screenshots after the fix-once rounds |

The brief gate took one round of three questions, all accepted by default. Three direction cards were proposed (Phiếu kho, Nhãn đen, Bảng đếm); the user picked Nhãn đen.

## What the build covers

Every screen in the inventory, in two Phase 6 runs:

- Tab roots: `Tổng quan` (Dashboard), `Kho` (List), `Lịch sử` (List, with the filter form sheet).
- Movements: `Nhập kho` and `Xuất kho` share one Focused Task component (`components/MovementScreen.tsx`); they differ in consequence line, secondary fields and CTA, not in composition. `Điều chỉnh nhanh` is a form sheet on the SKU.
- `Kiểm kê` is a three-step full-screen group: pick a shelf, count each SKU with the stepper, review only the differences, commit.
- Detail screens with the native header: `Chi tiết SKU` (Hero, the label block with its barcode), `Vị trí` (List), `Chi tiết phiếu` (List, Undo within 24 h through a destructive dialog), `Cài đặt` (List, sign-out last in the danger color).
- `Quét`: Immersive camera with `expo-camera`, permission asked at the moment of need with one sentence of benefit, torch, manual entry as the decline path; a hit returns the code to the screen that opened it.
- `Đăng nhập`: one path, errors per field, gated with `Stack.Protected`.

Shared primitives: the ink bar that doubles as the top app bar, the SKU label block with a real Code 128 barcode, the 56 dp quantity stepper with quick-add chips and a Done bar on the iOS number pad, the ink-block button, chips, filled fields, a snackbar with Undo. Data lives in in-memory stores (`data/`) with realistic SKUs and locations; there is no backend, so every movement is real inside the session and gone on restart.

## What Phase 7 found and fixed

Mechanical pass: TypeScript clean, slop grep block clean (five font sizes, three radii, six gap steps, no inline hex, no magic insets), layout-mechanics checklist with file:line evidence.

Visual pass on an iPhone 17 Pro simulator, first run: the primary button competed with the ink bar for the anchor on Tổng quan, the iOS UI face was not set so nested text inherited the mono face, the modal doubled the top inset on iOS, the consequence line showed "18 → 18" at quantity zero, the snackbar and lists double-counted the tab bar height, and selected chips were a second ink block.

Second run: the iOS number pad had no Done because the keyboard toolbar overlapped the sticky footer (replaced by an accessory bar on the keyboard), the status bar disappeared on surface-topped screens, the scanner lacked a top inset as a full-screen modal, the permission button stretched full width, focused fields hid behind the sticky footer, "chưa đếm" was set in the mono face, and committing a count skipped the tab root. All recorded in the design file's change log.

Verified on the simulator: sign-in with per-field errors, the full count flow with two differences committed, scan by manual entry returning to Xuất kho, over-stock blocking the CTA, discard confirmation on a dirty modal, quick adjustment and its Undo from the movement detail, the history filter, settings. Not verified: the snackbar Undo within its 5 s window (the detail-screen Undo covers the same store call), the save-failed state (the stores only reject invalid input), live barcode detection (no camera in the simulator), and Android, which is the first-class platform.

## Run it

```bash
cd app
npm install --legacy-peer-deps
npx expo start
```

Open in Expo Go on a device or simulator. If Metro reports a missing `babel-preset-expo`, add it as a devDependency; see `references/stack-expo.md` §2.
