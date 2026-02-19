import { afterEach, describe, expect, it, vi } from "vitest";

type MockWindow = EventTarget;

class MockBeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;

  constructor(outcome: "accepted" | "dismissed" = "accepted") {
    super("beforeinstallprompt", { cancelable: true });
    this.prompt = vi.fn(async () => undefined);
    this.userChoice = Promise.resolve({ outcome, platform: "web" });
  }
}

const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");

function restoreWindowDescriptor() {
  if (originalWindowDescriptor) {
    Object.defineProperty(globalThis, "window", originalWindowDescriptor);
    return;
  }

  Reflect.deleteProperty(globalThis, "window");
}

function setMockWindow(): MockWindow {
  const mockWindow = new EventTarget();

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: mockWindow,
  });

  return mockWindow;
}

async function loadInstallManagerModule() {
  vi.resetModules();
  return import("../installManager");
}

afterEach(() => {
  restoreWindowDescriptor();
  vi.restoreAllMocks();
});

describe("installManager", () => {
  it("captures beforeinstallprompt and exposes install availability", async () => {
    const mockWindow = setMockWindow();
    const { hasInstallPrompt, startInstallPromptWatcher } = await loadInstallManagerModule();
    const promptEvent = new MockBeforeInstallPromptEvent();

    startInstallPromptWatcher();
    mockWindow.dispatchEvent(promptEvent);

    expect(promptEvent.defaultPrevented).toBe(true);
    expect(hasInstallPrompt()).toBe(true);
  });

  it("prompts installation and clears pending prompt after user choice", async () => {
    const mockWindow = setMockWindow();
    const { hasInstallPrompt, promptInstall, startInstallPromptWatcher } =
      await loadInstallManagerModule();
    const promptEvent = new MockBeforeInstallPromptEvent("accepted");

    startInstallPromptWatcher();
    mockWindow.dispatchEvent(promptEvent);

    expect(await promptInstall()).toBe("accepted");
    expect(promptEvent.prompt).toHaveBeenCalledTimes(1);
    expect(hasInstallPrompt()).toBe(false);
  });

  it("returns unavailable when no deferred prompt is present", async () => {
    setMockWindow();
    const { promptInstall, startInstallPromptWatcher } = await loadInstallManagerModule();

    startInstallPromptWatcher();

    expect(await promptInstall()).toBe("unavailable");
  });

  it("clears install availability after appinstalled", async () => {
    const mockWindow = setMockWindow();
    const { hasInstallPrompt, startInstallPromptWatcher } = await loadInstallManagerModule();
    const promptEvent = new MockBeforeInstallPromptEvent();

    startInstallPromptWatcher();
    mockWindow.dispatchEvent(promptEvent);
    expect(hasInstallPrompt()).toBe(true);

    mockWindow.dispatchEvent(new Event("appinstalled"));
    expect(hasInstallPrompt()).toBe(false);
  });
});
