// Finger movement on a controller touchpad, turned into how far the
// controller cursor should move: like a laptop touchpad, only the movement
// counts, not where the finger is. gamepad-runner takes it every frame.

let last: { x: number; y: number } | null = null;
let dx = 0;
let dy = 0;

/** A touchpad report, in 0..1 of the pad's width and height. */
export function pushTouch(x: number, y: number, touching: boolean): void {
  if (!touching) {
    last = null;
    return;
  }
  if (last) {
    dx += x - last.x;
    dy += y - last.y;
  }
  last = { x, y };
}

/** The movement since the last call, in pad widths and heights. */
export function takeTouchDelta(): { x: number; y: number } {
  const d = { x: dx, y: dy };
  dx = 0;
  dy = 0;
  return d;
}

export function resetTouch(): void {
  last = null;
  dx = 0;
  dy = 0;
}
