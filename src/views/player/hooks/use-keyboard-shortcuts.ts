import { useEffect, useRef, useState, type RefObject } from "react";
import { invoke } from "@tauri-apps/api/core";
import type { PlayerBridge, PlayerSnapshot } from "@/lib/player/bridge";
import { writePlayerPrefs } from "@/lib/player-prefs";
import { writePlayerVolume } from "@/lib/player-volume";
import { effectiveBinding, eventToBinding, isTypingTarget, type HotkeyId } from "@/lib/hotkeys";
import { isWindowsDesktop } from "@/lib/platform";
import { isRtxHdrBlocked, isRtxVsrBlocked } from "@/lib/player/rtx-video-policy";
import { mediaKeyGate } from "@/lib/media-session";
import { setVideoOwnsMediaKeys } from "@/lib/player/media-key-owner";
import { useSettings } from "@/lib/settings";
import { isAnyFullscreen, exitAnyFullscreen } from "@/lib/fullscreen-state";
import { isBigPictureActive } from "@/lib/big-picture";
import { getLeaveConfirm, openLeaveConfirm } from "@/lib/player/leave-confirm";
import { isPlayerInteractionLocked } from "@/lib/player/interaction-lock";
import { round2 } from "../player-utils";
import type { ImmersionAction } from "./use-immersion";
import { subCueSeekTarget } from "@/lib/player/sub-seek";
import { getPlaybackPosition } from "@/lib/player/playback-clock";
import { LOOKUP_ACTIONS, isLookupNavActive, sendLookupCommand } from "@/lib/player/lookup-nav";
import { PLAYER_HOTKEY_EVENT, type PlayerHotkeyDetail } from "@/lib/gamepad/dispatch";

import { SFX } from "@/lib/sfx";

export function useKeyboardShortcuts(params: {
  bridgeRef: RefObject<PlayerBridge | null>;
  snap: PlayerSnapshot;
  drawMode: boolean;
  setDrawMode: (v: boolean) => void;
  closePlayer: () => void;
  returnToPreview?: () => void;
  playPauseToggle: () => void;
  seekStep: (delta: number) => void;
  seekTo: (sec: number) => void;
  onFrameStep?: (dir: 1 | -1) => void;
  toggleFullscreen: () => void;
  togglePip?: () => void;
  fullscreen: boolean;
  cycleSubtitles: () => void;
  setShowStats: (updater: (prev: boolean) => boolean) => void;
  metaId: string;
  svpActive: boolean;
  onNextEp?: () => void;
  onPrevEp?: () => void;
  hasNextEp?: boolean;
  hasPrevEp?: boolean;
  toggleSwitcher?: () => void;
  toggleEpisodePanel?: () => void;
  toggleGuide?: () => void;
  toggleDvr?: () => void;
  toggleSleep?: () => void;
  onScreenshot?: () => void;
  onGifRecord?: () => void;
  onClipRecord?: () => void;
  onToggleCrop?: () => void;
  onPanscanUp?: () => void;
  onPanscanDown?: () => void;
  onPrevChannel?: () => void;
  onToggleAnime4k?: () => void;
  onAnime4kOn?: () => void;
  onAnime4kOff?: () => void;
  onReloadSource?: () => void;
  onRestartServer?: () => void;
  onVolumeFeedback?: (volume: number, muted: boolean) => void;
  onToggleSubtitles?: () => void;
  onImmersion?: (action: ImmersionAction) => void;
  onLookupMode?: () => void;
}) {
  const {
    bridgeRef,
    snap,
    drawMode,
    setDrawMode,
    closePlayer,
    returnToPreview,
    playPauseToggle,
    seekStep,
    seekTo,
    onFrameStep,
    toggleFullscreen,
    togglePip,
    cycleSubtitles,
    setShowStats,
    metaId,
    svpActive,
    onNextEp,
    onPrevEp,
    hasNextEp,
    hasPrevEp,
    toggleSwitcher,
    toggleEpisodePanel,
    toggleGuide,
    toggleDvr,
    toggleSleep,
    onScreenshot,
    onGifRecord,
    onClipRecord,
    onToggleCrop,
    onPanscanUp,
    onPanscanDown,
    onPrevChannel,
    onToggleAnime4k,
    onAnime4kOn,
    onAnime4kOff,
    onReloadSource,
    onRestartServer,
    onVolumeFeedback,
    onToggleSubtitles,
    onImmersion,
    onLookupMode,
  } = params;
  const { settings, update } = useSettings();
  const overrides = settings.hotkeys ?? {};
  const seekBackStepSec = settings.seekBackStepSec;
  const seekForwardStepSec = settings.seekForwardStepSec;
  const seekBackStepShortSec = settings.seekBackStepShortSec;
  const seekForwardStepShortSec = settings.seekForwardStepShortSec;
  const seekBackStepLongSec = settings.seekBackStepLongSec;
  const seekForwardStepLongSec = settings.seekForwardStepLongSec;
  // Rapid presses step line by line from where the last jump was headed, not
  // from a position the player has not reported yet.
  const subSeekRef = useRef<{ target: number; at: number } | null>(null);
  const [subtitleOffsetSec, setSubtitleOffsetSec] = useState<number | null>(null);
  const subtitleOffsetTimerRef = useRef<number | null>(null);
  const showSubtitleOffset = (delaySec: number) => {
    setSubtitleOffsetSec(delaySec);
    if (subtitleOffsetTimerRef.current != null) {
      window.clearTimeout(subtitleOffsetTimerRef.current);
    }
    subtitleOffsetTimerRef.current = window.setTimeout(() => {
      setSubtitleOffsetSec(null);
      subtitleOffsetTimerRef.current = null;
    }, 1800);
  };
  useEffect(
    () => () => {
      if (subtitleOffsetTimerRef.current != null) {
        window.clearTimeout(subtitleOffsetTimerRef.current);
      }
    },
    [],
  );

  const holdRef = useRef<{
    key: string | null;
    timer: number | null;
    engaged: boolean;
    baseRate: number;
  }>({ key: null, timer: null, engaged: false, baseRate: 1 });
  const [holdSpeedActive, setHoldSpeedActive] = useState(false);
  const mediaRef = useRef({
    status: snap.status,
    playPauseToggle,
    seekStep,
    seekTo,
    onNextEp,
    onPrevEp,
    hasNextEp,
    hasPrevEp,
  });
  mediaRef.current = {
    status: snap.status,
    playPauseToggle,
    seekStep,
    seekTo,
    onNextEp,
    onPrevEp,
    hasNextEp,
    hasPrevEp,
  };

  useEffect(() => {
    // `forced` runs one action by id: a controller button bound to it, which
    // works even when the action has no keyboard key.
    const onKey = (e: KeyboardEvent, forced?: HotkeyId) => {
      if (document.querySelector('[data-harbor-player][data-detached="true"]') && !e.key.startsWith("Media")) return;
      const dock = document.querySelector('[data-harbor-player][data-docked="true"]');
      if (!forced && dock && !dock.contains(e.target as Node) && !e.key.startsWith("Media")) return;
      if (isPlayerInteractionLocked()) {
        if (e.cancelable) e.preventDefault();
        return;
      }
      if (isTypingTarget(e)) return;

      const binding = eventToBinding(e);
      const match = (id: HotkeyId): boolean =>
        forced ? id === forced : effectiveBinding(id, overrides) === binding;

      // While picking a word, its keys come first; the rest of the player
      // keeps working (play/pause, seeking with other keys).
      if (!forced && isLookupNavActive()) {
        const hit = LOOKUP_ACTIONS.find(([id]) => match(id));
        if (hit) {
          e.preventDefault();
          e.stopImmediatePropagation();
          sendLookupCommand(hit[1]);
          return;
        }
      }
      if (match("playerLookupMode") && onLookupMode) {
        e.preventDefault();
        if (!e.repeat) onLookupMode();
        return;
      }
      // Hold-to-speed-up needs the key's release, which a controller event
      // does not have.
      if (forced === "playerPlayPause") {
        playPauseToggle();
        return;
      }

      if (e.key === "MediaPlayPause") {
        e.preventDefault();
        if (mediaKeyGate()) playPauseToggle();
        return;
      }
      if (e.key === "MediaPlay") {
        e.preventDefault();
        if (mediaRef.current.status !== "playing" && mediaKeyGate()) playPauseToggle();
        return;
      }
      if (e.key === "MediaPause" || e.key === "MediaStop") {
        e.preventDefault();
        if (mediaRef.current.status === "playing" && mediaKeyGate()) playPauseToggle();
        return;
      }
      if (e.key === "MediaTrackNext" && hasNextEp && onNextEp) {
        e.preventDefault();
        if (mediaKeyGate()) onNextEp();
        return;
      }
      if (e.key === "MediaTrackPrevious" && hasPrevEp && onPrevEp) {
        e.preventDefault();
        if (mediaKeyGate()) onPrevEp();
        return;
      }

      if (match("playerClose")) {
        if (getLeaveConfirm().open) return;
        if (drawMode) {
          setDrawMode(false);
          return;
        }
        if (returnToPreview) {
          e.preventDefault();
          returnToPreview();
          return;
        }
        void (async () => {
          if (
            settings.playerEscExitsFullscreen &&
            !isBigPictureActive() &&
            (await isAnyFullscreen())
          ) {
            await exitAnyFullscreen();
            return;
          }
          if (settings.playerConfirmLeave) {
            openLeaveConfirm((remember) => {
              if (remember) update({ playerConfirmLeave: false });
              closePlayer();
            });
            return;
          }
          closePlayer();
        })();
        return;
      }
      if (match("playerPip")) {
        e.preventDefault();
        togglePip?.();
        return;
      }
      if (match("playerPlayPause")) {
        e.preventDefault();
        if (e.repeat) return;
        const h = holdRef.current;
        h.key = e.key;
        h.baseRate = snap.rate;
        h.timer = window.setTimeout(() => {
          h.timer = null;
          h.engaged = true;
          setHoldSpeedActive(true);
          bridgeRef.current?.setRate(Math.max(2, h.baseRate));
        }, 350);
        return;
      }
      if (match("playerSeekBack10")) {
        e.preventDefault();
        seekStep(-seekBackStepSec);
        return;
      }
      if (match("playerSeekForward10")) {
        e.preventDefault();
        seekStep(seekForwardStepSec);
        return;
      }
      if (match("playerSeekBackShort")) {
        e.preventDefault();
        seekStep(-seekBackStepShortSec);
        return;
      }
      if (match("playerSeekForwardShort")) {
        e.preventDefault();
        seekStep(seekForwardStepShortSec);
        return;
      }
      if (match("playerSeekBack30")) {
        e.preventDefault();
        seekStep(-seekBackStepLongSec);
        return;
      }
      if (match("playerSeekForward30")) {
        e.preventDefault();
        seekStep(seekForwardStepLongSec);
        return;
      }
      if (match("playerSubNext") || match("playerSubPrev")) {
        e.preventDefault();
        const dir = match("playerSubNext") ? 1 : -1;
        const bridge = bridgeRef.current;
        if (!bridge) return;
        const cues = bridge.getSelectedTrackCues();
        if (cues?.length) {
          const last = subSeekRef.current;
          const now = getPlaybackPosition();
          const from = last && performance.now() - last.at < 1500 ? last.target : now;
          const target = subCueSeekTarget(cues, from - snap.subDelaySec, dir);
          if (target == null) return;
          const at = target + snap.subDelaySec;
          subSeekRef.current = { target: at, at: performance.now() };
          seekStep(at - now);
          return;
        }
        // Embedded tracks have no cue list here; mpv steps through them itself.
        if (bridge.capabilities().engine === "mpv") {
          invoke("mpv_command", { cmd: ["sub-seek", dir] }).catch(() => {});
        }
        return;
      }
      if (match("playerFrameForward") && onFrameStep) {
        e.preventDefault();
        onFrameStep(1);
        return;
      }
      if (match("playerFrameBack") && onFrameStep) {
        e.preventDefault();
        onFrameStep(-1);
        return;
      }
      if (match("playerVolumeUp")) {
        e.preventDefault();
        const step = e.shiftKey ? 0.5 : 0.05;
        const max =
          bridgeRef.current?.capabilities().engine === "mpv"
            ? Math.max(1, Math.min(6, settings.volumeBoostMax || 2))
            : 1;
        const next = Math.min(max, Math.max(0, snap.volume + step));
        bridgeRef.current?.setVolume(next);
        bridgeRef.current?.setMuted(false);
        writePlayerVolume({ volume: next, muted: false });
        onVolumeFeedback?.(next, false);
        if (settings.playerVolumeSfx) SFX.volumeChange(true);
        return;
      }
      if (match("playerVolumeDown")) {
        e.preventDefault();
        const step = e.shiftKey ? 0.5 : 0.05;
        const max =
          bridgeRef.current?.capabilities().engine === "mpv"
            ? Math.max(1, Math.min(6, settings.volumeBoostMax || 2))
            : 1;
        const next = Math.min(max, Math.max(0, snap.volume - step));
        bridgeRef.current?.setVolume(next);
        bridgeRef.current?.setMuted(false);
        writePlayerVolume({ volume: next, muted: false });
        onVolumeFeedback?.(next, false);
        if (settings.playerVolumeSfx) SFX.volumeChange(false);
        return;
      }
      if (match("playerMute")) {
        e.preventDefault();
        const next = !snap.muted;
        bridgeRef.current?.setMuted(next);
        writePlayerVolume({ muted: next });
        onVolumeFeedback?.(snap.volume, next);
        if (settings.playerVolumeSfx) SFX.volumeChange(true);
        return;
      }
      if (match("playerFullscreen")) {
        e.preventDefault();
        toggleFullscreen();
        return;
      }
      if (match("playerCrop") && onToggleCrop) {
        e.preventDefault();
        onToggleCrop();
        return;
      }
      if (match("playerAnime4kToggle") && onToggleAnime4k) {
        e.preventDefault();
        onToggleAnime4k();
        return;
      }
      if (match("playerAnime4kOn") && onAnime4kOn) {
        e.preventDefault();
        onAnime4kOn();
        return;
      }
      if (match("playerAnime4kOff") && onAnime4kOff) {
        e.preventDefault();
        onAnime4kOff();
        return;
      }
      if (match("playerRtxHdrToggle")) {
        e.preventDefault();
        if (e.repeat) return;
        if (!isWindowsDesktop() || isRtxHdrBlocked(settings.playerHdrToSdr, svpActive)) return;
        if (bridgeRef.current?.capabilities().engine !== "mpv") return;
        update({ playerRtxHdr: !settings.playerRtxHdr });
        return;
      }
      if (match("playerRtxVsrToggle")) {
        e.preventDefault();
        if (e.repeat) return;
        if (!isWindowsDesktop() || isRtxVsrBlocked(svpActive)) return;
        if (bridgeRef.current?.capabilities().engine !== "mpv") return;
        update({ playerRtxVsr: !settings.playerRtxVsr });
        return;
      }
      if (match("playerPanscanUp") && onPanscanUp) {
        e.preventDefault();
        onPanscanUp();
        return;
      }
      if (match("playerPanscanDown") && onPanscanDown) {
        e.preventDefault();
        onPanscanDown();
        return;
      }
      if (match("playerPrevChannel") && onPrevChannel) {
        e.preventDefault();
        onPrevChannel();
        return;
      }
      if (match("playerSubtitleToggle") && onToggleSubtitles) {
        e.preventDefault();
        if (e.repeat) return;
        onToggleSubtitles();
        return;
      }
      if (onImmersion) {
        const immersion: [HotkeyId, ImmersionAction][] = [
          ["playerAnkiNewCard", "new"],
          ["playerAnkiUpdateLast", "update"],
          ["playerAnkiAudioCard", "audio"],
          ["playerRecordNew", "record-new"],
          ["playerRecordUpdate", "record-update"],
          ["playerRecordAudio", "record-audio"],
        ];
        const hit = immersion.find(([id]) => match(id));
        if (hit) {
          e.preventDefault();
          if (!e.repeat) onImmersion(hit[1]);
          return;
        }
      }
      if (match("playerSubtitleCycle") || match("playerSubtitleCycleAlt")) {
        e.preventDefault();
        cycleSubtitles();
        return;
      }
      if (match("playerNextEpisode") && hasNextEp && onNextEp) {
        e.preventDefault();
        onNextEp();
        return;
      }
      if (match("playerPrevEpisode") && hasPrevEp && onPrevEp) {
        e.preventDefault();
        onPrevEp();
        return;
      }
      if (match("playerStart")) {
        e.preventDefault();
        seekTo(0);
        return;
      }
      if (match("playerEnd")) {
        e.preventDefault();
        if (snap.durationSec > 0) seekTo(snap.durationSec - 0.5);
        return;
      }
      if (match("playerStats")) {
        e.preventDefault();
        setShowStats((v) => !v);
        return;
      }
      if (match("playerSpeedDown")) {
        e.preventDefault();
        const r = Math.max(0.25, +(snap.rate - 0.25).toFixed(2));
        bridgeRef.current?.setRate(r);
        writePlayerPrefs(metaId, { rate: r });
        return;
      }
      if (match("playerSpeedUp")) {
        e.preventDefault();
        const r = Math.min(3, +(snap.rate + 0.25).toFixed(2));
        bridgeRef.current?.setRate(r);
        writePlayerPrefs(metaId, { rate: r });
        return;
      }
      if (match("playerHalfSpeed")) {
        e.preventDefault();
        if (e.repeat) return;
        const slow = settings.halfSpeedRate || 0.5;
        const r = Math.abs(snap.rate - slow) < 0.001 ? 1 : slow;
        bridgeRef.current?.setRate(r);
        writePlayerPrefs(metaId, { rate: r });
        return;
      }
      if (match("playerSubDelayDown")) {
        e.preventDefault();
        const step = e.shiftKey ? 0.05 : 0.1;
        const delay = round2(snap.subDelaySec - step);
        bridgeRef.current?.setSubDelay(delay);
        showSubtitleOffset(delay);
        writePlayerPrefs(metaId, { subDelaySec: delay });
        return;
      }
      if (match("playerSubDelayUp")) {
        e.preventDefault();
        const step = e.shiftKey ? 0.05 : 0.1;
        const delay = round2(snap.subDelaySec + step);
        bridgeRef.current?.setSubDelay(delay);
        showSubtitleOffset(delay);
        writePlayerPrefs(metaId, { subDelaySec: delay });
        return;
      }
      if (match("playerStreamSwitcher") && toggleSwitcher) {
        e.preventDefault();
        toggleSwitcher();
        return;
      }
      if (match("playerEpisodePanel") && toggleEpisodePanel) {
        e.preventDefault();
        toggleEpisodePanel();
        return;
      }
      if (match("playerTvGuide") && toggleGuide) {
        e.preventDefault();
        toggleGuide();
        return;
      }
      if (match("playerDvr") && toggleDvr) {
        e.preventDefault();
        toggleDvr();
        return;
      }
      if (match("playerSleep") && toggleSleep) {
        e.preventDefault();
        toggleSleep();
        return;
      }
      if (match("playerScreenshot") && onScreenshot) {
        e.preventDefault();
        if (e.repeat) return;
        onScreenshot();
        return;
      }
      if (match("playerGifRecord") && onGifRecord) {
        e.preventDefault();
        if (e.repeat) return;
        onGifRecord();
        return;
      }
      if (match("playerClipRecord") && onClipRecord) {
        e.preventDefault();
        if (e.repeat) return;
        onClipRecord();
        return;
      }
      if (match("playerReloadSource") && onReloadSource) {
        e.preventDefault();
        if (e.repeat) return;
        onReloadSource();
        return;
      }
      if (match("playerRestartServer") && onRestartServer) {
        e.preventDefault();
        if (e.repeat) return;
        onRestartServer();
        return;
      }
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        if (e.key === "0") {
          e.preventDefault();
          seekTo(0);
          return;
        }
        const digit = parseInt(e.key, 10);
        if (!Number.isNaN(digit) && digit >= 1 && digit <= 9) {
          e.preventDefault();
          if (snap.durationSec > 0) {
            seekTo((snap.durationSec * digit) / 10);
          }
          return;
        }
      }
    };
    const releaseHold = () => {
      const h = holdRef.current;
      h.key = null;
      if (h.timer != null) {
        window.clearTimeout(h.timer);
        h.timer = null;
        return "tap" as const;
      }
      if (h.engaged) {
        h.engaged = false;
        setHoldSpeedActive(false);
        bridgeRef.current?.setRate(h.baseRate);
      }
      return "held" as const;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const h = holdRef.current;
      if (isPlayerInteractionLocked()) {
        if (e.cancelable) e.preventDefault();
        if (h.key != null && e.key === h.key) releaseHold();
        return;
      }
      if (h.key == null || e.key !== h.key) return;
      if (releaseHold() === "tap") playPauseToggle();
    };
    const onBlur = () => {
      if (holdRef.current.key != null) releaseHold();
    };
    const onForced = (ev: Event) => {
      const { id, repeat } = (ev as CustomEvent<PlayerHotkeyDetail>).detail;
      onKey(new KeyboardEvent("keydown", { repeat, cancelable: true }), id);
    };
    const onKeyDown = (e: KeyboardEvent) => onKey(e);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(PLAYER_HOTKEY_EVENT, onForced);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(PLAYER_HOTKEY_EVENT, onForced);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    closePlayer,
    returnToPreview,
    togglePip,
    drawMode,
    snap.muted,
    snap.volume,
    snap.rate,
    snap.durationSec,
    snap.subDelaySec,
    overrides,
    seekBackStepSec,
    seekForwardStepSec,
    seekBackStepShortSec,
    seekForwardStepShortSec,
    seekBackStepLongSec,
    seekForwardStepLongSec,
    seekTo,
    toggleSwitcher,
    toggleEpisodePanel,
    toggleGuide,
    toggleDvr,
    toggleSleep,
    onScreenshot,
    onGifRecord,
    onClipRecord,
    onToggleCrop,
    onPanscanUp,
    onPanscanDown,
    onPrevChannel,
    onToggleAnime4k,
    onAnime4kOn,
    onAnime4kOff,
    onReloadSource,
    onRestartServer,
    onFrameStep,
    onVolumeFeedback,
    onToggleSubtitles,
    onImmersion,
    onLookupMode,
    settings.halfSpeedRate,
    settings.playerEscExitsFullscreen,
    settings.playerConfirmLeave,
    settings.playerVolumeSfx,
    settings.playerHdrToSdr,
    settings.playerRtxHdr,
    settings.playerRtxVsr,
    svpActive,
    update,
  ]);

  useEffect(() => {
    if (typeof window === "undefined" || !("__TAURI_INTERNALS__" in window)) return;
    setVideoOwnsMediaKeys(true);
    let dead = false;
    let cleanup: (() => void) | undefined;
    void import("@tauri-apps/api/event").then(async ({ listen }) => {
      const u1 = await listen<string>("harbor://media-key", (e) => {
        const m = mediaRef.current;
        const playing = m.status === "playing";
        switch (e.payload) {
          case "playpause":
            if (mediaKeyGate()) m.playPauseToggle();
            break;
          case "play":
            if (!playing && mediaKeyGate()) m.playPauseToggle();
            break;
          case "pause":
          case "stop":
            if (playing && mediaKeyGate()) m.playPauseToggle();
            break;
          case "next":
            if (m.hasNextEp && m.onNextEp && mediaKeyGate()) m.onNextEp();
            break;
          case "previous":
            if (m.hasPrevEp && m.onPrevEp && mediaKeyGate()) m.onPrevEp();
            break;
        }
      });
      const u2 = await listen<number>("harbor://media-seek-relative", (e) => {
        if (typeof e.payload === "number" && Number.isFinite(e.payload)) {
          mediaRef.current.seekStep(e.payload);
        }
      });
      const u3 = await listen<number>("harbor://media-seek-absolute", (e) => {
        if (typeof e.payload === "number" && Number.isFinite(e.payload)) {
          mediaRef.current.seekTo(e.payload);
        }
      });
      const u4 = await listen<number>("harbor://media-set-volume", (e) => {
        if (typeof e.payload === "number" && Number.isFinite(e.payload)) {
          const vol = Math.max(0, Math.min(1, e.payload));
          bridgeRef.current?.setVolume(vol);
          bridgeRef.current?.setMuted(false);
          writePlayerVolume({ volume: vol, muted: false });
          onVolumeFeedback?.(vol, false);
        }
      });
      if (dead) {
        u1();
        u2();
        u3();
        u4();
      } else {
        cleanup = () => {
          u1();
          u2();
          u3();
          u4();
        };
      }
    });
    return () => {
      dead = true;
      setVideoOwnsMediaKeys(false);
      cleanup?.();
    };
  }, []);

  return { holdSpeedActive, subtitleOffsetSec };
}
