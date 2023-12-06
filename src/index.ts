import { readFileSync } from 'fs';

const [year, day, part] = process.argv.slice(2);

const inputTest = readFileSync(`${year}/${day}/aoc-${year}-${day}-input-test.txt`, { encoding: 'utf-8' });
const input = readFileSync(`${year}/${day}/aoc-${year}-${day}-input.txt`, { encoding: 'utf-8' });

const solution = require(`./${year}/${day}/aoc-${year}-${day}-part-${part}-solution`);

console.info('calc(TEST_INPUT) =', solution.calc(inputTest));
console.info('calc(INPUT) =', solution.calc(input));
