// Presets offered by the pickers. Any value inside the range is accepted, so a
// step like 2s back / 5s forward for re-listening to a line is just as valid.
export const SEEK_STEP_OPTIONS = [1, 3, 5, 10, 15, 30, 60, 90] as const;

export const SEEK_STEP_MIN_SEC = 0.1;
export const SEEK_STEP_MAX_SEC = 600;

export function isSeekStepSeconds(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= SEEK_STEP_MIN_SEC &&
    value <= SEEK_STEP_MAX_SEC
  );
}

export function sanitizeSeekStep(value: unknown, fallback: number): number {
  return isSeekStepSeconds(value) ? Math.round(value * 10) / 10 : fallback;
}

/** The presets plus the current value, sorted, so a custom step stays visible. */
export function seekStepChoices(current: number, presets: readonly number[] = SEEK_STEP_OPTIONS): number[] {
  return [...new Set([...presets, current])].sort((a, b) => a - b);
}

/** "2s", "0.5s". */
export function formatSeekStep(seconds: number): string {
  return `${Number(seconds.toFixed(1))}s`;
}

export const HALF_SPEED_MIN = 0.1;
export const HALF_SPEED_MAX = 4;

export function sanitizeHalfSpeedRate(value: unknown, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  if (value < HALF_SPEED_MIN || value > HALF_SPEED_MAX) return fallback;
  return Math.round(value * 100) / 100;
}
