import { max } from 'lodash';
import { splitLines } from '../../utils/strings';

const tileToPipe = {
  '|': { left: false, right: false, top: true, bottom: true },
  '-': { left: true, right: true, top: false, bottom: false },
  L: { left: false, right: true, top: true, bottom: false },
  J: { left: true, right: false, top: true, bottom: false },
  '7': { left: true, right: false, top: false, bottom: true },
  F: { left: false, right: true, top: false, bottom: true },
  S: { left: false, right: false, top: false, bottom: false },
  '.': { left: false, right: false, top: false, bottom: false },
};

export function calc(input: string) {
  let lines: string[] = splitLines(input);

  let startY = lines.findIndex((line) => line.includes('S'));
  let startX = lines[startY].indexOf('S');

  tileToPipe.S.left = tileToPipe[lines[startY].charAt(startX - 1)]?.right || false;
  tileToPipe.S.right = tileToPipe[lines[startY].charAt(startX + 1)]?.left || false;
  tileToPipe.S.top = tileToPipe[lines[startY - 1]?.charAt(startX)]?.bottom || false;
  tileToPipe.S.bottom = tileToPipe[lines[startY + 1]?.charAt(startX)]?.top || false;

  let xyToPathLength = {};

  let xyPathLengthToCheck = [[startX, startY, 0]];

  while (xyPathLengthToCheck.length > 0) {
    let [x, y, pathLength] = xyPathLengthToCheck.pop();
    let tile = lines[y].charAt(x);
    let pipe = tileToPipe[tile];
    let xy = x + '-' + y;

    if (xyToPathLength[xy] !== undefined && xyToPathLength[xy] < pathLength) {
      continue;
    }

    xyToPathLength[xy] = pathLength;

    if (pipe.left) {
      xyPathLengthToCheck.push([x - 1, y, pathLength + 1]);
    }
    if (pipe.right) {
      xyPathLengthToCheck.push([x + 1, y, pathLength + 1]);
    }
    if (pipe.bottom) {
      xyPathLengthToCheck.push([x, y + 1, pathLength + 1]);
    }
    if (pipe.top) {
      xyPathLengthToCheck.push([x, y - 1, pathLength + 1]);
    }
  }

  // Just pretty output to console ;)
  lines
    .map((line, y) =>
      line
        .split('')
        .map((tile, x) => (xyToPathLength[x + '-' + y] !== undefined ? tile : '.'))
        .join('')
        .replace(/F/g, '╭')
        .replace(/-/g, '─')
        .replace(/L/g, '╰')
        .replace(/\|/g, '│')
        .replace(/J/g, '╯')
        .replace(/7/g, '╮'),
    )
    .forEach((line) => console.info(line));

  return max(Object.values(xyToPathLength));
}
