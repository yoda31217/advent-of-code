import { max } from 'lodash';
import { splitGrid, splitLines } from '../../utils/strings';

export function calc(input: string) {
  let lines = splitLines(input);
  let grid = splitGrid(input);

  let sr = 0;
  let sc = grid[sr].indexOf('.');

  let fr = grid.length - 1;
  let fc = grid[fr].indexOf('.');

  console.log(sr, sc);

  let q: [number, number, number, any][] = [[sr, sc, 0, []]];

  let result = [];

  let gcache = {};

  let i = 0;

  while (q.length > 0) {
    // let [r, c, steps, cache] = q.shift();
    let [r, c, steps, cache] = q.pop();

    i++;
    if (i % 10_000 === 0) {
      console.log(r, c, steps, cache.length, q.length);
    }

    const tile = grid?.[r]?.[c];

    if (tile === undefined) {
      continue;
    }

    if (tile === '#') {
      continue;
    }

    if (fr === r && fc === c) {
      result.push(steps);
      continue;
    }

    if (tile === '>') {
      c++;
      steps++;
    }
    if (tile === '<') {
      c--;
      steps++;
    }
    if (tile === '^') {
      r--;
      steps++;
    }
    if (tile === 'v') {
      r++;
      steps++;
    }

    // let key = r + '=' + c;
    let key = r * 150 + c;
    if (cache[key]) {
      continue;
    }

    cache[key] = steps;

    // if (gcache[key] && gcache[key] >= steps) {
    //   continue;
    // }
    // gcache[key] = steps;

    q.push([r + 1, c, steps + 1, cache.slice(0)]);
    q.push([r - 1, c, steps + 1, cache.slice(0)]);
    q.push([r, c + 1, steps + 1, cache.slice(0)]);
    q.push([r, c - 1, steps + 1, cache.slice(0)]);
  }

  return max(result);
}
