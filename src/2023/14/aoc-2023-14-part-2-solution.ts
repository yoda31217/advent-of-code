import { zip } from 'lodash';
import { splitLines } from '../../utils/strings';

function north(grid) {
  let freeRows = new Array(grid[0].length).fill(0);

  for (let lineIndex = 0; lineIndex < grid.length; lineIndex++) {
    let line = grid[lineIndex];
    for (let i = 0; i < line.length; i++) {
      let c = line[i];

      if (c === '.') {
      } else if (c === 'O') {
        grid[lineIndex][i] = '.';
        grid[freeRows[i]][i] = 'O';
        freeRows[i]++;
      } else {
        freeRows[i] = lineIndex + 1;
      }
    }
  }
}

function cycle(grid) {
  north(grid);

  grid = zip(...grid);
  north(grid);

  grid.forEach((line) => {
    line.reverse();
  });
  grid = zip(...grid);
  north(grid);

  grid.forEach((line) => {
    line.reverse();
  });
  grid = zip(...grid);
  north(grid);

  grid.forEach((line) => {
    line.reverse();
  });
  grid = zip(...grid);
  grid.forEach((line) => {
    line.reverse();
  });

  return grid;
}

function score(grid) {
  let r = 0;

  for (let lineIndex = 0; lineIndex < grid.length; lineIndex++) {
    let line = grid[lineIndex];
    for (let i = 0; i < line.length; i++) {
      let c = line[i];
      if (c === 'O') {
        r += grid.length - lineIndex;
      }
    }
  }

  return r;
}

export function calc(input: string) {
  let lines = splitLines(input);

  let freeRows = new Array(lines[0].length).fill(0);

  let grid = lines.map((s) => s.split(''));

  let was = {};

  for (let i = 0; i < 500; i++) {
    grid = cycle(grid);
    console.log(i + 1, score(grid));

    let mapstr = grid.map((l) => l.join('')).join('\n');
    // console.log('\n' + mapstr);

    if (was[mapstr] !== undefined) {
      console.log('cycle', i - was[mapstr], 'offset', was[mapstr]);
    }

    was[mapstr] = i;
  }

  //
  //
  //
  //
  //
  // return lines
  //   .map((line, lineIndex) => {
  //     let r = 0;
  //
  //     for (let i = 0; i < line.length; i++) {
  //       let c = line.charAt(i);
  //       if (c === '.') {
  //       } else if (c === 'O') {
  //         r += lines.length - freeRows[i];
  //         freeRows[i]++;
  //       } else {
  //         freeRows[i] = lineIndex + 1;
  //       }
  //     }
  //
  //     return r;
  //   })
  //   .reduce(add, 0);
}
