import { readFileSync } from 'fs';

let numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
let numbers2 = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

function calc(input: string) {
  return input
    .trim()
    .split('\n')
    .map((line) => {
      let left;
      let right;

      for (let i = 0; i < line.length; i++) {
        for (let j = 0; j < numbers.length; j++) {
          if (left === undefined && (line.slice(i).startsWith(numbers[j]) || line.slice(i).startsWith(numbers2[j]))) {
            left = j;
          }
          if (
            right === undefined &&
            (line.slice(-1 - i).startsWith(numbers[j]) || line.slice(-1 - i).startsWith(numbers2[j]))
          ) {
            right = j;
          }
        }
      }

      return 10 * left + right;
    })
    .reduce((sum, r) => sum + r, 0);
}

console.info(
  calc(`
two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen
`),
);

const input = readFileSync(__dirname + '/aoc-1.input.txt', { encoding: 'utf-8' });
console.log(calc(input));
