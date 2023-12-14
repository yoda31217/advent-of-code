import { add } from 'lodash';
import { splitBlocks, transpose } from '../../utils/strings';

function findReflectionLineNumber(lines: string[]) {
  for (let rowBase = 0; rowBase < lines.length - 1; rowBase++) {
    let differenceDetected = false;
    let rowOffset = -1;

    while (true) {
      rowOffset++;
      let row0 = rowBase - rowOffset;
      let row1 = rowBase + 1 + rowOffset;

      if (row0 < 0) {
        break;
      }
      if (row1 >= lines.length) {
        break;
      }
      if (differenceDetected) {
        break;
      }

      for (let charIndex = 0; charIndex < lines[0].length; charIndex++) {
        if (lines[row0].charAt(charIndex) !== lines[row1].charAt(charIndex)) {
          differenceDetected = true;
        }
      }
    }

    if (!differenceDetected) {
      return rowBase + 1;
    }
  }

  return 0;
}

export function calc(input: string) {
  return splitBlocks(input)
    .map((lines) => findReflectionLineNumber(lines) * 100 + findReflectionLineNumber(transpose(lines)))
    .reduce(add, 0);
}
