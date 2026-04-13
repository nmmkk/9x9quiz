import { describe, expect, it } from "vitest";
import {
  resolveQuizKeyboardAction,
  shouldHandleQuizKeyboardAction,
  shouldIgnoreQuizKeyboardEvent,
} from "../QuizScreen";

describe("resolveQuizKeyboardAction", () => {
  it("maps digit keys to digit actions", () => {
    expect(resolveQuizKeyboardAction(createKeyboardEvent("0"))).toEqual({ digit: "0" });
    expect(resolveQuizKeyboardAction(createKeyboardEvent("7"))).toEqual({ digit: "7" });
  });

  it("maps editing and submit keys to existing quiz actions", () => {
    expect(resolveQuizKeyboardAction(createKeyboardEvent("Backspace"))).toBe("backspace");
    expect(resolveQuizKeyboardAction(createKeyboardEvent("Delete"))).toBe("clear");
    expect(resolveQuizKeyboardAction(createKeyboardEvent("Enter"))).toBe("submit");
  });

  it("ignores unrelated or modified key presses", () => {
    expect(resolveQuizKeyboardAction(createKeyboardEvent("a"))).toBeNull();
    expect(resolveQuizKeyboardAction(createKeyboardEvent("5", { ctrlKey: true }))).toBeNull();
    expect(resolveQuizKeyboardAction(createKeyboardEvent("8", { metaKey: true }))).toBeNull();
  });
});

describe("shouldHandleQuizKeyboardAction", () => {
  it("skips submit handling when the incorrect-answer overlay is visible", () => {
    expect(
      shouldHandleQuizKeyboardAction("submit", {
        hasInput: true,
        isComplete: false,
        isOverlayVisible: true,
      }),
    ).toBe(false);
  });

  it("handles submit only when the quiz can actually submit an answer", () => {
    expect(
      shouldHandleQuizKeyboardAction("submit", {
        hasInput: true,
        isComplete: false,
        isOverlayVisible: false,
      }),
    ).toBe(true);

    expect(
      shouldHandleQuizKeyboardAction("submit", {
        hasInput: false,
        isComplete: false,
        isOverlayVisible: false,
      }),
    ).toBe(false);
  });

  it("only handles digit and edit keys during active question entry", () => {
    expect(
      shouldHandleQuizKeyboardAction({ digit: "5" }, {
        hasInput: false,
        isComplete: false,
        isOverlayVisible: false,
      }),
    ).toBe(true);

    expect(
      shouldHandleQuizKeyboardAction("backspace", {
        hasInput: false,
        isComplete: false,
        isOverlayVisible: false,
      }),
    ).toBe(false);
  });
});

describe("shouldIgnoreQuizKeyboardEvent", () => {
  it("ignores already-handled events", () => {
    expect(
      shouldIgnoreQuizKeyboardEvent({
        defaultPrevented: true,
        target: null,
      }),
    ).toBe(true);
  });

  it("ignores keyboard shortcuts when focus is on interactive controls", () => {
    expect(
      shouldIgnoreQuizKeyboardEvent({
        defaultPrevented: false,
        target: { tagName: "BUTTON" },
      }),
    ).toBe(true);

    expect(
      shouldIgnoreQuizKeyboardEvent({
        defaultPrevented: false,
        target: { tagName: "INPUT" },
      }),
    ).toBe(true);
  });

  it("allows quiz shortcuts from non-interactive elements", () => {
    expect(
      shouldIgnoreQuizKeyboardEvent({
        defaultPrevented: false,
        target: { tagName: "DIV" },
      }),
    ).toBe(false);
  });
});

function createKeyboardEvent(
  key: string,
  modifiers: Partial<Pick<KeyboardEvent, "altKey" | "ctrlKey" | "metaKey">> = {},
): Pick<KeyboardEvent, "key" | "altKey" | "ctrlKey" | "metaKey"> {
  return {
    key,
    altKey: modifiers.altKey ?? false,
    ctrlKey: modifiers.ctrlKey ?? false,
    metaKey: modifiers.metaKey ?? false,
  };
}
