export function calc(input: string) {
  const [times, distances]: number[][] = input
    .trim()
    .split('\n')
    .map((line) => line.split(/:\s+/)[1].split(/\s+/).map(Number));

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
