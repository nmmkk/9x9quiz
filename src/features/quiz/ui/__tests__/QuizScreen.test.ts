import { describe, expect, it } from "vitest";
import { resolveQuizKeyboardAction } from "../QuizScreen";

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
