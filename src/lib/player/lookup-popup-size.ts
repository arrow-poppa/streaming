// Size of the subtitle dictionary popup, in percent of its normal size. The
// whole popup scales (text, buttons, width), so it stays readable on a TV.

export const POPUP_SIZE_MIN = 75;
export const POPUP_SIZE_MAX = 250;
export const POPUP_SIZE_STEP = 10;
/** Width of the popup at 100%, in CSS pixels. */
export const POPUP_BASE_WIDTH = 460;

export function sanitizePopupSize(value: unknown, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.round(Math.max(POPUP_SIZE_MIN, Math.min(POPUP_SIZE_MAX, value)));
}

/** The size one hotkey press bigger (dir 1) or smaller (dir -1). */
export function stepPopupSize(current: number, dir: 1 | -1): number {
  return sanitizePopupSize(current + dir * POPUP_SIZE_STEP, 100);
}
