export function filterIndexes<T>(
  elements: T[],
  predicate: (element: T, index: number, elements: T[]) => boolean,
): number[] {
  return elements
    .map((element, index, elements) => (predicate(element, index, elements) ? index : null))
    .filter((element) => element !== null);
}

export function rotateGridRight<T>(grid: T[][]) {
  const newGrid: T[][] = new Array(grid[0].length);

  for (let newRowIndex = 0; newRowIndex < grid[0].length; newRowIndex++) {
    newGrid[newRowIndex] = new Array(grid.length);
  }

  for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
    const row = grid[rowIndex];
    for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
      const element = row[columnIndex];
      const newRowIndex = columnIndex;
      const newColumnIndex = grid.length - 1 - rowIndex;
      newGrid[newRowIndex][newColumnIndex] = element;
    }
  }

  return newGrid;
}

export function initArray<T>(size: number, initElement: () => T): T[] {
  let array: T[] = new Array(size);
  for (let i = 0; i < size; i++) {
    array[i] = initElement();
  }
  return array;
}
