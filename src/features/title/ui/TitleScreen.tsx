import { useEffect, useState } from "react";
import { MasteryPanel } from "../../progress/ui/MasteryPanel";
import { getBuildInfo } from "../../../shared/buildInfo";
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
  const buildInfo = getBuildInfo();
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
    <section className="panel panel--title title-panel" aria-labelledby="title-heading">
      <header className="title-header">
        <p className="eyebrow">1 x 1 .. 9 x 9</p>
        <div className="title-mark" aria-hidden="true">
          <div className="title-mark-grid">
            <span>9</span>
            <span>x</span>
            <span>9</span>
          </div>
          <p className="title-command">
            <code>practice 1..9 x 1..9</code>
          </p>
        </div>
        <h1 id="title-heading">{t("app.title")}</h1>
        <p className="title-description">{t("title.description")}</p>
      </header>

      <MasteryPanel masterySnapshot={masterySnapshot} />

      <div className="button-row title-actions">
        <button type="button" className="cta-button" onClick={onStart}>
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

      <footer className="title-provenance">
        {buildInfo.commitUrl ? (
          <a
            className="title-provenance-link"
            href={buildInfo.commitUrl}
            target="_blank"
            rel="noreferrer"
          >
            {buildInfo.displayText}
          </a>
        ) : (
          <span className="title-provenance-text">{buildInfo.displayText}</span>
        )}
      </footer>
    </section>
  );
}
