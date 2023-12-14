import { info } from 'console';

export function calc(input: string) {
  let s = {};

  let instructions = input.trim().split('\n\n')[0].split('');
  let nameToNode = {};
  input
    .trim()
    .split('\n')
    .slice(2)
    .map((s) => s.trim())
    .forEach((line) => {
      let name = line.split('=')[0].trim();
      let left = line.split('(')[1].split(',')[0].trim();
      let right = line.split(',')[1].split(')')[0].trim();
      nameToNode[name] = { name, L: left, R: right };
    });

  info(instructions, nameToNode);

  let current = 'AAA';
  let iterations = 0;

  while (current !== 'ZZZ') {
    iterations++;
    for (let i = 0; i < instructions.length; i++) {
      const instration = instructions[i];
      current = nameToNode[current][instration];
    }
  }

  return iterations * instructions.length;
}
