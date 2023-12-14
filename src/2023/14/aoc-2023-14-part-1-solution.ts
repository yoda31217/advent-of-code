import { add } from 'lodash';
import { splitLines } from '../../utils/strings';

export function calc(input: string) {
  let lines = splitLines(input);

  let freeRows = new Array(lines[0].length).fill(0);

  return lines
    .map((line, lineIndex) => {
      let r = 0;

      for (let i = 0; i < line.length; i++) {
        let c = line.charAt(i);
        if (c === '.') {
        } else if (c === 'O') {
          r += lines.length - freeRows[i];
          freeRows[i]++;
        } else {
          freeRows[i] = lineIndex + 1;
        }
      }

      return r;
    })
    .reduce(add, 0);
}
