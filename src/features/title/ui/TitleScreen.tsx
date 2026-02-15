import { useI18n } from "../../../shared/i18n/useI18n";

type TitleScreenProps = {
  onStart: () => void;
  onOpenHighScores: () => void;
};

export function TitleScreen({ onStart, onOpenHighScores }: TitleScreenProps) {
  const { t } = useI18n();

  return (
    <section className="panel" aria-labelledby="title-heading">
      <p className="eyebrow">{t("title.eyebrow")}</p>
      <h1 id="title-heading">{t("app.title")}</h1>
      <p>{t("title.description")}</p>
      <div className="button-row">
        <button type="button" className="primary-button" onClick={onStart}>
          {t("title.startButton")}
        </button>
        <button type="button" className="secondary-button" onClick={onOpenHighScores}>
          {t("title.highScoresButton")}
        </button>
      </div>
    </section>
  );
}
