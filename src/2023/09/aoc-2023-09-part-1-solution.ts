import { add, initial, last, some, spread, subtract, tail, zip } from 'lodash';
import { splitLines, splitSpacedNumbers } from '../../utils/strings';

export function calc(input: string) {
  return splitLines(input)
    .map((line) => {
      let histories = [splitSpacedNumbers(line)];
      while (some(last(histories))) {
        histories.push(zip(tail(last(histories)), initial(last(histories))).map(spread(subtract)));
      }
      return histories.reverse().map(last).reduce(add, 0);
    })
    .reduce(add, 0);
}
