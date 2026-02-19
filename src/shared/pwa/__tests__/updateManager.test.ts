import { afterEach, describe, expect, it, vi } from "vitest";

class MockServiceWorker extends EventTarget {
  state: ServiceWorkerState = "installing";
  postMessage = vi.fn();

  setState(nextState: ServiceWorkerState): void {
    this.state = nextState;
    this.dispatchEvent(new Event("statechange"));
  }
}

class MockServiceWorkerRegistration extends EventTarget {
  waiting: ServiceWorker | null = null;
  installing: ServiceWorker | null = null;
}

type MockServiceWorkerContainer = EventTarget & {
  controller: ServiceWorker | null;
};

const originalNavigatorDescriptor = Object.getOwnPropertyDescriptor(globalThis, "navigator");
const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");

function restoreGlobalValue(property: "navigator" | "window", descriptor: PropertyDescriptor | undefined) {
  if (descriptor) {
    Object.defineProperty(globalThis, property, descriptor);
    return;
  }

  Reflect.deleteProperty(globalThis, property);
}

function setMockBrowserEnvironment(options?: {
  controller?: ServiceWorker | null;
  reloadSpy?: () => void;
}): MockServiceWorkerContainer {
  const controller = options?.controller === undefined ? ({} as ServiceWorker) : options.controller;

  const serviceWorkerContainer = Object.assign(new EventTarget(), {
    controller,
  }) as MockServiceWorkerContainer;

  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: {
      serviceWorker: serviceWorkerContainer,
    },
  });

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      location: {
        reload: options?.reloadSpy ?? (() => undefined),
      },
    },
  });

  return serviceWorkerContainer;
}

async function loadUpdateManagerModule() {
  vi.resetModules();
  return import("../updateManager");
}

afterEach(() => {
  restoreGlobalValue("navigator", originalNavigatorDescriptor);
  restoreGlobalValue("window", originalWindowDescriptor);
  vi.restoreAllMocks();
});

describe("updateManager", () => {
  it("treats existing waiting worker as an available update", async () => {
    setMockBrowserEnvironment();
    const { hasPendingAppUpdate, watchServiceWorkerRegistration } = await loadUpdateManagerModule();
    const registration = new MockServiceWorkerRegistration();
    registration.waiting = new MockServiceWorker() as unknown as ServiceWorker;

    watchServiceWorkerRegistration(registration as unknown as ServiceWorkerRegistration);

    expect(hasPendingAppUpdate()).toBe(true);
  });

  it("marks update as available after an installed worker appears with an active controller", async () => {
    setMockBrowserEnvironment();
    const { hasPendingAppUpdate, watchServiceWorkerRegistration } = await loadUpdateManagerModule();
    const registration = new MockServiceWorkerRegistration();
    const installingWorker = new MockServiceWorker();
    registration.installing = installingWorker as unknown as ServiceWorker;

    watchServiceWorkerRegistration(registration as unknown as ServiceWorkerRegistration);
    registration.dispatchEvent(new Event("updatefound"));
    installingWorker.setState("installed");

    expect(hasPendingAppUpdate()).toBe(true);
  });

  it("keeps first-time install from showing an update prompt", async () => {
    setMockBrowserEnvironment({ controller: null });
    const { hasPendingAppUpdate, watchServiceWorkerRegistration } = await loadUpdateManagerModule();
    const registration = new MockServiceWorkerRegistration();
    const installingWorker = new MockServiceWorker();
    registration.installing = installingWorker as unknown as ServiceWorker;

    watchServiceWorkerRegistration(registration as unknown as ServiceWorkerRegistration);
    registration.dispatchEvent(new Event("updatefound"));
    installingWorker.setState("installed");

    expect(hasPendingAppUpdate()).toBe(false);
  });

  it("posts skip-waiting and reloads on controllerchange when applying update", async () => {
    const reloadSpy = vi.fn();
    const serviceWorkerContainer = setMockBrowserEnvironment({ reloadSpy });
    const { applyAppUpdate, hasPendingAppUpdate, watchServiceWorkerRegistration } =
      await loadUpdateManagerModule();
    const registration = new MockServiceWorkerRegistration();
    const waitingWorker = new MockServiceWorker();
    registration.waiting = waitingWorker as unknown as ServiceWorker;

    watchServiceWorkerRegistration(registration as unknown as ServiceWorkerRegistration);
    expect(hasPendingAppUpdate()).toBe(true);

    expect(applyAppUpdate()).toBe(true);
    expect(waitingWorker.postMessage).toHaveBeenCalledWith({ type: "SKIP_WAITING" });
    expect(hasPendingAppUpdate()).toBe(false);

    serviceWorkerContainer.dispatchEvent(new Event("controllerchange"));

    expect(reloadSpy).toHaveBeenCalledTimes(1);
  });
});
