import { useEffect, useRef } from "react";
import { setGamepadCapture } from "./capture";
import { PAD_BUTTONS, PAD_MODIFIERS } from "./bindings";
import { liveButtons, subscribeLive } from "./live";
import type { GpButton } from "./protocol";

/** While `active`, waits for a controller chord and hands it over, keeping the
 *  press from also acting on the app. A shoulder or trigger pressed and let go
 *  on its own is a chord by itself; held while another button goes down it
 *  becomes "modifier+button", the same rule the runtime applies. */
export function usePadCapture(active: boolean, onChord: (chord: string) => void): void {
  const onChordRef = useRef(onChord);
  onChordRef.current = onChord;

  useEffect(() => {
    if (!active) return;
    setGamepadCapture(true);
    let prev = liveButtons();
    // Held modifiers, and whether another button joined them.
    const mods = new Map<GpButton, boolean>();
    let finished = false;
    const finish = (chord: string) => {
      if (finished) return;
      finished = true;
      unsubscribe();
      // Let the release of the captured button pass before input flows again.
      window.setTimeout(() => setGamepadCapture(false), 150);
      onChordRef.current(chord);
    };
    const unsubscribe = subscribeLive(() => {
      const now = liveButtons();
      for (const b of PAD_BUTTONS) {
        const was = !!prev[b];
        const is = !!now[b];
        if (is && !was) {
          const held = PAD_MODIFIERS.find((m) => m !== b && mods.has(m));
          if (held) {
            finish(`${held}+${b}`);
            return;
          }
          if (PAD_MODIFIERS.includes(b)) mods.set(b, false);
          else {
            finish(b);
            return;
          }
        } else if (!is && was && mods.has(b)) {
          mods.delete(b);
          finish(b);
          return;
        }
      }
      prev = now;
    });
    return () => {
      unsubscribe();
      if (!finished) setGamepadCapture(false);
    };
  }, [active]);
}
