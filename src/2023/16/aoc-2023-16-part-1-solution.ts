import { add } from 'lodash';
import { initArray } from '../../utils/arrays';
import { splitGrid } from '../../utils/strings';

export function calc(input: string) {
  let grid = splitGrid(input);

  // console.log(grid);

  let energized = initArray(grid.length, () => initArray(grid[0].length, () => false));
  // console.log(energized);

  let beams = [];
  beams.push([
    [0, 0],
    [0, 1],
  ]);

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

      // i++;
      // if (i > 30) {
      //   return 999;
      // }

      let char = grid[y][x];
      // console.log(y, x, dy, dx, char, beams);

      energized[y][x] = true;

      if (char === '.') {
        x += dx;
        y += dy;
      } else if (char === '-') {
        if (dy !== 0) {
          beams.push([
            [y, x - 1],
            [0, -1],
          ]);
          beams.push([
            [y, x + 1],
            [0, 1],
          ]);
          break;
        } else {
          x += dx;
          y += dy;
        }
      } else if (char === '|') {
        if (dx !== 0) {
          beams.push([
            [y - 1, x],
            [-1, 0],
          ]);
          beams.push([
            [y + 1, x],
            [1, 0],
          ]);
          break;
        } else {
          x += dx;
          y += dy;
        }
      } else if (char === '\\') {
        let t = dx;
        dx = dy;
        dy = t;
        x += dx;
        y += dy;
      } else {
        let t = -dx;
        dx = -dy;
        dy = t;
        x += dx;
        y += dy;
      }
    }
  }

  return energized.map((s) => s.filter((i) => i).length).reduce(add, 0);
}
