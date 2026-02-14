import { beforeEach, describe, expect, it } from "vitest";
import { readHighScore, updateHighScore } from "../highScoreStorage";

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

describe("highScoreStorage", () => {
  it("persists and reads the first mode score", () => {
    const result = updateHighScore(10, 80);

    expect(result).toEqual({
      previousHighScore: null,
      highScore: 80,
      isNewHighScore: true,
    });
    expect(readHighScore(10)).toBe(80);
  });

  it("updates only on strict score improvement", () => {
    updateHighScore(10, 80);

    expect(updateHighScore(10, 80)).toMatchObject({
      previousHighScore: 80,
      highScore: 80,
      isNewHighScore: false,
    });
    expect(updateHighScore(10, 70)).toMatchObject({
      previousHighScore: 80,
      highScore: 80,
      isNewHighScore: false,
    });
    expect(updateHighScore(10, 95)).toMatchObject({
      previousHighScore: 80,
      highScore: 95,
      isNewHighScore: true,
    });
  });

  it("stores high scores independently per mode", () => {
    updateHighScore(10, 60);
    updateHighScore(20, 140);

    expect(readHighScore(10)).toBe(60);
    expect(readHighScore(20)).toBe(140);
    expect(readHighScore(30)).toBeNull();
  });
});
