// Whether the controller pointer is on screen and resting on a subtitle that
// can be looked up, or on its dictionary popup. There A clicks like the mouse
// and the left stick scrolls, so neither also does its player job.

export const POINTER_SHOWN_ATTR = "data-gamepad-pointer";
const ON_LOOKUP = "[data-hb-subtitle][data-gamepad-hover], .hb-lookup-popup[data-gamepad-hover]";

export function isLookupTarget(el: Element): boolean {
  return el.hasAttribute("data-hb-subtitle") || el.classList.contains("hb-lookup-popup");
}

export function pointerOnLookup(): boolean {
  return (
    document.documentElement.hasAttribute(POINTER_SHOWN_ATTR) && !!document.querySelector(ON_LOOKUP)
  );
}
