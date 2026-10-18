export type GpButton =
  | "south"
  | "east"
  | "north"
  | "west"
  | "lb"
  | "rb"
  | "lt"
  | "rt"
  | "start"
  | "back"
  | "guide"
  | "lstick"
  | "rstick"
  | "dup"
  | "ddown"
  | "dleft"
  | "dright"
  // The DualSense touchpad's click.
  | "touchpad";

export type GpAxis = "lx" | "ly" | "rx" | "ry";

// `hid`: read by Harbor straight from the device, not through the WebView.
export type GamepadInfo = { id: number; name: string; hid?: boolean };

export type GamepadEventPayload =
  | { kind: "connected"; id: number; name: string }
  | { kind: "disconnected"; id: number }
  | { kind: "button"; id: number; button: GpButton; pressed: boolean }
  | { kind: "axis"; id: number; axis: GpAxis; value: number }
  // A finger on the touchpad, in 0..1 of its width and height.
  | { kind: "touch"; id: number; x: number; y: number; touching: boolean };
