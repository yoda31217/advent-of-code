import { max, min, sortBy } from 'lodash';
import { inv, multiply } from 'mathjs';
import { splitByComaNumbers, splitLines } from '../../utils/strings';

function isInt(n: number) {
  return Math.abs(Math.round(n) - n) < 0.0000000001;
}

function isIntersect([h0x, h0y, h0z, h0vx, h0vy, h0hz]: number[], [h1x, h1y, h1z, h1vx, h1vy, h1hz]: number[]) {
  let a0 = h0y - (h0x * h0vy) / h0vx;
  let b0: number = h0vy / h0vx;

  let a1 = h1y - (h1x * h1vy) / h1vx;
  let b1 = h1vy / h1vx;

  let x = (a1 - a0) / (b0 - b1);
  if (x === Infinity || x === -Infinity) {
    return false;
  }

  let y = a0 + x * b0;
  if (y === Infinity || y === -Infinity) {
    return false;
  }

  let t0 = (x - h0x) / h0vx;
  if (t0 <= 0) {
    return false;
  }

  let t1 = (x - h1x) / h1vx;
  if (t1 <= 0) {
    return false;
  }

  // console.log('Intersect:', ...arguments, 'dot:', x, y, t0, t1);

  if (!(isInt(x) && isInt(y) && isInt(t0) && isInt(t1))) {
    return false;
  }

  t0 = Math.round(t0);
  t1 = Math.round(t1);

  if (t0 !== t1) {
    return false;
  }

  // console.log('Intersect:', true);

  return true;
}

function findKCand(hails: number[][], [vxk, vyk, vzk]: number[]) {
  for (let i = 0; i < hails.length - 1; i++) {
    let [x1, y1, z1, vx1, vy1, vz1] = hails[i];
    let [x2, y2, z2, vx2, vy2, vz2] = hails[i + 1];

    // console.log('Cand:', vxk, vyk, vzk);

    try {
      let A = [
        [1, 0, 0, vxk - vx1, 0],
        [0, 1, 0, vyk - vy1, 0],
        [0, 0, 1, vzk - vz1, 0],
        [1, 0, 0, 0, vxk - vx2],
        [0, 1, 0, 0, vyk - vy2],
      ];
      let b = [x1, y1, z1, x2, y2];

      let [xk, yk, zk, t1, t2] = multiply(inv(A), b);

      // console.log(xk, yk, zk, t1, t2);

      if (!(isInt(xk) && isInt(yk) && isInt(zk) && isInt(t1) && isInt(t2) && t1 > 0 && t2 > 0)) {
        return null;
      }

      return [xk, yk, zk, vxk, vyk, vzk];
    } catch (_) {
      continue;
    }
  }

  return null;
}

export function calc(input: string) {
  let lines = splitLines(input);

  let hails = lines.map((line) => line.replace('@', ',')).map(splitByComaNumbers);

  let low = 200000000000000;
  // let low = 7;
  let high = 400000000000000;
  // let high = 27;
  //
  //

  // let x1 = 19;
  // let y1 = 13;
  // let z1 = 30;
  // let vx1 = -2;
  // let vy1 = 1;
  // let vz1 = -2;
  //
  // let x2 = 18;
  // let y2 = 19;
  // let vx2 = -1;
  // let vy2 = -1;

  // let vxk = -3;
  // let vyk = 1;
  // let vzk = 2;
  //

  let results = [];

  let k = 0;

  for (let vxk = -100; vxk <= 100; vxk++) {
    for (let vyk = -100; vyk <= 100; vyk++) {
      for (let vzk = -100; vzk <= 100; vzk++) {
        k++;
        if (k % 10000 === 0) {
          console.log('Iter', k, vxk, vyk, vzk);
        }

        let kCand = findKCand(hails, [vxk, vyk, vzk]);
        if (kCand === null) {
          continue;
        }

        let r = hails.every((hail) => {
          return (
            isIntersect(hail, kCand) &&
            isIntersect([hail[0], hail[2], 0, hail[3], hail[5], 0], [kCand[0], kCand[2], 0, kCand[3], kCand[5], 0])
          );
        });
        // console.log(kCand, r);
        if (r) {
          results.push(kCand);
        }
      }
    }
  }

  return results;

  // console.log(hails);
  sortBy(hails, ([x, y, z, vx, vy, vz]) => Math.abs(x) + Math.abs(y) + Math.abs(z))
    .map((l) => l.join(','))
    .forEach((l) => console.log(l));
  // sortBy(hails, ([, , , vx, vy, vz]) => Math.abs(vx) + Math.abs(vy) + Math.abs(vz))
  //   .map((l) => l.join(','))
  //   .forEach((l) => console.log(l));

  return 0;

  let result = [];

  let newHails = hails;
  // console.log(newHails);

  for (let t = 0; t < Infinity; t += 100000) {
    newHails = hails.map(([x, y, z, vx, vy, vz]) => {
      return [x + t * vx, y + t * vy, z + t * vz, vx, vy, vz];
    });

    if (t % 1000_000_000 !== 0) {
      continue;
    }

    console.log('-----');
    console.log('t', t);
    let dims = [
      newHails.map(([x]) => x),
      newHails.map(([, y]) => y),
      newHails.map(([, , z]) => z),
      newHails.map(([, , , vx]) => vx),
      newHails.map(([, , , , vy]) => vy),
      newHails.map(([, , , , , vz]) => vz),
    ];
    console.log(
      'x',
      min(dims[0]),
      max(dims[0]),
      'dif:',
      min(dims[0]) - max(dims[0]),
      'avg:',
      avg(dims[0]),
      std(dims[0]),
    );
    console.log(
      'y',
      min(dims[1]),
      max(dims[1]),
      'dif:',
      min(dims[1]) - max(dims[1]),
      'avg:',
      avg(dims[1]),
      std(dims[1]),
    );
    console.log('z', min(dims[2]), max(dims[2]), 'dif:', 'avg:', avg(dims[2]), std(dims[2]));

    console.log('vx', min(dims[3]), max(dims[3]), 'dif:', 'avg:', avg(dims[3]), std(dims[3]));
    console.log('vy', min(dims[4]), max(dims[4]), 'dif:', 'avg:', avg(dims[4]), std(dims[4]));
    console.log('vz', min(dims[5]), max(dims[5]), 'dif:', 'avg:', avg(dims[5]), std(dims[5]));

    // console.log(newHails);
    console.log('-----');
  }

  // for (let t = 1; t < 10; t++) {
  //   hails.forEach((hail) => {
  //     hail[0] += hail[3];
  //     hail[1] += hail[4];
  //     hail[2] += hail[5];
  //   });
  //   hails = hails.sort((h0, h1) => h0[0] - h1[0]);
  //   console.log(t, hails);
  //   console.log(
  //     'diffs:',
  //     hails.map((_, i) => (hails?.[i + 1]?.[0] || Infinity) - hails[i][0]),
  //   );
  // }
  //
  // return 0;

  let i = 0;

  let hailsSlice = hails.slice(1);

  // for (let kx = 0; kx < 30; kx++) {
  //   for (let ky = 0; ky < 30; ky++) {
  for (let kvx = -100; kvx < 100; kvx++) {
    for (let kvy = -100; kvy < 100; kvy++) {
      let [h0x, h0y, h0z, h0vx, h0vy, h0hz] = hails[0];
      let dvx = h0vx - kvx;
      let dvy = h0vy - kvy;

      // console.log('dv', dvx, dvy);

      for (let t = 0; t < 500; t++) {
        let kx = h0x + dvx * t;
        let ky = h0y + dvy * t;
        // console.log('k', kx, ky);

        i++;

        if (i % 1_000_000_00 === 0) {
          console.log('iter', i, 'kv:', kvx, kvy);
          // console.log('iter', i, kx, ky, kvx, kvy);
        }

        if (hailsSlice.every((hail) => isIntersect(hail, [kx, ky, 0, kvx, kvy, 0]))) {
          console.log('ok', kx, ky, kvx, kvy, t);
          result.push([kx, ky, kvx, kvy, t]);
        }
      }
    }
    //   }
    // }
  }

  return result;
}

function avg(array) {
  const sum = array.reduce((acc, curr) => acc + curr, 0);
  const average = sum / array.length;
  return average;
}

function std(arr) {
  // Creating the mean with Array.reduce
  let mean =
    arr.reduce((acc, curr) => {
      return acc + curr;
    }, 0) / arr.length;

  // Assigning (value - mean) ^ 2 to
  // every array item
  arr = arr.map((k) => {
    return (k - mean) ** 2;
  });

  // Calculating the sum of updated array
  let sum = arr.reduce((acc, curr) => acc + curr, 0);

  // Calculating the variance
  let variance = sum / arr.length;

  // Returning the standard deviation
  return Math.sqrt(sum / arr.length);
}
