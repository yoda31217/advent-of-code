export function calc(input: string) {
  const [time, distance]: number[] = input
    .trim()
    .split('\n')
    .map((line) => line.split(/:/)[1])
    .map((line) => line.replace(/\s+/g, ''))
    .map(Number);

  let waysToWinCount: number = 0;

  for (let i = 0; i <= time; i++) {
    if ((time - i) * i >= distance) {
      waysToWinCount++;
    }
  }

  return waysToWinCount;
}
