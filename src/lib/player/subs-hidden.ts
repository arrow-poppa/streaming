import { useSyncExternalStore } from "react";

// Subtitles hidden by the Toggle subtitles hotkey. The track stays selected,
// so line seeking, replay and Anki cards keep working from its timing and
// text; only what is drawn (by mpv or by Harbor) goes away. Choosing a track
// shows them again. The player resets it when it opens another title, and
// keeps it across that title's episodes.

let hidden = false;
const listeners = new Set<() => void>();

export function setSubsHidden(on: boolean): void {
  if (hidden === on) return;
  hidden = on;
  for (const l of listeners) l();
}

export function isSubsHidden(): boolean {
  return hidden;
}

export function useSubsHidden(): boolean {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => hidden,
    () => false,
  );
}
