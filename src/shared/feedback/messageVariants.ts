export const messageVariantGroups = [
  "result.newHighScore",
  "result.replayEncouragement",
] as const;

export type MessageVariantGroup = (typeof messageVariantGroups)[number];

const lastVariantIndexByGroup = new Map<MessageVariantGroup, number>();

export function pickMessageVariant<T extends string>(
  group: MessageVariantGroup,
  variants: readonly T[],
  randomValue: () => number = Math.random,
): T {
  if (variants.length === 0) {
    throw new Error("[messageVariants] At least one variant is required.");
  }

  if (variants.length === 1) {
    lastVariantIndexByGroup.set(group, 0);
    return variants[0]!;
  }

  const previousIndex = lastVariantIndexByGroup.get(group);
  const candidateIndices: number[] = [];

  for (let index = 0; index < variants.length; index += 1) {
    if (index !== previousIndex) {
      candidateIndices.push(index);
    }
  }

  const selectedIndex = candidateIndices[Math.floor(randomValue() * candidateIndices.length)]!;
  lastVariantIndexByGroup.set(group, selectedIndex);
  return variants[selectedIndex]!;
}

export function resetMessageVariantHistory(): void {
  lastVariantIndexByGroup.clear();
}
