import { describe, expect, it } from "vitest";
import { localeStorageKey, readStoredLocale, writeStoredLocale } from "../localeStorage";
import { defaultLocale } from "../types";

type GlobalWithOptionalStorage = typeof globalThis & {
  localStorage?: Storage;
};

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

describe("localeStorage", () => {
  it("returns default locale when localStorage is unavailable", () => {
    Reflect.deleteProperty(globalThis, "localStorage");

    expect(readStoredLocale()).toBe(defaultLocale);
  });

  it("returns default locale when no locale has been stored", () => {
    (globalThis as GlobalWithOptionalStorage).localStorage = new MemoryStorage();

    expect(readStoredLocale()).toBe(defaultLocale);
  });

  it("writes and reads a stored locale", () => {
    const storage = new MemoryStorage();
    (globalThis as GlobalWithOptionalStorage).localStorage = storage;

    writeStoredLocale("en");

    expect(storage.getItem(localeStorageKey)).toBe("en");
    expect(readStoredLocale()).toBe("en");
  });

  it("falls back to default locale for unsupported stored values", () => {
    const storage = new MemoryStorage();
    (globalThis as GlobalWithOptionalStorage).localStorage = storage;
    storage.setItem(localeStorageKey, "fr-FR");

    expect(readStoredLocale()).toBe(defaultLocale);
  });

  it("does not throw when writing without localStorage", () => {
    Reflect.deleteProperty(globalThis, "localStorage");

    expect(() => writeStoredLocale("ja-JP")).not.toThrow();
  });
});
