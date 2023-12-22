import { sortBy, sum, values } from 'lodash';
import { splitByComaNumbers, splitLines } from '../../utils/strings';

function getCubes(brik) {
  let [index, x1, y1, z1, x2, y2, z2] = brik;

  if (x1 === x2 && y1 === y2 && z1 === z2) {
    return [[x1, y1, z1]];
  }

  let offset = x1 !== x2 ? 0 : y1 !== y2 ? 1 : 2;

  let diff = brik[1 + 3 + offset] - brik[1 + offset];
  let size = Math.abs(diff) + 1;
  let dir = diff / Math.abs(diff);

  let cubes = [];

  for (let i = 0; i < size; i++) {
    let cube = [brik[1], brik[2], brik[3]];
    cube[offset] += i * dir;
    cubes.push(cube);
  }

  return cubes;
}

export function calc(input: string) {
  let lines = splitLines(input);

  let briks = [];
  lines.forEach((line, i) => {
    let [lp, rp] = line.split('~');
    briks.push([i, ...splitByComaNumbers(lp), ...splitByComaNumbers(rp)]);
  });

  briks = sortBy(briks, (brik) => Math.min(brik[3], brik[6]));

  console.log(briks);

  let used = {};

  // briks.forEach((brik) => {
  //   let cubes = getCubes(brik);
  //   cubes.forEach((cube) => {
  //     let [x, y, z] = cube;
  //     let key = x + '=' + y + '=' + z;
  //     used[key] = brik[0];
  //   });
  // });

  let brikIdToSupportedBy = {};

  briks.forEach((brik) => {
    let cubes = getCubes(brik);

    // console.log('-----');
    // console.log(brik + '');
    // console.log(cubes);

    let minus = 1;
    while (
      cubes.filter(([x, y, z]) => z - minus > 0 && used[x + '=' + y + '=' + (z - minus)] === undefined).length ===
      cubes.length
    ) {
      minus++;
    }
    minus--;

    // console.log('move', brik[0], minus);

    cubes.forEach((cube) => {
      cube[2] -= minus;
    });
    brik[3] -= minus;
    brik[6] -= minus;

    let supporters = [];
    cubes.forEach((cube) => {
      let [x, y, z] = cube;
      let key = x + '=' + y + '=' + (z - 1);
      if (used[key] !== undefined) {
        supporters.push(used[key]);
      }
    });
    brikIdToSupportedBy[brik[0]] = supporters;

    cubes.forEach((cube) => {
      let [x, y, z] = cube;
      used[x + '=' + y + '=' + z] = brik[0];
    });

    // console.log(brik + '');
    // console.log(cubes);
  });

  // console.log(used);
  // console.log(brikIdToSupportedBy);

  let canDis = briks
    .filter(([index]) =>
      values(brikIdToSupportedBy)
        .filter((supporters: number[]) => supporters.includes(index))
        .every((supporters: number[]) => supporters.filter((s) => s !== index).length >= 1),
    )
    .map(([index]) => index);

  let brikIdToSuppots = {};

  briks.forEach(([brikId]) => {
    brikIdToSuppots[brikId] = brikIdToSuppots[brikId] || [];

    let supporters = brikIdToSupportedBy[brikId];
    supporters.forEach((supporter) => {
      let supported = brikIdToSuppots[supporter] || [];
      brikIdToSuppots[supporter] = supported;
      supported.push(brikId);
    });
  });

  // console.log(brikIdToSuppots);

  // let result = briks.map((brik, i) => {
  //   // console.log(i);
  //
  //   // if (canDis.includes(brik[0])) {
  //   //   return [brik[0], []];
  //   //   // return 0;
  //   // }
  //
  //   let willFall = { [brik[0]]: true };
  //   let willFallBids = [brik[0]];
  //
  //   let toProcess = [brik[0]];
  //
  //   let j = 0;
  //
  //   while (toProcess.length > 0) {
  //     j++;
  //     if (j % 1_000 === 0) {
  //       // console.log(i, j, toProcess.length, ':', toProcess.slice(0, 10));
  //     }
  //     let bid = toProcess.shift();
  //     let supported: number[] = brikIdToSuppots[bid];
  //     supported = sortBy(supported);
  //     // supported = supported.reverse();
  //     // console.log(brik, bid, supported, toProcess);
  //     supported.forEach((s) => {
  //       let sSupportedBy = brikIdToSupportedBy[s];
  //
  //       console.log(i, j, brik[0], bid, supported, s, sSupportedBy, willFallBids);
  //
  //       if (
  //         // true
  //         // !willFall[s] &&
  //         intersection(sSupportedBy, [...supported, ...willFallBids]).length === sSupportedBy.length
  //       ) {
  //         toProcess.push(s);
  //         willFall[s] = true;
  //         if (!willFallBids.includes(s)) {
  //           willFallBids.push(s);
  //         }
  //       }
  //     });
  //   }
  //
  //   // return [brik[0], willFall];
  //   return keys(willFall).length - 1;
  // });

  let cache = {};

  function canCollapseTo(anotherBid: number, brikId: number) {
    if (anotherBid === brikId) {
      return true;
    }

    let key = anotherBid * 100_000 + brikId;
    if (cache[key] !== undefined) {
      return cache[key];
    }

    const supportedByBids: number[] = brikIdToSupportedBy[anotherBid];
    const res = supportedByBids.length !== 0 && supportedByBids.every((sbb) => canCollapseTo(sbb, brikId));

    cache[key] = res;

    return res;
  }

  let result = briks.map((brik, i) => {
    // console.log(i);
    let brikId = brik[0];
    let res = 0;
    briks.forEach(([anotherBid], j) => {
      // console.log(j);
      if (anotherBid === brikId) {
        return;
      }
      if (canCollapseTo(anotherBid, brikId)) {
        res++;
      }
    });
    return res;
  });

  // return result;
  return sum(result);
}

/// 118079
// 4282
