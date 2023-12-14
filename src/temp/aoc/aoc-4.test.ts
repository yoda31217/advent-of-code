/* eslint-disable */
/* eslint no-use-before-define: 0 */ // --> OFF
// @ts-ignore
import { readFileSync } from 'fs';

function calculate(input: string) {
  let s = {};

  let r = input
    .trim()
    .split('\n')
    .map((l) => l.trim())
    .map((l, i, ls) => {
      let [cnp, cns] = l.split(': ');
      let cn = +cnp.split(/\s+/)[1];
      let [cwns, cuns] = cns.split(' | ');
      let wns = cwns.split(/\s+/).filter((s) => !!s);
      let uns = cuns.split(/\s+/).filter((s) => !!s);

      let wc = uns.filter((un) => wns.includes(un)).length;
      let r = wc > 0 ? Math.pow(2, wc - 1) : 0;

      for (let j = 1; j <= wc; j++) {
        s[cn + j] = (s[cn + j] || 0) + ((s[cn] || 0) + 1);
      }
      // console.log(l, cn, r, (s[cn] || 0) + 1);

      return (s[cn] || 0) + 1;
    })
    .reduce((r, lr) => r + lr, 0);

  let rr = 0;
  for (const cn in s) {
    rr += s[cn];
  }

  return r;
}

describe('AoC-4', () => {
  test('utils', () => {
    // expect(1).toEqual(1);
  });

  test('test', () => {
    expect(
      calculate(`
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
      `),
    ).toEqual(30);
  });

  test('prod', async () => {
    const inputStr = readFileSync(__dirname + '/aoc-4.input.txt', { encoding: 'utf-8' });
    expect(calculate(inputStr)).toEqual(8477787);
  });
});

/* eslint-enable */
/* eslint no-use-before-define: 2 */ // --> ON
