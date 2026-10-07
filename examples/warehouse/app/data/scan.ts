// The last barcode read by the scanner. The screen that opened the scanner consumes it when it regains focus.
let last: { code: string; at: number } | null = null;

export function publishScan(code: string) {
  last = { code, at: Date.now() };
}

/** Returns a scan newer than `since` once, then clears it. */
export function consumeScan(since: number): string | null {
  if (!last || last.at < since) return null;
  const code = last.code;
  last = null;
  return code;
}
