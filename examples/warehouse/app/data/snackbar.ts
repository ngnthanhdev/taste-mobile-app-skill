// One snackbar at a time, owned by the tab root that is visible. Modals post to it before closing.
import { useSyncExternalStore } from 'react';

export type Snack = { id: number; message: string; actionLabel?: string; onAction?: () => void };

let current: Snack | null = null;
let seq = 0;
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setTimeout> | null = null;
const DURATION_MS = 5000;

function emit() {
  listeners.forEach((l) => l());
}

export function showSnack(snack: Omit<Snack, 'id'>) {
  if (timer) clearTimeout(timer);
  current = { ...snack, id: ++seq };
  emit();
  timer = setTimeout(dismissSnack, DURATION_MS);
}

export function dismissSnack() {
  if (timer) clearTimeout(timer);
  timer = null;
  current = null;
  emit();
}

export function useSnack(): Snack | null {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => current,
  );
}
