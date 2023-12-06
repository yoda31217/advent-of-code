let numbers: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
let numbers2: string[] = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

export function calc(input: string) {
  return input
    .trim()
    .split('\n')
    .map((line: string) => {
      let leftDigit: number | undefined = undefined;
      let rightDigit: number | undefined = undefined;

      for (let i = 0; i < line.length; i++) {
        for (let j = 0; j < numbers.length; j++) {
          if (
            leftDigit === undefined &&
            (line.slice(i).startsWith(numbers[j]) || line.slice(i).startsWith(numbers2[j]))
          ) {
            leftDigit = j;
          }
          if (
            rightDigit === undefined &&
            (line.slice(-1 - i).startsWith(numbers[j]) || line.slice(-1 - i).startsWith(numbers2[j]))
          ) {
            rightDigit = j;
          }
        }
      }

      return 10 * leftDigit + rightDigit;
    })
    .reduce((sum, r) => sum + r, 0);
}
