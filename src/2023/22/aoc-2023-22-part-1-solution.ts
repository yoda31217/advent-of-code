import { sortBy, values } from 'lodash';
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

    console.log('move', brik[0], minus);

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
  console.log(brikIdToSupportedBy);

  let result = briks.filter(([index]) =>
    values(brikIdToSupportedBy)
      .filter((supporters: number[]) => supporters.includes(index))
      .every((supporters: number[]) => supporters.filter((s) => s !== index).length >= 1),
  ).length;
  // )
  // .forEach(([index]) => console.log(index));

  let i0 = 1;
  let r0 = values(brikIdToSupportedBy).filter((supporters: number[]) => supporters.includes(i0));
  let r1 = values(brikIdToSupportedBy)
    .filter((supporters: number[]) => supporters.includes(i0))
    .filter((supporters: number[]) => {
      // console.log(supporters.filter((s) => s !== i0).length);
      return supporters.filter((s) => s !== i0).length >= 1;
    });
  // console.log(r0);
  // console.log(r1);

  return result;
}
