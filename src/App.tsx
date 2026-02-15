import { useState } from "react";
import { ModeSelectScreen } from "./features/mode/ui/ModeSelectScreen";
import { TitleScreen } from "./features/title/ui/TitleScreen";
import { defaultPracticeScope, type PracticeScope } from "./features/quiz/domain/practiceScope";
import { QuizScreen, type QuizSessionResult } from "./features/quiz/ui/QuizScreen";
import { ResultScreen } from "./features/result/ui/ResultScreen";
import { initialScreen, screenIds, type ScreenId } from "./shared/navigation/screenState";
import { type QuestionCountMode } from "./shared/storage/highScoreStorage";
import {
  readLastPlayedMode,
  writeLastPlayedMode,
} from "./shared/storage/lastPlayedModeStorage";
import { applyMasterySessionStats, readMasterySnapshot } from "./shared/storage/masteryStorage";
import { readPracticeScope, writePracticeScope } from "./shared/storage/practiceScopeStorage";
import "./styles/reset.css";
import "./styles/theme.css";
import "./styles/app.css";

const MINI_REVIEW_QUESTION_COUNT = 3;

type ResultSnapshot = QuizSessionResult & {
  mode: QuestionCountMode;
};

function App() {
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

  if (screen === screenIds.title) {
    return (
      <main className="app-shell">
        <TitleScreen
          lastPlayedMode={lastPlayedMode}
          masterySnapshot={masterySnapshot}
          onStart={startFromTitle}
          onOpenModeSelect={openModeSelect}
        />
      </main>
    );
  }

  if (screen === screenIds.modeSelect) {
    return (
      <main className="app-shell">
        <ModeSelectScreen
          onBack={() => setScreen(screenIds.title)}
          initialPracticeScope={practiceScope}
          masterySnapshot={masterySnapshot}
          onStartQuiz={startQuiz}
        />
      </main>
    );
  }

  if (screen === screenIds.result && latestResult) {
    return (
      <main className="app-shell">
        <ResultScreen
          mode={latestResult.mode}
          correctCount={latestResult.correctCount}
          totalQuestions={latestResult.totalQuestions}
          score={latestResult.score}
          hasMissedFacts={latestResult.missedFactKeys.length > 0}
          onStartMissedFactReview={() => startMissedFactReview(latestResult.missedFactKeys)}
          onPlayAgain={() => startQuiz(latestResult.mode)}
          onBackToTitle={() => setScreen(screenIds.title)}
        />
      </main>
    );
  }

  return (
    <main className="app-shell">
      <QuizScreen
        questionCount={reviewFactKeys ? MINI_REVIEW_QUESTION_COUNT : questionCount}
        practiceScope={practiceScope}
        reviewFactKeys={reviewFactKeys ?? undefined}
        onComplete={finishQuiz}
      />
    </main>
  );
}

export default App;
