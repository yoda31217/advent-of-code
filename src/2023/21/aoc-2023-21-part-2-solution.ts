import { sum } from 'lodash';
import { initArray } from '../../utils/arrays';
import { splitGrid } from '../../utils/strings';

const process = require('process');

export function dij(grid: string[][], startRow: number, startCol: number) {
  let resGrid: (number | undefined)[][] = initArray(grid.length, () => initArray(grid[0].length, () => undefined));

  let positions = [[0, startRow, startCol]];

  while (positions.length > 0) {
    let [stepsDone, row, col] = positions.pop();

    if (grid?.[row]?.[col] === undefined || grid[row][col] === '#') {
      continue;
    }

    if (resGrid[row][col] !== undefined && resGrid[row][col] <= stepsDone) {
      continue;
    }

    resGrid[row][col] = stepsDone;

    positions.push([stepsDone + 1, row - 1, col]);
    positions.push([stepsDone + 1, row + 1, col]);
    positions.push([stepsDone + 1, row, col - 1]);
    positions.push([stepsDone + 1, row, col + 1]);
  }

  return resGrid;
}

let cache1 = {};

export function calc1(grid: string[][], startRow: number, startCol: number, maxSteps: number) {
  // console.log('calc1', maxSteps);

  if (maxSteps === 0) {
    return 0;
  }

  let threshold = grid.length + grid.length + grid.length + grid.length;

  if (maxSteps > threshold) {
    maxSteps = threshold + (maxSteps % 2);
  }

  // let threshold = 400;

  let key = startRow + '=' + startCol + '=' + maxSteps;
  // let key = startRow + '=' + startCol + '=' + (maxSteps > threshold ? (maxSteps % 2) + threshold : maxSteps);
  let cval = cache1[key];
  if (cval) {
    return cval;
  }

  // console.log('calc1', maxSteps);

  let positions = [[0, startRow, startCol]];

  let result = 0;

  let checksum = maxSteps % 2;

  let cache = {};

  while (positions.length > 0) {
    let [stepsDone, row, col] = positions.pop();

    // console.log('cand', stepsDone, row, col);

    if (grid?.[row]?.[col] === undefined || grid[row][col] === '#') {
      continue;
    }

    if (stepsDone > maxSteps) {
      continue;
    }

    let cKey = row * 10_000_000 + col;

    if (cache[cKey]) {
      if (cache[cKey] <= stepsDone) {
        continue;
      } else {
        cache[cKey] = stepsDone;
      }
    } else {
      cache[cKey] = stepsDone;
      if (stepsDone % 2 === checksum && stepsDone > 0) {
        result++;
      }
    }

    positions.push([stepsDone + 1, row - 1, col]);
    positions.push([stepsDone + 1, row + 1, col]);
    positions.push([stepsDone + 1, row, col - 1]);
    positions.push([stepsDone + 1, row, col + 1]);
  }

  cache1[key] = result;

  // console.log('calc1', startRow, startCol, maxSteps, result);

  return result;
}
export function calc1_bak(grid: string[][], startRow: number, startCol: number, maxSteps: number) {
  if (maxSteps === 0) {
    return 0;
  }

  // if (maxSteps > 5000) {
  //   maxSteps = maxSteps % 5000;
  // }

  let key = startRow + '=' + startCol + '=' + maxSteps;
  let cval = cache1[key];
  if (cval) {
    return cval;
  }

  let positions = [[0, startRow, startCol]];

  let result = 0;

  let checksum = maxSteps % 2;

  let cache = {};

  while (positions.length > 0) {
    let [stepsDone, row, col] = positions.pop();

    // console.log('cand', stepsDone, row, col);

    if (grid?.[row]?.[col] === undefined || grid[row][col] === '#') {
      continue;
    }

    if (stepsDone > maxSteps) {
      continue;
    }

    let cKey = row * 10_000_000 + col;

    if (cache[cKey]) {
      if (cache[cKey] <= stepsDone) {
        continue;
      } else {
        cache[cKey] = stepsDone;
      }
    } else {
      cache[cKey] = stepsDone;
      if (stepsDone % 2 === checksum && stepsDone > 0) {
        result++;
      }
    }

    positions.push([stepsDone + 1, row - 1, col]);
    positions.push([stepsDone + 1, row + 1, col]);
    positions.push([stepsDone + 1, row, col - 1]);
    positions.push([stepsDone + 1, row, col + 1]);
  }

  cache1[key] = result;

  return result;
}

export function calc(input: string) {
  let grid: string[][] = splitGrid(input);
  // let grid: string[][] = splitGrid(input).map((l) => [...l, ...l]);
  // grid = [...grid, ...grid];

  // grid.forEach((l) => console.log(l.join('')));

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

  let rows = grid.length;
  let cols = grid[0].length;

  let mss = 6;
  console.log(startRow, startCol, rows, cols);

  let resGrid = dij(grid, startRow, startCol);
  resGrid.forEach((l, li) =>
    console.log(l.map((d, di) => (d === undefined ? '###' : d + '').padStart(4, ' ')).join('  ')),
  );

  console.log('-----!@#');
  //
  // resGrid = dij(grid, 0, 0);
  // resGrid.forEach((l) => console.log(l.map((d) => (d === undefined ? '###' : d + '').padStart(4, ' ')).join(', ')));
  //
  // console.log('-----!@#');
  //
  // resGrid = dij(grid, 5, 0);
  // resGrid.forEach((l) => console.log(l.map((d) => (d === undefined ? '###' : d + '').padStart(4, ' ')).join(', ')));

  // console.log('0,5=', calc1(grid, 0, 5, 4));
  // console.log('10,5=', calc1(grid, rows - 1, 5, 4));
  // console.log('5,0=', calc1(grid, 5, 0, 4));
  // console.log('5,10=', calc1(grid, 5, cols - 1, 4));
  // console.log('5,5=', calc1(grid, 5, 5, 10));
  //
  // console.log('5,5,6', calc1(grid, 5, 5, 6));

  // console.log(calc1(grid, startRow, startCol, 2));
  // console.log(calc1(grid, startRow, startCol, 3));
  // console.log(calc1(grid, startRow, startCol, 6));
  // console.log('-----');
  // console.log(calc1(grid, 0, 0, 1000));
  // console.log(calc1(grid, 0, 0, 1001));

  return 0;
  console.log('=====');
  // console.log('0=0,0', slow(grid, startRow, startCol, 0));
  // console.log('1=2,4', slow(grid, startRow, startCol, 1));
  // console.log('2=4,7', slow(grid, startRow, startCol, 2));
  // console.log('3=6,15', slow(grid, startRow, startCol, 3));
  // console.log('6=16,36', slow(grid, startRow, startCol, 6));
  // console.log('10=50,90', slow(grid, startRow, startCol, 10));
  // console.log('50=1594,1940', slow(grid, startRow, startCol, 50));
  // console.log('100=6536,7645', slow(grid, startRow, startCol, 100));
  // // console.log('500=167004,188756', slow(grid, startRow, startCol, 500));
  //
  //
  // console.log('0=0,0', fast(grid, startRow, startCol, 0));
  // console.log('1=2,4', fast(grid, startRow, startCol, 1));
  // console.log('2=4,7', fast(grid, startRow, startCol, 2));
  // console.log('3=6,15', fast(grid, startRow, startCol, 3));
  // console.log('6=16,36', fast(grid, startRow, startCol, 6));
  // console.log('10=50,90', fast(grid, startRow, startCol, 10));
  // console.log('50=1594,1940', fast(grid, startRow, startCol, 50));
  // console.log('100=6536,7645', fast(grid, startRow, startCol, 100));
  // console.log('500=167004,188756', fast(grid, startRow, startCol, 500));
  // console.log('1000=753480', fast(grid, startRow, startCol, 1000));
  // console.log('5000=18807440', fast(grid, startRow, startCol, 5000));
  console.log('26501365=', fast(grid, startRow, startCol, 26501365));
  console.log('=====');

  // console.log(fast(grid, startRow, startCol, 0));
  // console.log(fast(grid, startRow, startCol, 1));
  // console.log(fast(grid, startRow, startCol, 2));
  // console.log(fast(grid, startRow, startCol, 3));
  // console.log(fast(grid, startRow, startCol, 6));
  // console.log(fast(grid, startRow, startCol, 10));
  // console.log(fast(grid, startRow, startCol, 50));
  // console.log(fast(grid, startRow, startCol, 100));
  // console.log(fast(grid, startRow, startCol, 500));
  // console.log(fast(grid, startRow, startCol, 1000));
  // console.log(fast(grid, startRow, startCol, 5000));

  return 0;
}

function fast(grid: string[][], startRow: number, startCol: number, maxSteps: number) {
  let rows = grid.length;
  let cols = grid[0].length;

  let summa = 0;

  let stepsUsed = cols - startCol + rows - startRow;
  // console.log('stepsUsed=', stepsUsed);

  // console.log(sum);

  // let boostR = Math.floor((maxSteps - stepsUsed) / rows) - 1;
  let boostR = 0;
  let boostN = (boostR * (boostR + 1)) / 2;
  let boostCh = Math.floor(boostN / 2);
  let boostNch = boostN - boostCh;

  if (boostR > 0) {
    summa +=
      (calc1(grid, 0, 0, maxSteps) +
        calc1(grid, 0, cols - 1, maxSteps) +
        calc1(grid, rows - 1, 0, maxSteps) +
        calc1(grid, rows - 1, cols - 1, maxSteps)) *
        boostCh +
      (calc1(grid, 0, 0, maxSteps - rows) +
        calc1(grid, 0, cols - 1, maxSteps - rows) +
        calc1(grid, rows - 1, 0, maxSteps - rows) +
        calc1(grid, rows - 1, cols - 1, maxSteps - rows)) *
        boostNch;
  } else {
    boostR = 0;
  }

  // console.log('---- boostR', summa, boostR, boostN, boostCh, boostNch);

  let resics: number[] = [];

  for (let r = 0; r <= maxSteps - stepsUsed; r += rows) {
    const ms = maxSteps - stepsUsed - r;

    if (ms === 0) {
      resics.push(4);
      continue;
    }

    let c1 = calc1(grid, 0, 0, ms);
    let c2 = calc1(grid, 0, cols - 1, ms);
    let c3 = calc1(grid, rows - 1, 0, ms);
    let c4 = calc1(grid, rows - 1, cols - 1, ms);

    resics.push(c1 + c2 + c3 + c4);
  }

  let base = sum(resics);
  for (let i = 0; i < resics.length; i++) {
    summa += base;
    base -= resics[i];
    if (i % 1_000 === 0) {
      console.log(i, resics.length);
    }
  }
  // resics.forEach((_, i, is) => {
  //   if (i % 1_000 === 0) {
  //     console.log(i, is.length);
  //   }
  //
  //   summa += sum(resics.slice(i));
  // });

  // clone start

  // let i = 0;
  // for (let r = 0; r <= maxSteps - stepsUsed; r += rows) {
  //   // console.log('angel=', r);
  //   // for (let c = 0; c + r <= maxSteps - stepsUsed; c += cols) {
  //   const cStart = boostR > 0 ? boostR * cols - r : 0;
  //   for (let c = cStart; c + r <= maxSteps - stepsUsed; c += cols) {
  //     const ms = maxSteps - stepsUsed - c - r;
  //
  //     if (ms === 0) {
  //       sum += 4;
  //       continue;
  //     }
  //
  //     let c1 = calc1(grid, 0, 0, ms);
  //     // console.log(sum, ms);
  //     let c2 = calc1(grid, 0, cols - 1, ms);
  //     // console.log(sum, ms);
  //     let c3 = calc1(grid, rows - 1, 0, ms);
  //     // console.log(sum, ms);
  //     let c4 = calc1(grid, rows - 1, cols - 1, ms);
  //
  //     sum += c1 + c2 + c3 + c4;
  //
  //     i++;
  //     if (i % 1 === 0) {
  //       console.log(sum, r, c, ms, new Date(), c1, c2, c3, c4);
  //     }
  //   }
  // }

  /// clone

  summa += calc1(grid, startRow, startCol, maxSteps);
  // console.log('middle');

  // console.log(calc1(grid, startRow, startCol, maxSteps));

  stepsUsed = cols - startCol;

  for (let r = 0; r <= maxSteps - stepsUsed; r += rows) {
    const ms = maxSteps - stepsUsed - r;
    if (ms === 0) {
      summa += 4;
      continue;
    }
    summa += calc1(grid, 0, startCol, ms);
    // console.log(sum, ms);
    summa += calc1(grid, rows - 1, startCol, ms);
    // console.log(sum, ms);
    summa += calc1(grid, startRow, 0, ms);
    // console.log(sum, ms);
    summa += calc1(grid, startRow, cols - 1, ms);
    // console.log(sum, ms);
    // console.log(sum, r, ms, new Date());
  }

  return summa;
}

function slow(grid: string[][], startRow: number, startCol: number, maxSteps: number) {
  if (maxSteps === 0) {
    return 0;
  }

  let rows = grid.length;
  let cols = grid[0].length;

  let positions = [[0, startRow, startCol]];

  let result = 0;

  let cache = {};
  let cacheSize = 0;

  let i = 0;

  let checksum = maxSteps % 2;

  while (positions.length > 0) {
    let [stepsDone, row, col] = positions.pop();

    i++;
    // if (i % 10_000_000 === 0) {
    //   console.log(positions.length, cacheSize, result, new Date());
    //   console.log(process.memoryUsage().heapTotal / 1024 / 1024 / 1024);
    //   console.log(process.memoryUsage().heapUsed / 1024 / 1024 / 1024);
    // }

    let nRow = ((row % rows) + rows) % rows;
    let nCol = ((col % cols) + cols) % cols;

    // console.log('cand', stepsDone, row, col, nRow, nCol);

    if (grid[nRow][nCol] === '#') {
      continue;
    }

    if (stepsDone > maxSteps) {
      continue;
    }

    ////

    // let cKey = (row * 10_000 + col) * 10_000 + stepsDone;
    //
    // if (cache[cKey]) {
    //   continue;
    // } else {
    //   cache[cKey] = true;
    //   cacheSize++;
    // }

    let cKey = row * 10_000_000 + col;

    if (cache[cKey]) {
      if (cache[cKey] <= stepsDone) {
        continue;
      } else {
        cache[cKey] = stepsDone;
      }
    } else {
      cacheSize++;
      cache[cKey] = stepsDone;
      if (stepsDone % 2 === checksum && stepsDone > 0) {
        result++;
      }
    }

    /////

    // console.log('right', stepsDone, row, col);

    positions.push([stepsDone + 1, row - 1, col]);
    positions.push([stepsDone + 1, row + 1, col]);
    positions.push([stepsDone + 1, row, col - 1]);
    positions.push([stepsDone + 1, row, col + 1]);
  }

  return result;
}
