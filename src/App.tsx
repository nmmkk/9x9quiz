import { useState } from "react";
import { ModeSelectScreen, type QuestionCountMode } from "./features/mode/ui/ModeSelectScreen";
import { QuizScreen } from "./features/quiz/ui/QuizScreen";
import { TitleScreen } from "./features/title/ui/TitleScreen";
import { initialScreen, screenIds, type ScreenId } from "./shared/navigation/screenState";
import "./styles/app.css";

function App() {
  const [screen, setScreen] = useState<ScreenId>(initialScreen);
  const [questionCount, setQuestionCount] = useState<QuestionCountMode>(10);

  const openModeSelect = () => {
    setScreen(screenIds.modeSelect);
  };

  const startQuiz = (selectedMode: QuestionCountMode) => {
    setQuestionCount(selectedMode);
    setScreen(screenIds.quiz);
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

  return (
    <main className="app-shell">
      <QuizScreen questionCount={questionCount} onExit={() => setScreen(screenIds.title)} />
    </main>
  );
}

export default App;
