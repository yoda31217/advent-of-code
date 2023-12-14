import { readFileSync } from 'fs';

let numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

function calc(input: string) {
  return input
    .trim()
    .split('\n')
    .map((line) => {
      let left;
      let right;

      for (let i = 0; i < line.length; i++) {
        for (let j = 0; j < numbers.length; j++) {
          if (left === undefined && line.slice(i).startsWith(numbers[j])) {
            left = j;
          }
          if (right === undefined && line.slice(-1 - i).startsWith(numbers[j])) {
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
1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet
`),
);

const input = readFileSync(__dirname + '/aoc-1.input.txt', { encoding: 'utf-8' });
console.log(calc(input));
