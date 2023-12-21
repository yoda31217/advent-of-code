import { splitGrid } from '../../utils/strings';

export function calc(input: string) {
  let grid: string[][] = splitGrid(input);

  let startRow = 0;
  let startCol = 0;

  for (let i = 0; i < grid.length; i++) {
    const line = grid[i];
    for (let j = 0; j < line.length; j++) {
      if (line[j] === 'S') {
        startRow = i;
        startCol = j;
      }
    }
  }

  console.log(startRow, startCol);

  let positions = [[0, startRow, startCol]];

  let result = 0;
  let maxSteps = 64;

  let cache = {};

  while (positions.length > 0) {
    let [stepsDone, row, col] = positions.pop();

    // console.log('cand', stepsDone, row, col);

    if (grid[row][col] === undefined || grid[row][col] === '#') {
      continue;
    }

    if (stepsDone > maxSteps) {
      continue;
    }

    let cKey = (row * 10_000 + col) * 10_000 + stepsDone;

    if (cache[cKey]) {
      continue;
    }

    cache[cKey] = true;

    // console.log('right', stepsDone, row, col);

    if (stepsDone === maxSteps) {
      result++;
      continue;
    }

    positions.push([stepsDone + 1, row - 1, col]);
    positions.push([stepsDone + 1, row + 1, col]);
    positions.push([stepsDone + 1, row, col - 1]);
    positions.push([stepsDone + 1, row, col + 1]);
  }

  return result;
}
