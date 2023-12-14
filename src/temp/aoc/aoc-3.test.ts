import { readFileSync } from 'fs';

function calculate(inputStr: string) {
  return inputStr
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .map((line, lineIndex, lines) => {
      const normalizedLine = `.${line}.`;
      const normalizedPreviousLine = `.${lineIndex > 0 ? lines[lineIndex - 1] : '.'.repeat(line.length)}.`;
      const normalizedNextLine = `.${lineIndex < lines.length - 1 ? lines[lineIndex + 1] : '.'.repeat(line.length)}.`;
      return [...normalizedLine.matchAll(/\d+/g)]
        .map((numberMatch) => {
          const matchedNumberStr = numberMatch[0];
          const matchedNumber = +matchedNumberStr;
          const matchedNumberLength = matchedNumberStr.length;
          const matchedNumberIndex = numberMatch.index as number;

          let sorroundChars = '';
          sorroundChars += normalizedLine[matchedNumberIndex - 1];
          sorroundChars += normalizedPreviousLine.substring(
            matchedNumberIndex - 1,
            matchedNumberIndex + matchedNumberLength + 1,
          );
          sorroundChars += normalizedLine[matchedNumberIndex + matchedNumberLength];
          sorroundChars += normalizedNextLine.substring(
            matchedNumberIndex - 1,
            matchedNumberIndex + matchedNumberLength + 1,
          );

          const sorroundingSymbols = sorroundChars.replaceAll(/\d/g, '').replaceAll('.', '');

          // console.log(line, matchedNumber, matchedNumberIndex, matchedNumberLength, sorroundChars, sorroundingSymbols);

          return sorroundingSymbols.length > 0 ? matchedNumber : 0;
        })
        .reduce((numberSum, partNumber) => numberSum + partNumber, 0);
    })
    .reduce((result, lineResult) => result + lineResult, 0);
}

function calculate2(inputStr: string) {
  const gearIndexStrToPartNumbers = {};

  function addGearPartNumber(line, column, number) {
    const arr = gearIndexStrToPartNumbers[`${line}:${column}`] || [];
    arr.push(number);
    gearIndexStrToPartNumbers[`${line}:${column}`] = arr;
  }

  inputStr
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .forEach((line, lineIndex, lines) => {
      const normalizedLine = `.${line}.`;

      const previousLineIndex = lineIndex - 1;
      const normalizedPreviousLine = `.${lineIndex > 0 ? lines[previousLineIndex] : '.'.repeat(line.length)}.`;

      const nextLineIndex = lineIndex + 1;
      const normalizedNextLine = `.${lineIndex < lines.length - 1 ? lines[nextLineIndex] : '.'.repeat(line.length)}.`;

      return [...normalizedLine.matchAll(/\d+/g)].forEach((numberMatch) => {
        const matchedNumberStr = numberMatch[0];
        const matchedNumber = +matchedNumberStr;
        const matchedNumberLength = matchedNumberStr.length;
        const matchedNumberIndex = numberMatch.index as number;

        let sorroundChars = '';
        sorroundChars += normalizedLine[matchedNumberIndex - 1];
        sorroundChars += normalizedPreviousLine.substring(
          matchedNumberIndex - 1,
          matchedNumberIndex + matchedNumberLength + 1,
        );
        sorroundChars += normalizedLine[matchedNumberIndex + matchedNumberLength];
        sorroundChars += normalizedNextLine.substring(
          matchedNumberIndex - 1,
          matchedNumberIndex + matchedNumberLength + 1,
        );

        const sorroundingSymbols = sorroundChars.replaceAll(/\d/g, '').replaceAll('.', '');
        const isPartNumber = sorroundingSymbols.length;

        if (!isPartNumber) {
          return;
        }

        if (normalizedLine[matchedNumberIndex - 1] === '*') {
          addGearPartNumber(lineIndex, matchedNumberIndex - 1, matchedNumber);
        }
        if (normalizedLine[matchedNumberIndex + matchedNumberLength] === '*') {
          addGearPartNumber(lineIndex, matchedNumberIndex + matchedNumberLength, matchedNumber);
        }
        for (let i = matchedNumberIndex - 1; i <= matchedNumberIndex + matchedNumberLength; i++) {
          if (normalizedPreviousLine[i] === '*') {
            addGearPartNumber(previousLineIndex, i, matchedNumber);
          }
          if (normalizedNextLine[i] === '*') {
            addGearPartNumber(nextLineIndex, i, matchedNumber);
          }
        }

        // console.log(line, matchedNumber, matchedNumberIndex, matchedNumberLength, sorroundChars, sorroundingSymbols);
      });
    });

  // console.info(gearIndexStrToPartNumbers);

  let result = 0;

  for (const gearIndexStr in gearIndexStrToPartNumbers) {
    const partNumbers = gearIndexStrToPartNumbers[gearIndexStr];
    if (partNumbers.length === 2) {
      result += partNumbers[0] * partNumbers[1];
    }
  }

  return result;
}

describe('AoC-2', () => {
  test('utils', () => {
    // expect(1).toEqual(1);
  });

  test('test', () => {
    expect(
      calculate2(`
        467..114..
        ...*......
        ..35..633.
        ......#...
        617*......
        .....+.58.
        ..592.....
        ......755.
        ...$.*....
        .664.598..
      `),
    ).toEqual(467835);
  });

  test('prod', async () => {
    const inputStr = readFileSync(__dirname + '/aoc-3.input.txt', { encoding: 'utf-8' });
    expect(calculate2(inputStr)).toEqual(78272573);
  });
});
