import { max } from 'lodash';
import { splitGrid, splitLines } from '../../utils/strings';

let nextKey = 0;
let keysCache = [];

function toKey(r: number, c: number) {
  let offset = r * 1000 + c;

  if (keysCache[offset] === undefined) {
    let result = nextKey;
    keysCache[offset] = nextKey;
    nextKey++;
    return result;
  } else {
    return keysCache[offset];
  }
}

function countNear(grid: string[][], r: number, c: number) {
  return [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ].filter(([dr, dc]) => {
    let nr = r + dr;
    let nc = c + dc;

    const ntile = grid?.[nr]?.[nc];

    if (ntile === undefined || ntile === '#') {
      return false;
    }

    return true;
  }).length;
}

function fill(grid: string[][], nodeIndexToNode: any[]) {
  nodeIndexToNode.forEach((node, nodeIndex) => {
    let cache = [];

    let cells: [number, number, number, number][] = [[node.r, node.c, nodeIndex, 0]];

    console.log(nodeIndex, cells);

    while (cells.length > 0) {
      let [r, c, prevNodeIdx, steps] = cells.shift();

      console.log(r, c, prevNodeIdx, steps);

      const key = toKey(r, c);

      if (grid?.[r]?.[c] === undefined || grid[r][c] === '#') {
        continue;
      }

      let cachedCount = cache[key] || 0;
      cachedCount++;
      if (cachedCount > 1) {
        // if (cache[key] !== undefined ) {
        continue;
      }

      cache[key] = cachedCount;

      if (key < nodeIndexToNode.length) {
        // console.log('node: ', key);
        // console.log('prev: ', prevNodeIdx);
        if (prevNodeIdx == key) {
          steps = 0;
        } else {
          // console.log('zzz', key, prevNodeIdx, steps);
          nodeIndexToNode[key].targets[prevNodeIdx] = steps;
          nodeIndexToNode[prevNodeIdx].targets[key] = steps;
          prevNodeIdx = key;
          steps = 0;
          continue;
        }
      }

      cells.push([r + 1, c, prevNodeIdx, steps + 1]);
      cells.push([r - 1, c, prevNodeIdx, steps + 1]);
      cells.push([r, c + 1, prevNodeIdx, steps + 1]);
      cells.push([r, c - 1, prevNodeIdx, steps + 1]);
    }
  });
}

export function calc(input: string) {
  let lines = splitLines(input);
  let grid = splitGrid(input);

  let sr = 0;
  let sc = grid[sr].indexOf('.');

  let fr = grid.length - 1;
  let fc = grid[fr].indexOf('.');

  console.log(sr, sc);

  let crossCount = 0;

  // let nodekeys = [toKey(sr, sc), toKey(fr, fc)];
  let nodeIndexToNode: any[] = [];

  nodeIndexToNode[toKey(sr, sc)] = {
    index: toKey(sr, sc),
    r: sr,
    c: sc,
    targets: [],
  };
  nodeIndexToNode[toKey(fr, fc)] = {
    index: toKey(fr, fc),
    r: fr,
    c: fc,
    targets: [],
  };

  grid.forEach((row, r) => {
    row.forEach((tile, c) => {
      if (tile === '#' || tile === undefined) {
        return;
      }
      let dirs = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ].filter(([dr, dc]) => {
        let nr = r + dr;
        let nc = c + dc;

        const ntile = grid?.[nr]?.[nc];

        if (ntile === undefined || ntile === '#') {
          return false;
        }

        return true;
      });

      if (dirs.length === 3 || dirs.length === 4) {
        crossCount++;
        nodeIndexToNode[toKey(r, c)] = {
          index: toKey(r, c),
          r: r,
          c: c,
          targets: [],
        };
      }
    });
  });

  console.log(crossCount);

  // nodekeys.forEach((key) => {});

  console.log(nodeIndexToNode);

  fill(grid, nodeIndexToNode);

  console.log(nodeIndexToNode);

  let nodeStack = [[nodeIndexToNode[toKey(sr, sc)], 0, []]];
  let finishKey = toKey(fr, fc);

  // let cache2 = {};

  let result: number[] = [];

  // console.log('calc', nodekeys.length);

  let i = 0;

  while (nodeStack.length > 0) {
    let [node, steps, cache2] = nodeStack.pop();

    i++;
    if (i % 1000_000 == 0) {
      console.log(node.index, steps, cache2.length, result.length);
    }

    if (cache2[node.index]) {
      continue;
    }

    if (node.index === finishKey) {
      // console.log('finish', steps, node.index);
      result.push(steps);
      continue;
    }

    cache2[node.index] = true;

    // console.log('asdasd');

    // console.log(node);

    node.targets.forEach((len, targetNodeIndex) => {
      // console.log('asdasdasscxzxc', targetNodeIndex);
      nodeStack.push([nodeIndexToNode[targetNodeIndex], steps + len, cache2.slice(0)]);
    });
  }

  // return result;

  // let q: [number, number, number, number[]][] = new Array(100_000);
  // let qf = 0;
  // q[qf] = [sr, sc, 0, []];
  // let qn = 1;
  //
  // let result: number[] = [];
  //
  // let i = 0;
  //
  // let cache1: number[] = [];
  //
  // while (qf < qn) {
  //   let [r, c, steps, cache] = q[qf % q.length];
  //   q[qf % q.length] = undefined;
  //   qf++;
  //   // let [r, c, steps, cache] = q[(qn - 1) % q.length];
  //   // qn--;
  //
  //   i++;
  //   if (i % 1_000_0 === 0) {
  //     console.log(
  //       'r, c, steps:',
  //       r,
  //       c,
  //       steps,
  //       'qf, q_len:',
  //       qf,
  //       qn - qf,
  //       'res_len:',
  //       result.length,
  //       'cache_size',
  //       cache.length,
  //       new Date(),
  //     );
  //   }
  //
  //   const tile = grid?.[r]?.[c];
  //
  //   // if (tile === undefined) {
  //   //   continue;
  //   // }
  //   //
  //   // if (tile === '#') {
  //   //   continue;
  //   // }
  //   //
  //   // if (fr === r && fc === c) {
  //   //   result.push(steps);
  //   //   continue;
  //   // }
  //
  //   // if (tile === '>') {
  //   //   c++;
  //   //   steps++;
  //   // }
  //   // if (tile === '<') {
  //   //   c--;
  //   //   steps++;
  //   // }
  //   // if (tile === '^') {
  //   //   r--;
  //   //   steps++;
  //   // }
  //   // if (tile === 'v') {
  //   //   r++;
  //   //   steps++;
  //   // }
  //
  //   let key = (r << 8) + c;
  //   if (cache[key]) {
  //     continue;
  //   }
  //   cache[key] = steps;
  //
  //   if (cache1[key] && cache1[key] > steps) {
  //     continue;
  //   }
  //   cache1[key] = steps;
  //
  //   let dirs = [
  //     [1, 0],
  //     [-1, 0],
  //     [0, 1],
  //     [0, -1],
  //   ].filter(([dr, dc]) => {
  //     let nr = r + dr;
  //     let nc = c + dc;
  //
  //     const tile = grid?.[nr]?.[nc];
  //
  //     if (tile === undefined || tile === '#') {
  //       return false;
  //     }
  //
  //     if (fr === nr && fc === nc) {
  //       result.push(steps + 1);
  //       return false;
  //     }
  //
  //     return true;
  //   });
  //
  //   q[qn % q.length] = [r + dirs[0][0], c + dirs[0][1], steps + 1, cache];
  //   qn++;
  //
  //   dirs.forEach(([dr, dc], idx) => {
  //     if (idx === 0) {
  //       return;
  //     }
  //     let nr = r + dr;
  //     let nc = c + dc;
  //     q[qn % q.length] = [nr, nc, steps + 1, cache.slice(0)];
  //     qn++;
  //   });
  // }

  return max(result);
}
