// Filter for Lịch sử, set from the filter sheet and read by the list.
import { useSyncExternalStore } from 'react';
import type { MovementType } from './stock';

export type Range = 'today' | '7d' | '30d';
export type HistoryFilter = { types: MovementType[]; range: Range };

const defaultFilter: HistoryFilter = { types: [], range: '30d' };
let filter: HistoryFilter = defaultFilter;
const listeners = new Set<() => void>();

export function setHistoryFilter(next: HistoryFilter) {
  filter = next;
  listeners.forEach((l) => l());
}

export function resetHistoryFilter() {
  setHistoryFilter(defaultFilter);
}

export function useHistoryFilter(): HistoryFilter {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => filter,
  );
}

export const rangeLabel: Record<Range, string> = { today: 'Hôm nay', '7d': '7 ngày', '30d': '30 ngày' };

export function rangeStart(range: Range, now = new Date()): Date {
  const d = new Date(now);
  if (range === 'today') d.setHours(0, 0, 0, 0);
  else d.setDate(d.getDate() - (range === '7d' ? 7 : 30));
  return d;
}
