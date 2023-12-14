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

  let tilesInsideCount = 0;

  for (let y = 0; y < lines.length; y++) {
    let isCrossedFromTop = false;
    let isCrossedFromBottom = false;

    for (let x = 0; x < lines[y].length; x++) {
      let tile = lines[y].charAt(x);
      let pipe = tileToPipe[tile];
      let xy = x + '-' + y;
      const isFreeTile = xyToPathLength[xy] === undefined;

      if (isFreeTile) {
        if (isCrossedFromTop && isCrossedFromBottom) {
          tilesInsideCount++;
        }
      } else {
        if (pipe.top) {
          isCrossedFromTop = !isCrossedFromTop;
        }
        if (pipe.bottom) {
          isCrossedFromBottom = !isCrossedFromBottom;
        }
      }
    }
  }

  return tilesInsideCount;
}
