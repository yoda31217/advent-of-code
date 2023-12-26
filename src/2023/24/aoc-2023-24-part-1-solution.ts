import { splitByComaNumbers, splitLines } from '../../utils/strings';

function isIntersect(
  [h0x, h0y, h0z, h0vx, h0vy, h0hz]: number[],
  [h1x, h1y, h1z, h1vx, h1vy, h1hz]: number[],
  low: number,
  high: number,
) {
  let a0 = h0y - (h0x * h0vy) / h0vx;
  let b0 = h0vy / h0vx;

  let a1 = h1y - (h1x * h1vy) / h1vx;
  let b1 = h1vy / h1vx;

  let x = (a1 - a0) / (b0 - b1);
  let y = a0 + x * b0;

  let t0 = (x - h0x) / h0vx;
  let t1 = (x - h1x) / h1vx;

  if (x === 1 / 0 || x === -1 / 0 || y === 1 / 0 || y === -1 / 0) {
    console.log('no inter', t0, t1, x, y);
    return false;
  }

  if (t0 < 0) {
    console.log('t0<0', t0, t1, x, y);
    return false;
  }

  if (t1 < 0) {
    console.log('t1<0', t0, t1, x, y);
    return false;
  }

  // if (ty !== tx) {
  //   console.log('ty<>tx');
  //   return false;
  // }
  //
  // let h0nx = h0x + tx * h0vx;
  // let h0ny = h0y + ty * h0vy;
  // // let h1nx = h1x + tx*h1vx;
  // // let h1ny = h1y + ty*h1vy;
  //
  if (!(low <= x && x <= high && low <= y && y <= high)) {
    console.log('out', t0, t1, x, y);
    return false;
  }

  return true;
}

export function calc(input: string) {
  let lines = splitLines(input);

  let hails = lines.map((line) => line.replace('@', ',')).map(splitByComaNumbers);

  let low = 200000000000000;
  // let low = 7;
  let high = 400000000000000;
  // let high = 27;

  console.log(hails);

  let result = 0;

  for (let i = 0; i < hails.length; i++) {
    const hailI = hails[i];
    for (let j = i + 1; j < hails.length; j++) {
      const hailJ = hails[j];
      console.log('---');
      console.log(hailI);
      console.log(hailJ);
      if (isIntersect(hailI, hailJ, low, high)) {
        result++;
      }
    }
  }

  return result;
}
