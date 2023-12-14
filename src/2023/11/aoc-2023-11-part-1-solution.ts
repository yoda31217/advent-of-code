import { add, difference, inRange, isEqual, nthArg, partial, partialRight, range, spread, unary } from 'lodash';
import { biCombinations } from '../../utils/mathes';
import { gridify, splitLines } from '../../utils/strings';

export function calc(input: string) {
  let emptyExpansionRate = 2;

  let lines: string[] = splitLines(input);

  let galaxies = gridify(lines).filter(spread(partial(isEqual, '#')));

  let notEmptyXs = galaxies.map(spread(nthArg(1)));
  let notEmptyYs = galaxies.map(spread(nthArg(2)));
  let emptyXs = difference(range(lines[0].length), notEmptyXs);
  let emptyYs = difference(range(lines.length), notEmptyYs);

  return biCombinations(galaxies)
    .map(([[, galaxyIx, galaxyIy], [, galaxyJx, galaxyJy]]) => {
      let crossedEmptyXs = emptyXs.filter(unary(partialRight(inRange, galaxyIx, galaxyJx)));
      let crossedEmptyYs = emptyYs.filter(unary(partialRight(inRange, galaxyIy, galaxyJy)));

      return (
        Math.abs(galaxyIx - galaxyJx) +
        Math.abs(galaxyIy - galaxyJy) +
        crossedEmptyXs.length * (emptyExpansionRate - 1) +
        crossedEmptyYs.length * (emptyExpansionRate - 1)
      );
    })
    .reduce(add, 0);
}
