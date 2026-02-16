import { beforeEach, describe, expect, it } from "vitest";
import { readPracticeScope, writePracticeScope } from "../practiceScopeStorage";

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

describe("practiceScopeStorage", () => {
  it("returns null when scope has not been stored", () => {
    expect(readPracticeScope()).toBeNull();
  });

  it("persists and reads preset and custom scopes", () => {
    writePracticeScope({ kind: "lowerRange" });
    expect(readPracticeScope()).toEqual({ kind: "lowerRange" });

    writePracticeScope({ kind: "custom", tables: [9, 7, 7] });
    expect(readPracticeScope()).toEqual({ kind: "custom", tables: [7, 9] });
  });

  it("returns null for malformed or invalid stored values", () => {
    globalThis.localStorage.setItem("9x9quiz.v1.practiceScope", "{");
    expect(readPracticeScope()).toBeNull();

    globalThis.localStorage.setItem("9x9quiz.v1.practiceScope", JSON.stringify({ kind: "custom", tables: [] }));
    expect(readPracticeScope()).toBeNull();

    globalThis.localStorage.setItem("9x9quiz.v1.practiceScope", JSON.stringify({ kind: "unknown" }));
    expect(readPracticeScope()).toBeNull();
  });
});
