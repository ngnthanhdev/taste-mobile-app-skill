// In-memory stock store for the example. Shapes match what a warehouse backend returns; there is no
// network layer, so the only rejections are validation ones. Screens subscribe with useStock().
import { useSyncExternalStore } from 'react';

export type Sku = {
  code: string;
  name: string;
  unit: string;
  onHand: number;
  minimum: number;
  location: string;
  lastReceipt?: { quantity: number; at: string; supplier: string };
  lastIssue?: { quantity: number; at: string; reference: string };
  lastCount?: string;
};

export type Location = { code: string; zone: string; lastCount?: string };

export type MovementType = 'receive' | 'issue' | 'count' | 'adjust';

export type Movement = {
  id: string;
  type: MovementType;
  skuCode: string;
  skuName: string;
  unit: string;
  /** Signed change applied to onHand. */
  delta: number;
  at: string;
  by: string;
  location: string;
  lot?: string;
  expiry?: string;
  supplier?: string;
  reference?: string;
  reason?: string;
  note?: string;
  undone?: boolean;
};

export type ReceiptInput = { skuCode: string; quantity: number; lot?: string; expiry?: string; supplier?: string; note?: string };
export type IssueInput = { skuCode: string; quantity: number; reference?: string; note?: string };

const skus: Record<string, Sku> = {
  '8936012340017': {
    code: '8936012340017',
    name: 'Găng tay nitrile M (hộp 100)',
    unit: 'hộp',
    onHand: 18,
    minimum: 50,
    location: 'A-03-2',
    lastReceipt: { quantity: 40, at: '2026-10-03T08:12:00+07:00', supplier: 'Vinamed' },
    lastIssue: { quantity: 22, at: '2026-10-06T15:20:00+07:00', reference: 'DX-2610-031' },
    lastCount: '2026-09-30T17:00:00+07:00',
  },
  '8934563102114': {
    code: '8934563102114',
    name: 'Băng keo trong 48mm x 100y',
    unit: 'cuộn',
    onHand: 212,
    minimum: 120,
    location: 'B-01-4',
    lastReceipt: { quantity: 144, at: '2026-09-28T14:40:00+07:00', supplier: 'Tân Phát' },
    lastCount: '2026-09-30T17:00:00+07:00',
  },
  '8938505970012': {
    code: '8938505970012',
    name: 'Thùng carton 3 lớp 40×30×30',
    unit: 'cái',
    onHand: 35,
    minimum: 200,
    location: 'C-02-1',
  },
  '8935049500264': {
    code: '8935049500264',
    name: 'Màng PE quấn pallet 500mm',
    unit: 'cuộn',
    onHand: 64,
    minimum: 40,
    location: 'A-03-2',
    lastReceipt: { quantity: 48, at: '2026-10-01T09:05:00+07:00', supplier: 'Hòa Bình Logistics' },
    lastCount: '2026-09-30T17:00:00+07:00',
  },
};

const locations: Record<string, Location> = {
  'A-03-2': { code: 'A-03-2', zone: 'Khu A · kệ 03 · tầng 2', lastCount: '2026-09-30T17:00:00+07:00' },
  'B-01-4': { code: 'B-01-4', zone: 'Khu B · kệ 01 · tầng 4', lastCount: '2026-09-30T17:00:00+07:00' },
  'C-02-1': { code: 'C-02-1', zone: 'Khu C · kệ 02 · tầng 1' },
};

const movements: Movement[] = [];
let version = 0;
const listeners = new Set<() => void>();
function emit() {
  version += 1;
  listeners.forEach((l) => l());
}
let currentUser = 'Nhân viên kho';
export function setCurrentUser(name: string) {
  currentUser = name;
}

export const suppliers = ['Vinamed', 'Tân Phát', 'Hòa Bình Logistics'];
export const adjustReasons = ['Hỏng', 'Mất', 'Đếm sai', 'Trả hàng'];

export async function getSku(code: string): Promise<Sku | undefined> {
  const sku = skus[code];
  return sku ? { ...sku } : undefined;
}

export function getSkuSync(code: string): Sku | undefined {
  const sku = skus[code];
  return sku ? { ...sku } : undefined;
}

export function listSkus(): Sku[] {
  return Object.values(skus).sort((a, b) => a.name.localeCompare(b.name, 'vi'));
}

export function listLowStock(): Sku[] {
  return listSkus().filter((s) => s.onHand < s.minimum);
}

export function listLocations(): Location[] {
  return Object.values(locations).sort((a, b) => a.code.localeCompare(b.code));
}

export function getLocation(code: string): Location | undefined {
  return locations[code];
}

export function listSkusAt(locationCode: string): Sku[] {
  return listSkus().filter((s) => s.location === locationCode);
}

export function listMovements(): Movement[] {
  return [...movements].reverse();
}

export function listMovementsFor(skuCode: string): Movement[] {
  return listMovements().filter((m) => m.skuCode === skuCode);
}

export function getMovement(id: string): Movement | undefined {
  return movements.find((m) => m.id === id);
}

function record(partial: Omit<Movement, 'id' | 'at' | 'by' | 'skuName' | 'unit' | 'location'> & { skuCode: string }): Movement {
  const sku = skus[partial.skuCode];
  if (!sku) throw new Error('Không tìm thấy SKU');
  const movement: Movement = {
    ...partial,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    at: new Date().toISOString(),
    by: currentUser,
    skuName: sku.name,
    unit: sku.unit,
    location: sku.location,
  };
  sku.onHand += movement.delta;
  movements.push(movement);
  return movement;
}

function assertQuantity(quantity: number) {
  if (!Number.isInteger(quantity) || quantity <= 0) throw new Error('Số lượng phải là số nguyên lớn hơn 0');
}

export async function receive(input: ReceiptInput): Promise<Movement> {
  assertQuantity(input.quantity);
  const sku = skus[input.skuCode];
  if (!sku) throw new Error('Không tìm thấy SKU');
  const movement = record({ type: 'receive', skuCode: input.skuCode, delta: input.quantity, lot: input.lot, expiry: input.expiry, supplier: input.supplier, note: input.note });
  sku.lastReceipt = { quantity: input.quantity, at: movement.at, supplier: input.supplier ?? 'Không rõ' };
  emit();
  return movement;
}

export async function issue(input: IssueInput): Promise<Movement> {
  assertQuantity(input.quantity);
  const sku = skus[input.skuCode];
  if (!sku) throw new Error('Không tìm thấy SKU');
  if (input.quantity > sku.onHand) throw new Error(`Vượt tồn ${input.quantity - sku.onHand} ${sku.unit}`);
  const movement = record({ type: 'issue', skuCode: input.skuCode, delta: -input.quantity, reference: input.reference, note: input.note });
  sku.lastIssue = { quantity: input.quantity, at: movement.at, reference: input.reference ?? 'Không có mã đơn' };
  emit();
  return movement;
}

export async function adjust(skuCode: string, delta: number, reason: string): Promise<Movement> {
  if (!Number.isInteger(delta) || delta === 0) throw new Error('Số điều chỉnh phải khác 0');
  const sku = skus[skuCode];
  if (!sku) throw new Error('Không tìm thấy SKU');
  if (sku.onHand + delta < 0) throw new Error('Tồn không thể âm');
  const movement = record({ type: 'adjust', skuCode, delta, reason });
  emit();
  return movement;
}

/** Commits a count: one movement per SKU whose counted quantity differs from the book. */
export async function commitCount(locationCode: string, counted: Record<string, number>): Promise<Movement[]> {
  const location = locations[locationCode];
  if (!location) throw new Error('Không tìm thấy vị trí');
  const at = new Date().toISOString();
  const result: Movement[] = [];
  for (const sku of listSkusAt(locationCode)) {
    const value = counted[sku.code];
    if (value === undefined) continue;
    const delta = value - sku.onHand;
    if (delta !== 0) result.push(record({ type: 'count', skuCode: sku.code, delta, reason: `Kiểm kê ${locationCode}` }));
    skus[sku.code].lastCount = at;
  }
  location.lastCount = at;
  emit();
  return result;
}

export function canUndo(movement: Movement, now = Date.now()): boolean {
  if (movement.undone || movement.type === 'count') return false;
  return now - new Date(movement.at).getTime() < 24 * 3_600_000;
}

export function undoMovement(id: string): boolean {
  const m = movements.find((x) => x.id === id);
  if (!m || !canUndo(m)) return false;
  skus[m.skuCode].onHand -= m.delta;
  m.undone = true;
  emit();
  return true;
}

export function useStock(): number {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => version,
  );
}

export const movementLabel: Record<MovementType, string> = { receive: 'NHẬP', issue: 'XUẤT', count: 'KIỂM', adjust: 'CHỈNH' };

export function formatQuantity(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(n);
}

export function formatSigned(n: number): string {
  return n > 0 ? `+${formatQuantity(n)}` : n < 0 ? `−${formatQuantity(-n)}` : '0';
}

export function formatRelativeDay(iso: string, now = new Date()): string {
  const days = Math.floor((now.getTime() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return 'hôm nay';
  if (days === 1) return 'hôm qua';
  return `${days} ngày trước`;
}

export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(iso));
}
