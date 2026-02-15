import { beforeEach, describe, expect, it } from "vitest";
import { readLastPlayedMode, writeLastPlayedMode } from "../lastPlayedModeStorage";

class MemoryStorage implements Storage {
  private data = new Map<string, string>();

  get length(): number {
    return this.data.size;
  }

  clear(): void {
    this.data.clear();
  }

  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }

  key(index: number): string | null {
    return Array.from(this.data.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.data.delete(key);
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }
}

beforeEach(() => {
  (globalThis as { localStorage: Storage }).localStorage = new MemoryStorage();
});

describe("lastPlayedModeStorage", () => {
  it("returns null when mode has not been stored", () => {
    expect(readLastPlayedMode()).toBeNull();
  });

  it("persists and reads mode values", () => {
    writeLastPlayedMode(10);
    expect(readLastPlayedMode()).toBe(10);

    writeLastPlayedMode(20);
    expect(readLastPlayedMode()).toBe(20);
  });

  it("returns null when stored value is invalid", () => {
    globalThis.localStorage.setItem("9x9quiz.v1.lastPlayedMode", "11");
    expect(readLastPlayedMode()).toBeNull();

    globalThis.localStorage.setItem("9x9quiz.v1.lastPlayedMode", "abc");
    expect(readLastPlayedMode()).toBeNull();

    globalThis.localStorage.setItem("9x9quiz.v1.lastPlayedMode", "10.5");
    expect(readLastPlayedMode()).toBeNull();
  });
});
