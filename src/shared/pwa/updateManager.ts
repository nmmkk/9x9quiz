const SKIP_WAITING_MESSAGE_TYPE = "SKIP_WAITING";

const updateListeners = new Set<() => void>();

let waitingWorker: ServiceWorker | null = null;

const notifyUpdateListeners = (): void => {
  for (const listener of updateListeners) {
    listener();
  }
};

const setWaitingWorker = (worker: ServiceWorker | null): void => {
  if (waitingWorker === worker) {
    return;
  }

  waitingWorker = worker;
  notifyUpdateListeners();
};

const hasActiveController = (): boolean => {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
    return false;
  }

  return navigator.serviceWorker.controller !== null;
};

const watchInstallingWorker = (
  registration: ServiceWorkerRegistration,
  installingWorker: ServiceWorker,
): void => {
  const handleStateChange = (): void => {
    if (installingWorker.state !== "installed" || !hasActiveController()) {
      return;
    }

    setWaitingWorker(registration.waiting ?? installingWorker);
  };

  installingWorker.addEventListener("statechange", handleStateChange);
  handleStateChange();
};

export function watchServiceWorkerRegistration(registration: ServiceWorkerRegistration): void {
  if (registration.waiting) {
    setWaitingWorker(registration.waiting);
  }

  registration.addEventListener("updatefound", () => {
    const installingWorker = registration.installing;
    if (!installingWorker) {
      return;
    }

    watchInstallingWorker(registration, installingWorker);
  });
}

export function registerServiceWorker(): void {
  if (!import.meta.env.PROD || typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    void navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`, {
        scope: import.meta.env.BASE_URL,
      })
      .then((registration) => {
        watchServiceWorkerRegistration(registration);
      })
      .catch(() => undefined);
  });
}

export function hasPendingAppUpdate(): boolean {
  return waitingWorker !== null;
}

export function subscribeToAppUpdate(listener: () => void): () => void {
  updateListeners.add(listener);

  return () => {
    updateListeners.delete(listener);
  };
}

export function applyAppUpdate(): boolean {
  if (
    waitingWorker === null ||
    typeof window === "undefined" ||
    typeof navigator === "undefined" ||
    !("serviceWorker" in navigator)
  ) {
    return false;
  }

  const workerToActivate = waitingWorker;
  setWaitingWorker(null);

  const handleControllerChange = (): void => {
    navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
    window.location.reload();
  };

  navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);
  workerToActivate.postMessage({ type: SKIP_WAITING_MESSAGE_TYPE });

  return true;
}
