import { uniq } from 'lodash';
import { initArray } from '../../utils/arrays';
import { splitLines, splitSpaced } from '../../utils/strings';

export function calc(input: string) {
  let lines = splitLines(input);

  let row = 0;
  let col = 0;

  let uniqRows = [];
  let uniqCols = [];

  lines.forEach((l, li, ls) => {
    let [dirStr, stepsStr, color] = splitSpaced(l);
    let steps = parseInt(color.substring(2, 7), 16);
    // let steps = Number(stepsStr);

    switch (color.charAt(7)) {
      case '0':
        dirStr = 'R';
        break;
      case '1':
        dirStr = 'D';
        break;
      case '2':
        dirStr = 'L';
        break;
      case '3':
        dirStr = 'U';
        break;
    }

    switch (dirStr) {
      case 'U':
        row -= steps;
        uniqRows.push(row);
        break;
      case 'D':
        row += steps;
        uniqRows.push(row);
        break;
      case 'L':
        col -= steps;
        uniqCols.push(col);
        break;
      case 'R':
        col += steps;
        uniqCols.push(col);
        break;
    }

    console.log(l, dirStr, steps, row, col);
  });

  uniqRows = uniq(uniqRows).sort((a, b) => a - b);
  uniqCols = uniq(uniqCols).sort((a, b) => a - b);

  console.log(uniqRows);
  console.log(uniqCols);

  let rowToRowIndex = {};
  let colToColIndex = {};
  uniqRows.forEach((row, rowIndex) => (rowToRowIndex[row] = rowIndex));
  uniqCols.forEach((col, colIndex) => (colToColIndex[col] = colIndex));

  console.log(rowToRowIndex);
  console.log(colToColIndex);

  let m = initArray(uniqRows.length * 3, () => initArray(uniqCols.length * 3, () => 2));

  row = 0;
  col = 0;
  let rowIndex = 0;
  let colIndex = 0;

  lines.forEach((l, li, ls) => {
    let [dirStr, stepsStr, color] = splitSpaced(l);
    let steps = parseInt(color.substring(2, 7), 16);
    // let steps = Number(stepsStr);

    switch (color.charAt(7)) {
      case '0':
        dirStr = 'R';
        break;
      case '1':
        dirStr = 'D';
        break;
      case '2':
        dirStr = 'L';
        break;
      case '3':
        dirStr = 'U';
        break;
    }

    switch (dirStr) {
      case 'U':
        for (let i = 3 * rowToRowIndex[row] + 0; i >= 3 * rowToRowIndex[row - steps] + 1; i--) {
          m[i][3 * colToColIndex[col] + 1] = 1;
        }
        row -= steps;
        break;
      case 'D':
        for (let i = 3 * rowToRowIndex[row] + 2; i <= 3 * rowToRowIndex[row + steps] + 1; i++) {
          m[i][3 * colToColIndex[col] + 1] = 1;
        }
        row += steps;
        break;
      case 'L':
        for (let i = 3 * colToColIndex[col] + 0; i >= 3 * colToColIndex[col - steps] + 1; i--) {
          m[3 * rowToRowIndex[row] + 1][i] = 1;
        }
        col -= steps;
        break;
      case 'R':
        for (let i = 3 * colToColIndex[col] + 2; i <= 3 * colToColIndex[col + steps] + 1; i++) {
          m[3 * rowToRowIndex[row] + 1][i] = 1;
        }
        col += steps;
        break;
    }

    // m[3 * rowToRowIndex[row] + 1][3 * colToColIndex[col] + 1] = 1;

    console.log(l, dirStr, steps, row, col);
  });

  let fill = [[0, 0]];

  while (fill.length > 0) {
    [row, col] = fill.pop();

    if (m?.[row]?.[col] !== 2) {
      continue;
    }

    m[row][col] = 0;
    fill.push([row - 1, col]);
    fill.push([row + 1, col]);
    fill.push([row, col - 1]);
    fill.push([row, col + 1]);
  }

  m.forEach((l) => console.log(l.map((c) => (c == 0 ? '.' : c == 1 ? '#' : '*')).join('')));

  let result = 0;

  let rowColIndexDotAdded = {};
  let hEdgeAdded = {};
  let vEdgeAdded = {};

  // let prevRowBlockWasFilled = false;
  //
  for (rowIndex = 1; rowIndex < uniqRows.length; rowIndex++) {
    //   let prevColumnBlockWasFilled = false;
    for (colIndex = 1; colIndex < uniqCols.length; colIndex++) {
      let pMCol = 3 * (colIndex - 1) + 1;
      let mCol = 3 * colIndex + 1;
      let pMRow = 3 * (rowIndex - 1) + 1;
      let mRow = 3 * rowIndex + 1;

      let isFilled = true;

      for (let c = pMCol; isFilled && c <= mCol; c++) {
        if (!m[pMRow][c] || !m[mRow][c]) {
          isFilled = false;
        }
      }
      for (let r = pMRow; isFilled && r <= mRow; r++) {
        if (!m[r][pMCol] || !m[r][mCol]) {
          isFilled = false;
        }
      }

      let pCol = uniqCols[colIndex - 1];
      col = uniqCols[colIndex];
      let pRow = uniqRows[rowIndex - 1];
      row = uniqRows[rowIndex];

      if (!isFilled) {
        console.info('[]', pCol, col, pRow, row, isFilled);
        continue;
      }

      let cellResult = (col - pCol - 1) * (row - pRow - 1);

      let dotKey = (rowIndex << 14) + colIndex;
      if (!rowColIndexDotAdded[dotKey]) {
        cellResult++;
        rowColIndexDotAdded[dotKey] = true;
      }
      dotKey = (rowIndex << 14) + colIndex - 1;
      if (!rowColIndexDotAdded[dotKey]) {
        cellResult++;
        rowColIndexDotAdded[dotKey] = true;
      }
      dotKey = ((rowIndex - 1) << 14) + colIndex - 1;
      if (!rowColIndexDotAdded[dotKey]) {
        cellResult++;
        rowColIndexDotAdded[dotKey] = true;
      }
      dotKey = ((rowIndex - 1) << 14) + colIndex;
      if (!rowColIndexDotAdded[dotKey]) {
        cellResult++;
        rowColIndexDotAdded[dotKey] = true;
      }

      let vEdgeKey = colIndex - 1 + '=' + (rowIndex - 1) + '=' + rowIndex;
      if (!vEdgeAdded[vEdgeKey]) {
        cellResult += row - pRow - 1;
        vEdgeAdded[vEdgeKey] = true;
      }
      vEdgeKey = colIndex + '=' + (rowIndex - 1) + '=' + rowIndex;
      if (!vEdgeAdded[vEdgeKey]) {
        cellResult += row - pRow - 1;
        vEdgeAdded[vEdgeKey] = true;
      }
      let hEdgeKey = rowIndex - 1 + '=' + (colIndex - 1) + '=' + colIndex;
      if (!hEdgeAdded[hEdgeKey]) {
        cellResult += col - pCol - 1;
        hEdgeAdded[hEdgeKey] = true;
      }
      hEdgeKey = rowIndex + '=' + (colIndex - 1) + '=' + colIndex;
      if (!hEdgeAdded[hEdgeKey]) {
        cellResult += col - pCol - 1;
        hEdgeAdded[hEdgeKey] = true;
      }

      result += cellResult;

      console.info('[]', pCol, col, pRow, row, isFilled, cellResult);

      //     let cChar = m?.[rowIndex * 3 + 1]?.[colIndex * 3 + 1];
      //     let uChar = m?.[(rowIndex - 1) * 3 + 1]?.[colIndex * 3 + 1] || 0;
      //     let lChar = m?.[rowIndex * 3 + 1]?.[(colIndex - 1) * 3 + 1] || 0;
      //     // let cFilled = cChar === 1 || cChar === 0;
      //
      //     console.log(rowIndex, colIndex, cChar, lChar, uChar);
    }
  }

  return result;
}
