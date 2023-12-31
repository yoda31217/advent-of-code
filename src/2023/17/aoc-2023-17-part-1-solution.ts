import { initArray } from '../../utils/arrays';
import { splitGrid } from '../../utils/strings';

export function calc(input: string) {
  let grid = splitGrid(input);
  for (let row = 0; row < grid.length; row++) {
    const line = grid[row];
    for (let col = 0; col < line.length; col++) {
      line[col] = Number(line[col]) as unknown as string;
    }
  }

  let grid2 = grid as unknown as number[][];

  // console.log(grid2);

  // let r = initArray(grid2.length, () => initArray(grid2[0].length, () => 999_999_999_999));
  let r = 999_999_999;
  let pos = [
    [0, 1, 0, 1, 0, 0],
    [1, 0, 1, 0, 0, 0],
  ];

  let d = initArray(grid2.length, () => initArray(grid2[0].length, () => ''));

  let c = {};
  let st = {};

  let iter = 0;

  while (pos.length > 0) {
    iter++;

    if (iter % 10_000_000 === 0) {
      console.log(pos.length, new Date().toUTCString(), r);
    }

    let [row, col, dRow, dCol, step, sum] = pos.pop();

    if (sum >= r) {
      continue;
    }

    if (row < 0 || row >= grid2.length || col < 0 || col >= grid2[0].length) {
      continue;
    }

    if (step >= 3) {
      continue;
    }

    sum += grid2[row][col];

    let k = `${row}=${col}=${dRow}=${dCol}=${step}`;

    // let k = `${row}=${col}=${dRow}=${dCol}`;
    // let k1 = `${row}=${col}=${dRow * -1}=${dCol * -1}`;
    // let k2 = `${row}=${col}=${dCol * -1}=${dRow * -1}`;
    // let k3 = `${row}=${col}=${dCol}=${dRow}`;

    // console.log(k, k2, k3);
    if (step == 0 && c[k] <= sum) {
      continue;
    }
    // if (step == 1 && (c[k] <= sum || c[`${row}=${col}=${dRow}=${dCol}=${step - 1}`] <= sum)) {
    //   continue;
    // }
    // if (
    //   step == 2 &&
    //   (c[k] <= sum ||
    //     c[`${row}=${col}=${dRow}=${dCol}=${step - 1}`] <= sum ||
    //     c[`${row}=${col}=${dRow}=${dCol}=${step - 2}`] <= sum)
    // ) {
    //   continue;
    // }

    // if (c[k] && c[k] < sum) {
    // if (c[k] && c[k] <= sum && st[k] <= step) {
    // continue;
    // }
    // if ((c[k2] && c[k2] <= sum) || (c[k3] && c[k3] <= sum)) {
    //   continue;
    // }

    // let cachedGsumBst = (c[k] && c[k] <= sum) || (c[k1] && c[k1] <= sum);
    // let cachedGsumBst =
    //   c[`${row}=${col}=${dRow}=${dCol}=${0}`] <= sum ||
    //   c[`${row}=${col}=${dRow}=${dCol}=${1}`] <= sum ||
    //   c[`${row}=${col}=${dRow}=${dCol}=${2}`] <= sum;
    let cachedGsumBst = false;
    // let cachedBsumGst = (c[k2] && c[k2] <= sum) || (c[k3] && c[k3] <= sum);
    let cachedBsumGst = false;
    // let cachedBsumGst =
    //   c[`${row}=${col}=${dCol}=${dRow}=${0}`] <= sum ||
    //   c[`${row}=${col}=${dCol}=${dRow}=${1}`] <= sum ||
    //   c[`${row}=${col}=${dCol}=${dRow}=${2}`] <= sum ||
    //   c[`${row}=${col}=${-dCol}=${-dRow}=${0}`] <= sum ||
    //   c[`${row}=${col}=${-dCol}=${-dRow}=${1}`] <= sum ||
    //   c[`${row}=${col}=${-dCol}=${-dRow}=${2}`] <= sum;

    // if (c[k] && c[k] === sum && st[k] > step) {
    //   pos.push([row + dRow, col + dCol, dRow, dCol, step + 1, sum]);
    // }

    c[k] = sum;
    st[k] = step;

    if (row === grid2.length - 1 && col === grid2[0].length - 1 && r > sum) {
      r = sum;
      // d[row][col] = `(${dRow},${dCol})`;
    }

    if (dRow === 0) {
      if (!cachedGsumBst) {
        pos.push([row - 1, col, -1, 0, 0, sum]);
        pos.push([row + 1, col, 1, 0, 0, sum]);
      }
      if (!cachedBsumGst) {
        pos.push([row + dRow, col + dCol, dRow, dCol, step + 1, sum]);
      }
    } else {
      if (!cachedGsumBst) {
        pos.push([row, col - 1, 0, -1, 0, sum]);
        pos.push([row, col + 1, 0, 1, 0, sum]);
      }
      if (!cachedBsumGst) {
        pos.push([row + dRow, col + dCol, dRow, dCol, step + 1, sum]);
      }
    }
  }

  // r.forEach((a, ar) => console.log(a.map((s, sc) => padStart(grid2[ar][sc] + d[ar][sc] + '' + s, 12, ' ')).join(',')));

  return r;
}
