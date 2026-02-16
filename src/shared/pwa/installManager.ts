type InstallChoiceOutcome = "accepted" | "dismissed";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: InstallChoiceOutcome;
    platform: string;
  }>;
};

const installPromptListeners = new Set<() => void>();

let deferredInstallPrompt: BeforeInstallPromptEvent | null = null;
let isInstallPromptWatcherStarted = false;

const notifyInstallPromptListeners = (): void => {
  for (const listener of installPromptListeners) {
    listener();
  }
};

const setDeferredInstallPrompt = (installPromptEvent: BeforeInstallPromptEvent | null): void => {
  if (deferredInstallPrompt === installPromptEvent) {
    return;
  }

  deferredInstallPrompt = installPromptEvent;
  notifyInstallPromptListeners();
};

const onBeforeInstallPrompt = (rawEvent: Event): void => {
  const installPromptEvent = rawEvent as BeforeInstallPromptEvent;
  installPromptEvent.preventDefault();
  setDeferredInstallPrompt(installPromptEvent);
};

const onAppInstalled = (): void => {
  setDeferredInstallPrompt(null);
};

export function startInstallPromptWatcher(): void {
  if (isInstallPromptWatcherStarted || typeof window === "undefined") {
    return;
  }

  window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt as EventListener);
  window.addEventListener("appinstalled", onAppInstalled);
  isInstallPromptWatcherStarted = true;
}

export function hasInstallPrompt(): boolean {
  return deferredInstallPrompt !== null;
}

export function subscribeToInstallPrompt(listener: () => void): () => void {
  installPromptListeners.add(listener);

  return () => {
    installPromptListeners.delete(listener);
  };
}

export async function promptInstall(): Promise<InstallChoiceOutcome | "unavailable"> {
  if (deferredInstallPrompt === null) {
    return "unavailable";
  }

  const installPromptEvent = deferredInstallPrompt;
  setDeferredInstallPrompt(null);

  try {
    await installPromptEvent.prompt();
    const userChoice = await installPromptEvent.userChoice;
    return userChoice.outcome;
  } catch {
    return "dismissed";
  }
}
