# Example: warehouse app (quản lý kho)

The output of one full run of `taste-mobile-app-skill` 0.2 on an empty repo, brief "app quản lý kho", stack Expo, posture Android-first. Everything here was produced by the skill's phases in order and then checked on a simulator; nothing was hand-designed outside the process.

## What is here

| Path | Phase | Content |
|---|---|---|
| `app/MOBILE-DESIGN.md` | 4, 5, 7 | The locked direction **Nhãn đen** (shipping label × factory kanban board): schema 2 front matter, visual DNA, composition system, Nav Read, a 15-screen inventory, flow decisions, the Visual QA contract, and a change log that records what Phases 5 and 7 changed and why |
| `app/` | 6 | Expo SDK 57 + Expo Router 57 source: tokens, store, components and the screens that were built (Tổng quan, Kho, Lịch sử, Nhập kho) |
| `screens/` | 7 | Simulator screenshots after the fix-once round |

The brief gate took one round of three questions, all accepted by default. Three direction cards were proposed (Phiếu kho, Nhãn đen, Bảng đếm); the user picked Nhãn đen.

## What the build covers

Built: `Tổng quan` (Dashboard), `Kho` (List), `Lịch sử` (List), `Nhập kho` (Focused Task modal with all four states). Shared: the ink bar that doubles as the top app bar, the SKU label block with a real Code 128 barcode, the 56 dp quantity stepper with quick-add chips, the ink-block button, chips, a snackbar with Undo. Data is an in-memory store with realistic SKUs; there is no backend.

Not built: Xuất kho, Kiểm kê (three steps), Chi tiết SKU, Vị trí, Chi tiết phiếu, Quét, Cài đặt, Đăng nhập, Điều chỉnh nhanh. They are specified in the inventory and are the natural next Phase 6 run.

## What Phase 7 found and fixed

Mechanical pass: TypeScript clean, slop grep block clean (five font sizes, three radii, six gap steps, no inline hex, no magic insets), layout-mechanics checklist with file:line evidence.

Visual pass on an iPhone 17 Pro simulator found six defects, fixed in one round and recorded in the design file's change log: the primary button competed with the ink bar for the anchor on Tổng quan, the iOS UI face was not set so nested text inherited the mono face, the modal doubled the top inset on iOS, the consequence line showed "18 → 18" at quantity zero, the snackbar and lists double-counted the tab bar height, and selected chips were a second ink block.

Not verified: the Undo action in the snackbar (implemented, but the tap landed after the 5 s window twice), the save-failed state (the in-memory store only rejects invalid input), and Android, which is the first-class platform.

## Run it

```bash
cd app
npm install --legacy-peer-deps
npx expo start
```

Open in Expo Go on a device or simulator. If Metro reports a missing `babel-preset-expo`, add it as a devDependency; see `references/stack-expo.md` §2.
