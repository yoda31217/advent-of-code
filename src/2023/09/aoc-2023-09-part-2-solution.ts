import { add, first, initial, last, some, spread, subtract, tail, zip } from 'lodash';
import { biFlip } from '../../utils/mathes';
import { splitLines, splitSpacedNumbers } from '../../utils/strings';

export function calc(input: string) {
  return splitLines(input)
    .map((line) => {
      let histories = [splitSpacedNumbers(line)];
      while (some(last(histories))) {
        histories.push(zip(tail(last(histories)), initial(last(histories))).map(spread(subtract)));
      }
      return histories.reverse().map(first).reduce(biFlip(subtract), 0);
    })
    .reduce(add, 0);
}
