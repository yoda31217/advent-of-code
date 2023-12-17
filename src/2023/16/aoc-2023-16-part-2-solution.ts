import { add, max } from 'lodash';
import { initArray } from '../../utils/arrays';
import { splitGrid } from '../../utils/strings';

export function calc(input: string) {
  let grid = splitGrid(input);

  // calc2(grid, [
  //   [0, 0],
  //   [0, 1],
  // ]);

  let r = [];
  for (let i = 0; i < grid.length; i++) {
    r.push(
      calc2(grid, [
        [i, 0],
        [0, 1],
      ]),
    );
    r.push(
      calc2(grid, [
        [i, grid[0].length - 1],
        [0, -1],
      ]),
    );
  }

  for (let i = 0; i < grid[0].length; i++) {
    r.push(
      calc2(grid, [
        [0, i],
        [1, 0],
      ]),
    );
    r.push(
      calc2(grid, [
        [grid.length - 1, i],
        [-1, 0],
      ]),
    );
  }

  return max(r);
  // console.log(grid);
}

export function calc2(grid: string[][], startBeam: [[number, number], [number, number]]) {
  let energized = initArray(grid.length, () => initArray(grid[0].length, () => false));
  // console.log(energized);

  let beams = [];
  beams.push(startBeam);

  let i = 0;

  let was = {};

  while (beams.length > 0) {
    let [[y, x], [dy, dx]] = beams.pop();

    while (y >= 0 && y < grid.length && x >= 0 && x < grid[0].length) {
      let key = x + '=' + y + '=' + dx + '=' + dy;
      if (was[key]) {
        break;
      }

      was[key] = true;

      let char = grid[y][x];

      energized[y][x] = true;

      if (char === '-' && dy !== 0) {
        beams.push(
          [
            [y, x - 1],
            [0, -1],
          ],
          [
            [y, x + 1],
            [0, 1],
          ],
        );
        break;
      } else if (char === '|' && dx !== 0) {
        beams.push(
          [
            [y - 1, x],
            [-1, 0],
          ],
          [
            [y + 1, x],
            [1, 0],
          ],
        );
        break;
      } else if (char === '\\') {
        [dx, dy] = [dy, dx];
      } else if (char === '/') {
        [dx, dy] = [-dy, -dx];
      }

      x += dx;
      y += dy;
    }
  }

  return energized.map((s) => s.filter((i) => i).length).reduce(add, 0);
}
