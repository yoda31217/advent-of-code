export function calc(input: string) {
  let times: number[] = input
    .split('\n')[0]
    .split(':')[1]
    .trim()
    .split(/\s+/)
    .map((s) => +s.trim());

  let distances: number[] = input
    .split('\n')[1]
    .split(':')[1]
    .trim()
    .split(/\s+/)
    .map((s) => +s.trim());

  return times
    .map((time: number, index: number) => {
      let distance: number = distances[index];

      let waysToWinCount: number = 0;

      for (let i = 0; i <= time; i++) {
        if ((time - i) * i >= distance) {
          waysToWinCount++;
        }
      }

      return waysToWinCount;
    })
    .reduce((result: number, waysToWinCount: number) => result * waysToWinCount, 1);
}
