// In-memory stock store for the sandbox. Shapes match what a warehouse backend returns; there is no
// network layer yet, so the only rejections are validation ones. Screens subscribe with useStock().
import { useSyncExternalStore } from 'react';

export type Sku = {
  code: string;
  name: string;
  unit: string;
  onHand: number;
  minimum: number;
  location: string;
  lastReceipt?: { quantity: number; at: string; supplier: string };
};

export type ReceiptInput = {
  skuCode: string;
  quantity: number;
  lot?: string;
  expiry?: string;
  supplier?: string;
  note?: string;
};

export type Movement = ReceiptInput & { id: string; skuName: string; unit: string; type: 'receive'; at: string; undone?: boolean };

const skus: Record<string, Sku> = {
  '8936012340017': {
    code: '8936012340017',
    name: 'Găng tay nitrile M (hộp 100)',
    unit: 'hộp',
    onHand: 18,
    minimum: 50,
    location: 'A-03-2',
    lastReceipt: { quantity: 40, at: '2026-10-03T08:12:00+07:00', supplier: 'Vinamed' },
  },
  '8934563102114': {
    code: '8934563102114',
    name: 'Băng keo trong 48mm x 100y',
    unit: 'cuộn',
    onHand: 212,
    minimum: 120,
    location: 'B-01-4',
    lastReceipt: { quantity: 144, at: '2026-09-28T14:40:00+07:00', supplier: 'Tân Phát' },
  },
  '8938505970012': {
    code: '8938505970012',
    name: 'Thùng carton 3 lớp 40×30×30',
    unit: 'cái',
    onHand: 35,
    minimum: 200,
    location: 'C-02-1',
  },
};

const movements: Movement[] = [];
let version = 0;
const listeners = new Set<() => void>();
function emit() {
  version += 1;
  listeners.forEach((l) => l());
}

export const suppliers = ['Vinamed', 'Tân Phát', 'Hòa Bình Logistics'];

export async function getSku(code: string): Promise<Sku | undefined> {
  const sku = skus[code];
  return sku ? { ...sku } : undefined;
}

export function listSkus(): Sku[] {
  return Object.values(skus).sort((a, b) => a.name.localeCompare(b.name, 'vi'));
}

export function listLowStock(): Sku[] {
  return listSkus().filter((s) => s.onHand < s.minimum);
}

export function listMovements(): Movement[] {
  return [...movements].reverse();
}

export async function receive(input: ReceiptInput): Promise<Movement> {
  if (!Number.isInteger(input.quantity) || input.quantity <= 0) {
    throw new Error('Số lượng phải là số nguyên lớn hơn 0');
  }
  const sku = skus[input.skuCode];
  if (!sku) throw new Error('Không tìm thấy SKU');
  sku.onHand += input.quantity;
  const at = new Date().toISOString();
  sku.lastReceipt = { quantity: input.quantity, at, supplier: input.supplier ?? 'Không rõ' };
  const movement: Movement = { ...input, id: `${Date.now()}`, skuName: sku.name, unit: sku.unit, type: 'receive', at };
  movements.push(movement);
  emit();
  return movement;
}

export function undoMovement(id: string): boolean {
  const m = movements.find((x) => x.id === id && !x.undone);
  if (!m) return false;
  skus[m.skuCode].onHand -= m.quantity;
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

export function formatQuantity(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(n);
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
