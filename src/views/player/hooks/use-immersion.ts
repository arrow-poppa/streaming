import { useCallback, useEffect, useRef, type RefObject } from "react";
import { t } from "@/lib/i18n";
import type { PlayerBridge, PlayerSnapshot } from "@/lib/player/bridge";
import { getPlaybackPosition } from "@/lib/player/playback-clock";
import { miningAvailable } from "@/lib/mining/dictionary";
import {
  exportImmersionCard,
  lineFromSnapshot,
  pushLine,
  type ImmersionClip,
  type ImmersionTarget,
} from "@/lib/mining/immersion";
import { useSettings } from "@/lib/settings";

export type ImmersionAction = ImmersionTarget | `record-${ImmersionTarget}`;

type Recording = { target: ImmersionTarget; start: number; lines: string[]; stop: () => void };

const MAX_RECORD_SEC = 300;

function targetLabel(target: ImmersionTarget): string {
  if (target === "audio") return t("audio card");
  if (target === "update") return t("last card");
  return t("new card");
}

/** The immersion hotkeys: cards from the line on screen, or from a stretch
 *  recorded between two presses (which works without subtitles). */
export function useImmersion(params: {
  bridgeRef: RefObject<PlayerBridge | null>;
  snapRef: RefObject<PlayerSnapshot>;
  title: string;
  sourceKey: string;
  notify: (kind: "ok" | "error", text: string) => void;
}): { trigger: (action: ImmersionAction) => void } {
  const { bridgeRef, snapRef, title, sourceKey, notify } = params;
  const { settings } = useSettings();
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const recordingRef = useRef<Recording | null>(null);
  const busyRef = useRef(false);

  const cancelRecording = useCallback(() => {
    recordingRef.current?.stop();
    recordingRef.current = null;
  }, []);
  // A recording started on another video would cut the wrong stretch.
  useEffect(() => cancelRecording, [sourceKey, cancelRecording]);

  const run = useCallback(
    async (target: ImmersionTarget, clip: ImmersionClip, recorded: boolean) => {
      if (busyRef.current) {
        notify("error", t("Still adding the previous card…"));
        return;
      }
      busyRef.current = true;
      try {
        const res = await exportImmersionCard(settingsRef.current, target, clip, title);
        const what =
          target === "update"
            ? t("Updated card in {deck}", { deck: res.deck })
            : t("Added to {deck}", { deck: res.deck });
        const extra = recorded
          ? ` · ${t("{n}s recorded", { n: (clip.end - clip.start).toFixed(1) })}`
          : "";
        const warn = res.warnings.length ? ` · ${res.warnings[0]}` : "";
        notify(res.warnings.length ? "error" : "ok", `✓ ${what}${extra}${warn}`);
      } catch (e) {
        notify("error", `Anki: ${e instanceof Error ? e.message : String(e)}`);
      } finally {
        busyRef.current = false;
      }
    },
    [notify, title],
  );

  const toggleRecording = useCallback(
    (target: ImmersionTarget) => {
      const bridge = bridgeRef.current;
      const rec = recordingRef.current;
      const now = getPlaybackPosition();
      if (!rec) {
        if (!bridge) return;
        const lines: string[] = [];
        pushLine(lines, snapRef.current?.subText ?? "");
        // Every line that shows between the two presses goes on the card, not
        // just the ones at either end.
        const stop = bridge.subscribe((snap) => pushLine(lines, snap.subText));
        recordingRef.current = { target, start: now, lines, stop };
        notify(
          "ok",
          `● ${t("Recording → {target}. Press again to stop.", { target: targetLabel(target) })}`,
        );
        return;
      }
      cancelRecording();
      // Stopping with another record key keeps the destination chosen at start.
      const max = Math.min(MAX_RECORD_SEC, settingsRef.current.immersionRecordMaxSec || 120);
      const length = now - rec.start;
      let problem: string | null = null;
      if (length < 0) problem = t("the video went back since the recording started");
      else if (length < 0.3) problem = t("too short");
      else if (length > max) problem = t("longer than the {n}s limit", { n: max });
      if (problem) {
        notify("error", t("Recording discarded: {reason}", { reason: problem }));
        return;
      }
      notify("ok", `■ ${t("Stopped · {n}s recorded · adding card…", { n: length.toFixed(1) })}`);
      void run(
        rec.target,
        { sentence: rec.lines.join("\n"), start: rec.start, end: now, pad: 0 },
        true,
      );
    },
    [bridgeRef, snapRef, notify, run, cancelRecording],
  );

  const trigger = useCallback(
    (action: ImmersionAction) => {
      if (!miningAvailable() || bridgeRef.current?.capabilities().engine !== "mpv") {
        notify("error", t("Anki cards from the player need the mpv player in the desktop app."));
        return;
      }
      if (action.startsWith("record-")) {
        toggleRecording(action.slice("record-".length) as ImmersionTarget);
        return;
      }
      const snap = snapRef.current;
      const line = snap ? lineFromSnapshot(snap) : null;
      if (!line) {
        notify(
          "error",
          t("No subtitle on screen. Use a Record shortcut for parts without subtitles."),
        );
        return;
      }
      const pad = settingsRef.current.ankiAudioPadSec;
      void run(
        action as ImmersionTarget,
        { sentence: line.text, start: line.start, end: line.end, pad },
        false,
      );
    },
    [bridgeRef, snapRef, notify, run, toggleRecording],
  );

  return { trigger };
}
