export const PRACTICE_TABLE_START = 1;
export const PRACTICE_TABLE_END = 9;

const LOWER_RANGE_END = 5;

const allPracticeTables = Array.from(
  { length: PRACTICE_TABLE_END - PRACTICE_TABLE_START + 1 },
  (_, index) => PRACTICE_TABLE_START + index,
);

const lowerRangeTables = allPracticeTables.filter((table) => table <= LOWER_RANGE_END);
const upperRangeTables = allPracticeTables.filter((table) => table > LOWER_RANGE_END);

export type PracticeScope =
  | { kind: "all" }
  | { kind: "lowerRange" }
  | { kind: "upperRange" }
  | { kind: "custom"; tables: readonly number[] };

export const defaultPracticeScope: PracticeScope = { kind: "all" };

export function createSingleTablePracticeScope(table: number): PracticeScope {
  return normalizePracticeScope({ kind: "custom", tables: [table] });
}

function normalizeCustomTables(tables: readonly number[]): number[] {
  const uniqueTables = new Set<number>();

  for (const table of tables) {
    if (!Number.isInteger(table)) {
      continue;
    }

    if (table < PRACTICE_TABLE_START || table > PRACTICE_TABLE_END) {
      continue;
    }

    uniqueTables.add(table);
  }

  return Array.from(uniqueTables).sort((left, right) => left - right);
}

export function normalizePracticeScope(scope: PracticeScope): PracticeScope {
  if (scope.kind !== "custom") {
    return scope;
  }

  const normalizedTables = normalizeCustomTables(scope.tables);
  if (normalizedTables.length === 0) {
    return defaultPracticeScope;
  }

  return {
    kind: "custom",
    tables: normalizedTables,
  };
}

export function getPracticeScopeTables(scope: PracticeScope): readonly number[] {
  const normalizedScope = normalizePracticeScope(scope);

  switch (normalizedScope.kind) {
    case "all":
      return allPracticeTables;
    case "lowerRange":
      return lowerRangeTables;
    case "upperRange":
      return upperRangeTables;
    case "custom":
      return normalizedScope.tables;
  }
}

type RawPracticeScope = {
  kind?: unknown;
  tables?: unknown;
};

export function parsePracticeScope(value: unknown): PracticeScope | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const rawScope = value as RawPracticeScope;

  switch (rawScope.kind) {
    case "all":
      return { kind: "all" };
    case "lowerRange":
      return { kind: "lowerRange" };
    case "upperRange":
      return { kind: "upperRange" };
    case "custom": {
      if (!Array.isArray(rawScope.tables)) {
        return null;
      }

      const numericTables = rawScope.tables.filter((table): table is number => typeof table === "number");
      const normalizedScope = normalizePracticeScope({
        kind: "custom",
        tables: numericTables,
      });

      return normalizedScope.kind === "custom" ? normalizedScope : null;
    }
    default:
      return null;
  }
}
