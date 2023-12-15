import { add } from 'lodash';
import { splitLines } from '../../utils/strings';

export function calc(input: string) {
  let lines = splitLines(input);

  let nextFreeLineIndex = new Array(lines[0].length).fill(0);

  return lines
    .map((line, lineIndex) => {
      let loadAmount = 0;

      for (let column = 0; column < line.length; column++) {
        let char = line.charAt(column);

        if (char === 'O') {
          loadAmount += lines.length - nextFreeLineIndex[column];
          nextFreeLineIndex[column]++;
        } else if (char === '#') {
          nextFreeLineIndex[column] = lineIndex + 1;
        }
      }

      return loadAmount;
    })
    .reduce(add, 0);
}
