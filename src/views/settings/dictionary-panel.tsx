import { useT } from "@/lib/i18n";
import { miningAvailable } from "@/lib/mining/dictionary";
import { Section } from "./shared";
import { MiningSection } from "./dictionary-panel/mining-section";

export function DictionaryPanel() {
  const t = useT();
  if (!miningAvailable()) {
    return (
      <Section
        title={t("Desktop only")}
        subtitle={t("Subtitle dictionary lookups, word audio and Anki mining run in the Harbor desktop app.")}
      >
        <span className="text-[13px] text-ink-subtle">{t("Download the desktop app to look up words while you watch.")}</span>
      </Section>
    );
  }
  return <MiningSection />;
}
