export function calc(input: string) {
  let times = input
    .split('\n')[0]
    .split(':')[1]
    .trim()
    .split(/\s+/)
    .map((s) => +s.trim());
  let distances = input
    .split('\n')[1]
    .split(':')[1]
    .trim()
    .split(/\s+/)
    .map((s) => +s.trim());

  return times
    .map((time, index) => {
      let distance = distances[index];

      let waysToWinCount = 0;

      for (let i = 0; i <= time; i++) {
        if ((time - i) * i >= distance) {
          waysToWinCount++;
        }
      }

      return waysToWinCount;
    })
    .reduce((result, waysToWinCount) => result * waysToWinCount, 1);
}
