import { readFileSync } from 'fs';

function reverseString(str: string) {
  return str.split('').reverse().join('');
}

function getFirstRawDigit(str: string) {
  return str.match(/(\d|one|two|three|four|five|six|seven|eight|nine|zero)/gi)![0];
}

function getLastRawDigit(str: string) {
  return reverseString(reverseString(str).match(/(\d|eno|owt|eerht|ruof|evif|xis|neves|thgie|enin|orez)/gi)![0]);
}

function rawDigitToDigitStr(rawDigit: string) {
  switch (rawDigit) {
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
    case '0':
      return rawDigit;
    case 'one':
      return '1';
    case 'two':
      return '2';
    case 'three':
      return '3';
    case 'four':
      return '4';
    case 'five':
      return '5';
    case 'six':
      return '6';
    case 'seven':
      return '7';
    case 'eight':
      return '8';
    case 'nine':
      return '9';
    case 'zero':
      return '0';
    default:
      throw new Error(`Unknown raw digit: ${rawDigit}.`);
  }
}

function calculateCalibrationValue(str: string) {
  return Number(rawDigitToDigitStr(getFirstRawDigit(str)) + rawDigitToDigitStr(getLastRawDigit(str)));
}

function calculateCalibrationValuesSum(str: string) {
  return str
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => !!line)
    .map(calculateCalibrationValue)
    .reduce((calibrationValueSum, calibrationValue) => calibrationValueSum + calibrationValue, 0);
}

describe('AoC-1', () => {
  test('test', () => {
    expect(calculateCalibrationValue('1abc2')).toEqual(12);
    expect(calculateCalibrationValue('pqr3stu8vwx')).toEqual(38);
    expect(calculateCalibrationValue('a1b2c3d4e5f')).toEqual(15);
    expect(calculateCalibrationValue('treb7uchet')).toEqual(77);

    expect(
      calculateCalibrationValuesSum(`
        i1abc2
        pqr3stu8vwx
        a1b2c3d4e5f
        treb7uchet
      `),
    ).toEqual(142);

    expect(calculateCalibrationValue('two1nine')).toEqual(29);
    expect(calculateCalibrationValue('eightwothree')).toEqual(83);
    expect(calculateCalibrationValue('abcone2threexyz')).toEqual(13);
    expect(calculateCalibrationValue('xtwone3four')).toEqual(24);
    expect(calculateCalibrationValue('4nineeightseven2')).toEqual(42);
    expect(calculateCalibrationValue('zoneight234')).toEqual(14);
    expect(calculateCalibrationValue('7pqrstsixteen')).toEqual(76);

    expect(
      calculateCalibrationValuesSum(`
        two1nine
        eightwothree
        abcone2threexyz
        xtwone3four
        4nineeightseven2
        zoneight234
        7pqrstsixteen
      `),
    ).toEqual(281);

    expect(calculateCalibrationValue('eightwo')).toEqual(82);
  });

  test('prod', async () => {
    const calibrationDocument = readFileSync(__dirname + '/aoc-1.calibration-document.txt', { encoding: 'utf-8' });
    expect(calculateCalibrationValuesSum(calibrationDocument)).toEqual(54100);
  });
});
