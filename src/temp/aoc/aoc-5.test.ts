/* eslint-disable */
/* eslint no-use-before-define: 0 */ // --> OFF
// @ts-ignore
import { readFileSync } from 'fs';

function calculate(input: string) {
  let state = {};

  let lines = input
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => !!line);

  let seeds = lines[0]
    .split(/\s*:\s+/)[1]
    .split(/\s+/)
    .map((s) => +s);

  // console.info(seeds);

  let step = 0;

  let result = lines
    .slice(1)
    .map((line, index, lines) => {
      // console.info(line);

      if (line.includes(' map:')) {
        step++;
        state[step] = [];
        return;
      } else {
        let numbers = line.split(/\s+/).map((s) => +s);
        state[step].push(numbers);
      }

      return 1;
    })
    .reduce((result, lineResult) => result + lineResult, 0);

  // console.info(state);
  //\
  //

  let newSeeds = [];
  let r = -1;
  let bigSeeds = [];
  for (let iii = 0; iii < seeds.length; iii = iii + 2) {
    console.info('ss', iii, seeds[iii], seeds[iii + 1]);
    for (let jjj = 0; jjj < seeds[iii + 1]; jjj++) {
      let seed = seeds[iii] + jjj;

      if (jjj % 10_000_000 === 0) {
        console.log(seed);
      }

      for (let i = 1; i <= 7; i++) {
        for (let j = 0; j < state[i].length; j++) {
          let [destionationStart, sourceStart, count] = state[i][j];
          if (seed >= sourceStart && seed < sourceStart + count) {
            seed = seed - sourceStart + destionationStart;
            break;
          }
        }
      }

      if (r === -1 || seed < r) {
        r = seed;
      }
    }
  }
  // seeds = seeds
  //   .map((seedStart, i) => {
  //     if (i % 2 === 0) {
  //       let seedsCount = seeds[i + 1];
  //       let nSeeds = [];
  //       for (let s = 0; s < seedsCount; s++) {
  //         nSeeds.push(seedStart + s);
  //       }
  //       return nSeeds;
  //     } else {
  //       return [];
  //     }
  //   })
  //   .flat(1);
  // console.info(bigSeeds);

  // let newSeeds = bigSeeds.map((seed, index) => {
  // });

  // console.info(newSeeds);

  return r;
}
console.info(
  'r=',
  calculate(`
seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
      `),
);

const inputStr = readFileSync(__dirname + '/aoc-5.input.txt', { encoding: 'utf-8' });
console.log('r=', calculate(inputStr));
// expect().toEqual(0);

//
//
//
//
//
// describe('AoC-5', () => {
//   test('utils', () => {
//     // expect(1).toEqual(1);
//   });
//
//   test('test', () => {
//     expect(
//       ,
//     ).toEqual(46);
//   });
//
//   test('prod', async () => {
//   });
// });

/* eslint-enable */
/* eslint no-use-before-define: 2 */ // --> ON
