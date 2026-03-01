import { useEffect, useState, type ReactNode } from "react";
import { ModeSelectScreen } from "./features/mode/ui/ModeSelectScreen";
import { TitleScreen } from "./features/title/ui/TitleScreen";
import { defaultPracticeScope, type PracticeScope } from "./features/quiz/domain/practiceScope";
import { QuizScreen, type QuizSessionResult } from "./features/quiz/ui/QuizScreen";
import { ResultScreen } from "./features/result/ui/ResultScreen";
import { useI18n } from "./shared/i18n/useI18n";
import { initialScreen, screenIds, type ScreenId } from "./shared/navigation/screenState";
import {
  applyAppUpdate,
  hasPendingAppUpdate,
  subscribeToAppUpdate,
} from "./shared/pwa/updateManager";
import { clearHighScores, type QuestionCountMode } from "./shared/storage/highScoreStorage";
import {
  clearLastPlayedMode,
  readLastPlayedMode,
  writeLastPlayedMode,
} from "./shared/storage/lastPlayedModeStorage";
import {
  applyMasterySessionStats,
  clearMasterySnapshot,
  readMasterySnapshot,
} from "./shared/storage/masteryStorage";
import {
  clearPracticeScope,
  readPracticeScope,
  writePracticeScope,
} from "./shared/storage/practiceScopeStorage";
import "./styles/reset.css";
import "./styles/theme.css";
import "./styles/app.css";

const MINI_REVIEW_QUESTION_COUNT = 3;

type ResultSnapshot = QuizSessionResult & {
  mode: QuestionCountMode;
};

function App() {
  const { t } = useI18n();
  const [screen, setScreen] = useState<ScreenId>(initialScreen);
  const [questionCount, setQuestionCount] = useState<QuestionCountMode>(10);
  const [lastPlayedMode, setLastPlayedMode] = useState<QuestionCountMode | null>(() =>
    readLastPlayedMode(),
  );
  const [practiceScope, setPracticeScope] = useState<PracticeScope>(
    () => readPracticeScope() ?? defaultPracticeScope,
  );
  const [masterySnapshot, setMasterySnapshot] = useState(() => readMasterySnapshot());
  const [reviewFactKeys, setReviewFactKeys] = useState<readonly string[] | null>(null);
  const [latestResult, setLatestResult] = useState<ResultSnapshot | null>(null);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState<boolean>(() => hasPendingAppUpdate());

  useEffect(() => {
    return subscribeToAppUpdate(() => {
      setIsUpdateAvailable(hasPendingAppUpdate());
    });
  }, []);

  const openModeSelect = () => {
    setScreen(screenIds.modeSelect);
  };

  const startQuiz = (
    selectedMode: QuestionCountMode,
    selectedPracticeScope: PracticeScope = practiceScope,
  ) => {
    setReviewFactKeys(null);
    setQuestionCount(selectedMode);
    setLastPlayedMode(selectedMode);
    writeLastPlayedMode(selectedMode);
    setPracticeScope(selectedPracticeScope);
    writePracticeScope(selectedPracticeScope);
    setScreen(screenIds.quiz);
  };

  const startMissedFactReview = (missedFactKeys: readonly string[]) => {
    if (missedFactKeys.length === 0) {
      return;
    }

    setReviewFactKeys(missedFactKeys);
    setScreen(screenIds.quiz);
  };

  const startFromTitle = () => {
    if (lastPlayedMode !== null) {
      startQuiz(lastPlayedMode);
      return;
    }

    openModeSelect();
  };

  const resetProgress = () => {
    clearHighScores();
    clearMasterySnapshot();
    clearPracticeScope();
    clearLastPlayedMode();

    setLastPlayedMode(null);
    setPracticeScope(defaultPracticeScope);
    setMasterySnapshot(readMasterySnapshot());
    setReviewFactKeys(null);
    setLatestResult(null);
  };

  const finishQuiz = (result: QuizSessionResult) => {
    setMasterySnapshot(applyMasterySessionStats(result.tableStats));

    if (reviewFactKeys) {
      setReviewFactKeys(null);
      setScreen(screenIds.title);
      return;
    }

    setLatestResult({
      ...result,
      mode: questionCount,
    });
    setScreen(screenIds.result);
  };

  const renderAppShell = (content: ReactNode) => (
    <main className="app-shell">
      {isUpdateAvailable ? (
        <section className="update-notice" role="status" aria-live="polite">
          <p>{t("app.updateNotice")}</p>
          <button type="button" className="primary-button" onClick={applyAppUpdate}>
            {t("app.updateButton")}
          </button>
        </section>
      ) : null}
      {content}
    </main>
  );

  if (screen === screenIds.title) {
    return renderAppShell(
      <TitleScreen
        lastPlayedMode={lastPlayedMode}
        masterySnapshot={masterySnapshot}
        onStart={startFromTitle}
        onOpenModeSelect={openModeSelect}
      />,
    );
  }

  if (screen === screenIds.modeSelect) {
    return renderAppShell(
      <ModeSelectScreen
        onBack={() => setScreen(screenIds.title)}
        initialPracticeScope={practiceScope}
        masterySnapshot={masterySnapshot}
        onStartQuiz={startQuiz}
        onResetProgress={resetProgress}
      />,
    );
  }

  if (screen === screenIds.result && latestResult) {
    return renderAppShell(
      <ResultScreen
        mode={latestResult.mode}
        correctCount={latestResult.correctCount}
        totalQuestions={latestResult.totalQuestions}
        score={latestResult.score}
        missedFactCount={latestResult.missedFactKeys.length}
        onStartMissedFactReview={() => startMissedFactReview(latestResult.missedFactKeys)}
        onPlayAgain={() => startQuiz(latestResult.mode)}
        onBackToTitle={() => setScreen(screenIds.title)}
      />,
    );
  }

  return renderAppShell(
    <QuizScreen
      questionCount={reviewFactKeys ? MINI_REVIEW_QUESTION_COUNT : questionCount}
      practiceScope={practiceScope}
      reviewFactKeys={reviewFactKeys ?? undefined}
      onComplete={finishQuiz}
    />,
  );
}

export default App;
