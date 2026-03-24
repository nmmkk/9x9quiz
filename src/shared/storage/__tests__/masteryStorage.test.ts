import { beforeEach, describe, expect, it } from "vitest";
import {
  applyMasterySessionStats,
  clearMasterySnapshot,
  readMasterySnapshot,
} from "../masteryStorage";

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

describe("masteryStorage", () => {
  it("returns a zeroed snapshot for all 9 tables by default", () => {
    const snapshot = readMasterySnapshot();

    expect(snapshot).toHaveLength(9);
    expect(snapshot[0]).toEqual({ table: 1, answered: 0, correct: 0 });
    expect(snapshot[8]).toEqual({ table: 9, answered: 0, correct: 0 });
  });

  it("applies session stats and persists cumulative mastery", () => {
    const firstSnapshot = applyMasterySessionStats([
      { table: 2, answered: 3, correct: 2 },
      { table: 7, answered: 2, correct: 2 },
    ]);
    const secondSnapshot = applyMasterySessionStats([{ table: 2, answered: 1, correct: 1 }]);

    expect(firstSnapshot.find((stat) => stat.table === 2)).toEqual({ table: 2, answered: 3, correct: 2 });
    expect(secondSnapshot.find((stat) => stat.table === 2)).toEqual({ table: 2, answered: 4, correct: 3 });
    expect(readMasterySnapshot()).toEqual(secondSnapshot);
  });

  it("normalizes stored snapshot values and ignores malformed entries", () => {
    globalThis.localStorage.setItem(
      "9x9quiz.v1.masteryByTable",
      JSON.stringify([
        { table: 3, answered: 4, correct: 6 },
        { table: 3, answered: 1, correct: 1 },
        { table: 10, answered: 3, correct: 3 },
        { table: 5, answered: -1, correct: 0 },
      ]),
    );

    const snapshot = readMasterySnapshot();

    expect(snapshot.find((stat) => stat.table === 3)).toEqual({ table: 3, answered: 5, correct: 5 });
    expect(snapshot.find((stat) => stat.table === 5)).toEqual({ table: 5, answered: 0, correct: 0 });
  });

  it("ignores invalid session stats and clamps over-reported correct answers", () => {
    const snapshot = applyMasterySessionStats([
      { table: 0, answered: 3, correct: 3 },
      { table: 4, answered: 0, correct: 0 },
      { table: 4, answered: 2, correct: 5 },
    ]);

    expect(snapshot.find((stat) => stat.table === 4)).toEqual({ table: 4, answered: 2, correct: 2 });
    expect(snapshot.find((stat) => stat.table === 1)).toEqual({ table: 1, answered: 0, correct: 0 });
  });

  it("returns empty defaults for malformed json", () => {
    globalThis.localStorage.setItem("9x9quiz.v1.masteryByTable", "{");

    const snapshot = readMasterySnapshot();

    expect(snapshot.every((stat) => stat.answered === 0 && stat.correct === 0)).toBe(true);
  });

  it("clears persisted mastery snapshot", () => {
    applyMasterySessionStats([{ table: 3, answered: 4, correct: 2 }]);
    clearMasterySnapshot();

    const snapshot = readMasterySnapshot();

    expect(snapshot.every((stat) => stat.answered === 0 && stat.correct === 0)).toBe(true);
  });
});
