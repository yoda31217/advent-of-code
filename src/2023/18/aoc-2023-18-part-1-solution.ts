import { add } from 'lodash';
import { initArray } from '../../utils/arrays';
import { splitLines, splitSpaced } from '../../utils/strings';

export function calc(input: string) {
  let lines = splitLines(input);

  let sr = 1000;
  let sc = 1000;

  let d = initArray(sr, () => initArray(sc, () => 0));

  let row = 500;
  let col = 500;
  d[row][col] = 1;
  let dir = [0, 0];

  let minRow = row;
  let minCol = col;
  let maxRow = row;
  let maxCol = col;

  lines.forEach((l) => {
    // console.log(l, row, col);

    if (row < 0 || row >= sr) {
      throw new Error('row' + row);
    }
    if (col < 0 || col >= sc) {
      throw new Error('col' + col);
    }

    if (row > maxRow) {
      maxRow = row;
    }
    if (col > maxCol) {
      maxCol = col;
    }
    if (row < minRow) {
      minRow = row;
    }
    if (col < minCol) {
      minCol = col;
    }

    let [dirStr, stepsStr, color] = splitSpaced(l);
    let steps = Number(stepsStr);
    if (dirStr === 'R') {
      dir = [0, 1];
    } else if (dirStr === 'L') {
      dir = [0, -1];
    } else if (dirStr === 'U') {
      dir = [-1, 0];
    } else {
      dir = [1, 0];
    }

    for (let i = 0; i < steps; i++) {
      row += dir[0];
      col += dir[1];
      d[row][col] = 1;
    }
  });

  // let inside = false;
  // for(row = 0; row <= maxRow;row++) {
  //   for(col = 0; col <= maxCol; col++) {
  //     if
  //   }
  // }

  let pts = [[0, 0]];
  while (pts.length > 0) {
    let [row, col] = pts.pop();
    if (d?.[row]?.[col] === undefined || d[row][col] > 0) {
      continue;
    }

    d[row][col] = 2;
    pts.push([row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]);
  }

  // d.slice(minRow, maxRow + 1).forEach((r) => {
  //   console.log(
  //     r
  //       .slice(minCol, maxCol + 1)
  //       .map((c) => (c ? '#' : '.'))
  //       .join(''),
  //   );
  // });

  return d.map((rr) => rr.filter((rrr) => rrr !== 2).length).reduce(add, 0);
}
