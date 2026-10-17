// Lookup bindings apply only while picking a word in the subtitles, so they
// can reuse keys the player already uses (the arrows, Enter, Escape).
export type HotkeyScope = "Player" | "Global" | "Manga" | "Lookup";

export type HotkeyId =
  | "playerClose"
  | "playerPlayPause"
  | "playerSeekBack10"
  | "playerSeekForward10"
  | "playerSeekBackShort"
  | "playerSeekForwardShort"
  | "playerSeekBack30"
  | "playerSeekForward30"
  | "playerFrameBack"
  | "playerFrameForward"
  | "playerVolumeUp"
  | "playerVolumeDown"
  | "playerMute"
  | "playerFullscreen"
  | "playerPip"
  | "playerSubtitleCycle"
  | "playerSubtitleCycleAlt"
  | "playerSubtitleToggle"
  | "playerSubNext"
  | "playerSubPrev"
  | "playerSubReplay"
  | "playerHalfSpeed"
  | "playerAnkiNewCard"
  | "playerAnkiUpdateLast"
  | "playerAnkiAudioCard"
  | "playerRecordNew"
  | "playerRecordUpdate"
  | "playerRecordAudio"
  | "playerLookupMode"
  | "lookupNextWord"
  | "lookupPrevWord"
  | "lookupPrevLine"
  | "lookupNextLine"
  | "lookupOpenPopup"
  | "lookupAddAnki"
  | "lookupAiExplain"
  | "lookupWordAudio"
  | "lookupScrollDown"
  | "lookupScrollUp"
  | "lookupExit"
  | "playerNextEpisode"
  | "playerPrevEpisode"
  | "playerPrevChannel"
  | "playerStart"
  | "playerEnd"
  | "playerStats"
  | "playerAnime4kToggle"
  | "playerAnime4kOn"
  | "playerAnime4kOff"
  | "playerRtxHdrToggle"
  | "playerRtxVsrToggle"
  | "playerCrop"
  | "playerPanscanUp"
  | "playerPanscanDown"
  | "playerScreenshot"
  | "playerGifRecord"
  | "playerClipRecord"
  | "playerSpeedDown"
  | "playerSpeedUp"
  | "playerSubDelayDown"
  | "playerSubDelayUp"
  | "playerStreamSwitcher"
  | "playerEpisodePanel"
  | "playerTvGuide"
  | "playerDvr"
  | "playerSleep"
  | "playerScreenLock"
  | "playerReloadSource"
  | "playerRestartServer"
  | "globalUiScaleUp"
  | "globalUiScaleDown"
  | "globalUiScaleReset"
  | "globalSearchFocus"
  | "globalSettingsOpen"
  | "mangaMatch";

export type HotkeyDef = {
  id: HotkeyId;
  scope: HotkeyScope;
  label: string;
  description: string;
  defaultBinding: string;
  group?: string;
};

export const HOTKEYS: HotkeyDef[] = [
  {
    id: "globalSearchFocus",
    scope: "Global",
    group: "Navigation",
    label: "Focus search",
    description: "Jump to the top-bar search from anywhere.",
    defaultBinding: "/",
  },
  {
    id: "globalSettingsOpen",
    scope: "Global",
    group: "Navigation",
    label: "Open settings",
    description: "Open Harbor's settings outside playback.",
    defaultBinding: "ctrl+s",
  },
  {
    id: "globalUiScaleUp",
    scope: "Global",
    group: "Interface",
    label: "Increase interface scale",
    description: "Make Harbor's interface larger.",
    defaultBinding: "ctrl+=",
  },
  {
    id: "globalUiScaleDown",
    scope: "Global",
    group: "Interface",
    label: "Decrease interface scale",
    description: "Make Harbor's interface smaller.",
    defaultBinding: "ctrl+-",
  },
  {
    id: "globalUiScaleReset",
    scope: "Global",
    group: "Interface",
    label: "Reset interface scale",
    description: "Restore Harbor's interface scale to 100%.",
    defaultBinding: "ctrl+0",
  },

  {
    id: "playerClose",
    scope: "Player",
    group: "Playback",
    label: "Close player",
    description: "Exit playback and return to the previous view.",
    defaultBinding: "Escape",
  },
  {
    id: "playerPlayPause",
    scope: "Player",
    group: "Playback",
    label: "Play / pause",
    description: "Toggle playback.",
    defaultBinding: "Space",
  },
  {
    id: "playerFullscreen",
    scope: "Player",
    group: "Playback",
    label: "Toggle fullscreen",
    description: "Enter or exit fullscreen.",
    defaultBinding: "f",
  },
  {
    id: "playerPip",
    scope: "Player",
    group: "Playback",
    label: "Picture-in-picture",
    description: "Pop the video into a small always-on-top window, or restore it.",
    defaultBinding: "u",
  },
  {
    id: "playerScreenLock",
    scope: "Player",
    group: "Playback",
    label: "Lock player controls",
    description: "Block mouse and keyboard input until you unlock the player.",
    defaultBinding: "ctrl+l",
  },
  {
    id: "playerStats",
    scope: "Player",
    group: "Playback",
    label: "Toggle stats overlay",
    description: "Show or hide the playback stats overlay.",
    defaultBinding: "i",
  },
  {
    id: "playerCrop",
    scope: "Player",
    group: "Playback",
    label: "Cycle aspect / crop",
    description: "Cycle aspect and crop modes: Fit, Fill, Zoom, 16:9, 4:3, Original.",
    defaultBinding: "v",
  },
  {
    id: "playerPanscanDown",
    scope: "Player",
    group: "Playback",
    label: "Zoom out",
    description: "Step zoom out to restore baked-in black bars (Zoom mode).",
    defaultBinding: "-",
  },
  {
    id: "playerPanscanUp",
    scope: "Player",
    group: "Playback",
    label: "Zoom in",
    description: "Step zoom in to crop baked-in black bars (Zoom mode).",
    defaultBinding: "=",
  },
  {
    id: "playerScreenshot",
    scope: "Player",
    group: "Playback",
    label: "Screenshot",
    description: "Save the current frame (video only, no subtitles) as a PNG to Pictures/Harbor.",
    defaultBinding: "p",
  },
  {
    id: "playerGifRecord",
    scope: "Player",
    group: "Playback",
    label: "Record GIF",
    description:
      "Start or stop recording a GIF of the video (no subtitles). Saves to Pictures/Harbor.",
    defaultBinding: "o",
  },
  {
    id: "playerClipRecord",
    scope: "Player",
    group: "Playback",
    label: "Save video clip",
    description:
      "Save the last 30 seconds as a video clip with audio, choosing subtitles on or off. Saves to Pictures/Harbor.",
    defaultBinding: "c",
  },
  {
    id: "playerAnime4kToggle",
    scope: "Player",
    group: "Playback",
    label: "Toggle Anime4K",
    description: "Turn Anime4K upscaling on (auto) or off. Only active when shaders are available.",
    defaultBinding: "a",
  },
  {
    id: "playerAnime4kOn",
    scope: "Player",
    group: "Playback",
    label: "Anime4K on",
    description: "Turn Anime4K upscaling on. Only active when shaders are available.",
    defaultBinding: "ctrl+1",
  },
  {
    id: "playerAnime4kOff",
    scope: "Player",
    group: "Playback",
    label: "Anime4K off",
    description: "Turn Anime4K upscaling off.",
    defaultBinding: "ctrl+0",
  },
  {
    id: "playerRtxHdrToggle",
    scope: "Player",
    group: "Playback",
    label: "Toggle RTX Video HDR",
    description:
      "Toggle RTX Video HDR during mpv playback. Unavailable while HDR-to-SDR tonemapping or SVP is active.",
    defaultBinding: "ctrl+h",
  },
  {
    id: "playerRtxVsrToggle",
    scope: "Player",
    group: "Playback",
    label: "Toggle RTX Super Resolution",
    description:
      "Toggle RTX Video Super Resolution during mpv playback. Unavailable while SVP is active.",
    defaultBinding: "ctrl+u",
  },

  {
    id: "playerSeekBack10",
    scope: "Player",
    group: "Seeking",
    label: "Seek back",
    description: "Jump back by the Back seek step set under Behavior.",
    defaultBinding: "ArrowLeft",
  },
  {
    id: "playerSeekForward10",
    scope: "Player",
    group: "Seeking",
    label: "Seek forward",
    description: "Jump forward by the Forward seek step set under Behavior.",
    defaultBinding: "ArrowRight",
  },
  {
    id: "playerSeekBackShort",
    scope: "Player",
    group: "Seeking",
    label: "Short seek back",
    description: "Jump back by the shorter Short seek step set under Behavior.",
    defaultBinding: "shift+ArrowLeft",
  },
  {
    id: "playerSeekForwardShort",
    scope: "Player",
    group: "Seeking",
    label: "Short seek forward",
    description: "Jump forward by the shorter Short seek step set under Behavior.",
    defaultBinding: "shift+ArrowRight",
  },
  {
    id: "playerSeekBack30",
    scope: "Player",
    group: "Seeking",
    label: "Long seek back",
    description: "Jump back by the Long seek step set under Behavior (30 seconds by default).",
    defaultBinding: ",",
  },
  {
    id: "playerSeekForward30",
    scope: "Player",
    group: "Seeking",
    label: "Long seek forward",
    description: "Jump forward by the Long seek step set under Behavior (30 seconds by default).",
    defaultBinding: ".",
  },
  {
    id: "playerFrameBack",
    scope: "Player",
    group: "Seeking",
    label: "Previous frame",
    description: "Step back one frame and pause. Frame-accurate on mpv.",
    defaultBinding: "shift+<",
  },
  {
    id: "playerFrameForward",
    scope: "Player",
    group: "Seeking",
    label: "Next frame",
    description: "Step forward one frame and pause. Frame-accurate on mpv.",
    defaultBinding: "shift+>",
  },
  {
    id: "playerStart",
    scope: "Player",
    group: "Seeking",
    label: "Jump to start",
    description: "Seek to the beginning.",
    defaultBinding: "Home",
  },
  {
    id: "playerEnd",
    scope: "Player",
    group: "Seeking",
    label: "Jump to end",
    description: "Seek to the last half second.",
    defaultBinding: "End",
  },

  {
    id: "playerVolumeUp",
    scope: "Player",
    group: "Volume",
    label: "Volume up",
    description: "Raise volume (hold Shift for big steps).",
    defaultBinding: "ArrowUp",
  },
  {
    id: "playerVolumeDown",
    scope: "Player",
    group: "Volume",
    label: "Volume down",
    description: "Lower volume (hold Shift for big steps).",
    defaultBinding: "ArrowDown",
  },
  {
    id: "playerMute",
    scope: "Player",
    group: "Volume",
    label: "Toggle mute",
    description: "Mute or unmute audio.",
    defaultBinding: "m",
  },

  {
    id: "playerSubtitleCycle",
    scope: "Player",
    group: "Tracks",
    label: "Cycle subtitles",
    description: "Cycle through available subtitle tracks.",
    defaultBinding: "s",
  },
  {
    id: "playerSubtitleCycleAlt",
    scope: "Player",
    group: "Tracks",
    label: "Cycle subtitles (alt)",
    description: "A second binding for the same action so muscle memory survives.",
    defaultBinding: "c",
  },
  {
    id: "playerSubtitleToggle",
    scope: "Player",
    group: "Tracks",
    label: "Toggle subtitles on/off",
    description:
      "Hide every subtitle (primary and secondary), or bring the last primary track back.",
    defaultBinding: "",
  },
  {
    id: "playerSubNext",
    scope: "Player",
    group: "Tracks",
    label: "Next subtitle line",
    description: "Jump to the start of the next subtitle line.",
    defaultBinding: "",
  },
  {
    id: "playerSubPrev",
    scope: "Player",
    group: "Tracks",
    label: "Previous subtitle line",
    description: "Jump to the start of the previous subtitle line (the current one if it just started).",
    defaultBinding: "",
  },
  {
    id: "playerSubReplay",
    scope: "Player",
    group: "Tracks",
    label: "Replay current subtitle",
    description:
      "Go back to the start of the line on screen and play it again, or of the last line shown when there is none.",
    defaultBinding: "",
  },
  {
    id: "playerSubDelayDown",
    scope: "Player",
    group: "Tracks",
    label: "Subtitle delay −0.1s",
    description: "Shift subtitle timing earlier (Shift for fine steps).",
    defaultBinding: "z",
  },
  {
    id: "playerSubDelayUp",
    scope: "Player",
    group: "Tracks",
    label: "Subtitle delay +0.1s",
    description: "Shift subtitle timing later (Shift for fine steps).",
    defaultBinding: "x",
  },

  {
    id: "playerNextEpisode",
    scope: "Player",
    group: "Navigation",
    label: "Next episode",
    description: "Skip to the next episode if available.",
    defaultBinding: "n",
  },
  {
    id: "playerPrevEpisode",
    scope: "Player",
    group: "Navigation",
    label: "Previous episode",
    description: "Skip to the previous episode if available.",
    defaultBinding: "b",
  },
  {
    id: "playerPrevChannel",
    scope: "Player",
    group: "Navigation",
    label: "Previous channel",
    description: "Jump back to the last live channel you watched (live TV only).",
    defaultBinding: "h",
  },

  {
    id: "playerSpeedDown",
    scope: "Player",
    group: "Speed",
    label: "Speed down",
    description: "Slow playback by 0.25x.",
    defaultBinding: "[",
  },
  {
    id: "playerSpeedUp",
    scope: "Player",
    group: "Speed",
    label: "Speed up",
    description: "Speed playback up by 0.25x.",
    defaultBinding: "]",
  },
  {
    id: "playerHalfSpeed",
    scope: "Player",
    group: "Speed",
    label: "Toggle slow speed",
    description: "Switch between normal speed and the slow speed set under Behavior (0.5x by default).",
    defaultBinding: "",
  },

  {
    id: "playerAnkiNewCard",
    scope: "Player",
    group: "Immersion",
    label: "Anki: card from the subtitle",
    description:
      "Add a card from the line on screen with its sentence, audio and picture, using the deck and fields under Dictionary & Anki. With a word selected in the subtitles, the word and its definitions go on the card too. mpv only.",
    defaultBinding: "",
  },
  {
    id: "playerAnkiUpdateLast",
    scope: "Player",
    group: "Immersion",
    label: "Anki: update last card",
    description:
      "Put the line on screen (sentence, audio, picture) into the newest card of the deck, if it was added in the last few minutes. With a word selected, the word and its definitions too. mpv only.",
    defaultBinding: "",
  },
  {
    id: "playerAnkiAudioCard",
    scope: "Player",
    group: "Immersion",
    label: "Anki: audio card",
    description: "Add an audio-only card from the line on screen, using the audio card deck. mpv only.",
    defaultBinding: "",
  },
  {
    id: "playerRecordNew",
    scope: "Player",
    group: "Immersion",
    label: "Record → new card",
    description:
      "Press once to start recording, again to stop and add a card with that stretch. Works without subtitles. With a word selected when you stop, the word and its definitions go on the card too. mpv only.",
    defaultBinding: "",
  },
  {
    id: "playerRecordUpdate",
    scope: "Player",
    group: "Immersion",
    label: "Record → update last card",
    description:
      "Press once to start recording, again to stop and put that stretch into the newest card. Works without subtitles. With a word selected when you stop, the word and its definitions too. mpv only.",
    defaultBinding: "",
  },
  {
    id: "playerRecordAudio",
    scope: "Player",
    group: "Immersion",
    label: "Record → audio card",
    description:
      "Press once to start recording, again to stop and add an audio card with that stretch. Works without subtitles. mpv only.",
    defaultBinding: "",
  },
  {
    id: "playerLookupMode",
    scope: "Player",
    group: "Immersion",
    label: "Pick a word in the subtitles",
    description:
      "Pause and select the first word of the subtitle to look it up without the mouse. Move between words with the Word lookup keys; press again to leave.",
    defaultBinding: "",
  },

  {
    id: "lookupNextWord",
    scope: "Lookup",
    group: "Words",
    label: "Next word",
    description: "Select and look up the next word.",
    defaultBinding: "ArrowRight",
  },
  {
    id: "lookupPrevWord",
    scope: "Lookup",
    group: "Words",
    label: "Previous word",
    description: "Select and look up the previous word.",
    defaultBinding: "ArrowLeft",
  },
  {
    id: "lookupPrevLine",
    scope: "Lookup",
    group: "Words",
    label: "Line above",
    description: "Go to the first word of the subtitle line above.",
    defaultBinding: "ArrowUp",
  },
  {
    id: "lookupNextLine",
    scope: "Lookup",
    group: "Words",
    label: "Line below",
    description: "Go to the first word of the subtitle line below.",
    defaultBinding: "ArrowDown",
  },
  {
    id: "lookupOpenPopup",
    scope: "Lookup",
    group: "Popup",
    label: "Show the popup",
    description:
      "Open or close the dictionary popup for the selected word. Moving to another word closes it.",
    defaultBinding: "Enter",
  },
  {
    id: "lookupAddAnki",
    scope: "Lookup",
    group: "Popup",
    label: "Add to Anki",
    description: "Add the selected word to Anki, like the Anki button in the popup.",
    defaultBinding: "a",
  },
  {
    id: "lookupAiExplain",
    scope: "Lookup",
    group: "Popup",
    label: "Generate AI explanation",
    description: "Generate the AI explanation of the word, or generate it again.",
    defaultBinding: "g",
  },
  {
    id: "lookupWordAudio",
    scope: "Lookup",
    group: "Popup",
    label: "Play word audio",
    description: "Play the word's local audio; press again for the next voice.",
    defaultBinding: "p",
  },
  {
    id: "lookupScrollDown",
    scope: "Lookup",
    group: "Popup",
    label: "Scroll popup down",
    description: "Scroll the definitions down. On a controller the right stick scrolls too.",
    defaultBinding: "shift+ArrowDown",
  },
  {
    id: "lookupScrollUp",
    scope: "Lookup",
    group: "Popup",
    label: "Scroll popup up",
    description: "Scroll the definitions up.",
    defaultBinding: "shift+ArrowUp",
  },
  {
    id: "lookupExit",
    scope: "Lookup",
    group: "Popup",
    label: "Leave word lookup",
    description: "Close the popup and resume playback if picking a word paused it.",
    defaultBinding: "Escape",
  },

  {
    id: "playerStreamSwitcher",
    scope: "Player",
    group: "Panels",
    label: "Stream switcher",
    description: "Open or close the in-player stream switcher.",
    defaultBinding: "w",
  },
  {
    id: "playerEpisodePanel",
    scope: "Player",
    group: "Panels",
    label: "Up next / episodes",
    description: "Open or close the episode panel.",
    defaultBinding: "e",
  },
  {
    id: "playerTvGuide",
    scope: "Player",
    group: "Panels",
    label: "TV guide",
    description: "Open or close the live TV guide (live channels only).",
    defaultBinding: "g",
  },
  {
    id: "playerDvr",
    scope: "Player",
    group: "Panels",
    label: "DVR / record",
    description: "Open or close the live TV recorder (live channels only).",
    defaultBinding: "r",
  },
  {
    id: "playerSleep",
    scope: "Player",
    group: "Panels",
    label: "Sleep at end of episode",
    description: "Toggle a sleep timer that pauses when this episode ends.",
    defaultBinding: "l",
  },

  {
    id: "playerReloadSource",
    scope: "Player",
    group: "Recovery",
    label: "Reload source",
    description: "Re-open the stream you are watching and pick it back up where you left off.",
    defaultBinding: "ctrl+alt+r",
  },
  {
    id: "playerRestartServer",
    scope: "Player",
    group: "Recovery",
    label: "Restart streaming server",
    description:
      "Restart Harbor's own streaming server, then reload the stream once it is back. Desktop only.",
    defaultBinding: "ctrl+alt+s",
  },

  {
    id: "mangaMatch",
    scope: "Manga",
    group: "Reader",
    label: "Manga match",
    description: "Open the match picker to map the current manga to AniList or MyAnimeList.",
    defaultBinding: "c",
  },
];

export const HOTKEY_MAP: Record<HotkeyId, HotkeyDef> = Object.fromEntries(
  HOTKEYS.map((h) => [h.id, h]),
) as Record<HotkeyId, HotkeyDef>;

export function eventToBinding(e: KeyboardEvent): string {
  const mods: string[] = [];
  let key = e.key;
  const isLetter = key.length === 1 && /[a-zA-Z]/.test(key);
  if (e.ctrlKey) mods.push("ctrl");
  if (e.shiftKey && !isLetter) mods.push("shift");
  if (e.altKey) mods.push("alt");
  if (e.metaKey) mods.push("meta");
  if (key === " ") key = "Space";
  if (isLetter) key = key.toLowerCase();
  return mods.length === 0 ? key : mods.join("+") + "+" + key;
}

export function isModifierOnly(e: KeyboardEvent): boolean {
  return e.key === "Shift" || e.key === "Control" || e.key === "Alt" || e.key === "Meta";
}

export function isTypingTarget(e: KeyboardEvent): boolean {
  const node = (e.target as HTMLElement | null) ?? (document.activeElement as HTMLElement | null);
  if (!node || node.nodeType !== 1) return false;
  const tag = node.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (node.isContentEditable) return true;
  const role = node.getAttribute("role");
  return role === "textbox" || role === "searchbox" || role === "combobox";
}

export function shouldHandleGlobalKeyboardEvent(e: KeyboardEvent): boolean {
  if (typeof document !== "undefined" && !document.hasFocus()) return false;
  return !e.isComposing && e.key !== "Process" && !isTypingTarget(e);
}

export function matchesBinding(e: KeyboardEvent, binding: string): boolean {
  return eventToBinding(e) === binding;
}

export function effectiveBinding(id: HotkeyId, overrides: Record<string, string>): string {
  const ov = overrides[id];
  if (typeof ov === "string" && ov.length > 0) return ov;
  return HOTKEY_MAP[id].defaultBinding;
}

export function formatBindingForDisplay(binding: string): string {
  return binding
    .split("+")
    .map((p) => {
      if (p === "ctrl") return "Ctrl";
      if (p === "shift") return "Shift";
      if (p === "alt") return "Alt";
      if (p === "meta") return "⌘";
      if (p === " ") return "Space";
      if (p === "ArrowUp") return "↑";
      if (p === "ArrowDown") return "↓";
      if (p === "ArrowLeft") return "←";
      if (p === "ArrowRight") return "→";
      if (p.length === 1) return p.toUpperCase();
      return p;
    })
    .join(" + ");
}

export function findHotkeyMatch(
  e: KeyboardEvent,
  overrides: Record<string, string>,
  scope: HotkeyScope,
): HotkeyId | null {
  const binding = eventToBinding(e);
  for (const def of HOTKEYS) {
    if (def.scope !== scope) continue;
    if (effectiveBinding(def.id, overrides) === binding) return def.id;
  }
  return null;
}
