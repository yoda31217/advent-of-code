let numbers: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
let numbers2: string[] = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

export function calc(input: string) {
  return input
    .trim()
    .split('\n')
    .map((line: string) => {
      let calibrationValueLeftDigit: number | undefined = undefined;
      let calibrationValueRightDigit: number | undefined = undefined;

      for (let i = 0; i < line.length; i++) {
        for (let j = 0; j < numbers.length; j++) {
          if (
            calibrationValueLeftDigit === undefined &&
            (line.slice(i).startsWith(numbers[j]) || line.slice(i).startsWith(numbers2[j]))
          ) {
            calibrationValueLeftDigit = j;
          }
          if (
            calibrationValueRightDigit === undefined &&
            (line.slice(-1 - i).startsWith(numbers[j]) || line.slice(-1 - i).startsWith(numbers2[j]))
          ) {
            calibrationValueRightDigit = j;
          }
        }
      }

      return 10 * calibrationValueLeftDigit + calibrationValueRightDigit;
    })
    .reduce((result, calibrationValue) => result + calibrationValue, 0);
}
