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
import { readPracticeScope, writePracticeScope } from "./shared/storage/practiceScopeStorage";
import "./styles/reset.css";
import "./styles/theme.css";
import "./styles/app.css";

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
  const [latestResult, setLatestResult] = useState<ResultSnapshot | null>(null);

  const openModeSelect = () => {
    setScreen(screenIds.modeSelect);
  };

  const startQuiz = (
    selectedMode: QuestionCountMode,
    selectedPracticeScope: PracticeScope = practiceScope,
  ) => {
    setQuestionCount(selectedMode);
    setLastPlayedMode(selectedMode);
    writeLastPlayedMode(selectedMode);
    setPracticeScope(selectedPracticeScope);
    writePracticeScope(selectedPracticeScope);
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
          onStart={startFromTitle}
          onOpenModeSelect={openModeSelect}
        />
      </main>
    );
  }

  if (screen === screenIds.modeSelect) {
    return (
      <main className="app-shell">
        <ModeSelectScreen onBack={() => setScreen(screenIds.title)} onStartQuiz={startQuiz} />
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
          onPlayAgain={() => startQuiz(latestResult.mode)}
          onBackToTitle={() => setScreen(screenIds.title)}
        />
      </main>
    );
  }

  return (
    <main className="app-shell">
      <QuizScreen questionCount={questionCount} practiceScope={practiceScope} onComplete={finishQuiz} />
    </main>
  );
}

export default App;
