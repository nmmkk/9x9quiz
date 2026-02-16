import { useEffect, useState } from "react";
import { MasteryPanel } from "../../progress/ui/MasteryPanel";
import { useI18n } from "../../../shared/i18n/useI18n";
import {
  hasInstallPrompt,
  promptInstall,
  startInstallPromptWatcher,
  subscribeToInstallPrompt,
} from "../../../shared/pwa/installManager";
import { type QuestionCountMode } from "../../../shared/storage/highScoreStorage";
import { type MasterySnapshot } from "../../../shared/storage/masteryStorage";

type TitleScreenProps = {
  lastPlayedMode: QuestionCountMode | null;
  masterySnapshot: MasterySnapshot;
  onStart: () => void;
  onOpenModeSelect: () => void;
};

export function TitleScreen({
  lastPlayedMode,
  masterySnapshot,
  onStart,
  onOpenModeSelect,
}: TitleScreenProps) {
  const { t, tf } = useI18n();
  const [isInstallAvailable, setIsInstallAvailable] = useState<boolean>(() => hasInstallPrompt());
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    startInstallPromptWatcher();
    setIsInstallAvailable(hasInstallPrompt());

    return subscribeToInstallPrompt(() => {
      setIsInstallAvailable(hasInstallPrompt());
    });
  }, []);

  const handleInstall = () => {
    if (isInstalling) {
      return;
    }

    setIsInstalling(true);

    void promptInstall().finally(() => {
      setIsInstalling(false);
      setIsInstallAvailable(hasInstallPrompt());
    });
  };

  return (
    <section className="panel" aria-labelledby="title-heading">
      <h1 id="title-heading">{t("app.title")}</h1>
      <p>{t("title.description")}</p>

      <MasteryPanel masterySnapshot={masterySnapshot} />

      <div className="button-row">
        <button type="button" className="primary-button" onClick={onStart}>
          {lastPlayedMode === null
            ? t("title.startButton")
            : tf("title.quickStartButton", { count: lastPlayedMode })}
        </button>
        <button type="button" className="secondary-button" onClick={onOpenModeSelect}>
          {lastPlayedMode === null ? t("title.highScoresButton") : t("title.modeSelectButton")}
        </button>
        {isInstallAvailable ? (
          <button
            type="button"
            className="secondary-button"
            disabled={isInstalling}
            onClick={handleInstall}
          >
            {t("title.installButton")}
          </button>
        ) : null}
      </div>
    </section>
  );
}
