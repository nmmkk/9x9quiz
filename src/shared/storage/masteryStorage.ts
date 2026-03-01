const masteryStorageKey = "9x9quiz.v1.masteryByTable";

export const masteryTables = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export type MasteryTable = (typeof masteryTables)[number];

export type MasteryTableStat = {
  table: MasteryTable;
  answered: number;
  correct: number;
};

export type MasterySnapshot = readonly MasteryTableStat[];

export type MasterySessionStat = {
  table: number;
  answered: number;
  correct: number;
};

function getLocalStorage(): Storage | null {
  if (typeof globalThis.localStorage === "undefined") {
    return null;
  }

  return globalThis.localStorage;
}

function createEmptyMasteryMap(): Map<MasteryTable, MasteryTableStat> {
  const masteryMap = new Map<MasteryTable, MasteryTableStat>();

  for (const table of masteryTables) {
    masteryMap.set(table, {
      table,
      answered: 0,
      correct: 0,
    });
  }

  return masteryMap;
}

function toSnapshot(masteryMap: ReadonlyMap<MasteryTable, MasteryTableStat>): MasterySnapshot {
  return masteryTables.map((table) => masteryMap.get(table) ?? { table, answered: 0, correct: 0 });
}

function toNonNegativeInteger(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    return null;
  }

  return value;
}

function isMasteryTable(value: number): value is MasteryTable {
  return (masteryTables as readonly number[]).includes(value);
}

type RawMasteryEntry = {
  table?: unknown;
  answered?: unknown;
  correct?: unknown;
};

function normalizeStoredSnapshot(value: unknown): MasterySnapshot | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const masteryMap = createEmptyMasteryMap();

  for (const rawEntry of value) {
    if (!rawEntry || typeof rawEntry !== "object") {
      continue;
    }

    const { table, answered, correct } = rawEntry as RawMasteryEntry;
    const normalizedTable = toNonNegativeInteger(table);
    const normalizedAnswered = toNonNegativeInteger(answered);
    const normalizedCorrect = toNonNegativeInteger(correct);

    if (
      normalizedTable === null ||
      !isMasteryTable(normalizedTable) ||
      normalizedAnswered === null ||
      normalizedCorrect === null
    ) {
      continue;
    }

    const safeCorrect = Math.min(normalizedCorrect, normalizedAnswered);
    const currentStat = masteryMap.get(normalizedTable);
    if (!currentStat) {
      continue;
    }

    masteryMap.set(normalizedTable, {
      table: normalizedTable,
      answered: currentStat.answered + normalizedAnswered,
      correct: currentStat.correct + safeCorrect,
    });
  }

  return toSnapshot(masteryMap);
}

export function readMasterySnapshot(): MasterySnapshot {
  const storage = getLocalStorage();
  if (!storage) {
    return toSnapshot(createEmptyMasteryMap());
  }

  const rawSnapshot = storage.getItem(masteryStorageKey);
  if (rawSnapshot === null) {
    return toSnapshot(createEmptyMasteryMap());
  }

  try {
    const normalizedSnapshot = normalizeStoredSnapshot(JSON.parse(rawSnapshot));
    return normalizedSnapshot ?? toSnapshot(createEmptyMasteryMap());
  } catch {
    return toSnapshot(createEmptyMasteryMap());
  }
}

export function applyMasterySessionStats(sessionStats: readonly MasterySessionStat[]): MasterySnapshot {
  const masteryMap = new Map(
    readMasterySnapshot().map((stat) => [stat.table, stat] as const),
  );

  for (const sessionStat of sessionStats) {
    const normalizedTable = toNonNegativeInteger(sessionStat.table);
    const normalizedAnswered = toNonNegativeInteger(sessionStat.answered);
    const normalizedCorrect = toNonNegativeInteger(sessionStat.correct);

    if (
      normalizedTable === null ||
      !isMasteryTable(normalizedTable) ||
      normalizedAnswered === null ||
      normalizedAnswered === 0 ||
      normalizedCorrect === null
    ) {
      continue;
    }

    const safeCorrect = Math.min(normalizedCorrect, normalizedAnswered);
    const currentStat = masteryMap.get(normalizedTable);
    if (!currentStat) {
      continue;
    }

    masteryMap.set(normalizedTable, {
      table: normalizedTable,
      answered: currentStat.answered + normalizedAnswered,
      correct: currentStat.correct + safeCorrect,
    });
  }

  const nextSnapshot = toSnapshot(masteryMap);
  const storage = getLocalStorage();
  storage?.setItem(masteryStorageKey, JSON.stringify(nextSnapshot));
  return nextSnapshot;
}

export function clearMasterySnapshot(): void {
  const storage = getLocalStorage();
  storage?.removeItem(masteryStorageKey);
}
