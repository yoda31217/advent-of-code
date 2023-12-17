import { add } from 'lodash';
import { initArray } from '../../utils/arrays';
import { splitGrid } from '../../utils/strings';

export function calc(input: string) {
  let grid = splitGrid(input);

  let maxEnergizedTilesCount = 0;
  for (let row = 0; row < grid.length; row++) {
    maxEnergizedTilesCount = Math.max(
      maxEnergizedTilesCount,
      calculateEnergizedTilesCount(grid, [
        [row, 0],
        [0, 1],
      ]),
    );
    maxEnergizedTilesCount = Math.max(
      maxEnergizedTilesCount,
      calculateEnergizedTilesCount(grid, [
        [row, grid[0].length - 1],
        [0, -1],
      ]),
    );
  }

  for (let i = 0; i < grid[0].length; i++) {
    maxEnergizedTilesCount = Math.max(
      maxEnergizedTilesCount,
      calculateEnergizedTilesCount(grid, [
        [0, i],
        [1, 0],
      ]),
    );
    maxEnergizedTilesCount = Math.max(
      maxEnergizedTilesCount,
      calculateEnergizedTilesCount(grid, [
        [grid.length - 1, i],
        [-1, 0],
      ]),
    );
  }

  return maxEnergizedTilesCount;
}

export function calculateEnergizedTilesCount(grid: string[][], startBeam: [[number, number], [number, number]]) {
  let rowToColumnToIsTileEnergized = initArray(grid.length, () => initArray(grid[0].length, () => false));
  let beamStateKeyToWasProcessed = {};

  let beams = [startBeam];

  while (beams.length > 0) {
    let [[row, col], [dRow, dCol]] = beams.pop();

    while (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length) {
      let beamStateKey = col + '=' + row + '=' + dCol + '=' + dRow;
      if (beamStateKeyToWasProcessed[beamStateKey]) {
        break;
      }

      beamStateKeyToWasProcessed[beamStateKey] = true;

      let char = grid[row][col];

      rowToColumnToIsTileEnergized[row][col] = true;

      if (char === '-' && dRow !== 0) {
        beams.push(
          [
            [row, col - 1],
            [0, -1],
          ],
          [
            [row, col + 1],
            [0, 1],
          ],
        );
        break;
      } else if (char === '|' && dCol !== 0) {
        beams.push(
          [
            [row - 1, col],
            [-1, 0],
          ],
          [
            [row + 1, col],
            [1, 0],
          ],
        );
        break;
      } else if (char === '\\') {
        [dCol, dRow] = [dRow, dCol];
      } else if (char === '/') {
        [dCol, dRow] = [-dRow, -dCol];
      }

      col += dCol;
      row += dRow;
    }
  }

  return rowToColumnToIsTileEnergized.map((s) => s.filter((i) => i).length).reduce(add, 0);
}
