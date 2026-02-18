import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { I18nProvider } from "./shared/i18n/I18nProvider";
import { startInstallPromptWatcher } from "./shared/pwa/installManager";
import { registerServiceWorker } from "./shared/pwa/updateManager";

startInstallPromptWatcher();
registerServiceWorker();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>,
);
