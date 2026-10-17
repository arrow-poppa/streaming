import { HOTKEY_MAP, effectiveBinding, type HotkeyId } from "@/lib/hotkeys";
import { bindingToKeyInit } from "./bindings";

// How a controller button reaches the action it is bound to. Player actions
// run by id through the player's own shortcut handler, so they work even
// without a keyboard key. Global and manga actions have their handlers spread
// across the app, all matching on the keyboard binding, so for those the
// binding is replayed as a key press.

export const PLAYER_HOTKEY_EVENT = "harbor:player-hotkey";

export type PlayerHotkeyDetail = { id: HotkeyId; repeat: boolean };

export function runPadAction(
  id: HotkeyId,
  overrides: Record<string, string>,
  repeat: boolean,
): void {
  if (HOTKEY_MAP[id].scope === "Player") {
    window.dispatchEvent(
      new CustomEvent<PlayerHotkeyDetail>(PLAYER_HOTKEY_EVENT, { detail: { id, repeat } }),
    );
    return;
  }
  const init = bindingToKeyInit(effectiveBinding(id, overrides));
  if (!init) return;
  window.dispatchEvent(new KeyboardEvent("keydown", { ...init, repeat }));
  window.dispatchEvent(new KeyboardEvent("keyup", init));
}
