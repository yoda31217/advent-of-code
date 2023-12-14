import { readFileSync } from 'fs';

const [year, day, part, input] = process.argv.slice(2);

const inputStr = readFileSync(`${year}/${day}/aoc-${year}-${day}-${input}.txt`, { encoding: 'utf-8' });
const solution = require(`./${year}/${day}/aoc-${year}-${day}-part-${part}-solution`);

console.info(`calc() =`, solution.calc(inputStr));
