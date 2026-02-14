import { useState } from "react";
import { ModeSelectPlaceholder } from "./features/mode/ui/ModeSelectPlaceholder";
import { TitleScreen } from "./features/title/ui/TitleScreen";
import { initialScreen, screenIds, type ScreenId } from "./shared/navigation/screenState";
import "./styles/app.css";

function App() {
  const [screen, setScreen] = useState<ScreenId>(initialScreen);

  if (screen === screenIds.title) {
    return (
      <main className="app-shell">
        <TitleScreen onStart={() => setScreen(screenIds.modeSelect)} />
      </main>
    );
  }

  return (
    <main className="app-shell">
      <ModeSelectPlaceholder onBack={() => setScreen(screenIds.title)} />
    </main>
  );
}

export default App;
