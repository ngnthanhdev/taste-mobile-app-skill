// Draft of a stock count in progress: one location, counted quantities per SKU. Lives until committed or abandoned.
import { useSyncExternalStore } from 'react';

export type CountDraft = { locationCode: string; counted: Record<string, number>; startedAt: number };

let draft: CountDraft | null = null;
const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}

export function startCount(locationCode: string) {
  draft = { locationCode, counted: {}, startedAt: Date.now() };
  emit();
}

export function setCounted(skuCode: string, value: number) {
  if (!draft) return;
  draft = { ...draft, counted: { ...draft.counted, [skuCode]: value } };
  emit();
}

export function clearCount() {
  draft = null;
  emit();
}

export function useCountDraft(): CountDraft | null {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => draft,
  );
}
