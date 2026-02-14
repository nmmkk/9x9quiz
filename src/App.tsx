import { useState } from "react";
import { ModeSelectScreen } from "./features/mode/ui/ModeSelectScreen";
import { TitleScreen } from "./features/title/ui/TitleScreen";
import { QuizScreen, type QuizSessionResult } from "./features/quiz/ui/QuizScreen";
import { ResultScreen } from "./features/result/ui/ResultScreen";
import { initialScreen, screenIds, type ScreenId } from "./shared/navigation/screenState";
import { type QuestionCountMode } from "./shared/storage/highScoreStorage";
import "./styles/reset.css";
import "./styles/theme.css";
import "./styles/app.css";

type ResultSnapshot = QuizSessionResult & {
  mode: QuestionCountMode;
};

function App() {
  const [screen, setScreen] = useState<ScreenId>(initialScreen);
  const [questionCount, setQuestionCount] = useState<QuestionCountMode>(10);
  const [latestResult, setLatestResult] = useState<ResultSnapshot | null>(null);

  const openModeSelect = () => {
    setScreen(screenIds.modeSelect);
  };

  const startQuiz = (selectedMode: QuestionCountMode) => {
    setQuestionCount(selectedMode);
    setScreen(screenIds.quiz);
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
        <TitleScreen onStart={openModeSelect} onOpenHighScores={openModeSelect} />
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
          onPlayAgain={() => setScreen(screenIds.quiz)}
          onBackToTitle={() => setScreen(screenIds.title)}
        />
      </main>
    );
  }

  return (
    <main className="app-shell">
      <QuizScreen questionCount={questionCount} onComplete={finishQuiz} />
    </main>
  );
}

export default App;
