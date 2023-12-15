import { rotateGridRight } from '../../utils/arrays';
import { splitGrid } from '../../utils/strings';

function tiltNorth(grid: string[][]) {
  let nextFreeLineIndex = new Array(grid[0].length).fill(0);

  for (let lineIndex = 0; lineIndex < grid.length; lineIndex++) {
    let line = grid[lineIndex];
    for (let columnIndex = 0; columnIndex < line.length; columnIndex++) {
      let char = line[columnIndex];

      if (char === 'O') {
        grid[lineIndex][columnIndex] = '.';
        grid[nextFreeLineIndex[columnIndex]][columnIndex] = 'O';
        nextFreeLineIndex[columnIndex]++;
      } else if (char === '#') {
        nextFreeLineIndex[columnIndex] = lineIndex + 1;
      }
    }
  }
}

function cycle(grid: string[][]) {
  tiltNorth(grid);
  grid = rotateGridRight(grid);
  tiltNorth(grid);
  grid = rotateGridRight(grid);
  tiltNorth(grid);
  grid = rotateGridRight(grid);
  tiltNorth(grid);
  grid = rotateGridRight(grid);
  return grid;
}

function calculateLoad(grid: string[][]) {
  let load = 0;

  for (let lineIndex = 0; lineIndex < grid.length; lineIndex++) {
    let line = grid[lineIndex];
    for (let columnIndex = 0; columnIndex < line.length; columnIndex++) {
      let char = line[columnIndex];
      if (char === 'O') {
        load += grid.length - lineIndex;
      }
    }
  }

  return load;
}

export function calc(input: string) {
  let grid: string[][] = splitGrid(input);

  let gridKeyToCycleIndex = {};
  let cycleIndexToLoad = {};

  for (let cycleIndex = 0; ; cycleIndex++) {
    grid = cycle(grid);
    cycleIndexToLoad[cycleIndex] = calculateLoad(grid);

    let gridKey = grid.map((l) => l.join('')).join('\n');
    const previousCycleIndex = gridKeyToCycleIndex[gridKey];

    if (previousCycleIndex !== undefined) {
      const loopLength = cycleIndex - previousCycleIndex;
      const loopRemainder = (1_000_000_000 - previousCycleIndex) % loopLength;
      return cycleIndexToLoad[loopRemainder + previousCycleIndex - 1];
    }

    gridKeyToCycleIndex[gridKey] = cycleIndex;
  }
}
