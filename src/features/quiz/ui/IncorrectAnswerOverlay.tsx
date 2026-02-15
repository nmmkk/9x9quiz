import { useI18n } from "../../../shared/i18n/useI18n";

type IncorrectAnswerOverlayProps = {
  submittedAnswer: number;
  correctAnswer: number;
  onNext: () => void;
};

export function IncorrectAnswerOverlay({
  submittedAnswer,
  correctAnswer,
  onNext,
}: IncorrectAnswerOverlayProps) {
  const { t, tf } = useI18n();

  return (
    <div className="overlay-backdrop" role="presentation">
      <section className="overlay-panel" role="dialog" aria-modal="true" aria-labelledby="incorrect-title">
        <h3 id="incorrect-title">{t("quiz.incorrect.title")}</h3>
        <p>{tf("quiz.incorrect.enteredLabel", { answer: submittedAnswer })}</p>
        <p>{tf("quiz.incorrect.correctAnswerLabel", { answer: correctAnswer })}</p>
        <button type="button" className="primary-button" onClick={onNext}>
          {t("quiz.incorrect.nextButton")}
        </button>
      </section>
    </div>
  );
}
