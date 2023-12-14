export function filterIndexes<T>(
  elements: T[],
  predicate: (element: T, index: number, elements: T[]) => boolean,
): number[] {
  return elements
    .map((element, index, elements) => (predicate(element, index, elements) ? index : null))
    .filter((element) => element !== null);
}
